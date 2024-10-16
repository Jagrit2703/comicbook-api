const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const comicRoutes = require('./routes/comicRoutes');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/comics', comicRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
