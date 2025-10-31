import React from 'react';
import { View } from 'react-native';
import AuthForm from '../../components/AuthForm';

const LoginScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
      <AuthForm onLoginSuccess={() => {}} />
    </View>
  );
};
export default LoginScreen;
