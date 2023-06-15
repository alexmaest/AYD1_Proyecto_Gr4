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
  var deleteQuery = ``;
  if(type === 0){
    userQuery = `
      SELECT u.correo, s.nombres, s.apellidos
      FROM tbl_solicitud_repartidor s
      INNER JOIN tbl_usuario u ON s.usuario_id = u.usuario_id
      WHERE s.solicitud_repartidor_id = ${id}
    `;
    deleteQuery = `
      DELETE FROM tbl_solicitud_repartidor
      WHERE solicitud_repartidor_id = ${id};
    `;
  }else{
    userQuery = `
      SELECT u.correo, s.nombre
      FROM tbl_solicitud_empresa s
      INNER JOIN tbl_usuario u ON s.usuario_id = u.usuario_id
      WHERE s.solicitud_empresa_id = ${id}
    `;
    deleteQuery = `
      DELETE FROM tbl_documentos_x_empresa
      WHERE solicitud_empresa_id = ${id};
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

  
  db.query(deleteQuery, (err, result) => {
    if(type === 1){
      if (err) throw err;
      const deleteSolicitudQuery = `
        DELETE FROM tbl_solicitud_empresa
        WHERE solicitud_empresa_id = ${id};
      `;
      db.query(deleteSolicitudQuery, (err, deleteSolicitudResults) => {
        if (err) throw err;
      });
    }
    if (err) {
      console.error(err);
    } else {
      console.log('Information: Reply sent');
    }
  });
}

exports.reports = (req, res) => {
    res.send('Information: Admin reports page');
};
