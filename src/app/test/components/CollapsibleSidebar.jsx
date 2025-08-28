// components/CollapsibleSidebar.jsx
'use client';

import Sidebar from './TestComponents/Sidebar'; // Adjust path if needed

import sideDarkOpen from '../../../../public/other_assets/assets/CodeEditor/sidebarDarkOpen.png'
import sideLightOpen from '../../../../public/other_assets/assets/CodeEditor/sidebarLightOpen.png'
import sideDarkClose from '../../../../public/other_assets/assets/CodeEditor/sidebarDarkClose.png'
import sideLightClose from '../../../../public/other_assets/assets/CodeEditor/sidebarLightClose.png'
import Image from 'next/image';


const CollapsibleSidebar = ({
  problems,
  currProb,
  changeQuesHandler,
  isExpanded,
  toggleSidebar, // A function to toggle the state in the parent
  darkThemeOn,
}) => {
  const handleProbChange = (probNo) => {
    changeQuesHandler(probNo);
  };

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] ${darkThemeOn ? "bg-gray-800" : "bg-[#f3f4f6]"} z-40 shadow-md transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-16'}`}
    >
      <div className="flex flex-col h-full">
        {/* The button now calls the function from props */}
        <button
          onClick={toggleSidebar}
          className={`p-4 text-left ${darkThemeOn ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-[#f3f4f6]"}`}
        >
          <Image
            src={
              isExpanded 
                ? (darkThemeOn ? sideLightClose : sideDarkClose) 
                : (darkThemeOn ? sideLightOpen : sideDarkOpen)
            }
            alt="Toggle Sidebar"
            width={24} 
            height={24} 
          />
        </button>

        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          {isExpanded ? (
            <Sidebar
              problems={problems}
              currProb={currProb}
              changeQuesHandler={handleProbChange}
              // This prop isn't strictly needed anymore but can be kept
              setIsExpanded={() => toggleSidebar()}
              darkThemeOn={darkThemeOn} 
            />
          ) : (
            <div className="flex flex-col items-center space-y-2 pt-2">
              {problems.map((prob) => (
                <button
                    key={prob.problem_no}
                    onClick={() => handleProbChange(prob.problem_no - 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-md font-bold 
                        ${prob.problem_no === currProb
                        ? 'bg-blue-600 text-white' // Style for the active button
                        : darkThemeOn
                            ? 'bg-gray-700 text-gray-200' // Style for inactive buttons in dark mode
                            : 'bg-gray-200 text-gray-800'  // Style for inactive buttons in light mode
                        }`}
                    >
                    {prob.problem_no}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSidebar;