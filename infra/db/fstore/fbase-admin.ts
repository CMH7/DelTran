import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

export const fbaseAdminApp =
	getApps().length === 0
		? initializeApp({
				credential: cert(serviceAccount),
			})
		: getApps()[0];

export const fbaseAdminFstore = getFirestore(fbaseAdminApp);
