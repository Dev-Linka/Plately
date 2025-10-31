import { ThemedText } from '@/components/ThemedText';
import {
  View,
  Dimensions,
  RefreshControl
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React from 'react';

export default function TabTwoScreen() {
  const centered = Dimensions.get('window').height/2-25


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: centered }}
      >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Explore</ThemedText>
      </View>
    </ScrollView>
  );
}
