// ─────────────────────────────────────────────────────────────
// PrimeCare Hospital | GKM_8 Intelligence Platform
// AuthLoginPage.jsx — Redesigned authentication gateway
// Light theme · Plus Jakarta Sans · animated stat ticker
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import {
    Activity, Lock, User, Eye, EyeOff,
    Shield, AlertCircle, ChevronRight, Heart,
    BedDouble, Clock, Users, TrendingUp, Stethoscope,
    Brain, FileText, Sparkles, BarChart3
} from 'lucide-react'

const DEMO_CREDENTIALS = [
    { username: 'admin',    password: 'admin123',    label: 'Admin / CEO',         role: 'admin',            icon: Shield,      color: 'sky'     },
    { username: 'doctor',   password: 'doctor123',   label: 'Doctor / Nurse',      role: 'doctor',           icon: Stethoscope, color: 'emerald' },
    { username: 'depthead', password: 'depthead123', label: 'Department Head',      role: 'department_head',  icon: TrendingUp,  color: 'violet'  },
    { username: 'floor',    password: 'floor123',    label: 'Floor Supervisor',     role: 'floor_supervisor', icon: BedDouble,   color: 'amber'   },
    { username: 'patient',  password: 'patient123',  label: 'Patient Portal',       role: 'patient',          icon: Heart,       color: 'rose'    },
]

const LIVE_STATS = [
    { icon: BedDouble, label: 'Beds Occupied', value: '319/395', color: 'text-sky-600' },
    { icon: Clock,     label: 'Avg Wait Time', value: '22 min',  color: 'text-amber-600' },
    { icon: Users,     label: 'Patients Today', value: '284',    color: 'text-emerald-600' },
    { icon: Activity,  label: 'Health Score',   value: '82/100', color: 'text-violet-600' },
    { icon: Heart,     label: 'Surgeries Done', value: '14',     color: 'text-rose-500' },
    { icon: TrendingUp,label: 'NPS Score',      value: '72 pts', color: 'text-sky-600' },
]

const PLATFORM_FEATURES = [
    { title: "AI Anomaly Detection", desc: "Instantly flags critical KPI deviations using advanced ML models.", icon: Brain, color: "violet" },
    { title: "Agentic Patient Reports", desc: "Auto-generates clinical summaries & risk scores via AI.", icon: FileText, color: "sky" },
    { title: "Predictive Analytics", desc: "Forecasts metric breaches 48 hours in advance.", icon: TrendingUp, color: "amber" },
    { title: "Real-time Operations", desc: "Live monitoring of bed occupancy and OPD queues.", icon: Activity, color: "emerald" }
]

const COLOR_MAP = {
    sky:     { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     icon: 'text-sky-600'    },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600'},
    violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  icon: 'text-violet-600' },
    amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   icon: 'text-amber-600'  },
    rose:    { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    icon: 'text-rose-500'   },
}

export default function AuthLoginPage({ onAuthenticated }) {
    const [username, setUsername]           = useState('')
    const [password, setPassword]           = useState('')
    const [showPassword, setShowPassword]   = useState(false)
    const [error, setError]                 = useState('')
    const [isLoading, setIsLoading]         = useState(false)
    const [showCreds, setShowCreds]         = useState(false)
    const [hoveredCred, setHoveredCred]     = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.')
            return
        }
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 700))
        const match = DEMO_CREDENTIALS.find(
            c => c.username === username.trim().toLowerCase() && c.password === password
        )
        if (match) {
            onAuthenticated(match.role)
        } else {
            setError('Invalid credentials. Try a demo account below.')
        }
        setIsLoading(false)
    }

    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">

            {/* ── Live stat ticker ── */}
            <div className="bg-sky-600 py-1.5 overflow-hidden">
                <div className="ticker-inner gap-10 px-4">
                    {[...LIVE_STATS, ...LIVE_STATS].map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <span key={i} className="inline-flex items-center gap-2 text-white/90 text-[11px] font-semibold mx-6">
                                <Icon size={11} className="text-white/70" />
                                <span className="text-white/60">{stat.label}:</span>
                                <span className="text-white font-bold">{stat.value}</span>
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* ── Navbar ── */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm shadow-sky-200">
                            <Activity size={17} className="text-white" />
                        </div>
                        <div>
                            <span className="font-extrabold text-slate-800 text-sm tracking-tight">PrimeCare</span>
                            <span className="text-slate-400 text-sm font-normal"> · Hospital Intelligence Platform</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        <span className="text-slate-500 font-medium">{dateStr}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-700 font-bold tabular-nums">{timeStr}</span>
                    </div>
                </div>
            </header>

            {/* ── Hero content ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-5xl flex items-center gap-16">

                    {/* ── Left column: branding + stats ── */}
                    <div className="flex-1 hidden lg:block">
                        <div className="animate-slide-up">
                            <h1 className="text-5xl font-black text-slate-800 leading-tight mb-4">
                                Hospital<br/>
                                <span className="text-sky-500">Intelligence</span><br/>
                                Platform
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-sm">
                                Real-time KPI monitoring, anomaly detection, and AI-powered insights for PrimeCare Medical Hospital.
                            </p>
                        </div>

                        {/* Platform Features */}
                        <div className="grid grid-cols-2 gap-4 animate-slide-up stagger-2">
                            {PLATFORM_FEATURES.map((feature, i) => {
                                const Icon = feature.icon
                                const c = COLOR_MAP[feature.color]
                                return (
                                    <div
                                        key={i}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
                                        style={{ animationDelay: `${i * 0.08}s` }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} ${c.border} border`}>
                                            <Icon size={18} className={c.icon} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold mb-1 ${c.text}`}>{feature.title}</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Right column: login form ── */}
                    <div className="w-full max-w-md shrink-0">

                        {/* Secure badge */}
                        <div className="flex justify-center mb-5 animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                                <Shield size={12} className="text-sky-500" />
                                <span className="text-xs font-semibold text-slate-600">Secure Authentication Portal</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                        </div>

                        {/* Card */}
                        <div
                            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/60 animate-slide-up"
                            style={{ animationDelay: '0.08s' }}
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back</h2>
                                <p className="text-sm text-slate-400">Sign in to your dashboard</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Username */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={e => { setUsername(e.target.value); setError('') }}
                                            placeholder="Enter username"
                                            autoComplete="username"
                                            className="input-field w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); setError('') }}
                                            placeholder="Enter password"
                                            autoComplete="current-password"
                                            className="input-field w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 animate-slide-up">
                                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-sky-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Sign In to Dashboard
                                            <ChevronRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Demo credentials */}
                            <div className="mt-5 pt-5 border-t border-slate-100">
                                <button
                                    onClick={() => setShowCreds(!showCreds)}
                                    className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-600 transition-colors mb-2"
                                >
                                    <span className="font-bold uppercase tracking-wide">Demo Credentials</span>
                                    <ChevronRight size={13} className={`transition-transform duration-200 ${showCreds ? 'rotate-90' : ''}`} />
                                </button>

                                {showCreds && (
                                    <div className="space-y-1.5 animate-slide-up">
                                        {DEMO_CREDENTIALS.map((cred) => {
                                            const Icon = cred.icon
                                            const c = COLOR_MAP[cred.color]
                                            return (
                                                <button
                                                    key={cred.username}
                                                    type="button"
                                                    onClick={() => { setUsername(cred.username); setPassword(cred.password); setError('') }}
                                                    onMouseEnter={() => setHoveredCred(cred.username)}
                                                    onMouseLeave={() => setHoveredCred(null)}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl border transition-all ${hoveredCred === cred.username ? `${c.bg} ${c.border}` : 'bg-slate-50 border-slate-100'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hoveredCred === cred.username ? c.bg : 'bg-white border border-slate-200'}`}>
                                                            <Icon size={13} className={hoveredCred === cred.username ? c.icon : 'text-slate-400'} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={`text-xs font-bold transition-colors ${hoveredCred === cred.username ? c.text : 'text-slate-700'}`}>{cred.label}</p>
                                                            <p className="text-[10px] text-slate-400">{cred.username} · {cred.password}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={11} className={`transition-colors ${hoveredCred === cred.username ? c.icon : 'text-slate-300'}`} />
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-center text-[11px] text-slate-400 mt-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            PrimeCare Medical Hospital · NABH Accredited · Chennai, Tamil Nadu
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200 bg-white py-3.5">
                <p className="text-center text-[11px] text-slate-400">
                    PrimeCare Medical Hospital · NABH Accredited · Chennai, Tamil Nadu
                </p>
            </footer>
        </div>
    )
}
