import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

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

  const handleSubmit = () => {
    if (isLogin) {
      if (email === '' || password === '') {
        setError('Please enter both email and password.');
      } else if (password !== '123456') {
        setError('Wrong password');
      } else {
        setError('');
        console.log('Logged in!');
      }
    } else {
      if (!username || !email || !password) {
        setError('All fields are required.');
      } else {
        setError('');
        console.log('Account created!');
      }
    }
  };

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
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={colors.placeholder}
              />
            </TouchableOpacity>
          </View>

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          {isLogin && (
            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
            <Text style={styles.continueText}>
              {isLogin ? 'Continue' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
            <Text style={[styles.orText, { color: colors.orText }]}>Or</Text>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={{ color: colors.hintText }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
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

export default LoginScreen;

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
