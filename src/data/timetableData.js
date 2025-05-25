// This file provides a shared data store for timetable entries
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';

// Initial timetable data with the same entries as currently shown
const initialTimetable = [
  {
    id: 1,
    time: '9:00am',
    title: 'Morning Briefing & Preparation',
    description: 'Start your day with a comprehensive briefing about the park, safety guidelines, and what to expect during your visit.'
  },
  {
    id: 2,
    time: '10:30am',
    title: 'Morning Guided Nature Walk',
    description: 'Explore the lush rainforest with our experienced guides who will point out interesting flora and fauna along the way.'
  },
  {
    id: 3,
    time: '12:00pm',
    title: 'Break & Rest',
    description: 'Take some time to relax, have lunch, and recharge for the afternoon activities. Enjoy the peaceful surroundings of the park.'
  },
  {
    id: 4,
    time: '2:00pm',
    title: 'Orangutan Feeding Session',
    description: 'Witness the orangutans during their feeding time. Learn about their diet, behavior, and conservation efforts to protect these amazing primates.'
  },
  {
    id: 5,
    time: '3:30pm',
    title: 'Conservation Talk',
    description: 'Join our conservation experts for an informative session about the challenges facing Borneo\'s wildlife and how we can help protect them.'
  },
  {
    id: 6,
    time: '4:30pm',
    title: 'Afternoon Nature Walk',
    description: 'Experience the rainforest as it transitions into evening. Different wildlife becomes active during this time, offering new sightings.'
  },
  {
    id: 7,
    time: '6:00pm',
    title: 'Evening Briefing',
    description: 'Gather for a summary of the day\'s activities and prepare for any evening programs if you\'re staying overnight at the park.'
  },
  {
    id: 8,
    time: '7:30pm',
    title: 'Night Safari (Optional)',
    description: 'For overnight guests, join our guided night safari to spot nocturnal creatures and experience the rainforest after dark.'
  },
  {
    id: 9,
    time: '9:00pm',
    title: 'Stargazing Session',
    description: 'End your day by observing the stars from our viewing platform. Learn about constellations and enjoy the peaceful night atmosphere.'
  }
];

// Shared state variable (updated by timetable management page)
let timetableData = [...initialTimetable];

// Get all timetable entries
export const getTimetableData = () => timetableData;

// Initial cache for timetable data (will be populated from database)
let timetableCache = [];

// Custom hook to use timetable data and stay in sync with updates
export const useTimetableData = () => {
  const [timetables, setTimetables] = useState(timetableCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch timetables from Supabase
  const fetchTimetables = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) throw error;
      
      // Update both state and cache
      timetableCache = data || [];
      setTimetables(timetableCache);
      setError(null);
    } catch (err) {
      console.error('Error fetching timetables:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchTimetables();
    
    // Set up realtime subscription for updates
    const subscription = supabase
      .channel('timetables-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'timetables' 
      }, payload => {
        // Refetch data when changes occur
        fetchTimetables();
      })
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  return { timetables, loading, error, refetch: fetchTimetables };
};

// Get first 3 timetable entries for homepage
export const getHomepageTimetableData = async () => {
  try {
    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .order('order', { ascending: true })
      .limit(3);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching homepage timetables:', err);
    return [];
  }
};

// CRUD operations for timetable management
export const timetableCrud = {
  // Create new timetable entry
  create: async (timetableData) => {
    try {
      // Get max order number and add 1
      const { data: maxOrderData } = await supabase
        .from('timetables')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);
        
      const newOrder = maxOrderData && maxOrderData.length > 0 
        ? (maxOrderData[0].order + 1) 
        : 1;
        
      const { data, error } = await supabase
        .from('timetables')
        .insert([{ ...timetableData, order: newOrder }])
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error creating timetable entry:', err);
      throw err;
    }
  },
  
  // Update existing timetable entry
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error updating timetable entry:', err);
      throw err;
    }
  },
  
  // Delete timetable entry
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting timetable entry:', err);
      throw err;
    }
  }
}; 