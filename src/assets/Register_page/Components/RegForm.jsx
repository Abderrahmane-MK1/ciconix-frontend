import React, { useState } from 'react'
import axios from 'axios'
import './Reg_Form.css'

const RegForm = () => {
  const [selectedPass, setSelectedPass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  

  const schoolOptions = [
    { value: 'NSCS', label: 'National School of Cybersecurity' },
    { value: 'ENSIA', label: 'National School of Artificial Intelligence' },
    { value: 'NHSM', label: 'National Higher School of Mathematics' },
    { value: 'NHSAST', label: 'National Higher School of Autonomous Systems Technology' },
    { value: 'NHSNNT', label: 'National Higher School of Nano And Nanotechnology' },
    { value: 'ESI', label: 'National School of Computer Science' },
    { value: 'ESI-SBA', label: 'National School of Computer Science Sidi Bel Abbes' },
    { value: 'ESTIN', label: 'Higher School in Computer Science and Digital Technologies' },
    { value: 'NIT', label: 'Numidia Institute of Technology' },
    { value: 'Other', label: 'Other' },
  ];

  const yearOptions = [
    { value: 1, label: '1st Year' },
    { value: 2, label: '2nd Year' },
    { value: 3, label: '3rd Year' },
    { value: 4, label: '4th Year' },
    { value: 5, label: '5th Year' },
  ];

  const skillsOptions = [
    { value: 'Cryptography', label: 'Cryptography' },
    { value: 'Web Security', label: 'Web Security' },
    { value: 'PWN & Binary Exploitation', label: 'PWN & Binary Exploitation' },
    { value: 'Reverse Engineering', label: 'Reverse Engineering' },
    { value: 'Forensics', label: 'Forensics' },
    { value: 'OSINT', label: 'OSINT' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Programming', label: 'Programming' },
    { value: 'Other', label: 'Other' },
  ];

 
  const [workshopForm, setWorkshopForm] = useState({
    firstname: '',
    lastname: '',
    school: '',
    year: '',
    student_id: '',
    profile_link: '',
    email: '',
    discord_id: ''
  });

 
  const [ctfForm, setCtfForm] = useState({
    team_name: '',

    //1
    firstname1: '', lastname1: '', school1: '', year1: '', student_id1: '', 
    skills1: '', profile_link1: '', email1: '', discord_id1: '',

    // 2
    firstname2: '', lastname2: '', school2: '', year2: '', student_id2: '', 
    skills2: '', profile_link2: '', email2: '', discord_id2: '',

    // 3
    firstname3: '', lastname3: '', school3: '', year3: '', student_id3: '', 
    skills3: '', profile_link3: '', email3: '', discord_id3: '',

    // 4
    firstname4: '', lastname4: '', school4: '', year4: '', student_id4: '', 
    skills4: '', profile_link4: '', email4: '', discord_id4: '',

    // 5
    firstname5: '', lastname5: '', school5: '', year5: '', student_id5: '', 
    skills5: '', profile_link5: '', email5: '', discord_id5: '',
  });


  // to get the pass type (workshop / ctf)
  const handlePassSelect = (passType) => {
    setSelectedPass(passType);
    setSubmitMessage({ type: '', text: '' });
  };

  // get the inputs to fill the workshop form
  const handleWorkshopChange = (e) => {
    const { name, value } = e.target;
    setWorkshopForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // to fill the ctf form
  const handleCtfChange = (e) => {
    const { name, value } = e.target;
    setCtfForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // check the workshop form 
  const validateWorkshopForm = () => {
    const requiredinfos = ['firstname', 'lastname', 'school', 'year', 'student_id', 'email', 'discord_id'];
    for (const info of requiredinfos) {
      if (!workshopForm[info].trim()) {
        setSubmitMessage({ type: 'error', text: `Please fill in ${info.replace('_', ' ')}` });

        setTimeout(() => {
             setSubmitMessage({ type: '', text: '' });
        }, 5000);

        return false;
      }
    }
    
    if (!workshopForm.email.includes('@')) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address' });

      setTimeout(() => {
         setSubmitMessage({ type: '', text: '' });
      }, 5000);

      return false;
    }
    
    return true;
  };


//check ctf form
  const validateCtfForm = () => {
    // for loop for all the 5 members
    for (let i = 1; i <= 5; i++) {
      const requiredinfos = [`firstname${i}`, `lastname${i}`, `school${i}`, `year${i}`, `student_id${i}`, `skills${i}`, `email${i}`, `discord_id${i}`];
      for (const info of requiredinfos) {
        if (!ctfForm[info]?.trim()) {
          setSubmitMessage({ type: 'error', text: `Please fill in ${info.replace(/\d/, '').replace('_', ' ')} for member ${i}` });

          setTimeout(() => {
              setSubmitMessage({ type: '', text: '' });
          }, 5000);

          return false;
        }
      }
      
      if (!ctfForm[`email${i}`]?.includes('@')) {
        setSubmitMessage({ type: 'error', text: `Please enter a valid email for member ${i}` });

        setTimeout(() => {
              setSubmitMessage({ type: '', text: '' });
        }, 5000);

        return false;
      }
    }

    // Check ctf team name
    if (!ctfForm.team_name.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter a team name' });

      setTimeout(() => {
            setSubmitMessage({ type: '', text: '' });
      }, 5000);

      return false;
    }

    // Check for duplicate emails, student IDs, and discord IDs
    const emails = [];
    const studentIds = [];
    const discordIds = [];
    
    for (let i = 1; i <= 5; i++) {
      const email = ctfForm[`email${i}`]?.toLowerCase();
      const studentId = ctfForm[`student_id${i}`]?.toUpperCase();
      const discordId = ctfForm[`discord_id${i}`];
      
      if (email && emails.includes(email)) {
        setSubmitMessage({ type: 'error', text: `Duplicate email found: ${email}` });

        setTimeout(() => {
            setSubmitMessage({ type: '', text: '' });
        }, 5000);
        return false;
      }
      emails.push(email);
      
      if (studentId && studentIds.includes(studentId)) {
        setSubmitMessage({ type: 'error', text: `Duplicate Student ID found: ${studentId}` });

        setTimeout(() => {
              setSubmitMessage({ type: '', text: '' });
        }, 5000);

        return false;
      }
      studentIds.push(studentId);
      
      if (discordId && discordIds.includes(discordId)) {
        setSubmitMessage({ type: 'error', text: `Duplicate Discord ID found: ${discordId}` });

        setTimeout(() => {
              setSubmitMessage({ type: '', text: '' });
        }, 5000);

        return false;
      }
      discordIds.push(discordId);
    }
    
    return true;
  };

  const handleWorkshopSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateWorkshopForm()) return;
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      
      const formData = {
        ...workshopForm,
        student_id: workshopForm.student_id.toUpperCase(),
        email: workshopForm.email.toLowerCase(),
        discord_id: workshopForm.discord_id,
        profile_link: workshopForm.profile_link.trim() || null,
        year: parseInt(workshopForm.year)
      };
      
      const response = await axios.post('https://ciconix-backend.onrender.com/api/registration/basic-pass/', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSubmitMessage({ 
        type: 'success', 
        text: 'Workshop Pass registration successful! You will receive a confirmation email shortly.' 
      });

      setTimeout(() => {
              setSubmitMessage({ type: '', text: '' });
       }, 5000);
      
      // Reset form
      setWorkshopForm({
        firstname: '',
        lastname: '',
        school: '',
        year: '',
        student_id: '',
        profile_link: '',
        email: '',
        discord_id: ''
      });
      
    } catch (error) {
  console.error('Registration error:', error);
  
  let errorText = 'Registration failed. Please try again.';
  
  if (error.response) {
    console.log('Error response:', error.response.data);
    
    const errors = error.response.data;
    
    if (typeof errors === 'string') {
      errorText = errors;
    } else if (typeof errors === 'object') {
      const errorEntries = Object.entries(errors);
      
      if (errorEntries.length > 0) {
        const [field, messages] = errorEntries[0];
        
        if (Array.isArray(messages)) {
          errorText = messages[0];
        } else if (typeof messages === 'object') {
          const nestedMessages = Object.values(messages);
          errorText = Array.isArray(nestedMessages[0]) 
            ? nestedMessages[0][0] 
            : String(nestedMessages[0]);
        } else {
          errorText = String(messages);
        }
      }
    }
  } else if (error.request) {
    errorText = 'No response from server. Is the backend running?';
  } else {
    errorText = `Error: ${error.message}`;
  }
  
  setSubmitMessage({ type: 'error', text: errorText });
  
  setTimeout(() => {
    setSubmitMessage({ type: '', text: '' });
  }, 5000);
} finally {
      setIsSubmitting(false);
    }
  };

 const handleCtfSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateCtfForm()) return;
  
  setIsSubmitting(true);
  setSubmitMessage({ type: '', text: '' });
  
  try {
    const formData = { 
      team_name: ctfForm.team_name 
    };
    
    // Add all 5 members
    for (let i = 1; i <= 5; i++) {
      formData[`firstname${i}`] = ctfForm[`firstname${i}`].trim();
      formData[`lastname${i}`] = ctfForm[`lastname${i}`].trim();
      formData[`school${i}`] = ctfForm[`school${i}`];
      formData[`year${i}`] = parseInt(ctfForm[`year${i}`]);
      formData[`student_id${i}`] = ctfForm[`student_id${i}`].toUpperCase().trim();
      formData[`skills${i}`] = ctfForm[`skills${i}`];
      formData[`profile_link${i}`] = ctfForm[`profile_link${i}`]?.trim() || null;
      formData[`email${i}`] = ctfForm[`email${i}`].toLowerCase().trim();
      formData[`discord_id${i}`] = ctfForm[`discord_id${i}`].trim();
    }
    
    console.log('Sending to Django:', JSON.stringify(formData, null, 2));
    
    const response = await axios.post(
      'https://ciconix-backend.onrender.com/api/registration/special-pass/', 
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    setSubmitMessage({ 
      type: 'success', 
      text: 'CTF Team registration successful! All members will receive confirmation emails.' 
    });

    setTimeout(() => {
      setSubmitMessage({ type: '', text: '' });
    }, 5000);
    
    // Reset form
    setCtfForm({
      team_name: '',
      
      firstname1: '', lastname1: '', school1: '', year1: '', student_id1: '', 
      skills1: '', profile_link1: '', email1: '', discord_id1: '',
      
      firstname2: '', lastname2: '', school2: '', year2: '', student_id2: '', 
      skills2: '', profile_link2: '', email2: '', discord_id2: '',
      
      firstname3: '', lastname3: '', school3: '', year3: '', student_id3: '', 
      skills3: '', profile_link3: '', email3: '', discord_id3: '',
      
      firstname4: '', lastname4: '', school4: '', year4: '', student_id4: '', 
      skills4: '', profile_link4: '', email4: '', discord_id4: '',
      
      firstname5: '', lastname5: '', school5: '', year5: '', student_id5: '', 
      skills5: '', profile_link5: '', email5: '', discord_id5: '',
    });
    
   } catch (error) {
  console.error('CTF Registration error:', error);
  
  let errorText = 'Team registration failed. Please try again.';
  
  if (error.response) {
    console.log('CTF Error response:', error.response.data);
    
    const errors = error.response.data;
    
    if (typeof errors === 'string') {
      errorText = errors;
    } else if (typeof errors === 'object') {
      
      const errorEntries = Object.entries(errors);
      
      if (errorEntries.length > 0) {
        const [field, messages] = errorEntries[0];
        const fieldName = field.replace(/_/g, ' ').replace(/\d+$/, '');
        
        if (Array.isArray(messages)) {
          errorText = `${fieldName}: ${messages[0]}`;
        } else if (typeof messages === 'string') {
          errorText = `${fieldName}: ${messages}`;
        } else {
          errorText = `Error in ${fieldName}`;
        }
      }
    }
  }
  
  setSubmitMessage({ type: 'error', text: errorText });
  
  setTimeout(() => {
    setSubmitMessage({ type: '', text: '' });
  }, 5000);
} finally {
    setIsSubmitting(false);
  }
};

  return (
    <section id='register'>
      <div className='register-container'>
       
        <div className='register-header'>
          <h2 className='register-title'>Registration</h2>
          <p className='register-subtitle'>Choose your pass and complete the registration</p>
        </div>

        <div className='pass-selection'>
          <button 
            className={`pass-select-btn ${selectedPass === 'workshop' ? 'active' : ''}`}
            onClick={() => handlePassSelect('workshop')}
            disabled={isSubmitting}
          >
            <span className='pass-select-title'>Workshop Pass</span>
            <span className='pass-select-desc'>Access to cybersecurity workshops only</span>
          </button>
          
          <button 
            className={`pass-select-btn ${selectedPass === 'ctf' ? 'active' : ''}`}
            onClick={() => handlePassSelect('ctf')}
            disabled={isSubmitting}
          >
            <span className='pass-select-title'>Project & CTF Pass</span>
            <span className='pass-select-desc'>Full hackathon with CTF competition (5-member teams)</span>
          </button>
        </div>

        {submitMessage.text && (
          <div className={`form-message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}

        {selectedPass === 'workshop' && (
          <form className='registration-form' onSubmit={handleWorkshopSubmit}>
            <div className='form-section'>
              <h3 className='form-section-title'>Workshop Pass Registration</h3>
              <p className='form-section-desc'>Register for cybersecurity workshops with expert instructors</p>
              
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='firstname'>First Name *</label>
                  <input
                    type='text'
                    id='firstname'
                    name='firstname'
                    value={workshopForm.firstname}
                    onChange={handleWorkshopChange}
                    required
                    placeholder='Your first name'
                    disabled={isSubmitting}
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='lastname'>Last Name *</label>
                  <input
                    type='text'
                    id='lastname'
                    name='lastname'
                    value={workshopForm.lastname}
                    onChange={handleWorkshopChange}
                    required
                    placeholder='Your last name'
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='school'>School *</label>
                  <select
                    id='school'
                    name='school'
                    value={workshopForm.school}
                    onChange={handleWorkshopChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value=''>Select your school</option>
                    {schoolOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label htmlFor='year'>Academic Year *</label>
                  <select
                    id='year'
                    name='year'
                    value={workshopForm.year}
                    onChange={handleWorkshopChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value=''>Select your year</option>
                    {yearOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='student_id'>Student ID *</label>
                  <input
                    type='text'
                    pattern='[0-9]{8,12}'
                    id='student_id'
                    name='student_id'
                    value={workshopForm.student_id}
                    onChange={handleWorkshopChange}
                    required
                    placeholder='e.g., 20240001'
                    disabled={isSubmitting}
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='email'>Email Address *</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={workshopForm.email}
                    onChange={handleWorkshopChange}
                    required
                    placeholder='you@example.com'
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='discord_id'>Discord ID *</label>
                  <input
                    type='text'
                    id='discord_id'
                    name='discord_id'
                    value={workshopForm.discord_id}
                    onChange={handleWorkshopChange}
                    required
                    placeholder='username#1234'
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className='form-actions'>
              <button 
                type='submit' 
                className='submit-btn'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register for Workshop Pass'}
              </button>
              
              <button 
                type='button' 
                className='back-btn'
                onClick={() => setSelectedPass(null)}
                disabled={isSubmitting}
              >
                ← Back to Pass Selection
              </button>
            </div>
          </form>
        )}

        {selectedPass === 'ctf' && (
          <form className='registration-form' onSubmit={handleCtfSubmit}>
            
            <div className='form-section'>
              <h3 className='form-section-title'>Team Registration (5 Members)</h3>
              <p className='form-section-desc'>Register your team for the hackathon and CTF competition</p>
              
              <div className='info-box'>
                <h4>Team Requirements:</h4>
                <ul>
                  <li><strong>Exactly 5 team members</strong> required for competition</li>
                  <li>Each member must provide unique information</li>
                  <li>Team leader (Member 1) will be the primary contact</li>
                </ul>
              </div>
              
              <div className='form-group'>
                <label htmlFor='team_name'>Team Name *</label>
                <input
                  type='text'
                  id='team_name'
                  name='team_name'
                  value={ctfForm.team_name}
                  onChange={handleCtfChange}
                  required
                  placeholder='e.g., Cyber Warriors, Hack Titans'
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {[1, 2, 3, 4, 5].map(memberNum => (
              <div key={memberNum} className='form-section member-section'>
                <h4 className='member-title'>
                  {memberNum === 1 ? 'Team Leader' : `Team Member ${memberNum}`}
                  <span className='required-badge'>Required</span>
                </h4>
                
                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor={`firstname${memberNum}`}>First Name *</label>
                    <input
                      type='text'
                      id={`firstname${memberNum}`}
                      name={`firstname${memberNum}`}
                      value={ctfForm[`firstname${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      placeholder='First name'
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`lastname${memberNum}`}>Last Name *</label>
                    <input
                      type='text'
                      id={`lastname${memberNum}`}
                      name={`lastname${memberNum}`}
                      value={ctfForm[`lastname${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      placeholder='Last name'
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor={`school${memberNum}`}>School *</label>
                    <select
                      id={`school${memberNum}`}
                      name={`school${memberNum}`}
                      value={ctfForm[`school${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value=''>Select your school</option>
                      {schoolOptions.map(option => (
                        <option key={`${option.value}-${memberNum}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`year${memberNum}`}>Academic Year *</label>
                    <select
                      id={`year${memberNum}`}
                      name={`year${memberNum}`}
                      value={ctfForm[`year${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value=''>Select your academic year</option>
                      {yearOptions.map(option => (
                        <option key={`${option.value}-${memberNum}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor={`student_id${memberNum}`}>Student ID *</label>
                    <input
                      type='text'
                      pattern='[0-9]{8,12}'
                      id={`student_id${memberNum}`}
                      name={`student_id${memberNum}`}
                      value={ctfForm[`student_id${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      placeholder='Student ID'
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`skills${memberNum}`}>Primary Skill *</label>
                    <select
                      id={`skills${memberNum}`}
                      name={`skills${memberNum}`}
                      value={ctfForm[`skills${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value=''>Select your primary skill</option>
                      {skillsOptions.map(option => (
                        <option key={`${option.value}-${memberNum}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor={`email${memberNum}`}>Email Address *</label>
                    <input
                      type='email'
                      id={`email${memberNum}`}
                      name={`email${memberNum}`}
                      value={ctfForm[`email${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      placeholder={`member${memberNum}@example.com`}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`discord_id${memberNum}`}>Discord ID *</label>
                    <input
                      type='text'
                      id={`discord_id${memberNum}`}
                      name={`discord_id${memberNum}`}
                      value={ctfForm[`discord_id${memberNum}`]}
                      onChange={handleCtfChange}
                      required
                      placeholder='username#1234'
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor={`profile_link${memberNum}`}>Profile Link (Optional)</label>
                  <input
                    type='url'
                    id={`profile_link${memberNum}`}
                    name={`profile_link${memberNum}`}
                    value={ctfForm[`profile_link${memberNum}`]}
                    onChange={handleCtfChange}
                    placeholder='GitHub, TryHackMe, CTFTime, etc.'
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ))}

            <div className='form-actions'>
              <button 
                type='submit' 
                className='submit-btn'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering Team...' : 'Register Team (5 Members)'}
              </button>
              
              <button 
                type='button' 
                className='back-btn'
                onClick={() => setSelectedPass(null)}
                disabled={isSubmitting}
              >
                ← Back to Pass Selection
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default RegForm