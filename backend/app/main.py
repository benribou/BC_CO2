from fastapi import FastAPI
from app.api import simulator, reader
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulator.router, prefix='/simulate', tags=['Simulation'])
app.include_router(reader.router, prefix='/read', tags=['Reading'])
app.include_router(reader.router, prefix='/emissions', tags=['Emissions'])
