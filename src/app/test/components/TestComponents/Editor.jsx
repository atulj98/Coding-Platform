"use client"; // Ensures it runs only on the client side

import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const CodeEditor = ({ question }) => {
    const supportedLanguages = question.supportedLanguages;

    const monaco = useMonaco();
    const [language, setLanguage] = useState(supportedLanguages[0].id);
    const [code, setCode] = useState(supportedLanguages[0].template);
    const [output, setOutput] = useState("");
    const [codeMap, setCodeMap] = useState({});

    useEffect(() => {
        if (question && question.supportedLanguages.length > 0) {
            const defaultLang = question.supportedLanguages[0];
            setLanguage(defaultLang.id);
            setCode(defaultLang.template);
            setCodeMap({
                [defaultLang.id]: defaultLang.template,
            });
        }
    }, [question]);

    useEffect(() => {
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

            monaco.editor.setTheme("custom-dark");
        }
    }, [monaco]);

    const handleLanguageChange = (newLangId) => {
        const selectedLang = supportedLanguages.find((lang) => lang.id === newLangId);
        if (!selectedLang) return;

        setCodeMap((prev) => ({
            ...prev,
            [language]: code,
        }));

        setLanguage(newLangId);
        setCode(codeMap[newLangId] || selectedLang.template);
    };

    const handleRunCode = () => {
        setOutput("Code executed successfully!\nOutput: 42");
    };

    const submitCodeHandler = () => {
        setOutput("Submit clicked\n".repeat(7));
    };

    return (
        <div className="min-h-screen bg-[#0d1929] text-white p-6 space-y-6">
            {/* Language Selector */}
            <div className="flex justify-between items-center">
                <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded"
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Monaco Editor */}
            <div className="border border-gray-700 rounded overflow-hidden">
                <Editor
                    height="60vh"
                    theme="custom-dark"
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-between">
                <div className="flex gap-4">
                    <button
                        onClick={handleRunCode}
                        className="bg-[#05a636] hover:bg-[#037325] px-4 py-2 rounded cursor-pointer"
                    >
                        Run Code
                    </button>

                    <button
                        onClick={submitCodeHandler}
                        className="bg-[#155dfc] hover:bg-[#0f4ac9] px-4 py-2 rounded cursor-pointer"
                    >
                        Submit
                    </button>
                </div>

                {/* Icon Buttons */}
                <div className="flex gap-2">
                    <img width={20} src="/other_assets/assets/CodeEditor/saveIcon.svg" alt="save button" />
                    <img width={20} src="/other_assets/assets/CodeEditor/downloadIcon.svg" alt="download button" />
                    <img width={20} src="/other_assets/assets/CodeEditor/settingIcon.svg" alt="setting button" />
                </div>
            </div>

            {/* Output Console */}
            <div className="bg-black text-green-200 p-4 rounded h-40 overflow-auto font-mono text-sm">
                <pre className="pb-4">{output || "Output will appear here ..."}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;
