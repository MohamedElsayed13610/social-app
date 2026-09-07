import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { signUp } from '../services/auth';

export default function Signup(){
 const {token,saveSession}=useAuth(); const nav=useNavigate(); const [busy,setBusy]=useState(false); const [form,setForm]=useState({name:'',email:'',password:'',rePassword:'',dateOfBirth:'',gender:'male'}); if(token)return <Navigate to="/" replace/>;
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();if(form.password!==form.rePassword)return toast.error('Passwords do not match');setBusy(true);try{const session=await signUp(form);saveSession(session);toast.success('Account created');nav('/');}catch(err){toast.error(apiMessage(err,'Could not create account'));}finally{setBusy(false)}};
 return <div className="auth-page signup"><section className="auth-visual"><div className="auth-brand"><span className="brand-mark"><Sparkles/></span>VibeLink</div><div><span className="eyebrow light">JOIN THE COMMUNITY</span><h1>Make your corner of the internet feel human.</h1><p>Create your profile and start sharing moments that matter.</p></div><div className="visual-orbs"><i/><i/><i/></div></section><section className="auth-form-wrap"><form className="auth-form signup-form" onSubmit={submit}><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><div className="form-grid"><label className="full">Full name<input name="name" required minLength={2} value={form.name} onChange={change} placeholder="Your name"/></label><label className="full">Email<input name="email" type="email" required value={form.email} onChange={change} placeholder="you@example.com"/></label><label>Password<input name="password" type="password" required minLength={6} value={form.password} onChange={change}/></label><label>Confirm password<input name="rePassword" type="password" required minLength={6} value={form.rePassword} onChange={change}/></label><label>Date of birth<input name="dateOfBirth" type="date" required value={form.dateOfBirth} onChange={change}/></label><label>Gender<select name="gender" value={form.gender} onChange={change}><option value="male">Male</option><option value="female">Female</option></select></label></div><button className="primary-btn auth-submit" disabled={busy}>{busy?'Creating account...':<>Create account <ArrowRight size={18}/></>}</button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form></section></div>;
}
