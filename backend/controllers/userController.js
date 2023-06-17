const db = require('../database');

exports.main = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT u.usuario_id, u.correo, i.nombres, i.apellidos, i.no_celular,
      i.fecha_registro, d.descripcion AS departamento, m.descripcion AS municipio
    FROM tbl_usuario u
    INNER JOIN tbl_informacion_usuario i ON u.usuario_id = i.usuario_id
    INNER JOIN tbl_cat_municipio m ON i.municipio = m.municipio_id
    INNER JOIN tbl_cat_departamento d ON m.departamento_id = d.departamento_id
    WHERE u.usuario_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener la información del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        const user = results[0];
        const {
          usuario_id,
          correo,
          nombres,
          apellidos,
          no_celular,
          fecha_registro,
          departamento,
          municipio
        } = user;

        const userData = {
          usuario_id,
          correo,
          nombres,
          apellidos,
          no_celular,
          fecha_registro,
          departamento,
          municipio
        };

        res.json(userData);
      }
    }
  });
};
