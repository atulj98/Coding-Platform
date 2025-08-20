'use client';

import { useState } from 'react';

const ThemeSlider = ({darkThemeOn, setDarkThemeOn}) => {

  const handleToggle = () => {
    setDarkThemeOn(!darkThemeOn);
  };

  return (
    <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
      {/* The hidden checkbox that holds the state */}
      <input
        type="checkbox"
        id="theme-toggle"
        className="sr-only peer"
        checked={darkThemeOn}
        onChange={handleToggle} // Toggles the local state
      />
      
      {/* The track of the slider */}
      <div className={`w-14 h-8 ${darkThemeOn ? "bg-gray-700" : "bg-gray-200"}  border-1 border-blue-950 rounded-full `}></div>

      {/* The sliding thumb */}
      <div className="absolute top-1 left-1 bg-white border-gray-300 border rounded-full h-6 w-6 transition-all duration-300 ease-in-out peer-checked:translate-x-full peer-checked:bg-gray-900 flex items-center justify-center">
        {/* Sun Icon */}
        <svg
          className={`w-4 h-4 text-yellow-500 transition-opacity duration-300 ${
            darkThemeOn ? 'opacity-0' : 'opacity-100' // Controlled by local state
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`w-4 h-4 text-blue-400 absolute transition-opacity duration-300 ${
            darkThemeOn ? 'opacity-100' : 'opacity-0' // Controlled by local state
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </label>
  );
};

export default ThemeSlider;
