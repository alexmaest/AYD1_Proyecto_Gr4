const fs = require('fs');
const request = require('supertest');
const app = require('../app');
const db = require('../database.js');
const path = require('path');
const assert = require('chai').assert;

   /*beforeAll(async () => {
       
        if (process.env.NODE_ENV === "test") {
            console.log('Clean data tests');
            db.query('CALL test.sp_cleanDataAndReset();', function (err, result) {
                if (err) throw err;
                console.log("Database cleaned");
            });
        }else{
            console.log('Not in test enviroment');
        }
    });*/

    console.log('Enviroment:'+ process.env.NODE_ENV);

    afterAll(async () => {
        console.log('Closing DB connection');
        db.end();
    });

    describe('Testing root: GET /', function() {
    it('Get response from /', async function() {
        const response = await request(app)
        .get('/')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);     
    });
    });

/*-----------------------------
    REGISTER USER
---------------------------------*/ 
describe('Testing register user(client) correctly : POST /register', function() {
    const userData =
            {
                firstName:"usr2", 
                lastName:"lstnm2", 
                email:"notexist1@alchilazo.com", 
                password:"123", 
                phoneNumber:"11115555",
                municipality:"Santa Cruz Verapaz",
                department:"Alta Verapaz"
            };
        
    it('POST data to endpoint: /userRegister/', async function() {
        const response = await request(app)
        .post('/userRegister')
        .send(userData) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});


/*-----------------------------
    REGISTER DELIVERY
---------------------------------*/ 
describe('Testing endpoint to register an Delivery : POST /deliveryRegister', function() {
    const deliveryData =
    { 
    name:"rep1", 
    lastName:"lstrep1", 
    email:"rep1@test.com", 
    phone:"99998888", 
    town:"gt", 
    department:"Guatemala", 
    hasLicense:1, 
    licenseType:"C", 
    hasVehicle:1, 
    password:"123"  
    }; 

    it('POST data to endpoint: /deliveryRegister/', async function() {
        
       // let buff = fs.readFileSync(path.resolve(__dirname,'./helpers/filetest.pdf'))
       // let base64data = buffer.from.toString('base64');
        // const response = 
        await request(app)
        .post('/deliveryRegister')
        .field('name', deliveryData.name)
        .field('lastName', deliveryData.lastName)
        .field('email', deliveryData.email)
        .field('phone', deliveryData.phone)
        .field('town', deliveryData.town)
        .field('department', deliveryData.department)
        .field('hasLicense', deliveryData.hasLicense)
        .field('licenseType', deliveryData.licenseType)
        .field('hasVehicle', deliveryData.hasVehicle)
        .field('password', deliveryData.password)
        .attach('file', path.resolve(__dirname,'./helpers/filetest.pdf') ,'filetest.pdf')
        .then((err,res) => {
            if (err) console.error(err);
            expect(res.statusCode).toBe(200); // Asegúrate de que el servidor responda con el código de estado correcto
           // Verifica que el nombre del archivo sea correcto en la respuesta
          done();
        });

    }); 
});

/*-----------------------------
    REGISTER COMPANY
---------------------------------*/ 



/*-----------------------------
    ADMIN CONTROLLER
---------------------------------*/ 

describe('Testing : GET /admin/reports', function() {
    it('Get response from /admin/reports', async function() {
        const response = await request(app)
        .get('/admin/reports')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

describe('Testing : GET /admin/deliveryRequests', function() {
    it('Get response from /admin/deliveryRequests', async function() {
        const response = await request(app)
        .get('/admin/deliveryRequests')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

describe('Testing : GET /admin/companyRequests', function() {
    it('Get response from /admin/companyRequests', async function() {
        const response = await request(app)
        .get('/admin/companyRequests')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});   

// post requests delivery approval
describe('Testing endpoint root admin: GET /admin/deliveryRequests', function() {
    const data =
            {
                id:"1", 
                state:"Aprobado", 
                description:"repartidor aprobado"
            };
    it('POST request from /admin/deliveryRequests', async function() {
        const response = await request(app)
        .post('/admin/deliveryRequests')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// post requests delivery rejection
describe('Testing endpoint root admin: GET /admin/deliveryRequests', function() {
    const data =
            {
                id:"3", 
                state:"Rechazado", 
                description:"repartidor rechazado"
            };
    it('Get response from /admin/deliveryRequests', async function() {
        const response = await request(app)
        .post('/admin/deliveryRequests')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// post requests company approval
describe('Testing get company request: POST /admin/companyRequests', function() {
    const data =
    {
        id:"1", 
        state:"Aprobado", 
        description:"repartidor aprobado"
    };
    it('GET /admin/companyRequests', async function() {
        const response = await request(app)
        .post('/admin/companyRequests')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
}); 

// post requests company reject
describe('Testing reject company: POST /admin/companyRequests', function() {
    const data =
    {
        id:"2", 
        state:"Rechazado", 
        description:"repartidor rechazado"
    };
    it('POST response from /admin/companyRequests', async function() {
        const response = await request(app)
        .post('/admin/companyRequests')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
}); 

//post delivery change location aprove
describe('Testing aprove chande location request: POST /admin/deliveryChangeLocationApprove', function() {
    const data =
    {
        request_id:"1", 
        state:"Aprobado", 
    };
    it('POST response from /admin/deliveryChangeLocationApprove', async function() {
        const response = await request(app)
        .post('/admin/deliveryChangeLocationRequestsApprove')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

//post delivery change location reject
describe('Testing aprove chande location request: POST /admin/deliveryChangeLocationApprove', function() {
    const data =
    {
        request_id:"2", 
        state:"Rechazado", 
    };
    it('POST response from /admin/deliveryChangeLocationApprove', async function() {
        const response = await request(app)
        .post('/admin/deliveryChangeLocationRequestsApprove')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});


/*-----------------------------
    LOGIN CONTROLLER
---------------------------------*/ 
describe('Testing login POST /login', function() {
    it('POST delivery /login', async function() {
        const response = await request(app)
        .post('/login')
        .send({correo: 'repartidor1@alchilazo.com', clave: '123'})
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('POST company /login', async function() {
        const response = await request(app)
        .post('/login')
        .send({correo: 'empresa1@alchilazo.com', clave: '123'})
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('POST admin /login', async function() {
        const response = await request(app)
        .post('/login')
        .send({correo: 'test@alchilazo.com', clave: 'admin'})
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('POST user /login', async function() {
        const response = await request(app)
        .post('/login')
        .send({correo: 'usuario1@alchilazo.com', clave: '123'})
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('POST admin /login', async function() {
        const response = await request(app)
        .post('/login')
        .send({correo: 'test@alchilazo.com', clave: '#BadPassword'})
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(401);
    });
});



/*-----------------------------
    COMPANY CONTROLLER
---------------------------------*/ 

    describe('Testing endpoint root company: GET /company', function() {
        it('Get response from /company', async function() {
            const response = await request(app)
            .get('/company')
            .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
        });
    });


    describe('GET /company/controlPanel/categories', function() {
        
        it('Get response from /company/controlPanel/categories', async function() {
            const result = await request(app)
            .get('/company/controlPanel/categories')
            .set('Accept', 'application/json');
            expect(result.statusCode).toEqual(200);
            
        });
    });

/*-----------------------------
    DEPARTMENT CONTROLLER
---------------------------------*/

describe('Testing endpoing departments: GET /departments', function() {
    it('Get response from /departments', async function() {
        const response = await request(app)
        .get('/departments')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});
