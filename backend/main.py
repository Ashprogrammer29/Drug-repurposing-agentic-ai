from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Initialize FastAPI
app = FastAPI(title="Drug Repurposing Agentic AI")

# THE CRITICAL FIX: Add CORS Middleware to allow Vercel to talk to your laptop
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "online", "message": "Agentic Backend is Live"}

@app.post("/api/analyze")
async def analyze(data: dict):
    query = data.get("query")
    print(f"🚀 Received Analysis Request: {query}")
    
    # --- YOUR AGENTIC LOGIC STARTS HERE ---
    # (Insert your existing logic that calls Qdrant and LLMs)
    # Example response structure:
    return {
        "query": query,
        "governance": {"verdict": "Approved", "final_score": 0.85},
        "agent_results": [
            {"agent_name": "Safety", "verdict": "Safe", "confidence": 0.9, "summary": "No major contraindications found."}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
