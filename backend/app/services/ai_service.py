"""
AquaSafe AI - AI Remediation Advisory Service
Integrates with LLM providers (Gemini / OpenAI / Groq) when API keys are configured,
and provides a deterministic, WHO-aligned Expert Heuristic Engine fallback when offline.
"""

import os
import json
import httpx
from typing import Dict, Any, List
from ..config import settings
from ..models.schemas import (
    WaterSampleInput,
    PredictionResult,
    RemediationPlan,
    TreatmentStep
)

class AIService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.groq_key = settings.GROQ_API_KEY
        self.provider_mode = settings.AI_PROVIDER

    async def generate_remediation_plan(
        self,
        sample: WaterSampleInput,
        prediction: PredictionResult
    ) -> RemediationPlan:
        """
        Attempts to call a live LLM if credentials exist.
        Otherwise, transparently executes the WHO Expert Heuristic Engine.
        """
        # Try Live Gemini if configured
        if self.gemini_key and self.provider_mode in ("auto", "gemini"):
            try:
                plan = await self._call_gemini_api(sample, prediction)
                if plan:
                    return plan
            except Exception as e:
                print(f"[-] Gemini API call failed: {e}. Falling back to WHO Expert Engine.")

        # Try Live OpenAI if configured
        if self.openai_key and self.provider_mode in ("auto", "openai"):
            try:
                plan = await self._call_openai_api(sample, prediction)
                if plan:
                    return plan
            except Exception as e:
                print(f"[-] OpenAI API call failed: {e}. Falling back to WHO Expert Engine.")

        # Try Live Groq if configured
        if self.groq_key and self.provider_mode in ("auto", "groq"):
            try:
                plan = await self._call_groq_api(sample, prediction)
                if plan:
                    return plan
            except Exception as e:
                print(f"[-] Groq API call failed: {e}. Falling back to WHO Expert Engine.")

        # Deterministic WHO Expert Heuristic Engine (Offline Fallback)
        return self._generate_expert_heuristic_plan(sample, prediction)

    async def _call_gemini_api(self, sample: WaterSampleInput, prediction: PredictionResult) -> RemediationPlan:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
        prompt = self._build_prompt(sample, prediction)
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(raw_text)
                return self._parse_json_to_plan(parsed, provider="Live AI (Google Gemini 1.5 Flash)", is_live=True)
        return None

    async def _call_openai_api(self, sample: WaterSampleInput, prediction: PredictionResult) -> RemediationPlan:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        prompt = self._build_prompt(sample, prediction)
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a World Health Organization certified water quality engineer. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["choices"][0]["message"]["content"]
                parsed = json.loads(raw_text)
                return self._parse_json_to_plan(parsed, provider="Live AI (OpenAI GPT-4o-mini)", is_live=True)
        return None

    async def _call_groq_api(self, sample: WaterSampleInput, prediction: PredictionResult) -> RemediationPlan:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json"
        }
        prompt = self._build_prompt(sample, prediction)
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": "You are a WHO certified water engineer. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["choices"][0]["message"]["content"]
                parsed = json.loads(raw_text)
                return self._parse_json_to_plan(parsed, provider="Live AI (Groq Llama-3.1)", is_live=True)
        return None

    def _build_prompt(self, sample: WaterSampleInput, prediction: PredictionResult) -> str:
        return f"""
Analyze the following community water sample according to WHO Guidelines for Drinking-water Quality (4th edition) and generate an engineering remediation plan.

Sample Parameters:
- pH: {sample.ph}
- Hardness: {sample.hardness} mg/L
- Solids (TDS): {sample.solids} ppm
- Chloramines: {sample.chloramines} ppm
- Sulfate: {sample.sulfate} mg/L
- Electrical Conductivity: {sample.conductivity} uS/cm
- Total Organic Carbon: {sample.organic_carbon} ppm
- Trihalomethanes (THMs): {sample.trihalomethanes} ug/L
- Turbidity: {sample.turbidity} NTU
- Water Source: {sample.source_type} ({sample.location_name})

ML Model Diagnostic:
- Potability Status: {"POTABLE" if prediction.is_potable else "NON-POTABLE"} (Probability: {prediction.potability_probability:.2%})
- Water Quality Index (WQI): {prediction.wqi_score}/100 ({prediction.wqi_category})
- Identified Anomalies: {prediction.key_anomalies}

Return a valid JSON object matching this schema:
{{
  "summary": "High-level diagnostic summary explaining water risks and primary pollutants",
  "urgency": "One of: 'Routine Monitoring', 'Precautionary Advisory', 'Urgent Intervention', 'Immediate Boil/Halt Notice'",
  "treatment_steps": [
    {{
      "step_number": 1,
      "title": "Title of action",
      "action": "Specific engineering or chemical action",
      "mechanism": "Scientific explanation of how it treats the water",
      "estimated_cost_tier": "Low / Household or Medium / Community or High / Municipal",
      "target_pollutants": ["List of target parameters"]
    }}
  ],
  "emergency_household_actions": ["Immediate safe actions for families (e.g., boiling, solar disinfection, cloth filtration)"],
  "municipal_infrastructure_recommendations": ["Permanent infrastructure enhancements"],
  "who_target_alignment": ["Applicable UN SDG 6 and 3 targets"]
}}
"""

    def _parse_json_to_plan(self, data: Dict[str, Any], provider: str, is_live: bool) -> RemediationPlan:
        steps = []
        for idx, s in enumerate(data.get("treatment_steps", []), 1):
            steps.append(TreatmentStep(
                step_number=s.get("step_number", idx),
                title=s.get("title", f"Remediation Step {idx}"),
                action=s.get("action", ""),
                mechanism=s.get("mechanism", ""),
                estimated_cost_tier=s.get("estimated_cost_tier", "Medium / Community"),
                target_pollutants=s.get("target_pollutants", [])
            ))

        return RemediationPlan(
            summary=data.get("summary", "Analysis completed."),
            urgency=data.get("urgency", "Urgent Intervention"),
            treatment_steps=steps,
            emergency_household_actions=data.get("emergency_household_actions", []),
            municipal_infrastructure_recommendations=data.get("municipal_infrastructure_recommendations", []),
            who_target_alignment=data.get("who_target_alignment", ["SDG 6.1: Universal Safe Drinking Water"]),
            provider=provider,
            is_live_ai=is_live
        )

    def _generate_expert_heuristic_plan(
        self,
        sample: WaterSampleInput,
        prediction: PredictionResult
    ) -> RemediationPlan:
        """
        Deterministic, WHO-aligned Expert Heuristic Rule Engine.
        Executes without external network calls, producing domain-expert remediation steps.
        """
        steps: List[TreatmentStep] = []
        step_idx = 1
        emergency_actions = []
        infrastructure_actions = []
        urgency = "Routine Monitoring"
        
        # 1. Turbidity / Particulate Intervention
        if sample.turbidity > 5.0:
            urgency = "Immediate Boil/Halt Notice" if sample.turbidity > 8.0 else "Urgent Intervention"
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Coagulation & Flocculation Pre-treatment",
                action="Dose water with aluminum sulfate (alum, 15-30 mg/L) or pulverized Moringa oleifera seed cake. Agitate rapidly for 2 minutes, then slowly for 10 minutes to agglomerate colloidal flocs.",
                mechanism="Neutralizes electrical charges on suspended colloidal clay and organic matter, enabling rapid sedimentation and clarifying turbidity prior to filtration.",
                estimated_cost_tier="Low / Household",
                target_pollutants=["Turbidity", "Colloidal Silt", "Suspended Microbes"]
            ))
            step_idx += 1
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Multi-Media Dual Sand Filtration",
                action="Pass settled water through a graded sand and anthracite gravel bed filter (flow rate < 5 m/hr).",
                mechanism="Physical mechanical straining captures flocculated micro-particles, reducing turbidity to < 1.0 NTU for effective subsequent disinfection.",
                estimated_cost_tier="Medium / Community",
                target_pollutants=["Turbidity", "Microbial Cysts", "Particulate Iron"]
            ))
            step_idx += 1
            emergency_actions.append("Allow raw water to settle in storage buckets for 4 hours before decanting through a clean multi-layer cotton cloth filter.")

        # 2. pH Imbalance Intervention
        if sample.ph < 6.5:
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Alkalinity Correction & pH Neutralization",
                action="Install a calcium carbonate (calcite) neutralization bed or inject dilute sodium carbonate (soda ash, Na2CO3) solution to elevate pH to 7.2 - 7.6.",
                mechanism="Dissolves benign calcium bicarbonate into the flow stream, neutralizing corrosive hydronium ions and establishing protective piping passivation.",
                estimated_cost_tier="Low / Household",
                target_pollutants=["Acidic pH (<6.5)", "Corrosive Aggressiveness", "Leached Pipe Metals"]
            ))
            step_idx += 1
            infrastructure_actions.append("Install an in-line calcite contact tank at the wellhead pump station to prevent distribution pipe corrosion.")
        elif sample.ph > 8.5:
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Acidic pH Adjustment & Disinfection Optimization",
                action="Dose food-grade citric acid or dilute hydrochloric acid into storage reservoirs to balance pH between 7.0 and 7.4.",
                mechanism="Shifts hypochlorite equilibrium from inactive OCl- to potent germicidal hypochlorous acid (HOCl), restoring disinfectant potency.",
                estimated_cost_tier="Medium / Community",
                target_pollutants=["Alkaline pH (>8.5)", "Chlorination Inefficiency"]
            ))
            step_idx += 1

        # 3. Organic Carbon & Disinfection Byproducts (THMs)
        if sample.trihalomethanes > 80.0 or sample.organic_carbon > 10.0:
            if urgency not in ("Immediate Boil/Halt Notice", "Urgent Intervention"):
                urgency = "Urgent Intervention"
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Granular Activated Carbon (GAC) Adsorption & Stripping",
                action="Direct filtered stream through virgin bituminous coal-based Granular Activated Carbon (GAC) adsorption contactors (Empty Bed Contact Time > 15 min).",
                mechanism="Porous carbon micro-structures chemically adsorb dissolved volatile organic compounds (VOCs) and halogenated trihalomethanes, reducing carcinogenic toxicity.",
                estimated_cost_tier="Medium / Community",
                target_pollutants=["Trihalomethanes (THMs)", "Total Organic Carbon (TOC)", "Pesticide Residues"]
            ))
            step_idx += 1
            emergency_actions.append("Boil water vigorously for 3 minutes in an open pot to volatilize and vent off trihalomethanes before consumption.")

        # 4. Total Dissolved Solids / Sulfate / Conductivity
        if sample.solids > 1000.0 or sample.conductivity > 500.0 or sample.sulfate > 250.0:
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Membrane Desalination & Demineralization (RO / Ion Exchange)",
                action="Deploy low-pressure thin-film composite Reverse Osmosis (TFC-RO) membrane modules or strong acid cation exchange softening beds.",
                mechanism="Applies semi-permeable osmotic barrier filtration exceeding osmotic pressure to reject 98% of dissolved sulfate ions, hardness salts, and mineral solids.",
                estimated_cost_tier="High / Municipal",
                target_pollutants=["Total Dissolved Solids (TDS)", "Sulfate Ions", "Conductivity", "Hardness Minerals"]
            ))
            step_idx += 1
            infrastructure_actions.append("Implement automated membrane brine rejection recycling and solar-powered booster pumps for borehole demineralization.")

        # 5. Pathogen Disinfection (Mandatory if non-potable or high turbidity)
        if not prediction.is_potable or sample.chloramines < 0.5:
            steps.append(TreatmentStep(
                step_number=step_idx,
                title="Final Disinfection Barrier (UV Irradiation or Sodium Hypochlorite)",
                action="Apply free chlorine dosing (1.5-2.0 mg/L sodium hypochlorite with 30-minute contact time) or pass clarified water through 254 nm germicidal UV chamber (>40 mJ/cm2).",
                mechanism="Disrupts pathogenic microbial DNA/RNA chains and cellular membrane integrity, inactivating viral, bacterial, and protozoan vectors.",
                estimated_cost_tier="Low / Household",
                target_pollutants=["Coliform Bacteria", "Viruses", "Cryptosporidium", "Giardia Cysts"]
            ))
            step_idx += 1
            emergency_actions.append("Practice Solar Water Disinfection (SODIS): Fill clean transparent PET bottles and expose to direct sunlight for 6 hours before drinking.")

        # General emergency household fallback
        if not emergency_actions:
            emergency_actions.append("Water parameters are in safe ranges. Maintain clean covered storage containers and re-test quarterly.")

        if not infrastructure_actions:
            infrastructure_actions.append("Establish routine continuous sensor telemetry with automated alert triggers for early pollution warning.")

        if prediction.is_potable:
            summary = (
                f"Water sample from {sample.location_name} complies with primary WHO potability standards (WQI: {prediction.wqi_score:.1f}, Category: {prediction.wqi_category}). "
                "Parameters exhibit low overall toxicological risk. Implement routine preventative monitoring and sanitary seal maintenance."
            )
        else:
            summary = (
                f"Water sample from {sample.location_name} fails WHO potability safety benchmarks (WQI: {prediction.wqi_score:.1f}, Category: {prediction.wqi_category}). "
                f"Significant anomalies detected: {', '.join(prediction.key_anomalies) if prediction.key_anomalies else 'Multivariate chemical imbalance'}. "
                "Direct consumption without treatment poses severe public health risks. Execute the multi-barrier remediation protocol detailed below."
            )

        return RemediationPlan(
            summary=summary,
            urgency=urgency,
            treatment_steps=steps,
            emergency_household_actions=emergency_actions,
            municipal_infrastructure_recommendations=infrastructure_actions,
            who_target_alignment=[
                "UN SDG Target 6.1: Universal and equitable access to safe drinking water",
                "UN SDG Target 6.3: Improving water quality by reducing pollution and hazardous chemicals",
                "UN SDG Target 3.9: Prevention of waterborne disease and chemical toxicity mortality"
            ],
            provider="WHO Expert Heuristic Engine (Deterministic Offline Fallback - API Key Not Configured)",
            is_live_ai=False
        )

ai_service = AIService()
