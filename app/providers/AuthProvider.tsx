import { supabase } from '@/helper/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTheme } from './ThemeProvider';

type Profile = {
  id:string;
  username: string;
}

// Define the context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  userProfile: Profile | null;
  refreshUserProfile: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);

      supabase.from('profiles').select('*').eq('id', session?.user.id).single().then(({ data }) => {
        setUserProfile(data);
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      supabase.from('profiles').select('*').eq('id', session?.user.id).single().then(({ data }) => {
        setUserProfile(data);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      console.log('error', error);
      if (error) throw error;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.log('error', error);  
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
    
    setUserProfile(data);
  };

  const value = {
    user,
    isAuthenticated,
    session,
    signIn,
    signUp,
    signOut,
    isLoading,
    userProfile,
    refreshUserProfile
  };

  if (isLoading) {
    const pulse = new Animated.Value(0);
    const glow = new Animated.Value(0);
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        ]),
      ])
    ).start();

    const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
    const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.35] });

    return (
      <LinearGradient colors={[Colors.light.text, isDark ? Colors.dark.background : Colors.light.background]} style={{ flex: 1 }} locations={[0, 0.3]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: Colors.light.text,
              opacity: glowOpacity,
              shadowColor: Colors.light.text,
              shadowOpacity: 0.8,
              shadowOffset: { width: 0, height: 12 },
              shadowRadius: 20,
            }}
          />
          <Text style={{ marginTop: 24, color: 'white', opacity: 0.9 }}>Caricamento…</Text>
        </View>
      </LinearGradient>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create the useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; 