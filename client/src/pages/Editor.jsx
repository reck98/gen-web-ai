/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import Header from "../components/Header";
import Chat from "../components/Chat";
import { Code2, Monitor, Rocket } from "lucide-react";

const Editor = () => {
    const { id } = useParams();

    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");

    const iframeRef = useRef(null);

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-by-id/${id}`,
                    { withCredentials: true },
                );

                setWebsite(result.data);

                // console.log(result);
            } catch (error) {
                console.log(error);
                setError(error.response.data.message);
            }
        };

        handleGetWebsite();
    }, [id]);

    useEffect(() => {
        if (!iframeRef.current || !website?.latestCode) return;

        const blob = new Blob([website.latestCode], {
            type: "text/html",
        });

        const url = URL.createObjectURL(blob);

        iframeRef.current.src = url;

        return () => URL.revokeObjectURL(url);
    }, [website?.latestCode]);

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

    return (
        <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
            <aside className="hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80">
                <Header website={website} />
                <Chat website={website} />
            </aside>

            <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
                    <span className="text-xs text-zinc-400">Live Preview</span>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition">
                            {" "}
                            <Rocket size={14} /> Deploy
                        </button>
                        <button className="p-2">
                            {" "}
                            <Code2 size={18} />{" "}
                        </button>
                        <button className="p-2">
                            {" "}
                            <Monitor size={18} />{" "}
                        </button>
                    </div>
                </div>

                <iframe ref={iframeRef} className="flex-1 w-full bg-white" />
            </div>
        </div>
    );
};

export default Editor;
