# ─────────────────────────────────────────────────────────────
# PrimeCare Hospital | GKM_8 Intelligence Platform
# api/routers/kpi.py — KPI data endpoints
# GET /api/kpi/weekly   →  7-day data per dept
# GET /api/kpi/today    →  today's data with anomaly flags
# ─────────────────────────────────────────────────────────────

from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db
from database.models import KpiMetric

router = APIRouter()

THRESHOLDS = {
    "bed_occupancy":           {"warning": 85,  "critical": 92,  "higher_is_worse": True},
    "opd_wait_time":           {"warning": 35,  "critical": 50,  "higher_is_worse": True},
    "billing_collection_rate": {"warning": 83,  "critical": 78,  "higher_is_worse": False},
    "lab_tat":                 {"warning": 65,  "critical": 90,  "higher_is_worse": True},
    "readmission_rate":        {"warning": 8,   "critical": 11,  "higher_is_worse": True},
    "nps_score":               {"warning": 65,  "critical": 55,  "higher_is_worse": False},
}

KPI_LABELS = {
    "bed_occupancy":           "Bed Occupancy",
    "opd_wait_time":           "OPD Wait Time",
    "billing_collection_rate": "Billing Collection Rate",
    "lab_tat":                 "Lab TAT",
    "readmission_rate":        "Readmission Rate",
    "nps_score":               "NPS Score",
}

KPI_UNITS = {
    "bed_occupancy":           "%",
    "opd_wait_time":           "min",
    "billing_collection_rate": "%",
    "lab_tat":                 "min",
    "readmission_rate":        "%",
    "nps_score":               "pts",
}


def _get_status(metric: str, value: float) -> str:
    t = THRESHOLDS[metric]
    hiw = t["higher_is_worse"]
    if hiw:
        if value >= t["critical"]: return "critical"
        if value >= t["warning"]:  return "warning"
    else:
        if value <= t["critical"]: return "critical"
        if value <= t["warning"]:  return "warning"
    return "normal"


def _anomaly_flag(metric: str, today_val: float, baseline: float) -> dict | None:
    if baseline == 0:
        return None
    deviation = ((today_val - baseline) / baseline) * 100
    t = THRESHOLDS[metric]
    higher_is_worse = t["higher_is_worse"]
    threshold_breach = (higher_is_worse and today_val >= t["warning"]) or \
                       (not higher_is_worse and today_val <= t["warning"])
    significant = abs(deviation) >= 15
    if not (threshold_breach or significant):
        return None
    return {
        "deviation_pct": round(deviation, 1),
        "status":        _get_status(metric, today_val),
        "baseline":      round(baseline, 1),
    }


@router.get("/weekly")
def get_weekly_kpis(db: Session = Depends(get_db)):
    """7-day KPI history grouped by department."""
    today = date.today()
    cutoff = today - timedelta(days=6)
    rows = db.query(KpiMetric)\
             .filter(KpiMetric.date >= cutoff)\
             .order_by(KpiMetric.department, KpiMetric.date)\
             .all()

    by_dept: dict = {}
    for row in rows:
        d = row.department
        by_dept.setdefault(d, [])
        by_dept[d].append({
            "date":                    row.date.isoformat(),
            "bed_occupancy":           row.bed_occupancy,
            "opd_wait_time":           row.opd_wait_time,
            "billing_collection_rate": row.billing_collection_rate,
            "lab_tat":                 row.lab_tat,
            "readmission_rate":        row.readmission_rate,
            "nps_score":               row.nps_score,
        })

    return {"departments": by_dept, "days": 7}


@router.get("/today")
def get_today_kpis(db: Session = Depends(get_db)):
    """Today's KPIs with anomaly detection vs 6-day baseline."""
    today = date.today()
    cutoff = today - timedelta(days=7)

    # Today's records
    today_rows = db.query(KpiMetric).filter(KpiMetric.date == today).all()

    # 6-day baseline averages
    baseline_q = db.query(
        KpiMetric.department,
        func.avg(KpiMetric.bed_occupancy).label("bed_occupancy"),
        func.avg(KpiMetric.opd_wait_time).label("opd_wait_time"),
        func.avg(KpiMetric.billing_collection_rate).label("billing_collection_rate"),
        func.avg(KpiMetric.lab_tat).label("lab_tat"),
        func.avg(KpiMetric.readmission_rate).label("readmission_rate"),
        func.avg(KpiMetric.nps_score).label("nps_score"),
    ).filter(KpiMetric.date >= cutoff, KpiMetric.date < today)\
     .group_by(KpiMetric.department).all()

    baselines = {r.department: r for r in baseline_q}

    result = []
    METRICS = ["bed_occupancy", "opd_wait_time", "billing_collection_rate",
               "lab_tat", "readmission_rate", "nps_score"]

    for row in today_rows:
        b = baselines.get(row.department)
        kpis = []
        anomalies = []
        for m in METRICS:
            val  = getattr(row, m)
            base = getattr(b, m) if b else val
            kpis.append({
                "metric": m,
                "label":  KPI_LABELS[m],
                "unit":   KPI_UNITS[m],
                "value":  round(val, 1),
                "baseline": round(base, 1) if base else None,
                "status": _get_status(m, val),
                "higher_is_worse": THRESHOLDS[m]["higher_is_worse"],
            })
            flag = _anomaly_flag(m, val, base) if base else None
            if flag:
                anomalies.append({"metric": m, "label": KPI_LABELS[m], **flag,
                                   "current_value": round(val, 1),
                                   "unit": KPI_UNITS[m]})
        result.append({
            "department": row.department,
            "date":       row.date.isoformat(),
            "kpis":       kpis,
            "anomalies":  anomalies,
        })

    return {"departments": result, "date": today.isoformat()}
