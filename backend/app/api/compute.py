import time

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from codecarbon import EmissionsTracker

from app.services.algorithms import simulate_temperature_opti
from app.services.romina import simulate_temperature_loop
from app.services.simulation import simulate_data

router = APIRouter()

@router.get('/')
# def compute(duree: int = 30, temp_cable: float = 47.9, temp_ambient: float = 20.0, vent: float = 2.0, intensity: float = 1000.0):
def compute():
    # DUREE = 30
    # T0 = 47.9
    # T_AMBIENT = 20.0
    # VENT = 2.0
    # I = 1000.0
    """
    :param duree: Durée de la simulation (minutes)
    :param temp_cable: Température initiale du câble (\u00b0C)
    :param temp_ambient: Température ambiante (\u00b0C)
    :param vent: Vitesse du vent (m/s)
    :param intensity: Intensité électrique (A)
    :return: json avec :
        'cpu_usage_kWh': float,
        'gpu_usage_kWh': float,
        'ram_energy_kWh': float,
        'energy_consumed': float,
        'exec_time_sec': float,
        'result': list[float]
    """
    values = simulate_data()
    duree = 30
    temp_cable = values['temperature_cable']
    temp_ambient = values['temperature_air']
    vent = values['wind_speed']
    intensity = values['intensity']

    tracker = EmissionsTracker()
    tracker.start()
    start_time = time.time()
    value = simulate_temperature_opti(duree, temp_cable, temp_ambient, vent, intensity)
    exec_time = time.time() - start_time
    tracker.stop()

    result = {
        'cpu_usage_kWh': tracker.final_emissions_data.cpu_energy,
        'gpu_usage_kWh': tracker.final_emissions_data.gpu_energy,
        'ram_energy_kWh': tracker.final_emissions_data.ram_energy,
        'energy_consumed': tracker.final_emissions_data.energy_consumed,
        'exec_time_in_seconds': exec_time,
        'result': value
    }
    print(result)
    return JSONResponse(content=jsonable_encoder(result))

if __name__ == '__main__':
    DUREE = 30
    # T0 = 47.9
    # T_AMBIENT = 20.0
    # VENT = 2.0
    # I = 1000.0

    T0 = 25
    T_AMBIENT = 20.0
    VENT = 1.0
    I = 100.0

    tracker = EmissionsTracker()
    tracker.start()
    value = simulate_temperature_opti(DUREE, T0, T_AMBIENT, VENT, I)
    # value = simulate_temperature_loop(T0, T_AMBIENT, VENT, I)
    emission = tracker.stop()
    print(emission)
    print(value)

