import type { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, AppState, SafeAreaView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import AuthForm from '../../components/AuthForm';
import { supabase } from '../lib/supabase';

const ProfileScreen = () => {
  const [session, setSession] = useState<Session | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {session ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.text }}>You're logged in!</Text>
          <TouchableOpacity onPress={handleLogout} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.text }}>{'< LOGOUT'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AuthForm onLoginSuccess={() => {}} />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
