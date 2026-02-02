import React from 'react'
import './hero_sec.css'

const Hero_sec = () => {
  const scrollToRegister = () => {
    const registerSection = document.getElementById('register')
    if (registerSection) {
      registerSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <header id='hero_sec'>
      <div id='hero-container'>
        <img src="/images/cic_logo.png" alt="cic_logo" className='cic_logo' />
        <div className='hero-content'>
          <img src="/images/ciconix_logo_piege.png" alt="ciconix_logo_piege" className='hero-logo' />
          <h1 className='hero-title'>A high impact hackathon</h1>
          <p className='hero-subtitle'>Where innovation meets imagination. challenge the impossible.</p>
          <button className='hero-btn' onClick={scrollToRegister}>
            Register Now
          </button>
          
          <p className='date'>Fabruary 12-14, 2026</p>
        </div>
      </div>

    </header>
  )
}

export default Hero_sec