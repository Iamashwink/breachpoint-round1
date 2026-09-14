import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="app-body">
        <Outlet />
      </main>
    </div>
  )
}
