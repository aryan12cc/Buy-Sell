const express = require('express');
const cors = require('cors');

const handleRegistration = require('./routes/registration');
const handleLogout = require('./routes/logout');
const userDetails = require('./routes/userDetails');
const itemOperations = require('./routes/itemOperations');
const cartOperations = require('./routes/cartOperations');
const orderOperations = require('./routes/orderOperations');
const connectDataBase = require('./database');
const { authenticateJWT } = require('./authentication/jwt_authentication');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: "http://localhost:3000"
}));

connectDataBase();

app.use(express.json());

app.post('/api/validate-token', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

app.use('/api/submit-registration', handleRegistration);
app.use('/api/logout-user', handleLogout);
app.use('/api/user-details', userDetails);
app.use('/api/item-operations', itemOperations);
app.use('/api/cart-operations', cartOperations);
app.use('/api/order-operations', orderOperations);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});