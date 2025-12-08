import Cookies from "js-cookie";

// Get Date range hotel amenities charges;
const getDateRangeAminity = async ({m, y, url, token}) => {
    let bill_generate_last_month = m;  // September
    let bill_generate_last_year = y;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-based
    const currentYear = currentDate.getFullYear();

    let year = bill_generate_last_year;
    let month = bill_generate_last_month;

    const results = [];

    let i = 0;
    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
        // Start date: first day of month
        const startDate = new Date(year, month - 1, 1);
        // End date: last day of month (trick: 0th day of next month)
        const endDate = new Date(year, month, 0);

        
        if (month !== bill_generate_last_month || year !== bill_generate_last_year) {
            const req = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    hotelId: Cookies.get("hotelId"),
                    startDate: startDate.toLocaleDateString('en-CA'), // YYYY-MM-DD
                    endDate: endDate.toLocaleDateString('en-CA')
                })
            })
            const res = await req.json();

            results.push({
                year,
                month,
                totalAmount: res[0]?.totalAmount || 0,
                startDate: startDate.toLocaleDateString('en-CA'), // YYYY-MM-DD
                endDate: endDate.toLocaleDateString('en-CA')
            });
        }



        // Move to next month
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
    }


    return results;
}

export default getDateRangeAminity;

