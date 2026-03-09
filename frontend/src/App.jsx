// ─────────────────────────────────────────────────────────────
// Apollo_8 Hospital Dashboard | Team Auraman | VITC GlitchCon 2.0
// App.jsx — Root router — handles role selection + dashboard routing
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import LoginPage from './pages/LoginPage'

// ── Placeholder components until each dashboard is built ─────
function ComingSoon({ roleName }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏗️</span>
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          {roleName} Dashboard
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          This dashboard is being built next.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-colors"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  )
}


// ── Role → Dashboard mapping ──────────────────────────────────
const ROLE_DASHBOARD_MAP = {
  doctor: () => <ComingSoon roleName="Doctor / Nurse" />,
  department_head: () => <ComingSoon roleName="Department Head" />,
  admin: () => <ComingSoon roleName="Admin / CEO" />,
  floor_supervisor: () => <ComingSoon roleName="Floor Supervisor" />,
  patient: () => <ComingSoon roleName="Patient Portal" />,
}


// ─── Root App ─────────────────────────────────────────────────

export default function App() {

  const [activeRole, setActiveRole] = useState(null)

  // No role selected → show login page
  if (!activeRole) {
    return <LoginPage onRoleSelected={setActiveRole} />
  }

  // Role selected → render that dashboard
  const DashboardComponent = ROLE_DASHBOARD_MAP[activeRole]

  return DashboardComponent
    ? <DashboardComponent />
    : <LoginPage onRoleSelected={setActiveRole} />
}