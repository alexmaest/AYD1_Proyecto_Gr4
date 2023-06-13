const db = require('../database');

// Login
exports.login = (req, res) => {
  const { email, password, type } = req.body;

  const query ='SELECT usr.usuario_id, usr.nombre,  usr.apellido, usr.correo, usr.rol FROM alchilazodb.vw_usuario usr  where habilitado=1 and correo = ? and clave = ? and rol = ?;' 
  const values = [email, password, type ];

  db.query(query, values, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send('Information: Login succeeded');
    } else {
      res.send('Error: Invalid credentials');
    }
  });
};
