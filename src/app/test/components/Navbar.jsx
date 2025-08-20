// components/Navbar.jsx
'use client';

import React from 'react';
import Timer from './TestComponents/timer';
import ThemeSlider from './TestComponents/ThemeToggle';

const Navbar = ({darkThemeOn, setDarkThemeOn}) => {
  const submitHandler = () => {
    console.log('Submit clicked!');
  };

  return (
    // Add these classes -> fixed top-0 left-0 w-full z-50
    <div className={`fixed top-0 left-0 w-full z-50 flex ${darkThemeOn ? "bg-gray-900" : "bg-blue-100"}  py-2 px-6 justify-between text-black dark:text-white shadow-md`}>
      {/* Left Section */}
      <div className="flex gap-4 items-center">
        {/* The button for your sidebar toggle would go here */}
        <h1 className={`${darkThemeOn ? "text-white" : "text-black"} p-0 text-3xl font-semibold`}>Coding Platform</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <ThemeSlider darkThemeOn={darkThemeOn} setDarkThemeOn={setDarkThemeOn} />
        <Timer />
        <button
          className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={submitHandler}
        >
          Finish Test
        </button>
      </div>
    </div>
  );
};

export default Navbar;