import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { deletePost, toggleLike, updatePost } from '../services/posts';
import { getDate, getId, getPostBody, getPostImage, getUser, getUserName } from '../utils/data';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

function isOwner(post, user) {
  const postUser = getUser(post);
  return String(getId(postUser)) === String(getId(user));
}

export default function PostCard({ post, onChanged, compact = false }) {
  const { user } = useAuth();
  const postId = getId(post);
  const author = getUser(post);
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(getPostBody(post));
  const [busy, setBusy] = useState(false);
  const [liked, setLiked] = useState(Boolean(post?.isLiked || post?.likedByMe));
  const [likes, setLikes] = useState(post?.likesCount ?? post?.likes?.length ?? 0);
  const image = getPostImage(post);

  const save = async () => {
    if (!body.trim()) return toast.error('Post cannot be empty.');
    setBusy(true);
    try { await updatePost(postId, { body: body.trim() }); toast.success('Post updated'); setEditing(false); onChanged?.(); }
    catch (e) { toast.error(apiMessage(e, 'Could not update post')); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm('Delete this post?')) return;
    setBusy(true);
    try { await deletePost(postId); toast.success('Post deleted'); onChanged?.(); }
    catch (e) { toast.error(apiMessage(e, 'Could not delete post')); }
    finally { setBusy(false); }
  };

  const like = async () => {
    const next = !liked; setLiked(next); setLikes((v)=>Math.max(0, v + (next?1:-1)));
    try { await toggleLike(postId); }
    catch { setLiked(!next); setLikes((v)=>Math.max(0, v + (next?-1:1))); }
  };

  return <article className="post-card card">
    <div className="post-head">
      <Avatar user={author}/>
      <div className="post-author"><strong>{getUserName(author)}</strong><span>{getDate(post)}</span></div>
      {isOwner(post,user) && <div className="post-menu-wrap"><button className="icon-btn" onClick={()=>setMenu(!menu)}><MoreHorizontal size={20}/></button>{menu&&<div className="post-menu"><button onClick={()=>{setEditing(true);setMenu(false)}}><Pencil size={15}/> Edit post</button><button className="danger" onClick={remove} disabled={busy}><Trash2 size={15}/> Delete post</button></div>}</div>}
    </div>
    {editing ? <div className="edit-box"><textarea rows={4} value={body} onChange={(e)=>setBody(e.target.value)}/><div><button className="soft-btn" onClick={()=>{setEditing(false);setBody(getPostBody(post))}}><X size={16}/>Cancel</button><button className="primary-btn" onClick={save} disabled={busy}><Check size={16}/>Save</button></div></div> : body && <p className="post-body">{getPostBody(post)}</p>}
    {image && <Link to={`/posts/${postId}`} className="post-image-link"><img className={`post-image ${compact?'compact':''}`} src={image} alt="Post" loading="lazy"/></Link>}
    <div className="post-stats"><span>{likes} {likes===1?'like':'likes'}</span><Link to={`/posts/${postId}`}>{post?.commentsCount ?? post?.comments?.length ?? 0} comments</Link></div>
    <div className="post-actions"><button className={liked?'active':''} onClick={like}><Heart size={19} fill={liked?'currentColor':'none'}/> Like</button><Link to={`/posts/${postId}`}><MessageCircle size={19}/> Comment</Link></div>
  </article>;
}
