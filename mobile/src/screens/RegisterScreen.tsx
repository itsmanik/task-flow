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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

function RegisterScreen({navigation}: Props) {
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing information', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please check your passwords.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak password',
        'Password must be at least 6 characters long.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        email: email.trim(),
        password,
      });

      await login(response.data.token);

      Alert.alert('Account created 🎉', 'Welcome to TaskFlow!');

    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Something went wrong. Please try again.';

      Alert.alert('Registration failed', message);
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

          <Text style={styles.title}>Create your account</Text>

          <Text style={styles.subtitle}>
            Start organizing your tasks and getting things done.
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
              placeholder="At least 6 characters"
              placeholderTextColor="#A0A3AB"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password again"
              placeholderTextColor="#A0A3AB"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginBold}>Log in</Text>
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
  loginButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  loginText: {
    color: '#737780',
    fontSize: 14,
  },
  loginBold: {
    color: '#635BFF',
    fontWeight: '800',
  },
});

export default RegisterScreen;