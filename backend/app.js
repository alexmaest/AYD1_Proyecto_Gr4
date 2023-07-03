const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const mainRoutes = require('./routes/mainRoutes');
const loginRoutes = require('./routes/loginRoutes');
const userRegisterRoutes = require('./routes/register/userRegisterRoutes');
const companyRegisterRoutes = require('./routes/register/companyRegisterRoutes');
const deliveryRegisterRoutes = require('./routes/register/deliveryRegisterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const deliveryManRoutes= require('./routes/deliveryManRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const companyRoutes= require('./routes/companyRoutes');
const userRoutes= require('./routes/userRoutes');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(cors());

app.use('/', mainRoutes);
app.use('/login', loginRoutes);
app.use('/userRegister', userRegisterRoutes);
app.use('/companyRegister', companyRegisterRoutes);
app.use('/deliveryRegister', deliveryRegisterRoutes);
app.use('/admin', adminRoutes);
app.use('/departments', departmentRoutes);
app.use('/deliveryMan',deliveryManRoutes);
app.use('/company',companyRoutes);
app.use('/user',userRoutes);

module.exports = app;