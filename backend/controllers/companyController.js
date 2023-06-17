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
    SELECT * FROM tbl_cat_categoria_producto;
  `;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.products = (req, res) => {
  const userEmail = req.params.userEmail;

  const query = `
      SELECT p.*
      FROM tbl_producto p
      INNER JOIN tbl_solicitud_empresa se ON p.solicitud_empresa_id = se.solicitud_empresa_id
      INNER JOIN tbl_usuario u ON se.usuario_id = u.usuario_id
      WHERE u.correo = ?;
  `;

  db.query(query, [userEmail], (error, results) => {
      if (error) {
          console.error('Error al obtener los productos:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
      } else {
          res.json(results);
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
      console.error('Error al obtener los combos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
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

exports.productsCategories = (req, res) => {
  const query = `
    SELECT categoria_producto_id, descripcion, ilustracion_url
    FROM tbl_cat_categoria_producto
    WHERE es_combo = 0;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener las categorías de productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
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
      console.error('Error al obtener las categorías de combos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
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
    WHERE descripcion = ?;
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
              res.status(400).json({ error: 'Solicitud Empresa not found' });
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

  // Obtener el ID de la categoría a partir del valor numérico
  const getCategoryIDQuery = `
    SELECT categoria_producto_id
    FROM tbl_cat_categoria_producto
    WHERE categoria_producto_id = ?;
  `;

  db.query(getCategoryIDQuery, [category], (error, categoryResults) => {
    if (error) {
      console.error('Error al obtener la categoría:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (categoryResults.length === 0) {
        console.error('Categoría no encontrada');
        res.status(400).json({ error: 'Categoría no encontrada' });
        return;
      }

      const categoryID = categoryResults[0].categoria_producto_id;

      // Obtener el ID de solicitud_empresa a partir del correo electrónico
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
          console.error('Error al obtener la solicitud de empresa:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (solicitudEmpresaResults.length === 0) {
            console.error('Solicitud de empresa no encontrada');
            res.status(400).json({ error: 'Solicitud de empresa no encontrada' });
            return;
          }

          const solicitudEmpresaID = solicitudEmpresaResults[0].solicitud_empresa_id;

          // Convertir la imagen a Buffer desde base64
          const buff = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

          // Configuración del objeto de carga para AWS S3
          const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: `combo_images/${Date.now()}_${name}`, // Personaliza la clave según tus requisitos
            Body: buff,
            ContentType: 'image/png', // Cambia el tipo de contenido si es necesario
          };

          // Subir la imagen al bucket de AWS S3
          s3.upload(uploadParams, (err, uploadData) => {
            if (err) {
              console.error('Error al subir la imagen al bucket de AWS S3:', err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              const imageUrl = uploadData.Location;

              // Insertar una nueva fila en tbl_combo_producto
              const insertComboQuery = `
                INSERT INTO tbl_combo_producto (nombre, descripcion, precio, fecha_creacion, categoria_producto_id, ilustracion_url, solicitud_empresa_id)
                VALUES (?, ?, ?, NOW(), ?, ?, ?);
              `;

              db.query(
                insertComboQuery,
                [name, description, price, categoryID, imageUrl, solicitudEmpresaID],
                (error, insertResults) => {
                  if (error) {
                    console.error('Error al insertar el combo:', error);
                    res.status(500).json({ error: 'Internal server error' });
                  } else {
                    const comboID = insertResults.insertId;

                    // Insertar las filas en tbl_combo_producto_detalle
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
                          console.error('Error al insertar los detalles del combo:', error);
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
    WHERE descripcion = ?;
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
