from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.lib.prisma import prisma
from app.routers import router

app = FastAPI(
    title="Superagent",
    description="Bring your agents to production",
    version="0.0.7",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    prisma.connect()


@app.on_event("shutdown")
def shutdown():
    prisma.disconnect()


app.include_router(router)
