import "../../../assets/css/login.css"
import Logo from '../../../assets/images/b_logo.png';
import { Link } from 'react-router-dom';
import { Icons } from "../../../helper/icons";



const ProductDescription = () => {

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
                    <h2 className="font-semibold text-xl">Product Description</h2>
                </div>
                <hr />
                <p>The Government of West Bengal, through the Digha Sankarpur Development Authority (DSDA), has developed SWAGATA, a centralized Tourist Data Collection System as part of its ongoing efforts to strengthen tourism infrastructure and ensure orderly development within its coastal planning area.</p>
                <p>SWAGATA has been introduced to maintain a systematic, transparent, and real-time record of tourist inflow across the DSDA jurisdiction, including Digha, Sankarpur, Mandarmoni, and Tajpur. Under this system, hotels, lodges, and other accommodation establishments operating within the DSDA area are required to collect tourist information through an official online portal provided by the Authority. A nominal fee of ₹10 per tourist is collected by the establishments as prescribed, while registering tourist details on the SWAGATA portal.</p>
                <p>The data collected through SWAGATA enables DSDA to monitor tourist movement, assess seasonal inflow patterns, and plan infrastructure development such as roads, civic amenities, safety measures, and other tourism-related facilities. The system supports evidence-based planning and policy formulation, ensuring sustainable growth of coastal tourism while maintaining regulatory compliance.</p>
                <p>
                    SWAGATA thus serves as an important digital initiative of DSDA, contributing to efficient tourism governance, improved data accuracy, and the overall development of tourism infrastructure in the region.
                </p>
            </div>

        </main>
    )
}

export default ProductDescription;