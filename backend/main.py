from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from datetime import datetime

app = FastAPI(title="RenewRx Integration Hub")

class PatientCase(BaseModel):
    id: Optional[str] = None
    patient_name: str
    requested_medication: str
    transcript: Optional[str] = None
    risk_score: float = 0.0
    status: str = "pending"
    created_at: Optional[str] = None

# Mock database
cases_db = []

@app.get("/")
async def root():
    return {"message": "RenewRx API Hub is Live", "status": "healthy"}

@app.get("/cases", response_model=List[PatientCase])
async def get_cases():
    return cases_db

@app.post("/cases", response_model=PatientCase)
async def create_case(case: PatientCase):
    case.id = f"CASE-{int(datetime.now().timestamp())}"
    case.created_at = datetime.now().isoformat()
    cases_db.append(case)
    return case

@app.patch("/cases/{case_id}")
async def update_case(case_id: str, status: str):
    for case in cases_db:
        if case.id == case_id:
            case.status = status
            return case
    raise HTTPException(status_code=404, detail="Case not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
