from fastapi import APIRouter
from app.services.simulation import simulate_data

router = APIRouter()

@router.get('/')
def simulate():
    return simulate_data()
