import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import formidable from "formidable";
import short from "short-uuid";

import * as admin from "firebase-admin";

async function runMiddleware<T>(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    finish: (result: T) => void
  ) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: T | Error) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");

// TODO: better way to manage this
let app: admin.app.App;
const firebaseAdmin = (
  _req: NextApiRequest,
  _res: NextApiResponse,
  finish: (res: admin.app.App) => void
) => {
  if (!app && admin.apps[0]) {
    app = admin.apps[0];
  }
  if (admin.apps.length < 1) {
    app = admin.initializeApp(
      {
        credential: admin.credential.cert(adminConfig as admin.ServiceAccount),
        databaseURL: process.env.FIREABSE_DB_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      },
      "stoob-queue"
    );
  }
  return finish(app);
};

const firebaseAuth = async (
  req: NextApiRequest,
  _res: NextApiResponse,
  finish: (uid: string) => void
) => {
  const idToken = (req.headers.authorization ?? "").split(" ")[1];
  const { uid } = await app.auth().verifyIdToken(idToken);

  return finish(uid);
};

const translator = short();

interface PostForm {
  name: string;
  address: string;
  "location[latitude]": string;
  "location[longitude]": string;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const fbase = await runMiddleware<admin.app.App>(req, res, firebaseAdmin);
    // this verifies auth
    await runMiddleware<string>(req, res, firebaseAuth);

    const storage = fbase.storage();
    const firestore = fbase.firestore();

    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    const data = await new Promise<{
      fields: PostForm;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(
        req,
        (err: Error | undefined, fields: PostForm, files: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve({ fields, files });
        }
      );
    });
    const {
      fields,
      files: { photo },
    } = data;

    // TODO: generate thumbnail?
    const fileKey = translator.new();
    const filename = `${fileKey}.png`;
    const bucket = storage.bucket();

    const photoBuf = await sharp(photo.path)
      .resize({ width: 350 })
      .png({
        quality: 80,
      })
      .toBuffer();
    const metadata = { postId: 1 };
    const writeStream = bucket.file(`photos/${filename}`).createWriteStream({
      metadata,
    });

    await new Promise((resolve, reject) => {
      writeStream.on("error", (err) => {
        reject(err);
      });
      writeStream.on("finish", () => {
        resolve({});
      });
      writeStream.end(photoBuf);
    });

    const postRef = firestore.collection("posts_pending").doc(fileKey);
    const postRecord = {
      id: fileKey,
      name: fields.name,
      created_at: new Date(),
      address: fields.address,
      location: new admin.firestore.GeoPoint(
        parseFloat(fields["location[latitude]"]),
        parseFloat(fields["location[longitude]"])
      ),
      photo_path: `photos/${filename}`,
    };
    await postRef.set(postRecord);

    res.statusCode = 201;
    res.json({
      ...postRecord,
      location: {
        latitude: postRecord.location.latitude,
        longitude: postRecord.location.longitude,
      },
    });
  } else {
    res.statusCode = 404;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
