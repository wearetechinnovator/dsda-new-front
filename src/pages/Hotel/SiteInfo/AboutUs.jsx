import "../../../assets/css/login.css"
import Logo from '../../../assets/images/b_logo.png';
import { useState } from "react";
import useLoginShake from "../../../hooks/useLoginShake";
import { useNavigate } from 'react-router-dom';
import useMyToaster from "../../../hooks/useMyToaster";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Admin/Loading'
import { Icons } from "../../../helper/icons";



const AboutUs = () => {

    return (
        <main className='site__info__main'>
            <video id="video-background" autoPlay loop muted className="absolute w-full h-full object-cover z-0">
                <source src="/welcome.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <img src={Logo} alt="Logo.png" className='mb-5 z-10 b__logo' />
            <div className="login__box flex flex-col z-10 site__info">
                <div className="top__bar">
                    <Link to={"/"} className="back__button">
                        <Icons.BACK />
                    </Link>
                    <h2 className="font-semibold text-xl">About Us</h2>
                </div>
                <hr />
                <p>
                    Govt. of West Bengal constituted Digha Development Authority (DDA) in the year 1993 as a Statutory Body under the Urban Development Department (Town & Country Planning Branch). Later, in the year 2003, Sankarpur was included, and the Authority was renamed as Digha Sankarpur Development Authority (DSDA) resulting in an area of 8,752.66 acres of land comprising 42 Mouzas adjoining the sea coast area.Afterwards, Mandarmoni & Tajpur, having 9 (Nine) mouzas comprising a total area of 8467.92 acres, have been brought under the jurisdiction of DSDA for the purpose of development of Coastal Tourism and orderly development in those areas resulting in an area of 17,220.04 acres to be the "Planning Area" under the jurisdiction of DSDA.Digha Sankarpur Development Authority continued to add to the tourism infrastructure on the one hand, and strengthening the existing infrastructure within its jurisdiction on the other hand, apart from developing road connectivity for the rural people, vis-à-vis to facilitate smooth approach to the tourist destinations.Major thrust has also been given in augmenting Tourism infrastructure in the area.
                </p>
            </div>

        </main>
    )
}

export default AboutUs;