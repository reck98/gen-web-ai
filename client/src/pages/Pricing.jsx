/* eslint-disable no-unused-vars */
import { ArrowLeft, Check, Coins } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../App";

const plans = [
    {
        key: "free",
        name: "Free",
        price: "₹0",
        credits: 100,
        description: "Perfect to explore GenWeb.ai",
        features: [
            "AI website generation",
            "Responsive HTML output",
            "Basic animations",
        ],
        popular: false,
        button: "Get Started",
    },
    {
        key: "pro",
        name: "Pro",
        price: "₹499",
        credits: 500,
        description: "For serious creators & freelancers",
        features: [
            "Everything in Free",
            "Faster generation",
            "Edit & regenerate",
        ],
        popular: true,
        button: "Upgrade to Pro",
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "₹1499",
        credits: 1000,
        description: "For teams & power users",
        features: [
            "Unlimited iterations",
            "Highest priority",
            "Team collaboration",
            "Dedicated support",
        ],
        popular: false,
        button: "Contact Sales",
    },
];

const Pricing = () => {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);

    // Store the currently loading plan key
    const [loading, setLoading] = useState("");

    const handleBuy = async (planKey) => {
        if (!userData) {
            navigate("/");
            return;
        }

        if (planKey === "free") {
            navigate("/dashboard");
            return;
        }

        try {
            setLoading(planKey);

            const result = await axios.post(
                `${serverURL}/api/billing`,
                { planType: planKey },
                { withCredentials: true },
            );

            // eslint-disable-next-line react-hooks/immutability
            window.location.href = result.data.sessionUrl;
        } catch (error) {
            console.error(error);
            setLoading("");
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24">
            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full bg-indigo-600/20 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-purple-600/20 blur-[120px]" />
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mx-auto mb-14 max-w-4xl text-center"
            >
                <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    Simple, Transparent Pricing
                </h1>

                <p className="text-lg text-zinc-400">
                    Buy credits once. Build websites anytime.
                </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
                {plans.map((p, i) => (
                    <motion.div
                        key={p.key}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -14, scale: 1.03 }}
                        viewport={{ once: true }}
                        className={`relative rounded-3xl border p-8 backdrop-blur-xl transition-all ${
                            p.popular
                                ? "border-indigo-500 bg-linear-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
                                : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
                        }`}
                    >
                        {p.popular && (
                            <span className="absolute right-5 top-5 rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium">
                                Most Popular
                            </span>
                        )}

                        <h2 className="mb-2 text-xl font-semibold">{p.name}</h2>

                        <p className="mb-6 text-sm text-zinc-400">
                            {p.description}
                        </p>

                        <div className="mb-4 flex items-end gap-1">
                            <span className="text-4xl font-bold">
                                {p.price}
                            </span>

                            <span className="mb-1 text-sm text-zinc-400">
                                /one-time
                            </span>
                        </div>

                        <div className="mb-8 flex items-center gap-2">
                            <Coins size={18} className="text-yellow-400" />

                            <span className="font-semibold">
                                {p.credits} Credits
                            </span>
                        </div>

                        <ul className="mb-10 space-y-3">
                            {p.features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-2 text-sm text-zinc-300"
                                >
                                    <Check
                                        size={16}
                                        className="text-green-400"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            disabled={loading !== ""}
                            onClick={() => handleBuy(p.key)}
                            className={`w-full rounded-xl py-3 font-semibold transition ${
                                p.popular
                                    ? "bg-indigo-500 hover:bg-indigo-600"
                                    : "bg-white/10 hover:bg-white/20"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                            {loading === p.key ? "Redirecting..." : p.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
