from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import router


app = FastAPI(
    title="Superagent",
    description="Bring your agents to production",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
