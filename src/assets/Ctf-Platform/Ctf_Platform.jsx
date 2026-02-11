import React from 'react'
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineShield } from "react-icons/md";
import { RiAwardLine } from "react-icons/ri";
import './Ctf_Platform.css'

const Ctf_Platform = () => {
  return (
    <div className='CTF-platfrom-page'>
        <div className='header'>
          <h2>CTF Competition Platform</h2>
          <p>Test your cybersecurity skills in our Capture The Flag competition</p>
        </div>

        <div className='Details-section'>
          <article className='detail'>
            <MdOutlineShield className='detail-icon' size={70}/>
            <h3>What is CTF</h3>
            <p>Capture The Flag is a cybersecurity competition where you solve security
               challenges across domains like web security, cryptography, forensics, and
                more to earn points.
            </p>
          </article>
          <article className='detail'>
            <RiAwardLine className='detail-icon' size={70}/>
            <h3>Competition Details</h3>
            <p>The CTF platform is hosted externally. Teams compete to solve as many 
              challenges as possible during the event period to climb the leaderboard
               and win prizes.
            </p>
          </article>

          <div className='instructions-section'>
            <h3>How to Access the CTF Platform</h3>

            <div className='instructions-grid'>

              <div className='instruction'>
                <div className='instruction-number'>1</div>
                <div className='instruction-content'>
                  <h4>Click the access button below</h4>
                  <p>This will open the external CTF platform in a new tab</p>
                </div>
              </div>

              <div className='instruction'>
                <div className='instruction-number'>2</div>
                <div className='instruction-content'>
                  <h4>Register or login with your team credentials</h4>
                  <div className='credentials-grid'>

                    <div className='credential'>
                      <FaUserGroup className='icon' size={20}/>
                      <div className='content'>
                        <h6>Team Name</h6>
                        <p>Use your registered team name</p>
                      </div>
                    </div>

                    <div className='credential'>
                      <MdOutlineMailOutline className='icon' size={20} />
                      <div className='content'>
                        <h6>Team Leader Email</h6>
                        <p>Email address of your team leader</p>
                      </div>
                    </div>

                    <div className='credential'>
                      <MdLockOutline className='icon' size={20}/>
                      <div className='content'>
                        <h6>Team Password</h6>
                        <p>Password provided during registration</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className='instruction'>
                <div className='instruction-number'>3</div>
                <div className='instruction-content'>
                  <h4>Start solving challenges!</h4>
                  <p>Browse available challenges, submit flags, 
                    and track your team's progress on the leaderboard
                  </p>
                </div>
              </div>
            </div>

            <div className='CTF-platform'>
              {/* add ctf link  */}
              <a href="ctf platform link" className='CTF-link'>
                <button type='submit' className='CTF-btn'>Go to CTF Platform</button>
              </a>
              <p>Opens in a new tab • Make sure to save your login credentials</p>
            </div>
          </div>
        </div>

    </div>
  )
}

export default Ctf_Platform