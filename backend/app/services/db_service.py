"""
AquaSafe AI - SQLite Database Service
Handles persistent storage of water diagnostic assessments, station telemetry, and system analytics.
"""

import os
import sqlite3
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from ..config import settings

class DBService:
    def __init__(self):
        os.makedirs(os.path.dirname(settings.DB_PATH), exist_ok=True)
        self.init_db()
        self.seed_initial_data()

    def get_connection(self):
        conn = sqlite3.connect(settings.DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Assessments table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS assessments (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                location_name TEXT NOT NULL,
                source_type TEXT NOT NULL,
                station_id TEXT,
                ph REAL NOT NULL,
                hardness REAL NOT NULL,
                solids REAL NOT NULL,
                chloramines REAL NOT NULL,
                sulfate REAL NOT NULL,
                conductivity REAL NOT NULL,
                organic_carbon REAL NOT NULL,
                trihalomethanes REAL NOT NULL,
                turbidity REAL NOT NULL,
                potability INTEGER NOT NULL,
                potability_probability REAL NOT NULL,
                risk_level TEXT NOT NULL,
                wqi_score REAL NOT NULL,
                wqi_category TEXT NOT NULL,
                remediation_summary TEXT,
                remediation_urgency TEXT,
                provider TEXT NOT NULL,
                is_live_ai INTEGER NOT NULL,
                full_json TEXT NOT NULL
            )
            """)

            # Monitoring stations table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS stations (
                station_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                source_type TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                status TEXT NOT NULL,
                last_wqi REAL NOT NULL,
                last_tested TEXT NOT NULL,
                samples_count INTEGER NOT NULL
            )
            """)
            conn.commit()

    def seed_initial_data(self):
        """Seed representative community stations and recent telemetry tests if table is empty"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM stations")
            count = cursor.fetchone()[0]
            if count == 0:
                stations_data = [
                    ("STN-001", "Kibera Community Wellhead", "Nairobi District 4", "Deep Borehole", -1.3138, 36.7865, "Critical Alert", 41.2, "2026-10-09T08:30:00Z", 14),
                    ("STN-002", "Maji Safi Municipal Intake", "River Basin Station #2", "Surface River", -1.2864, 36.8172, "Operational", 88.5, "2026-10-09T09:15:00Z", 32),
                    ("STN-003", "St. Jude Primary Rainwater Tank", "East Peri-Urban Zone", "Rainwater Harvest", -1.3020, 36.8400, "Warning", 64.8, "2026-10-08T16:45:00Z", 19),
                    ("STN-004", "Valley Agro-Borehole Station", "Agricultural Perimeter", "Borehole / Well", -1.3500, 36.7200, "Critical Alert", 38.6, "2026-10-09T07:10:00Z", 27),
                    ("STN-005", "Central Hospital Emergency Reserve", "Central Medical Campus", "Municipal Tap Reservoir", -1.2921, 36.8219, "Operational", 94.2, "2026-10-09T10:00:00Z", 45)
                ]
                cursor.executemany("""
                INSERT INTO stations (station_id, name, location, source_type, latitude, longitude, status, last_wqi, last_tested, samples_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, stations_data)
                conn.commit()

            cursor.execute("SELECT COUNT(*) FROM assessments")
            assess_count = cursor.fetchone()[0]
            if assess_count == 0:
                # Seed a few realistic assessments
                demo_samples = [
                    {
                        "id": "ASM-DEMO-01",
                        "created_at": "2026-10-09T08:30:00Z",
                        "location_name": "Kibera Community Wellhead",
                        "source_type": "Deep Borehole",
                        "station_id": "STN-001",
                        "ph": 5.4,
                        "hardness": 260.0,
                        "solids": 28400.0,
                        "chloramines": 3.8,
                        "sulfate": 380.0,
                        "conductivity": 620.0,
                        "organic_carbon": 17.5,
                        "trihalomethanes": 95.0,
                        "turbidity": 6.8,
                        "potability": 0,
                        "potability_probability": 0.12,
                        "risk_level": "Critical Health Hazard",
                        "wqi_score": 41.2,
                        "wqi_category": "Very Poor (25-49)",
                        "remediation_summary": "High acidity, elevated turbidity, and THM exceedance require immediate coagulation, neutralisation, and activated carbon treatment.",
                        "remediation_urgency": "Immediate Boil/Halt Notice",
                        "provider": "WHO Expert Heuristic Engine (Deterministic Offline Fallback)",
                        "is_live_ai": 0
                    },
                    {
                        "id": "ASM-DEMO-02",
                        "created_at": "2026-10-09T09:15:00Z",
                        "location_name": "Maji Safi Municipal Intake",
                        "source_type": "Surface River",
                        "station_id": "STN-002",
                        "ph": 7.3,
                        "hardness": 180.0,
                        "solids": 14200.0,
                        "chloramines": 2.1,
                        "sulfate": 210.0,
                        "conductivity": 360.0,
                        "organic_carbon": 6.8,
                        "trihalomethanes": 38.0,
                        "turbidity": 2.4,
                        "potability": 1,
                        "potability_probability": 0.91,
                        "risk_level": "Low Risk / Safe",
                        "wqi_score": 88.5,
                        "wqi_category": "Good (70-89)",
                        "remediation_summary": "Parameters adhere to WHO safe drinking guidelines. Maintain standard chlorine residual.",
                        "remediation_urgency": "Routine Monitoring",
                        "provider": "WHO Expert Heuristic Engine (Deterministic Offline Fallback)",
                        "is_live_ai": 0
                    },
                    {
                        "id": "ASM-DEMO-03",
                        "created_at": "2026-10-09T10:00:00Z",
                        "location_name": "Central Hospital Emergency Reserve",
                        "source_type": "Municipal Tap Reservoir",
                        "station_id": "STN-005",
                        "ph": 7.4,
                        "hardness": 165.0,
                        "solids": 11500.0,
                        "chloramines": 2.4,
                        "sulfate": 190.0,
                        "conductivity": 310.0,
                        "organic_carbon": 4.2,
                        "trihalomethanes": 28.0,
                        "turbidity": 1.2,
                        "potability": 1,
                        "potability_probability": 0.96,
                        "risk_level": "Low Risk / Safe",
                        "wqi_score": 94.2,
                        "wqi_category": "Excellent (90-100)",
                        "remediation_summary": "Optimal potability metrics across all chemical indicators.",
                        "remediation_urgency": "Routine Monitoring",
                        "provider": "WHO Expert Heuristic Engine (Deterministic Offline Fallback)",
                        "is_live_ai": 0
                    }
                ]
                for s in demo_samples:
                    cursor.execute("""
                    INSERT INTO assessments (
                        id, created_at, location_name, source_type, station_id,
                        ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon,
                        trihalomethanes, turbidity, potability, potability_probability,
                        risk_level, wqi_score, wqi_category, remediation_summary,
                        remediation_urgency, provider, is_live_ai, full_json
                    ) VALUES (
                        :id, :created_at, :location_name, :source_type, :station_id,
                        :ph, :hardness, :solids, :chloramines, :sulfate, :conductivity, :organic_carbon,
                        :trihalomethanes, :turbidity, :potability, :potability_probability,
                        :risk_level, :wqi_score, :wqi_category, :remediation_summary,
                        :remediation_urgency, :provider, :is_live_ai, :id
                    )
                    """, s)
                conn.commit()

    def save_assessment(self, full_data: Dict[str, Any]) -> str:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            assess_id = full_data.get("id") or f"ASM-{uuid.uuid4().hex[:8].upper()}"
            inp = full_data["input"]
            pred = full_data["prediction"]
            rem = full_data["remediation"]
            now_iso = datetime.now(timezone.utc).isoformat()

            cursor.execute("""
            INSERT INTO assessments (
                id, created_at, location_name, source_type, station_id,
                ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon,
                trihalomethanes, turbidity, potability, potability_probability,
                risk_level, wqi_score, wqi_category, remediation_summary,
                remediation_urgency, provider, is_live_ai, full_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                assess_id,
                now_iso,
                inp.get("location_name", "Field Test"),
                inp.get("source_type", "General Sample"),
                inp.get("station_id"),
                inp["ph"],
                inp["hardness"],
                inp["solids"],
                inp["chloramines"],
                inp["sulfate"],
                inp["conductivity"],
                inp["organic_carbon"],
                inp["trihalomethanes"],
                inp["turbidity"],
                pred["potability"],
                pred["potability_probability"],
                pred["risk_level"],
                pred["wqi_score"],
                pred["wqi_category"],
                rem["summary"],
                rem["urgency"],
                rem["provider"],
                1 if rem.get("is_live_ai") else 0,
                json.dumps(full_data)
            ))

            # Update station if station_id provided
            if inp.get("station_id"):
                cursor.execute("""
                UPDATE stations 
                SET last_wqi = ?, last_tested = ?, samples_count = samples_count + 1,
                    status = CASE WHEN ? = 1 THEN 'Operational' WHEN ? < 50 THEN 'Critical Alert' ELSE 'Warning' END
                WHERE station_id = ?
                """, (pred["wqi_score"], now_iso, pred["potability"], pred["wqi_score"], inp.get("station_id")))

            conn.commit()
            return assess_id

    def get_recent_assessments(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, created_at, location_name, source_type, station_id,
                   ph, turbidity, solids, potability, potability_probability,
                   risk_level, wqi_score, wqi_category, remediation_urgency, provider, is_live_ai
            FROM assessments
            ORDER BY created_at DESC
            LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def get_assessment_by_id(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT full_json FROM assessments WHERE id = ?", (assessment_id,))
            row = cursor.fetchone()
            if row:
                try:
                    return json.loads(row["full_json"])
                except Exception:
                    return None
            return None

    def get_stations(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM stations ORDER BY station_id ASC")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def get_dashboard_stats(self) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM assessments")
            total = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM assessments WHERE potability = 1")
            potable = cursor.fetchone()[0]
            non_potable = total - potable

            cursor.execute("SELECT AVG(wqi_score) FROM assessments")
            avg_wqi = cursor.fetchone()[0] or 0.0

            cursor.execute("SELECT COUNT(*) FROM assessments WHERE risk_level LIKE '%Critical%' OR risk_level LIKE '%High%'")
            crit_alerts = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM stations")
            active_stations = cursor.fetchone()[0]

            # Distribution of WQI
            cursor.execute("SELECT wqi_category, COUNT(*) as cnt FROM assessments GROUP BY wqi_category")
            wqi_dist = {row["wqi_category"]: row["cnt"] for row in cursor.fetchall()}

            # Recent 10 assessments
            cursor.execute("""
            SELECT id, created_at, location_name, source_type, potability, risk_level, wqi_score, remediation_urgency
            FROM assessments ORDER BY created_at DESC LIMIT 10
            """)
            recent = [dict(r) for r in cursor.fetchall()]

            # Trends for chart
            cursor.execute("""
            SELECT id, substr(created_at, 12, 5) as time_label, wqi_score, potability, turbidity, ph
            FROM assessments ORDER BY created_at ASC LIMIT 15
            """)
            trends = [dict(r) for r in cursor.fetchall()]

            potability_rate = round((potable / total * 100.0), 1) if total > 0 else 0.0
            who_compliance_rate = round(((total - crit_alerts) / total * 100.0), 1) if total > 0 else 0.0

            return {
                "total_samples_analyzed": total,
                "potable_count": potable,
                "non_potable_count": non_potable,
                "potability_rate_pct": potability_rate,
                "average_wqi": round(avg_wqi, 1),
                "critical_alerts_count": crit_alerts,
                "active_monitoring_stations": active_stations,
                "who_compliance_rate_pct": who_compliance_rate,
                "recent_assessments": recent,
                "wqi_distribution": wqi_dist,
                "recent_trends": trends
            }

db_service = DBService()
