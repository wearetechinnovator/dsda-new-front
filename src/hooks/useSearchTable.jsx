import { useCallback } from "react";

const useSearchTable = () => {
    const searchTable = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        const rows = document.querySelectorAll(".list__table tbody tr");

        rows.forEach((row) => {
            const cols = row.querySelectorAll("td");
            let found = false;

            cols.forEach((col, index) => {
                if (index !== 0 && col.innerHTML.toLowerCase().includes(value)) {
                    found = true;
                }
            });

            row.style.display = found ? "" : "none";
        });
    }, []);

    return searchTable;
};

export default useSearchTable;
