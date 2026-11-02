"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, ArrowLeft, Bell, BookOpen, CalendarDays, CalendarCheck,
  ChartNoAxesCombined, Check, ChevronDown, ChevronRight, CircleHelp, CreditCard,
  GraduationCap, House, LayoutDashboard, LogOut, Menu, MessageSquare, Moon, Sun,
  Search, Settings, ShieldCheck, Users, Wallet, X, Clock3, Receipt, Mail,
  BookMarked, ClipboardCheck
} from "lucide-react";
import { parentAuth, parentData } from "../../services/parentApi";

const money = (amount = 0) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0
}).format(Number(amount) || 0);

const idOf = (item) => item?._id || item?.id;
const nameOf = (item) => item?.name || "Student";
const statusClass = (status = "") => {
  const s = String(status).toLowerCase();
  if (["present", "paid", "submitted", "published"].includes(s)) return "green";
  if (["late", "pending", "partial", "in progress"].includes(s)) return "orange";
  return "red";
};
const prettyStatus = (status = "") => String(status).replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
const dateText = (value) => value ? new Date(value).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function Brand() {
  return <div className="brand"><div className="brand-mark"><GraduationCap size={24}/></div><div><div className="brand-name">DevNix<span>Edu</span></div><div className="brand-sub">Smart School Management</div></div></div>;
}

function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setError(""); setBusy(true);
    try { await onLogin(email, password); }
    catch (err) { setError(err?.response?.data?.message || err.message || "Login failed. Please try again."); }
    finally { setBusy(false); }
  };
  return <div className="auth-screen">
    <div className="auth-brand"><Brand/></div>
    <div className="auth-layout">
      <div className="auth-intro"><div className="auth-kicker"><ShieldCheck size={14}/> SECURE PARENT ACCESS</div><h1>Every school update.<br/><span>One simple portal.</span></h1><p>Access your children&apos;s attendance, fees, results and homework using your registered parent account.</p><div className="auth-feature"><span><CalendarCheck size={18}/></span><div><strong>Stay informed</strong><small>Review attendance and school records</small></div></div><div className="auth-feature"><span><Wallet size={18}/></span><div><strong>Manage with clarity</strong><small>View invoices and outstanding balances</small></div></div></div>
      <div className="auth-card"><h2>Welcome back</h2><p className="auth-description">Sign in with the parent account provided by your school.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email address<div className="auth-input-icon"><Mail size={16}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="parent@example.com" autoComplete="username" required/></div></label>
          <label>Password<div className="auth-input-icon"><ShieldCheck size={16}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required/></div></label>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Signing in..." : "Login to Parent Portal"} <ArrowRight size={16}/></button>
        </form>
        <div className="auth-note">Parent accounts are created or linked by your school administrator. Demo credentials are disabled.</div>
      </div>
    </div>
  </div>;
}

function Sidebar({ active, setActive, open, close, onLogout }) {
  const links = [
    ["Dashboard", LayoutDashboard, "dashboard"], ["My Children", Users, "children"],
    ["Attendance", CalendarCheck, "attendance"], ["Results & Exams", ChartNoAxesCombined, "results"],
    ["Fee Management", Wallet, "fees"], ["Homework", BookOpen, "homework"],
    ["Timetable", CalendarDays, "timetable"], ["Notice Board", MessageSquare, "notices"],
  ];
  return <>
    {open && <button className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" aria-label="Close navigation" onClick={close}/>}
    <aside className={`sidebar ${open ? "open" : ""}`}><Brand/><div className="side-label">Parent portal</div>
      <nav className="side-nav">{links.map(([label, Icon, page])=><button key={page} className={`nav-link ${active===page?"active":""}`} onClick={()=>{setActive(page);close();}}><Icon size={17}/><span>{label}</span>{active===page&&<ChevronRight size={15} className="ml-auto"/>}</button>)}</nav>
      <div className="side-label mt-7">Account</div><nav className="side-nav">
        <button className={`nav-link ${active==="settings"?"active":""}`} onClick={()=>{setActive("settings");close();}}><Settings size={17}/><span>Settings</span></button>
        <button className={`nav-link ${active==="support"?"active":""}`} onClick={()=>{setActive("support");close();}}><CircleHelp size={17}/><span>Help & Support</span></button>
        <button className="nav-link" onClick={onLogout}><LogOut size={17}/><span>Sign out</span></button>
      </nav>
      <div className="sidebar-spacer"/><div className="sidebar-foot">DevNixEdu Parent Portal<br/>© 2026 DevNixPro</div>
    </aside>
  </>;
}

function Topbar({ onMenu, user, theme, onToggleTheme, onLogout, onBack, canGoBack, pageTitle, child }) {
  return <header className="topbar"><div className="top-left">
    <button className="icon-button" onClick={onBack} disabled={!canGoBack} aria-label="Go back"><ArrowLeft size={18}/></button>
    <button className="mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={18}/></button>
    <div className="breadcrumb"><strong>Parent Portal</strong><span className="mx-2 text-slate-300">/</span>{pageTitle || child?.name || "Dashboard"}</div>
  </div><div className="top-actions">
    <button className="icon-button theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
    <div className="profile-button"><div className="avatar">{(user?.name||"P").split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}</div><div className="profile-copy"><strong>{user?.name||"Parent"}</strong><span>Parent Account</span></div><button className="icon-button" onClick={onLogout} title="Sign out"><LogOut size={16}/></button></div>
  </div></header>;
}

function Heading({ eyebrow, title, subtitle }) {
  return <div className="welcome-row"><div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1><p className="page-subtitle">{subtitle}</p></div></div>;
}
function Panel({ title, subtitle, children }) {
  return <section className="panel"><div className="panel-header"><div><h2 className="panel-title">{title}</h2>{subtitle&&<div className="panel-subtitle">{subtitle}</div>}</div></div>{children}</section>;
}
function Stat({ icon: Icon, label, value, note, tint="#eaf4ff", ink="#0877e4" }) {
  return <div className="stat-card"><div className="stat-top"><div className="stat-icon" style={{background:tint,color:ink}}><Icon size={19}/></div></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}
function Empty({ children="No records available." }) { return <div className="empty-state">{children}</div>; }
function Loading() { return <div className="panel"><div className="empty-state">Loading records from school server...</div></div>; }
function ErrorPanel({ message, retry }) { return <div className="panel"><div className="auth-error">{message}</div>{retry&&<button className="secondary-button mt-3" onClick={retry}>Try again</button>}</div>; }

function ChildPicker({ childList, selectedId, onSelect }) {
  if (!childList.length) return <Empty>No children are linked to this parent account yet. Please contact your school administrator.</Empty>;
  return <div className="flex flex-wrap gap-3 mb-5">{childList.map((child,i)=>{
    const id=idOf(child), selected=id===selectedId, colors=[["#eaf4ff","#0872e4"],["#f2eaff","#7c3aed"],["#e8faf2","#079765"]];
    const [bg,fg]=colors[i%colors.length];
    return <button key={id} onClick={()=>onSelect(id)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected?"border-blue-300 bg-blue-50 shadow-sm":"border-slate-200 bg-white hover:border-blue-200"}`}>
      <div className="child-avatar" style={{background:bg,color:fg}}>{nameOf(child).split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}</div>
      <div><strong className="block text-xs text-slate-800">{nameOf(child)}</strong><span className="mt-1 block text-[10px] text-slate-400">{child.className||child.class||"Class not assigned"} · {child.section||"—"}</span></div>
      {selected&&<Check size={15} className="ml-2 text-blue-600"/>}
    </button>;
  })}</div>;
}

function Dashboard({ child, summary, attendance, fees, homework, go }) {
  const records=attendance?.records||[];
  const due=fees?.totals?.due ?? summary?.feeDue ?? 0;
  return <>
    <Heading eyebrow="Your family at a glance" title={`Welcome back 👋`} subtitle={`Here is the latest school information for ${nameOf(child)}.`}/>
    <div className="hero-panel"><div className="hero-content"><div className="hero-tag"><ShieldCheck size={13}/> FAMILY LEARNING HUB</div><h2>Every small step builds a brighter future.</h2><p>Review attendance, academic results, fee updates and homework from your child&apos;s school.</p></div><div className="hero-art"><GraduationCap className="big-cap" size={83}/></div></div>
    <div className="stats-grid">
      <Stat icon={CalendarCheck} label="Attendance rate" value={`${summary?.attendancePercentage??attendance?.summary?.percentage??0}%`} note="Based on available records" tint="#e8faf2" ink="#079765"/>
      <Stat icon={ChartNoAxesCombined} label="Present days" value={summary?.present??attendance?.summary?.present??0} note="Recorded attendance" tint="#eeeaff" ink="#7855e9"/>
      <Stat icon={Wallet} label="Outstanding fees" value={money(due)} note="Current balance due" tint="#fff3e4" ink="#e18a17"/>
      <Stat icon={BookOpen} label="Homework" value={summary?.homework??homework.length??0} note="Assigned to child&apos;s class" tint="#eaf4ff" ink="#0877e4"/>
    </div>
    <div className="content-grid"><div className="stack">
      <Panel title="Attendance overview" subtitle="Summary returned by school records"><div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-[10px] text-slate-400">Present</div><strong className="text-xl">{summary?.present??attendance?.summary?.present??0}</strong></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-[10px] text-slate-400">Absent</div><strong className="text-xl">{summary?.absent??attendance?.summary?.absent??0}</strong></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-[10px] text-slate-400">Late</div><strong className="text-xl">{summary?.late??attendance?.summary?.late??0}</strong></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-[10px] text-slate-400">Attendance rate</div><strong className="text-xl">{attendance?.summary?.percentage??summary?.attendancePercentage??0}%</strong></div>
      </div><button className="secondary-button mt-4" onClick={()=>go("attendance")}>View attendance <ArrowRight size={14}/></button></Panel>
      <Panel title="Recent attendance" subtitle="Latest records from the server"><div className="table-wrap"><table className="data-table"><thead><tr><th>DATE</th><th>STATUS</th><th>REMARKS</th></tr></thead><tbody>{records.slice(0,5).map((r,i)=><tr key={r._id||r.date||i}><td>{dateText(r.date)}</td><td><span className={`pill ${statusClass(r.status)}`}>{prettyStatus(r.status)}</span></td><td>{r.remarks||"—"}</td></tr>)}</tbody></table>{!records.length&&<Empty>No attendance records returned.</Empty>}</div></Panel>
    </div><div className="stack">
      <Panel title="Fee summary" subtitle="Actual fee account balance"><div className="rounded-xl bg-blue-50 p-4"><div className="text-[10px] text-blue-700">Outstanding balance</div><div className="mt-1 text-2xl font-extrabold text-slate-800">{money(due)}</div><div className="mt-2 text-[10px] text-slate-500">Paid: {money(fees?.totals?.paid||0)} · Total: {money(fees?.totals?.total||0)}</div></div><button className="secondary-button w-full mt-3" onClick={()=>go("fees")}>View invoices <ArrowRight size={14}/></button></Panel>
      <Panel title="Homework" subtitle="Assignments returned by school"><div className="space-y-3">{homework.slice(0,4).map((h,i)=><div className="fee-summary" key={h._id||i}><div><strong>{h.title||"Homework"}</strong><span>{h.subject||"Subject not specified"} · Due {dateText(h.dueDate)}</span></div><span className="pill orange">{h.submissions?.[0]?.status||"Assigned"}</span></div>)}{!homework.length&&<Empty>No homework records available.</Empty>}</div><button className="secondary-button w-full mt-3" onClick={()=>go("homework")}>View homework <ArrowRight size={14}/></button></Panel>
    </div></div>
  </>;
}

function ChildrenPage({ childList, selectedId, onSelect, go }) {
  return <><Heading eyebrow="Family profiles" title="My Children" subtitle="Children linked to your parent account by the school."/><ChildPicker childList={childList} selectedId={selectedId} onSelect={onSelect}/><div className="grid gap-4 md:grid-cols-2">{childList.map(c=><div className="panel" key={idOf(c)}><h3 className="panel-title">{nameOf(c)}</h3><p className="page-subtitle">{c.className||c.class||"Class not assigned"} · {c.section||"—"}</p><p className="mt-2 text-xs text-slate-500">Roll no. {c.rollNo||c.rollNumber||"—"}</p><button className="primary-button mt-4" onClick={()=>{onSelect(idOf(c));go("dashboard");}}>View dashboard <ArrowRight size={14}/></button></div>)}</div></>;
}

function AttendancePage({ data, loading }) {
  const [filter,setFilter]=useState("All"), [search,setSearch]=useState("");
  const records=useMemo(()=> (data?.records||[]).filter(r=>(filter==="All"||String(r.status).toLowerCase()===filter.toLowerCase())&&`${dateText(r.date)} ${r.status} ${r.remarks||""}`.toLowerCase().includes(search.toLowerCase())),[data,filter,search]);
  if(loading)return <Loading/>;
  return <><Heading eyebrow="Daily tracking" title="Attendance History" subtitle="Attendance records retrieved from the school database."/><div className="stats-grid"><Stat icon={Check} label="Present" value={data?.summary?.present??0} note="Recorded days" tint="#e8faf2" ink="#079765"/><Stat icon={Clock3} label="Late" value={data?.summary?.late??0} note="Late arrivals" tint="#fff3e4" ink="#e18a17"/><Stat icon={X} label="Absent" value={data?.summary?.absent??0} note="Absent days" tint="#fff0f1" ink="#d83b4b"/><Stat icon={ChartNoAxesCombined} label="Attendance rate" value={`${data?.summary?.percentage??0}%`} note="Based on records" tint="#eaf4ff" ink="#0877e4"/></div>
    <Panel title="Attendance records" subtitle="Filter the returned attendance history"><div className="filter-row"><input className="filter-control min-w-[190px] flex-1" placeholder="Search date or status..." value={search} onChange={e=>setSearch(e.target.value)}/><select className="filter-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>present</option><option>absent</option><option>late</option><option>excused</option></select></div><div className="table-wrap"><table className="data-table"><thead><tr><th>DATE</th><th>STATUS</th><th>CLASS</th><th>REMARKS</th></tr></thead><tbody>{records.map((r,i)=><tr key={r._id||i}><td><strong>{dateText(r.date)}</strong></td><td><span className={`pill ${statusClass(r.status)}`}>{prettyStatus(r.status)}</span></td><td>{r.class||"—"}</td><td>{r.remarks||"—"}</td></tr>)}</tbody></table>{!records.length&&<Empty>No attendance records match this filter.</Empty>}</div></Panel></>;
}

function FeesPage({ data, loading }) {
  const [filter,setFilter]=useState("All");
  if(loading)return <Loading/>;
  const fees=data?.fees||[], rows=fees.filter(f=>filter==="All"||String(f.status).toLowerCase()===filter.toLowerCase());
  return <><Heading eyebrow="Payments & invoices" title="Fee Management" subtitle="View actual invoices and payment status. Online payment is not enabled by this API."/><div className="stats-grid"><Stat icon={Wallet} label="Outstanding" value={money(data?.totals?.due)} note="Current due amount" tint="#fff3e4" ink="#e18a17"/><Stat icon={Check} label="Paid" value={money(data?.totals?.paid)} note="Payments recorded" tint="#e8faf2" ink="#079765"/><Stat icon={Receipt} label="Total fees" value={money(data?.totals?.total)} note="Invoice total" tint="#eaf4ff" ink="#0877e4"/></div>
    <Panel title="Invoices & payment status" subtitle="Read-only fee records"><div className="filter-row"><select className="filter-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>paid</option><option>pending</option><option>partial</option><option>overdue</option></select></div><div className="table-wrap"><table className="data-table"><thead><tr><th>INVOICE</th><th>FEE TYPE</th><th>MONTH</th><th>AMOUNT</th><th>PAID</th><th>DUE DATE</th><th>STATUS</th></tr></thead><tbody>{rows.map((f,i)=><tr key={f._id||i}><td><strong>{f.invoiceNo||"—"}</strong></td><td>{f.feeType||"Fee"}</td><td>{f.month||"—"}</td><td>{money(f.amount)}</td><td>{money(f.paidAmount)}</td><td>{dateText(f.dueDate)}</td><td><span className={`pill ${statusClass(f.status)}`}>{prettyStatus(f.status)}</span></td></tr>)}</tbody></table>{!rows.length&&<Empty>No fee invoices found.</Empty>}</div></Panel></>;
}

function RecordsPage({ page, data, loading }) {
  if(loading)return <Loading/>;
  const isResults=page==="results", isHomework=page==="homework";
  const title=isResults?"Results & Exams":isHomework?"Homework":page==="timetable"?"Timetable":page==="notices"?"Notice Board":page==="settings"?"Settings":"Help & Support";
  const rows=Array.isArray(data)?data:[];
  const isTimetable=page==="timetable", isNotices=page==="notices";
  const subtitle=isResults
    ?"Published examination results from the school."
    :isHomework
      ?"Assignments for your child's class."
      :isTimetable
        ?"Your selected child's class schedule from the school."
        :isNotices
          ?"School announcements addressed to parents."
          :"This section does not currently have a connected parent API endpoint.";
  const connected=isResults||isHomework||isTimetable||isNotices;
  return <><Heading eyebrow="Parent resources" title={title} subtitle={subtitle}/>{!connected?<Panel title={title}><Empty>This feature is not yet available through the current backend API.</Empty></Panel>:<Panel title={title} subtitle="Records returned by the school server">{rows.length===0?<Empty>No {isResults?"published results":isHomework?"homework assignments":isTimetable?"timetable entries":"parent notices"} available.</Empty>:<div className="space-y-3">{rows.map((r,i)=>isResults?<div className="rounded-xl border border-slate-100 p-4" key={r.examId||i}><div className="flex justify-between gap-3"><strong>{r.name||"Exam"}</strong><span className="text-xs text-slate-500">{dateText(r.date)}</span></div><p className="mt-2 text-sm">Obtained: {r.totalObtained??0} / {r.totalMarks??0}</p><div className="table-wrap mt-3"><table className="data-table"><thead><tr><th>SUBJECT</th><th>MARKS</th><th>TOTAL</th><th>GRADE</th></tr></thead><tbody>{(r.subjects||[]).map((s,j)=><tr key={j}><td>{s.subject||"—"}</td><td>{s.marksObtained??"—"}</td><td>{s.totalMarks??"—"}</td><td>{s.grade||"—"}</td></tr>)}</tbody></table></div></div>:isHomework?<div className="fee-summary" key={r._id||i}><div><strong>{r.title||"Homework"}</strong><span>{r.subject||"—"} · Due {dateText(r.dueDate)}</span><p className="mt-1 text-xs text-slate-500">{r.description||""}</p></div><span className="pill orange">{r.submissions?.[0]?.status||"Assigned"}</span></div>:isTimetable?<div className="fee-summary" key={r._id||i}><div><strong>{r.day||"Class"} · {r.subject||"Lesson"}</strong><span>{r.startTime||"—"} – {r.endTime||"—"} · {r.teacher||"Teacher not assigned"}</span></div><span className="pill">{r.roomNo?`Room ${r.roomNo}`:"Schedule"}</span></div>:<div className="rounded-xl border border-slate-100 p-4" key={r._id||i}><div className="flex flex-wrap items-start justify-between gap-2"><strong>{r.title||"School notice"}</strong><span className={`pill ${r.priority==="High"?"red":r.priority==="Low"?"green":"orange"}`}>{r.priority||"Medium"} priority</span></div><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{r.content||""}</p><div className="mt-3 text-xs text-slate-500">Posted {dateText(r.createdAt)}{r.postedBy?` · ${r.postedBy}`:""}</div></div>)}</div>}</Panel>}</>;
}

export default function ParentPortal() {
  const [user,setUser]=useState(null), [authenticated,setAuthenticated]=useState(false);
  const [children,setChildren]=useState([]), [selectedId,setSelectedId]=useState("");
  const [active,setActive]=useState("dashboard"), [history,setHistory]=useState(["dashboard"]);
  const [theme,setTheme]=useState("light"), [mobileOpen,setMobileOpen]=useState(false);
  const [loading,setLoading]=useState(false), [booting,setBooting]=useState(true), [error,setError]=useState("");
  const [summary,setSummary]=useState(null), [attendance,setAttendance]=useState(null), [fees,setFees]=useState(null), [results,setResults]=useState([]), [homework,setHomework]=useState([]), [timetable,setTimetable]=useState([]), [notices,setNotices]=useState([]);
  const [loadedChildId,setLoadedChildId]=useState("");
  const childLoading=Boolean(authenticated&&selectedId&&loadedChildId!==selectedId);

  const selectedChild=children.find(c=>idOf(c)===selectedId)||children[0]||null;
  const navigate=useCallback((page)=>{setActive(current=>{if(current!==page)setHistory(h=>[...h,page]);return page;});setMobileOpen(false);},[]);
  const loadChildren=useCallback(async()=>{
    const list=await parentData.children(); setChildren(list);
    setSelectedId(current=>list.some(c=>idOf(c)===current)?current:(list[0]?idOf(list[0]):""));
    return list;
  },[]);

  const signOut=useCallback(()=>{
    parentAuth.logout();setAuthenticated(false);setUser(null);setChildren([]);setSelectedId("");setLoadedChildId("");setSummary(null);setAttendance(null);setFees(null);setResults([]);setHomework([]);setTimetable([]);setNotices([]);setActive("dashboard");setHistory(["dashboard"]);setError("");
  },[]);

  useEffect(()=>{
    // Load the saved preference after hydration to keep server and client markup consistent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const saved=localStorage.getItem("devnixedu-theme");if(saved==="dark"||saved==="light")setTheme(saved);
    const token=localStorage.getItem("devnixedu-parent-token");
    if(!token){setBooting(false);return;}
    (async()=>{try{const me=await parentAuth.me();setUser(me);setAuthenticated(true);await loadChildren();}catch(e){parentAuth.logout();setError(e.message||"Session expired.");}finally{setBooting(false);}})();
  },[loadChildren]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("devnixedu-theme",theme);},[theme]);

  useEffect(()=>{
    if(!authenticated||!selectedId)return;
    let alive=true;
    Promise.allSettled([
      parentData.summary(selectedId),parentData.attendance(selectedId),parentData.fees(selectedId),
      parentData.results(selectedId),parentData.homework(selectedId),
      parentData.timetable(selectedChild||{}),parentData.notices()
    ]).then(results=>{
      if(!alive)return;
      const [s,a,f,r,h,t,n]=results;
      setSummary(s.status==="fulfilled"?s.value:null);
      setAttendance(a.status==="fulfilled"?a.value:null);
      setFees(f.status==="fulfilled"?f.value:null);
      setResults(r.status==="fulfilled"?(Array.isArray(r.value)?r.value:[]):[]);
      setHomework(h.status==="fulfilled"?(Array.isArray(h.value)?h.value:[]):[]);
      setTimetable(t.status==="fulfilled"?(Array.isArray(t.value)?t.value:[]):[]);
      setNotices(n.status==="fulfilled"?(Array.isArray(n.value)?n.value:[]):[]);
      const failed=results.filter(x=>x.status==="rejected");
      setError(failed.length?failed.map(x=>x.reason?.response?.data?.message||x.reason?.message||"API request failed").join(" · "):"");
      setLoadedChildId(selectedId);
    });
    return()=>{alive=false;};
  },[authenticated,selectedId,selectedChild]);

  const login=async(email,password)=>{
    const loggedIn=await parentAuth.login(email,password);
    setUser(loggedIn);setAuthenticated(true);setActive("dashboard");setHistory(["dashboard"]);
    const list=await loadChildren();
    if(!list.length)setError("Login successful, but no children are linked to this parent account yet.");
  };
  const goBack=()=>setHistory(h=>{if(h.length<=1)return h;const next=h.slice(0,-1);setActive(next[next.length-1]);return next;});
  const pageTitles={dashboard:"Dashboard",children:"My Children",attendance:"Attendance",fees:"Fee Management",results:"Results & Exams",homework:"Homework",timetable:"Timetable",notices:"Notice Board",settings:"Settings",support:"Help & Support"};

  if(booting)return <div className="auth-screen"><div className="panel max-w-md mx-auto mt-20"><div className="empty-state">Checking your parent session...</div></div></div>;
  if(!authenticated)return <AuthScreen onLogin={login}/>;

  return <div className="app-shell">
    <Sidebar active={active} setActive={navigate} open={mobileOpen} close={()=>setMobileOpen(false)} onLogout={signOut}/>
    <main className="main-area">
      <Topbar onMenu={()=>setMobileOpen(true)} user={user} child={selectedChild} theme={theme} onToggleTheme={()=>setTheme(t=>t==="dark"?"light":"dark")} onLogout={signOut} onBack={goBack} canGoBack={history.length>1} pageTitle={pageTitles[active]}/>
      <div className="page-content">
        {error&&<div className="auth-error mb-4" role="alert">{error}</div>}
        {active!=="dashboard"&&<div className="mb-4 flex flex-wrap items-center gap-2"><button onClick={goBack} disabled={history.length<=1} className="secondary-button"><ArrowLeft size={15}/> Back</button><button onClick={()=>navigate("dashboard")} className="text-link"><House size={14} className="inline"/> Parent Dashboard</button></div>}
        {children.length>0&&<ChildPicker childList={children} selectedId={idOf(selectedChild)} onSelect={setSelectedId}/>}
        {!children.length?<Panel title="No linked children"><Empty>Your parent account is authenticated, but no student is linked to it. Contact your school administrator to link your parent account to a student.</Empty></Panel>:<>
          {childLoading&&<div className="text-xs text-slate-500 mb-3">Refreshing selected child&apos;s records...</div>}
          {active==="dashboard"&&<Dashboard child={selectedChild} summary={summary} attendance={attendance} fees={fees} homework={homework} go={navigate}/>}
          {active==="children"&&<ChildrenPage childList={children} selectedId={idOf(selectedChild)} onSelect={setSelectedId} go={navigate}/>}
          {active==="attendance"&&(attendance?<AttendancePage data={attendance} loading={childLoading}/>:<ErrorPanel message="Attendance could not be loaded." retry={()=>setSelectedId(idOf(selectedChild))}/>)}
          {active==="fees"&&(fees?<FeesPage data={fees} loading={childLoading}/>:<ErrorPanel message="Fee records could not be loaded." retry={()=>setSelectedId(idOf(selectedChild))}/>)}
          {["results","homework","timetable","notices","settings","support"].includes(active)&&<RecordsPage page={active} data={active==="results"?results:active==="homework"?homework:active==="timetable"?timetable:active==="notices"?notices:[]} loading={childLoading&&["results","homework","timetable","notices"].includes(active)}/>}
        </>}
      </div>
      <footer className="footer"><span>© 2026 DevNixPro · DevNixEdu Parent Portal</span><span className="flex items-center gap-2"><ShieldCheck size={12}/> Secure parent session · Live school records</span></footer>
    </main>
  </div>;
}
