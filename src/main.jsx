import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

class RootErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif', background: '#f8fafc', color: '#334155' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>เกิดข้อผิดพลาด</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', textAlign: 'center' }}>กรุณาลองรีเฟรชหน้าใหม่</p>
        <button onClick={() => window.location.reload()}
          style={{ background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          🔄 รีเฟรช
        </button>
      </div>
    )
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RootErrorBoundary>
  </React.StrictMode>
)
