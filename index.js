import express from "express";
import fileUpload from "express-fileupload";
import "./config.js";
import {
  uploadFile,
  getFiles,
  getFile,
  dowloadFile,
  getFileURL,
} from "./s3.js";

const app = express();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "dasd" });
});
app.get("/files", async (req, res) => {
  const result = await getFiles();
  return res.status(200).json({ msg: "success", result: result.Contents });
});
app.get("/files/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const result = await getFileURL(fileName);
  return res.status(200).json({ msg: "success", result: result });
});
app.get("/dowloadFiles/:fileName", async (req, res) => {
  const { fileName } = req.params;
  await dowloadFile(fileName);
  return res.status(200).json({ msg: "success" });
});

app.post("/files", async (req, res) => {
  try {
    if (req.files) {
      console.log(req.files.files.tempFilePath);
      const result = await uploadFile(req.files.files);
      const imageURL = await getFileURL(req.files.files.name);
      return res.status(200).json({ msg: "success", result, imageURL });
    } else {
      return res.status(404).send({
        msg: "Not found file",
        status: "error",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      msg: "error",
      error: e.toString(),
    });
  }
});

const PORT = process.env.PORT || 3000;

app.use(express.static("images"));
app.listen(PORT, () => {
  console.log("LISTEN ON PORT " + PORT);
});
