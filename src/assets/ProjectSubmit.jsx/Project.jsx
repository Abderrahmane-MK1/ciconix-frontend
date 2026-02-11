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
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Submission failed');
      } else if (error.request) {
        setErrorMessage('Network error. Please check your connection.');
      } else {
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
            <li>Deadline: March 22, 2026 at 11:00 AM</li>
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
              disabled={loading}
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