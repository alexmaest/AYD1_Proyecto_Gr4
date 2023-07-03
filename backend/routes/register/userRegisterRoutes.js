const nodemailer = require('nodemailer');
const express = require('express');
const db = require('../../database');
require('dotenv').config();
const app = express();

// POST route for user register
app.post('/', (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, municipality, department } = req.body;

  db.query(
    `SELECT m.municipio_id, d.departamento_id
    FROM tbl_cat_municipio m
    JOIN tbl_cat_departamento d ON m.departamento_id = d.departamento_id
    WHERE m.descripcion = ? AND d.descripcion = ?`,
    [municipality, department],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length === 0) {
          res.status(400).json({ error: 'Municipality or department not found' });
          return;
        }
        const { municipio_id, departamento_id } = results[0];
        db.query(
          'SELECT usuario_id FROM tbl_usuario WHERE correo = ?',
          [email],
          (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              if (result.length > 0) {
                res.status(400).json({ error: 'Email already in use' });
              } else {
                db.query(
                  'INSERT INTO tbl_usuario (correo, clave, habilitado, rol_usuario_id) VALUES (?, ?, 1, 2)',
                  [email, password],
                  (error, result) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                      const usuario_id = result.insertId;
                      db.query(
                        'INSERT INTO tbl_informacion_usuario (usuario_id, nombres, apellidos, no_celular, municipio) VALUES (?, ?, ?, ?, ?)',
                        [usuario_id, firstName, lastName, phoneNumber, municipio_id],
                        (error, result) => {
                          if (error) {
                            console.error(error);
                            res.status(500).json({ error: 'Internal Server Error' });
                          } else {
                            const codigoCupon = generateCouponCode();
                            db.query(
                              'INSERT INTO tbl_cupones (usuario_id, pedido_id, codigo) VALUES (?, NULL, ?)',
                              [usuario_id, codigoCupon],
                              (error, result) => {
                                if (error) {
                                  console.error(error);
                                  res.status(500).json({ error: 'Internal Server Error' });
                                } else {
                                  const userData = {
                                    correo: email,
                                    nombres: firstName,
                                    apellidos: lastName,
                                  };
                                  sendEmail(userData, codigoCupon, res);
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  );
});

// GET route for user register
app.get('/', (req, res) => {
  res.send('Information: Connected to user register page');
});

function sendEmail(userData, codigoCupon, res) {
  const { correo, nombres, apellidos } = userData;
  const message = `Te damos la bienvenida a nuestra plataforma, para celebrar te damos este código con un 15% de descuento en tu próximo pedido: ${codigoCupon}`
  const text = `Estimado(a) ${nombres} ${apellidos},\n\n${message}`;
  const subject = 'Bienvenido a AlChilazo';

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error: Sending email');
    } else {
      console.log('Information: Email sent', info.response);
      res.status(200).send('Information: Request Approved');
    }
  });
}

function generateCouponCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}

module.exports = app;
