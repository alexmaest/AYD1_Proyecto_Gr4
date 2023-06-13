const express = require('express');
const multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');
const app = express();
const db = require('../../database');

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

// POST route for delivery register
app.post('/', upload.single('cv'), (req, res) => {
  const { name, lastName, email, phone, town, department, hasLicense, licenseType, hasVehicle, password } = req.body;
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

      const checkEmailQuery = 'SELECT COUNT(*) AS count FROM tbl_usuario WHERE correo = ?';
      db.query(checkEmailQuery, email, (error, results) => {
        if (error) {
          console.error('Error checking email existence: ', error);
          res.status(500).send('Error checking email existence');
        } else {
          const emailExists = results[0].count > 0;

          if (emailExists) {
            res.status(400).send('Email already exists');
          } else {
            const usuario = {
              correo: email,
              clave: password,
              habilitado: 0,
              rol_usuario_id: 3
            };

            // Insert the new user
            const queryUsuario = 'INSERT INTO tbl_usuario SET ?';

            db.query(queryUsuario, usuario, (error, results) => {
              if (error) {
                console.error('Error inserting new user: ', error);
                res.status(500).send('Error inserting new user');
              } else {
                console.log('New user inserted');

                // Get the usuario_id of the newly inserted user
                const usuarioId = results.insertId;
                const tieneVehiculo = hasVehicle === 'true' ? 1 : 0;
                const queryDepartamento = 'SELECT departamento_id FROM tbl_cat_departamento WHERE descripcion = ?';

                db.query(queryDepartamento, department, (error, results) => {
                  if (error) {
                    console.error('Error retrieving departamento_id: ', error);
                    res.status(500).send('Error retrieving departamento_id');
                  } else {
                    const departamentoId = results[0].departamento_id;

                    // Get the municipio_id for the given town and departamento_id
                    const queryMunicipio = 'SELECT municipio_id FROM tbl_cat_municipio WHERE descripcion = ? AND departamento_id = ?';

                    db.query(queryMunicipio, [town, departamentoId], (error, results) => {
                      if (error) {
                        console.error('Error retrieving municipio_id: ', error);
                        res.status(500).send('Error retrieving municipio_id');
                      } else {
                        const municipioId = results[0].municipio_id;

                        let tipoLicenciaId = null;

                        if (hasLicense === 'true') {
                          const queryLicencia = 'SELECT tipo_licencia_conducir_id FROM tbl_cat_tipo_licencia_conducir WHERE descripcion = ?';

                          db.query(queryLicencia, licenseType, (error, results) => {
                            if (error) {
                              console.error('Error retrieving tipo_licencia_conducir_id: ', error);
                              res.status(500).send('Error retrieving tipo_licencia_conducir_id');
                            } else {
                              tipoLicenciaId = results[0].tipo_licencia_conducir_id;

                              const solicitudRepartidor = {
                                nombres: name,
                                apellidos: lastName,
                                no_celular: phone,
                                municipio_id: municipioId,
                                tipo_licencia_id: tipoLicenciaId,
                                fecha_solicitud: new Date(),
                                estado_solicitud_id: 1,
                                usuario_id: usuarioId,
                                documento_url: data.Location || null,
                                tiene_vehiculo: tieneVehiculo
                              };

                              const querySolicitudRepartidor = 'INSERT INTO tbl_solicitud_repartidor SET ?';

                              db.query(querySolicitudRepartidor, solicitudRepartidor, (error, results) => {
                                if (error) {
                                  console.error('Error inserting new solicitud_repartidor record: ', error);
                                  res.status(500).send('Error inserting new solicitud_repartidor record');
                                } else {
                                  console.log('New solicitud_repartidor record inserted');
                                  res.send('Information: Request sent');
                                }
                              });
                            }
                          });
                        } else {
                          const solicitudRepartidor = {
                            nombres: name,
                            apellidos: lastName,
                            no_celular: phone,
                            municipio_id: municipioId,
                            tipo_licencia_id: null,
                            fecha_solicitud: new Date(),
                            estado_solicitud_id: 1,
                            usuario_id: usuarioId,
                            documento_url: data.Location || null,
                            tiene_vehiculo: tieneVehiculo
                          };

                          const querySolicitudRepartidor = 'INSERT INTO tbl_solicitud_repartidor SET ?';
                          db.query(querySolicitudRepartidor, solicitudRepartidor, (error, results) => {
                            if (error) {
                              console.error('Error inserting new solicitud_repartidor record: ', error);
                              res.status(500).send('Error inserting new solicitud_repartidor record');
                            } else {
                              console.log('New solicitud_repartidor record inserted');
                              res.send('Information: Request sent');
                            }
                          });
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });
});

// GET route for delivery register
app.get('/', (req, res) => {
  res.send('Information: Connected to delivery register page');
});

module.exports = app;