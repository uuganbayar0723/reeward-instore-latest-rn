import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '@screens/auth/Login';

type AuthStackParamList = {
  Login: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}
