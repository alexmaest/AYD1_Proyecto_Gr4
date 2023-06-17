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
