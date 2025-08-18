'use client';
import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from './components/TestComponents/Editor';
import problems from './testdata/TestScreenData/Problems';
import QuestionDescription from './components/TestComponents/QuestionPanel';
import Navbar from './components/Navbar';

const TestScreen = () => {
  const totalProblems = problems.length;
  const [que_no, setQue_no] = useState(0);
  const [question, setQuestion] = useState(problems[0]);
  const [editorWidth, setEditorWidth] = useState(50); // percent
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Initialize isLargeScreen state after component mounts (client-side only)
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setQuestion(problems[que_no]);
  }, [que_no]);

  const changeQuesHandler = (val) => {
    setQue_no(val);
  };

  // Mouse events for resizing
  const startDrag = (e) => {
    isDragging.current = true;
    e.preventDefault();
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const onDrag = (e) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const offsetX = e.clientX - containerRef.current.offsetLeft;
    let newEditorWidth = ((containerWidth - offsetX) / containerWidth) * 100;
    newEditorWidth = Math.min(Math.max(newEditorWidth, 25), 75);
    setEditorWidth(newEditorWidth);
  };

  return (
    <div className="w-full">
      <nav className="w-full fixed z-10">
        <Navbar
          problems={problems}
          currProb={question.problem_no}
          changeQuesHandler={changeQuesHandler}
          setQue_no={setQue_no}
        />
      </nav>
      <div className="h-1.2" />

      {/* Main Content Area */}
      <div
        ref={containerRef}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        className="flex lg:flex-row flex-col pt-12 h-screen w-full lg:overflow-hidden overflow-auto"
      >
        {/* Question Panel */}
        <div
          className="p-6 relative flex flex-col min-h-screen"
          style={{
            width: isLargeScreen ? `${100 - editorWidth}%` : '100%',
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <QuestionDescription question={question} />

          {/* Previous and Next button */}
          <div className="sticky bottom-8 mt-auto flex justify-end items-end w-full p-4 gap-2 ">
            <button
              onClick={() =>
                setQue_no((prev) => (prev - 1 >= 0 ? prev - 1 : totalProblems - 1))
              }
              className="bg-[#0d1929] h-10 text-white font-semibold w-[100px] rounded-sm px-4 cursor-pointer"
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
            className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400 transition"
          ></div>
        )}

        {/* Code Editor */}
        <div
          style={isLargeScreen ? { width: `${editorWidth}%` } : { width: '100%' }}
          className="h-full"
        >
          <CodeEditor question={question} />
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
