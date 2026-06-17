import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { addToast } = useToast();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [profileErrors, setProfileErrors] = useState({});

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  const validateProfile = () => {
    const e = {};
    if (!profileForm.name.trim()) e.name = 'Name is required.';
    if (!profileForm.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) e.email = 'Enter a valid email.';
    return e;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const errs = validateProfile();
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;
    updateProfile({ name: profileForm.name.trim(), email: profileForm.email.trim() });
    addToast('Profile updated successfully.');
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.current) e.current = 'Current password is required.';
    if (!pwForm.next) e.next = 'New password is required.';
    else if (pwForm.next.length < 8) e.next = 'Password must be at least 8 characters.';
    if (pwForm.confirm !== pwForm.next) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errs = validatePassword();
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    const result = changePassword(pwForm.current, pwForm.next);
    if (result.success) {
      addToast('Password changed successfully.');
      setPwForm({ current: '', next: '', confirm: '' });
    } else {
      setPwErrors({ current: result.error });
    }
  };

  const inputCls = (hasErr) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors bg-white dark:bg-gray-700 dark:text-gray-100 ${hasErr ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-white/60 text-sm mt-1">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Account summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-7 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0" style={{ backgroundColor: '#0A2342' }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg" style={{ color: '#0A2342' }}>{user.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40" style={{ color: '#0A2342' }}>
              {user.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>

        {/* Edit profile */}
        <form onSubmit={handleProfileSubmit} noValidate className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-7 space-y-5">
          <h2 className="text-lg font-bold" style={{ color: '#0A2342' }}>Edit Profile</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input
              className={inputCls(profileErrors.name)}
              value={profileForm.name}
              onChange={e => { setProfileForm(p => ({ ...p, name: e.target.value })); setProfileErrors(p => ({ ...p, name: '' })); }}
            />
            {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              className={inputCls(profileErrors.email)}
              value={profileForm.email}
              onChange={e => { setProfileForm(p => ({ ...p, email: e.target.value })); setProfileErrors(p => ({ ...p, email: '' })); }}
            />
            {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
          </div>
          <button type="submit" className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0A2342' }}>
            Save Changes
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handlePasswordSubmit} noValidate className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-7 space-y-5">
          <h2 className="text-lg font-bold" style={{ color: '#0A2342' }}>Change Password</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <input
              type="password"
              className={inputCls(pwErrors.current)}
              value={pwForm.current}
              onChange={e => { setPwForm(p => ({ ...p, current: e.target.value })); setPwErrors(p => ({ ...p, current: '' })); }}
            />
            {pwErrors.current && <p className="text-red-500 text-xs mt-1">{pwErrors.current}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <input
              type="password"
              className={inputCls(pwErrors.next)}
              value={pwForm.next}
              onChange={e => { setPwForm(p => ({ ...p, next: e.target.value })); setPwErrors(p => ({ ...p, next: '' })); }}
              placeholder="At least 8 characters"
            />
            {pwErrors.next && <p className="text-red-500 text-xs mt-1">{pwErrors.next}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              className={inputCls(pwErrors.confirm)}
              value={pwForm.confirm}
              onChange={e => { setPwForm(p => ({ ...p, confirm: e.target.value })); setPwErrors(p => ({ ...p, confirm: '' })); }}
            />
            {pwErrors.confirm && <p className="text-red-500 text-xs mt-1">{pwErrors.confirm}</p>}
          </div>
          <button type="submit" className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0A2342' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
