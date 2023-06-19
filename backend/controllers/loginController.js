const db = require('../database');
const jwt = require('jsonwebtoken');

// Login
exports.login = (req, res) => {
  const { correo, clave } = req.body;

  const query = `
    SELECT u.usuario_id, u.correo, u.habilitado, r.descripcion AS rol, u.rol_usuario_id
    FROM tbl_usuario u
    INNER JOIN tbl_rol_usuario r ON u.rol_usuario_id = r.rol_usuario_id
    WHERE u.correo = ? AND u.clave = ?;
  `;
  const values = [correo, clave];
  db.query(query, values, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const { correo, rol, rol_usuario_id, habilitado, usuario_id } = results[0];

      if (habilitado === 0) {
        res.status(401).json({ status: 'error', message: 'El usuario no está habilitado.' });
        return;
      }

      let name, role;

      if (rol_usuario_id === 1) {
        name = 'Administrador';
        role = 'Administrador';
      } else if (rol_usuario_id === 2) {
        const userInfoQuery = `
          SELECT CONCAT(iu.nombres, ' ', iu.apellidos) AS name
          FROM tbl_informacion_usuario iu
          WHERE iu.usuario_id = ?;
        `;
        db.query(userInfoQuery, [usuario_id], (err, userInfoResults) => {
          if (err) throw err;

          name = userInfoResults.length > 0 ? userInfoResults[0].name : '';
          role = 'Usuario';
          const token = jwt.sign({ correo, rol }, 'secret_key');
          res.json({ name: name, role: role, email: correo, accessToken: token });
        });
        return;
      } else if (rol_usuario_id === 3) {
        const deliveryInfoQuery = `
          SELECT CONCAT(sr.nombres, ' ', sr.apellidos) AS name
          FROM tbl_solicitud_repartidor sr
          WHERE sr.usuario_id = ?;
        `;
        db.query(deliveryInfoQuery, [usuario_id], (err, deliveryInfoResults) => {
          if (err) throw err;

          name = deliveryInfoResults.length > 0 ? deliveryInfoResults[0].name : '';
          role = 'Repartidor';
          const token = jwt.sign({ correo, rol }, 'secret_key');
          res.json({ name: name, role: role, email: correo, accessToken: token });
        });
        return;
      } else if (rol_usuario_id === 4) {
        const companyInfoQuery = `
          SELECT se.nombre AS name
          FROM tbl_solicitud_empresa se
          WHERE se.usuario_id = ?;
        `;
        db.query(companyInfoQuery, [usuario_id], (err, companyInfoResults) => {
          if (err) throw err;

          name = companyInfoResults.length > 0 ? companyInfoResults[0].name : '';
          role = 'Empresa';
          const token = jwt.sign({ correo, rol }, 'secret_key');
          res.json({ name: name, role: role, email: correo, accessToken: token });
        });
        return;
      }

      const token = jwt.sign({ correo, rol }, 'secret_key');
      res.json({ name: name, role: role, email: correo, accessToken: token });
    } else {
      res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
    }
  });
};
