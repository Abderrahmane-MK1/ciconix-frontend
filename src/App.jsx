import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './assets/Login_page/Login';
import Navbar from './assets/Components/Navbar';
import Dashboard from './assets/Dashboard/Dashboard';
import ProjectSubmit from './assets/ProjectSubmit.jsx/Project';
import Footer from './assets/Register_page/Components/Footer';
import TokenSubmit from './assets/Token_Submit/TokenSubmit'
import Ctf_Platform from './assets/Ctf-Platform/Ctf_Platform';
import Leaderboard from './assets/Leaderboard/leaderboard';
import { checkAuth, isTokenValid } from './Utils/auth';

//ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth(); //deja trdk lel logi
  return isAuthenticated ? children : null; //if true display childern snn null
};

// Public Route
const PublicRoute = ({ children }) => {
  if (isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/ctf-platform" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Ctf_Platform />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/submit-token" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <TokenSubmit />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/submit-project" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ProjectSubmit />
                <Footer />
              </>
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Leaderboard />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>


    //just for testing links
  //   <Router>
  //   <div className="app-container">
  //     <Routes>
        
  //       <Route path="/login" element={<Login />} />
        
       
  //       <Route path="/dashboard" element={
  //         <>
  //           <Navbar />
  //           <Dashboard />
  //           <Footer />
  //         </>
  //       } />
        
  //       {/* CTF Platform Route */}
  //       <Route path="/ctf-platform" element={
  //         <>
  //           <Navbar />
  //           <Ctf_Platform />
  //           <Footer />
  //         </>
  //       } />
        
  //       {/* Token Submit Route */}
  //       <Route path="/submit-token" element={
  //         <>
  //           <Navbar />
  //           <TokenSubmit />
  //           <Footer />
  //         </>
  //       } />
  //        {/* Project Submit Route */}
  //       <Route path="/submit-project" element={
  //         <>
  //           <Navbar />
  //           <ProjectSubmit />
  //           <Footer />
  //         </>
  //       }/>
        
  //       {/* Default redirect to dashboard */}
  //       <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
  //       {/* Catch-all route */}
  //       <Route path="*" element={<Navigate to="/dashboard" replace />} />
  //     </Routes>
  //   </div>
  // </Router>
  );
}

export default App;