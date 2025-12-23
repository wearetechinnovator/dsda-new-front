import useMyToaster from "./useMyToaster";
import Cookies from 'js-cookie'

const usePayment = () => {
    const toast = useMyToaster();
    
    const payment = async (id, type) => {
        const req = await fetch(process.env.REACT_APP_MASTER_API + "/pay-gateway/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id, type, token: Cookies.get("token")})
        });
        const res = await req.json();

        if (req.status !== 200) {
            return toast("Unable to process payment", 'error')
        }

        window.location.href = res.redirectURI;

    }

    return { payment }
}

export default usePayment;
