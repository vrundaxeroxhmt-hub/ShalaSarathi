# Server Authentication Architecture & Firebase Admin SDK Verification Specification

## 1. Overview
The ShalaSarathi backend API (`server.ts`) provides full-stack Node.js Express endpoints, including `/api/gemini/generate-lesson-plan`.
Currently, client applications call this endpoint using HTTP `POST`.

To protect server endpoints against unauthenticated overuse or abuse without exposing service keys to client code, the backend will verify Firebase ID tokens using the `firebase-admin` SDK.

---

## 2. Security Principles
1. **No Client Secrets:** Never place Firebase Admin service-account credentials, private keys, or the `GEMINI_API_KEY` into client-side bundles or repository commits.
2. **Bearer Token Authentication:** Clients include the Firebase ID Token in the `Authorization` header:
   ```http
   Authorization: Bearer <FIREBASE_ID_TOKEN>
   ```
3. **Graceful Fallback:** If offline or development mode is active without configured service accounts, the GCERT curriculum fallback engine handles requests safely without breaking local development.

---

## 3. Required Server Setup (Production Environment)

### Step 1: Install `firebase-admin` package
```bash
npm install firebase-admin
```

### Step 2: Configure Environment Variables
Set the following environment variables in your secure server hosting platform (e.g. GCP / Railway / Render / Vercel):
* `FIREBASE_PROJECT_ID` = `steel-proton-7t8c4`
* `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-...@steel-proton-7t8c4.iam.gserviceaccount.com`
* `FIREBASE_PRIVATE_KEY` = `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
* `GEMINI_API_KEY` = `"your-gemini-api-key"`

---

## 4. Express Authentication Middleware Reference Implementation

```typescript
import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

// Initialize Firebase Admin SDK lazily if environment variables exist
if (!admin.apps.length && process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export async function requireFirebaseAuth(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Authorization header.',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    if (admin.apps.length) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      return next();
    } else {
      // In local development without service account keys, pass through with warning
      console.warn('Firebase Admin SDK unconfigured. Request processed in dev fallback mode.');
      return next();
    }
  } catch (error) {
    console.error('Firebase ID token verification failed:', error);
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or expired Firebase ID token.',
    });
  }
}
```

---

## 5. Applying Middleware to Endpoints
```typescript
app.post("/api/gemini/generate-lesson-plan", requireFirebaseAuth, async (req, res) => {
  // Secured handler execution
});
```
