import { CheckCircle2, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiMessage, TOKEN_KEY } from '../api/client';
import { changePassword } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword(){
 const {saveSession}=useAuth(); const nav=useNavigate(); const [show,setShow]=useState(false); const [busy,setBusy]=useState(false); const [form,setForm]=useState({password:'',newPassword:'',rePassword:''});
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();if(form.newPassword!==form.rePassword)return toast.error('New passwords do not match');setBusy(true);try{const result=await changePassword(form);const token=result?.token||result?.accessToken;if(token){localStorage.setItem(TOKEN_KEY,token);saveSession({...result,token});}toast.success('Password changed successfully');setForm({password:'',newPassword:'',rePassword:''});nav('/profile');}catch(err){toast.error(apiMessage(err,'Could not change password'));}finally{setBusy(false)}};
 return <div className="page-wrap password-page"><div className="security-card card"><div className="security-icon"><ShieldCheck size={30}/></div><span className="eyebrow">ACCOUNT SECURITY</span><h1>Change password</h1><p className="muted">Choose a strong password you don’t use anywhere else.</p><form onSubmit={submit} className="security-form"><label>Current password<div className="password-field"><input name="password" type={show?'text':'password'} required value={form.password} onChange={change}/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><label>New password<input name="newPassword" type="password" required minLength={6} value={form.newPassword} onChange={change}/></label><label>Confirm new password<input name="rePassword" type="password" required minLength={6} value={form.rePassword} onChange={change}/></label><div className="password-tips"><span><CheckCircle2 size={15}/>At least 6 characters</span><span><KeyRound size={15}/>Use a unique password</span></div><button className="primary-btn" disabled={busy}>{busy?'Updating...':'Update password'}</button></form></div></div>;
}
