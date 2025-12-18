const downloadBase64 = (base64Data, filename = "Notice") => {
    // Handle both raw base64 and data URL
    const isDataUrl = base64Data.startsWith("data:");
    
    let mimeType = "application/octet-stream";
    let base64 = base64Data;

    if (isDataUrl) {
        const parts = base64Data.split(",");
        mimeType = parts[0].match(/data:(.*);base64/)[1];
        base64 = parts[1];
    }

    // Add file extension if missing
    if (!filename.includes(".")) {
        const extMap = {
            "application/pdf": "pdf",
            "image/png": "png",
            "image/jpeg": "jpg",
            "image/webp": "webp"
        };
        filename += "." + (extMap[mimeType] || "bin");
    }

    // Base64 → Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: mimeType });

    // Download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
};

export default downloadBase64;
