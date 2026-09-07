import { RefreshCw } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../services/posts';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

export default function Home(){
 const query=useInfiniteQuery({queryKey:['posts','all'],queryFn:({pageParam=1})=>getPosts({page:pageParam,limit:10}),initialPageParam:1,getNextPageParam:(last,pages)=>{const totalPages=last.meta?.totalPages||last.meta?.numberOfPages; if(totalPages)return pages.length<totalPages?pages.length+1:undefined; return last.items.length===10?pages.length+1:undefined;}});
 const posts=query.data?.pages.flatMap(p=>p.items)||[];
 return <div className="page-wrap feed-page"><div className="page-heading"><div><span className="eyebrow">COMMUNITY FEED</span><h1>What’s happening?</h1></div><button className="soft-btn desktop-only" onClick={()=>query.refetch()}><RefreshCw size={17}/>Refresh</button></div><PostComposer onCreated={()=>query.refetch()}/>{query.isLoading?<Loader label="Loading posts..."/>:query.isError?<div className="empty card"><h3>Couldn’t load the feed</h3><p>Check your connection and try again.</p><button className="primary-btn" onClick={()=>query.refetch()}>Try again</button></div>:posts.length===0?<div className="empty card"><h3>No posts yet</h3><p>Be the first to share something.</p></div>:<div className="feed-list">{posts.map((post,i)=><PostCard key={post._id||post.id||i} post={post} onChanged={()=>query.refetch()}/>)}</div>}{query.hasNextPage&&<button className="load-more" disabled={query.isFetchingNextPage} onClick={()=>query.fetchNextPage()}>{query.isFetchingNextPage?'Loading...':'Load more posts'}</button>}</div>;
}
