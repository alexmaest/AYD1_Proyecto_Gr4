const express = require('express');
const app = express();
const db = require('../../database');

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
          res.status(400).json({ error: 'Municipipality or department not found' });
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
                            res.json({ message: 'User added succesfully' });
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

module.exports = app;
