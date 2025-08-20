"use client";

import React from 'react';

// The component now accepts `setIsExpanded` from its parent
const Sidebar = ({ problems, currProb, changeQuesHandler, setIsExpanded, darkThemeOn }) => {

  const probChangeHandler = (probNo) => {
    changeQuesHandler(probNo);
    // When a problem is clicked, it tells the parent to collapse the sidebar
    setIsExpanded(false);
  };

  return (
    // Removed hardcoded background to inherit theme from the parent container
    <div className={`${darkThemeOn ? "text-white" : "text-black"} z-10 max-h-full overflow-y-auto no-scrollbar`}>
      {problems.map((prob) => (
        <div
          key={prob.problem_no}
          className={`w-full p-3 flex items-center cursor-pointer whitespace-nowrap transition-colors duration-150
            ${prob.problem_no === currProb
                ? 'bg-blue-600 text-white'
                : darkThemeOn
                    ? 'bg-gray-700 text-gray-200' 
                    : 'bg-gray-200 text-gray-800' 
            }`}
          onClick={() => probChangeHandler(prob.problem_no - 1)}
        >
          {prob.problem_no}. {prob.title}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;