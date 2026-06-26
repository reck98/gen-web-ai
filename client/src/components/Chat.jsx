/* eslint-disable no-unused-vars */
import { Send } from "lucide-react";
import React from "react";

const Chat = ({ website }) => {
    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {website.conversations.map((m, i) => (
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
            </div>
            <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                    <textarea
                        row="1"
                        placeholder="Describe your changes"
                        className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                    ></textarea>
                    <button className="px-4 py-3 rounded-2xl bg-white text-black">
                        {" "}
                        <Send size={14} />{" "}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chat;
