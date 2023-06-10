const express = require('express');
const app = express();
const port = 5000;

const mainRoutes = require('./routes/mainRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

app.use(express.json());

app.use('/', mainRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

app.listen(port, () => {
  console.log(`Information: Server running on http://localhost:${port}`);
});
