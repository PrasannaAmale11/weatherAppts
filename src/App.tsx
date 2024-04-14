// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EveryCity from './components/EveryCity';
import WeatherInfo from './components/WeatherInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EveryCity />} />
        <Route path="/weather/:cityName" element={<WeatherInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
