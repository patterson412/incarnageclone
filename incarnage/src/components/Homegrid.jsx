import React from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';
import Latestgrid from "./Latestgrid";

function Homegrid() {
    const navigate = useNavigate();
    function handleChange() {
        navigate('/productsLayout/all');
    }
    return (
        <div className="grid grid-cols-1 grid-flow-row pb-10">

            <img className="w-full" src="images/CarnageVarsity.jpeg"></img>

            <div className="w-full flex flex-col md:flex-row">
                <img className="w-full md:w-3/5" src="images/CarnageClubDuo.webp"></img>
                <div className="w-full bg-black p-5 md:p-10 flex flex-col gap-3 items-start md:justify-center">
                    <span className="text-white font-bold text-2xl md:text-4xl">SHOP THE LATEST DROP</span>
                    <span className="text-zinc-400 text-sm">One click to browse all Latest Releases + Restocks</span>
                    <button type="button" onClick={handleChange} className="rounded-full bg-white p-4 w-40 font-light hover:opacity-70 transition ease-out duration-200">SHOP NOW</button>
                </div>
            </div>

            <Latestgrid />


        </div>
    );
}

export default Homegrid;