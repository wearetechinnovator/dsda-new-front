import useMyToaster from "./useMyToaster";

const usePayment = () => {
    const toast = useMyToaster();
    
    const payment = async (id, type) => {
        const req = await fetch(process.env.REACT_APP_MASTER_API + "/pay-gateway/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id, type})
        });
        const res = await req.json();

        if (req.status !== 200) {
            return toast("Unable to process payment", 'error')
        }

        window.location.href = res.url;

    }

    return { payment }
}

export default usePayment;
