let express = require('express');
let app = express();

const logger = require('./logger').logger;
app.use(logger);
app.use(express.static('public'));

app.get('/', (req, res) => 
{

});


app.listen(3000, () =>
{
    console.log('-> Server up.');
});