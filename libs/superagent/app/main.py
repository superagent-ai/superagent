import logging
import time

import colorlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.routers import router
from app.utils.prisma import prisma

# Create a color formatter
formatter = colorlog.ColoredFormatter(
    "%(log_color)s%(levelname)s:  %(message)s",
    log_colors={
        "DEBUG": "cyan",
        "INFO": "green",
        "WARNING": "yellow",
        "ERROR": "red",
        "CRITICAL": "bold_red",
    },
    secondary_log_colors={},
    style="%",
)  # Create a console handler and set the formatter
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    handlers=[console_handler],
    force=True,
)

app = FastAPI(
    title="Superagent",
    docs_url="/",
    description="The open framework for building AI Assistants",
    version="0.1.53",
    servers=[{"url": "https://api.beta.superagent.sh"}],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Total request time: {process_time} secs")
    return response


@app.on_event("startup")
async def startup():
    await prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()


app.include_router(router)
