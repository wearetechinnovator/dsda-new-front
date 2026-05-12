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



const ContactUs = () => {

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
                    <h2 className="font-semibold text-xl">Contact Us</h2>
                </div>
                <hr />

                <ul>
                    <li>
                        <span className="font-semibold">Email Address:</span>
                        <a href="mailto:eodsda@gmail.com"> eodsda@gmail.com</a>
                    </li>
                    <li className="mt-2">
                        <span className="font-semibold">Contact No: </span>
                        <a href="tel:7501420600"> 7501420600</a>
                    </li>
                    <li>
                        <p className="font-semibold">Address</p>
                        <p>
                            DIGHA SANKARPUR DEVELOPMENT AUTHORITY PO, NEW DIGHA DIST PURBA MEDINIPUR, CONTAI WEST BENGAL - INDIA - 721463
                        </p>
                    </li>
                </ul>
            </div>

        </main>
    )
}

export default ContactUs;