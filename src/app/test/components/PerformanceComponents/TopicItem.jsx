import React from 'react';

const TopicItem = ({ topic, correct, total, percentage }) => {
  // Dynamically set percentage text and bar color
  const getColorClass = () => {
    if (percentage === 100) return 'text-green-500 bg-green-500';
    if (percentage >= 75) return 'text-yellow-500 bg-yellow-500';
    if (percentage >= 35) return 'text-orange-500 bg-orange-500';
    return 'text-red-500 bg-red-500';
  };

  const [textColor, barColor] = getColorClass().split(' ');

  return (
    <div className='bg-gray-100 flex justify-between items-start px-6 py-3 mb-3 rounded-md'>
      {/* Left: Topic name and score */}
      <div>
        <p className='font-semibold text-sm text-gray-800'>{topic}</p>
        <p className='text-xs text-gray-500'>
          {correct}/{total} correct
        </p>
      </div>

      {/* Right: Percentage and progress bar */}
      <div className='flex flex-col items-end gap-1'>
        <p className={`text-sm font-semibold ${textColor}`}>{percentage}%</p>

        <div className='w-24 bg-gray-200 rounded-full h-1'>
          <div
            className={`h-1 rounded-full ${barColor} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopicItem;
