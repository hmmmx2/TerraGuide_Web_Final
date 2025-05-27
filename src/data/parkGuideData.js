// This file provides a shared data store for park guide entries
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';

// Custom hook to use park guide data and stay in sync with updates
export const useParkGuideData = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch guides from Supabase
  const fetchGuides = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('park_guides')
        .select('*, users(*)');
      
      if (error) throw error;
      
      // Format the guide data with user info
      const formattedGuides = data.map(guide => ({
        id: guide.user_id,
        supabase_uid: guide.supabase_uid,
        username: guide.username,
        bio: guide.bio,
        park_area: guide.park_area,
        working_days: guide.working_days,
        working_hours: guide.working_hours,
        designation: guide.designation,
        avatar_url: guide.avatar_url,
        first_name: guide.users?.first_name || '',
        last_name: guide.users?.last_name || ''
      }));
      
      setGuides(formattedGuides);
      setError(null);
    } catch (err) {
      console.error('Error fetching park guides:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchGuides();
    
    // Set up realtime subscription for updates
    const subscription = supabase
      .channel('park_guides-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'park_guides' 
      }, payload => {
        // Refetch data when changes occur
        fetchGuides();
      })
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  return { guides, loading, error, refetch: fetchGuides };
};

// Get all park guides for homepage
export const getHomepageParkGuides = async () => {
  try {
    const { data, error } = await supabase
      .from('park_guides')
      .select('*, users(*)')
      .limit(3);
      
    if (error) throw error;
    
    // Format the guide data with user info
    const formattedGuides = data.map(guide => ({
      id: guide.user_id,
      supabase_uid: guide.supabase_uid,
      username: guide.username,
      bio: guide.bio,
      park_area: guide.park_area,
      working_days: guide.working_days,
      working_hours: guide.working_hours,
      designation: guide.designation,
      avatar_url: guide.avatar_url,
      first_name: guide.users?.first_name || '',
      last_name: guide.users?.last_name || ''
    }));
    
    return formattedGuides || [];
  } catch (err) {
    console.error('Error fetching homepage park guides:', err);
    return [];
  }
}; 