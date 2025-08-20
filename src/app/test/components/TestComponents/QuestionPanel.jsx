"use client";

import React from 'react';

const QuestionDescription = ({ question, darkThemeOn }) => {
    const dummyQuestion = question;

    return (
        <div className={`${darkThemeOn ? "text-white" : "text-black"}`}>
            {/* Title + Points */}
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-sans font-semibold mt-2 flex items-center gap-2'>
                        {dummyQuestion.problem_no}. {dummyQuestion.title}
                    </h1>
                </div>
                <div className={`flex items-center gap-1 ${darkThemeOn ? "text-[#cac8c8]" : "text-gray-600"} text-sm font-medium`}>
                    <img src="/other_assets/assets/QueDesc/star.png" alt="points" className='w-4 h-4' />
                    {dummyQuestion.points} pts
                </div>
            </div>

            {/* Tags */}
            <div className={`flex gap-2 flex-wrap mb-10 ${!question.shoTag ? "hidden" : ""}`}>
                {dummyQuestion.tags.map((tag, index) => (
                    <span key={index} className='bg-blue-100 font-serif text-blue-600 px-3 py-1 rounded-full text-sm font-medium'>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Problem Description */}
            <div className='mb-5'>
                <h2 className='text-lg font-semibold mb-2 flex items-center gap-2'>
                    <img src="/other_assets/assets/QueDesc/document.svg" alt="problem description" className='w-5 h-5' />
                    Problem Description
                </h2>
                <p className='text-base font-serif'>{dummyQuestion.description}</p>
            </div>

            {/* Examples */}
            <div>
                <h3 className='text-lg font-bold mb-3 flex items-center gap-2'>
                    <img src="/other_assets/assets/QueDesc/book.svg" alt="examples" className='w-5 h-5' />
                    Examples:
                </h3>

                {dummyQuestion.examples.map((ex, index) => (
                    <div className={`flex mb-2 rounded ${darkThemeOn ? "bg-[#364153]" : "bg-gray-100"} `} key={index}>
                        {/* Input */}
                        <p className='w-1/2 p-2'>
                            <span className={`font-semibold font-serif ${darkThemeOn ? "text-[#ebebeb]" : "text-gray-600"}  text-sm`}>Input:</span> <br />
                            <code className={`font-medium ${darkThemeOn ? "text-white" : "text-black"} text-sm`}>{ex.input}</code>
                        </p>

                        {/* Output */}
                        <p className='w-1/2 p-2'>
                            <span className={`font-semibold font-serif ${darkThemeOn ? "text-[#ebebeb]" : "text-gray-600"} text-sm`}>Output:</span><br />
                            <code className={`font-medium ${darkThemeOn ? "text-white" : "text-black"} text-sm`}>{ex.output}</code>
                        </p>
                    </div>
                ))}
            </div>

            {/* Constraints */}
            <div>
                <h3 className='text-lg font-bold mt-6 mb-2 flex  items-center gap-1'>
                    <img src="/other_assets/assets/QueDesc/bolt.png" alt="constraints" className='w-5 h-5  ' />
                    Constraints:
                </h3>
                <ul>
                    {dummyQuestion.constraints.map((item, index) => (
                        <li key={index} className={`mb-1 text-sm flex items-center darkThemeOn ? "text-[#ebebeb]" : "text-gray-600"}  gap-2`}>
                            <span className='text-gray-500'>{'>'}</span>
                            <code className={`inline-block ${darkThemeOn ? "bg-[#364153]" : "bg-gray-100"} px-2 rounded py-1`}>{item}</code>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuestionDescription;
