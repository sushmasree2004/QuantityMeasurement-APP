require('dotenv').config();

const app           = require('./app');
const { sequelize } = require('./src/config/db');

const PORT = process.env.SERVER_PORT || 9097;

sequelize.sync({ alter: true })
    .then(() => {
        console.log(' Database connected & tables synced');
        app.listen(PORT, () => {
            console.log(` Server   :  http://localhost:${PORT}`);

            console.log(` Auth:       http://localhost:${PORT}/api/auth`);
            console.log(` Quantities: http://localhost:${PORT}/api/v1/quantities`);
        });
    })
    .catch(err => {
        console.error(' Failed to connect to database:', err.message);
        process.exit(1);
    });
