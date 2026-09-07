import { Home, KeyRound, LogOut, UserRound, Sparkles } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand"><span className="brand-mark"><Sparkles size={20}/></span><span>VibeLink</span></NavLink>
        <nav>
          <NavLink to="/" end><Home size={20}/> <span>Home</span></NavLink>
          <NavLink to="/profile"><UserRound size={20}/> <span>Profile</span></NavLink>
          <NavLink to="/change-password"><KeyRound size={20}/> <span>Password</span></NavLink>
        </nav>
        <div className="sidebar-profile">
          <Avatar user={user} size={42}/>
          <div className="sidebar-user-copy"><strong>{user?.name || user?.username || 'My profile'}</strong><small>{user?.email || 'Signed in'}</small></div>
          <button className="icon-btn" onClick={doLogout} title="Log out"><LogOut size={18}/></button>
        </div>
      </aside>
      <main className="main-panel">
        <header className="mobile-topbar"><NavLink to="/" className="brand"><span className="brand-mark"><Sparkles size={18}/></span>VibeLink</NavLink><button className="icon-btn" onClick={doLogout}><LogOut size={18}/></button></header>
        <Outlet />
      </main>
    </div>
  );
}
