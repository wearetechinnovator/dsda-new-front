const useSetTableFilter = () => {
    const key = "tableFilter";

    const setFilterState = (path, limit, activePage) => {
        const dataSet = JSON.parse(localStorage.getItem(key)) || [];
        const index = dataSet.findIndex(d => d.path === path);

        if (index !== -1) {
            dataSet[index] = { path, limit, activePage };
        } else {
            dataSet.push({ path, limit, activePage });
        }

        localStorage.setItem(key, JSON.stringify(dataSet));
    };

    const getFilterState = (path) => {
        const dataSet = JSON.parse(localStorage.getItem(key)) || [];
        return dataSet.find(d => d.path === path) || null;
    };

    return { setFilterState, getFilterState };
};

export default useSetTableFilter;

