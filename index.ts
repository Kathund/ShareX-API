import { apiMessage, errorMessage, otherMessage } from "./src/logger";
import fileUpload, { UploadedFile } from "express-fileupload";
import express, { Request, Response } from "express";
import { url, key, PORT } from "./config.json";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const filesDir = join(__dirname, "src", "files");
if (!existsSync(filesDir)) {
  mkdirSync(filesDir);
}

const app = express();

try {
  app.use(fileUpload());

  app.post("/save/:name", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers["API-KEY"];
      if (apiKey !== key) {
        errorMessage("Invalid API key provided");
        return res
          .status(400)
          .send({ sucsess: false, message: "Invalid API key" });
      }
      apiMessage(req.path, "User is trying to save a file");

      const file = req.files?.file as UploadedFile;
      if (!file) {
        errorMessage("No file provided for upload");
        return res
          .status(400)
          .send({ sucsess: false, message: "No file provided" });
      }

      const fileName = req.params.name;
      const filePath = join(__dirname, "src", "files", fileName);
      if (existsSync(filePath)) {
        errorMessage(`File ${fileName} already exists`);
        return res
          .status(400)
          .json({ sucsess: false, message: `File ${fileName} already exists` });
      }

      await file.mv(filePath);

      apiMessage(req.path, `File ${fileName} saved successfully`);
      return res.status(200).json({
        sucsess: true,
        message: `File has been saved at ${url}/${fileName}`,
      });
    } catch (err) {
      errorMessage(err as string);
      return res
        .status(500)
        .json({ sucsess: false, message: "Internal server error" });
    }
  });

  app.get("/:name", async (req: Request, res: Response) => {
    try {
      const fileName = req.params.name;
      apiMessage(req.path, `User is trying to get a file - ${fileName}`);
      const filePath = join(__dirname, "src", "files", fileName);
      if (!existsSync(filePath)) {
        errorMessage(`File ${fileName} not found`);
        return res
          .status(404)
          .send({ sucsess: false, message: `File ${fileName} not found` });
      }

      apiMessage(req.path, `File ${fileName} found`);
      return res.sendFile(filePath);
    } catch (err) {
      errorMessage(err as string);
      return res
        .status(500)
        .send({ sucsess: false, message: "Internal server error" });
    }
  });

  app.listen(PORT, () => {
    otherMessage(`Server started on port ${PORT} @ http://localhost:${PORT}`);
  });
} catch (error) {
  errorMessage(`Error starting server: ${error}`);
}
