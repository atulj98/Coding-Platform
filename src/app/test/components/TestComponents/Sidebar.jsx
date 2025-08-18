"use client";

import React from 'react';

const Sidebar = ({ problems, currProb, changeQuesHandler, setShowSidebar }) => {
    const probChangeHandler = (probNo) => {
        changeQuesHandler(probNo);
        setShowSidebar(false);
    };

    return (
        <div className='bg-[#dbeafe] text-black rounded-sm z-10 shadow-[10px_15px_40px_rgba(0,0,0,0.25)] max-h-lvh overflow-scroll bg-gradient-to-r from-[#dbeafe] to-[#bfdbff] no-scrollbar'>
            {problems.map((prob) => (
                <div
                    key={prob.problem_no}
                    className={`w-full ml-2 p-2 flex items-center cursor-pointer shadow-[0px_12px_60px_rgba(21,93,252,0.25)] 
                        ${prob.problem_no === currProb ? "bg-[#155dfc] text-white" : ""} 
                        hover:bg-[#155dfc] hover:text-white rounded-sm`}
                    onClick={() => probChangeHandler(prob.problem_no - 1)}
                >
                    {prob.problem_no}. {prob.title}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
