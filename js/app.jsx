const {useState,useEffect,useReducer,useContext,useMemo,useRef,useCallback,createContext,memo}=React;

/* ---------- Context + useReducer (global state) ---------- */
const seed=[
 {id:"CMP-1001",name:"Ali Raza",title:"Water leakage in hostel block B",category:"Facilities",priority:"High",status:"Pending",desc:"Pipe leaking on 2nd floor since 3 days.",date:"2026-10-01"},
 {id:"CMP-1002",name:"Sara Khan",title:"Wi-Fi very slow in library",category:"IT",priority:"Medium",status:"Progress",desc:"Speed drops below 1 Mbps after 5 PM.",date:"2026-10-03"},
 {id:"CMP-1003",name:"Usman Tariq",title:"Fee voucher mismatch",category:"Accounts",priority:"Low",status:"Resolved",desc:"Voucher amount differed from portal.",date:"2026-09-28"}];
const load=()=>{try{const s=localStorage.getItem("cms-items");return s?JSON.parse(s):seed}catch(e){return seed}};
function reducer(s,a){
 switch(a.type){
  case"ADD":return[a.item,...s];
  case"STATUS":return s.map(c=>c.id===a.id?{...c,status:a.status}:c);
  case"DELETE":return s.filter(c=>c.id!==a.id);
  default:return s}
}
const Ctx=createContext();
function Provider({children}){
 const[items,dispatch]=useReducer(reducer,null,load);
 useEffect(()=>{try{localStorage.setItem("cms-items",JSON.stringify(items))}catch(e){}},[items]);
 const value=useMemo(()=>({items,dispatch}),[items]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
const useComplaints=()=>useContext(Ctx);

/* ---------- Custom hook (debounce) ---------- */
function useDebounce(v,ms=250){const[d,setD]=useState(v);useEffect(()=>{const t=setTimeout(()=>setD(v),ms);return()=>clearTimeout(t)},[v,ms]);return d}

/* ---------- Components (props, children, conditional rendering) ---------- */
function Navbar(){
 return <nav id="nav" className="sticky top-0 z-40 backdrop-blur bg-[var(--card)]/90 border-b border-[var(--bd)]">
  <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
   <div className="flex items-center gap-2 font-extrabold text-lg"><span className="w-9 h-9 rounded-xl grid place-items-center text-white" style={{background:"linear-gradient(135deg,var(--pri),var(--pri2))"}}>R</span>ResolveHub</div>
   <button className="btn btn-outline btn-sm" onClick={toggleTheme}>🌓 Theme</button>
  </div></nav>;
}

function StatCard({label,value,icon,color}){
 return <div className="card p-4 flex items-center gap-4 fade">
  <div className={`w-12 h-12 rounded-xl grid place-items-center text-2xl ${color}`}>{icon}</div>
  <div><div className="text-2xl font-extrabold">{value}</div><div className="text-sm text-[var(--mut)]">{label}</div></div></div>;
}

function Stats(){
 const{items}=useComplaints();
 const c=useMemo(()=>({t:items.length,p:items.filter(i=>i.status==="Pending").length,r:items.filter(i=>i.status==="Progress").length,d:items.filter(i=>i.status==="Resolved").length}),[items]);
 return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="Total" value={c.t} icon="📋" color="bg-indigo-100"/>
  <StatCard label="Pending" value={c.p} icon="⏳" color="bg-amber-100"/>
  <StatCard label="In Progress" value={c.r} icon="🔧" color="bg-blue-100"/>
  <StatCard label="Resolved" value={c.d} icon="✅" color="bg-green-100"/></div>;
}

function ComplaintForm({onDone}){
 const empty={name:"",title:"",category:"Facilities",priority:"Medium",desc:""};
 const[f,setF]=useState(empty);
 const[err,setErr]=useState({});
 const{dispatch}=useComplaints();
 const ref=useRef(null);
 useEffect(()=>{ref.current&&ref.current.focus()},[]);
 const change=e=>setF(p=>({...p,[e.target.name]:e.target.value}));
 const submit=e=>{
  e.preventDefault();
  const er={};
  if(f.name.trim().length<2)er.name="Enter your name";
  if(f.title.trim().length<5)er.title="Title min 5 characters";
  if(f.desc.trim().length<10)er.desc="Describe in at least 10 characters";
  setErr(er);
  if(Object.keys(er).length)return;
  dispatch({type:"ADD",item:{...f,id:"CMP-"+(Date.now()%100000),status:"Pending",date:new Date().toISOString().slice(0,10)}});
  setF(empty);onDone&&onDone();
 };
 const Err=({k})=>err[k]?<p className="text-red-500 text-xs mt-1">{err[k]}</p>:null;
 return <form onSubmit={submit} className="card p-5 space-y-3 fade">
  <h2 className="font-bold text-lg">Submit a Complaint</h2>
  <div><input ref={ref} className="form-control" name="name" placeholder="Your name" value={f.name} onChange={change}/><Err k="name"/></div>
  <div><input className="form-control" name="title" placeholder="Complaint title" value={f.title} onChange={change}/><Err k="title"/></div>
  <div className="grid grid-cols-2 gap-3">
   <select className="form-control" name="category" value={f.category} onChange={change}>{["Facilities","IT","Accounts","Academics","Other"].map(o=><option key={o}>{o}</option>)}</select>
   <select className="form-control" name="priority" value={f.priority} onChange={change}>{["Low","Medium","High"].map(o=><option key={o}>{o}</option>)}</select></div>
  <div><textarea className="form-control" rows="3" name="desc" placeholder="Describe the issue…" value={f.desc} onChange={change}/><Err k="desc"/></div>
  <button className="btn btn-primary w-full justify-center" type="submit">Submit Complaint</button></form>;
}

const Card=memo(function Card({c,onOpen,onStatus,onDelete}){
 return <div className="card p-4 fade">
  <div className="flex items-start justify-between gap-2">
   <div className="min-w-0"><div className="text-xs text-[var(--mut)]">{c.id} · {c.date}</div>
    <h3 className="font-bold truncate cursor-pointer hover:underline" onClick={()=>onOpen(c)}>{c.title}</h3></div>
   <span className={`badge b-${c.status}`}>{c.status==="Progress"?"In Progress":c.status}</span></div>
  <p className="text-sm text-[var(--mut)] mt-2 line-clamp-2">{c.desc}</p>
  <div className="flex flex-wrap items-center gap-2 mt-3">
   <span className={`badge p-${c.priority}`}>{c.priority}</span>
   <span className="badge" style={{background:"var(--bd)"}}>{c.category}</span>
   <div className="ml-auto flex gap-2">
    <select className="form-control !py-1 !w-auto text-xs" value={c.status} onChange={e=>onStatus(c.id,e.target.value)}>
     <option value="Pending">Pending</option><option value="Progress">In Progress</option><option value="Resolved">Resolved</option></select>
    <button className="btn btn-danger btn-sm" onClick={()=>onDelete(c.id)}>Delete</button></div></div></div>;
});

function Modal({children,onClose}){
 useEffect(()=>{const k=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",k);return()=>window.removeEventListener("keydown",k)},[onClose]);
 return <div className="modal-bd" onClick={onClose}><div className="w-full max-w-md" onClick={e=>e.stopPropagation()}>{children}</div></div>;
}

function App(){
 const{items,dispatch}=useComplaints();
 const[q,setQ]=useState("");
 const[status,setStatus]=useState("All");
 const[sel,setSel]=useState(null);
 const[showForm,setShowForm]=useState(false);
 const[toast,setToast]=useState("");
 const dq=useDebounce(q);
 const list=useMemo(()=>items.filter(i=>(status==="All"||i.status===status)&&(i.title+i.name+i.id).toLowerCase().includes(dq.toLowerCase())),[items,status,dq]);
 const onStatus=useCallback((id,s)=>{dispatch({type:"STATUS",id,status:s});setToast("Status updated")},[dispatch]);
 const onDelete=useCallback(id=>{dispatch({type:"DELETE",id});setToast("Complaint deleted")},[dispatch]);
 const onOpen=useCallback(c=>setSel(c),[]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),1800);return()=>clearTimeout(t)},[toast]);
 return <>
  <Navbar/>
  <header className="text-white text-center py-12 px-4" style={{background:"linear-gradient(135deg,var(--pri),var(--pri2))"}}>
   <h1 className="text-3xl md:text-5xl font-extrabold">Complaint Management System</h1>
   <p className="mt-3 opacity-90">Submit, track and resolve complaints — all in one place.</p>
   <button className="btn mt-5 bg-white text-indigo-700 md:hidden" onClick={()=>setShowForm(true)}>+ New Complaint</button></header>
  <main className="max-w-6xl mx-auto px-4 -mt-6 pb-12 space-y-6">
   <Stats/>
   <div className="grid lg:grid-cols-3 gap-6">
    <div className="hidden md:block lg:col-span-1"><ComplaintForm/></div>
    <section className="lg:col-span-2 space-y-4">
     <div className="card p-3 flex flex-col sm:flex-row gap-3">
      <input className="form-control" placeholder="🔍 Search by title, name or ID" value={q} onChange={e=>setQ(e.target.value)}/>
      <div className="flex gap-2 flex-wrap">{["All","Pending","Progress","Resolved"].map(s=>
       <button key={s} className={`btn btn-sm ${status===s?"btn-primary":"btn-outline"}`} onClick={()=>setStatus(s)}>{s==="Progress"?"In Progress":s}</button>)}</div></div>
     {list.length===0?<div className="card p-10 text-center text-[var(--mut)]">No complaints found.</div>
      :list.map(c=><Card key={c.id} c={c} onOpen={onOpen} onStatus={onStatus} onDelete={onDelete}/>)}
    </section></div></main>
  <footer className="text-center text-sm text-[var(--mut)] pb-8">© <span id="yr">2026</span> ResolveHub · React + Tailwind + Bootstrap-style UI</footer>
  {sel&&<Modal onClose={()=>setSel(null)}><div className="card p-5 space-y-2">
   <div className="flex justify-between"><h3 className="font-bold text-lg">{sel.title}</h3><button className="btn btn-outline btn-sm" onClick={()=>setSel(null)}>✕</button></div>
   <div className="text-sm text-[var(--mut)]">{sel.id} · by {sel.name} · {sel.date}</div>
   <p>{sel.desc}</p>
   <div className="flex gap-2"><span className={`badge p-${sel.priority}`}>{sel.priority}</span><span className={`badge b-${sel.status}`}>{sel.status}</span></div></div></Modal>}
  {showForm&&<Modal onClose={()=>setShowForm(false)}><ComplaintForm onDone={()=>{setShowForm(false);setToast("Complaint submitted")}}/></Modal>}
  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm z-50 fade">{toast}</div>}
 </>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Provider><App/></Provider>);
