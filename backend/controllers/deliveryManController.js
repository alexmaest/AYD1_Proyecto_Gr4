const db = require('../database');

exports.main = (req, res) => {
  res.send('Information: Delivery man main page');
};

exports.deliveryManInfoRequest = (req, res) => {
    const { correo } = req.body;
  
    const query = `
    SELECT sr.usuario_id,
      nombres,
      apellidos,
      u.correo,
      no_celular,
      sr.municipio_id,
      m.descripcion as 'municipio',
      d.departamento_id, 
      d.descripcion as 'departamento',
      tipo_licencia_id,
      lc.descripcion as 'tipo_licencia',
      fecha_solicitud,
      es.descripcion as 'estado_solicitud',
      case when tiene_vehiculo=1 then 'si' else 'no' end as 'tiene vehiculo',
      documento_url
    FROM tbl_solicitud_repartidor sr 
    inner join tbl_usuario u on sr.usuario_id=u.usuario_id
    inner join tbl_cat_municipio m on sr.municipio_id = m.municipio_id
    inner join tbl_cat_departamento d on m.departamento_id= d.departamento_id
    inner join tbl_cat_tipo_licencia_conducir  lc  on sr.tipo_licencia_id=lc.tipo_licencia_conducir_id
    inner join tbl_cat_estado_solicitud es on sr.estado_solicitud_id = es.estados_solicitud_id
    where u.rol_usuario_id=3 and u.habilitado=1 and u.correo = ?;
`;

  // Ejecutar la consulta
  const values = [correo];
  db.query(query, values, (error, results) => {
    // Cerrar la conexión a la base de datos
    //connection.end();

    if (error) {
      // Si ocurre un error, enviar una respuesta de error
      res.status(500).json({ error: 'Error en la consulta MySQL' });
    } else {
      // Si la consulta es exitosa, enviar los resultados en formato JSON
      res.json(results);
    }
  });
    
  };