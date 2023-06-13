const express = require('express');
const multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');
const app = express();
const db = require('../../database');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
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
app.post('/', upload.array('pdfFiles'), (req, res) => {
  const { name, email, description, type, town, department, zone, password } = req.body;
  /*console.log(req.body);
  console.log(req.files);*/

  const uploadPromises = [];
  req.files.forEach(file => {
    const { originalname, path } = file;
    const fileContent = fs.readFileSync(path);
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: originalname,
      Body: fileContent
    };

    const uploadPromise = s3.upload(params).promise();
    uploadPromises.push(uploadPromise);
  });

  Promise.all(uploadPromises)
    .then(results => {
      console.log('Information: Files uploaded to AWS S3');
      const fileUrls = results.map(result => result.Location);

      const checkEmailQuery = 'SELECT COUNT(*) AS count FROM tbl_usuario WHERE correo = ?';
      db.query(checkEmailQuery, email, (error, results) => {
        if (error) {
          console.error('Error: checking email existence: ', error);
          res.status(500).send('Error: checking email existence');
        } else {
          const emailExists = results[0].count > 0;

          if (emailExists) {
            res.status(400).send('Email already exists');
          } else {
            const insertUserQuery = 'INSERT INTO tbl_usuario (correo, clave, habilitado, rol_usuario_id) VALUES (?, ?, ?, ?)';
            const usuarioValues = [email, password, 0, 4];

            db.query(insertUserQuery, usuarioValues, (error, results) => {
              if (error) {
                console.error('Error: inserting new user: ', error);
                res.status(500).send('Error: inserting new user');
              } else {
                const usuarioId = results.insertId;

                const getCategoryIdQuery = 'SELECT categoria_empresa_id FROM tbl_cat_categoria_empresa WHERE descripcion = ?';
                db.query(getCategoryIdQuery, type, (error, results) => {
                  if (error) {
                    console.error('Error: retrieving category ID: ', error);
                    res.status(500).send('Error: retrieving category ID');
                  } else {
                    const categoryId = results[0].categoria_empresa_id;

                    const getDepartmentIdQuery = 'SELECT departamento_id FROM tbl_cat_departamento WHERE descripcion = ?';
                    db.query(getDepartmentIdQuery, department, (error, results) => {
                      if (error) {
                        console.error('Error: retrieving department ID: ', error);
                        res.status(500).send('Error: retrieving department ID');
                      } else {
                        const departmentId = results[0].departamento_id;

                        const getMunicipalityIdQuery = 'SELECT municipio_id FROM tbl_cat_municipio WHERE descripcion = ?';
                        db.query(getMunicipalityIdQuery, town, (error, results) => {
                          if (error) {
                            console.error('Error: retrieving municipality ID: ', error);
                            res.status(500).send('Error: retrieving municipality ID');
                          } else {
                            const municipalityId = results[0].municipio_id;

                            const insertCompanyRequestQuery = 'INSERT INTO tbl_solicitud_empresa (usuario_id, nombre, descripcion, categoria_empresa_id, zona, municipio_id, fecha_solicitud, estado_solicitud_id) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)';
                            const companyRequestValues = [usuarioId, name, description, categoryId, zone, municipalityId, 1];

                            db.query(insertCompanyRequestQuery, companyRequestValues, (error, results) => {
                              if (error) {
                                console.error('Error: inserting new company request: ', error);
                                res.status(500).send('Error: inserting new company request');
                              } else {
                                const requestId = results.insertId;

                                fileUrls.forEach(url => {
                                  const insertDocumentQuery = 'INSERT INTO tbl_documentos_x_empresa (solicitud_empresa_id, documento_url) VALUES (?, ?)';
                                  const documentValues = [requestId, url];

                                  db.query(insertDocumentQuery, documentValues, (error, results) => {
                                    if (error) {
                                      console.error('Error: inserting documents: ', error);
                                    } else {
                                      //console.log('Document inserted');
                                    }
                                  });
                                });
                                console.log('Information: New company request inserted');
                                res.send('Information: Request sent');
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    })
    .catch(error => {
      console.error('Error: uploading files to AWS S3: ', error);
      res.status(500).send('Error: uploading files');
    });
});

// GET route for company register
app.get('/', (req, res) => {
  res.send('Information: Connected to company register page');
});

module.exports = app;
