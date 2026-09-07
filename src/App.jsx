import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';

const Guard = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App(){
  return <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route element={<Guard><Layout/></Guard>}>
      <Route index element={<Home/>}/>
      <Route path="posts/:id" element={<PostDetails/>}/>
      <Route path="profile" element={<Profile/>}/>
      <Route path="change-password" element={<ChangePassword/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  </Routes>;
}
