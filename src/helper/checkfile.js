// Check file before upload
/**
 * @params file: fileObject
 * @params type: file type in array
 * @params size: file size in mb
 */

const checkfile = (file, type = ["jpg", "png", 'jpeg'], size = 3) => {
    const INIT_SIZE = 1048576; //1MB in bytes;
    const FILE = file;


    return new Promise((resolve, reject) => {
        if (file === "" || file === undefined || file === null) {
            resolve("Select your file");
        }

        const filename = FILE.name;
        if (type.some((value) => filename.endsWith(value))) {

            if (FILE.size <= (INIT_SIZE * size)) {
                resolve(true);
            } else {
                resolve(
                    "Invalid filesize. Uploaded: " +
                    Math.round(FILE.size / 1024) + " KB, Allowed: " +
                    (parseInt(Math.round((INIT_SIZE * size) / 1024)) - 5) + " KB"
                );
            }

        } else {
            resolve("Only " + type.join(", ") + " files are allowed");
        }

    })
}

export default checkfile;

