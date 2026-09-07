import { ImagePlus, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { createPost } from '../services/posts';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

export default function PostComposer({ onCreated }) {
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const preview = image ? URL.createObjectURL(image) : '';

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim() && !image) return toast.error('Write something or choose an image.');
    setBusy(true);
    try {
      await createPost({ body: body.trim(), image });
      setBody(''); setImage(null);
      if (inputRef.current) inputRef.current.value = '';
      toast.success('Post published');
      onCreated?.();
    } catch (error) { toast.error(apiMessage(error, 'Could not publish post')); }
    finally { setBusy(false); }
  };

  return <form className="composer card" onSubmit={submit}>
    <div className="composer-row"><Avatar user={user}/><textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Share something with your community..." rows={3}/></div>
    {preview && <div className="composer-preview"><img src={preview} alt="Preview"/><button type="button" className="floating-close" onClick={()=>setImage(null)}><X size={16}/></button></div>}
    <div className="composer-actions"><label className="soft-btn"><ImagePlus size={18}/> Photo<input ref={inputRef} hidden type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0] || null)}/></label><button disabled={busy} className="primary-btn" type="submit"><Send size={17}/>{busy?'Publishing...':'Publish'}</button></div>
  </form>;
}
