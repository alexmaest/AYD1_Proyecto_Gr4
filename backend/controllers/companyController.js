const db = require('../database');
require('dotenv').config();

exports.main = (req, res) => {
  res.send('Information: Company main page');
};

exports.products = (req, res) => {
  res.send('Information: Company products control panel page');
};

exports.categories = (req, res) => {
    res.send('Information: Company categories control panel page');
};

exports.addCategory = (req, res) => {
  //res.send('Information: Company categories control panel page');
  const { descripcion,ilustracion_url,es_combo } = req.body;

  const select_query = `
  select descripcion from tbl_cat_categoria_producto
  where descripcion= ? `;

  const insert_query = `
  INSERT INTO tbl_cat_categoria_producto
  (categoria_producto_id,descripcion,ilustracion_url,es_combo)
  VALUES(default,?,?,?);
  `;
  //validates that category is not exist
  const values = [descripcion,ilustracion_url,es_combo];
  db.query(select_query,[descripcion],(error,select_result)=>{
    if(error){
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }else{
      if (select_result.length > 0){
        res.status(400).json({ error: 'Category alredy exist' });
      } else {
        db.query(insert_query,values,(error, result) => {
          if(error){
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json({message: 'Category added succesfully'});
          }
        });
      }
    }
  });
};