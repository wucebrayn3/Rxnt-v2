import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Threads from './components/Threads';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/thread" element={<Threads />} />

          <Route path="/me" element={<Profile />} />
          <Route path='/user/:id' element={<UserProfile />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
