
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  isSuperAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin status if user is logged in
        if (currentSession?.user) {
          setTimeout(() => {
            checkAdminStatus(currentSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check admin status if user is logged in
        if (data.session?.user) {
          await checkAdminStatus(data.session.user.id);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return;
      }
      
      setIsAdmin(!!data);
      setIsSuperAdmin(data?.role === 'super_admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };

  const value = {
    session,
    user,
    isAdmin,
    isSuperAdmin,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
