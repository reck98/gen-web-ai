/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";

const WebSiteEditor = () => {
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const { id } = useParams();
    const iframeRef = useRef(null);

    const thinkingSteps = [
        "Understanding the request...",
        "Planning the layout changes...",
        "Improving responsiveness...",
        "Analyzing the animations...",
        "Finalizing the changes...",
    ];

    const handleUpdate = async () => {
        if (!prompt) return;
        setMessages((m) => [...m, { role: "user", content: prompt }]);
        setUpdateLoading(true);
        const currentPrompt = prompt.trim();

        setPrompt("");
        try {
            const result = await axios.post(
                `${serverURL}/api/website/update/${id}`,
                { prompt: currentPrompt },
                { withCredentials: true },
            );

            setUpdateLoading(false);

            setMessages((m) => [
                ...m,
                { role: "ai", content: result.data.message },
            ]);

            setCode(result.data.code);
        } catch (error) {
            console.log(error);
            setPrompt(currentPrompt);
        }
    };

    useEffect(() => {
        if (!updateLoading) return;
        const i = setInterval(() => {
            setIndex((i) => (i + 1) % thinkingSteps.length);
        }, 1300);

        return () => clearInterval(i);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLoading]);

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-by-id/${id}`,
                    { withCredentials: true },
                );

                setWebsite(result.data);
                setCode(result.data.latestCode);
                setMessages(result.data.conversations);

                // console.log(result);
            } catch (error) {
                console.log(error);
                setError(error.response.data.message);
            }
        };

        handleGetWebsite();
    }, [id]);

    useEffect(() => {
        if (!iframeRef.current || !code) return;

        const blob = new Blob([code], {
            type: "text/html",
        });

        const url = URL.createObjectURL(blob);

        iframeRef.current.src = url;

        return () => URL.revokeObjectURL(url);
    }, [code]);

    const handleDeploy = async () => {
        try {
            const result = await axios.get(
                `${serverURL}/api/website/deploy/${website._id}`,
                {
                    withCredentials: true,
                },
            );

            window.open(`${result.data.url}`, "_blank");
        } catch (error) {
            console.log(error);
        }
    };

    if (error)
        return (
            <div className="h-screen flex items-center justify-center bg-black text-red-400">
                {error}
            </div>
        );

    if (!website) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    const Header = ({ onclose }) => {
        return (
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
                <span className="font-semibold truncate">{website.title}</span>
                {onclose && (
                    <button
                        className="lg:hidden cursor-pointer"
                        color="white"
                        onClick={onclose}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
            <aside className="hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80">
                <Header />
                <>
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                            >
                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                        m.role === "user"
                                            ? "bg-white text-black"
                                            : "bg-black text-zinc-300 border border-white/10"
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {updateLoading && (
                            <div className="max-w-[85%] mr-auto">
                                <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                                    {thinkingSteps[index]}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Describe your changes"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleUpdate();
                                    }
                                }}
                            />
                            <button
                                className="px-4 py-3 rounded-2xl bg-white text-black"
                                onClick={handleUpdate}
                                disabled={updateLoading}
                            >
                                {" "}
                                <Send size={14} />{" "}
                            </button>
                        </div>
                    </div>
                </>
            </aside>

            <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
                    <span className="text-xs text-zinc-400">Live Preview</span>
                    <div className="flex gap-3">
                        {!website.deployed && (
                            <button
                                onClick={() => handleDeploy()}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
                            >
                                {" "}
                                <Rocket size={14} /> Deploy
                            </button>
                        )}

                        <button
                            onClick={() => setShowChat(true)}
                            className="p-2 lg:hidden cursor-pointer"
                        >
                            {" "}
                            <MessageSquare size={18} />{" "}
                        </button>
                        <button
                            className="p-2 cursor-pointer"
                            onClick={() => setShowCode(true)}
                        >
                            {" "}
                            <Code2 size={18} />{" "}
                        </button>
                        <button
                            className="p-2 cursor-pointer"
                            onClick={() => setShowFullPreview(true)}
                        >
                            {" "}
                            <Monitor size={18} />{" "}
                        </button>
                    </div>
                </div>

                <iframe
                    ref={iframeRef}
                    className="flex-1 w-full bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="fixed inset-0 z-9999 bg-black flex flex-col"
                    >
                        <Header onclose={() => setShowChat(false)} />
                        <>
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                                    >
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                m.role === "user"
                                                    ? "bg-white text-black"
                                                    : "bg-black text-zinc-300 border border-white/10"
                                            }`}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                ))}

                                {updateLoading && (
                                    <div className="max-w-[85%] mr-auto">
                                        <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                                            {thinkingSteps[index]}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Describe your changes"
                                        value={prompt}
                                        onChange={(e) =>
                                            setPrompt(e.target.value)
                                        }
                                        className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleUpdate();
                                            }
                                        }}
                                    />
                                    <button
                                        className="px-4 py-3 rounded-2xl bg-white text-black"
                                        onClick={handleUpdate}
                                        disabled={updateLoading}
                                    >
                                        {" "}
                                        <Send size={14} />{" "}
                                    </button>
                                </div>
                            </div>
                        </>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-9999 bg-[#1e1e1e] flex flex-col"
                    >
                        <div className="h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]">
                            <span className="text-sm font-medium">
                                index.html
                            </span>
                            <button onClick={() => setShowCode(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <Editor
                            theme="vs-dark"
                            value={code}
                            language="html"
                            onChange={(v) => setCode(v)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className="fixed inset-0 z-9999 bg-black">
                        <iframe
                            className="w-full h-full bg-white"
                            srcDoc={code}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />

                        <button
                            className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg text-white"
                            onClick={() => setShowFullPreview(false)}
                        >
                            {" "}
                            <X size={18} />{" "}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WebSiteEditor;
