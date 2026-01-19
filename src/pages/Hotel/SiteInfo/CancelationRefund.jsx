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



const CancelationRefund = () => {

    return (
        <main className='site__info__main'>
            <video id="video-background" autoPlay loop muted className="absolute w-full h-full object-cover z-0">
                <source src="/welcome.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <img src={Logo} alt="Logo.png" className='mb-5 z-10 b__logo' />
            <div className="login__box flex flex-col z-10 site__info">
                <div className="flex items-center gap-2">
                    <Link to={"/"} className="text-gray-700 hover:text-gray-700  w-[20px] h-[20px] bg-white grid place-items-center rounded-full">
                        <Icons.BACK />
                    </Link>
                    <h2 className="font-semibold text-xl">Cancellation & Refund Policy</h2>
                </div>
                <hr />
                <p>
                    The <strong>SWAGATA</strong> portal is an official system of the
                    <strong>Digha Sankarpur Development Authority (DSDA)</strong> for the
                    collection of tourist data and prescribed tourist registration fees
                    through authorized accommodation providers.
                </p>

                <h2>1. Nature of Fee Collection</h2>
                <ul>
                    <li>
                        The tourist registration fee of <strong>₹10 per tourist</strong> is
                        collected by hotels, lodges, and accommodation establishments at the
                        time of check-in.
                    </li>
                    <li>
                        The collected fees are <strong>remitted by the establishments to
                            DSDA on a monthly basis</strong>, as per guidelines issued by the
                        Authority.
                    </li>
                    <li>
                        The fee is statutory in nature and collected for administrative and
                        tourism development purposes.
                    </li>
                </ul>

                <h2>2. Cancellation Policy</h2>
                <ul>
                    <li>
                        Once tourist details are registered on the SWAGATA portal,
                        <strong>cancellation of the entry is not permitted</strong>.
                    </li>
                    <li>
                        Hotels are advised to ensure accuracy of details before submission,
                        as all entries are treated as final records.
                    </li>
                </ul>

                <h2>3. Refund Policy</h2>
                <ul>
                    <li>
                        <strong>No refund</strong> shall be applicable for the tourist
                        registration fee once it has been collected from the tourist and
                        recorded in the SWAGATA system.
                    </li>
                    <li>
                        DSDA shall not be responsible for any refund claims made by tourists
                        to hotels or accommodation providers.
                    </li>
                    <li>Refunds shall not be applicable in cases of:</li>
                </ul>

                <ul>
                    <li>Change or cancellation of travel plans</li>
                    <li>Early departure or non-arrival</li>
                    <li>Incorrect or duplicate entries made by the hotel</li>
                    <li>Clerical or operational errors at the establishment level</li>
                </ul>

                <h2>4. Exceptional Circumstances</h2>
                <ul>
                    <li>
                        In the event of a proven technical error in the SWAGATA portal
                        resulting in duplicate or erroneous records, DSDA may examine the
                        matter on a case-to-case basis.
                    </li>
                    <li>
                        Any decision taken by DSDA in such cases shall be final and binding.
                    </li>
                </ul>

                <h2>5. Responsibility of Accommodation Providers</h2>
                <p>Hotels and accommodation establishments are solely responsible for:</p>
                <ul>
                    <li>Collecting the prescribed tourist registration fee</li>
                    <li>Ensuring correct data entry prior to submission</li>
                    <li>Maintaining proper records for audit and verification</li>
                    <li>
                        Remitting the collected fees to DSDA within the prescribed monthly
                        timeline
                    </li>
                </ul>

                <p>
                    DSDA shall not be liable for disputes between tourists and accommodation
                    providers regarding the fee.
                </p>

                <h2>6. Policy Amendments</h2>
                <p>
                    DSDA reserves the right to amend or update this Cancellation &amp; Refund
                    Policy at any time without prior notice. Changes shall be effective
                    immediately upon publication on the SWAGATA website.
                </p>

                <h2>7. Contact Information</h2>
                <p>
                    For any clarification regarding this policy, users may contact the
                    <strong>Digha Sankarpur Development Authority (DSDA)</strong> through
                    official communication channels available on the SWAGATA website.
                </p>
            </div>

        </main>
    )
}

export default CancelationRefund;