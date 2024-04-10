import React, { useState } from "react";
import '../index.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        console.log('Username:', username);
        console.log('Password:', password);

        {/*const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);*/}

        try {
            const response = await axios.post('/register', {
                username,
                password,
            });

            console.log(response.data);
            if (response && response.status === 200) {
                navigate('/login');
            }
        } catch (e) {
            if (e.response && e.response.status === 409) {
                window.alert('USER EXISTS');
                console.log('USER EXISTS');
            }
            console.log(`error : ${e}`);
        }



    }


    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }


    return (
        <div className="h-screen py-4">
            <div className="flex flex-col items-center justify-center mx-4 sm:mx-10 md:mx-20 bg-zinc-50 border shadow-md h-full rounded-md">
                <img
                    src="//incarnage.com/cdn/shop/files/carnage_logo_white.png?crop=center&amp;height=300&amp;v=1636647968&amp;width=300" data-widths="[180, 320, 360, 540, 640, 720, 900, 1080, 1296, 1512, 1728, 2048]" data-aspectratio="3.787878787878788" data-sizes="auto" data-srcset="//incarnage.com/cdn/shop/files/carnage_logo_white_180x.png?v=1636647968 180w, //incarnage.com/cdn/shop/files/carnage_logo_white_320x.png?v=1636647968 320w, //incarnage.com/cdn/shop/files/carnage_logo_white_360x.png?v=1636647968 360w, //incarnage.com/cdn/shop/files/carnage_logo_white_540x.png?v=1636647968 540w, //incarnage.com/cdn/shop/files/carnage_logo_white_640x.png?v=1636647968 640w, //incarnage.com/cdn/shop/files/carnage_logo_white_720x.png?v=1636647968 720w, //incarnage.com/cdn/shop/files/carnage_logo_white_900x.png?v=1636647968 900w, //incarnage.com/cdn/shop/files/carnage_logo_white_1080x.png?v=1636647968 1080w, //incarnage.com/cdn/shop/files/carnage_logo_white_1296x.png?v=1636647968 1296w, //incarnage.com/cdn/shop/files/carnage_logo_white_1512x.png?v=1636647968 1512w, //incarnage.com/cdn/shop/files/carnage_logo_white_1728x.png?v=1636647968 1728w, //incarnage.com/cdn/shop/files/carnage_logo_white_2048x.png?v=1636647968 2048w" sizes="200.75757575757578px" loading="lazy" srcset="//incarnage.com/cdn/shop/files/carnage_logo_white_180x.png?v=1636647968 180w, //incarnage.com/cdn/shop/files/carnage_logo_white_320x.png?v=1636647968 320w, //incarnage.com/cdn/shop/files/carnage_logo_white_360x.png?v=1636647968 360w, //incarnage.com/cdn/shop/files/carnage_logo_white_540x.png?v=1636647968 540w, //incarnage.com/cdn/shop/files/carnage_logo_white_640x.png?v=1636647968 640w, //incarnage.com/cdn/shop/files/carnage_logo_white_720x.png?v=1636647968 720w, //incarnage.com/cdn/shop/files/carnage_logo_white_900x.png?v=1636647968 900w, //incarnage.com/cdn/shop/files/carnage_logo_white_1080x.png?v=1636647968 1080w, //incarnage.com/cdn/shop/files/carnage_logo_white_1296x.png?v=1636647968 1296w, //incarnage.com/cdn/shop/files/carnage_logo_white_1512x.png?v=1636647968 1512w, //incarnage.com/cdn/shop/files/carnage_logo_white_1728x.png?v=1636647968 1728w, //incarnage.com/cdn/shop/files/carnage_logo_white_2048x.png?v=1636647968 2048w"
                    className="h-16 bg-black"
                    alt="Profile"
                />
                <h1 className="text-lg sm:text-xl md:text-2xl mt-2">Register your account</h1>
                <div className="bg-white w-4/5 md:w-3/4 lg:w-4/6 xl:w-3/6 px-10 shadow-sm mt-10 rounded-lg py-7">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username" id="labelEmail" className="text-sm sm:text-base">Email address</label>
                        <div className="my-2">
                            <input name="username" id="username" type="email" autoComplete="email" required value={username} onChange={handleUsernameChange} className="border border-zinc-300 rounded-md w-full p-1" />
                        </div>
                        <label htmlFor="password" id="labelPassword" className="text-sm sm:text-base">Password</label>
                        <div className="my-2">
                            <input name="password" id="password" type="password" required value={password} onChange={handlePasswordChange} className="border border-zinc-300 rounded-md w-full p-1" />
                        </div>
                        <button type="submit" className="w-full rounded-md p-1 bg-indigo-600 mt-3 font-medium text-white hover:opacity-75 transition ease-out duration-300 text-sm sm:text-base">Sign In</button>
                    </form>
                    <div className="mt-4">
                        <Link to={'/login'}>
                            <i className="text-xs">Login</i>
                        </Link>
                    </div>
                    <div className="flex w-full mt-4 justify-between">
                        <div className="flex h-10 w-1/3 items-center">
                            <hr className="w-full" />
                        </div>
                        <span className="flex items-center text-xs">Or continue with</span>
                        <div className="flex h-10 w-1/3 items-center">
                            <hr className="w-full" />
                        </div>
                    </div>
                    <div className="flex w-full justify-center">
                        <div className="w-1/2 rounded-md">
                            {/*Sign In with Google*/}
                            <a href="/auth/google" role="button" className="border flex gap-2 py-2 w-full justify-center items-center rounded-md">
                                <span className="self-center text-sm sm:text-base">Google</span>
                                <img src="/images/google.png" className="rounded-full h-5 w-5 sm:h-7 sm:w-7" alt="Google Icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;