import { Link } from "react-router-dom"

export default function LandingPage() {

    return (
        <div>
            <h2>Where words matter more than identity</h2>
            <Link to={'/register'}><button>Sign up now!</button></Link>
            <Link to={'/login'}>Already have an account? Login here!</Link>
        </div>
    )

}