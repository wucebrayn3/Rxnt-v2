import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export default function ProtectedAdminRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axiosInstance.get("api/me/");
                if (response.data.is_staff === true) {
                    setAllowed(true);
                }
            } catch (err) {
                console.error("Not authorized:", err);
            }
            setInterval(() => {
                setLoading(false);
            }, 2000);
        };

        checkAdmin();
    }, []);

    if (loading) return <h2>Checking permissions...</h2>;

    if (!allowed) return <Navigate to="/thread" replace />;

    return children;
}
