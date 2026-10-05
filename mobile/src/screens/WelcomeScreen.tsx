import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Text style={styles.logo}>TaskFlow</Text>

        <View>
          <Text style={styles.title}>
            Get things done.{'\n'}
            Stay in control.
          </Text>

          <Text style={styles.subtitle}>
            Organize your tasks, manage deadlines, and make every day more
            productive.
          </Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.secondaryButton}
  onPress={() => navigation.navigate('Login')}>
  <Text style={styles.secondaryText}>
    I already have an account
  </Text>
</TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 35,
  },

  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#635BFF',
  },

  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '800',
    color: '#17181C',
    marginBottom: 18,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: '#737780',
  },

  bottom: {
    gap: 14,
  },

  primaryButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#635BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryText: {
    color: '#635BFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
