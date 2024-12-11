import './index';
import Home from './interfaces/Home';
import Articles_rec from './interfaces/Articles_rec';
import Articles_readmore from './interfaces/Article_readmore';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
 
  return (
    <Router>
      <Routes>
        {/* Use the `element` prop to specify the component */}
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles_rec />} />
        <Route path="/read_more" element={<Articles_readmore />} />

      </Routes>
    </Router>
  );
}

export default App;
