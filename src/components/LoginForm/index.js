import { useState } from 'react'
import './index.css'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [_, setCookie] = useCookies(["user_id"])
    const navigate = useNavigate()

    const onSubmitSuccess = get_user_id => {
        setErr(false)
        setErrMsg("")
        setCookie("user_id", get_user_id[0].id);
        navigate("/user-dashboard")

    }

    const onSubmitFailure = msg => {
        setErr(true)
        setErrMsg("Invalid Credentials")
        console.log(msg)
    }

    const handleLogin = async event => {
        event.preventDefault()
        const url = "https://bursting-gelding-24.hasura.app/api/rest/get-user-id"
        const userDetails = { email, password }
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
            },
            body: JSON.stringify(userDetails)
        }
        // axios.post(url,{
        //     params:userDetails,
        //     headers: {
        //         'content-type': 'application/json',
        //         'x-hasura-admin-secret':'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        //       },
        // }).then(response => {
        //     console.log(response)
        //     
        // }).catch(error => {
        //     console.error('Error:', error);
        //     onSubmitFailure(error);
        //   });
        try {
            const response = await fetch(url, options)
            console.log(response)
            if (response.ok === true) {
                onSubmitSuccess(response.data.get_user_id)
            } else {
                onSubmitFailure(response.data)
            }
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div className="container">
            <div className="desktopViewBoard">
                <h1 className="desktopViewBoardHeading">Login</h1>
            </div>
            <div className="loginContainerMain">
                <div className="signInContainer">
                    <h1 className="signInHeading">Sign In</h1>
                    <p className="signInPara">Sign in to your account</p>
                    <form className="loginFormContainer" onSubmit={handleLogin}>
                        <div style={{ margin: 'auto', width: '85%' }}>
                            <div className="inputFormContainer">
                                <label className="loginFormName" htmlFor='email'>email</label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id='email' className="loginFormInput" />
                            </div>
                            <div className="inputFormContainer">
                                <label className="loginFormName" htmlFor='password'>Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="loginFormInput" />
                                {err && (<p className="errorMsg">{errMsg}</p>)}
                            </div>
                            <button type="submit" className="sign-in-btn">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm