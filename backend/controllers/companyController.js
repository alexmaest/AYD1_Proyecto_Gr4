const db = require('../database');
const AWS = require('aws-sdk');
require('dotenv').config();

// AWS S3 configuration
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: AWS_PUBLIC_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION
});

const s3 = new AWS.S3({
  accessKeyId: AWS_PUBLIC_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION
});

exports.main = (req, res) => {
  res.send('Information: Company main page');
};

exports.categories = (req, res) => {
  const query = `
    SELECT categoria_producto_id AS id, descripcion AS name, ilustracion_url AS image, es_combo AS type
    FROM tbl_cat_categoria_producto;
  `;

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error: Could not get the categories', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      const formattedResult = result.map((category) => {
        return {
          id: category.id,
          name: category.name,
          image: category.image,
          type: category.type === 0 ? 'Producto' : 'Combo'
        };
      });

      res.json(formattedResult);
    }
  });
};

exports.products = (req, res) => {
  const userEmail = req.params.userEmail;

  const query = `
    SELECT p.producto_id AS id, p.nombre AS name, p.descripcion AS description, p.precio_unitario AS price, p.ilustracion_url AS image, cp.descripcion AS category
    FROM tbl_producto p
    INNER JOIN tbl_solicitud_empresa se ON p.solicitud_empresa_id = se.solicitud_empresa_id
    INNER JOIN tbl_usuario u ON se.usuario_id = u.usuario_id
    INNER JOIN tbl_cat_categoria_producto cp ON p.categoria_producto_id = cp.categoria_producto_id
    WHERE u.correo = ?;
  `;

  db.query(query, [userEmail], (error, results) => {
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
  const userEmail = req.params.userEmail;

  const query = `
    SELECT cp.combo_producto_id AS id, cp.nombre AS name, cp.descripcion AS description,
      cp.precio AS price, cp.ilustracion_url AS image, cc.descripcion AS category,
      pd.producto_id AS product_id, p.nombre AS product_name, pd.cantidad AS quantity
    FROM tbl_combo_producto cp
    INNER JOIN tbl_solicitud_empresa se ON cp.solicitud_empresa_id = se.solicitud_empresa_id
    INNER JOIN tbl_usuario u ON se.usuario_id = u.usuario_id
    INNER JOIN tbl_combo_producto_detalle pd ON cp.combo_producto_id = pd.combo_producto_id
    INNER JOIN tbl_producto p ON pd.producto_id = p.producto_id
    INNER JOIN tbl_cat_categoria_producto cc ON cp.categoria_producto_id = cc.categoria_producto_id
    WHERE u.correo = ?;
  `;

  db.query(query, [userEmail], (error, results) => {
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
      res.json(Object.values(combos));
    }
  });
};

exports.singleProduct = (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT p.producto_id AS id, p.nombre AS name, p.descripcion AS description, p.precio_unitario AS price, p.ilustracion_url AS image, cp.descripcion AS category
    FROM tbl_producto p
    INNER JOIN tbl_cat_categoria_producto cp ON p.categoria_producto_id = cp.categoria_producto_id
    WHERE p.producto_id = ?;
  `;

  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error('Error: Could not get the product', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        const product = results[0];

        const formattedResult = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category
        };

        res.json(formattedResult);
      }
    }
  });
};

exports.productsCategories = (req, res) => {
  const query = `
    SELECT categoria_producto_id, descripcion, ilustracion_url
    FROM tbl_cat_categoria_producto
    WHERE es_combo = 0;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error: Could not get the product categories', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      res.json(results);
    }
  });
};

exports.combosCategories = (req, res) => {
  const query = `
    SELECT categoria_producto_id, descripcion, ilustracion_url
    FROM tbl_cat_categoria_producto
    WHERE es_combo = 1;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error: Could not get the combo categories', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      res.json(results);
    }
  });
};

exports.addCategory = (req, res) => {
  const { name, categoryType, email, image } = req.body;

  const selectQuery = `
    SELECT descripcion
    FROM tbl_cat_categoria_producto
    WHERE descripcion = ?;
  `;

  const insertQuery = `
    INSERT INTO tbl_cat_categoria_producto
    (categoria_producto_id, descripcion, ilustracion_url, es_combo)
    VALUES (default, ?, ?, ?);
  `;

  const esCombo = (categoryType === "Combo") ? 1 : 0;

  const buff = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: `category_images/${Date.now()}_${name}`,
    Body: buff,
    ContentType: 'image'
  };

  s3.upload(uploadParams, (err, uploadData) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const imageUrl = uploadData.Location;

      const values = [name, imageUrl, esCombo];

      db.query(selectQuery, [name], (error, selectResult) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (selectResult.length > 0) {
            res.status(400).json({ error: 'Category already exists' });
          } else {
            db.query(insertQuery, values, (error, result) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.json({ message: 'Category added successfully' });
              }
            });
          }
        }
      });
    }
  });
};

exports.addProduct = (req, res) => {
  const { name, description, price, category, email, image } = req.body;

  const selectCategoryQuery = `
    SELECT categoria_producto_id
    FROM tbl_cat_categoria_producto
    WHERE categoria_producto_id = ?;
  `;

  const selectSolicitudEmpresaQuery = `
    SELECT solicitud_empresa_id
    FROM tbl_solicitud_empresa
    WHERE usuario_id = (
      SELECT usuario_id
      FROM tbl_usuario
      WHERE correo = ?
    );
  `;

  const insertProductQuery = `
    INSERT INTO tbl_producto
    (producto_id, solicitud_empresa_id, descripcion, nombre, precio_unitario, categoria_producto_id, ilustracion_url)
    VALUES (default, ?, ?, ?, ?, ?, ?);
  `;

  db.query(selectCategoryQuery, [category], (error, categoryResult) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (categoryResult.length === 0) {
        res.status(400).json({ error: 'Category not found' });
      } else {
        const categoryId = categoryResult[0].categoria_producto_id;

        db.query(selectSolicitudEmpresaQuery, [email], (error, solicitudEmpresaResult) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            if (solicitudEmpresaResult.length === 0) {
              res.status(400).json({ error: 'Company request not found' });
            } else {
              const solicitudEmpresaId = solicitudEmpresaResult[0].solicitud_empresa_id;

              const buff = new Buffer.from(
                image.replace(/^data:image\/\w+;base64,/, ''),
                'base64'
              );

              const uploadParams = {
                Bucket: AWS_BUCKET_NAME,
                Key: `product_images/${Date.now()}_${name}`,
                Body: buff,
                ContentType: 'image'
              };

              s3.upload(uploadParams, (err, uploadData) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  const imageUrl = uploadData.Location;

                  const values = [solicitudEmpresaId, description, name, price, categoryId, imageUrl];
                  db.query(insertProductQuery, values, (error, result) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({ error: 'Internal server error' });
                    } else {
                      res.json({ message: 'Product added successfully' });
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
};

exports.addCombo = (req, res) => {
  const { name, description, price, category, email, products, image } = req.body;

  const getCategoryIDQuery = `
    SELECT categoria_producto_id
    FROM tbl_cat_categoria_producto
    WHERE categoria_producto_id = ?;
  `;

  db.query(getCategoryIDQuery, [category], (error, categoryResults) => {
    if (error) {
      console.error('Error: Could not get the category', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      if (categoryResults.length === 0) {
        console.error('Category not founded');
        res.status(400).json({ error: 'Category not founded' });
        return;
      }

      const categoryID = categoryResults[0].categoria_producto_id;
      const getSolicitudEmpresaIDQuery = `
        SELECT solicitud_empresa_id
        FROM tbl_solicitud_empresa
        WHERE usuario_id IN (
          SELECT usuario_id
          FROM tbl_usuario
          WHERE correo = ?
        );
      `;

      db.query(getSolicitudEmpresaIDQuery, [email], (error, solicitudEmpresaResults) => {
        if (error) {
          console.error('Company request not founded', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (solicitudEmpresaResults.length === 0) {
            console.error('Company request not founded');
            res.status(400).json({ error: 'Company request not founded' });
            return;
          }

          const solicitudEmpresaID = solicitudEmpresaResults[0].solicitud_empresa_id;
          const buff = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: `combo_images/${Date.now()}_${name}`,
            Body: buff,
            ContentType: 'image/png',
          };

          s3.upload(uploadParams, (err, uploadData) => {
            if (err) {
              console.error('Image cannot be uploaded to AWS S3', err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              const imageUrl = uploadData.Location;

              const insertComboQuery = `
                INSERT INTO tbl_combo_producto (nombre, descripcion, precio, fecha_creacion, categoria_producto_id, ilustracion_url, solicitud_empresa_id)
                VALUES (?, ?, ?, NOW(), ?, ?, ?);
              `;

              db.query(
                insertComboQuery,
                [name, description, price, categoryID, imageUrl, solicitudEmpresaID],
                (error, insertResults) => {
                  if (error) {
                    console.error('Combo cannot be inserted', error);
                    res.status(500).json({ error: 'Internal server error' });
                  } else {
                    const comboID = insertResults.insertId;
                    const insertComboDetailsQuery = `
                      INSERT INTO tbl_combo_producto_detalle (producto_id, cantidad, combo_producto_id)
                      VALUES ?;
                    `;

                    const comboDetailsValues = products.map((product) => [
                      product.id,
                      product.quantity,
                      comboID,
                    ]);

                    db.query(
                      insertComboDetailsQuery,
                      [comboDetailsValues],
                      (error, insertDetailsResults) => {
                        if (error) {
                          console.error('Combo details cannot be inserted', error);
                          res.status(500).json({ error: 'Internal server error' });
                        } else {
                          res.json({ success: true });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      });
    }
  });
};

exports.editProduct = (req, res) => {
  const { id, name, description, price, category, image } = req.body;

  const selectCategoryQuery = `
    SELECT categoria_producto_id
    FROM tbl_cat_categoria_producto
    WHERE categoria_producto_id = ?;
  `;

  const selectProductQuery = `
    SELECT ilustracion_url
    FROM tbl_producto
    WHERE producto_id = ?;
  `;

  const updateProductQuery = `
    UPDATE tbl_producto
    SET nombre = ?, descripcion = ?, precio_unitario = ?, categoria_producto_id = ?, ilustracion_url = ?
    WHERE producto_id = ?;
  `;

  db.query(selectCategoryQuery, [category], (error, categoryResult) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (categoryResult.length === 0) {
        res.status(400).json({ error: 'Category not found' });
      } else {
        const categoryId = categoryResult[0].categoria_producto_id;

        if (image !== "") {
          const buff = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''),
            'base64'
          );

          const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: `product_images/${Date.now()}_${name}`,
            Body: buff,
            ContentType: 'image'
          };

          s3.upload(uploadParams, (err, uploadData) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              const imageUrl = uploadData.Location;

              const values = [name, description, price, categoryId, imageUrl, id];
              db.query(updateProductQuery, values, (error, result) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  res.json({ message: 'Product updated successfully' });
                }
              });
            }
          });
        } else {
          db.query(selectProductQuery, [id], (error, productResult) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              const previousImageUrl = productResult[0].ilustracion_url;
              const values = [name, description, price, categoryId, previousImageUrl, id];
              db.query(updateProductQuery, values, (error, result) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  res.json({ message: 'Product updated successfully' });
                }
              });
            }
          });
        }
      }
    }
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  const checkAssociationQuery = `
    SELECT COUNT(*) AS associationCount
    FROM tbl_combo_producto_detalle
    WHERE producto_id = ?;
  `;

  const deleteProductQuery = `
    DELETE FROM tbl_producto
    WHERE producto_id = ?;
  `;

  db.query(checkAssociationQuery, [productId], (error, result) => {
    if (error) {
      console.error('Error: Data asociations failure', error);
      res.status(500).json({ error: 'Error: Intern server failure' });
    } else {
      const associationCount = result[0].associationCount;
      if (associationCount > 0) {
        res.status(400).json({ error: 'Cannot delete, combos already have this product' });
      } else {
        db.query(deleteProductQuery, [productId], (error, deleteResult) => {
          if (error) {
            console.error('Error: The product could not be deleted', error);
            res.status(500).json({ error: 'Error: Intern server failure' });
          } else {
            res.json({ message: 'Product successfully removed' });
          }
        });
      }
    }
  });
};

exports.orders = (req, res) => {
  const companyId = req.params.id;

  const getCompanyIdQuery = `
    SELECT solicitud_empresa_id FROM tbl_solicitud_empresa WHERE usuario_id = ?;
  `;

  const getOrderQuery = `
    SELECT p.pedido_id AS order_id, p.fecha_pedido AS order_date, e.descripcion AS state_id, p.total_pedido AS total, p.no_tarjeta AS card_number, p.descripcion AS description, c.descuento
    FROM tbl_pedido p
    INNER JOIN tbl_pedido_estado e ON p.estado_id = e.estado_id
    LEFT JOIN tbl_cupones c ON p.pedido_id = c.pedido_id
    WHERE p.empresa_id = ? AND p.estado_id IN (1, 2);
  `;

  const getCombosQuery = `
    SELECT cp.nombre AS name, pc.cantidad AS quantity
    FROM tbl_pedido_combo pc
    INNER JOIN tbl_combo_producto cp ON pc.combo_id = cp.combo_producto_id
    WHERE pc.pedido_id = ?;
  `;

  const getProductsQuery = `
    SELECT pr.nombre AS name, pp.cantidad AS quantity
    FROM tbl_pedido_producto pp
    INNER JOIN tbl_producto pr ON pp.producto_id = pr.producto_id
    WHERE pp.pedido_id = ?;
  `;

  db.query(getCompanyIdQuery, [companyId], (error, companyIdResults) => {
    if (error) {
      console.error('Error: Failed to fetch company data', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      if (companyIdResults.length === 0) {
        res.status(400).json({ error: 'No company found for the specified user' });
        return;
      }

      const solicitudEmpresaId = companyIdResults[0].solicitud_empresa_id;

      db.query(getOrderQuery, [solicitudEmpresaId], (error, orderResults) => {
        if (error) {
          console.error('Error: Failed to fetch order data', error);
          res.status(500).json({ error: 'Error: Internal server failure' });
        } else {
          if (orderResults.length === 0) {
            res.status(400).json({ error: 'No orders found for the specified company' });
            return;
          }

          const orders = [];

          for (const orderResult of orderResults) {
            const currentDate = orderResult.order_date;
            const orderData = {
              order_id: orderResult.order_id,
              order_date: currentDate,
              state_id: orderResult.state_id,
              total: orderResult.total,
              card_number: orderResult.card_number.substring(0, 10) + 'X'.repeat(6),
              description: orderResult.description,
              combos: [],
              products: []
            };

            const couponDiscount = orderResult.descuento;
            if (couponDiscount) {
              orderData.total -= orderData.total * 0.15;
            }

            db.query(getCombosQuery, [orderData.order_id], (error, comboResults) => {
              if (error) {
                console.error('Error: Failed to fetch combo data', error);
                res.status(500).json({ error: 'Error: Internal server failure' });
              } else {
                for (const combo of comboResults) {
                  orderData.combos.push({ name: combo.name, quantity: combo.quantity });
                }

                db.query(getProductsQuery, [orderData.order_id], (error, productResults) => {
                  if (error) {
                    console.error('Error: Failed to fetch product data', error);
                    res.status(500).json({ error: 'Error: Internal server failure' });
                  } else {
                    for (const product of productResults) {
                      orderData.products.push({ name: product.name, quantity: product.quantity });
                    }

                    orders.push(orderData);

                    if (orders.length === orderResults.length) {
                      res.json(orders);
                    }
                  }
                });
              }
            });
          }
        }
      });
    }
  });
};

exports.orderAccept = (req, res) => {
  const orderId = req.params.id;

  const updateQuery = `
    UPDATE tbl_pedido
    SET fecha_empresa = NOW(), estado_id = 2
    WHERE pedido_id = ?;
  `;

  db.query(updateQuery, [orderId], (error, results) => {
    if (error) {
      console.error('Error: Failed to update order data', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.json({ message: 'Order updated successfully' });
      }
    }
  });
};

exports.orderReady = (req, res) => {
  const orderId = req.params.id;

  const updateQuery = `
    UPDATE tbl_pedido
    SET estado_id = 3
    WHERE pedido_id = ?;
  `;

  db.query(updateQuery, [orderId], (error, results) => {
    if (error) {
      console.error('Error: Failed to update order data', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.json({ message: 'Order updated successfully' });
      }
    }
  });
};

exports.bestSeller = (req, res) => {
  const companyId = req.params.id;

  const getCompanyIdQuery = `
    SELECT solicitud_empresa_id FROM tbl_solicitud_empresa WHERE usuario_id = ?;
  `;

  db.query(getCompanyIdQuery, [companyId], (error, companyIdResults) => {
    if (error) {
      console.error('Error: Failed to fetch company ID', error);
      res.status(500).json({ error: 'Error: Internal server failure' });
    } else {
      if (companyIdResults.length > 0) {
        const solicitudEmpresaId = companyIdResults[0].solicitud_empresa_id;

        const getPedidoIdsQuery = `
          SELECT pedido_id FROM tbl_pedido WHERE empresa_id = ?;
        `;

        db.query(getPedidoIdsQuery, [solicitudEmpresaId], (error, pedidoIdsResults) => {
          if (error) {
            console.error('Error: Failed to fetch pedido IDs', error);
            res.status(500).json({ error: 'Error: Internal server failure' });
          } else {
            if (pedidoIdsResults.length > 0) {
              const pedidoIds = pedidoIdsResults.map(result => result.pedido_id);

              const getProductCountsQuery = `
                SELECT producto_id, SUM(cantidad) AS total_cantidad
                FROM tbl_pedido_producto
                WHERE pedido_id IN (?)
                GROUP BY producto_id
                ORDER BY total_cantidad DESC
                LIMIT 1;
              `;

              db.query(getProductCountsQuery, [pedidoIds], (error, productCountsResults) => {
                if (error) {
                  console.error('Error: Failed to fetch product counts', error);
                  res.status(500).json({ error: 'Error: Internal server failure' });
                } else {
                  if (productCountsResults.length > 0) {
                    const mostSoldProductId = productCountsResults[0].producto_id;

                    const getProductNameQuery = `
                      SELECT nombre
                      FROM tbl_producto
                      WHERE producto_id = ?;
                    `;

                    db.query(getProductNameQuery, [mostSoldProductId], (error, productNameResults) => {
                      if (error) {
                        console.error('Error: Failed to fetch product name', error);
                        res.status(500).json({ error: 'Error: Internal server failure' });
                      } else {
                        if (productNameResults.length > 0) {
                          const productName = productNameResults[0].nombre;
                          const count = productCountsResults[0].total_cantidad;

                          res.json({ productName, count });
                        } else {
                          res.status(500).json({ error: 'Product name not found' });
                        }
                      }
                    });
                  } else {
                    res.status(500).json({ error: 'No products found in the orders' });
                  }
                }
              });
            } else {
              res.status(500).json({ error: 'No orders found for the company' });
            }
          }
        });
      } else {
        res.status(500).json({ error: 'Company not found' });
      }
    }
  });
};

exports.history = (req, res) => {
  const companyId = req.params.id;

  const getOrderQuery = `
    SELECT 
      p.pedido_id AS order_id,
      i.nombres AS client_firstNames,
      i.apellidos AS client_lastNames,
      i.no_celular AS client_phone,
      dm.descripcion AS department,
      cm.descripcion AS municipality,
      IFNULL(se.nombres, '*Aun no asignado') AS deliveryMan_firstNames,
      IFNULL(se.apellidos, '*Aun no asignado') AS deliveryMan_lastNames,
      DATE(p.fecha_pedido) AS order_date,
      IFNULL(p.calificacion_repartidor, -1) AS calification,
      IFNULL(p.calificacion_descripcion, '*Aun no entregado') AS calification_description,
      pe.descripcion AS state,
      CASE
        WHEN c.pedido_id IS NOT NULL THEN p.total_pedido - (p.total_pedido * 0.15)
        ELSE p.total_pedido
      END AS total
    FROM
      tbl_pedido AS p
      INNER JOIN tbl_informacion_usuario AS i ON p.usuario_id = i.usuario_id
      INNER JOIN tbl_cat_municipio AS cm ON i.municipio = cm.municipio_id
      LEFT JOIN tbl_solicitud_repartidor AS se ON p.repartidor_id = se.solicitud_repartidor_id
      INNER JOIN tbl_cat_departamento AS dm ON cm.departamento_id = dm.departamento_id
      INNER JOIN tbl_pedido_estado AS pe ON p.estado_id = pe.estado_id
      LEFT JOIN tbl_cupones AS c ON p.pedido_id = c.pedido_id
    WHERE
      p.usuario_id = i.usuario_id AND
      p.empresa_id = (SELECT solicitud_empresa_id FROM tbl_solicitud_empresa WHERE usuario_id = ?);
`;

  db.query(getOrderQuery, [companyId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener los pedidos.' });
    }
    const modifiedResults = results.map((result) => {
      return {
        order_id: result.order_id,
        client_firstNames: result.client_firstNames,
        client_lastNames: result.client_lastNames,
        client_lastNamesphone: result.client_phone,
        department: result.department,
        municipality: result.municipality,
        deliveryMan_firstNames: result.deliveryMan_firstNames,
        deliveryMan_lastNames: result.deliveryMan_lastNames,
        calification: result.calification,
        calification_description: result.calification_description,
        order_date: result.order_date.toISOString().split('T')[0],
        state: result.state,
        total: result.total,
      };
    });
    return res.status(200).json(modifiedResults);
  });
};
