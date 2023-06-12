const express = require('express');
const router = express.Router();
const db = require('../database');

// GET route for departments
router.get('/', (req, res) => {
  db.query(
    'SELECT d.departamento_id, d.descripcion AS departamento, m.municipio_id, m.descripcion AS municipio FROM tbl_cat_departamento d JOIN tbl_cat_municipio m ON d.departamento_id = m.departamento_id',
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const departamentos = {};
        results.forEach(row => {
          const { departamento_id, departamento, municipio_id, municipio } = row;
          if (!departamentos[departamento_id]) {
            departamentos[departamento_id] = {
              departamento_id,
              descripcion: departamento,
              municipios: []
            };
          }
          departamentos[departamento_id].municipios.push({
            municipio_id,
            descripcion: municipio
          });
        });

        const departamentosArray = Object.values(departamentos);
        res.json(departamentosArray);
      }
    }
  );
});

module.exports = router;
