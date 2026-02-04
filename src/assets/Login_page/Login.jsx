import React, { useState } from 'react'
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [memberInfos, setMemberInfos] = useState({
    FirstName: '',
    SecondName:'',
    Password: ''
  }); 

  const [teamInfos, setTeaminfos] = useState({
    teamName: '',
    Password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPass, setSelectedPass] = useState('')
  const navigate = useNavigate();

  const handlePassSelect = (Passtype) => {
    setSelectedPass(Passtype);
    setError('')
  };

  const handleWorkshoplogin = (e) => {
    const {name, value} = e.target;
    setMemberInfos(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleCtflogin =(e) => {
    const {name, value} = e.target;
    setTeaminfos(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const CheckMemberInfos =() => {
    const first_name = memberInfos.FirstName.trim();
    const second_name = memberInfos.SecondName.trim();
    const member_password = memberInfos.Password;

    if(!first_name) {
        setError('Please enter your First name');
        setLoading(false)
        return false
    }

    if(!second_name) {
        setError('Please enter your Second name');
        setLoading(false)
        return false
    }

    if(!member_password) {
        setError('Please enter your Password')
        setLoading(false)
        return false
    }

    return true;

  }

  const CheckTeamInfos = () => {
    const team_name = teamInfos.teamName.trim();
    const team_password = teamInfos.Password.trim();

    if(!team_name) {
        setError('Please enter your team name')
        setLoading(false)
        return false
    }

    if(!team_password) {
        setError('Please enter your password')
        setLoading(false)
        return false
    }

    return true;

  }

  const WorkshopLogin = async (e) => {
    e.preventDefault();

    if (!CheckMemberInfos()) return;

    setLoading(true);
    setError('');

    try {
        const formData = {
            First_name: memberInfos.FirstName.trim(),
            Second_name: memberInfos.SecondName.trim(),
            Password: memberInfos.Password
        };

        const res = await axios.post("/api/basic_pass_login/", formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 200) {
            console.log('Login successful:', res.data);
            
            if (res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
            }
            if (res.data.refresh_token) {
                localStorage.setItem('refresh_token', res.data.refresh_token);
            }
            
            navigate('/');
        }
    } catch (error) {
        if (error.response) {
            setError(error.response.data.error || 'Login failed');
        } else {
            setError('Network error. Please check your connection.');
        }
    } finally {
        setLoading(false);
    }
};

  const CtfLogin = async (e) => {
    e.preventDefault();
    
    if(!CheckTeamInfos()) return;

    setLoading(true);
    setError('');

    try {
        const formData = {
            team_name: teamInfos.teamName.trim(),
            password: teamInfos.Password
        }

        const res = await axios.post("/api/special_pass_login/", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(res.status === 200) {
            console.log('Login successful:', res.data);

            if (res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
            }
            if (res.data.refresh_token) {
                localStorage.setItem('refresh_token', res.data.refresh_token);
            }
        }

        navigate('/');
    } catch (error) {
        if (error.response) {
            setError(error.response.data.error || 'Login failed');
        } else {
            setError('Network error. Please check your connection.');
        }
    } finally {
        setLoading(false);
    }
  }

  return (
    <main className='login-container'>
        <img src="images/ciconix_logo_piege.png" alt="ciconix_logo" />
        <h2>Log in</h2>
        <p>Choose your pass</p>

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
            <span className='pass-select-title'>Ctf Pass</span>
        </button>

        {error && (
            <div className='error-message'>
                {error}
            </div>
        )}

        {selectedPass === 'workshop' && (
            <form  onSubmit={WorkshopLogin} className='login-form'>
                <input 
                type="text"
                id='first-name'
                name='FirstName'
                value={memberInfos.FirstName}
                onChange={handleWorkshoplogin}
                disabled={loading}
                placeholder='your First name'
                required
                autoFocus
                 />
                
                <input 
                type="text"
                id='second-name'
                name='SecondName'
                value={memberInfos.SecondName}
                onChange={handleWorkshoplogin}
                disabled={loading}
                placeholder='your Second name'
                required
                autoFocus
                 />

                <input 
                type="password"
                id='password'
                name='Password'
                value={memberInfos.Password}
                onChange={handleWorkshoplogin}
                disabled={loading}
                placeholder='your Password'
                required
                />

                <button type='submit' id='login-btn' disabled={loading}>
                    {loading ? (
                        <>
                          <span className="spinner"></span>
                          Logging in...
                        </>
                    ) : 'Log in'}
                </button>
            </form>
        )}

        {selectedPass === 'ctf' && (
            <form  onSubmit={CtfLogin} className='login-form'>
                <input 
                type="text"
                id='team-name'
                name='teamName'
                value={teamInfos.teamName}
                onChange={handleCtflogin}
                disabled={loading}
                placeholder='your team name'
                required
                 />

                <input 
                type="password"
                id='password'
                name='Password'
                value={teamInfos.Password}
                onChange={handleCtflogin}
                disabled={loading}
                placeholder='Team Password'
                required
                />

                <button type='submit' id='login-btn' disabled={loading}>
                    {loading ? (
                        <>
                          <span className="spinner"></span>
                          Logging in...
                        </>
                    ) : 'Log in'}
                </button>
            </form>
        )}
    </main>
  )
}

export default Login