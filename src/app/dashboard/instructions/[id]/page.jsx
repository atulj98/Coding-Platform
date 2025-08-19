'use client'

import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, Code, FileText, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TestInstructions = ({ onStartTest }) => {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const handleStartTest = () => {
    if (agreed) {
      // Replace this with your actual routing logic
      // router.push('/test');
      router.push(`/test`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Coding Assessment Instructions</h1>
          <p className="text-gray-600">Please read all instructions carefully before starting the test</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Test Overview */}
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Test Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="opacity-90">90 minutes</div>
                </div>
              </div>
              <div className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                <div>
                  <div className="font-semibold">Problems</div>
                  <div className="opacity-90">2-3 Questions</div>
                </div>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                <div>
                  <div className="font-semibold">Languages</div>
                  <div className="opacity-90">Javascript, Python</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* General Instructions */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                General Instructions
              </h3>
              <ul className="space-y-2 text-gray-700 ml-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You will have <strong>90 minutes</strong> to solve 2-3 coding problems
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  All problems are based on <strong>Data Structures and Algorithms</strong>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Supported languages: <strong>Python, JavaScript</strong>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You can switch between problems at any time during the test
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  The timer starts immediately when you click "Start Test"
                </li>
              </ul>
            </section>

            {/* Submission Rules */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Submission Rules
              </h3>
              <ul className="space-y-2 text-gray-700 ml-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Test your code thoroughly</strong> before final submission
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Compilation errors will be scored as 0</strong>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Once submitted, you <strong>cannot modify or resubmit</strong> your solution
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  There is a <strong>5-minute penalty</strong> for each wrong submission
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Make sure to handle all edge cases and constraints
                </li>
              </ul>
            </section>

            {/* Allowed Resources */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Allowed Resources
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>✅ Personal notes and reference materials</li>
                  <li>✅ Code written beforehand by you personally</li>
                  <li>✅ Standard library documentation</li>
                  <li>✅ Algorithm and data structure references</li>
                </ul>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Prohibited Activities
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>❌ Using somebody else's code in your solution</li>
                  <li>❌ Collaborating with other participants</li>
                  <li>❌ Using external AI tools or code generators</li>
                  <li>❌ Sharing problems or solutions during the test</li>
                  <li>❌ Multiple browser tabs or windows (system monitored)</li>
                </ul>
              </div>
            </section>

            {/* Technical Requirements */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Requirements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Browser Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Chrome, Firefox, Safari, or Edge</li>
                    <li>• JavaScript enabled</li>
                    <li>• Stable internet connection</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">System Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Minimum 4GB RAM recommended</li>
                    <li>• Close unnecessary applications</li>
                    <li>• Ensure power supply is stable</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Tips for Success */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Success</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>💡 Read problem statements carefully and understand the constraints</li>
                  <li>💡 Start with the problem you find easiest to build confidence</li>
                  <li>💡 Write clean, well-commented code for better debugging</li>
                  <li>💡 Test with edge cases: empty inputs, maximum constraints, etc.</li>
                  <li>💡 Manage your time effectively - don't spend too long on one problem</li>
                  <li>💡 If stuck, move to another problem and return later</li>
                </ul>
              </div>
            </section>

            {/* Agreement Checkbox */}
            <div className="border-t pt-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I have read and understood all the instructions above. I agree to follow all rules and guidelines during the assessment. I understand that any violation may result in disqualification.
                </span>
              </label>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleStartTest}
                disabled={!agreed}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  agreed
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {agreed ? 'Start Test' : 'Please agree to instructions first'}
              </button>
              {agreed && (
                <p className="text-sm text-gray-600 mt-2">
                  ⏱️ Timer will start immediately after clicking the button
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Good luck with your assessment! Remember to stay calm and think logically.</p>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;