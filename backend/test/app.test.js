
const request = require('supertest');
const app = require('../app');
const db = require('../database.js');

jest.mock('../database.js', () => ({
    //getConnection: jest.fn(),
    query: jest.fn(),
}));

/*
afterAll((done) => {
    //console.log("After all Tests");
    // Closing the DB connection allows Jest to exit successfully.
    try {
        db.end();
        //app.close();
        //await app.close();
        done()
      } catch (err) {
        if (err) throw err;
        done()
      }
});*/


describe('GET /', function() {
  it('Get response from /', async function() {
      const response = await request(app)
      .get('/')
      .set('Accept', 'application/json');
      expect(response.statusCode).toBe(200);     
  });
});


/*-----------------------------
    COMPANY CONTROLLER
---------------------------------*/ 

describe('GET /company', function() {
    it('Get response from /company', async function() {
        const response = await request(app)
        .get('/company')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});


describe('GET /company/controlPanel/categories', function() {
    const mockRows = [
        {
            "id": 1,
            "name": "Entradas",
            "image": "https://alchilazo-bucket.s3.us-east-2.amazonaws.com/category_images/1687392974141_Entradas",
            "type": "Producto"
        }
    ];

    //Mock the pool method implementations
    db.query.mockImplementation((query, callback) => {
        callback(null, mockResult);
      });
       

    it('Get response from /company/controlPanel/categories', async function() {
        const result = await request(app)
        .get('/company/controlPanel/categories')
        .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(mockRows);
    });
});




/*-----------------------------
    DEPARTMENT CONTROLLER
---------------------------------*/