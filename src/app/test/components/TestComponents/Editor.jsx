"use client";

import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const CodeEditor = ({ question, darkThemeOn }) => {
    const supportedLanguages = question.supportedLanguages;
    const monaco = useMonaco();
    
    // Add a state to track if the theme is ready
    const [isThemeReady, setIsThemeReady] = useState(false);

    const [language, setLanguage] = useState(supportedLanguages[0].id);
    const [code, setCode] = useState(supportedLanguages[0].template);
    const [output, setOutput] = useState("");
    const [codeMap, setCodeMap] = useState({});

    useEffect(() => {
        if (question && question.supportedLanguages.length > 0) {
            const defaultLang = question.supportedLanguages[0];
            setLanguage(defaultLang.id);
            setCode(defaultLang.template);
            setCodeMap({ [defaultLang.id]: defaultLang.template });
        }
    }, [question]);

    useEffect(() => {
        // This effect runs when the monaco instance is available
        if (monaco) {
            monaco.editor.defineTheme("custom-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: {
                    "editor.background": "#0d1929",
                    "editor.foreground": "#ffffff",
                    "editorLineNumber.foreground": "#5e7a99",
                    "editor.lineHighlightBackground": "#112138",
                    "editorCursor.foreground": "#ffffff",
                    "editorIndentGuide.background": "#1e2e47",
                    "editor.selectionBackground": "#264f78",
                    "editor.inactiveSelectionBackground": "#3a3d41",
                },
            });

            setIsThemeReady(true);
        }
    }, [monaco]);

    
    const handleLanguageChange = (newLangId) => {
        const selectedLang = supportedLanguages.find((lang) => lang.id === newLangId);
        if (!selectedLang) return;
        setCodeMap((prev) => ({ ...prev, [language]: code }));
        setLanguage(newLangId);
        setCode(codeMap[newLangId] || selectedLang.template);
    };
    const handleRunCode = () => setOutput("Code executed successfully!\nOutput: 42");
    const submitCodeHandler = () => setOutput("Submit clicked\n".repeat(7));

    return (
        <div
            className={`min-h-screen p-6 space-y-6 ${
                darkThemeOn ? 'bg-[#0d1929] text-white' : 'bg-white text-gray-900'
            }`}
        >
            {/* ... (Language Selector) ... */}
            <div className="flex justify-between items-center">
                <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className={`p-2 rounded ${
                        darkThemeOn
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-200 text-gray-900'
                    }`}
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Monaco Editor */}
            <div
                className={`rounded overflow-hidden border ${
                    darkThemeOn ? 'border-gray-700' : 'border-gray-200'
                }`}
            >
                {/* Conditionally render the Editor only when the theme is ready */}
                {isThemeReady ? (
                    <Editor
                        height="60vh"
                        theme={darkThemeOn ? 'custom-dark' : 'light'}
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            automaticLayout: true,
                        }}
                    />
                ) : (
        
                    <div className="h-[60vh] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <p>Loading Editor...</p>
                    </div>
                )}
            </div>
            
            {/* ... (Action Buttons and Output Console) ... */}
            <div className="flex gap-4 justify-between">
                <div className="flex gap-4">
                    <button onClick={handleRunCode} className="bg-[#05a636] hover:bg-[#037325] px-4 py-2 rounded cursor-pointer text-white">Run Code</button>
                    <button onClick={submitCodeHandler} className="bg-[#155dfc] hover:bg-[#0f4ac9] px-4 py-2 rounded cursor-pointer text-white">Submit</button>
                </div>
                <div className="flex gap-2 items-center">
                    <img width={20} src="/other_assets/assets/CodeEditor/saveIcon.svg" alt="save button" className={darkThemeOn ? 'filter invert' : ''} />
                    <img width={20} src="/other_assets/assets/CodeEditor/downloadIcon.svg" alt="download button" className={darkThemeOn ? 'filter invert' : ''} />
                    <img width={20} src="/other_assets/assets/CodeEditor/settingIcon.svg" alt="setting button" className={darkThemeOn ? 'filter invert' : ''} />
                </div>
            </div>
            <div className={`p-4 rounded h-40 overflow-auto font-mono text-sm ${ darkThemeOn ? 'bg-black text-green-200' : 'bg-gray-100 text-gray-800'}`}>
                <pre>{output || "Output will appear here ..."}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;