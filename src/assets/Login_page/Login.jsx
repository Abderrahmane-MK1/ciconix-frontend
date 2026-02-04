import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [memberInfos, setMemberInfos] = useState({
    FirstName: '',
    SecondName: '',
    Password: ''
  }); 
  
  const [teamInfos, setTeamInfos] = useState({
    teamName: '',
    Password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPass, setSelectedPass] = useState('');

  const handlePassSelect = (passType) => {
    setSelectedPass(passType);
    setError('');
    // Clear forms when switching
    if (passType === 'workshop') {
      setTeamInfos({ teamName: '', Password: '' });
    } else {
      setMemberInfos({ FirstName: '', SecondName: '', Password: '' });
    }
  };

  const handleWorkshopLogin = (e) => {
    const { name, value } = e.target;
    setMemberInfos(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCtfLogin = (e) => {
    const { name, value } = e.target;
    setTeamInfos(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateMemberInfo = () => {
    const { FirstName, SecondName, Password } = memberInfos;
    if (!FirstName.trim()) {
      setError('Please enter your first name');
      return false;
    }
    if (!SecondName.trim()) {
      setError('Please enter your second name');
      return false;
    }
    if (!Password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const validateTeamInfo = () => {
    const { teamName, Password } = teamInfos;
    if (!teamName.trim()) {
      setError('Please enter your team name');
      return false;
    }
    if (!Password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleWorkshopSubmit = async (e) => {
    e.preventDefault();
    if (!validateMemberInfo()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = {
        First_name: memberInfos.FirstName.trim(),
        Second_name: memberInfos.SecondName.trim(),
        Password: memberInfos.Password
      };
      
      const res = await axios.post("/api/basic_pass_login/", formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status === 200) {
        console.log('Login successful:', res.data);
        // Handle token storage and navigation
        if (res.data.access_token) {
          localStorage.setItem('access_token', res.data.access_token);
        }
        if (res.data.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token);
        }
        // navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Login failed. Please check your credentials.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCtfSubmit = async (e) => {
    e.preventDefault();
    if (!validateTeamInfo()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = {
        team_name: teamInfos.teamName.trim(),
        password: teamInfos.Password
      };
      
      const res = await axios.post("/api/special_pass_login/", formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status === 200) {
        console.log('Login successful:', res.data);
        // Handle token storage and navigation
        if (res.data.access_token) {
          localStorage.setItem('access_token', res.data.access_token);
        }
        if (res.data.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token);
        }
        // navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Login failed. Please check your credentials.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='login-page'>
      <img src="images/cic_logo.png" alt="CIC Logo" className='cic-logo' />
      <div className='login-container'>  
        <div className='login-selection'>
          <img src="images/ciconix_logo_piege.png" alt="CICONIX Logo" className='ciconix-logo'/>
          <h2>Login</h2>
          <p>Choose your pass type</p>
          
          <div className='pass-selection'>
            <button 
              className={`pass-select-btn ${selectedPass === 'workshop' ? 'active' : ''}`}
              onClick={() => handlePassSelect('workshop')}
              disabled={loading}
            >
              <span className='pass-select-title'>Workshop Pass</span>
            </button>
            <button 
              className={`pass-select-btn ${selectedPass === 'ctf' ? 'active' : ''}`}
              onClick={() => handlePassSelect('ctf')}
              disabled={loading}
            >
              <span className='pass-select-title'>CTF Pass</span>
            </button>
          </div>

          {error && (
            <div className='error-message'>
              {error}
            </div>
          )}

          {selectedPass === 'workshop' && (
            <form onSubmit={handleWorkshopSubmit} className='login-form'>
              <input 
                type="text"
                name='FirstName'
                value={memberInfos.FirstName}
                onChange={handleWorkshopLogin}
                disabled={loading}
                placeholder='Enter your first name'
                required
                autoFocus
              />
              <input 
                type="text"
                name='SecondName'
                value={memberInfos.SecondName}
                onChange={handleWorkshopLogin}
                disabled={loading}
                placeholder='Enter your second name'
                required
              />
              <input 
                type="password"
                name='Password'
                value={memberInfos.Password}
                onChange={handleWorkshopLogin}
                disabled={loading}
                placeholder='Enter your password'
                required
              />
              <button type='submit' id='login-btn' disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : 'Login'}
              </button>
            </form>
          )}

          {selectedPass === 'ctf' && (
            <form onSubmit={handleCtfSubmit} className='login-form'>
              <input 
                type="text"
                name='teamName'
                value={teamInfos.teamName}
                onChange={handleCtfLogin}
                disabled={loading}
                placeholder='Enter your team name'
                required
                autoFocus
              />
              <input 
                type="password"
                name='Password'
                value={teamInfos.Password}
                onChange={handleCtfLogin}
                disabled={loading}
                placeholder='Enter your team password'
                required
              />
              <button type='submit' id='login-btn' disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : 'Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;