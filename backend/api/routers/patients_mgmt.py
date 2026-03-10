# ─────────────────────────────────────────────────────────────
# PrimeCare Hospital | GKM_8 Intelligence Platform
# api/routers/patients_mgmt.py — Admin patient management CRUD
# Prefix: /api/patients-mgmt
# ─────────────────────────────────────────────────────────────

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database.db import get_db
from database.models import PatientMgmt, PatientVitals

router = APIRouter()


# ── Pydantic schemas ──────────────────────────────────────────

class PatientCreate(BaseModel):
    name:             str
    age:              Optional[int]       = None
    gender:           Optional[str]       = None
    department:       Optional[str]       = None
    assigned_doctor:  Optional[str]       = None
    diagnosis:        Optional[str]       = None
    contact:          Optional[str]       = None
    admission_status: Optional[str]       = "admitted"


class PatientUpdate(PatientCreate):
    name: Optional[str] = None


class VitalsUpdate(BaseModel):
    patient_id:        int
    heart_rate:        Optional[int]   = None
    blood_pressure:    Optional[str]   = None
    temperature:       Optional[float] = None
    oxygen_saturation: Optional[int]   = None
    respiration_rate:  Optional[int]   = None
    notes:             Optional[str]   = None


# ── Helper ────────────────────────────────────────────────────

def _patient_to_dict(p: PatientMgmt) -> dict:
    latest_vitals = p.vitals[-1] if p.vitals else None
    return {
        "id":               p.id,
        "name":             p.name,
        "age":              p.age,
        "gender":           p.gender,
        "department":       p.department,
        "assigned_doctor":  p.assigned_doctor,
        "diagnosis":        p.diagnosis,
        "contact":          p.contact,
        "admission_status": p.admission_status,
        "created_at":       p.created_at.isoformat() if p.created_at else None,
        "vitals":           _vitals_to_dict(latest_vitals) if latest_vitals else None,
    }


def _vitals_to_dict(v: PatientVitals) -> dict:
    return {
        "id":                v.id,
        "heart_rate":        v.heart_rate,
        "blood_pressure":    v.blood_pressure,
        "temperature":       v.temperature,
        "oxygen_saturation": v.oxygen_saturation,
        "respiration_rate":  v.respiration_rate,
        "notes":             v.notes,
        "updated_at":        v.updated_at.isoformat() if v.updated_at else None,
    }


# ── Routes ────────────────────────────────────────────────────

@router.get("/")
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(PatientMgmt).order_by(PatientMgmt.id.desc()).all()
    return {"patients": [_patient_to_dict(p) for p in patients], "total": len(patients)}


@router.get("/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    p = db.query(PatientMgmt).filter(PatientMgmt.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    return _patient_to_dict(p)


@router.post("/")
def create_patient(body: PatientCreate, db: Session = Depends(get_db)):
    p = PatientMgmt(**body.dict())
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"message": "Patient created", "patient": _patient_to_dict(p)}


@router.put("/{patient_id}")
def update_patient(patient_id: int, body: PatientUpdate, db: Session = Depends(get_db)):
    p = db.query(PatientMgmt).filter(PatientMgmt.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    for field, value in body.dict(exclude_none=True).items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)
    return {"message": "Patient updated", "patient": _patient_to_dict(p)}


@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    p = db.query(PatientMgmt).filter(PatientMgmt.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(p)
    db.commit()
    return {"message": "Patient deleted"}


@router.put("/vitals/update")
def update_vitals(body: VitalsUpdate, db: Session = Depends(get_db)):
    p = db.query(PatientMgmt).filter(PatientMgmt.id == body.patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    # Upsert latest vitals record
    existing = db.query(PatientVitals)\
                 .filter(PatientVitals.patient_id == body.patient_id)\
                 .order_by(PatientVitals.id.desc()).first()
    if existing:
        for field, value in body.dict(exclude={"patient_id"}, exclude_none=True).items():
            setattr(existing, field, value)
        existing.updated_at = datetime.utcnow()
    else:
        data = body.dict(exclude_none=True)
        existing = PatientVitals(**data)
        db.add(existing)
    db.commit()
    db.refresh(existing)
    return {"message": "Vitals updated", "vitals": _vitals_to_dict(existing)}
