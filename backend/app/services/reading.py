import csv
import json
from pathlib import Path

def read_data():
    path = Path('app/data/emissions.csv')
    with open(path, mode='r', newline='', encoding='utf-8') as csvfile:
        data = list(csv.DictReader(csvfile))

    with open(path.parent/'output.json', mode='w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4)
    return json.loads(Path(path.parent/'output.json').read_text())
