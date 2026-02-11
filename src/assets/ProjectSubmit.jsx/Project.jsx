import React, { useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance'
import './Project.css';

const Project = () => {
  const [loading, setLoading] = useState(false); 
  const [link, setLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDriveLinkChange = (e) => {
    setLink(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!link.trim()) {
      setErrorMessage("Please enter Google Drive link");
      return;
    }

    if (!link.includes('drive.google.com')) {
      setErrorMessage('Please enter a valid Google Drive link');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {

      const res = await axiosInstance.post('/api/projects/submit/', {
        project_link: link
      });
  
      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Project submitted successfully!');
        setLink(''); 
      }

    } catch (error) {
    
      console.error("Submission error:", error);
    
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        const status = error.response.status;
        const data = error.response.data;
      
        //  Handle different HTTP status codes
        if (status === 400) {
          if (data.project_link) {
            setErrorMessage(data.project_link[0]); // Field-specific error
          } else if (data.non_field_errors) {
            setErrorMessage(data.non_field_errors[0]); // General error
          } else if (data.message) {
            setErrorMessage(data.message);
          } else {
            setErrorMessage('Invalid submission. Please check your link.');
          }
        } 
        else if (status === 401) {
          setErrorMessage('Your session has expired. Please login again.');
          // Optional: redirect to login
          // window.location.href = '/login';
        }
        else if (status === 403) {
          setErrorMessage('You do not have permission to submit a project.');
        }
        else if (status === 404) {
          setErrorMessage('Submission endpoint not found. Please contact support.');
        }
        else if (status === 429) {
          setErrorMessage('Too many attempts. Please wait a few minutes.');
        }
        else if (status >= 500) {
          setErrorMessage('Server error. Please try again later.');
        }
        else {
          setErrorMessage(data.message || 'Submission failed. Please try again.');
        }
      } else if (error.request) {
      // Request was made but no response received
      setErrorMessage('Network error. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <main className="main-content">
      <div className="container">
        <div className="header-section">
          <h2>Project Submission</h2>
          <p className="subtitle">Submit your final hackathon project</p>
        </div>

        <div className='guidelines'>
          <h3>Submission Guidelines</h3>
          <ul className="guidelines-list">
            <li>Upload your project to Google Drive and set sharing to "Anyone with the link"</li>
            <li>Include README.md with project description and setup instructions</li>
            <li>Add a demo video or screenshots if applicable</li>
            <li>Deadline: 13 February 2026 05:00 PM</li>
          </ul>
        </div>

        <div className="submit-project-section">
          <form className="submit-project-form" onSubmit={handleSubmit}>
            <div className="project-form-group">
              <div className='project-form-row'>
                <label className="project-form-label">Google Drive Link</label>
                <input 
                  type="text" 
                  value={link} 
                  onChange={handleDriveLinkChange}
                  placeholder="https://drive.google.com/..."
                  className="token-input"
                  disabled={loading}
                />
                <p className="format-hint">Make sure the link is publicly accessible</p>
              </div>
              
              <div className="confirmation-message">
                By submitting, you confirm that this is your team's original work and complies with the hackathon rules.
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
              disabled={loading || !link.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : 'Submit Project'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Project;