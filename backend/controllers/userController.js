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

exports.dashCategories = (req, res) => {
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

exports.search = (req, res) => {
  const { search } = req.body;

  const regexSearch = new RegExp(search, 'i');
  const searchQuery = `
    SELECT se.solicitud_empresa_id AS company_id, se.nombre AS name, se.descripcion AS description, c.descripcion AS category
    FROM tbl_solicitud_empresa se
    LEFT JOIN tbl_cat_categoria_empresa c ON se.categoria_empresa_id = c.categoria_empresa_id
    WHERE se.nombre REGEXP ?;
  `;

  db.query(searchQuery, [regexSearch.source], (error, result) => {
    if (error) {
      console.error('Error: Could not perform the search', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      res.json(result);
    }
  });
};

exports.products = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT p.producto_id AS id, p.nombre AS name, p.descripcion AS description, p.precio_unitario AS price, p.ilustracion_url AS image, cc.descripcion AS category
    FROM tbl_producto p
    INNER JOIN tbl_solicitud_empresa se ON p.solicitud_empresa_id = se.solicitud_empresa_id
    INNER JOIN tbl_cat_categoria_producto cc ON p.categoria_producto_id = cc.categoria_producto_id
    WHERE se.solicitud_empresa_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error: Could not get the products', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      const formattedResults = results.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category
      }));
      res.json(formattedResults);
    }
  });
};

exports.combos = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT cp.combo_producto_id AS id, cp.nombre AS name, cp.descripcion AS description,
      cp.precio AS price, cp.ilustracion_url AS image, cc.descripcion AS category,
      pd.producto_id AS product_id, p.nombre AS product_name, pd.cantidad AS quantity
    FROM tbl_combo_producto cp
    INNER JOIN tbl_solicitud_empresa se ON cp.solicitud_empresa_id = se.solicitud_empresa_id
    INNER JOIN tbl_combo_producto_detalle pd ON cp.combo_producto_id = pd.combo_producto_id
    INNER JOIN tbl_producto p ON pd.producto_id = p.producto_id
    INNER JOIN tbl_cat_categoria_producto cc ON cp.categoria_producto_id = cc.categoria_producto_id
    WHERE se.solicitud_empresa_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error: Could not get the combos', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      const combos = {};
      results.forEach((row) => {
        const {
          id,
          name,
          description,
          price,
          image,
          category,
          product_id,
          product_name,
          quantity
        } = row;
        if (!combos[id]) {
          combos[id] = {
            id,
            name,
            description,
            price,
            image,
            category,
            products: []
          };
        }
        combos[id].products.push({
          id: product_id,
          name: product_name,
          quantity
        });
      });

      const formattedCombos = Object.values(combos).map((combo) => ({
        id: combo.id,
        name: combo.name,
        description: combo.description,
        price: combo.price,
        image: combo.image,
        category: combo.category,
        products: combo.products.map((product) => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity
        }))
      }));

      res.json(formattedCombos);
    }
  });
};

exports.categories = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT cc.categoria_producto_id AS category_id, cc.descripcion AS category_description, cc.ilustracion_url AS category_image
    FROM tbl_cat_categoria_producto cc
    WHERE cc.categoria_producto_id IN (
      SELECT DISTINCT p.categoria_producto_id
      FROM tbl_producto p
      INNER JOIN tbl_solicitud_empresa se ON p.solicitud_empresa_id = se.solicitud_empresa_id
      INNER JOIN tbl_cat_categoria_producto cc ON p.categoria_producto_id = cc.categoria_producto_id
      WHERE se.solicitud_empresa_id = ? AND cc.es_combo = 0
    )
    OR cc.categoria_producto_id IN (
      SELECT DISTINCT cp.categoria_producto_id
      FROM tbl_combo_producto cp
      INNER JOIN tbl_solicitud_empresa se ON cp.solicitud_empresa_id = se.solicitud_empresa_id
      INNER JOIN tbl_cat_categoria_producto cc ON cp.categoria_producto_id = cc.categoria_producto_id
      WHERE se.solicitud_empresa_id = ? AND cc.es_combo = 1
    );
  `;

  db.query(query, [userId, userId], (error, categories) => {
    if (error) {
      console.error('Error: Could not get the categories', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      const formattedCategories = categories.map((category) => ({
        id: category.category_id,
        description: category.category_description,
        image: category.category_image,
        products: [],
        combos: []
      }));

      const productsQuery = `
        SELECT p.producto_id AS id, p.nombre AS name, p.descripcion AS description, p.precio_unitario AS price, p.ilustracion_url AS image, p.categoria_producto_id
        FROM tbl_producto p
        INNER JOIN tbl_solicitud_empresa se ON p.solicitud_empresa_id = se.solicitud_empresa_id
        WHERE se.solicitud_empresa_id = ?;
      `;

      const combosQuery = `
        SELECT cp.combo_producto_id AS id, cp.nombre AS name, cp.descripcion AS description, cp.precio AS price, cp.ilustracion_url AS image, cp.categoria_producto_id
        FROM tbl_combo_producto cp
        INNER JOIN tbl_solicitud_empresa se ON cp.solicitud_empresa_id = se.solicitud_empresa_id
        WHERE se.solicitud_empresa_id = ?;
      `;

      db.query(productsQuery, [userId], (error, products) => {
        if (error) {
          console.error('Error: Could not get the products', error);
          res.status(500).json({ error: 'Error: Internal server failure' });
        } else {
          products.forEach((product) => {
            const category = formattedCategories.find((category) => category.id === product.categoria_producto_id);
            if (category) {
              category.products.push({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image
              });
            }
          });

          db.query(combosQuery, [userId], (error, combos) => {
            if (error) {
              console.error('Error: Could not get the combos', error);
              res.status(500).json({ error: 'Error: Internal server failure' });
            } else {
              combos.forEach((combo) => {
                const category = formattedCategories.find((category) => category.id === combo.categoria_producto_id);
                if (category) {
                  category.combos.push({
                    id: combo.id,
                    name: combo.name,
                    description: combo.description,
                    price: combo.price,
                    image: combo.image
                  });
                }
              });

              res.json(formattedCategories);
            }
          });
        }
      });
    }
  });
};
