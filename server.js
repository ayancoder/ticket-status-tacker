const express = require('express');

const app = express();

const PORT = process.env | 5000;

app.get('/', (req, res)=> {
    res.send("welcome");
})
app.listen(PORT, ()=> { console.log(`node started ${PORT}`)})