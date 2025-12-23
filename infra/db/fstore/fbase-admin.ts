import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
	throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required");
}

const serviceAccount = JSON.parse(serviceAccountKey);

export const fbaseAdminApp =
	getApps().length === 0
		? initializeApp({
				credential: cert(serviceAccount),
			})
		: getApps()[0];

export const fbaseAdminFstore = getFirestore(fbaseAdminApp);
