import { useEffect, useState } from "react"
import axiosInstance from "../axiosInstance"
import { useParams } from "react-router-dom"

export default function Profile() {
    
    const { id } = useParams();
    const [userProfileData, setUserProfileData] = useState(null)

    const loadProfile = async () => {
        console.log(id)
        try {
            const response = await axiosInstance.get(`app/user/${id}/`)
            setUserProfileData(response)
            console.log(response)
        } catch (err) {
            console.error('May mali sa profile' + err)
        }
    }
    
    useEffect(() => {
        loadProfile();
    },[])

    if (!userProfileData) {return <>Loading...</>}

    return (
        <>
        <h1>Hi</h1>
        <h1>Id: {id}</h1>
        </>
    )
}