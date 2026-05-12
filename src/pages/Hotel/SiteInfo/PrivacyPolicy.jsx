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



const PrivacyPolicy = () => {

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
                    <h2 className="font-semibold text-xl">Privacy Policy</h2>
                </div>
                <hr />
                <p>
                    The <strong>Digha Sankarpur Development Authority (DSDA)</strong> is
                    committed to protecting the privacy of users accessing the
                    <strong>SWAGATA</strong> website and portal. This Privacy Policy outlines
                    how information is collected, used, stored, and protected when users
                    interact with the website.
                </p>

                <h2>1. Information We Collect</h2>

                <p>The SWAGATA portal may collect the following types of information:</p>

                <h3>a) Personal Information</h3>
                <p>
                    Collected through authorized hotels, lodges, and accommodation providers
                    for tourism regulation purposes, including but not limited to:
                </p>
                <ul>
                    <li>Tourist name</li>
                    <li>Age and gender</li>
                    <li>Address and contact details</li>
                    <li>Identity details (as required by applicable rules)</li>
                    <li>Check-in and check-out dates</li>
                </ul>


                <p>
                    This information is used only for system monitoring, analytics, and
                    security purposes.
                </p>

                <h2>2. Purpose of Information Collection</h2>
                <ul>
                    <li>Maintaining an accurate record of tourist inflow</li>
                    <li>Tourism planning and infrastructure development</li>
                    <li>Policy formulation and administrative monitoring</li>
                    <li>Ensuring compliance with applicable laws and regulations</li>
                    <li>Improving the performance, security, and functionality of the portal</li>
                </ul>

                <h2>3. Use and Disclosure of Information</h2>
                <ul>
                    <li>
                        Personal data collected through SWAGATA is used strictly for official
                        and administrative purposes of DSDA.
                    </li>
                    <li>
                        Information is <strong>not shared, sold, or disclosed</strong> to any
                        third party except:
                    </li>
                </ul>
                <ul>
                    <li>When required by law or court order</li>
                    <li>For authorized government reporting or audits</li>
                    <li>To other government departments for official purposes</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>
                    DSDA takes reasonable and appropriate technical and administrative
                    measures to safeguard information against:
                </p>
                <ul>
                    <li>Unauthorized access</li>
                    <li>Loss, misuse, or alteration</li>
                    <li>Data breaches</li>
                </ul>

                <p>
                    Access to the system is restricted to authorized personnel and registered
                    establishments only.
                </p>

                <h2>5. Data Retention</h2>
                <p>
                    Tourist data is retained only for the period required to fulfill
                    statutory, administrative, and policy objectives, or as mandated by
                    applicable laws and government guidelines.
                </p>

                <h2>6. Cookies</h2>
                <p>
                    The SWAGATA website may use cookies to enhance user experience and
                    analyze website traffic. Cookies do not collect personally identifiable
                    information. Users may disable cookies through their browser settings if
                    desired.
                </p>

                <h2>7. User Responsibility</h2>
                <p>Hotels and accommodation providers are responsible for ensuring that:</p>
                <ul>
                    <li>Tourist data entered into the SWAGATA portal is accurate and lawful</li>
                    <li>Data is collected in accordance with applicable rules and guidelines</li>
                    <li>Login credentials are kept confidential</li>
                </ul>

                <h2>8. External Links</h2>
                <p>
                    The website may contain links to external websites. DSDA is not
                    responsible for the privacy practices or content of such external sites.
                </p>

                <h2>9. Changes to This Privacy Policy</h2>
                <p>
                    DSDA reserves the right to modify or update this Privacy Policy at any
                    time without prior notice. Changes will be effective immediately upon
                    posting on the website.
                </p>

                <h2>10. Contact Information</h2>
                <p>
                    For any questions or concerns regarding this Privacy Policy or data
                    handling practices, users may contact the
                    <strong>Digha Sankarpur Development Authority (DSDA)</strong> through
                    official communication channels provided on the website.
                </p>
            </div>

        </main>
    )
}

export default PrivacyPolicy;