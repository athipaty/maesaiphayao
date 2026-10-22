import { Component } from 'react'

// After a deploy, lazy page chunks get new hashed filenames, so a tab opened before the deploy
// asks for files that no longer exist. React.lazy caches that failed import, so re-rendering
// can never recover — only a full page reload (which picks up the new index.html) can.
const RELOAD_KEY = 'abt_chunk_reload_at'

function isChunkLoadError(err) {
  const msg = String(err?.message || err || '')
  return /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|Unable to preload CSS/i.test(msg)
}

function reloadedRecently() {
  try { return Date.now() - Number(sessionStorage.getItem(RELOAD_KEY) || 0) < 30_000 } catch { return true }
}

function hardReload() {
  try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())) } catch {}
  window.location.reload()
}

export default class ChunkErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err) {
    // Reload once automatically for a stale chunk; the 30s guard stops a reload loop if the
    // file is genuinely missing, in which case the message and button below are shown instead.
    if (isChunkLoadError(err) && !reloadedRecently()) hardReload()
  }
  render() {
    if (this.state.err) return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm text-gray-500">โหลดหน้าไม่สำเร็จ กรุณาลองใหม่</p>
        <button onClick={hardReload} className="btn-primary text-xs">🔄 ลองใหม่</button>
      </div>
    )
    return this.props.children
  }
}
