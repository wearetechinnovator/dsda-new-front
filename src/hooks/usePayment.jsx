
const usePayment = () => {
    const payment = (id, type) => {
        console.log(id, type)
    }

    return { payment }
}

export default usePayment;
