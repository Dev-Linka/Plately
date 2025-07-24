import { Dimensions, RefreshControl, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '../../helper/supabaseClient';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [userName, setUserName] = useState(null)
  const [loading, setLoading ] = useState(true)
  const centered = Dimensions.get('window').height/2-25
  
  const fetchUserData = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser() // recupero utente loggato al momento || errore

    if(userError || !user){ // basic throw di errore
      console.error("Errore recupero utente")
      setLoading(false)
      return
    }

    const { data, error } = await supabase // funzione query sql
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()

      if (error) {
        console.error('Errore recuperando i dati utente:', error)
      } else {
        setUserName(data.username)
      }

      setLoading(false)

  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: centered }}
      >
        <ThemedText>Welcome back {userName ? `, ${userName}` : ''}!</ThemedText>
      </ScrollView>
    </View>
  );
}


