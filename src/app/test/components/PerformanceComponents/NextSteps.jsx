"use client";

import React from 'react';
// Update the path according to your app structure
import nextStepsData from "@/data/PerformanceData/nextStepsData";

const NextSteps = () => {
  return (
    <div className='bg-white shadow-md rounded-lg p-6 mt-6'>
      <h2 className='font-semibold text-lg mb-4'>Next Steps</h2>

      <div className='space-y-2'>
        {nextStepsData.map((step, index) => (
          <div
            key={index}
            className='bg-gray-100 text-sm text-gray-700 rounded-md px-4 py-2'
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextSteps;
