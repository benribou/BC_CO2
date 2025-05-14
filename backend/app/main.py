from fastapi import FastAPI
from app.api import simulator, reader

app = FastAPI()

app.include_router(simulator.router, prefix='/simulate', tags=['Simulation'])
app.include_router(reader.router, prefix='/read', tags=['Reading'])
