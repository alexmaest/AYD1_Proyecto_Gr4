const fs = require('fs');
const request = require('supertest');
const app = require('../app');
const db = require('../database.js');
const path = require('path');



// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

   beforeAll(async () => {
        if (process.env.NODE_ENV === "test") {
            console.log('Clean data tests');
            
            db.query('CALL sp_cleanDataAndReset();', function (err, result) {
                if (err) console.error( err);
                console.log("Database cleaned"+result);
            });
        }else{
            console.log('Test can run only in NODE_ENV=`test` enviroment');
            process.exit(0);
        }
    });

    

    afterAll(async () => {
        console.log('Closing DB connection');
        db.destroy();
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
describe('Testing register user(client) correctly', function() {
    //const ahora = Date.now();
    const userData =
            {
                firstName:"usr"+Date.now(), 
                lastName:"lstnm", 
                email:Date.now()+"@alchilazo.com", 
                password:"123", 
                phoneNumber:"11115555",
                municipality:"Santa Cruz Verapaz",
                department:"Alta Verapaz"
            };

    it('Get main rout /userRegister/', async function() {
        const response = await request(app)
        .get('/userRegister')
        expect(response.statusCode).toBe(200);
    });        
        
    it('POST data to endpoint: /userRegister/', async function() {
        const response = await request(app)
        .post('/userRegister')
        .send(userData); // send empty object
        //.set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('Post Register user with existing email error 400', async function() {
        const response = await request(app)
        .post('/userRegister')
        .send(userData);
        expect(response.statusCode).toBe(400);
    });

    it('Post Register user with invalid municipality', async function() {
        const response = await request(app)
        .post('/userRegister')
        .send({
            firstName:"usr"+Date.now(), 
            lastName:"lstnm", 
            email:Date.now()+"@alchilazo.com", 
            password:"123", 
            phoneNumber:"11115555",
            municipality:"Santa lucia ayampuc",
            department:"Alta Verapaz"
        });
        expect(response.statusCode).toBe(400);
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
    email:Date.now()+"rep1@test.com", 
    phone:"99998888", 
    town:"Guatemala", 
    department:"Guatemala", 
    hasLicense:"true", 
    licenseType:"C", 
    hasVehicle:"true", 
    password:"123"  
    }; 

    it('POST data to endpoint: /deliveryRegister/', async function() {
        const response = 
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
        .attach('cv', path.resolve(__dirname,'./helpers/testFile.pdf'));
        expect(response.statusCode).toBe(200); 
    }); 

    it('POST email alredy exist /deliveryRegister/', async function() {
        const response = 
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
        .attach('cv', path.resolve(__dirname,'./helpers/testFile.pdf'));
        expect(response.statusCode).toBe(400); 
    }); 

    it('POST delivery without license /deliveryRegister/', async function() {
        const response = 
        await request(app)
        .post('/deliveryRegister')
        .field('name', deliveryData.name)
        .field('lastName', deliveryData.lastName)
        .field('email', Date.now()+"rep1@test.com")
        .field('phone', deliveryData.phone)
        .field('town', deliveryData.town)
        .field('department', deliveryData.department)
        .field('hasLicense', 'false')
        .field('licenseType', deliveryData.licenseType)
        .field('hasVehicle', 'false')
        .field('password', deliveryData.password)
        .attach('cv', path.resolve(__dirname,'./helpers/testFile.pdf'));
        expect(response.statusCode).toBe(200); 
    }); 
});



/*-----------------------------
    REGISTER COMPANY
---------------------------------*/ 
describe('Testing resgiser company', function() {
    const companyData={
        name:"comptest1", 
        email:"empresa_"+Date.now()+"@alchilazo.com", 
        description:"empresa test 1", 
        type:'Restaurante', 
        town:"Guatemala", 
        department:"Guatemala", 
        zone:"zona 1", 
        password:"123"
    };
    it('POST /companyRegister', async function() {
        const response = await request(app)
        .post('/companyRegister')
        .set('Accept', 'application/json')
        .field('name', companyData.name)
        .field('email', companyData.email)
        .field('description', companyData.description)
        .field('type', companyData.type)
        .field('town', companyData.town)
        .field('department', companyData.department)
        .field('zone', companyData.zone)
        .field('password', companyData.password)
        .attach('pdfFiles', path.resolve(__dirname,'./helpers/testFile.pdf'))
        ;
        expect(response.statusCode).toBe(200);     
    });

    it('POST company register municipality invalid' , async function() {
        const response = await request(app)
        .post('/companyRegister')
        .set('Accept', 'application/json')
        .field('name', companyData.name)
        .field('email', companyData.email)
        .field('description', companyData.description)
        .field('type', companyData.type)
        .field('town', 'Santa lucia ayampuc')
        .field('department', companyData.department)
        .field('zone', companyData.zone)
        .field('password', companyData.password)
        .attach('pdfFiles', path.resolve(__dirname,'./helpers/testFile.pdf'))
        ;
        expect(response.statusCode).toBe(400);     
    });
});


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
                description:"Delivery Rejected"
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
        description:"Company Approved"
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
        description:"Company rejected"
    };
    it('POST response from /admin/companyRequests', async function() {
        const response = await request(app)
        .post('/admin/companyRequests')
        .send(data) // send empty object
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
}); 

describe('Testing /admin/deliveryChangeLocationRequests', function() {
    it('Get response from /admin/deliveryChangeLocationRequests', async function() {
        const response = await request(app)
        .get('/admin/deliveryChangeLocationRequests')
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

describe('Testing /admin/usersToDisable', function() {
    it('Get response from /admin/usersToDisable', async function() {
        const response = await request(app)
        .get('/admin/usersToDisable')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('put response from /admin/userDisabled', async function() {
        const response = await request(app)
        .put('/admin/userDisabled/3')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

//companyTop5
describe('Testing /admin/companyTop5', function() {
    it('Get response from /admin/companyTop5', async function() {
        const response = await request(app)
        .get('/admin/companyTop5')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

//deliveryTop5
describe('Testing /admin/deliveryTop5', function() {
    it('Get response from /admin/deliveryTop5', async function() {
        const response = await request(app)
        .get('/admin/deliveryTop5')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});
//productsTopGlobal
describe('Testing /admin/productsTopGlobal', function() {
    it('Get response from /admin/productsTopGlobal', async function() {
        const response = await request(app)
        .get('/admin/productsTopGlobal')
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
        .send({correo: 'admin@alchilazo.com', clave: 'admin'})
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
        .send({correo: 'admin@alchilazo.com', clave: '#BadPassword'})
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

    describe('Testing /company/controlPanel/categories', function() {
        
        it('Get response from /company/controlPanel/categories', async function() {
            const result = await request(app)
            .get('/company/controlPanel/categories')
            .set('Accept', 'application/json');
            expect(result.statusCode).toEqual(200);
            
        });
    });

    describe('Testing endpoint /company/controlPanel/productsCategories', function() {
        it('Get response from /company/controlPanel/productsCategories', async function() {
            const result = await request(app)
            .get('/company/controlPanel/productsCategories')
            .set('Accept', 'application/json');
            expect(result.statusCode).toEqual(200);
        });
    });

    describe('Testing endpoint /company/controlPanel/combosCategories', function() {
        it('Get response from /company/controlPanel/combosCategories', async function() {
            const result = await request(app)
            .get('/company/controlPanel/combosCategories')
            .set('Accept', 'application/json');
            expect(result.statusCode).toEqual(200);
            
        });
    });

    describe('Testing endpoint /company/controlPanel/singelProduct', function() {
        it('Get response correctly from endpoint', async function() {
            const result = await request(app)
            .get('/company/controlPanel/singleProduct/'+1)
            //.set('Content-Type', 'application/x-www-form-urlencoded')
            //.send({id:'1'})
            expect(result.statusCode).toEqual(200);
        });
    
        it('Get response incorrectly from endpoint', async function() {
            const result = await request(app)
            .get('/company/controlPanel/singleProduct')
            //.set('Content-Type', 'application/x-www-form-urlencoded')
            .send({id:'0'});
            expect(result.statusCode).toEqual(404);
        });
    });


    describe('Testing endpoint /company/controlPanel/products/:userEmail', function() {
        it('Get response from /company/controlPanel/products/empresa1@alchilazo.com', async function() {
            const result = await request(app)
            .get('/company/controlPanel/products/empresa1@alchilazo.com')
            .set('Accept', 'application/json');
            expect(result.statusCode).toEqual(200);
        });
    });

    describe('Testing endpoint /company/controlPanel/combos/:userEmail', function() {
        it('Get response from /company/controlPanel/combos/empresa1@alchilazo.com', async function() {
            const result = await request(app)
            .get('/company/controlPanel/combos/empresa1@alchilazo.com')
            .set('Accept', 'application/json');
            expect(result.statusCode).toEqual(200);
        });
    });

    //GET '/orders/:id' Deben existir pedidos
    describe('Testing ADD endpoints from /company/controlPanel', function() {
        var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
        it('POST request to /company/controlPanel/addProduct', async function() {
            var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
            const result = await request(app)
            .post('/company/controlPanel/addProduct')
            .set('Accept', 'application/json')
            .send({
                name:"productX3", 
                description:"Product x3", 
                price:13.33, 
                category:1, 
                email:"empresa1@alchilazo.com", 
                image:'data:image/png;base64,'+imageBase64
            });
            expect(result.statusCode).toEqual(200);
        });
        // /controlPanel/addCombo
        it('POST add combo correctly', async function() {
            //var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
            const result = await request(app)
            .post('/company/controlPanel/addCombo')
            .set('Accept', 'application/json')
            .send({
                name:"combo_"+Date.now(), 
                description:"Combo autogenerado", 
                price:13.33, 
                category:1, 
                email:"empresa1@alchilazo.com",
                products:[{id:1,quantity:2}],
                image:'data:image/png;base64,'+imageBase64
            });
            expect(result.statusCode).toEqual(200);
        });

        it('POST add combo company not found', async function() {
            //var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
            const result = await request(app)
            .post('/company/controlPanel/addCombo')
            .set('Accept', 'application/json')
            .send({
                name:"combo_"+Date.now(), 
                description:"Combo autogenerado", 
                price:13.33, 
                category:1, 
                email:"notexist_empresa@alchilazo.com",
                products:[{id:1,quantity:2}],
                image:'data:image/png;base64,'+imageBase64
            });
            expect(result.statusCode).toEqual(400);
        });

        it('POST add combo company not have products', async function() {
            //var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
            const result = await request(app)
            .post('/company/controlPanel/addCombo')
            .set('Accept', 'application/json')
            .send({
                name:"combo_"+Date.now(), 
                description:"Combo autogenerado", 
                price:13.33, 
                category:1, 
                email:"empresa2@alchilazo.com",
                products:[{id:100,quantity:2}],
                image:'data:image/png;base64,'+imageBase64
            });
            expect(result.statusCode).toEqual(500);
        });

        it('POST add combo category not found', async function() {
            //var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
            const result = await request(app)
            .post('/company/controlPanel/addCombo')
            .set('Accept', 'application/json')
            .send({
                name:"combo_"+Date.now(), 
                description:"Combo autogenerado", 
                price:13.33, 
                category:9, 
                email:"empresa1@alchilazo.com",
                products:[{id:1,quantity:2}],
                image:'data:image/png;base64,'+imageBase64
            });
            expect(result.statusCode).toEqual(400);
        });

        // /controlPanel/addCategory
        it('POST add category correctly', async function() {
            const result = await request(app)
            .post('/company/controlPanel/addCategory')
            .set('Accept', 'application/json')
            .send({
                name:"category_test", 
                categoryType:"Producto", 
                email:"empresa1@alchilazo.com",
                image:'data:image/png;base64,'+imageBase64});
            expect(result.statusCode).toEqual(200);
        });

        it('POST add category exist error 400', async function() {
            const result = await request(app)
            .post('/company/controlPanel/addCategory')
            .set('Accept', 'application/json')
            .send({
                name:"category_test",
                categoryType:"Producto", 
                email:"empresa1@alchilazo.com",
                image:'data:image/png;base64,'+imageBase64});
            expect(result.statusCode).toEqual(400);
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

/*-----------------------------
    USER CONTROLLER
---------------------------------*/

describe('Testing endpoint root user: GET /user', function() {
    it('Get response from /user/id', async function() {
        const response = await request(app)
        .get('/user/2')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// dashboard/categories
describe('Testing endpoint dashboard/categories: GET /dashboard/categories', function() {
    it('Get response from /dashboard/categories', async function() {
        const response = await request(app)
        .get('/user/dashboard/categories')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// dashboard/company/:id
describe('Testing endpoint dashboard/company/:id: GET /dashboard/company/:id', function() {
    it('Get response from /dashboard/company/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/company/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// dashboard/company/products/:id
describe('Testing endpoint dashboard/company/products/:id: GET /dashboard/company/products/:id', function() {
    it('Get response from /dashboard/company/products/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/company/products/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// dashboard/company/combos/:id
describe('Testing endpoint dashboard/company/combos/:id: GET /dashboard/company/combos/:id', function() {
    it('Get response from /dashboard/company/combos/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/company/combos/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// dashboard/company/categories/:id
describe('Testing endpoint dashboard/company/categories/:id: GET /dashboard/company/categories/:id', function() {
    it('Get response from /dashboard/company/categories/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/company/categories/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

// PUT dashboard/qualifyDeliveryMan


// POST dashboard/search
describe('Testing endpoint /user/dashboard', function() {
    it('POST response from /search', async function() {
        const response = await request(app)
        .post('/user/dashboard/search')
        .set('Accept', 'application/json')
        .send({search:'pizza'});
        expect(response.statusCode).toBe(200);
    });
});


// POST dashboard/shoppingCart
// - Prueba correcta
describe('Testing endpoint dashboard/shoppingCart: POST /dashboard/shoppingCart', function() {
    it('POST shopping without cuppon /dashboard/shoppingCart', async function() {
        const response = await request(app)
        .post('/user/dashboard/shoppingCart')
        .set('Accept', 'application/json')
        .send({
            "user_id":2,
            "company_id":1,
            "description":"shoping description1",
            "card_number":"123456789",
            "cvv":"111",
            "due_date":"2023-06-30",
            "coupon":"",
            "total":13.56,
            "products":[
                {"id":1,"quantity":1}
            ],
            "combos":[
            {   "id":1,"quantity":2}
            ]
            });
            expect(response.statusCode).toBe(200);
        });

        it('POST shopping with cupon and existing card', async function() {
            const response = await request(app)
            .post('/user/dashboard/shoppingCart')
            .set('Accept', 'application/json')
            .send({
                "user_id":2,
                "company_id":1,
                "description":"shoping description4",
                "card_number":"123456789",
                "cvv":"111",
                "due_date":"2023-06-30",
                "coupon":"ABCD1234",
                "total":13.56,
                "products":[
                    {"id":1,"quantity":1}
                ],
                "combos":[
                {   "id":1,"quantity":2}
                ]
                });
                expect(response.statusCode).toBe(200);
            });
            // - mismo cupo deberia dar error
            it('POST second shopping with same cupon /dashboard/shoppingCart', async function() {
                const response = await request(app)
                .post('/user/dashboard/shoppingCart')
                .set('Accept', 'application/json')
                .send({
                    "user_id":2,
                    "company_id":1,
                    "description":"shoping description5",
                    "card_number":"123456789",
                    "cvv":"111",
                    "due_date":"2023-06-30",
                    "coupon":"ABCD1234",
                    "total":13.56,
                    "products":[
                        {"id":1,"quantity":1}
                    ],
                    "combos":[
                    {   "id":1,"quantity":2}
                    ]
                    });
                    expect(response.statusCode).toBe(503);
                }); 

                it('POST shopping without products or combos /dashboard/shoppingCart', async function() {
                    const response = await request(app)
                    .post('/user/dashboard/shoppingCart')
                    .set('Accept', 'application/json')
                    .send({
                        "user_id":2,
                        "company_id":1,
                        "description":"shoping description6",
                        "card_number":"123456789",
                        "cvv":"111",
                        "due_date":"2023-06-30",
                        "coupon":"ABCD1234",
                        "total":13.56,
                        "products":[],
                        "combos":[]
                        });
                        expect(response.statusCode).toBe(503);
                    }); 
    }); 

// dashboard/history/:id
// Historial de pedidos(debe haber al menos un pedido)
describe('Testing endpoint dashboard/history/:id: GET /dashboard/history/:id', function() { 
    it('Get history 200 from /dashboard/history/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/history/2')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('Get error 404 from /dashboard/history/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/history/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(404);
    });
});

// dashboard/ordersDelivered/:id
// Calificar repartidor(debe haber al menos un pedido entregado)
describe('Testing endpoint dashboard/ordersDelivered/:id: GET /dashboard/ordersDelivered/:id', function() {
    it('Get error 404 orders not found from /dashboard/ordersDelivered/:id', async function() {
        const response = await request(app)
        .get('/user/dashboard/ordersDelivered/2')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(404);
    });
});

/*-----------------------------
    COMPANY CONTROLLER
        - ORDER Accept 
        - ORDER READY
---------------------------------*/
describe('Testing company order manage',function(){
    it('PUT Accept order', async function(){
        const response = await request(app)
        .put('/company/orderAccept/1')
        .set('Accept', 'application/json')
        ;
        expect(response.statusCode).toBe(200);
    });

    it('PUT order ready', async function(){
        const response = await request(app)
        .put('/company/orderReady/1')
        .set('Accept', 'application/json')
        ;
        expect(response.statusCode).toBe(200);
    });
});

/*-----------------------------
    DELIVERYMAN CONTROLLER
    - /deliveryMan/
    - /deliveryMan/deliveryManInfoRequest/:correo
---------------------------------*/

// deliveryMan change status to entregdo
describe('Testing deliveryMan route',function(){
    it('PUT order ready', async function(){
        const response = await request(app)
        .get('/deliveryMan')
        ;
        expect(response.statusCode).toBe(200);
    });

    it('Get deliveryManInfoRequest', async function(){
        const email = 'repartidor1@alchilazo.com';
        const response = await request(app)
        .get(`/deliveryMan/deliveryManInfoRequest/${email}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('correo');
    });

    it('GET orders', async function(){
        const response = await request(app)
        .get('/deliveryMan/orders/4')
        .set('Accept', 'application/json'); // el primer repartidor registrado es el 4
        expect(response.statusCode).toBe(200);
    });
// /orderPending/:id
    it('GET orderPending', async function(){
        const response = await request(app)
        .get('/deliveryMan/orderPending/4')
        .set('Accept', 'application/json'); // el primer repartidor registrado es el 4
        expect(response.statusCode).toBe(200);
    });

// /qualification/:id
    it('GET qualification', async function(){
        const response = await request(app)
        .get('/deliveryMan/qualification/2')
        .set('Accept', 'application/json'); // el primer repartidor registrado es el 4
        expect(response.statusCode).toBe(200);
    });
// /commissions/:id
    it('GET commissions', async function(){
        const response = await request(app)
        .get('/deliveryMan/commissions/2')
        .set('Accept', 'application/json'); // el primer repartidor registrado es el 4
        expect(response.statusCode).toBe(200);
    });
// /history/:id
    it('GET history', async function(){
        const response = await request(app)
        .get('/deliveryMan/history/2')
        .set('Accept', 'application/json'); // el primer repartidor registrado es el 4
        expect(response.statusCode).toBe(200);
    });
// /changeLocation
    it('POST changeLocation', async function(){
        const response = await request(app)
        .post('/deliveryMan/changeLocation')
        .set('Accept', 'application/json')
        .send({
            id:2, description:'sin rumbo', department:3, municipality:6
        });
        expect(response.statusCode).toBe(200);
    });
// /orderAccept
    it('PUT orderAccept', async function(){
        const response = await request(app)
        .put('/deliveryMan/orderAccept')
        .set('Accept', 'application/json')
        .send({deliveryManId:4, orderId:1});
        expect(response.statusCode).toBe(200);
    });
// /orderDelivered/:id
    it('PUT orderDelivered', async function(){
        const response = await request(app)
        .put('/deliveryMan/orderDelivered/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

/*-----------------------------
    DELIVERYMAN CONTROLLER
    - /user/dashboard/qualifyDeliveryMan
    - //user/dashboard/ordersDelivered/2
---------------------------------*/
describe('Testing user dashboard',function(){
    it('PUT qualifyDeliveryMan', async function(){
        const response = await request(app)
        .put('/user/dashboard/qualifyDeliveryMan')
        .set('Accept', 'application/json')
        .send({deliveryManId:4, orderId:1, qualification:5});
        expect(response.statusCode).toBe(200);
    });

    it('GET ordersDelivered', async function(){
        const response = await request(app)
        .get('/user/dashboard/ordersDelivered/2')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

/*-----------------------------
    COMPANY CONTROLLER
    - /company/orders/:id
    - /company/bestsellers/:id
    - /company/history/:id
    - /company/controlPanel/edtiProduct
    - /company/controlPanel/products/:id
---------------------------------*/
describe('Testing company dashboard',function(){
    it('GET orders', async function(){
        const response = await request(app)
        .get('/company/orders/7')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('GET bestsellers', async function(){
        const response = await request(app)
        .get('/company/bestSeller/7')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('GET ERROR ON bestsellers', async function(){
        const response = await request(app)
        .get('/company/bestSeller/1')
        expect(response.statusCode).toBe(500);
    });

    it('GET history', async function(){
        const response = await request(app)
        .get('/company/history/1')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    it('PUT editProduct', async function(){
        var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
        const response = await request(app)
        .put('/company/controlPanel/editProduct')
        .set('Accept', 'application/json')
        .send({id:1, 
            name:'pizza', 
            description:'pizza', 
            price:19.55, 
            category:1,
            image:'data:image/png;base64,'+imageBase64});
        expect(response.statusCode).toBe(200);
    });

    it('PUT editProduct with no image', async function(){
        var imageBase64= base64_encode(path.resolve(__dirname,'./helpers/testImage.png'));
        const response = await request(app)
        .put('/company/controlPanel/editProduct')
        .set('Accept', 'application/json')
        .send({id:1, 
            name:'pizza', 
            description:'pizza', 
            price:19.55, 
            category:1,
            image:''});
        expect(response.statusCode).toBe(200);
    });

    it('DELETE products', async function(){
        const response = await request(app)
        .delete('/company/controlPanel/products/2')
        .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});