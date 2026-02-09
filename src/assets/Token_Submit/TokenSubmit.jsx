import React, {useState} from 'react'
import axios from 'axios';
import './TokenSubmit.css'
import { getValidToken } from '../../Utils/auth';

const TokenSubmit = () => {

  const [token, setToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [points, setPoints] = useState(400);

  const handleTokenChange = (e) => {
    setToken(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  }; 

  const submitToken = async  (e) => {
    e.preventDefault();

    if(!token.trim()) {
        setErrorMessage('Please Enter the Token')
        return;
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    try {

       const accessToken = await getValidToken(); 
       const res = await axios.post('/api/token', token, 
        {
            headers: {
                'content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
       );

       if(res.status === 200) {
        setSuccessMessage(`Token submitted + ${res.data.point}`)
       }


    } catch (error) {
        if(error.response) {
            setErrorMessage(error.response.data.error);
        } else {
            setErrorMessage('Something went wrong. Please try again.')
        }
    } finally {
        setLoading(false)
    }
    
  }
  return (
    <main className="main-content">
        <div className="container">
            <div className="header-section">
                <h2>Token Submission</h2>
                <p className="subtitle">Submit your TOKEN and earn points</p>
            </div>
          
            <div className="points-section">
                <div className="points-card">
                  <span className="points-label">Total:</span>
                  <span className='points-value'>{points} pts</span>
                </div>
            </div>

            <div className="submit-section">
              <form onSubmit={submitToken} className="submit-form">
                <div className="form-group">
                  <label className="form-label">Enter Token</label>
                  <input 
                  type="text" 
                  value={token}
                  onChange={handleTokenChange}
                  placeholder="eg: CICONIX{your_flag_here}"
                  className="token-input"
                  disabled={loading}
                  />
                  <p className="format-hint">Format: &#39;CICONIX{"{"}flag_content{"}"}&#39;</p>
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
                disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : 'Submit your Token'}
                </button>
              </form>
            </div>
        </div>
      </main>
  )
}

export default TokenSubmit