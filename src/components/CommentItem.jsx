import { Check, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { deleteComment, updateComment } from '../services/comments';
import { getCommentText, getDate, getId, getUser, getUserName } from '../utils/data';
import Avatar from './Avatar';

export default function CommentItem({ comment, postId, postOwnerId, onChanged }) {
  const { user } = useAuth();
  const author = getUser(comment);
  const commentId = getId(comment);
  const canEdit = String(getId(author)) === String(getId(user));
  const canDelete = canEdit || String(postOwnerId) === String(getId(user));
  const [menu,setMenu] = useState(false);
  const [editing,setEditing] = useState(false);
  const [text,setText] = useState(getCommentText(comment));
  const [busy,setBusy] = useState(false);

  const save = async()=>{ if(!text.trim()) return; setBusy(true); try{ await updateComment(postId,commentId,text.trim()); toast.success('Comment updated'); setEditing(false); onChanged?.(); }catch(e){toast.error(apiMessage(e));}finally{setBusy(false)} };
  const remove = async()=>{ if(!window.confirm('Delete this comment?'))return; setBusy(true);try{await deleteComment(postId,commentId);toast.success('Comment deleted');onChanged?.();}catch(e){toast.error(apiMessage(e));}finally{setBusy(false)} };

  return <div className="comment-item"><Avatar user={author} size={38}/><div className="comment-main"><div className="comment-bubble"><div className="comment-title"><strong>{getUserName(author)}</strong><span>{getDate(comment)}</span></div>{editing?<div className="comment-edit"><textarea value={text} onChange={(e)=>setText(e.target.value)} rows={2}/><button onClick={()=>setEditing(false)}><X size={15}/></button><button onClick={save} disabled={busy}><Check size={15}/></button></div>:<p>{getCommentText(comment)}</p>}</div></div>{(canEdit||canDelete)&&<div className="comment-menu-wrap"><button className="tiny-icon" onClick={()=>setMenu(!menu)}><MoreHorizontal size={17}/></button>{menu&&<div className="post-menu comment-menu">{canEdit&&<button onClick={()=>{setEditing(true);setMenu(false)}}><Pencil size={14}/>Edit</button>}{canDelete&&<button className="danger" onClick={remove}><Trash2 size={14}/>Delete</button>}</div>}</div>}</div>;
}
