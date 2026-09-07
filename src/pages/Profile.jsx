import { Camera, Mail, CalendarDays, UserRound, Grid2X2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { apiMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { uploadProfilePhoto } from '../services/auth';
import { getPosts } from '../services/posts';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { getUserName } from '../utils/data';

export default function Profile(){
 const {user,refreshProfile}=useAuth(); const input=useRef(null); const [uploading,setUploading]=useState(false);
 const postsQ=useQuery({queryKey:['posts','me'],queryFn:()=>getPosts({page:1,limit:50,only:'me'})});
 const upload=async e=>{const file=e.target.files?.[0];if(!file)return;setUploading(true);try{await uploadProfilePhoto(file);await refreshProfile();toast.success('Profile photo updated');}catch(err){toast.error(apiMessage(err,'Could not update photo'));}finally{setUploading(false);e.target.value='';}};
 return <div className="page-wrap profile-page"><section className="profile-hero card"><div className="profile-cover"><div className="cover-shape one"/><div className="cover-shape two"/></div><div className="profile-content"><div className="profile-avatar-wrap"><Avatar user={user} size={112}/><button className="camera-btn" onClick={()=>input.current?.click()} disabled={uploading}><Camera size={17}/></button><input hidden ref={input} type="file" accept="image/*" onChange={upload}/></div><div className="profile-copy"><span className="eyebrow">MY PROFILE</span><h1>{getUserName(user)}</h1><div className="profile-meta"><span><Mail size={16}/>{user?.email||'No email'}</span>{user?.dateOfBirth&&<span><CalendarDays size={16}/>{new Date(user.dateOfBirth).toLocaleDateString()}</span>}<span><UserRound size={16}/>{user?.gender||'Member'}</span></div></div><div className="profile-stat"><strong>{postsQ.data?.items?.length||0}</strong><span>Posts</span></div></div></section><div className="section-heading"><div><Grid2X2 size={19}/><h2>Your posts</h2></div></div>{postsQ.isLoading?<Loader label="Loading your posts..."/>:postsQ.data?.items?.length?<div className="feed-list">{postsQ.data.items.map((post,i)=><PostCard key={post._id||post.id||i} post={post} onChanged={()=>postsQ.refetch()}/>)}</div>:<div className="empty card"><h3>No posts on your profile yet</h3><p>Create your first post from the home page.</p></div>}</div>;
}
