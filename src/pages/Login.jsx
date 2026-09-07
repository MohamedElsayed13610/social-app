import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { signIn } from '../services/auth';

export default function Login() {
  const { token, saveSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [show,setShow] = useState(false);
  const [busy,setBusy] = useState(false);
  if(token) return <Navigate to="/" replace/>;
  const submit=async(e)=>{e.preventDefault();setBusy(true);try{const session=await signIn({email,password});saveSession(session);toast.success('Welcome back');navigate(location.state?.from||'/',{replace:true});}catch(err){toast.error(apiMessage(err,'Could not sign in'));}finally{setBusy(false)}};
  return <div className="auth-page"><section className="auth-visual"><div className="auth-brand"><span className="brand-mark"><Sparkles/></span>VibeLink</div><div><span className="eyebrow light">YOUR PEOPLE. YOUR MOMENTS.</span><h1>Good conversations start here.</h1><p>Sign in to catch up, create posts, and join the conversation.</p></div><div className="visual-orbs"><i/><i/><i/></div></section><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><span className="eyebrow">WELCOME BACK</span><h2>Sign in to VibeLink</h2><p className="muted">Use your Route Posts account to continue.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<div className="password-field"><input type={show?'text':'password'} required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><button className="primary-btn auth-submit" disabled={busy}>{busy?'Signing in...':<>Sign in <ArrowRight size={18}/></>}</button><p className="auth-switch">New to VibeLink? <Link to="/signup">Create an account</Link></p></form></section></div>;
}
