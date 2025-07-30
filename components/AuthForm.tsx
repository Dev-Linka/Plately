import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { supabase } from '../helper/supabaseClient';

interface Props {
  onLoginSuccess: () => void;
}

const AuthForm = ({ onLoginSuccess }: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
        onLoginSuccess();
        Alert.alert('Logged in!');
        console.log("User logged in!");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          Alert.alert('Please check your inbox for email verification!');
        } else {
          Alert.alert('Account created!');
          onLoginSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.form}>
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

      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.continueText}>
          {loading ? 'Please wait...' : isLogin ? 'Continue' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={{ color: colors.hintText }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
        </Text>
        <TouchableOpacity onPress={toggleForm}>
          <Text style={styles.signupLink}>{isLogin ? 'Sign up' : 'Log in'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthForm;

const getStyles = (colors: any) =>
  StyleSheet.create({
    form: { width: '100%', marginTop: 40, paddingHorizontal: 24 },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 30,
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
    label: { fontSize: 14, marginBottom: 6 },
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
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    signupLink: {
      color: '#2962FF',
    },
  });
