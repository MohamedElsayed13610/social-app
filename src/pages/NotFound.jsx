import { Link } from 'react-router-dom';
export default function NotFound(){return <div className="page-wrap"><div className="empty card not-found"><span>404</span><h1>Page not found</h1><p>The page you’re looking for doesn’t exist.</p><Link className="primary-btn" to="/">Back home</Link></div></div>}
