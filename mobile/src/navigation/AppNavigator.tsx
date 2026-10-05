import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import {useAuth} from '../context/AuthContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const {token, isLoading} = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="CreateTask"
            component={CreateTaskScreen}
            options={{
              title: '',
              headerShadowVisible: false,
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: '#F7F8FC',
              },
            }}
          />

          <Stack.Screen
            name="EditTask"
            component={EditTaskScreen}
            options={{
              title: '',
              headerShadowVisible: false,
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: '#F7F8FC',
              },
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: '',
              headerShadowVisible: false,
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: '#F7F8FC',
              },
            }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: '',
              headerShadowVisible: false,
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: '#F7F8FC',
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;