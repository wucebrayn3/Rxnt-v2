import { useEffect } from "react"
import axiosInstance from "../axiosInstance"

export default function UserProfile() {
    
    const loadProfile = async () => {
        try {
            const response = await axiosInstance.get('api/me/')

            console.log(response)
        } catch (err) {
            console.error('May mali sa profile' + err)
        }
    }
    
    useEffect(() => {
        loadProfile();
    },[])

    return (
        <>
        <h1>Hi</h1>
        </>
    )
}
