import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <View className='w-44 h-44 bg-red-100'>
        <Text>hello</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
