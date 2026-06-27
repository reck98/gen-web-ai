/* eslint-disable no-unused-vars */
import { ArrowLeft, Check, RocketIcon, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";

const Dashboard = () => {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [websites, setWebsites] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true);
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-all`,
                    {
                        withCredentials: true,
                    },
                );

                // console.log(result);
                setWebsites(result.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.response.data.message);
                setLoading(false);
            }
        };

        handleGetAllWebsites();
    }, []);

    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(
                `${serverURL}/api/website/deploy/${id}`,
                {
                    withCredentials: true,
                },
            );

            window.open(`${result.data.url}`, "_blank");

            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id
                        ? { ...w, deployedUrl: result.data.url, deployed: true }
                        : w,
                ),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployedUrl);
        setCopiedId(site._id);
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 rounded-lg hover:bg-white/10 transition"
                            onClick={() => navigate("/")}
                        >
                            {" "}
                            <ArrowLeft size={16} />{" "}
                        </button>
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                    <button
                        onClick={() => navigate("/generate")}
                        className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
                    >
                        + New website
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <p className="text-sm text-zinc-400 mb-1">Welcome Back</p>
                    <h1 className="text-3xl font-bold">
                        {userData.user.name} !
                    </h1>
                </motion.div>

                {loading && (
                    <div className="mt-24 text-center text-zinc-400 ">
                        Loading...
                    </div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-red-400 ">
                        {error}
                    </div>
                )}

                {websites.length === 0 && !loading && (
                    <div className="mt-24 text-center text-zinc-400">
                        You have no websites yet.
                    </div>
                )}

                {!loading && !error && websites?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {websites.map((w, i) => {
                            const copied = copiedId === w._id;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.005 }}
                                    onClick={() => navigate(`/editor/${w._id}`)}
                                    whileHover={{ y: -6 }}
                                    className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col cursor-pointer"
                                >
                                    <div className="relative h-40 bg-black cursor-pointer">
                                        <iframe
                                            srcDoc={w.latestCode}
                                            className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                                        />
                                        <div className="absolute inset-0 bg-black/30" />
                                    </div>

                                    <div className="p-5 flex flex-col gap-4 flex-1">
                                        <h3 className="text-base font-semibold line-clamp-2">
                                            {w.title}
                                        </h3>
                                        <p className="text-xs text-zinc-400 ">
                                            Last Updatet at{" "}
                                            {new Date(
                                                w.updatedAt,
                                            ).toLocaleDateString()}
                                        </p>

                                        {!w.deployed ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    return handleDeploy(w._id);
                                                }}
                                                className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
                                            >
                                                {" "}
                                                <RocketIcon size={18} />{" "}
                                                Deploy{" "}
                                            </button>
                                        ) : (
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    return handleCopy(w);
                                                }}
                                                className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 hover:bg-white/20 border border-white/10"}`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check size={18} />
                                                        Link Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 />
                                                        Share Link
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
