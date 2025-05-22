from fastapi import APIRouter
from app.services.simulation import get_emissions_data, track_data

router = APIRouter()

@router.get("/emissions")
def get_emissions():
    # Exécute la fonction pour produire de nouvelles données d'émission
    track_data()

    # Lit la dernière ligne du fichier emissions.csv
    return get_emissions_data()
