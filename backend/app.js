const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Welcome message for root URL (you can move this to indexRoutes later)
app.get('/', (req, res) => {
    res.send('Welcome to my backend!');
});

// Use routes
app.use('/', indexRoutes);
app.use('/user', userRoutes);

// Error Handling Middleware
app.use(errorHandler);

const BACKEND_PORT = process.env.BACKEND_PORT || 4000;
app.listen(BACKEND_PORT, () => {
    console.log(`Server running on port ${BACKEND_PORT}`);
});
