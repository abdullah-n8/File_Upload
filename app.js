// server/app.js
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: "./uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);

  if (!file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const filePath = path.join(__dirname, file.path);

  res.sendFile(filePath);
});

app.use("/api", uploadRouter);

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
