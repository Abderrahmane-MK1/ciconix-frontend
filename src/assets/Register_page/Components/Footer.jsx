import React from 'react'
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer_content'>
            <img src="images/cic_logo.png" alt="cic_logo" className='footer_logo' />
            <div className='contact_infos'>
                <h3>Contact us</h3>
                <p>Organized by TechVentures Inc.</p>
                <p>cic@nscs.edu.dz</p>
            </div>
            <div className='follow_us'>
                <p>Follow Us</p>
                <div className='cic_links'>
                    <a href="https://www.instagram.com/cyber_innovators_club" target="_blank" rel="noopener noreferrer" aria-label="Visit external website">
                      <FaInstagram size={20} className='icon' />
                    </a> 
                    <a href="https://www.tiktok.com/@cyber_innovators_club" target="_blank" rel="noopener noreferrer" aria-label="Visit external website">
                      <FaTiktok size={20} className='icon' />
                    </a>
                    <a href='https://www.linkedin.com/company/cyber-innovators-club/' target="_blank" rel="noopener noreferrer" aria-label="Visit external webs">
                      <FaLinkedin  className='icon'/>
                    </a>
                </div>
            </div>
        </div>
        <p className='footer_p'>© 2026 Mystic Code Quest. All rights reserved. | Building tomorrow's magic today.</p>
    </div>
  )
}

export default Footer