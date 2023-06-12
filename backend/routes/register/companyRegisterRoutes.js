const express = require('express');
const multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');
const app = express();

const uploadFolder = 'uploads/';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// AWS S3 configuration
const AWS_BUCKET_NAME = 'alchilazo-bucket';
const AWS_BUCKET_REGION = 'us-east-2';
const AWS_PUBLIC_KEY = 'AKIAQX6ZSICQ737CYEOE';
const AWS_SECRET_KEY = '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';

const s3 = new AWS.S3({
  accessKeyId: AWS_PUBLIC_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION
});

// POST route for company register
app.post('/', upload.single('file'), (req, res) => {
  const { name, email, description, type, town, department, zone, file, password } = req.body;
  const { filename, path } = req.file;
  console.log(req.body);
  console.log(req.file);

  // Upload file to AWS S3 bucket
  const fileContent = fs.readFileSync(path);

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
    Body: fileContent
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file to AWS S3: ', err);
      res.status(500).send('Error uploading file');
    } else {
      console.log('File uploaded to AWS S3');
      res.send('Information: Request sent');
    }
  });
});

// GET route for company register
app.get('/', (req, res) => {
  res.send('Information: Connected to company register page');
});

module.exports = app;
