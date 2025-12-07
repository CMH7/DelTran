// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBSvHqhgJQ1QdAM3X1xAtIkuHesSWViCSo",
	authDomain: "deltran-b2bea.firebaseapp.com",
	projectId: "deltran-b2bea",
	storageBucket: "deltran-b2bea.firebasestorage.app",
	messagingSenderId: "938462410768",
	appId: "1:938462410768:web:58d4740fbb7160fa1cf295",
	measurementId: "G-HY53ME8NKZ",
};

// Initialize Firebase
const fbaseClientApp = initializeApp(firebaseConfig);

export const fbaseClientFstore = getFirestore(fbaseClientApp);
