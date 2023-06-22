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

exports.categories = (req, res) => {
  const query = `
    SELECT c.categoria_producto_id, c.descripcion AS category_description, c.ilustracion_url, e.solicitud_empresa_id, e.nombre, e.descripcion
    FROM tbl_cat_categoria_producto c
    LEFT JOIN tbl_producto p ON c.categoria_producto_id = p.categoria_producto_id
    LEFT JOIN tbl_combo_producto cp ON c.categoria_producto_id = cp.categoria_producto_id
    LEFT JOIN tbl_solicitud_empresa e ON (p.solicitud_empresa_id = e.solicitud_empresa_id OR cp.solicitud_empresa_id = e.solicitud_empresa_id)
    WHERE p.producto_id IS NOT NULL OR cp.combo_producto_id IS NOT NULL;
  `;

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error: Could not get the categories', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      const formattedResult = {};

      result.forEach((row) => {
        const categoryId = row.categoria_producto_id;

        if (!formattedResult[categoryId]) {
          formattedResult[categoryId] = {
            category_id: categoryId,
            description: row.category_description,
            image: row.ilustracion_url,
            companies: []
          };
        }

        if (row.solicitud_empresa_id !== null) {
          const existingCompanies = formattedResult[categoryId].companies;
          const companyExists = existingCompanies.some(
            (company) => company.company_id === row.solicitud_empresa_id
          );

          if (!companyExists) {
            existingCompanies.push({
              company_id: row.solicitud_empresa_id,
              name: row.nombre,
              description: row.descripcion
            });
          }
        }
      });

      res.json(Object.values(formattedResult));
    }
  });
};
