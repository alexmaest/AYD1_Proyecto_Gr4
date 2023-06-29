const nodemailer = require('nodemailer');
const db = require('../database');
require('dotenv').config();

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
        CASE
          WHEN sr.tipo_licencia_id IS NULL THEN 'No tiene'
          ELSE tlc.descripcion
        END AS tipo_licencia,
        sr.fecha_solicitud,
        CASE
          WHEN sr.estado_solicitud_id = 1 THEN 'Pendiente'
        END AS estado_solicitud,
        CASE
          WHEN sr.tiene_vehiculo = 0 THEN 'No'
          WHEN sr.tiene_vehiculo = 1 THEN 'Si'
        END AS tiene_vehiculo,
        sr.documento_url
      FROM tbl_solicitud_repartidor sr
      JOIN tbl_usuario u ON sr.usuario_id = u.usuario_id
      JOIN tbl_cat_municipio cm ON sr.municipio_id = cm.municipio_id
      JOIN tbl_cat_departamento cd ON cm.departamento_id = cd.departamento_id
      LEFT JOIN tbl_cat_tipo_licencia_conducir tlc ON sr.tipo_licencia_id = tlc.tipo_licencia_conducir_id
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

exports.deliveryRequestApprove = (req, res) => {
  const { id, state, description } = req.body;

  if (state === 'Aprobado') {
    const approveQuery = `
      UPDATE tbl_usuario
      SET habilitado = 1
      WHERE usuario_id = (
        SELECT usuario_id
        FROM tbl_solicitud_repartidor
        WHERE solicitud_repartidor_id = ${id}
      );

      UPDATE tbl_solicitud_repartidor
      SET estado_solicitud_id = 2
      WHERE solicitud_repartidor_id = ${id};
    `;

    db.query(approveQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: Sending request');
      } else {
        sendEmail(id, state, 0, description);
        res.status(200).send('Information: Reply sent');
      }
    });
  } else if (state === 'Rechazado') {
    const rejectQuery = `
      UPDATE tbl_usuario
      SET habilitado = 0
      WHERE usuario_id = (
        SELECT usuario_id
        FROM tbl_solicitud_repartidor
        WHERE solicitud_repartidor_id = ${id}
      );

      UPDATE tbl_solicitud_repartidor
      SET estado_solicitud_id = 3
      WHERE solicitud_repartidor_id = ${id};
    `;

    db.query(rejectQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: Sending request');
      } else {
        sendEmail(id, state, 0, description);
        res.status(200).send('Information: Reply sent');
      }
    });
  } else {
    res.status(400).send('Invalid state value');
  }
};

exports.deliveryChangeLocationRequest = (req, res) => {
  const query = `
  select 
cur.cambios_ubicacion_id as cambio_ubicacion_id
,sr.solicitud_repartidor_id as repartidor_id
,sr.nombres
,sr.apellidos
,cur.cambios_ubicacion_id as cambio_ubicacion_id
-- orgen
,cd_origen.departamento_id as departamento_origen_id
,cd_origen.descripcion as departamento_origen
,cur.origen_municipio_id as municipio_orgen_id
,cm_origen.descripcion as municipio_origen
-- destino
,cd_destino.departamento_id as departamento_destino_id
,cd_destino.descripcion as departamento_destino
,cur.destino_municipio_id as municipio_destino_id
,cm_destino.descripcion as municipio_destino
,cur.motivo_solicitud
,cur.fecha_solicitud
,cur.estado_solicitud_id
from tbl_cambio_ubicacion_repartidor cur 
inner join tbl_solicitud_repartidor sr on  cur.repartidor_id=sr.solicitud_repartidor_id
inner join tbl_cat_municipio cm_origen on cm_origen.municipio_id=cur.origen_municipio_id
inner join tbl_cat_municipio cm_destino on cm_destino.municipio_id = cur.destino_municipio_id
inner join tbl_cat_departamento cd_origen on cd_origen.departamento_id= cm_origen.departamento_id
inner join tbl_cat_departamento cd_destino on cd_destino.departamento_id= cm_destino.departamento_id
where cur.estado_solicitud_id in (0,1)
    `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving delivery change location requests');
    } else {
      res.json(result);
    }
  });
};

exports.deliveryChangeLocationRequestApprove = (req, res) => {
  const { request_id, state } = req.body;

  if (state === 'Aprobado') {
    const approveQuery = `
      START TRANSACTION;

      UPDATE tbl_cambio_ubicacion_repartidor
      SET estado_solicitud_id = 2 
      WHERE cambios_ubicacion_id = ${request_id};

      SELECT tbl_usuario.correo, tbl_solicitud_repartidor.nombres, tbl_solicitud_repartidor.apellidos
      FROM tbl_solicitud_repartidor
      INNER JOIN tbl_usuario ON tbl_solicitud_repartidor.usuario_id = tbl_usuario.usuario_id
      WHERE tbl_solicitud_repartidor.solicitud_repartidor_id = (SELECT repartidor_id FROM tbl_cambio_ubicacion_repartidor WHERE cambios_ubicacion_id = ${request_id});

      COMMIT;
    `;

    db.query(approveQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: Sending request');
      } else {
        const userData = result[2][0];
        console.log(userData);
        console.log(userData.correo);
        if (userData && userData.correo) {
          sendEmail2(userData, 'Aprobado', res);
        } else {
          res.status(500).send('Error: Recipient email not found');
        }
      }
    });
  } else if (state === 'Rechazado') {
    const rejectQuery = `
      START TRANSACTION;

      UPDATE tbl_cambio_ubicacion_repartidor
      SET estado_solicitud_id = 3 
      WHERE cambios_ubicacion_id = ${request_id};

      SELECT tbl_usuario.correo, tbl_solicitud_repartidor.nombres, tbl_solicitud_repartidor.apellidos
      FROM tbl_solicitud_repartidor
      INNER JOIN tbl_usuario ON tbl_solicitud_repartidor.usuario_id = tbl_usuario.usuario_id
      WHERE tbl_solicitud_repartidor.solicitud_repartidor_id = (SELECT repartidor_id FROM tbl_cambio_ubicacion_repartidor WHERE cambios_ubicacion_id = ${request_id});

      COMMIT;
    `;

    db.query(rejectQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: Sending request');
      } else {
        const userData = result[2][0];
        console.log(userData);
        console.log(userData.correo);
        if (userData && userData.correo) {
          sendEmail2(userData, 'Rechazado', res);
        } else {
          res.status(500).send('Error: Recipient email not found');
        }
      }
    });
  } else {
    res.status(400).send('Invalid state value');
  }
};

exports.companyRequestApprove = (req, res) => {
  const { id, state, description } = req.body;

  if (state === 'Aprobado') {
    const approveQuery = `
      UPDATE tbl_usuario
      SET habilitado = 1
      WHERE usuario_id = (
        SELECT usuario_id
        FROM tbl_solicitud_empresa
        WHERE solicitud_empresa_id = ${id}
      );

      UPDATE tbl_solicitud_empresa
      SET estado_solicitud_id = 2
      WHERE solicitud_empresa_id = ${id};
    `;

    db.query(approveQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: Sending request');
      } else {
        sendEmail(id, state, 1, description);
        res.status(200).send('Information: Reply sent');
      }
    });
  } else if (state === 'Rechazado') {
    const rejectQuery = `
      UPDATE tbl_usuario
      SET habilitado = 0
      WHERE usuario_id = (
        SELECT usuario_id
        FROM tbl_solicitud_empresa
        WHERE solicitud_empresa_id = ${id}
      );

      UPDATE tbl_solicitud_empresa
      SET estado_solicitud_id = 3
      WHERE solicitud_empresa_id = ${id};
    `;

    db.query(rejectQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: Sending request');
      } else {
        sendEmail(id, state, 1, description);
        res.status(200).send('Information: Reply sent');
      }
    });
  } else {
    res.status(400).send('Invalid state value');
  }
};

function sendEmail(id, state, type, description) {
  var userQuery = ``;
  if (type === 0) {
    userQuery = `
      SELECT u.correo, s.nombres, s.apellidos
      FROM tbl_solicitud_repartidor s
      INNER JOIN tbl_usuario u ON s.usuario_id = u.usuario_id
      WHERE s.solicitud_repartidor_id = ${id}
    `;
  } else {
    userQuery = `
      SELECT u.correo, s.nombre
      FROM tbl_solicitud_empresa s
      INNER JOIN tbl_usuario u ON s.usuario_id = u.usuario_id
      WHERE s.solicitud_empresa_id = ${id}
    `;
  }

  db.query(userQuery, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    if (result.length === 0) {
      console.log('Error: Request not found');
      return;
    }
    const subject = state === 'Aprobado' ? 'Solicitud aprobada' : 'Solicitud rechazada';
    const message = state === 'Aprobado' ? 'Tu solicitud ha sido aprobada.' : 'Tu solicitud ha sido rechazada.';
    let correo, nombres, apellidos, nombre;
    let text = '';
    if (type === 0) {
      const userData = result[0];
      correo = userData.correo;
      nombres = userData.nombres;
      apellidos = userData.apellidos;
      text = `Estimado(a) ${nombres} ${apellidos},\n\n${message}\n${description}`
    } else if (type === 1) {
      const userData = result[0];
      correo = userData.correo;
      nombre = userData.nombre;
      text = `Estimada empresa ${nombre},\n\n${message}\n${description}`
    }
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
      } else {
        console.log('Information: Email sent', info.response);
      }
    });
  });
}

function sendEmail2(userData, state, res) {
  const { correo, nombres, apellidos } = userData;
  const subject = state === 'Aprobado' ? 'Solicitud aprobada' : 'Solicitud rechazada';
  const message = state === 'Aprobado' ? 'Tu solicitud de cambio de ubicacion ha sido aprobada.' : 'Tu solicitud de cambio de ubicacion ha sido rechazada.';
  const text = `Estimado(a) ${nombres} ${apellidos},\n\n${message}`;

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

exports.reports = (req, res) => {
  const countEnabledQuery = `
    SELECT COUNT(*) AS contador
    FROM tbl_usuario
    WHERE habilitado = 1;
  `;

  const countDisabledQuery = `
    SELECT COUNT(*) AS contador
    FROM tbl_usuario
    WHERE habilitado = 0;
  `;

  db.query(countEnabledQuery, (err, resultEnabled) => {
    if (err) throw err;
    const enabledCount = resultEnabled[0].contador;

    db.query(countDisabledQuery, (err, resultDisabled) => {
      if (err) throw err;
      const disabledCount = resultDisabled[0].contador;

      const response = {
        enabledUsers: enabledCount,
        disabledUsers: disabledCount
      };
      res.json(response);
    });
  });
};

exports.usersToDisable = (req, res) => {
  const selectQuery = `
    SELECT u.usuario_id AS user_id, i.nombres AS first_names, i.apellidos AS last_names, DATE(i.fecha_registro)  AS register_date, u.correo AS email
    FROM tbl_usuario u
    JOIN tbl_informacion_usuario i ON u.usuario_id = i.usuario_id
    WHERE u.habilitado = 1 AND u.rol_usuario_id = 2;
  `;

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    const users = result.map((row) => {
      return {
        user_id: row.user_id,
        first_names: row.first_names,
        last_names: row.last_names,
        register_date: row.register_date.toISOString().split('T')[0],
        email: row.email,
      };
    });
    return res.status(200).json(users);
  });
};

exports.userDisabled = (req, res) => {
  const userId = req.params.id;

  const checkQuery = `
    SELECT COUNT(*) AS count
    FROM tbl_pedido
    WHERE usuario_id = ${userId} AND estado_id <> 5;
  `;

  db.query(checkQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const count = result[0].count;
    if (count > 0) {
      return res.status(403).json({ error: 'Cannot disable user because they have pending orders' });
    }

    const updateQuery = `
      UPDATE tbl_usuario
      SET habilitado = 0
      WHERE usuario_id = ${userId};
    `;

    db.query(updateQuery, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario not founded' });
      }
      return res.status(200).json({ message: 'User successfully disabled' });
    });
  });
};

exports.companyTop5 = (req, res) => {
  const top5Query = `
    SELECT se.solicitud_empresa_id, se.nombre, COUNT(p.empresa_id) AS cantidad_pedidos
    FROM tbl_solicitud_empresa se
    LEFT JOIN tbl_pedido p ON se.solicitud_empresa_id = p.empresa_id
    GROUP BY se.solicitud_empresa_id, se.nombre
    ORDER BY cantidad_pedidos DESC
    LIMIT 5;
  `;

  db.query(top5Query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const top5Companies = result.map((row) => {
      return {
        company_id: row.solicitud_empresa_id,
        name: row.nombre,
        orders_number: row.cantidad_pedidos,
      };
    });

    return res.status(200).json(top5Companies);
  });
};

exports.deliveryTop5 = (req, res) => {
  const top5Query = `
    SELECT sr.solicitud_repartidor_id, sr.nombres, sr.apellidos, IFNULL(AVG(p.calificacion_repartidor), 0) AS promedio_calificacion
    FROM tbl_solicitud_repartidor sr
    LEFT JOIN tbl_pedido p ON sr.solicitud_repartidor_id = p.repartidor_id
    GROUP BY sr.solicitud_repartidor_id, sr.nombres, sr.apellidos
    ORDER BY promedio_calificacion DESC
    LIMIT 5;
  `;

  db.query(top5Query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const top5DeliveryMan = result.map((row) => {
      return {
        deliveryMan_id: row.solicitud_repartidor_id,
        first_name: row.nombres,
        last_name: row.apellidos,
        average_rating: row.promedio_calificacion,
      };
    });

    return res.status(200).json(top5DeliveryMan);
  });
};
