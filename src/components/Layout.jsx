import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MessengerButton from './MessengerButton'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(v => !v)} />

      {/* Mobile sidebar overlay — always mounted, toggled with CSS for smooth animation */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div
          className={`absolute left-0 top-0 bottom-0 w-full bg-white overflow-y-auto z-50 shadow-xl transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-3 py-4 flex gap-4 flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MessengerButton />
    </div>
  )
}
