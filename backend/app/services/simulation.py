import json
from pathlib import Path
import random
from datetime import datetime
from codecarbon import track_emissions
import pandas as pd
from pathlib import Path

from app.services.track import function_to_track

@track_emissions()
def track_data():
    # Simulate some work
    for _ in range(1000000):
        pass

def simulate_data():
    temperature_air = round(random.uniform(-10, 35), 1)
    wind_speed = round(random.uniform(0, 100), 1)
    temperature_cable = round(random.uniform(-5, 60), 1)

    data = {
        "temperature_air": temperature_air,
        "wind_speed": wind_speed,
        "temperature_cable": temperature_cable,
        "timestamp": datetime.now().isoformat()
    }

    return data

# Lecture des émissions (dernier enregistrement)
def get_emissions_data():
    csv_path = Path("app/data/emissions.csv")  # ou ajuster selon config

    if not csv_path.exists():
        function_to_track()

    df = pd.read_csv(csv_path)
    latest_row = df.iloc[-1]

    return {
        "timestamp": latest_row["timestamp"],
        "project_name": latest_row["project_name"],
        "duration": latest_row["duration"],
        "emissions": latest_row["emissions"],
        "energy_consumed": latest_row["energy_consumed"],
        "country_name": latest_row["country_name"]
    }