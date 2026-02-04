import React from 'react'
import Hero_sec from './Components/Hero_sec'
import About_sec from './Components/about_sec'
import Details from './Components/Details'
import Reg_form from './Components/RegForm'
import Footer from './Components/Footer'


const Register = () => {
  return (
    <div className="register-wrapper" >
        <Hero_sec/>
        <About_sec/>
        <Details/>
        <Reg_form/>
        <Footer/>
    </div>
  )
}

export default Register