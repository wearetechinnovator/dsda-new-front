import { useEffect, useState } from "react";
import { Icons } from "../../helper/icons";


const GuestEntryDocUpload = ({ forId, idProof, onRemove }) => {
    const [imgSrc, setImgSrc] = useState(null)

    useEffect(() => {
        setImgSrc(idProof);
    }, [idProof])

    return (
        <label htmlFor={forId} className="upload__label relative group cursor-pointer">
            {imgSrc ? (
                <>
                    <img src={imgSrc} alt="Uploaded" className="w-[70px] h-[70px] rounded" />
                    <div
                        className="absolute inset-0 hidden group-hover:grid place-items-center bg-[#0000004d]"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove?.();
                        }}
                    >
                        <Icons.CLOSE className="remove__upload__label" onClick={() => {
                            onRemove();
                            setImgSrc(null);
                        }} />
                    </div>
                </>
            ) : (
                <>
                    <Icons.UPLOAD_IMAGE />
                    <span>Upload Photo</span>
                    <span className="text-[9px] text-red-400">Max size 200kb</span>
                </>
            )}
        </label>
    );
};

export default GuestEntryDocUpload;
