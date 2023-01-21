import './App.css';

import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/header'
import Upload from './components/upload'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Contact = () => (
  <div>
    <h2>Contact</h2>
  </div>
);

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/upload' element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
