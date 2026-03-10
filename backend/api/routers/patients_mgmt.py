# ─────────────────────────────────────────────────────────────
# PrimeCare Hospital | GKM_8 Intelligence Platform
# api/routers/patients_mgmt.py — Admin patient management CRUD
# Fully in-memory (no DB) — uses simulated list store
# ─────────────────────────────────────────────────────────────

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

# ── In-memory simulated patient store ────────────────────────
# These are pre-seeded simulated patients with adapted data.
# All CRUD (add, edit, delete, vitals) mutates this list only.

_PATIENTS: list = [
    {
        "id": 1, "name": "Senthil Kumar",    "age": 54, "gender": "Male",
        "department": "Cardiology",       "assigned_doctor": "Dr. Ramesh Iyer",
        "diagnosis": "Coronary Artery Disease", "contact": "9876543210",
        "admission_status": "icu",        "created_at": "2024-11-01T08:30:00",
        "vitals": {"heart_rate": 92, "blood_pressure": "145/90", "temperature": 37.4,
                   "oxygen_saturation": 94, "respiration_rate": 18,
                   "notes": "Monitor SpO2 — pending echo"},
    },
    {
        "id": 2, "name": "Meena Devi",        "age": 36, "gender": "Female",
        "department": "Obstetrics",       "assigned_doctor": "Dr. Meena Rajagopalan",
        "diagnosis": "Gestational Hypertension", "contact": "9123456789",
        "admission_status": "admitted",   "created_at": "2024-11-03T10:00:00",
        "vitals": {"heart_rate": 84, "blood_pressure": "138/88", "temperature": 37.1,
                   "oxygen_saturation": 97, "respiration_rate": 16,
                   "notes": "BP stable on medication"},
    },
    {
        "id": 3, "name": "Arjun Sharma",      "age": 29, "gender": "Male",
        "department": "Orthopedics",      "assigned_doctor": "Dr. Karthik Menon",
        "diagnosis": "ACL Tear — Post-op", "contact": "9000112233",
        "admission_status": "admitted",   "created_at": "2024-11-05T09:15:00",
        "vitals": {"heart_rate": 72, "blood_pressure": "118/76", "temperature": 36.9,
                   "oxygen_saturation": 99, "respiration_rate": 14,
                   "notes": "Post-op day 2 — mobilising"},
    },
    {
        "id": 4, "name": "Kavitha Rajan",     "age": 61, "gender": "Female",
        "department": "General Medicine", "assigned_doctor": "Dr. Priya Subramaniam",
        "diagnosis": "Type 2 Diabetes + Hypertension", "contact": "9111222333",
        "admission_status": "admitted",   "created_at": "2024-11-06T11:00:00",
        "vitals": None,
    },
    {
        "id": 5, "name": "Venkatesh Pillai",  "age": 72, "gender": "Male",
        "department": "Neurology",        "assigned_doctor": "Dr. Anitha Krishnan",
        "diagnosis": "Ischemic Stroke",   "contact": "9444555666",
        "admission_status": "icu",        "created_at": "2024-11-07T06:45:00",
        "vitals": {"heart_rate": 78, "blood_pressure": "130/82", "temperature": 37.2,
                   "oxygen_saturation": 96, "respiration_rate": 17,
                   "notes": "GCS 14/15 — improving"},
    },
    {
        "id": 6, "name": "Priya Nair",        "age": 22, "gender": "Female",
        "department": "Emergency",        "assigned_doctor": "Dr. Vijay Nair",
        "diagnosis": "Acute Appendicitis", "contact": "9777888999",
        "admission_status": "admitted",   "created_at": "2024-11-08T04:30:00",
        "vitals": None,
    },
]

_next_id: int = 7  # auto-increment counter


# ── Pydantic schemas ──────────────────────────────────────────

class PatientCreate(BaseModel):
    name:             str
    age:              Optional[int]   = None
    gender:           Optional[str]   = None
    department:       Optional[str]   = None
    assigned_doctor:  Optional[str]   = None
    diagnosis:        Optional[str]   = None
    contact:          Optional[str]   = None
    admission_status: Optional[str]   = "admitted"


class PatientUpdate(BaseModel):
    name:             Optional[str]   = None
    age:              Optional[int]   = None
    gender:           Optional[str]   = None
    department:       Optional[str]   = None
    assigned_doctor:  Optional[str]   = None
    diagnosis:        Optional[str]   = None
    contact:          Optional[str]   = None
    admission_status: Optional[str]   = None


class VitalsUpdate(BaseModel):
    patient_id:        int
    heart_rate:        Optional[int]   = None
    blood_pressure:    Optional[str]   = None
    temperature:       Optional[float] = None
    oxygen_saturation: Optional[int]   = None
    respiration_rate:  Optional[int]   = None
    notes:             Optional[str]   = None


# ── Routes ────────────────────────────────────────────────────

@router.get("/")
def list_patients():
    return {"patients": list(reversed(_PATIENTS)), "total": len(_PATIENTS)}


@router.get("/{patient_id}")
def get_patient(patient_id: int):
    p = next((x for x in _PATIENTS if x["id"] == patient_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    return p


@router.post("/")
def create_patient(body: PatientCreate):
    global _next_id
    new_patient: dict = body.dict()
    new_patient["id"]         = _next_id
    new_patient["created_at"] = datetime.now().isoformat()
    new_patient["vitals"]     = None
    _PATIENTS.append(new_patient)
    _next_id += 1
    return {"message": "Patient created", "patient": new_patient}


@router.put("/{patient_id}")
def update_patient(patient_id: int, body: PatientUpdate):
    p = next((x for x in _PATIENTS if x["id"] == patient_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    for field, value in body.dict(exclude_none=True).items():
        p[field] = value
    return {"message": "Patient updated", "patient": p}


@router.delete("/{patient_id}")
def delete_patient(patient_id: int):
    idx = next((i for i, x in enumerate(_PATIENTS) if x["id"] == patient_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    _PATIENTS.pop(idx)
    return {"message": "Patient deleted"}


@router.put("/vitals/update")
def update_vitals(body: VitalsUpdate):
    p = next((x for x in _PATIENTS if x["id"] == body.patient_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    existing = p.get("vitals") or {}
    data = body.dict(exclude={"patient_id"}, exclude_none=True)
    existing.update(data)
    existing["updated_at"] = datetime.now().isoformat()
    p["vitals"] = existing
    return {"message": "Vitals updated", "vitals": existing}
