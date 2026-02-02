import React from 'react'
import Hero_sec from './Components/Hero_sec'
import About_sec from './Components/about_sec'
import Details from './Components/Details'
import Reg_form from './Components/reg_form'


const Register = () => {
  return (
    <div className="register-wrapper">
        <Hero_sec/>
        <About_sec/>
        <Details/>
        <Reg_form/>
    </div>
  )
}

export default Register