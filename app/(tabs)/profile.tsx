import type { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, AppState, Dimensions, RefreshControl, SafeAreaView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import AuthForm from '../../components/AuthForm';
import { supabase } from '../../helper/supabaseClient';
import { ScrollView } from 'react-native-gesture-handler';

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

  const fetchUserData = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser() // recupero utente loggato al momento || errore

    if(userError || !user){ // basic throw di errore
      console.error("Errore recupero utente" + userError + " User: " + user)
      setLoading(false)
      return
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
    fetchUserData()
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
