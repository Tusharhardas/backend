const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./src/config/database');

// Models
const User = require('./src/models/User');
const Article = require('./src/models/Article');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/articles', require('./src/routes/articleRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));

app.get('/', (req, res) => {
    res.send('Knowledge Sharing Platform API');
});

// Error Middleware
const { errorHandler } = require('./src/middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log('Database sync error:', err));
