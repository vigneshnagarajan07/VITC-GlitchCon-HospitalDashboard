// ─────────────────────────────────────────────────────────────
// PrimeCare Hospital | GKM_8 Intelligence Platform
// AuthLoginPage.jsx — Username / Password authentication gate
// Light theme — inspired by dashboard UI design
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import {
    Activity, Lock, User, Eye, EyeOff,
    Shield, AlertCircle, ChevronRight, Heart
} from 'lucide-react'

// ── Demo credentials ─────────────────────────────────────────
const DEMO_CREDENTIALS = [
    { username: 'admin',       password: 'admin123',       label: 'Admin / CEO', role: 'admin' },
    { username: 'doctor',      password: 'doctor123',      label: 'Doctor / Nurse', role: 'doctor' },
    { username: 'depthead',    password: 'depthead123',    label: 'Department Head', role: 'department_head' },
    { username: 'floor',       password: 'floor123',       label: 'Floor Supervisor', role: 'floor_supervisor' },
    { username: 'patient',     password: 'patient123',     label: 'Patient Portal', role: 'patient' },
]

export default function AuthLoginPage({ onAuthenticated }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showCredentials, setShowCredentials] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.')
            return
        }

        setIsLoading(true)
        await new Promise(r => setTimeout(r, 600))

        const match = DEMO_CREDENTIALS.find(
            c => c.username === username.trim().toLowerCase() && c.password === password
        )

        if (match) {
            onAuthenticated(match.role)
        } else {
            setError('Invalid credentials. Please check username and password.')
        }

        setIsLoading(false)
    }

    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 flex flex-col">

            {/* ── Top bar ── */}
            <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-sm">
                            <Activity size={16} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-800 text-sm">PrimeCare</span>
                            <span className="text-slate-400 text-sm font-normal"> · Hospital Performance Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        <span>{currentDate} · {currentTime}</span>
                    </div>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">

                    {/* ── Header ── */}
                    <div className="text-center mb-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                            <Shield size={13} className="text-sky-500" />
                            <span className="text-xs font-semibold text-slate-600">Secure Authentication Portal</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-3">
                            Welcome to <span className="text-sky-500">PrimeCare</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Sign in to access the hospital intelligence platform
                        </p>
                    </div>

                    {/* ── Login card ── */}
                    <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 shadow-xl shadow-slate-200/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <input
                                        id="auth-username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); setError('') }}
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        id="auth-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                                    <p className="text-xs text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            {/* Login button */}
                            <button
                                id="auth-login-btn"
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300/40 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* ── Demo credentials toggle ── */}
                        <div className="mt-6 pt-5 border-t border-slate-100">
                            <button
                                onClick={() => setShowCredentials(!showCredentials)}
                                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <span className="font-semibold">Demo Credentials</span>
                                <ChevronRight size={14} className={`transition-transform ${showCredentials ? 'rotate-90' : ''}`} />
                            </button>

                            {showCredentials && (
                                <div className="mt-3 space-y-2 animate-slide-up">
                                    {DEMO_CREDENTIALS.map((cred) => (
                                        <button
                                            key={cred.username}
                                            type="button"
                                            onClick={() => {
                                                setUsername(cred.username)
                                                setPassword(cred.password)
                                                setError('')
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-sky-50 hover:border-sky-200 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
                                                    <User size={12} className="text-sky-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-semibold text-slate-700">{cred.label}</p>
                                                    <p className="text-[10px] text-slate-400">{cred.username} / {cred.password}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={12} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Bottom note ── */}
                    <p className="text-center text-[11px] text-slate-400 mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        PrimeCare Medical Hospital · NABH Accredited · Chennai
                    </p>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-slate-200 bg-white/50 py-4">
                <p className="text-center text-xs text-slate-400">PrimeCare Hospitals · GKM_8 Intelligence Platform · VITC GlitchCon 2.0</p>
            </div>
        </div>
    )
}
