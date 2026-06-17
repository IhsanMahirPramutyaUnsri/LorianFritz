import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_ADMIN = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@fritzoria.com',
  password: 'admin123',
  role: 'admin',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fritzoria_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('fritzoria_users');
      return stored ? JSON.parse(stored) : [DEFAULT_ADMIN];
    } catch {
      return [DEFAULT_ADMIN];
    }
  });

  useEffect(() => {
    localStorage.setItem('fritzoria_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fritzoria_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fritzoria_user');
    }
  }, [user]);

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password.' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  };

  const register = (name, email, password) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
    };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ...updates } : u)));
    setUser(prev => ({ ...prev, ...updates }));
    return { success: true };
  };

  const changePassword = (currentPassword, newPassword) => {
    const found = users.find(u => u.id === user.id);
    if (!found || found.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, password: newPassword } : u)));
    return { success: true };
  };

  const updateUserRole = (userId, role) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
    if (user?.id === userId) setUser(prev => ({ ...prev, role }));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, updateProfile, changePassword, updateUserRole, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
