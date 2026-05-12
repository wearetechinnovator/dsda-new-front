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



const TermsCondition = () => {

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
                    <h2 className="font-semibold text-xl">Terms & Conditions</h2>
                </div>
                <hr />
                <p>
                    These Terms &amp; Conditions govern the access and use of the
                    <strong>SWAGATA</strong> website and online portal operated by the
                    <strong>Digha Sankarpur Development Authority (DSDA)</strong>.
                    By accessing or using this website, users agree to comply with and be
                    bound by these Terms &amp; Conditions.
                </p>

                <h2>1. Definitions</h2>
                <ul>
                    <li><strong>“Authority”</strong> refers to the Digha Sankarpur Development Authority (DSDA).</li>
                    <li><strong>“SWAGATA”</strong> refers to the official Tourist Data Collection System of DSDA.</li>
                    <li>
                        <strong>“User”</strong> refers to any person accessing the website,
                        including hotels, lodges, accommodation providers, and authorized officials.
                    </li>
                    <li><strong>“Portal”</strong> refers to the SWAGATA online system and associated services.</li>
                </ul>

                <h2>2. Scope of Use</h2>
                <p>
                    The SWAGATA portal is intended solely for official use related to tourist
                    data collection and management within the jurisdiction of DSDA.
                    Unauthorized use of the portal is strictly prohibited.
                </p>

                <h2>3. User Registration and Access</h2>
                <ul>
                    <li>
                        Access to the SWAGATA portal is provided only to registered hotels,
                        lodges, and accommodation establishments authorized by DSDA.
                    </li>
                    <li>
                        Users are responsible for maintaining the confidentiality of their
                        login credentials.
                    </li>
                    <li>
                        Any activity carried out using a registered account shall be deemed
                        to have been performed by the authorized user.
                    </li>
                </ul>

                <h2>4. Data Entry and Accuracy</h2>
                <ul>
                    <li>
                        Users must ensure that all tourist information entered into the
                        portal is accurate, complete, and collected in accordance with
                        applicable laws and guidelines.
                    </li>
                    <li>
                        DSDA shall not be responsible for errors, omissions, or incorrect
                        data submitted by users.
                    </li>
                </ul>

                <h2>5. Tourist Registration Fee</h2>
                <ul>
                    <li>
                        As prescribed by DSDA, a tourist registration fee of
                        <strong>₹10 per tourist</strong> shall be collected by accommodation
                        providers during registration.
                    </li>
                    <li>
                        Collection and submission of such fees shall be carried out strictly
                        as per instructions issued by DSDA from time to time.
                    </li>
                </ul>

                <h2>6. Lawful Use</h2>
                <p>Users shall not:</p>
                <ul>
                    <li>Submit false, misleading, or unlawful information</li>
                    <li>Attempt unauthorized access to the portal or its systems</li>
                    <li>Disrupt, damage, or interfere with the website or related infrastructure</li>
                    <li>Use the portal for any purpose other than its intended official use</li>
                </ul>
                <p>
                    Any violation may result in suspension or termination of access and
                    legal action as applicable.
                </p>

                <h2>7. Data Ownership and Usage</h2>
                <ul>
                    <li>All data collected through the SWAGATA portal is the property of DSDA.</li>
                    <li>
                        DSDA reserves the right to use the data for administrative,
                        statistical, planning, and policy purposes.
                    </li>
                    <li>
                        Data may be shared with other government departments as required by law.
                    </li>
                </ul>

                <h2>8. System Availability</h2>
                <ul>
                    <li>
                        DSDA endeavors to ensure uninterrupted access to the portal;
                        however, it does not guarantee continuous availability.
                    </li>
                    <li>
                        The Authority shall not be liable for temporary downtime due to
                        maintenance, technical issues, or circumstances beyond its control.
                    </li>
                </ul>

                <h2>9. Intellectual Property</h2>
                <ul>
                    <li>
                        All content on the website, including text, logos, designs, and
                        software, is the property of DSDA unless otherwise stated.
                    </li>
                    <li>
                        Unauthorized reproduction, distribution, or modification of any
                        content is prohibited.
                    </li>
                </ul>

                <h2>10. Limitation of Liability</h2>
                <p>DSDA shall not be liable for:</p>
                <ul>
                    <li>Any direct or indirect loss arising from use or inability to use the portal</li>
                    <li>Data inaccuracies submitted by users</li>
                    <li>Technical failures or system interruptions</li>
                </ul>

                <h2>11. Modification of Terms</h2>
                <p>
                    DSDA reserves the right to modify these Terms &amp; Conditions at any
                    time without prior notice. Continued use of the portal after such
                    modifications constitutes acceptance of the revised terms.
                </p>

                <h2>12. Governing Law and Jurisdiction</h2>
                <p>
                    These Terms &amp; Conditions shall be governed by and construed in
                    accordance with the laws of India. Any disputes shall be subject to the
                    jurisdiction of the courts located in <strong>West Bengal</strong>.
                </p>

                <h2>13. Contact Information</h2>
                <p>
                    For any queries related to these Terms &amp; Conditions, users may
                    contact the <strong>Digha Sankarpur Development Authority (DSDA)</strong>
                    through official communication channels provided on the website.
                </p>


            </div>

        </main>
    )
}

export default TermsCondition;