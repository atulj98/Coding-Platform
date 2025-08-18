'use client'
import { useState } from 'react'
import ScoreSummary from '../components/PerformanceComponents/ScoreSummary'
import scoreSummaryData from '../../data/PerformanceData/scoreSummaryData'
import TopicBreakdown from '../components/PerformanceComponents/TopicBreakdown'
import Performance from '../components/PerformanceComponents/performance'
import performanceData from '../../data/PerformanceData/performanceData'
import NextSteps from '../components/PerformanceComponents/NextSteps'
import Title from '../components/PerformanceComponents/Title'

function PerformanceScreen() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Title />

      {/* Main Components */}
      <main className='w-full mx-auto px-4 py-6 flex flex-col gap-6'>
        <ScoreSummary data={scoreSummaryData}/>
        <TopicBreakdown />
        {/* <Performance data={performanceData} /> */}
        <NextSteps />
      </main>
      
      {/* Buttons */}
      <div className='flex flex-col gap-3 mx-4 mb-8'>
        <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2'>
          Retake Assessment
        </button>

        <button className='bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-md'>
          Continue Learning
        </button>
      </div>
    </div>
  )
}

export default PerformanceScreen