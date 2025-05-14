from fastapi import APIRouter
from app.services.simulation import simulate_data

router = APIRouter()

@router.post('/')
def simulate():
    simulate_data()
    return {'message': 'Data simulated'}
