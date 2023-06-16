const AWS = require('aws-sdk');
const db = require('../database');
require('dotenv').config();

// AWS S3 configuration
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_PUBLIC_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION
});


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
  const{name,categoryType,email,image}= req.body;
  const select_query = `
  select descripcion from tbl_cat_categoria_producto
  where descripcion= ? `;

  const insert_query = `
  INSERT INTO tbl_cat_categoria_producto
  (categoria_producto_id,descripcion,ilustracion_url,es_combo)
  VALUES(default,?,?,?);
  `;

 // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: Date.now() + '-' + name, // type is not required
    Body: base64Data,
    //ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  }
  const uploadPromise = s3.upload(params).promise();
  uploadPromise
  .then(function(data){
 
      var es_combo=0; 
      if(categoryType.toLowerCase()=='combo'){
        es_combo=1;
      } else {
        es_combo=0;
      }
      //validates that category is not exist
        const values = [descripcion=name,
          ilustracion_url=data.Location||null,
          es_combo];
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
                  res.json({"message":'Category added succesfully: ' + data.Location});
                  console.log('Category added succesfully: ' + data.Location);
                }
              });
            }
          }
        });
    
  })
  .catch(function(error){
    console.log(error);
  });
  

  
};