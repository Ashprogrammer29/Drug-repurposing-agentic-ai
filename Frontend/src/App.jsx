import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Activity, ShieldCheck, Beaker, Scale, List, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const TUNNEL_URL = 'https://drizzly-antitrust-surreal.ngrok-free.dev'; 
const API_ANALYZE_ENDPOINT = `${TUNNEL_URL}/api/analyze`;

export default function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const auditEndRef = useRef(null)

  useEffect(() => { auditEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [auditLogs])

  const addLog = (msg) => setAuditLogs(prev => [...prev, `> ${new Date().toLocaleTimeString()}: ${msg}`])

  const handleSubmit = async (overrideQuery) => {
    const finalQuery = typeof overrideQuery === 'string' ? overrideQuery : query;
    if (!finalQuery) return;

    setLoading(true); setError(null); setResult(null); setAuditLogs([]);
    addLog("🚀 INITIALIZING AGENTIC CONTEXT...");

    try {
      const res = await axios.post(API_ANALYZE_ENDPOINT, { query: finalQuery }, {
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      setResult(res.data);
      addLog("✅ ANALYSIS COMPLETE: Multi-agent consensus reached.");
    } catch (err) {
      setError('Connection failure. Check Uvicorn, Ngrok, and Docker.');
      addLog("❌ SESSION TERMINATED.");
    } finally { setLoading(false); }
  };

  const benchmarks = [
    { drug: "Sildenafil", indication: "Pulmonary Hypertension", class: "Gold", verdict: "Approved" },
    { drug: "Aspirin", indication: "Colorectal Cancer", class: "Gold", verdict: "Approved" },
    { drug: "Warfarin", indication: "Hemophilia", class: "Fail", verdict: "Halted (Safety)" },
    { drug: "Penicillin", indication: "Viral Influenza", class: "Fail", verdict: "Rejected" }
  ];

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
            Agentic AI
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.2rem' }}>REPURPOSING DISCOVERY ENGINE</p>
        </div>
        
        {/* INPUT SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Search drug-target pair (e.g. Aspirin for Cancer)..."
            style={{ width: '100%', maxWidth: '600px', padding: '20px', borderRadius: '15px', border: '2px solid #1e293b', background: '#0f172a', color: 'white', fontSize: '1.1rem', outline: 'none' }}
          />
          <button 
            onClick={() => handleSubmit()} disabled={loading}
            style={{ padding: '18px 60px', borderRadius: '12px', background: '#2563eb', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' }}
          >
            {loading ? '🔬 ANALYZING...' : 'EXECUTE PIPELINE'}
          </button>
          <div style={{ display: 'flex', gap: '15px' }}>
            {["Metformin - Alzheimer's", "Aspirin - Cancer"].map(pair => (
              <button key={pair} onClick={() => { setQuery(pair); handleSubmit(pair); }} style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>{pair}</button>
            ))}
          </div>
        </div>

        {/* AUDIT LOG BOX */}
        <div style={{ background: '#000000', border: '1px solid #1e293b', borderRadius: '20px', padding: '25px', fontFamily: 'monospace', fontSize: '14px', color: '#2dd4bf', marginTop: '40px', height: '160px', overflowY: 'auto' }}>
          {auditLogs.length === 0 && <div style={{ color: '#334155' }}>&gt; Awaiting neural uplink...</div>}
          {auditLogs.map((log, i) => <div key={i} style={{ marginBottom: '6px' }}>{log}</div>)}
          <div ref={auditEndRef} />
        </div>

        {/* RESULTS DISPLAY */}
        {result && (
          <div style={{ marginTop: '50px', borderTop: '1px solid #1e293b', paddingTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
              <Scale size={28} color="#3b82f6" />
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Hypothesis Analysis Result</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '5px' }}>GOVERNANCE VERDICT</p>
                <h3 style={{ fontSize: '1.4rem', color: result.governance?.verdict === 'Approved' ? '#2dd4bf' : '#fb7185' }}>{result.governance?.verdict}</h3>
              </div>
              <div style={{ background: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '5px' }}>CONFIDENCE SCORE</p>
                <h3 style={{ fontSize: '1.4rem', color: '#3b82f6' }}>{(result.governance?.final_score * 100).toFixed(1)}%</h3>
              </div>
            </div>

            {result.agent_results?.map((agent, i) => (
              <div key={i} style={{ background: '#0f172a', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>{agent.agent_name} Agent</span>
                  <span style={{ color: '#2dd4bf', fontSize: '0.9rem' }}>{agent.verdict}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>{agent.summary}</p>
              </div>
            ))}
          </div>
        )}

        {/* SYSTEM CALIBRATION MATRIX */}
        <div style={{ marginTop: '80px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', textAlign: 'center', letterSpacing: '0.1em' }}>SYSTEM CALIBRATION MATRIX (BENCHMARKS)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0f172a', borderRadius: '15px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left', color: '#94a3b8', fontSize: '0.8rem' }}>
                <th style={{ padding: '15px' }}>Drug Candidate</th>
                <th style={{ padding: '15px' }}>Indication</th>
                <th style={{ padding: '15px' }}>Class</th>
                <th style={{ padding: '15px' }}>Expected Verdict</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #020617', fontSize: '0.9rem' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{b.drug}</td>
                  <td style={{ padding: '15px', color: '#64748b' }}>{b.indication}</td>
                  <td style={{ padding: '15px', color: b.class === 'Gold' ? '#2dd4bf' : '#fb7185' }}>{b.class}</td>
                  <td style={{ padding: '15px' }}>{b.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
