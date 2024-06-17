
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const documentRoutes = require('./routes/documents');
const cors = require('cors')

const app = express();
const path = require('path')

app.use(cors())
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/documents', documentRoutes);
// app.use(express.static(path.join(__dirname, '../client/dist')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
