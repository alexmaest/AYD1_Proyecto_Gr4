const db = require('../database');

// Login
exports.login = (req, res) => {
  const { correo, clave } = req.body;

  const query = 'SELECT u.correo, r.descripcion AS rol FROM tbl_usuario u INNER JOIN tbl_rol_usuario r ON u.rol_usuario_id = r.rol_usuario_id WHERE u.correo = ? AND u.clave = ? AND u.habilitado = 1;';
  const values = [correo, clave];

  db.query(query, values, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const { correo, rol } = results[0];
      res.json({ rol });
    } else {
      res.status(401).json({ status: 'error', message: 'Credenciales inválidas o cuenta no habilitada.' });
    }
  });
};
