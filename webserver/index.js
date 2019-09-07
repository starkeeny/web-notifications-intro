var express = require('express');
var app = express();

app.use(express.static('..'));

app.listen(3000, function () {
    console.log('Static webserver ready for action on port 3000!');
});