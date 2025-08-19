"use client";

import React from 'react';
import TopicItem from './TopicItem';
import topicBreakdownData from '@/data/PerformanceData/topicBreakdownData';
import graphIcon from '@/assets/performanceScreen/graph-icon.svg';

const TopicBreakdown = () => {
  return (
    <div className='bg-white shadow-md p-6 rounded-lg'>
      {/* Title with icon */}
      <h2 className='font-semibold text-lg mb-4 flex items-center gap-2'>
        <img src={graphIcon.src} alt='Graph Icon' className='w-5 h-5' />
        Topic Breakdown
      </h2>

      {/* Render each topic breakdown item */}
      {topicBreakdownData.map((item, index) => (
        <TopicItem
          key={index}
          topic={item.topic}
          correct={item.correct}
          total={item.total}
          percentage={item.percentage}
        />
      ))}
    </div>
  );
};

export default TopicBreakdown;
