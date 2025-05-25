import React, { useState, useEffect } from 'react';
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
import ExampleImage from "../assets/sample.png";
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { supabase } from '../supabase/supabase';

export default function Profile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // State for form fields
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    parkArea: "Park 1",
    workingDays: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false
    },
    startTime: "09:00",
    startPeriod: "AM",
    endTime: "05:00",
    endPeriod: "PM"
  });

  // Fetch user profile data
  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch park guide data
        const { data: parkGuideData, error: parkGuideError } = await supabase
          .from('park_guides')
          .select('*')
          .eq('supabase_uid', currentUser.id)
          .single();
        
        if (parkGuideError && parkGuideError.code !== 'PGRST116') {
          console.error('Error fetching park guide data:', parkGuideError);
          return;
        }
        
        if (parkGuideData) {
          // Parse working hours (format: "9:00 AM - 5:00 PM")
          let workingHours = parkGuideData.working_hours || "9:00 AM - 5:00 PM";
          let [startTime, endTime] = workingHours.split(' - ');
          let [startHour, startPeriod] = startTime.split(' ');
          let [endHour, endPeriod] = endTime.split(' ');
          
          // Parse working days from designation if available
          const workingDaysObj = {
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false
          };
          
          if (parkGuideData.designation) {
            const days = parkGuideData.designation.split(',');
            days.forEach(day => {
              const trimmedDay = day.trim();
              if (workingDaysObj.hasOwnProperty(trimmedDay)) {
                workingDaysObj[trimmedDay] = true;
              }
            });
          }
          
          // Update profile state
          setProfile({
            firstName: currentUser.user_metadata?.first_name || "",
            lastName: currentUser.user_metadata?.last_name || "",
            bio: parkGuideData.bio || "",
            parkArea: parkGuideData.park_area || "Park 1",
            workingDays: workingDaysObj,
            startTime: startHour,
            startPeriod: startPeriod,
            endTime: endHour,
            endPeriod: endPeriod
          });
          
          // Fetch avatar
          await fetchAvatar(parkGuideData.user_id);
        } else {
          // Set default values from user metadata if available
          setProfile(prev => ({
            ...prev,
            firstName: currentUser.user_metadata?.first_name || "",
            lastName: currentUser.user_metadata?.last_name || ""
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [currentUser]);
  
  // Fetch avatar from Supabase storage
  async function fetchAvatar(userId) {
    try {
      if (!userId) return;
      
      const { data, error } = await supabase
        .storage
        .from('avatar_images')
        .list(userId);
      
      if (error) {
        console.error('Error fetching avatar:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Get the most recent avatar
        const avatarFile = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )[0];
        
        // Get public URL
        const { data: urlData } = await supabase
          .storage
          .from('avatar_images')
          .getPublicUrl(`${userId}/${avatarFile.name}`);
          
        if (urlData) {
          setAvatarUrl(urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  }

  // Handle profile picture change - modified to use parkguides folder
  const handlePictureChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `parkguides/${currentUser.id}/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatar_images')
        .upload(filePath, file, {
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = await supabase
        .storage
        .from('avatar_images')
        .getPublicUrl(filePath);
        
      if (urlData) {
        setAvatarUrl(urlData.publicUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle working day selection
  const handleDayToggle = (day) => {
    setProfile(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day]
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("You must be logged in to save your profile.");
      return;
    }
    
    try {
      // Format working hours
      const workingHours = `${profile.startTime} ${profile.startPeriod} - ${profile.endTime} ${profile.endPeriod}`;
      
      // Format working days
      const workingDays = Object.entries(profile.workingDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day)
        .join(', ');
      
      // Update or insert park guide data
      const { error } = await supabase
        .from('park_guides')
        .upsert({
          supabase_uid: currentUser.id,
          username: `${profile.firstName} ${profile.lastName}`,
          bio: profile.bio,
          park_area: profile.parkArea,
          working_hours: workingHours,
          designation: workingDays
        }, { onConflict: 'supabase_uid' });
      
      if (error) throw error;
      
      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName
        }
      });
      
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  // Terra-Guide theme color
  const terraGreen = "#4E6E4E";

  return (
    <>
      <Top />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Card with Terra-Guide theme styling */}
            <div className="bg-white shadow rounded-4 overflow-hidden mb-4 border border-opacity-25" style={{ borderColor: terraGreen }}>
              {/* Header with Terra-Guide green */}
              <div className="bg-gradient text-white px-4 py-3 d-flex align-items-center" style={{backgroundColor: terraGreen}}>
                <i className="fas fa-user-edit me-2 fs-5"></i>
                <h4 className="mb-0 fw-normal">Edit Profile</h4>
              </div>
              
              {/* Content area with nature-inspired background */}
              <div className="p-4 p-lg-5">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: terraGreen }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your profile...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Profile Picture Section - Nature-themed styling */}
                    <div className="text-center mb-5">
                      <div className="position-relative d-inline-block">
                        <div className="shadow-sm rounded-circle overflow-hidden border border-3 border-opacity-25" style={{ width: "160px", height: "160px", borderColor: terraGreen }}>
                          <img 
                            src={avatarUrl || ExampleImage} 
                            className="w-100 h-100" 
                            alt="Profile Picture" 
                            style={{ objectFit: "cover" }} 
                          />
                        </div>
                        <label htmlFor="profile-picture" className="position-absolute bottom-0 end-0 bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: "45px", height: "45px", cursor: "pointer", transform: "translate(5px, -5px)", backgroundColor: terraGreen, transition: "all 0.2s ease" }}>
                          {uploading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <i className="fas fa-pencil-alt"></i>
                          )}
                          <input 
                            type="file" 
                            id="profile-picture" 
                            accept="image/*" 
                            className="d-none" 
                            onChange={handlePictureChange} 
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Name Fields - Terra-Guide themed */}
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            type="text" 
                            className="form-control rounded-3 bg-light shadow-sm"
                            id="firstName" 
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                          />
                          <label htmlFor="firstName"><i className="fas fa-user me-2" style={{ color: terraGreen }}></i>First Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            type="text" 
                            className="form-control rounded-3 bg-light shadow-sm" 
                            id="lastName" 
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                          />
                          <label htmlFor="lastName"><i className="fas fa-user me-2" style={{ color: terraGreen }}></i>Last Name</label>
                        </div>
                      </div>
                    </div>

                    {/* Bio Field - Terra-Guide themed */}
                    <div className="mb-4">
                      <div className="form-floating">
                        <textarea 
                          className="form-control rounded-3 bg-light shadow-sm" 
                          id="bio" 
                          name="bio"
                          placeholder="Tell us about yourself"
                          value={profile.bio}
                          onChange={handleChange}
                        ></textarea>
                        <label htmlFor="bio"><i className="fas fa-comment-alt me-2" style={{ color: terraGreen }}></i>Bio</label>
                      </div>
                    </div>

                    {/* Park Area Selection - Terra-Guide themed */}
                    <div className="mb-4">
                      <div className="form-floating">
                        <select 
                          className="form-select rounded-3 bg-light shadow-sm" 
                          id="parkArea" 
                          name="parkArea"
                          value={profile.parkArea}
                          onChange={handleChange}
                        >
                          <option value="Park 1">Park 1</option>
                          <option value="Park 2">Park 2</option>
                          <option value="Park 3">Park 3</option>
                        </select>
                        <label htmlFor="parkArea"><i className="fas fa-map-marker-alt me-2" style={{ color: terraGreen }}></i>Park Area</label>
                      </div>
                    </div>

                    {/* Working Days Selection - Nature-themed container */}
                    <div className="mb-4 p-4 bg-light rounded-4 shadow-sm">
                      <label className="form-label fw-medium mb-3 d-flex align-items-center">
                        <i className="fas fa-calendar-day me-2 fs-5" style={{ color: terraGreen }}></i>
                        <span>Working Days</span>
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                          <button 
                            key={day}
                            type="button" 
                            className={`btn ${profile.workingDays[day] ? 'shadow text-white' : 'bg-white shadow-sm'} rounded-pill px-4 py-2`}
                            style={{
                              backgroundColor: profile.workingDays[day] ? terraGreen : 'white',
                              borderColor: terraGreen,
                              borderWidth: "1px",
                              borderStyle: "solid",
                              transition: "all 0.2s ease"
                            }}
                            onClick={() => handleDayToggle(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Working Hours Selection - Nature-themed container */}
                    <div className="mb-5 p-4 bg-light rounded-4 shadow-sm">
                      <label className="form-label fw-medium mb-3 d-flex align-items-center">
                        <i className="fas fa-clock me-2 fs-5" style={{ color: terraGreen }}></i>
                        <span>Working Hours</span>
                      </label>
                      <div className="row g-3 align-items-center bg-white p-3 rounded-3 shadow-sm">
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select 
                              className="form-select rounded-3 bg-light" 
                              name="startTime"
                              value={profile.startTime}
                              onChange={handleChange}
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = i === 0 ? 12 : i;
                                return (
                                  <option key={`start-${hour}`} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                                    {hour}:00
                                  </option>
                                );
                              })}
                            </select>
                            <label>Start</label>
                          </div>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select 
                              className="form-select rounded-3 bg-light" 
                              name="startPeriod"
                              value={profile.startPeriod}
                              onChange={handleChange}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <label>Period</label>
                          </div>
                        </div>
                        <div className="col-md-1 col-12 text-center">
                          <span className="fw-medium" style={{ color: terraGreen }}>to</span>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select 
                              className="form-select rounded-3 bg-light" 
                              name="endTime"
                              value={profile.endTime}
                              onChange={handleChange}
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = i === 0 ? 12 : i;
                                return (
                                  <option key={`end-${hour}`} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                                    {hour}:00
                                  </option>
                                );
                              })}
                            </select>
                            <label>End</label>
                          </div>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select 
                              className="form-select rounded-3 bg-light" 
                              name="endPeriod"
                              value={profile.endPeriod}
                              onChange={handleChange}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <label>Period</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Button - Terra-Guide themed */}
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-lg px-5 py-3 rounded-pill shadow text-white" 
                        style={{ 
                          backgroundColor: terraGreen,
                          transition: "all 0.3s ease",
                          transform: "scale(1)"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <Footer1 />
      </footer>
    </>
  );
}
  