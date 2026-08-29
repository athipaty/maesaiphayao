import { Component } from 'react'

export default class ChunkErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (this.state.err) return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm text-gray-500">โหลดหน้าไม่สำเร็จ กรุณาลองใหม่</p>
        <button onClick={() => this.setState({ err: null })} className="btn-primary text-xs">🔄 ลองใหม่</button>
      </div>
    )
    return this.props.children
  }
}
