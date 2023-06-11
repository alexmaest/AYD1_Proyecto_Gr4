const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const mainRoutes = require('./routes/mainRoutes');
const loginRoutes = require('./routes/loginRoutes');
const userRegisterRoutes = require('./routes/register/userRegisterRoutes');
const companyRegisterRoutes = require('./routes/register/companyRegisterRoutes');
const deliveryRegisterRoutes = require('./routes/register/deliveryRegisterRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(express.json());
app.use(cors());

app.use('/', mainRoutes);
app.use('/login', loginRoutes);
app.use('/userRegister', userRegisterRoutes);
app.use('/companyRegister', companyRegisterRoutes);
app.use('/deliveryRegister', deliveryRegisterRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Information: Server running on http://localhost:${port}`);
});
