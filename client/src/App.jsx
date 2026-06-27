/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Editor from "./pages/WebSiteEditor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";

export const serverURL = "https://gen-web-ai-w0d9.onrender.com";
const App = () => {
    useGetCurrentUser();

    const { userData } = useSelector((state) => state.user);

    return (
        <BrowserRouter>
            <Routes>
                {/* Unprotected Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/site/:id" element={<LiveSite />} />
                <Route path="pricing" element={<Pricing />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={userData ? <Dashboard /> : <Home />}
                />
                <Route
                    path="/generate"
                    element={userData ? <Generate /> : <Home />}
                />
                <Route
                    path="/editor/:id"
                    element={userData ? <Editor /> : <Home />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
