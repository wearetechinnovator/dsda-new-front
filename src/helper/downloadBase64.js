const downloadBase64 = (data, filename="notice") => {
    // Example: base64 data and filename
    const base64Data = data; // your base64 string
    const fileName = filename; 
    const contentType = "application/pdf"; // change according to your file type

    // Convert base64 -> Blob
    const byteCharacters = atob(base64Data.split(",")[1]); // remove "data:*/*;base64," if exists
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default downloadBase64;
