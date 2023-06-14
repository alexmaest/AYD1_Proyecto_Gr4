const db = require('../database');

exports.main = (req, res) => {
    res.send('Information: Admin main page');
};

exports.companyRequests = (req, res) => {
    const query = `
      SELECT
        se.solicitud_empresa_id,
        se.nombre,
        se.descripcion,
        CASE
          WHEN se.categoria_empresa_id = 1 THEN 'Restaurante'
          WHEN se.categoria_empresa_id = 2 THEN 'Tienda'
          WHEN se.categoria_empresa_id = 3 THEN 'Supermercado'
        END AS categoria_empresa,
        u.correo,
        se.zona,
        cd.descripcion AS departamento,
        cm.descripcion AS municipio,
        se.fecha_solicitud,
        'Pendiente' AS estado_solicitud,
        JSON_ARRAYAGG(d.documento_url) AS documentos
      FROM tbl_solicitud_empresa se
      JOIN tbl_usuario u ON se.usuario_id = u.usuario_id
      JOIN tbl_cat_municipio cm ON se.municipio_id = cm.municipio_id
      JOIN tbl_cat_departamento cd ON cm.departamento_id = cd.departamento_id
      JOIN tbl_documentos_x_empresa d ON se.solicitud_empresa_id = d.solicitud_empresa_id
      WHERE se.estado_solicitud_id = 1
      GROUP BY se.solicitud_empresa_id;
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving company requests');
      } else {
        const requests = result.map(row => ({
          ...row,
          documentos: JSON.parse(row.documentos)
        }));
        res.json(requests);
      }
    });
  };

exports.deliveryRequests = (req, res) => {
    const query = `
      SELECT
        sr.solicitud_repartidor_id,
        sr.nombres,
        sr.apellidos,
        u.correo,
        sr.no_celular,
        cd.descripcion AS departamento,
        cm.descripcion AS municipio,
        tlc.descripcion AS tipo_licencia,
        sr.fecha_solicitud,
        CASE
          WHEN sr.estado_solicitud_id = 1 THEN 'Pendiente'
        END AS estado_solicitud,
        CASE
          WHEN sr.tiene_vehiculo = 0 THEN 'no'
          WHEN sr.tiene_vehiculo = 1 THEN 'si'
        END AS tiene_vehiculo,
        sr.documento_url
      FROM tbl_solicitud_repartidor sr
      JOIN tbl_usuario u ON sr.usuario_id = u.usuario_id
      JOIN tbl_cat_municipio cm ON sr.municipio_id = cm.municipio_id
      JOIN tbl_cat_departamento cd ON cm.departamento_id = cd.departamento_id
      JOIN tbl_cat_tipo_licencia_conducir tlc ON sr.tipo_licencia_id = tlc.tipo_licencia_conducir_id
      WHERE sr.estado_solicitud_id = 1;
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving delivery requests');
      } else {
        res.json(result);
      }
    });
  };

exports.reports = (req, res) => {
    res.send('Information: Admin reports page');
};
