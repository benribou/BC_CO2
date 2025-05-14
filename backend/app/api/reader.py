from fastapi import APIRouter
from app.services.reading import read_data

router = APIRouter()

@router.get('/')
def read():
    return read_data()
