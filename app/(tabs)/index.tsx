import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../../helper/common';

export default function HomeScreen() {
  const { session, userName, loading, refreshUserData } = useAuth();
  const centered = Dimensions.get('window').height/2-25;
  const [refreshing, setRefreshing] = useState(false);
  const colors = useTheme();
  const router = useRouter();
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
    <View style={{ flex: 1 }}>
      
      <View style={getStyles(colors).headerContainer}>
  <TouchableOpacity
    style={getStyles(colors).profileButton}
    onPress={() => router.navigate('/(tabs)/profile')}
  >
    <Ionicons
      name="person-circle-outline"
      size={24}
      style={getStyles(colors).profileButtonIcon}
    />
  </TouchableOpacity>

  <ThemedText style={getStyles(colors).titleText}>PLATELY</ThemedText>
</View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: centered }}
      >
        
        {session ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            
            <ThemedText>
              Welcome back {userName ? `, ${userName}` : ''}!
            </ThemedText>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText>Non sei loggato</ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
  
}


const getStyles = (colors: any) =>
  StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      zIndex: 1000,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10, // or use margin on icon
    },
    profileButton: {
      position: 'absolute',
      left: 5,
      top: '50%',
      transform: [{ translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },  
    profileButtonIcon: {
      color: colors.text,
    }, 
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'geometric sans-serif typeface',
    },
  });


