const db = require('../database');

exports.main = (req, res) => {
  res.send('Information: Delivery man main page');
};

exports.deliveryManInfoRequest = (req, res) => {
  const { correo } = req.params;

  const query = `
    SELECT sr.solicitud_repartidor_id as id,
      nombres,
      apellidos,
      u.correo,
      no_celular,
      d.descripcion as 'departamento',
      m.descripcion as 'municipio',
      case when tiene_vehiculo=1 then 'si' else 'no' end as 'tiene_vehiculo',
      lc.descripcion as 'tipo_licencia',
      documento_url
    FROM tbl_solicitud_repartidor sr
    INNER JOIN tbl_usuario u ON sr.usuario_id = u.usuario_id
    INNER JOIN tbl_cat_municipio m ON sr.municipio_id = m.municipio_id
    INNER JOIN tbl_cat_departamento d ON m.departamento_id = d.departamento_id
    INNER JOIN tbl_cat_tipo_licencia_conducir lc ON sr.tipo_licencia_id = lc.tipo_licencia_conducir_id
    WHERE u.rol_usuario_id = 3 AND u.habilitado = 1 AND u.correo = ?;
  `;

  const values = [correo];
  db.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error with delivery man request' });
    } else {
      const deliveryManInfo = {
        id: results[0].id,
        nombres: results[0].nombres,
        apellidos: results[0].apellidos,
        correo: results[0].correo,
        no_celular: results[0].no_celular,
        departamento: results[0].departamento,
        municipio: results[0].municipio,
        tiene_vehiculo: results[0].tiene_vehiculo,
        tipo_licencia: results[0].tipo_licencia,
        documento_url: results[0].documento_url
      };

      res.json(deliveryManInfo);
    }
  });
};

exports.changeLocation = (req, res) => {
  const { id, description, department, municipality } = req.body;

  const selectQuery = 'SELECT municipio_id FROM tbl_solicitud_repartidor WHERE solicitud_repartidor_id = ?';
  const selectValues = [id];
  db.query(selectQuery, selectValues, (selectError, selectResults) => {
    if (selectError) {
      console.error(selectError);
      res.status(500).json({ error: 'Error retrieving origin municipality' });
      return;
    }

    if (selectResults.length === 0) {
      res.status(404).json({ error: 'Solicitud repartidor not found' });
      return;
    }

    const origen_municipio_id = selectResults[0].municipio_id;
    const insertQuery = `
      INSERT INTO tbl_cambio_ubicacion_repartidor (origen_municipio_id, destino_municipio_id, motivo_solicitud, fecha_solicitud, estado_solicitud_id, repartidor_id)
      VALUES (?, ?, ?, NOW(), 0, ?)
    `;

    const insertValues = [origen_municipio_id, municipality, description, id];
    db.query(insertQuery, insertValues, (insertError, insertResults) => {
      if (insertError) {
        console.error(insertError);
        res.status(500).json({ error: 'Error adding location change' });
      } else {
        res.status(200).json({ message: 'Location change added successfully' });
      }
    });
  });
};
