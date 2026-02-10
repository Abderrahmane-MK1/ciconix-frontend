import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PiRankingBold } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { FaFontAwesomeFlag, FaTrophy, FaEnvelope, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { checkAuth, getValidToken } from '../../Utils/auth';

const Dashboard = () => {

  const [teamData, setTeamData] = useState({
    team_name: 'Your team',
    email: '',
    ctfd_team_id: '',
    created_at: '',
    ctfd_score: 0,
    project_score: 0,
    total_score: 0
  }) 

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const currentDay = 1

  const schedule = {
    1: [
        {time: '02:00 pm', text: 'Check-in and Registrations'},
        {time: '03:00 pm', text: 'Opening Ceremony'},
        {time: '05:00 pm', text: 'Challenge & project announcement'},
        {time: '05:00 pm - Next day', text: 'Continuous Development & coding'}
    ],
    2: [
        {time: '12:00 am - 05:00 pm', text: 'Development Continuous'},
        {time: '05:00 pm', text: 'Development Ends'},
        {time: '05:00 pm - 08:00 pm', text: 'Challenge & project announcement'},
        {time: '08:00 pm - 10:00 pm', text: 'Networking and Fun Activities'},
        {time: '10:00 pm', text: 'CTF Competition Begins (18 hours)'},
        {time: '10:00 pm - Next Day ', text: 'CTF Competition continuous'}
    ],
    3: [
        {time: '12:00 am - 04:00 pm', text: 'CTF competition continuous'},
        {time: '04:00 pm', text: 'CTF competition Ends'},
        {time: '04:30 pm - 08:00 pm', text: 'Closing Ceremony'},
    ],
  }
  
  const pagerCards = [
    {
        id: 1,
        title: 'CTF Platform',
        description: 'Access Challenge',
        icon: <FiShield />
    },
    {
        id: 2,
        title: 'Submit Flags',
        description: 'Submit your CTF Flag',
        icon: <FaFontAwesomeFlag />
    },
    {
        id: 3,
        title: 'Submit Project',
        description: 'Upload your final project',
        icon: <GoPeople />
    },
    {
        id: 4,
        title: 'Leaderboard',
        description: 'View live rankings',
        icon: <PiRankingBold />
    }
  ]

  // get team profile infos
  const fetchTeamProfile = async () => {

    try {
      setLoading(true)

      const accessToken = await getValidToken(); 
      const res = await axios.get('/api/profile/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      console.log('profile response: ', res.data)
      
      if (res.data.success) {
        setTeamData({
          team_name: res.data.data.team_name || 'Your team',
          email: res.data.data.email || '',
          ctfd_team_id: res.data.data.ctfd_team_id || '',
          created_at: res.data.data.created_at || '',
          ctfd_score: res.data.data.ctfd_score || 0,
          project_score: res.data.data.project_score || 0,
          total_score: res.data.data.total_score || 0
        })
      }
    } catch (error) {
      console.error('Error fetching team profile:', error)
      console.log('error status', error.response.status)
      const savedTeamName = localStorage.getItem('team_name')

      // adding just team name
      if (savedTeamName) {
        setTeamData(prev => ({ ...prev, team_name: savedTeamName }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth(); //n7iha m3a tali
    fetchTeamProfile()
  }, [])

  const goToPage = (card) => {
    if(card.title === 'CTF Platform') {
      navigate('/ctf-platform')
    } 
    else if(card.title === 'Submit Flags') { 
      navigate('/submit-token') 
    }
    else if(card.title === 'Submit Project') {
      navigate('/submit-project') 
    }
    else if(card.title === 'Leaderboard') { 
      navigate('/leaderboard') 
    } 
  }

  // function to make the time readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available'
    try {

      // turn the stored date into a readable date
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const currentSchedule = schedule[currentDay] || schedule[1]

  if (loading) {
    return (
      <div className='dashboard-container loading'>
        <div className="loading-spinner"></div>
        <p>Loading team profile...</p>
      </div>
    )
  }

  return (
    <div className='dashboard-container'>
        <section className='dashboard-header-section'>
            <h2>Welcome, {teamData.team_name}!</h2>
            <p className="team-subtitle">Track your progress and performance</p>
        </section>

        <section className='pages-section'>
            <div className='pages-grid'>
                {pagerCards.map((card) => (
                    <article key={card.id} className='page-card' onClick={() => goToPage(card)}>
                        <div className='card-icon'>{card.icon}</div>
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                    </article>
                ))}
            </div>
        </section>

        <div className='content-grid'>        
            <section className='team-profile-section'>
                <div className="profile-header">
                  <h3>
                    <FaIdBadge className="profile-icon" />
                    Team Profile
                  </h3>
                  <span className="team-id">ID: {teamData.ctfd_team_id || 'Not assigned'}</span>
                </div>
                
                <div className="profile-details">
                  <div className="profile-item">
                    <FaEnvelope size={20}  className="item-icon" />
                    <div>
                      <span className="item-label">Email</span>
                      <span className="item-value">{teamData.email || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  <div className="profile-item">
                    <FaCalendarAlt  size={20} className="item-icon" />
                    <div>
                      <span className="item-label">Registered Since</span>
                      <span className="item-value">{formatDate(teamData.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="scores-section">
                  <h4>Current Scores</h4>
                  <div className="scores-grid">
                    <div className="score-card ctfd-score">
                      <FaTrophy size={30} className="score-icon" />
                      <div className="score-content">
                        <span className="score-label">CTF Score</span>
                        <span className="score-value">{teamData.ctfd_score} pts</span>
                      </div>
                    </div>
                    
                    <div className="score-card project-score">
                      <GoPeople size={30} className="score-icon" />
                      <div className="score-content">
                        <span className="score-label">Project Score</span>
                        <span className="score-value">{teamData.project_score} pts</span>
                      </div>
                    </div>
                    
                    <div className="score-card total-score">
                      <PiRankingBold size={30} className="score-icon" />
                      <div className="score-content">
                        <span className="score-label">Total Score</span>
                        <span className="score-value">{teamData.total_score} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
            </section>

            <section className='schedule-section'>
                <h3>Today's Schedule - Day {currentDay}</h3>
                <div className='schedule-list'>
                    {currentSchedule.map((item, index) => (
                        <div key={index} className='schedule-item'>
                            <div className='schedule-time'>{item.time}</div>
                            <div className='schedule-details'>
                                <h4>{item.text}</h4>
                            </div>
                        </div>   
                    ))}
                </div>
            </section>
        </div>
    </div>
  )
}

export default Dashboard