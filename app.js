const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');

const authRoutes      = require('./src/routes/authRoutes');
const quantityRoutes  = require('./src/routes/quantityRoutes');
const errorHandler    = require('./src/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/v1/quantities', quantityRoutes);

app.use(errorHandler);

module.exports = app;
