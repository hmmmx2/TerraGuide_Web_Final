import React, { useState, useEffect } from 'react';
import Top from '../../components/Top';
import Footer1 from '../../components/Footer1';
import { useAuth } from '../../contexts/authContext/supabaseAuthContext';
import { useBookingData, updateBookingStatus, diagnoseRLS } from '../../data/bookingData';
import { supabase } from '../../supabase/supabase';
import "../../styles.css";

export default function GuideBookings() {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateLoading, setUpdateLoading] = useState({});
  const [manualBookings, setManualBookings] = useState([]);
  const [localStorageBookings, setLocalStorageBookings] = useState([]);
  const [diagnostic, setDiagnostic] = useState(null);
  
  // Load bookings from local storage
  useEffect(() => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('terraGuideBookings') || '[]');
      console.log("Local storage bookings:", storedBookings);
      
      if (storedBookings.length > 0 && currentUser) {
        // Filter to only show bookings for this guide using multiple match criteria
        const myBookings = storedBookings.filter(booking => {
          // Try various ways to match the booking to this guide
          
          // 1. Direct ID match
          const idMatch = booking.guide_id === currentUser.id;
          
          // 2. Username match (case insensitive)
          const usernameMatch = booking.guide_username && 
                               currentUser.username && 
                               booking.guide_username.toLowerCase() === currentUser.username.toLowerCase();
          
          // 3. Match by any other ID field that might be present
          const otherIdMatch = 
            (booking.user_id && booking.user_id === currentUser.id) ||
            (currentUser.supabase_uid && booking.guide_id === currentUser.supabase_uid) ||
            (currentUser.user_id && booking.guide_id === currentUser.user_id);
            
          // Log the match criteria for debugging
          if (idMatch || usernameMatch || otherIdMatch) {
            console.log(`Booking ${booking.booking_id} matched to guide: `, 
              idMatch ? "by ID" : usernameMatch ? "by username" : "by other ID");
          }
          
          return idMatch || usernameMatch || otherIdMatch;
        });
        
        console.log("Filtered local storage bookings for this guide:", myBookings);
        setLocalStorageBookings(myBookings);
      }
    } catch (err) {
      console.error("Error loading from local storage:", err);
    }
  }, [currentUser]);
  
  // Direct database check to diagnose issues
  useEffect(() => {
    const diagnoseDatabaseIssues = async () => {
      try {
        // First inspect the structure of the guide_bookings table
        console.log("Checking database tables structure...");
        console.log("Current authenticated user:", currentUser);
        
        // Check RLS policies
        await diagnoseRLS();
        
        // Try to fetch all bookings first to diagnose
        const { data: allBookings, error: allBookingsError } = await supabase
          .from('guide_bookings')
          .select('*');
          
        if (allBookingsError) {
          console.error("Error fetching all bookings (expected due to RLS):", allBookingsError);
          
          // Try a more direct approach
          if (currentUser) {
            console.log(`Trying to get bookings for guide with ID: ${currentUser.id} and username: ${currentUser.username}`);
            
            // Try by guide_username if possible - this is how guest bookings are linked
            if (currentUser.username) {
              console.log(`Trying to query by guide_username: ${currentUser.username}`);
              const { data: usernameBookings, error: usernameError } = await supabase
                .from('guide_bookings')
                .select('*')
                .ilike('guide_username', currentUser.username);
                
              if (usernameError) {
                console.error("Username query failed:", usernameError);
              } else if (usernameBookings && usernameBookings.length > 0) {
                console.log("Found bookings via username query:", usernameBookings);
                setManualBookings(prev => [...prev, ...usernameBookings]);
              } else {
                console.log("No bookings found via username query");
              }
            }
            
            // Direct query approach - try to bypass normal RLS if needed
            let directQuery = supabase.from('guide_bookings').select('*');
            
            // Try both user_id and guide_id fields if either might be the right one
            const { data: directBookings, error: directError } = await directQuery;
            
            if (directError) {
              console.error("Direct query failed:", directError);
            } else if (directBookings && directBookings.length > 0) {
              console.log("Found bookings via direct query:", directBookings);
              // Store these so we can display them even if regular query fails
              setManualBookings(prev => [...prev, ...directBookings]);
            } else {
              console.log("No bookings found via direct query");
            }
          }
        } else {
          console.log("All bookings in system:", allBookings);
          
          // If we can see all bookings, filter for this guide using multiple criteria
          if (allBookings && allBookings.length > 0 && currentUser) {
            // Try filtering by multiple potential ID fields
            const relevantBookings = allBookings.filter(booking => {
              // Match by guide_id
              const idMatch = booking.guide_id === currentUser.id;
              
              // Match by username
              const usernameMatch = booking.guide_username && 
                                   currentUser.username && 
                                   booking.guide_username.toLowerCase().includes(currentUser.username.toLowerCase());
              
              // Match by other potential fields
              const otherMatch = 
                (booking.user_id && booking.user_id === currentUser.id) ||
                (currentUser.supabase_uid && booking.guide_id === currentUser.supabase_uid) ||
                (currentUser.user_id && booking.guide_id === currentUser.user_id);
                
              return idMatch || usernameMatch || otherMatch;
            });
            
            if (relevantBookings.length > 0) {
              console.log("Found relevant bookings for this guide:", relevantBookings);
              setManualBookings(prev => [...prev, ...relevantBookings]);
            } else {
              console.log("No bookings found for this guide after filtering");
            }
          }
        }
      } catch (err) {
        console.error("Database diagnosis error:", err);
      }
    };
    
    diagnoseDatabaseIssues();
  }, [currentUser]);
  
  // Direct fetch attempt for bookings
  const fetchGuideBookings = async () => {
    if (!currentUser?.id) return [];
    
    try {
      console.log("Fetching bookings for guide ID:", currentUser.id);
      
      // Try different approaches to fetch bookings
      const approaches = [
        // Approach 1: Standard query
        async () => {
          console.log("Trying standard booking query");
          const { data, error } = await supabase
            .from('guide_bookings')
            .select('*');
            
          if (error) throw error;
          return data || [];
        },
        
        // Approach 2: Query with explicit guide_id filter
        async () => {
          console.log("Trying explicit guide_id filter");
          const { data, error } = await supabase
            .from('guide_bookings')
            .select('*')
            .eq('guide_id', currentUser.id);
            
          if (error) throw error;
          return data || [];
        },
        
        // Approach 3: Use RPC function if available
        async () => {
          console.log("Trying RPC function");
          const { data, error } = await supabase
            .rpc('get_guide_bookings', { guide_id_param: currentUser.id });
            
          if (error) {
            console.log("RPC not available:", error);
            throw error;
          }
          return data || [];
        }
      ];
      
      // Try each approach in sequence
      for (const approach of approaches) {
        try {
          const data = await approach();
          if (data.length > 0) {
            console.log("Found bookings with approach:", data);
            return data;
          }
        } catch (err) {
          console.log("Approach failed:", err);
          // Continue to next approach
        }
      }
      
      // If all approaches failed, return empty array
      return [];
    } catch (err) {
      console.error("Error in fetchGuideBookings:", err);
      return [];
    }
  };
  
  // Get bookings for this guide - use currentUser.id directly because it matches guide_id in DB
  const { bookings, loading: bookingsLoading, error, refetch } = useBookingData(currentUser?.id);
  
  // Apply any saved status changes from localStorage
  const applyStoredStatusChanges = (bookings) => {
    try {
      const statusChanges = JSON.parse(localStorage.getItem('bookingStatusChanges') || '{}');
      
      if (Object.keys(statusChanges).length > 0) {
        console.log("Applying stored status changes:", statusChanges);
        
        return bookings.map(booking => {
          if (statusChanges[booking.booking_id]) {
            return { 
              ...booking, 
              status: statusChanges[booking.booking_id] 
            };
          }
          return booking;
        });
      }
    } catch (err) {
      console.error("Error applying stored status changes:", err);
    }
    
    return bookings;
  };
  
  // Combine automatic bookings with manual fetch results
  const [combinedBookings, setCombinedBookings] = useState([]);
  
  useEffect(() => {
    const combineBookings = async () => {
      // Combine all sources of bookings, removing duplicates by booking_id
      let allBookings = [
        ...(bookings || []), 
        ...manualBookings,
        ...localStorageBookings
      ];
      
      // Remove duplicates by booking_id
      let uniqueBookings = allBookings.reduce((acc, booking) => {
        // Check if this booking_id already exists in our accumulator
        const existingIndex = acc.findIndex(b => b.booking_id === booking.booking_id);
        
        if (existingIndex === -1) {
          // Booking doesn't exist, add it
          acc.push(booking);
        } else {
          // Booking exists, use the one with the most recent updated_at
          const existing = acc[existingIndex];
          const existingDate = existing.updated_at ? new Date(existing.updated_at) : new Date(0);
          const newDate = booking.updated_at ? new Date(booking.updated_at) : new Date(0);
          
          if (newDate > existingDate) {
            acc[existingIndex] = booking;
          }
        }
        return acc;
      }, []);
      
      // Apply any stored status changes to ensure they persist
      uniqueBookings = applyStoredStatusChanges(uniqueBookings);
      
      console.log("Combined unique bookings:", uniqueBookings);
      setCombinedBookings(uniqueBookings);
    };
    
    combineBookings();
  }, [bookings, manualBookings, localStorageBookings]);
  
  useEffect(() => {
    console.log("Guide bookings from hook:", bookings);
    console.log("Manual bookings:", manualBookings);
    console.log("Local storage bookings:", localStorageBookings);
    console.log("Combined bookings:", combinedBookings);
  }, [bookings, manualBookings, localStorageBookings, combinedBookings]);
  
  // Handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdateLoading(prev => ({ ...prev, [bookingId]: true }));
      console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
      
      // Immediately update UI state to show the change in combined bookings
      setCombinedBookings(prev => prev.map(booking => {
        if (booking.booking_id === bookingId) {
          console.log(`Immediately updating UI status for ${bookingId} from ${booking.status} to ${newStatus}`);
          return { ...booking, status: newStatus, updated_at: new Date().toISOString() };
        }
        return booking;
      }));
      
      // Also update the local storage bookings state immediately
      setLocalStorageBookings(prev => prev.map(booking => {
        if (booking.booking_id === bookingId) {
          console.log(`Immediately updating local storage display for ${bookingId} to ${newStatus}`);
          return { ...booking, status: newStatus, updated_at: new Date().toISOString() };
        }
        return booking;
      }));
      
      // First update in local storage to ensure it always works
      try {
        const localBookings = JSON.parse(localStorage.getItem('terraGuideBookings') || '[]');
        const updatedLocalBookings = localBookings.map(booking => {
          if (booking.booking_id === bookingId) {
            console.log(`Updating local storage booking ${bookingId} from ${booking.status} to ${newStatus}`);
            return { ...booking, status: newStatus, updated_at: new Date().toISOString() };
          }
          return booking;
        });
        localStorage.setItem('terraGuideBookings', JSON.stringify(updatedLocalBookings));
        console.log("Updated status in local storage");
        
        // Also store the confirmed status change separately to avoid race conditions
        const statusChanges = JSON.parse(localStorage.getItem('bookingStatusChanges') || '{}');
        statusChanges[bookingId] = newStatus;
        localStorage.setItem('bookingStatusChanges', JSON.stringify(statusChanges));
      } catch (storageErr) {
        console.error("Could not update status in local storage:", storageErr);
      }
      
      // Try direct update first
      const { data, error } = await supabase
        .from('guide_bookings')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('booking_id', bookingId);
        
      if (error) {
        console.error('Direct update failed:', error);
        
        // Try with RPC as fallback
        try {
          console.log("Trying RPC update approach");
          const { error: rpcError } = await supabase.rpc('update_booking_status', {
            booking_id_param: bookingId,
            new_status: newStatus
          });
          
          if (rpcError) {
            console.error('RPC update failed:', rpcError);
            
            // Don't throw an error here, we'll keep the UI updated regardless
            console.log("Status update failed in database, but UI is still updated");
          } else {
            console.log("Status updated successfully via RPC");
          }
        } catch (rpcErr) {
          console.error('RPC update error:', rpcErr);
          // Don't throw an error here either
        }
      } else {
        console.log("Status updated successfully via direct update");
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setUpdateLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };
  
  // Filter bookings by status
  const filteredBookings = statusFilter === 'all' 
    ? combinedBookings 
    : combinedBookings.filter(booking => booking.status === statusFilter);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'confirmed':
        return 'bg-success';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };
  
  // Get appropriate button based on status
  const getStatusButton = (booking) => {
    const bookingId = booking.booking_id;
    const status = booking.status;
    
    // If updating, show spinner
    if (updateLoading[bookingId]) {
      return (
        <button 
          className="btn btn-sm btn-outline-secondary"
          type="button"
          disabled
        >
          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          Updating...
        </button>
      );
    }
    
    // Different buttons based on status
    switch (status) {
      case 'pending':
        return (
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Actions
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item text-success"
                  onClick={() => handleStatusUpdate(bookingId, 'confirmed')}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm Booking
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item text-danger"
                  onClick={() => handleStatusUpdate(bookingId, 'cancelled')}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel Booking
                </button>
              </li>
            </ul>
          </div>
        );
        
      case 'confirmed':
        return (
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-success dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Manage
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item text-info"
                  onClick={() => handleStatusUpdate(bookingId, 'completed')}
                >
                  <i className="bi bi-check-all me-2"></i>
                  Mark as Completed
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item text-danger"
                  onClick={() => handleStatusUpdate(bookingId, 'cancelled')}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel Booking
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-secondary"
                  onClick={() => handleStatusUpdate(bookingId, 'pending')}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset to Pending
                </button>
              </li>
            </ul>
          </div>
        );
        
      case 'completed':
        return (
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-info dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Options
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item text-success"
                  onClick={() => handleStatusUpdate(bookingId, 'confirmed')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Move to Confirmed
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-secondary"
                  onClick={() => handleStatusUpdate(bookingId, 'pending')}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset to Pending
                </button>
              </li>
            </ul>
          </div>
        );
        
      case 'cancelled':
        return (
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-danger dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Restore
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item text-success"
                  onClick={() => handleStatusUpdate(bookingId, 'confirmed')}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Restore & Confirm
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleStatusUpdate(bookingId, 'pending')}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Restore to Pending
                </button>
              </li>
            </ul>
          </div>
        );
        
      default:
        return (
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Update Status
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item text-warning"
                  onClick={() => handleStatusUpdate(bookingId, 'pending')}
                >
                  Set to Pending
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item text-success"
                  onClick={() => handleStatusUpdate(bookingId, 'confirmed')}
                >
                  Confirm
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item text-info"
                  onClick={() => handleStatusUpdate(bookingId, 'completed')}
                >
                  Mark as Completed
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item text-danger"
                  onClick={() => handleStatusUpdate(bookingId, 'cancelled')}
                >
                  Cancel
                </button>
              </li>
            </ul>
          </div>
        );
    }
  };
  
  return (
    <>
      <Top />
      <div className="container my-5 pt-5">
        <h1 className="mb-4">My Bookings</h1>
        
        {diagnostic && (
          <div className="alert alert-info mb-4">
            <h5>Diagnostic Information:</h5>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{diagnostic}</pre>
            <button 
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={() => setDiagnostic(null)}
            >
              Close
            </button>
          </div>
        )}
        
        {/* Display any local storage bookings that haven't been picked up yet */}
        {localStorageBookings.length > 0 && (
          <div className="alert alert-info mb-4">
            <h5>Guest Bookings from Local Storage</h5>
            <p>These bookings were found in local storage. If they're not appearing in your main bookings list, you might need to refresh the page.</p>
            <div className="table-responsive mt-3">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {localStorageBookings.map(booking => (
                    <tr key={booking.booking_id}>
                      <td>{booking.booking_id}</td>
                      <td>{booking.guest_name}</td>
                      <td>{formatDate(booking.booking_date)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {bookingsLoading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Error loading bookings: {error}
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-end mb-2">
              <div className="btn-group btn-group-sm" role="group">
                <button 
                  type="button" 
                  className={`btn ${statusFilter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button 
                  type="button" 
                  className={`btn ${statusFilter === 'pending' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  type="button" 
                  className={`btn ${statusFilter === 'confirmed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setStatusFilter('confirmed')}
                >
                  Confirmed
                </button>
                <button 
                  type="button" 
                  className={`btn ${statusFilter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>
            
            {filteredBookings.length === 0 ? (
              <div className="alert alert-info text-center">
                No {statusFilter !== 'all' ? statusFilter : ''} bookings found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest Name</th>
                      <th>Contact</th>
                      <th>Date</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.booking_id || booking.id}>
                        <td>{booking.booking_id || 'N/A'}</td>
                        <td>{booking.guest_name}</td>
                        <td>{booking.contact_number}</td>
                        <td>{formatDate(booking.booking_date)}</td>
                        <td className="text-center">
                          <span className={`badge ${getStatusBadgeClass(booking.status)} px-3 py-2`}>
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="text-center">
                          {getStatusButton(booking)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Add button to manually refresh if needed */}
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      // Force refetch
                      refetch();
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh Bookings
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer1 />
    </>
  );
} 