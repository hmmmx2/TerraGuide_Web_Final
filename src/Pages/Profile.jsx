import React, { useState, useEffect } from 'react';
import Top from '../components/Top';
import Footer1 from '../components/Footer1';
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
    parkArea: "Not assigned",
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
  const fetchProfile = async () => {
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
        let startTime = "09:00";
        let endTime = "05:00";
        let startHour = "09:00";
        let startPeriod = "AM";
        let endHour = "05:00";
        let endPeriod = "PM";
        
        try {
          const parts = workingHours.split(' - ');
          if (parts.length === 2) {
            [startTime, endTime] = parts;
            
            const startParts = startTime.split(' ');
            if (startParts.length === 2) {
              [startHour, startPeriod] = startParts;
            }
            
            const endParts = endTime.split(' ');
            if (endParts.length === 2) {
              [endHour, endPeriod] = endParts;
            }
          }
        } catch (error) {
          console.error('Error parsing working hours:', error);
          // Use default values already set above
        }
        
        // Parse working days from working_days if available
        const workingDaysObj = {
          Mon: false,
          Tue: false,
          Wed: false,
          Thu: false,
          Fri: false
        };
        
        if (parkGuideData.working_days) {
          const days = parkGuideData.working_days.split(',');
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
        
        // Check if avatar_url exists in the database first
        if (parkGuideData.avatar_url) {
          // Add cache-busting query parameter
          setAvatarUrl(`${parkGuideData.avatar_url}?t=${new Date().getTime()}`);
        } else {
          // Fallback to fetching from storage if no avatar_url is stored
          await fetchAvatar(currentUser.id);
        }
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
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);
  
  // Fetch avatar from Supabase storage - modified to use parkguides folder
  async function fetchAvatar(supabaseUid) {
    try {
      if (!supabaseUid) return;
      
      const { data, error } = await supabase
        .storage
        .from('avatar-images')
        .list(`parkguides/${supabaseUid}`);
      
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
          .from('avatar-images')
          .getPublicUrl(`parkguides/${supabaseUid}/${avatarFile.name}`);
          
        if (urlData) {
          // Add cache-busting query parameter
          setAvatarUrl(`${urlData.publicUrl}?t=${new Date().getTime()}`);
        }
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  }

  // Handle profile picture change
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handlePictureChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create a local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Update the avatarUrl for preview only (not saved to database yet)
    setAvatarUrl(objectUrl);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser) {
      alert("You must be logged in to save your profile.");
      return;
    }
  
    try {
      setUploading(true);
      let finalAvatarUrl = avatarUrl;
  
      // If there's a new file selected, upload it
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `parkguides/${currentUser.id}/${fileName}`;
  
        // Upload to Supabase storage
        const { error: uploadError } = await supabase
          .storage
          .from('avatar-images')
          .upload(filePath, selectedFile);
  
        if (uploadError) {
          console.error('Upload error details:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
        }
  
        // Get public URL
        const { data: urlData, error: urlError } = await supabase
          .storage
          .from('avatar-images')
          .getPublicUrl(filePath);
  
        if (urlError) {
          console.error('URL retrieval error:', urlError);
          throw new Error(`Failed to get image URL: ${urlError.message || 'Unknown error'}`);
        }
  
        if (urlData) {
          finalAvatarUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`; // Add cache-busting
          
          // Clean up the local preview URL
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
  
          // Reset the selected file
          setSelectedFile(null);
        } else {
          throw new Error('Failed to get image URL: No data returned');
        }
      }
  
      // Format working hours
      const workingHours = `${profile.startTime} ${profile.startPeriod} - ${profile.endTime} ${profile.endPeriod}`;
  
      // Format working days
      const workingDays = Object.entries(profile.workingDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day)
        .join(', ');
  
      // Fetch the user_id from the users table based on supabase_uid
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('supabase_uid', currentUser.id)
        .single();
  
      if (userError || !userData) {
        console.error('Error fetching user_id:', userError);
        throw new Error('Could not find user in the users table.');
      }
  
      const validUserId = userData.id;
  
      // Update or insert park guide data
      const { error } = await supabase
        .from('park_guides')
        .upsert({
          user_id: validUserId,
          supabase_uid: currentUser.id,
          username: `${profile.firstName} ${profile.lastName}`,
          bio: profile.bio,
          park_area: profile.parkArea,
          working_hours: workingHours,
          working_days: workingDays,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'supabase_uid' });
  
      if (error) {
        console.error('Upsert error:', error);
        throw error;
      }
  
      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName
        }
      });
  
      // Update the avatarUrl state with the final URL
      setAvatarUrl(finalAvatarUrl);
  
      // Refresh profile data to ensure the latest avatar_url is fetched
      await fetchProfile();
  
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
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
                        <div
                          className="shadow-sm rounded-circle overflow-hidden border border-3 border-opacity-25"
                          style={{
                            width: "160px",
                            height: "160px",
                            borderColor: terraGreen,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f8f9fa" // Light background for icon
                          }}
                        >
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              className="w-100 h-100"
                              alt="Profile Picture"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<i class="fas fa-user fa-3x" style="color: ${terraGreen};"></i>`;
                              }}
                            />
                          ) : (
                            <i className="fas fa-user fa-3x" style={{ color: terraGreen }}></i>
                          )}
                        </div>
                        <label
                          htmlFor="profile-picture"
                          className="position-absolute bottom-0 end-0 bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                          style={{
                            width: "45px",
                            height: "45px",
                            cursor: "pointer",
                            transform: "translate(5px, -5px)",
                            backgroundColor: terraGreen,
                            transition: "all 0.2s ease"
                          }}
                        >
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
                          <option value="">Not assigned</option>
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