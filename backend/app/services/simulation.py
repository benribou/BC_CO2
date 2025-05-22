import json
from pathlib import Path
import random
from datetime import datetime


def simulate_data():
    temperature_air = round(random.uniform(-10, 35), 1)
    wind_speed = round(random.uniform(0, 100), 1)
    temperature_cable = round(random.uniform(-5, 60), 1)
    intensity = round(random.uniform(0, 60000), 1)

    data = {
        "temperature_air": temperature_air,
        "wind_speed": wind_speed,
        "temperature_cable": temperature_cable,
        "intensity": intensity,
        "timestamp": datetime.now().isoformat()
    }

    return data
