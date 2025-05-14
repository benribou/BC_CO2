import json
from pathlib import Path

def read_data():
    path = Path('app/data/simulated_data.json')
    return json.loads(path.read_text())
