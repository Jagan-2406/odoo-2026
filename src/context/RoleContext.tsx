import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'employee' | 'auditor';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('admin');

  // Simulated usernames based on active view mode
  const getUserName = (r: UserRole): string => {
    switch (r) {
      case 'admin':
        return 'Sarah Jenkins (Admin)';
      case 'auditor':
        return 'Elena Rostova (Auditor)';
      case 'employee':
        return 'Alex Rivera (Employee)';
      default:
        return 'Guest User';
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, userName: getUserName(role) }}>
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
