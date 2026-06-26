/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginModel from "../components/LoginModel";
import { useDispatch, useSelector } from "react-redux";
import { Coins } from "lucide-react";
import axios from "axios";
import { serverURL } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const highlights = [
        {
            title: "AI Generated Code",
            description:
                "Generate clean, maintainable React components and production-ready code from simple prompts. No templates, no drag-and-drop limitations.",
        },
        {
            title: "Fully Responsive Layouts",
            description:
                "Every website automatically adapts to mobile, tablet, and desktop screens with modern layouts, smooth interactions, and pixel-perfect responsiveness.",
        },
        {
            title: "Production Ready Output",
            description:
                "Receive scalable code with reusable components, optimized performance, and deployment-ready projects built for real-world applications.",
        },
    ];

    const { userData } = useSelector((state) => state.user);

    const [openProfile, setOpenProfile] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
            await axios.get(`${serverURL}/api/auth/logout`, {
                withCredentials: true,
            });

            dispatch(setUserData(null));
            setOpenProfile(false);
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(userData);

    const [openLogin, setOpenLogin] = useState(false);
    return (
        <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-lg font-semibold">GenWeb.ai</div>
                    <div className="flex items-center gap-5">
                        <div className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer">
                            Pricing
                        </div>

                        {userData && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm cursor-pointer hover:bg-white/10 transition">
                                <Coins size={14} className="text-yellow-400" />
                                <span className="text-zinc-300">Credits</span>
                                <span>{userData.user.credits}</span>
                                <span className="font-semibold">+</span>
                            </div>
                        )}

                        {!userData ? (
                            <button
                                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                                onClick={() => {
                                    setOpenLogin(true);
                                }}
                            >
                                Get Started
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setOpenProfile(!openProfile);
                                    }}
                                >
                                    <img
                                        src={
                                            userData.user.avatar ||
                                            `https://ui-avatars.com/api/?name=${userData.user.name}`
                                        }
                                        alt={userData.user.name}
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                    />
                                </button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <>
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: -10,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -10,
                                                    scale: 0.95,
                                                }}
                                                className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-white/10">
                                                    <p className="text-sm font-medium truncate">
                                                        {userData.user.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 truncate">
                                                        {userData.user.email}
                                                    </p>
                                                </div>

                                                <button className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:border-white/5">
                                                    <Coins
                                                        size={16}
                                                        className="text-yellow-400"
                                                    />
                                                    <span className="text-zinc-300">
                                                        Credits
                                                    </span>
                                                    <span>
                                                        {userData.user.credits}
                                                    </span>
                                                    <span className="font-semibold">
                                                        +
                                                    </span>
                                                </button>

                                                <button
                                                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5"
                                                    onClick={() => {
                                                        navigate("/dashboard");
                                                    }}
                                                >
                                                    Dashboard
                                                </button>
                                                <button
                                                    onClick={handleLogOut}
                                                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 text-red-400"
                                                >
                                                    Logout
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <section className="pt-44 pb-32 px-6 text-center">
                <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight"
                >
                    Build Stunning Websites <br />
                    <span className=" bg-linear-to-r from-purple-600 to-blue-900 bg-clip-text text-transparent">
                        {" "}
                        with AI
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
                >
                    Describe Your Idea and let AI generate a modern, responsive,
                    production-ready website.
                </motion.p>

                <button
                    className="mt-12 px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
                    // onClick={() => {
                    //     setOpenLogin(true);
                    // }}

                    onClick={() =>
                        userData ? navigate("/dashboard") : setOpenLogin(true)
                    }
                >
                    {userData ? "Go to Dashboard" : "Get Started"}
                </button>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {highlights.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="rounded-2xl bg-white/5 border border-white/10 p-8"
                        >
                            <h1 className="text-xl font-semibold mb-3">
                                {item.title}
                            </h1>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} GenWeb.ai | Made with ❤️ by{" "}
                <span className="text-white">reck98</span>
            </footer>

            {openLogin && (
                <LoginModel
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                />
            )}
        </div>
    );
};

export default Home;
