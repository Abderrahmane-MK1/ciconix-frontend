import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TokenSubmit.css'
import { getValidToken } from '../../Utils/auth';
import { FaStar } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa';


const TokenSubmit = () => {
  const [token, setToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenHistory, setTokenHistory] = useState([]);
  const [stats, setStats] = useState({ total_tokens: 0, total_points: 0 });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // ✅ FIXED: Proper useEffect with error handling
  // useEffect(() => {
  //   // Create a controller for cleanup
  //   const controller = new AbortController();
    
  //   const loadHistory = async () => {
  //     setIsLoadingHistory(true);
  //     try {
  //       await fetchTokenHistory(controller.signal);
  //     } catch (error) {
  //       if (error.name !== 'AbortError') {
  //         console.error('Failed to load token history:', error);
  //       }
  //     } finally {
  //       setIsLoadingHistory(false);
  //     }
  //   };
    
  //   loadHistory();
    
  //   // Cleanup function
  //   return () => {
  //     controller.abort();
  //   };
  // }, []);

  // ✅ FIXED: Add signal parameter for abort control
  const fetchTokenHistory = async (signal) => {
    try {
      const accessToken = await getValidToken();
      const res = await axios.get('/api/tokens/history/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        signal // Pass the abort signal
      });
      
      console.log('History response:', res.data);
      
      if (res.data.success) {
        setTokenHistory(res.data.data || []);
        setStats({
          total_tokens: res.data.stats.total_tokens || 0,
          total_points: res.data.stats.total_points || 0
        });
      }
    } catch (error) {
      // Don't log if it's an abort error (component unmounted)
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error('Error fetching token history:', error);
        if (error.response?.status === 401) {
          setErrorMessage('Session expired. Please login again.');
        }
      }
    }
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  }; 

  const submitToken = async (e) => {
    e.preventDefault();

    if(!token.trim()) {
        setErrorMessage('Please enter the token');
        return;
    }

    // Validate format (backend uses CIC{flag})
    if (!token.startsWith('CIC{') || !token.endsWith('}')) {
        setErrorMessage('Invalid format. Must be: CIC{flag_content}');
        return;
    }

    // Backend validation: token must be at least 32 chars
    if (token.length < 32) {
        setErrorMessage('Token is too short (minimum 32 characters)');
        return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
       const accessToken = await getValidToken(); 
       
       const res = await axios.post('/api/tokens/submit/', 
        { 
          token: token
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
       );

       console.log('Submit response:', res.data);

       if (res.data.success) {
           const earnedPoints = res.data.data?.points || 0;
           setSuccessMessage(`${res.data.message} +${earnedPoints} points!`);
           setToken('');
           
           // Refresh history
           await fetchTokenHistory();
           
           // Immediate feedback
           if (res.data.data) {
             const tempHistoryItem = {
               id: Date.now(),
               points: earnedPoints,
               submitted_at: new Date().toISOString()
             };
             setTokenHistory(prev => [tempHistoryItem, ...prev]);
             setStats(prev => ({
               total_tokens: prev.total_tokens + 1,
               total_points: prev.total_points + earnedPoints
             }));
           }
       } else {
           setErrorMessage(res.data.message || 'Submission failed');
       }

    } catch (error) {
        console.error('Submit error:', error);
        if (error.response) {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.response.data.errors) {
                const errors = error.response.data.errors;
                if (typeof errors === 'object') {
                    if (errors.token && Array.isArray(errors.token)) {
                        setErrorMessage(errors.token[0]);
                    } else {
                        const firstError = Object.values(errors)[0];
                        setErrorMessage(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                } else if (typeof errors === 'string') {
                    setErrorMessage(errors);
                }
            } else if (error.response.status === 400) {
                setErrorMessage('Invalid token format or duplicate submission');
            } else if (error.response.status === 401) {
                setErrorMessage('Authentication required. Please login again.');
            } else {
                setErrorMessage('Submission failed. Please try again.');
            }
        } else if (error.request) {
            setErrorMessage('Network error. Please check your connection.');
        } else {
            setErrorMessage('Something went wrong. Please try again.');
        }
    } finally {
        setLoading(false);
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  return (
    <main className="main-content">
        <div className="container">
            <div className="header-section">
                <h2>Token Submission</h2>
                <p className="subtitle">Submit CTF tokens and track your progress</p>
            </div>
          
            {/* Stats Section */}
            <div className="stats-section">
                <div className="stats-card">
                    <div className="stats-header">
                        <h3>Your Token Stats</h3>
                        {isLoadingHistory && <span className="loading-badge">Loading...</span>}
                    </div>
                    <div className="stats-grid">
                        <div className="stat-item total-points">
                            <div className="stat-icon"><FaStar size={20}/></div>
                            <div className="stat-content">
                                <span className="stat-label">Total Points</span>
                                <span className="stat-value">{stats.total_points}</span>
                            </div>
                        </div>
                        
                        <div className="stat-item tokens-count">
                            <div className="stat-icon"><FaKey size={20}/></div>
                            <div className="stat-content">
                                <span className="stat-label">Tokens Submitted</span>
                                <span className="stat-value">{stats.total_tokens}</span>
                            </div>
                        </div>
                        
                        <div className="stat-item avg-points">
                            <div className="stat-icon"><FaChartLine size={20}/></div>
                            <div className="stat-content">
                                <span className="stat-label">Average Points</span>
                                <span className="stat-value">
                                    {stats.total_tokens > 0 
                                        ? Math.round(stats.total_points / stats.total_tokens) 
                                        : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Token History Section */}
            {tokenHistory.length > 0 ? (
                <div className="history-section">
                    <div className="history-header">
                        <h3>Recent Submissions</h3>
                        <span className="history-count">{stats.total_tokens} total</span>
                    </div>
                    <div className="history-list">
                        {tokenHistory.slice(0, 8).map((item, index) => (
                            <div key={item.id || index} className="history-item">
                                <div className="history-left">
                                    <div className="history-points">
                                        <span className="points-badge">+{item.points} pts</span>
                                    </div>
                                </div>
                                <div className="history-time">
                                    {formatDate(item.submitted_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : !isLoadingHistory && (
                <div className="empty-history">
                    <p>No token submissions yet. Submit your first token!</p>
                </div>
            )}

            {/* Submit Form */}
            <div className="submit-section">
              <form onSubmit={submitToken} className="submit-form">
                <div className="form-group">
                  <label className="form-label">Enter Token</label>
                  <input 
                    type="text" 
                    value={token}
                    onChange={handleTokenChange}
                    placeholder="eg: CIC{md5_hash_here}"
                    className="token-input"
                    disabled={loading}
                  />
                  <div className="format-hint">
                    <p>Format: <code>CIC{"{"}flag_content{"}"}</code></p>
                  </div>
                </div>
              
                {errorMessage && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}
              
                {successMessage && (
                  <div className="success-message">
                    {successMessage}
                  </div>
                )}
              
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading || !token.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : 'Submit Token'}
                </button>
              </form>
            </div>
        </div>
      </main>
  )
}

export default TokenSubmit