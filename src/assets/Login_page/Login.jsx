import React, { useState } from 'react'
import axios from 'axios';
import { saveTokens } from '../../Utils/auth';
import './Login.css'

const Login = () => {
    
    const [teamInfos, setTeamInfos] = useState({
        team_name: '',
        password: ''
    })
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    
    const handleLoginChange = (e) => {
        const {name, value} = e.target;
        setTeamInfos(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const validateLogin = () => {
        const { team_name, password } = teamInfos;

        if(!team_name.trim()) {
            setErrorMessage("Please enter your team name");
            setTimeout(() => {
                setErrorMessage('')
            }, 5000);
            return false;
        }

        if(!password) {
            setErrorMessage("Your password is required");
            setTimeout(() => {
                setErrorMessage('')
            }, 5000);
            return false;
        }

        return true;
    }

    const handleTeamSubmit = async (e) => {
        e.preventDefault();

        if(!validateLogin()) return; 

        setLoading(true);
        setErrorMessage('');

        try {
            const formData = {
                team_name: teamInfos.team_name.trim(),
                password: teamInfos.password
            }

            const res = await axios.post("http://127.0.0.1:8000/api/teams/login/", formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Login response:", res.data);

            if(res.status === 200 && res.data.success) {
    
                const responseData = res.data.data;
                
               
                saveTokens({
                    access: responseData.access, 
                    refresh: responseData.refresh,
                    expires_in: responseData.expires_in,
                    team_name: responseData.team_name
                });

                localStorage.setItem('team_name', responseData.team_name);
                if (responseData.ctfd_team_id) {
                    localStorage.setItem('ctfd_team_id', responseData.ctfd_team_id);
                }

                setTeamInfos({ team_name: '', password: '' });

                window.location.href = '/dashboard';
            }

        } catch (error) {
            if(error.response) {
                setErrorMessage(error.response.data.errors || 'Login failed. Please check your credentials.');
            } else {
                setErrorMessage('Network error. Please check your connection.')
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='login-page'>
            <img src="/images/cic_logo.png" alt="CIC Logo" className='cic-logo' />
            <div className='login-container'>  
                <div className='login-selection'>
                    <img src="images/Beige logo.png" alt="CICONIX Logo" className='login-ciconix-logo'/>
                    <h2>Login</h2>
                    <p>Login and start</p>

                    {errorMessage && (
                        <div className='error-message'>
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleTeamSubmit} className='login-form'>
                        <div className='form_group'>
                            <label htmlFor="team_name">Team name*</label>
                            <input 
                                type="text"
                                name='team_name'
                                value={teamInfos.team_name}
                                onChange={handleLoginChange}
                                disabled={loading}
                                placeholder='Enter your team name'
                                required
                            />
                        </div>

                        <div className='form_group'>
                            <label htmlFor="password">Password*</label>
                            <input 
                                type="password"
                                name='password'
                                value={teamInfos.password}
                                onChange={handleLoginChange}
                                disabled={loading}
                                placeholder='Enter your team password'
                                required
                            />
                        </div>
                        

                        <button type='submit' id='login-btn' disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Logging in...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Login;