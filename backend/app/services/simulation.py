import json
from pathlib import Path

def simulate_data():
    data = [{'value': i} for i in range(10)]
    path = Path('app/data/simulated_data.json')
    path.write_text(json.dumps(data, indent=2))
