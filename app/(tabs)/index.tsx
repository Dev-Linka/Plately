import { ThemedText } from '@/components/ThemedText';
import type { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { AppState, Dimensions, RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { supabase } from '../../helper/supabaseClient';

export default function HomeScreen() {
  const [userName, setUserName] = useState(null)
  const [loading, setLoading ] = useState(true)
  const centered = Dimensions.get('window').height/2-25
  const [session, setSession] = useState<Session | null>(null);
  
  const fetchUserData = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser() // recupero utente loggato al momento || errore

    if (userError) {
      console.error("Errore recupero utente", userError);
      setLoading(false);
      return;
    }
    if (!user) {
      // Nessun utente loggato, non è un errore
      setLoading(false);
      return;
    }

    const { data, error } = await supabase // funzione query sql
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()

      if (error) {
        console.error('Errore recuperando i dati utente:', error)
      } else {
        setUserName(data.username)
      }

      setLoading(false)

  }

  useEffect(() => {
    if (session) {
      fetchUserData();
    } else {
      setUserName(null); // reset username se non loggato
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    checkSession();

    const appStateSub = AppState.addEventListener('change', (state) => {
      state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh();
    });

    return () => {
      listener.subscription.unsubscribe();
      appStateSub.remove();
    };
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    if (!session) {
      setRefreshing(false);
      return;
    }
  
    setRefreshing(true);
    fetchUserData().finally(() => {
      setRefreshing(false);
    });
  }, [session]);
  
  return (
    <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: centered }}
      >
    {session ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Welcome back {userName ? `, ${userName}` : ''}!</ThemedText>
      
    </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
        <ThemedText>Non sei loggato</ThemedText>
      
    </View>
    )}
    </ScrollView>
    
  );
}


