import { storage } from "./firebase.js"; // Ensure this imports the correctly initialized storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const imgupl = async (file) => {
    if (!file) {
        throw new Error("No file provided for upload");
    }

    const timestamp = new Date().toISOString(); // Using ISO string for better formatting
    const storageRef = ref(storage, `images/${timestamp}_${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject("Upload failed: " + error.message); // Provide a more meaningful error message
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        reject("Failed to get download URL: " + error.message); // Handle URL fetching error
                    });
            }
        );
    });
};

export { imgupl };

