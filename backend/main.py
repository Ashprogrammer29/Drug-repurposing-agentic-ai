import sys
import os
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 1. SETUP PATHS AND ENV
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

# 2. INITIALIZE APP
app = FastAPI(
    title="Drug Repurposing Assistant",
    description="Agentic AI system for drug repurposing hypothesis generation.",
    version="2.0.0"
)

# 3. CONFIGURE CORS (The "Security Gate")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows EVERY origin - Use this for the demo to be safe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. IMPORT ROUTERS AND GRAPH
# Assuming your graph is initialized in your query router or a separate engine file
from backend.routes.query import router as query_router
from backend.routes.sessions import router as sessions_router
from backend.routes.report import router as report_router

# If 'graph' is defined in your query route, we import it to use in the analyze endpoint
# Replace 'backend.routes.query' with the actual path where your LangGraph 'graph' is defined
try:
    from backend.routes.query import graph 
except ImportError:
    # This is a fallback if graph is elsewhere; adjust path as needed
    graph = None 

app.include_router(query_router,    prefix="/api")
app.include_router(sessions_router, prefix="/api")
app.include_router(report_router,   prefix="/api")

@app.get("/")
def root():
    return {"status": "Drug Repurposing Assistant v2.0 running."}

@app.get("/health")
def health():
    return {"status": "ok"}

# The /api/analyze endpoint is handled by query_router with prefix="/api"
# Combined with @router.post("/analyze") in routes/query.py, it correctly resolves to /api/analyze