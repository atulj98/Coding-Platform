'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Timer from './TestComponents/timer';
import Sidebar from './TestComponents/Sidebar';

const Navbar = ({ problems, currProb, changeQuesHandler, setQue_no }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Browser API check to avoid SSR errors
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        console.log('Battery level:', battery.level);
      });
    }
  }, []);

  const sidebarHandler = () => {
    setShowSidebar(!showSidebar);
  };

  const submitHandler = () => {
    console.log('Submit clicked!');
    // Submit handler logic here
  };

  return (
    <div>
      {/* Navbar */}
      <div className="flex bg-[#dbeafe] py-2 px-6 justify-between">
        {/* Left Section - Logo and Sidebar Toggle */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center cursor-pointer">
            <button onClick={sidebarHandler} className="cursor-pointer">
              <Image
                width={32}
                height={32}
                src={
                  showSidebar
                    ? '/other_assets/assets/CodeEditor/cross.svg'
                    : '/other_assets/assets/CodeEditor/hamburger.svg'
                }
                alt="question menu"
              />
            </button>
          </div>

          <div>
            <h1 className="p-0 text-3xl text-black font-semibold">Coding Platform</h1>
          </div>
        </div>

        {/* Right Section - Timer and Finish Button */}
        <div className="flex flex-row-reverse gap-2">
          <button
            className="px-4 cursor-pointer bg-[#155dfc] text-white rounded-sm"
            onClick={submitHandler}
          >
            Finish Test
          </button>
          <Timer />
        </div>
      </div>

      {/* Backdrop */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black opacity-30 z-30"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white z-40 shadow-md transform transition-transform duration-300 ease-in-out 
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          problems={problems}
          currProb={currProb}
          changeQuesHandler={changeQuesHandler}
          setShowSidebar={setShowSidebar}
        />
      </div>
    </div>
  );
};

export default Navbar;
