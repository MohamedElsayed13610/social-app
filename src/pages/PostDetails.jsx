import { ArrowLeft, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { createComment, getComments } from '../services/comments';
import { getPost } from '../services/posts';
import { getId, getUser } from '../utils/data';
import PostCard from '../components/PostCard';
import CommentItem from '../components/CommentItem';
import Loader from '../components/Loader';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

export default function PostDetails(){
 const {id}=useParams(); const {user}=useAuth(); const [text,setText]=useState(''); const [busy,setBusy]=useState(false);
 const postQ=useQuery({queryKey:['post',id],queryFn:()=>getPost(id)});
 const commentsQ=useQuery({queryKey:['comments',id],queryFn:()=>getComments(id),enabled:Boolean(id)});
 const submit=async e=>{e.preventDefault();if(!text.trim())return;setBusy(true);try{await createComment(id,text.trim());setText('');toast.success('Comment added');commentsQ.refetch();postQ.refetch();}catch(err){toast.error(apiMessage(err,'Could not add comment'));}finally{setBusy(false)}};
 if(postQ.isLoading)return <Loader label="Loading post..."/>;
 if(!postQ.data)return <div className="page-wrap"><div className="empty card"><h3>Post not found</h3><Link to="/" className="primary-btn">Back home</Link></div></div>;
 const ownerId=getId(getUser(postQ.data));
 return <div className="page-wrap detail-page"><Link to="/" className="back-link"><ArrowLeft size={18}/>Back to feed</Link><PostCard post={postQ.data} onChanged={()=>postQ.refetch()}/><section className="comments-card card"><div className="comments-head"><div><span className="eyebrow">DISCUSSION</span><h2>Comments</h2></div><span className="count-pill">{commentsQ.data?.items?.length||0}</span></div><form className="comment-form" onSubmit={submit}><Avatar user={user} size={40}/><input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a thoughtful comment..."/><button className="primary-icon" disabled={busy}><Send size={18}/></button></form>{commentsQ.isLoading?<Loader label="Loading comments..."/>:commentsQ.data?.items?.length?<div className="comments-list">{commentsQ.data.items.map((c,i)=><CommentItem key={c._id||c.id||i} comment={c} postId={id} postOwnerId={ownerId} onChanged={()=>commentsQ.refetch()}/>)}</div>:<div className="empty-comments">No comments yet. Start the conversation.</div>}</section></div>;
}
