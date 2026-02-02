import React from 'react'
import './About_sec.css'

const About_sec = () => {
  return (
    <section id='about_sec'>
        <div className='about-gradient'></div> 
        <div className='container'>
            <h2 className="section-title">About CICONIX</h2>
            <div className="about-content">
               <p><strong>CICONIX 2026</strong> is a three-day academic hackathon organized by <strong>Cyber Innovation Club</strong>
                   and designed to bridge the gap between theoretical cybersecurity knowledge and real-world
                   application.</p>
               <p>Students will engage in hands-on workshops, security challenges, and capture-the-flag competitions
                   across multiple domains of cybersecurity.</p>
               <p>Through expert mentorship, collaborative problem-solving, and practical implementation, participants
                  will develop critical security skills while contributing to innovative solutions.</p>
            </div>
        </div>
    </section>
  )
}

export default About_sec