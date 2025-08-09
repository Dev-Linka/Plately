import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { supabase } from './supabaseClient';

// Funzione per recuperare i dati dell'utente dal database
export const fetchUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    console.error('Errore recuperando i dati utente:', error);
    return null;
  }
  
  return data;
};

// Funzione per ottenere l'utente corrente
export const getCurrentUser = async () => {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Errore recupero utente", userError);
    return null;
  }
  
  return user;
};

// Funzione per controllare la sessione corrente
export const checkSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Funzione per configurare i listener di autenticazione
export const setupAuthListeners = (
  onSessionChange: (session: Session | null) => void
) => {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    onSessionChange(session);
  });

  const appStateSub = AppState.addEventListener('change', (state) => {
    state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh();
  });

  return () => {
    listener.subscription.unsubscribe();
    appStateSub.remove();
  };
};

// Hook personalizzato per la gestione dell'autenticazione
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cleanup = setupAuthListeners(setSession);
    checkSession().then(setSession);
    
    return cleanup;
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (session) {
        const user = await getCurrentUser();
        if (user) {
          const userData = await fetchUserData(user.id);
          setUserName(userData?.username || null);
        }
      } else {
        setUserName(null);
      }
      setLoading(false);
    };

    loadUserData();
  }, [session]);

  const refreshUserData = async () => {
    if (!session) return;
    
    setLoading(true);
    const user = await getCurrentUser();
    if (user) {
      const userData = await fetchUserData(user.id);
      setUserName(userData?.username || null);
    }
    setLoading(false);
  };

  return {
    session,
    userName,
    loading,
    refreshUserData
  };
};

// Funzione per verificare se l'utente è autenticato
export const isAuth = async (): Promise<boolean> => {
  try {
    const session = await checkSession();
    return session !== null;
  } catch (error) {
    console.error('Errore durante il controllo dell\'autenticazione:', error);
    return false;
  }
};