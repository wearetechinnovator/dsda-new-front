import { useState } from "react";
import useMyToaster from "./useMyToaster";
import Cookies from 'js-cookie'




const usePayment = () => {
    const toast = useMyToaster();
    const [payLoading, setPayLoading] = useState(false);
    
    const payment = async (id, type) => {
        setPayLoading(true);
        const req = await fetch(process.env.REACT_APP_MASTER_API + "/pay-gateway/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id, type, token: Cookies.get("token")})
        });
        const res = await req.json();

        if (req.status !== 200) {
            return toast(res.err, 'error')
        }

        window.location.href = res.redirectUrl;

    }

    return { payment, payLoading}
}

export default usePayment;
