import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT!
)

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      })

export const adminDb = getFirestore(adminApp)
