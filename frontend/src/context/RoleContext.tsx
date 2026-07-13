import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { Employee } from '../models/employee';

export type UserRole = 'admin' | 'employee' | 'auditor';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void; // keeps support for dynamic simulation switching
  userName: string;
  userEmail: string;
  profile: Employee | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Employee | null>(null);
  const [role, setRoleState] = useState<UserRole>('employee');
  const [loading, setLoading] = useState<boolean>(true);

  // Custom setRole handler to support administrative bypass/switching simulation
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (profile) {
      setProfile({
        ...profile,
        role: newRole
      });
    }
  };

  useEffect(() => {
    // 1. Fetch current active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      resolveProfile(session);
    });

    // 2. Setup active auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      resolveProfile(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const resolveProfile = async (currentSession: any) => {
    if (!currentSession?.user) {
      setProfile(null);
      setRoleState('employee'); // default fallback
      setLoading(false);
      return;
    }

    try {
      // Query employees table by auth uid
      const { data, error } = await supabase
        .from('employees')
        .select('*, departments(*)')
        .eq('id', currentSession.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const emp: Employee = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatarUrl: null,
          departmentId: data.department_id || '',
          xp: Number(data.total_xp || 0),
          points: Number(data.total_xp || 0),
          rank: 1,
          role: (data.role || 'employee') as 'admin' | 'employee' | 'auditor'
        };
        setProfile(emp);
        setRoleState(emp.role);
      } else {
        // Fallback profile if row doesn't sync immediately
        const fallbackEmp: Employee = {
          id: currentSession.user.id,
          name: currentSession.user.email.split('@')[0],
          email: currentSession.user.email,
          avatarUrl: null,
          departmentId: '',
          xp: 0,
          points: 0,
          rank: 1,
          role: 'employee'
        };
        setProfile(fallbackEmp);
        setRoleState('employee');
      }
    } catch (err) {
      console.error('Failed to resolve authenticated employee profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRoleState('employee');
    setLoading(false);
  };

  const userName = profile?.name || (session?.user ? session.user.email.split('@')[0] : 'Guest User');
  const userEmail = session?.user?.email || '';

  return (
    <RoleContext.Provider value={{ role, setRole, userName, userEmail, profile, loading, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};
