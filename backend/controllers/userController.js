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

exports.company = (req, res) => {
  const companyId = req.params.id;

  const query = `
    SELECT
      se.solicitud_empresa_id AS id,
      se.nombre AS name,
      se.descripcion AS description,
      CASE
        WHEN se.categoria_empresa_id = 1 THEN 'Restaurante'
        WHEN se.categoria_empresa_id = 2 THEN 'Tienda'
        WHEN se.categoria_empresa_id = 3 THEN 'Supermercado'
      END AS category,
      u.correo AS email,
      se.zona AS zone,
      cd.descripcion AS department,
      cm.descripcion AS municipality
    FROM tbl_solicitud_empresa se
    JOIN tbl_usuario u ON se.usuario_id = u.usuario_id
    JOIN tbl_cat_municipio cm ON se.municipio_id = cm.municipio_id
    JOIN tbl_cat_departamento cd ON cm.departamento_id = cd.departamento_id
    WHERE se.solicitud_empresa_id = ?
    LIMIT 1;
  `;

  db.query(query, [companyId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving company request');
    } else if (result.length === 0) {
      res.status(404).send('Company request not found');
    } else {
      const request = result[0];
      res.json(request);
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

exports.shoppingCart = (req, res) => {
  const { user_id, company_id, description, card_number, cvv, due_date, coupon, total, products, combos } = req.body;

  if (coupon === "") {
    if (products.length === 0 && combos.length === 0) {
      res.status(502).json({ error: 'Combos and products array are empty' });
    } else {
      db.query('SELECT * FROM tbl_metodo_pago WHERE no_tarjeta = ?', [card_number], (error, result) => {
        if (error) {
          console.error('Error: Could not perform the card number validation', error);
          res.status(500).json({ error: 'Error: Internal server failure' });
        } else {
          if (result.length > 0) {
            db.query('SELECT * FROM tbl_metodo_pago WHERE no_tarjeta = ? AND usuario_id = ?', [card_number, user_id], (error, result) => {
              if (error) {
                console.error('Error: Could not perform the card number validation', error);
                res.status(500).json({ error: 'Error: Internal server failure' });
              } else if (result.length > 0) {
                db.query('SELECT * FROM tbl_metodo_pago WHERE no_tarjeta = ? AND usuario_id = ? AND cvv = ? AND fecha_vencimiento = ?', [card_number, user_id, cvv, due_date], (error, result) => {
                  if (error) {
                    console.error('Error: Could not perform the card number validation', error);
                    res.status(500).json({ error: 'Error: Internal server failure' });
                  } else if (result.length > 0) {
                    addItems(user_id, company_id, description, card_number, total, products, combos, req, res);
                  } else {
                    res.status(504).json({ error: 'Invalid card values' });
                  }
                });
              } else {
                res.status(501).json({ error: 'Card number already in use' });
              }
            });
          }else{
            const metodoPagoData = {
              no_tarjeta: card_number,
              usuario_id: user_id,
              cvv: cvv,
              fecha_vencimiento: due_date
            };
  
            db.query('INSERT INTO tbl_metodo_pago SET ?', metodoPagoData, (error, result) => {
              if (error) {
                console.error('Error: Could not insert into tbl_metodo_pago', error);
                res.status(500).json({ error: 'Error: Internal server failure' });
              } else {
                addItems(user_id, company_id, description, card_number, total, products, combos, req, res);
              }
            });
          }
        }
      });
    }
  } else {
    db.query('SELECT * FROM tbl_cupones WHERE usuario_id = ? AND pedido_id IS NOT NULL AND codigo = ?', [user_id, coupon], (error, result) => {
      if (error) {
        console.error('Error: Could not perform the coupon search', error);
        res.status(500).json({ error: 'Error: Internal server failure' });
      } else if (result.length > 0) {
        res.status(503).json({ error: 'The coupon has already been used' });
      } else {
        db.query('SELECT * FROM tbl_cupones WHERE codigo = ? AND usuario_id = ?', [coupon, user_id], (error, result) => {
          if (error) {
            console.error('Error: Could not perform the coupon validation', error);
            res.status(500).json({ error: 'Error: Internal server failure' });
          } else if (result.length === 0) {
            res.status(504).json({ error: 'The coupon is not valid' });
          } else {
            db.query('SELECT * FROM tbl_metodo_pago WHERE no_tarjeta = ?', [card_number], (error, result) => {
              if (error) {
                console.error('Error: Could not perform the card number validation', error);
                res.status(500).json({ error: 'Error: Internal server failure' });
              } else {
                if (result.length > 0) {
                  db.query('SELECT * FROM tbl_metodo_pago WHERE no_tarjeta = ? AND usuario_id = ?', [card_number, user_id], (error, result) => {
                    if (error) {
                      console.error('Error: Could not perform the card number validation', error);
                      res.status(500).json({ error: 'Error: Internal server failure' });
                    } else if (result.length > 0) {
                      db.query('SELECT * FROM tbl_metodo_pago WHERE no_tarjeta = ? AND usuario_id = ? AND cvv = ? AND fecha_vencimiento = ?', [card_number, user_id, cvv, due_date], (error, result) => {
                        if (error) {
                          console.error('Error: Could not perform the card number validation', error);
                          res.status(500).json({ error: 'Error: Internal server failure' });
                        } else if (result.length > 0) {
                          addItems(user_id, company_id, description, card_number, total, products, combos, req, res);
                        } else {
                          res.status(504).json({ error: 'Invalid card values' });
                        }
                      });
                    } else {
                      res.status(501).json({ error: 'Card number already in use' });
                    }
                  });
                }else{
                  const metodoPagoData = {
                    no_tarjeta: card_number,
                    usuario_id: user_id,
                    cvv: cvv,
                    fecha_vencimiento: due_date
                  };
        
                  db.query('INSERT INTO tbl_metodo_pago SET ?', metodoPagoData, (error, result) => {
                    if (error) {
                      console.error('Error: Could not insert into tbl_metodo_pago', error);
                      res.status(500).json({ error: 'Error: Internal server failure' });
                    } else {
                      addItems(user_id, company_id, description, card_number, total, products, combos, req, res);
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }
};

function addItems(user_id, company_id, description, card_number, total, products, combos, req, res){
  const fecha_pedido = new Date();
  const estado_id = 1;
  const pedidoData = {
    fecha_pedido,
    usuario_id: user_id,
    empresa_id: company_id,
    repartidor_id: null,
    fecha_empresa: null,
    fecha_repartidor: null,
    fecha_usuario: null,
    estado_id,
    total_pedido: total,
    no_tarjeta: card_number,
    calificacion_repartidor: null,
    descripcion: description
  };

  db.query('INSERT INTO tbl_pedido SET ?', pedidoData, (error, result) => {
    if (error) {
      console.error('Error: Could not insert into tbl_pedido', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      const pedido_id = result.insertId;

      if (combos.length > 0) {
        const comboData = combos.map(combo => [
          pedido_id,
          combo.id,
          combo.quantity
        ]);

        db.query('INSERT INTO tbl_pedido_combo (pedido_id, combo_id, cantidad) VALUES ?', [comboData], (error, result) => {
          if (error) {
            console.error('Error: Could not insert into tbl_pedido_combo', error);
            res.status(500).json({ error: 'Error: Internal server failure' });
          } else {
            if (products.length > 0) {
              const productData = products.map(product => [
                pedido_id,
                product.id,
                product.quantity
              ]);

              db.query('INSERT INTO tbl_pedido_producto (pedido_id, producto_id, cantidad) VALUES ?', [productData], (error, result) => {
                if (error) {
                  console.error('Error: Could not insert into tbl_pedido_producto', error);
                  res.status(500).json({ error: 'Error: Internal server failure' });
                } else {
                  res.status(200).json({ message: 'Order sent successfully' });
                }
              });
            } else {
              res.status(200).json({ message: 'Order sent successfully' });
            }
          }
        });
      } else {
        if (products.length > 0) {
          const productData = products.map(product => [
            pedido_id,
            product.id,
            product.quantity
          ]);

          db.query('INSERT INTO tbl_pedido_producto (pedido_id, producto_id, cantidad) VALUES ?', [productData], (error, result) => {
            if (error) {
              console.error('Error: Could not insert into tbl_pedido_producto', error);
              res.status(500).json({ error: 'Error: Internal server failure' });
            } else {
              res.status(200).json({ message: 'Order sent successfully' });
            }
          });
        } else {
          res.status(502).json({ error: 'Combos and products array are empty' });
        }
      }
    }
  });
}

exports.history = (req, res) => {
  const deliveryId = req.params.id;

  const getOrderQuery = `
    SELECT 
      p.pedido_id,
      DATE(p.fecha_pedido) AS order_date,
      TIME(p.fecha_pedido) AS order_hour,
      se.nombre AS company_name,
      pe.descripcion AS state,
      p.total_pedido AS subtotal,
      p.descripcion AS description,
      CASE
        WHEN c.pedido_id IS NOT NULL THEN p.total_pedido - (p.total_pedido * 0.15)
        ELSE p.total_pedido
      END AS total,
      CASE
        WHEN c.pedido_id IS NOT NULL THEN 'Si'
        ELSE 'No'
      END AS coupon_applied
    FROM
      tbl_pedido AS p
      INNER JOIN tbl_solicitud_empresa AS se ON p.empresa_id = se.solicitud_empresa_id
      INNER JOIN tbl_pedido_estado AS pe ON p.estado_id = pe.estado_id
      LEFT JOIN tbl_cupones AS c ON p.pedido_id = c.pedido_id
    WHERE
      p.usuario_id = ?;
  `;

  const getOrderComboQuery = `
    SELECT
      pc.combo_id AS id,
      pc.cantidad AS quantity,
      cp.precio AS unitary_price
    FROM
      tbl_pedido_combo AS pc
      INNER JOIN tbl_combo_producto AS cp ON pc.combo_id = cp.combo_producto_id
    WHERE
      pc.pedido_id = ?
  `;

  const getOrderProductQuery = `
    SELECT
      pp.producto_id AS id,
      pp.cantidad AS quantity,
      pr.precio_unitario AS unitary_price
    FROM
      tbl_pedido_producto AS pp
      INNER JOIN tbl_producto AS pr ON pp.producto_id = pr.producto_id
    WHERE
      pp.pedido_id = ?
  `;

  db.query(getOrderQuery, [deliveryId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error retrieving orders' });
    }

    const orders = [];

    let count = 0;

    for (const result of results) {
      const order = {
        order_id: result.pedido_id,
        order_date: result.order_date.toISOString().split('T')[0],
        order_hour: result.order_hour,
        company_name: result.company_name,
        state: result.state,
        subtotal: result.subtotal,
        description: result.description,
        total: result.total,
        coupon_applied: result.coupon_applied,
        combos: [],
        products: []
      };

      const orderId = result.pedido_id;

      db.query(getOrderComboQuery, [orderId], (error, comboResults) => {
        if (error) {
          console.error(error);
        } else {
          order.combos = comboResults.map((comboResult) => {
            return {
              id: comboResult.id,
              quantity: comboResult.quantity,
              unitary_price: comboResult.unitary_price
            };
          });
        }

        db.query(getOrderProductQuery, [orderId], (error, productResults) => {
          if (error) {
            console.error(error);
          } else {
            order.products = productResults.map((productResult) => {
              return {
                id: productResult.id,
                quantity: productResult.quantity,
                unitary_price: productResult.unitary_price
              };
            });
          }

          orders.push(order);

          count++;

          if (count === results.length) {
            res.status(200).json(orders);
          }
        });
      });
    }
  });
};

exports.ordersDelivered = (req, res) => {
  const userId = req.params.id;

  const getOrderQuery = `
    SELECT 
      p.pedido_id AS order_id,
      DATE(p.fecha_usuario) AS order_date,
      TIME(p.fecha_usuario) AS order_hour,
      CONCAT(sr.nombres, ' ', sr.apellidos) AS repartidor_nombre,
      se.nombre AS company_name,
      pe.descripcion AS state,
      p.descripcion AS description
    FROM
      tbl_pedido AS p
      INNER JOIN tbl_solicitud_empresa AS se ON p.empresa_id = se.solicitud_empresa_id
      INNER JOIN tbl_pedido_estado AS pe ON p.estado_id = pe.estado_id
      INNER JOIN tbl_solicitud_repartidor AS sr ON p.repartidor_id = sr.solicitud_repartidor_id
    WHERE
      p.usuario_id = ? AND p.estado_id = 5;
  `;

  const getOrderComboQuery = `
    SELECT
      pc.combo_id AS id,
      pc.cantidad AS quantity,
      cp.nombre AS name
    FROM
      tbl_pedido_combo AS pc
      INNER JOIN tbl_combo_producto AS cp ON pc.combo_id = cp.combo_producto_id
    WHERE
      pc.pedido_id = ?
  `;

  const getOrderProductQuery = `
    SELECT
      pp.producto_id AS id,
      pp.cantidad AS quantity,
      pr.nombre AS name
    FROM
      tbl_pedido_producto AS pp
      INNER JOIN tbl_producto AS pr ON pp.producto_id = pr.producto_id
    WHERE
      pp.pedido_id = ?
  `;

  db.query(getOrderQuery, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error retrieving orders' });
    }

    const orders = [];

    let count = 0;

    for (const result of results) {
      const order = {
        order_id: result.order_id,
        deliveryMan_name: result.repartidor_nombre,
        delivered_date: result.order_date.toISOString().split('T')[0],
        delivered_hour: result.order_hour,
        company_name: result.company_name,
        state: result.state,
        description: result.description,
        combos: [],
        products: []
      };

      const orderId = result.order_id;

      db.query(getOrderComboQuery, [orderId], (error, comboResults) => {
        if (error) {
          console.error(error);
        } else {
          order.combos = comboResults.map((comboResult) => {
            return {
              id: comboResult.id,
              quantity: comboResult.quantity,
              name: comboResult.name
            };
          });
        }

        db.query(getOrderProductQuery, [orderId], (error, productResults) => {
          if (error) {
            console.error(error);
          } else {
            order.products = productResults.map((productResult) => {
              return {
                id: productResult.id,
                quantity: productResult.quantity,
                name: productResult.name
              };
            });
          }

          orders.push(order);

          count++;

          if (count === results.length) {
            res.status(200).json(orders);
          }
        });
      });
    }
  });
};
