import { getAvatar, getUserName } from '../utils/data';

export default function Avatar({ user, size = 46, className = '' }) {
  const src = getAvatar(user);
  const name = getUserName(user);
  if (src) {
    return <img className={`avatar ${className}`} src={src} alt={name} style={{ width: size, height: size }} />;
  }
  const initials = name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <div className={`avatar avatar-fallback ${className}`} style={{ width: size, height: size, fontSize: Math.max(12, size * 0.32) }}>{initials}</div>;
}
