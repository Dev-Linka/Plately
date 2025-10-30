import type { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, AppState, Dimensions, RefreshControl, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AuthForm from '../../components/AuthForm';
import { supabase } from '../../helper/supabaseClient';

const ProfileScreen = () => {
  const [session, setSession] = useState<Session | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [userName, setUserName] = useState(null)
  const [loading, setLoading ] = useState(true)

  const centered = Dimensions.get('window').height/2-25

  const colors = {
    background: isDarkMode ? '#000' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
  };

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
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single()

      if (error) {
        console.error('Errore recuperando i dati utente:', error, user.id)
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
      {session ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: centered }}>
          <Text style={{ color: colors.text }}>You're logged in {userName}!</Text>
          <TouchableOpacity onPress={handleLogout} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.text }}>{'< LOGOUT'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AuthForm onLoginSuccess={() => {}} />
      )}
        
    </ScrollView>
  );
};
export default ProfileScreen;
