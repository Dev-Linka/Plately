import { ThemedText } from '@/components/ThemedText';
import React, { useCallback, useState } from 'react';
import { Dimensions, RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../../helper/common';

export default function HomeScreen() {
  const { session, userName, loading, refreshUserData } = useAuth();
  const centered = Dimensions.get('window').height/2-25;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    if (!session) {
      setRefreshing(false);
      return;
    }
  
    setRefreshing(true);
    refreshUserData().finally(() => {
      setRefreshing(false);
    });
  }, [session, refreshUserData]);
  
  return (
    <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: centered }}
      >
    {session ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Welcome back {userName ? `, ${userName}` : ''}!</ThemedText>
      
    </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
        <ThemedText>Non sei loggato</ThemedText>
      
    </View>
    )}
    </ScrollView>
    
  );
}


