import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PiRankingBold } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { GrAnnounce } from "react-icons/gr";
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../Utils/auth';

const Dashboard = () => {

  const [announcements, setAnnouncements] = useState([])
  const [teamName, setTeamName] = useState('Your team') 
  const navigate = useNavigate();

  const currentDay = 2

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


   const staticAnnouncements = [
    { id: 1, message: 'CTF challenges are now live! Submit your flags before the deadline.', time: '10 minutes ago' },
    { id: 2, message: 'Workshop on Web Security starts in 30 minutes at Hall B.', time: '25 minutes ago' },
    { id: 3, message: 'Congratulations to Team Cypher for reaching 500 points!', time: '1 hour ago' },
    { id: 4, message: 'Day 2 schedule has been updated. Check the schedule tab for details.', time: '2 hours ago' }
   ]

   const getAnnouncements = async () => {
    try {
      const res = await axios.get('/api/getAnnouncement')
    
      setAnnouncements(staticAnnouncements)
    //   if (res.status === 200 && res.data.length > 0) {
    //     setAnnouncements(res.data)
    //   } else {
    //     setAnnouncements(staticAnnouncements)
    //   }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setAnnouncements(staticAnnouncements)
    }
  }

  useEffect(() => {
    // checkAuth(); 
    // const savedTeamName = localStorage.getItem('team_name');
    // if (savedTeamName) {
    //   setTeamName(savedTeamName);
    // }

    getAnnouncements();
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



  const currentSchedule = schedule[currentDay] || schedule[1]
 

  return (
    <div className='dashboard-container'>
        <section className='dashboard-header-section'>
            <h2>Welcome {teamName}</h2>
        </section>

        <section className='pages-section'>
            <div className='pages-grid'>
                {pagerCards.map((card) => (
                    <article key={card.id} className='page-card'  onClick={() => goToPage(card)}>
                        <div className='card-icon'>{card.icon}</div>
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                    </article>
                ))}
            </div>
        </section>

        <div className='content-grid'>        
            <section className='announcements'>
                <h3>Live Announcements</h3>
                <div className='announcements-list'>
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className='announcement-row'>
                            <div className='announcement-title'>
                                <GrAnnounce size={20} className='announcement-icon' />
                                <p className='announcement-message'>{announcement.message}</p>
                            </div>
                            <p className='announcement-time'>{announcement.time}</p>
                        </div>
                    ))}
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