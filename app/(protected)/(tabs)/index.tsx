import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../../../helper/common';

export default function HomeScreen() {
  const { session, userName, loading, refreshUserData } = useAuth();
  const centered = Dimensions.get('window').height/2-25;
  const [refreshing, setRefreshing] = useState(false);
  const colors = useTheme();
  const router = useRouter();

  const palette = {
    cream:      '#FFF7ED', // Card background
    peach:      '#FFD6A5', // Card border/shadow
    brown:      '#7C4700', // Title text, button text
    taupe:      '#A67C52', // Description text
    vividPeach: '#FFB86F', // Button background
  };
  
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
    onPress={() => router.navigate('//(profile')}
  >
    <Ionicons
      name="person-circle-outline"
      size={24}
      style={getStyles(colors).profileButtonIcon}
    />
  </TouchableOpacity>

  <ThemedText style={getStyles(colors).titleText}> PLATELY </ThemedText>
</View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: 128 }}
      >
        
        {session ? (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ alignItems: 'flex-start', paddingTop: 0 }}>
              <ThemedText style={{ fontSize: 28, fontFamily: 'geometric sans-serif typeface', paddingTop: 4, fontWeight: 600 }}>
                Good morning{userName ? `, ${userName}` : ''}
              </ThemedText>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              style={{ marginTop: 32 }}
              snapToInterval={360}
              decelerationRate="fast"
              snapToAlignment="start"
            >
              <View style={getStyles(colors).cards}>
                <Text style={{color: palette.brown, fontSize: 22, fontWeight: 'bold', marginBottom: 6}}>Profile Settings</Text>
                <Text style={{color: '#A67C52', fontSize: 15, marginBottom: 18}}>Update your personal information and preferences.</Text>
                <TouchableOpacity 
                  style={getStyles(colors).cardsButton}
                  onPress={() => router.navigate('//(profile')}
                >
                  <Text style={{color: '#7C4700', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Go to Profile</Text>
                </TouchableOpacity>
              </View>
              <View style={getStyles(colors).cards}>
                <Text style={{color: '#7C4700', fontSize: 22, fontWeight: 'bold', marginBottom: 6}}>Special Offer</Text>
                <Text style={{color: '#A67C52', fontSize: 15, marginBottom: 18}}>Enjoy exclusive discounts available this week only!</Text>
                <TouchableOpacity style={getStyles(colors).cardsButton}>
                  <Text style={{color: '#7C4700', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>View Offer</Text>
                </TouchableOpacity>
              </View>
              <View style={getStyles(colors).cards}>
                <Text style={{color: '#7C4700', fontSize: 22, fontWeight: 'bold', marginBottom: 6}}>New Menu</Text>
                <Text style={{color: '#A67C52', fontSize: 15, marginBottom: 18}}>Discover our latest delicious additions.</Text>
                <TouchableOpacity style={getStyles(colors).cardsButton}>
                  <Text style={{color: '#7C4700', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>See Menu</Text>
                </TouchableOpacity>
              </View>
              <View style={getStyles(colors).cards}>
                <Text style={{color: '#7C4700', fontSize: 22, fontWeight: 'bold', marginBottom: 6}}>Promotions</Text>
                <Text style={{color: '#A67C52', fontSize: 15, marginBottom: 18}}>Check out current promotions and save more.</Text>
                <TouchableOpacity style={getStyles(colors).cardsButton}>
                  <Text style={{color: '#7C4700', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>See Promotions</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
      fontFamily: 'geometric sans-serif typeface',
    },
    cards: {
      width: 340,
      height: 400,
      marginRight: 20,
      justifyContent: 'flex-end',
      paddingLeft: 24,
      backgroundColor: '#FFF7ED', // soft cream
      borderRadius: 20,
      paddingBottom: 20,
      borderWidth: 2,
      borderColor: '#FFD6A5', // peach
      shadowColor: '#FFD6A5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    cardsButton: {
      backgroundColor: '#FFB86F',
      width: 292,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      color: '#7C4700',
      shadowColor: '#FFD6A5',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 2,
    }
  });


