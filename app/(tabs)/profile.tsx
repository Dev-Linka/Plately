import { Ionicons } from '@expo/vector-icons';
import type { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

const ProfileScreen = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    inputBorder: isDarkMode ? '#444' : '#ccc',
    placeholder: isDarkMode ? '#aaa' : '#999',
    label: isDarkMode ? '#ddd' : '#333',
    tabInactive: isDarkMode ? '#666' : '#ccc',
    divider: isDarkMode ? '#333' : '#ddd',
    orText: isDarkMode ? '#bbb' : '#888',
    hintText: isDarkMode ? '#aaa' : '#888',
  };

  const styles = getStyles(colors);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUserEmail(data.session?.user?.email ?? '');
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserEmail(session?.user?.email ?? '');
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

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        Alert.alert('Logged in!');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (!data.session) {
          Alert.alert('Please check your inbox for email verification!');
        } else {
          Alert.alert('Account created!');
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  if (session) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 8 }}>
          <Text style={ [styles.tabText, { color: colors.text }] }>{'< LOGOUT'}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.tabText, { color: colors.text }]}>Sei loggato</Text>
          <Text style={[styles.tabText, { color: colors.text }]}>Username: {username}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.innerContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setIsLogin(true)}>
            <Text style={[styles.tabText, isLogin ? styles.activeTab : { color: colors.tabInactive }]}>
              Log in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(false)}>
            <Text style={[styles.tabText, !isLogin ? styles.activeTab : { color: colors.tabInactive }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <Text style={[styles.label, { color: colors.label }]}>Username</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="yourname"
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={setUsername}
              />
            </>
          )}

          <Text style={[styles.label, { color: colors.label }]}>Your Email</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="email@example.com"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.label }]}>Password</Text>
          <View style={[styles.input, styles.passwordInput, { borderColor: colors.inputBorder }]}>
            <TextInput
              style={[styles.passwordField, { color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.placeholder}
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color={colors.placeholder} />
            </TouchableOpacity>
          </View>

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          {isLogin && (
            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.continueText}>
              {loading ? 'Please wait...' : isLogin ? 'Continue' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
            <Text style={[styles.orText, { color: colors.orText }]}>Or</Text>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={{ color: colors.hintText }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={toggleForm}>
              <Text style={styles.signupLink}>{isLogin ? 'Sign up' : 'Log in'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    innerContainer: {
      flex: 1,
      paddingHorizontal: 24,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30,
      marginBottom: 40,
    },
    tabText: {
      fontSize: 18,
      marginHorizontal: 20,
    },
    activeTab: {
      color: '#2962FF',
      borderBottomWidth: 2,
      borderBottomColor: '#2962FF',
      paddingBottom: 4,
    },
    form: {
      width: '100%',
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      fontSize: 16,
    },
    passwordInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    passwordField: {
      flex: 1,
      fontSize: 16,
    },
    errorText: {
      color: '#FF4D4D',
      fontSize: 12,
      marginBottom: 8,
    },
    forgot: {
      alignSelf: 'flex-end',
      marginBottom: 24,
    },
    forgotText: {
      color: '#2962FF',
      fontSize: 13,
    },
    continueButton: {
      backgroundColor: '#2962FF',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 30,
    },
    continueText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    line: {
      flex: 1,
      height: 1,
    },
    orText: {
      marginHorizontal: 8,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    signupLink: {
      color: '#2962FF',
    },
  });
