// server/app.js
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const port = 3001;

// const allowedOrigins = ["http://localhost:3000"];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(__dirname + "/uploads"));

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const filename = `${
      file.originalname.split(".")[0]
    }-${uniqueSuffix}.${file.originalname.split(".").pop()}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const modifiedFilePath = file.path.split("\\")[1];

  const filePath = `http://localhost:${port}/${modifiedFilePath}`;

  res.send({
    filename: file.originalname,
    filePath,
  });
});

app.use("/api", uploadRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
