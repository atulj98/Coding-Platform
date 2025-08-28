'use client';
import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from './components/TestComponents/Editor';
import problems from './testdata/TestScreenData/Problems';
import QuestionDescription from './components/TestComponents/QuestionPanel';
import Navbar from './components/Navbar';
import CollapsibleSidebar from './components/CollapsibleSidebar';

const TestScreen = () => {
  const totalProblems = problems.length;
  const [que_no, setQue_no] = useState(0);
  const [question, setQuestion] = useState(problems[0]);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const [darkThemeOn, setDarkThemeOn] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setQuestion(problems[que_no]);
  }, [que_no]);

  const changeQuesHandler = (val) => setQue_no(val);
  const startDrag = (e) => { isDragging.current = true; e.preventDefault(); };
  const stopDrag = () => { isDragging.current = false; };
  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const onDrag = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const offsetX = e.clientX - containerRef.current.offsetLeft;
    let newEditorWidth = ((containerWidth - offsetX) / containerWidth) * 100;
    newEditorWidth = Math.min(Math.max(newEditorWidth, 25), 75);
    setEditorWidth(newEditorWidth);
  };


  // console.log(darkThemeOn);

  return (
    <div className = {`w-full ${darkThemeOn ? "bg-gray-900" : "bg-white"}`}>
      <Navbar 
        darkThemeOn={darkThemeOn}
        setDarkThemeOn={setDarkThemeOn} 
      />
      <main className="pt-16">
        <CollapsibleSidebar
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          problems={problems}
          currProb={question.problem_no}
          changeQuesHandler={changeQuesHandler}
          darkThemeOn={darkThemeOn}
        />

        {/* Main Content Area */}
        <div
          ref={containerRef}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          // Height is now responsive: fixed on large screens, auto on small.
          className="flex lg:flex-row flex-col pl-16 w-full lg:h-[calc(100vh-4rem)] lg:overflow-hidden"
        >
          {/* Question Panel */}
          <div
            className="p-6 relative flex flex-col lg:overflow-y-auto"
            // Width is responsive, height is handled by parent.
            style={{
              width: isLargeScreen ? `${100 - editorWidth}%` : '100%',
            }}
          >
            <QuestionDescription question={question} darkThemeOn={darkThemeOn} />

            {/* Previous and Next button */}
            {/* On small screens, this will now appear after the question content */}
            <div className="flex justify-end items-end w-full p-4 gap-2 mt-8 lg:mt-auto lg:sticky lg:bottom-8">
              <button
                onClick={() => setQue_no((prev) => (prev - 1 >= 0 ? prev - 1 : totalProblems - 1))}
                className={` ${darkThemeOn ? "bg-[#1e2939] text-white" : "bg-gray-200 text-gray-800"} h-10 font-semibold w-[100px] rounded-sm px-4 cursor-pointer`}
              >
                {`<`}
              </button>
              <button
                onClick={() => setQue_no((prev) => (prev + 1) % totalProblems)}
                className="bg-[#155dfc] h-10 text-white rounded-sm px-4 font-semibold w-[100px] cursor-pointer"
              >
                {`>`}
              </button>
            </div>
          </div>

          {/* Resizer Bar */}
          {isLargeScreen && (
            <div
              onMouseDown={startDrag}
              className={`w-2 cursor-col-resize ${darkThemeOn ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"} transition`}
            ></div>
          )}

          {/* Code Editor */}
          {/* On small screens, this panel will stack below the Question Panel */}
          <div
            style={{ width: isLargeScreen ? `${editorWidth}%` : '100%' }}
            // 5. Set a min-height for small screens for a better look
            className="lg:h-full min-h-screen"
          >
            <CodeEditor question={question} darkThemeOn={darkThemeOn} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestScreen;