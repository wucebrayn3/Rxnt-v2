import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Threads from './components/Threads';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Discover from './components/Discover';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/thread" element={<Threads />} />

          <Route path="/me" element={<Profile />} />
          <Route path='/user/:id' element={<UserProfile />}/>

          <Route path="/discover" element={<Discover />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
