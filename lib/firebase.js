import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCU0AihARXIPnkk0Y2tDxx4VECYg7ri-h4",
    authDomain: "cta-bus-f1ed1.firebaseapp.com",
    projectId: "cta-bus-f1ed1",
    storageBucket: "cta-bus-f1ed1.appspot.com",
    messagingSenderId: "939249505621",
    appId: "1:939249505621:web:e8e271571618d00bb20bdc",
    measurementId: "G-YLL8NLT1SN",
};

const app = initializeApp(firebaseConfig);

export function getProviderForProviderId(id) {
    const providers = {
        password: undefined,
        phone: undefined,
        "google.com": googleAuthProvider,
        "facebook.com": undefined,
        "twitter.com": undefined,
        "github.com": undefined,
        "apple.com": undefined,
        "yahoo.com": undefined,
        "hotmail.com": undefined,
    };

    if (providers.hasOwnProperty(id)) {
        return providers[id];
    }
}

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
