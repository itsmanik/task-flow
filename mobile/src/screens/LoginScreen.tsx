import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import api from '../services/api';
import {useAuth} from '../context/AuthContext';

type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({navigation}: Props) {
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      await login(response.data.token);

      Alert.alert('Welcome back 👋', 'You are now logged in.');

    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Unable to log in. Please check your details.';

      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.logo}>TaskFlow</Text>

          <Text style={styles.title}>Welcome back 👋</Text>

          <Text style={styles.subtitle}>
            Log in to continue managing your tasks.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#A0A3AB"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#A0A3AB"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text style={styles.registerBold}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 35,
  },
  logo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#635BFF',
    marginBottom: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#17181C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#737780',
    marginBottom: 30,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34363D',
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#E1E3EA',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#17181C',
    marginBottom: 8,
  },
  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#635BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  registerButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  registerText: {
    color: '#737780',
    fontSize: 14,
  },
  registerBold: {
    color: '#635BFF',
    fontWeight: '800',
  },
});

export default LoginScreen;