/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import useDocumentTitle from "../hooks/useDocumentTitle";

const LiveSite = () => {
    useDocumentTitle("Live Site - GenWeb.ai");
    const { id } = useParams();

    const [htmlPage, setHtmlPage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-by-slug/${id}`,
                );

                if (!result.data) {
                    setError("Site not found");
                    return;
                }

                setHtmlPage(result.data.latestCode);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || "Site not found");
            }
        };

        handleGetWebsite();
    }, [id]);

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white">
                {error}
            </div>
        );
    }
    return (
        <iframe
            title="Live Site"
            srcDoc={htmlPage}
            className="w-screen h-screen border-none"
            sandbox="allow-scripts allow-same-origin allow-forms"
        />
    );
};

export default LiveSite;
