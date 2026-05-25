import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');

  useEffect(() => {
    setName(user?.name ?? '');
    setAvatar(user?.avatar ?? '');
  }, [user]);

  const save = async () => {
    await authService.updateProfile({ name, avatar });
    await refreshUser();
    toast.success('Profile updated');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold">User Profile</h2>
      <div className="mt-6 grid gap-4">
        <input aria-label="Display name" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" />
        <input aria-label="Avatar URL" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Avatar URL" />
        <input aria-label="Email address" disabled className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 opacity-70" value={user?.email ?? ''} />
        <button onClick={save} className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-medium text-white">Save profile</button>
      </div>
    </div>
  );
};
