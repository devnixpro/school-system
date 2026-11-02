"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, ArrowLeft, Bell, BookOpen, CalendarDays, Check,
  ChevronDown, CircleHelp, CreditCard, GraduationCap, House, LayoutDashboard,
  LogOut, Menu, MessageSquare, Receipt, Search, Settings, ShieldCheck, Users, Moon, Sun,
  Wallet, X, ChartNoAxesCombined, Clock3, FileText, Heart, Sparkles, UserRound,
  ClipboardCheck, BookMarked, CalendarCheck, CircleDollarSign, Mail, ChevronRight, ChevronUp
} from "lucide-react";
import { children, attendanceRecords, feeRecords, events, activities } from "../../data/parentDemoData";

const money = (amount) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);

function Brand() {
  return <div className="brand">
    <div className="brand-mark"><GraduationCap size={24} strokeWidth={2.3} /></div>
    <div><div className="brand-name">DevNix<span>Edu</span></div><div className="brand-sub">Smart School Management</div></div>
  </div>;
}

function Sidebar({ active, setActive, open, close }) {
  const links = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "My Children", icon: Users, page: "children" },
    { label: "Attendance", icon: CalendarCheck, page: "attendance" },
    { label: "Results & Exams", icon: ChartNoAxesCombined, page: "results" },
    { label: "Fee Management", icon: Wallet, page: "fees" },
    { label: "Homework", icon: BookOpen, page: "homework" },
    { label: "Timetable", icon: CalendarDays, page: "timetable" },
    { label: "Notice Board", icon: MessageSquare, page: "notices" },
  ];
  return <>
    {open && <button className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" aria-label="Close navigation" onClick={close} />}
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <Brand />
      <div className="side-label">Parent portal</div>
      <nav className="side-nav">
        {links.map(({ label, icon: Icon, page }) => <button key={page} className={`nav-link ${active === page ? "active" : ""}`} onClick={() => { setActive(page); close(); }}>
          <Icon size={17} strokeWidth={1.9} /><span>{label}</span>{active === page && <ChevronRight size={15} className="ml-auto" />}
        </button>)}
      </nav>
      <div className="side-label mt-7">Preferences</div>
      <nav className="side-nav">
        <button className={`nav-link ${active === "settings" ? "active" : ""}`} onClick={() => { setActive("settings"); close(); }}><Settings size={17}/><span>Settings</span></button>
        <button className={`nav-link ${active === "support" ? "active" : ""}`} onClick={() => { setActive("support"); close(); }}><CircleHelp size={17}/><span>Help & Support</span></button>
      </nav>
      <div className="sidebar-spacer" />
      <div className="help-card">
        <div className="flex items-center gap-2 mb-2"><div className="rounded-lg bg-blue-500/15 p-2 text-blue-300"><Heart size={16}/></div><div className="help-card-title">We're here to help</div></div>
        <p>Need assistance with your child's school account? Our support team is ready to help.</p>
        <button className="help-button" onClick={() => setActive("support")}>Contact Support</button>
      </div>
      <div className="sidebar-foot">DevNixEdu Parent Portal v1.0<br/>© 2026 DevNixPro</div>
    </aside>
  </>;
}

function Topbar({ onMenu, onToast, selectedChild, theme, onToggleTheme, onLogout, userName, onBack, canGoBack, pageTitle }) {
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState("");
  return <header className="topbar">
    <div className="top-left">
      <button className="icon-button" onClick={onBack} disabled={!canGoBack} aria-label="Go to previous page" title={canGoBack ? "Go to previous page" : "You are at the first page"} style={{opacity:canGoBack?1:.4,cursor:canGoBack?"pointer":"not-allowed"}}><ArrowLeft size={18}/></button>
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={18}/></button>
      <div className="breadcrumb"><button onClick={() => window.dispatchEvent(new CustomEvent("devnixedu-go-dashboard"))} title="Go to Dashboard">Parent Portal</button> <span className="mx-2 text-slate-300">/</span><strong>{pageTitle || selectedChild?.name || "Overview"}</strong></div>
    </div>
    <div className="search-wrap">
      <Search size={15} className="search-icon"/>
      <input aria-label="Search portal" placeholder="Search attendance, fees, homework..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && onToast(query ? `Search ready for “${query}” in this demo.` : "Type something to search.")}/>
    </div>
    <div className="top-actions">
      <button className="icon-button theme-toggle" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={onToggleTheme}>{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>
      <div className="relative">
        <button className="icon-button" aria-label="Notifications" onClick={() => setPanel(panel === "notifications" ? "" : "notifications")}><Bell size={19}/><span className="notification-dot"/></button>
        {panel === "notifications" && <div className="popover"><h4>Notifications</h4><p>October fee invoice is ready to view.</p><p>Parent–Teacher Meeting is scheduled for 12 October.</p><button className="text-link" onClick={() => setPanel("")}>Mark as read</button></div>}
      </div>
      <button className="icon-button hidden sm:inline-flex" aria-label="Messages" onClick={() => onToast("No new messages in this demo.")}><MessageSquare size={18}/></button>
      <div className="relative">
        <button className="profile-button" onClick={() => setPanel(panel === "profile" ? "" : "profile")}>
          <div className="avatar">MA</div><div className="profile-copy"><strong>{userName}</strong><span>Parent Account</span></div><ChevronDown size={14} className="profile-chevron text-slate-400"/>
        </button>
        {panel === "profile" && <div className="popover" style={{width:190}}><h4>{userName}</h4><p>Parent account · Demo mode</p><button className="nav-link w-full !text-slate-600 !px-2" onClick={() => {setPanel(""); onToast("Profile settings are demo-only.");}}><Settings size={15}/> Profile settings</button><button className="nav-link w-full !text-slate-600 !px-2" onClick={() => {setPanel(""); onLogout();}}><LogOut size={15}/> Sign out</button></div>}
      </div>
    </div>
  </header>;
}

function PageHeading({ eyebrow, title, subtitle, right }) {
  return <div className="welcome-row"><div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1><p className="page-subtitle">{subtitle}</p></div>{right && <div className="date-pill"><CalendarDays size={14}/>{right}</div>}</div>;
}

function StatCard({ icon: Icon, label, value, note, tint, ink, trend }) {
  return <div className="stat-card"><div className="stat-top"><div className="stat-icon" style={{background:tint,color:ink}}><Icon size={19}/></div>{trend && <span className="stat-trend">{trend}</span>}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}

function Panel({ title, subtitle, action, onAction, children }) {
  return <section className="panel"><div className="panel-header"><div><h2 className="panel-title">{title}</h2>{subtitle && <div className="panel-subtitle">{subtitle}</div>}</div>{action && <button className="text-link" onClick={onAction}>{action} <ArrowRight size={12} className="inline ml-1"/></button>}</div>{children}</section>;
}

function ChildSwitcher({ selected, onSelect }) {
  return <div className="flex flex-wrap gap-3 mb-5">
    {children.map(child => <button key={child.id} onClick={() => onSelect(child.id)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected === child.id ? "border-blue-300 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200"}`}>
      <div className="child-avatar" style={{background:child.color,color:child.ink}}>{child.initials}</div>
      <div><strong className="block text-xs text-slate-800">{child.name}</strong><span className="mt-1 block text-[10px] text-slate-400">{child.className} · {child.section}</span></div>
      {selected === child.id && <Check size={15} className="ml-2 text-blue-600"/>}
    </button>)}
  </div>;
}

function AttendanceDonut({ attendance }) {
  return <div className="attendance-visual"><div className="donut" style={{background:`conic-gradient(#0ca876 0 ${attendance}%, #f5b943 ${attendance}% ${Math.min(attendance+4,100)}%, #f1f4f8 ${Math.min(attendance+4,100)}% 100%)`}}><div className="donut-inner"><strong>{attendance}%</strong><span>Attendance</span></div></div><div className="legend">
    <div className="legend-row"><span className="legend-label"><i className="legend-dot" style={{background:"#0ca876"}}/>Present</span><strong>{attendance}%</strong></div>
    <div className="legend-row"><span className="legend-label"><i className="legend-dot" style={{background:"#f5b943"}}/>Late</span><strong>4%</strong></div>
    <div className="legend-row"><span className="legend-label"><i className="legend-dot" style={{background:"#dfe6ef"}}/>Absent / Leave</span><strong>{Math.max(0,96-attendance)}%</strong></div>
  </div></div>;
}

function DashboardPage({ child, setPage, onToast, setSelectedId, accountName }) {
  return <>
    <PageHeading eyebrow="Your family at a glance" title={`Welcome back, ${accountName} 👋`} subtitle="Here’s the latest update on your children's school life." right="Friday, 09 October 2026"/>
    <div className="hero-panel"><div className="hero-content"><div className="hero-tag"><Sparkles size={13}/> FAMILY LEARNING HUB</div><h2>Every small step builds a brighter future.</h2><p>Stay connected with attendance, academic progress, fee updates and important school events — all in one place.</p></div><div className="hero-art"><GraduationCap className="big-cap" size={83} strokeWidth={1.2}/><div className="mini-card"><ShieldCheck size={25}/></div></div></div>
    <ChildSwitcher selected={child.id} onSelect={id => { setSelectedId(id); onToast(`Viewing ${children.find(c=>c.id===id).name}'s overview.`); }} />
    <div className="stats-grid">
      <StatCard icon={CalendarCheck} label="Attendance rate" value={`${child.attendance}%`} note="This academic term" tint="#e8faf2" ink="#079765" trend="On track"/>
      <StatCard icon={ChartNoAxesCombined} label="Academic average" value={child.average} note="Latest term performance" tint="#eeeaff" ink="#7855e9" trend="Good progress"/>
      <StatCard icon={Wallet} label="Outstanding fees" value={money(child.feeDue)} note="Current balance due" tint="#fff3e4" ink="#e18a17" />
      <StatCard icon={BookOpen} label="Homework to review" value={child.homework} note="Across assigned subjects" tint="#eaf4ff" ink="#0877e4" />
    </div>
    <div className="content-grid">
      <div className="stack">
        <Panel title="Attendance overview" subtitle={`Monthly snapshot for ${child.name}`} action="View attendance" onAction={() => setPage("attendance")}><AttendanceDonut attendance={child.attendance}/><div className="progress-row"><span>Attendance target</span><strong className="text-slate-700">95%</strong></div><div className="progress-track"><div className="progress-fill" style={{width:`${child.attendance}%`}}/></div><div className="text-[10px] text-slate-400 mt-2">{child.attendance >= 95 ? "Great work — target achieved!" : `${95-child.attendance}% more needed to reach the school target.`}</div></Panel>
        <Panel title="Recent attendance" subtitle="Latest marked school days" action="Full history" onAction={() => setPage("attendance")}>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>DATE</th><th>DAY</th><th>STATUS</th></tr></thead><tbody>{attendanceRecords.slice(0,4).map((r,i)=><tr key={r.date}><td><strong>{r.date}</strong></td><td>{r.day}</td><td><span className={`pill ${r.status==="Present"?"green":r.status==="Late"?"orange":"red"}`}>{r.status}</span></td></tr>)}</tbody></table></div>
        </Panel>
      </div>
      <div className="stack">
        <Panel title="Fee summary" subtitle="Your child's current fee status" action="Manage fees" onAction={() => setPage("fees")}>
          <div className="rounded-xl bg-blue-50 p-4 mb-3"><div className="text-[10px] text-blue-700">Outstanding balance</div><div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">{money(child.feeDue)}</div><div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500"><Clock3 size={12}/> Due date: 15 October 2026</div></div>
          {feeRecords.slice(0,3).map(f=><div className="fee-summary" key={f.id}><div><strong>{f.month}</strong><span>{f.title}</span></div><div className="text-right"><div className="fee-amount">{money(f.amount)}</div><span className={`pill ${f.status==="Paid"?"green":"orange"} mt-2`}>{f.status}</span></div></div>)}
          <button className="secondary-button w-full mt-3" onClick={() => onToast("A fee statement would be downloaded in the connected version.")}><ArrowDownToLine size={14}/> Download fee statement</button>
        </Panel>
        <Panel title="Upcoming events" subtitle="Important dates to remember" action="View calendar" onAction={() => setPage("timetable")}>
          {events.map(e=><div className="event-item" key={e.title}><div className="event-date" style={{background:e.tint,color:e.ink}}><strong>{e.day}</strong><span>{e.month}</span></div><div className="event-copy"><strong>{e.title}</strong><span>{e.detail}</span></div></div>)}
        </Panel>
        <Panel title="Recent activity" subtitle="Latest updates from school">
          {activities.map((a,i)=><div className="activity-item" key={a.title}><div className="activity-icon">{i===0?<CalendarCheck size={15}/>:i===1?<Receipt size={15}/>:<BookOpen size={15}/>}</div><div className="activity-copy"><strong>{a.title}</strong><span>{a.time}</span></div></div>)}
        </Panel>
      </div>
    </div>
  </>;
}

function ChildrenPage({ selected, setSelected, setPage }) {
  return <>
    <PageHeading eyebrow="Family profiles" title="My Children" subtitle="Choose a child to review their school information." right={`${children.length} linked children`}/>
    <ChildSwitcher selected={selected} onSelect={setSelected}/>
    <div className="grid gap-4 md:grid-cols-2">{children.map(child=><div key={child.id} className="panel">
      <div className="flex items-center gap-4"><div className="child-avatar !h-14 !w-14 !text-base" style={{background:child.color,color:child.ink}}>{child.initials}</div><div className="flex-1"><h3 className="m-0 text-sm font-extrabold text-slate-800">{child.name}</h3><p className="mt-1 text-[11px] text-slate-400">{child.className} · {child.section}</p><p className="mt-1 text-[10px] text-slate-400">Roll no. {child.rollNo}</p></div><span className="pill green">Active</span></div>
      <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg bg-slate-50 p-3"><div className="text-[10px] text-slate-400">Attendance</div><div className="mt-1 text-lg font-extrabold text-slate-800">{child.attendance}%</div></div><div className="rounded-lg bg-slate-50 p-3"><div className="text-[10px] text-slate-400">Academic average</div><div className="mt-1 text-lg font-extrabold text-slate-800">{child.average}</div></div></div>
      <div className="mt-4 flex flex-wrap gap-2"><button className="primary-button" onClick={()=>{setSelected(child.id);setPage("dashboard");}}>View dashboard <ArrowRight size={14}/></button><button className="secondary-button" onClick={()=>{setSelected(child.id);setPage("attendance");}}>Attendance</button></div>
    </div>)}</div>
  </>;
}

function AttendancePage({ child }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const records = useMemo(()=>attendanceRecords.filter(r=>(filter==="All"||r.status===filter)&&`${r.date} ${r.day} ${r.status}`.toLowerCase().includes(search.toLowerCase())),[filter,search]);
  return <>
    <PageHeading eyebrow="Daily tracking" title="Attendance History" subtitle={`Review ${child.name}'s attendance record and monthly status.`} right="October 2026"/>
    <div className="stats-grid"><StatCard icon={CalendarCheck} label="Present days" value={child.present} note="Recorded this month" tint="#e8faf2" ink="#079765"/><StatCard icon={Clock3} label="Late arrivals" value={child.late} note="Please aim to arrive on time" tint="#fff3e4" ink="#e18a17"/><StatCard icon={X} label="Absent days" value={child.absent} note="Recorded this month" tint="#fff0f1" ink="#d83b4b"/><StatCard icon={ChartNoAxesCombined} label="Attendance rate" value={`${child.attendance}%`} note="School target: 95%" tint="#eaf4ff" ink="#0877e4"/></div>
    <Panel title="Attendance records" subtitle="Demo records for the current month">
      <div className="filter-row"><input className="filter-control min-w-[190px] flex-1" placeholder="Search date or day..." value={search} onChange={e=>setSearch(e.target.value)}/><select className="filter-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Present</option><option>Absent</option><option>Late</option></select><button className="secondary-button" onClick={()=>{setSearch("");setFilter("All");}}>Reset</button></div>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>DATE</th><th>DAY</th><th>SESSION</th><th>STATUS</th></tr></thead><tbody>{records.map(r=><tr key={r.date}><td><strong>{r.date}</strong></td><td>{r.day}</td><td>{r.subject}</td><td><span className={`pill ${r.status==="Present"?"green":r.status==="Late"?"orange":"red"}`}>{r.status}</span></td></tr>)}</tbody></table>{records.length===0&&<div className="empty-state">No attendance records match your search.</div>}</div>
    </Panel>
  </>;
}

function FeesPage({ child, onToast }) {
  const [filter,setFilter] = useState("All");
  const [month,setMonth] = useState("All months");
  const [paidIds,setPaidIds] = useState([]);
  const rows = useMemo(()=>feeRecords.filter(f=>(filter==="All"||f.status===filter)&&(month==="All months"||f.month===month)),[filter,month]);
  const statusOf = f => paidIds.includes(f.id) ? "Paid" : f.status;
  const due = feeRecords.filter(f=>statusOf(f)!=="Paid").reduce((sum,f)=>sum+f.amount,0);
  return <>
    <PageHeading eyebrow="Payments & invoices" title="Fee Management" subtitle={`Track invoices and payment status for ${child.name}.`} right="Academic year 2026–27"/>
    <div className="stats-grid"><StatCard icon={Wallet} label="Outstanding balance" value={money(child.feeDue)} note="Current account summary" tint="#fff3e4" ink="#e18a17"/><StatCard icon={Check} label="Paid invoices" value={feeRecords.filter(f=>statusOf(f)==="Paid").length+paidIds.length} note="Payment records" tint="#e8faf2" ink="#079765"/><StatCard icon={Receipt} label="Total invoices" value={feeRecords.length} note="Available in this demo" tint="#eaf4ff" ink="#0877e4"/><StatCard icon={CalendarDays} label="Next due date" value="15 Oct" note="October tuition fee" tint="#eeeaff" ink="#7855e9"/></div>
    <Panel title="Invoices & payment status" subtitle="Sample invoice records — no real payment processing">
      <div className="filter-row"><select className="filter-control" value={month} onChange={e=>setMonth(e.target.value)}><option>All months</option>{feeRecords.map(f=><option key={f.id}>{f.month}</option>)}</select><select className="filter-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Paid</option><option>Pending</option></select><button className="secondary-button" onClick={()=>{setMonth("All months");setFilter("All");}}>Reset filters</button></div>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>INVOICE</th><th>DESCRIPTION</th><th>MONTH</th><th>AMOUNT</th><th>DUE DATE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{rows.map(f=><tr key={f.id}><td><strong>{f.id}</strong></td><td>{f.title}</td><td>{f.month}</td><td><strong>{money(f.amount)}</strong></td><td>{f.due}</td><td><span className={`pill ${statusOf(f)==="Paid"?"green":"orange"}`}>{statusOf(f)}</span></td><td>{statusOf(f)==="Paid"?<button className="text-link" onClick={()=>onToast(`Receipt ${f.id} is demo-only.`)}>Receipt</button>:<button className="text-link" onClick={()=>onToast("Online payment is not connected. This is a frontend-only demo.")}>Pay now</button>}</td></tr>)}</tbody></table>{rows.length===0&&<div className="empty-state">No invoices match these filters.</div>}</div>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-3"><div><div className="text-[10px] text-slate-400">Demo outstanding total</div><div className="mt-1 text-xl font-extrabold text-slate-800">{money(due)}</div></div><button className="secondary-button" onClick={()=>onToast("Statement export is a placeholder in this demo.")}><ArrowDownToLine size={14}/> Export statement</button></div>
    </Panel>
  </>;
}

function PlaceholderPage({ page, onToast }) {
  const info = {
    results: { icon: ChartNoAxesCombined, title: "Results & Exams", subtitle: "Review exam schedules, subject results and academic progress." , action:"View sample results"},
    homework: { icon: BookMarked, title: "Homework", subtitle: "Keep track of assigned work and upcoming submission dates.", action:"Show homework list"},
    timetable: { icon: CalendarDays, title: "Timetable & Events", subtitle: "A simple view of important dates and school activities.", action:"View upcoming events"},
    notices: { icon: Mail, title: "Notice Board", subtitle: "Important school notices and announcements for your family.", action:"Check announcements"},
    settings: { icon: Settings, title: "Settings", subtitle: "Manage your display preferences in this frontend demo.", action:"Save preferences"},
    support: { icon: CircleHelp, title: "Help & Support", subtitle: "Need help with a fee, attendance record or school update?", action:"Contact support"},
  };
  const item = info[page] || info.results; const Icon = item.icon;
  return <><PageHeading eyebrow="Parent resources" title={item.title} subtitle={item.subtitle} right="Demo portal"/><div className="panel max-w-3xl"><div className="flex items-start gap-4"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon size={25}/></div><div><h2 className="panel-title">{item.title}</h2><p className="page-subtitle !mt-2">This section is included in the navigation and will be expanded as part of the frontend module. No backend services are connected.</p><button className="primary-button mt-5" onClick={()=>onToast(`${item.title}: demo interaction only.`)}>{item.action} <ArrowRight size={14}/></button></div></div></div></>;
}


function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("parent@devnixedu.com");
  const [password, setPassword] = useState("Parent@123");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      if (email.trim().toLowerCase() === "parent@devnixedu.com" && password === "Parent@123") {
        onLogin("Mohsin Ali");
      } else {
        setError("Demo login details match nahi huay. Neeche diye gaye credentials use karein.");
      }
    } else {
      if (!name.trim() || !email.trim() || password.length < 6) {
        setError("Name aur email fill karein; password kam az kam 6 characters ka ho.");
        return;
      }
      onLogin(name.trim());
    }
  };
  return <div className="auth-screen">
    <div className="auth-brand"><div className="brand-mark"><GraduationCap size={25}/></div><div><div className="brand-name">DevNix<span>Edu</span></div><div className="brand-sub">Smart School Management</div></div></div>
    <div className="auth-layout">
      <div className="auth-intro"><div className="auth-kicker"><Sparkles size={14}/> YOUR CHILD'S SCHOOL, IN ONE PLACE</div><h1>Every school update.<br/><span>One simple portal.</span></h1><p>Attendance, fees, academic progress and school updates — all together for parents.</p><div className="auth-feature"><span><CalendarCheck size={18}/></span><div><strong>Stay informed</strong><small>Follow attendance and school activity</small></div></div><div className="auth-feature"><span><Wallet size={18}/></span><div><strong>Manage with clarity</strong><small>Review fee invoices and payment status</small></div></div></div>
      <div className="auth-card"><div className="auth-tabs"><button className={mode === "login" ? "selected" : ""} onClick={()=>{setMode("login");setError("")}}>Login</button><button className={mode === "signup" ? "selected" : ""} onClick={()=>{setMode("signup");setError("")}}>Sign up</button></div>
        <h2>{mode === "login" ? "Welcome back" : "Create parent account"}</h2><p className="auth-description">{mode === "login" ? "Enter your details to access the parent portal." : "Create a demo account to preview the portal."}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Mohsin Ali" autoComplete="name"/></label>}
          <label>Email address<div className="auth-input-icon"><Mail size={16}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="parent@example.com" autoComplete="email" required/></div></label>
          <label>Password<div className="auth-input-icon"><ShieldCheck size={16}/><input type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6}/><button type="button" className="password-toggle" onClick={()=>setShowPassword(v=>!v)}>{showPassword ? "Hide" : "Show"}</button></div></label>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-submit" type="submit">{mode === "login" ? "Login to Parent Portal" : "Create demo account"}<ArrowRight size={16}/></button>
        </form>
        {mode === "login" && <div className="demo-credentials"><strong>Demo credentials</strong><div>Email: <code>parent@devnixedu.com</code></div><div>Password: <code>Parent@123</code></div><button onClick={()=>{setEmail("parent@devnixedu.com");setPassword("Parent@123");setError("")}}>Use demo credentials</button></div>}
        <div className="auth-note">Frontend demo only · Authentication is not connected to a backend.</div>
      </div>
    </div>
  </div>;
}

export default function ParentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountName, setAccountName] = useState("Mohsin Ali");
  const [active, setActive] = useState("dashboard");
  const [pageHistory, setPageHistory] = useState(["dashboard"]);
  const navigatePage = (page) => { setActive(current => { if (current !== page) setPageHistory(history => [...history, page]); return page; }); };
  const goBack = () => setPageHistory(history => { if (history.length <= 1) return history; const next = history.slice(0, -1); setActive(next[next.length - 1]); return next; });
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("devnixedu-theme");
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("devnixedu-theme", theme);
  }, [theme]);
  const [selectedId, setSelectedId] = useState("sara");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const selectedChild = children.find(c=>c.id===selectedId) || children[0];
  const showToast = (message) => { setToast(message); setTimeout(()=>setToast(""),2800); };
  const changeChild = id => { setSelectedId(id); showToast(`Selected ${children.find(c=>c.id===id).name}.`); };
  const pageTitles = {dashboard:"Dashboard",children:"My Children",attendance:"Attendance",fees:"Fee Management",results:"Results & Exams",homework:"Homework",timetable:"Timetable",notices:"Notice Board",settings:"Settings",support:"Help & Support"};
  useEffect(() => { const handler = () => navigatePage("dashboard"); window.addEventListener("devnixedu-go-dashboard", handler); return () => window.removeEventListener("devnixedu-go-dashboard", handler); }, []);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 240);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [active]);
  if (!isAuthenticated) return <AuthScreen onLogin={(name) => { setAccountName(name); setIsAuthenticated(true); showAuthSession(); }} />;
  function showAuthSession() { if (typeof window !== "undefined") window.localStorage.setItem("devnixedu-demo-auth", "true"); }
  return <div className="app-shell">
    <Sidebar active={active} setActive={navigatePage} open={mobileOpen} close={()=>setMobileOpen(false)}/>
    <main className="main-area">
      <Topbar onMenu={()=>setMobileOpen(true)} onToast={showToast} selectedChild={selectedChild} userName={accountName} theme={theme} pageTitle={pageTitles[active]} canGoBack={pageHistory.length > 1} onBack={goBack} onToggleTheme={()=>setTheme(current => current === "dark" ? "light" : "dark")} onLogout={()=>{setIsAuthenticated(false); if (typeof window !== "undefined") window.localStorage.removeItem("devnixedu-demo-auth");}}/>
      <div className="page-content">
        {active !== "dashboard" && <div className="mb-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={goBack} disabled={pageHistory.length <= 1} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40" title="Return to the previous page">
            <ArrowLeft size={16} /> Back to previous page
          </button>
          <button type="button" onClick={() => navigatePage("dashboard")} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50" title="Return to Parent Dashboard">
            <House size={15} /> Parent Dashboard
          </button>
        </div>}
        {active==="dashboard" && <DashboardPage child={selectedChild} setPage={navigatePage} onToast={showToast} setSelectedId={setSelectedId} accountName={accountName}/>}
        {active==="children" && <ChildrenPage selected={selectedId} setSelected={changeChild} setPage={navigatePage}/>}
        {active==="attendance" && <AttendancePage child={selectedChild}/>}
        {active==="fees" && <FeesPage child={selectedChild} onToast={showToast}/>}
        {["results","homework","timetable","notices","settings","support"].includes(active) && <PlaceholderPage page={active} onToast={showToast}/>}
      </div>
      <footer className="footer"><span>© 2026 DevNixPro · DevNixEdu Parent Portal</span><span className="flex items-center gap-2"><ShieldCheck size={12}/> Frontend demo · Sample data only</span></footer>
    </main>
    {showScrollTop && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top" title="Back to top" className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
      <ChevronUp size={23} />
    </button>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

