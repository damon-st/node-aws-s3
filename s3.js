import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_BACKET_REGION,
  AWS_BUCKET_NAME,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "./config.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

const client = new S3Client({
  region: AWS_BACKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);

  return await client.send(command);
}

export async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });

  return await client.send(command);
}

export async function getFile(name) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: name,
  });

  return await client.send(command);
}
export async function dowloadFile(name) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: name,
  });

  const result = await client.send(command);
  console.log(result);
  result.Body.pipe(fs.createWriteStream(`./images/${name}`));
}
export async function getFileURL(name) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: name,
  });

  return await getSignedUrl(client, command, {
    expiresIn: 3600,
  });
}
