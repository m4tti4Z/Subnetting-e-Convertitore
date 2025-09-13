const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const ipLib = require('ip');

const app = express();
app.set('view engine','ejs');
app.use(express.static("CSS"));//i file statici si trovano nella cartella CSS
app.use(bodyParser.urlencoded({extended:true}));

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'subnetting_converter'
});

app.get("/",(req,res)=>{
    res.render("index");
})

db.connect((err)=>{
    if(err){
        throw err;
        
    }
    console.log("Connesso al database mysql");
})

const port = 3001;
const ipAddress = '127.0.0.1';

app.listen(port,ipAddress,()=>{
    console.log(`Server avviato su http://${ipAddress}:${port}`)
})

app.get('/calc-subnet',(req,res)=>{
    res.render("calc-subnet")
});
app.post('/calc-subnet', (req, res) => {
    const ipInput = req.body.ip;
    const cidr = parseInt(req.body.cidr);

    // VALIDAZIONE
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        return res.send("Errore: CIDR errato");
    }

    if (!ipLib.isV4Format(ipInput)) {
        return res.send("Errore: IP non valido. Usare il formato corretto!");
    }

    const subnetMask = ipLib.fromPrefixLen(cidr); // calcola la subnet mask
    const subnetInfo = ipLib.subnet(ipInput, subnetMask);

    const network = subnetInfo.networkAddress;
    const broadcast = subnetInfo.broadcastAddress;
    const firstHost = subnetInfo.firstAddress;
    const lastHost = subnetInfo.lastAddress;
    const availableHosts = subnetInfo.numHosts;

    const query = 'INSERT INTO logs(ip,cidr,subnet,network,broadcast) VALUES(?,?,?,?,?)';
    db.query(query, [ipInput, cidr, subnetMask, network, broadcast], (err, results) => {
        if (err) throw err;
        console.log("record salvato nel DB", results.insertId);

        res.render("result-subnet", {
            ip: ipInput,
            cidr,
            subnetMask,
            network,
            broadcast,
            firstHost,
            lastHost,
            availableHosts
        });
    });
}); 




app.get("/converter",(req,res)=>{
    res.render("converter");
})

app.post("/converter",(req,res)=>{
    const number = Number(req.body.numero);
    if(isNaN(number)){
        res.send("Numero inserito non valido!");
    }

    const binary = number.toString(2);
    const oct = number.toString(8);
    const hex = number.toString(16);

    const query = 'INSERT INTO numbers(numero_binario,numero_decimale,numero_ottale,numero_esadecimale) VALUES(?,?,?,?)';
    db.query(query,[binary,number,oct,hex],(err,results)=>{
        if(err) throw err;
        console.log("Record salavato nel DB",results.insertId);

        res.render("result-converter",{
            number,
            binary,
            oct,
            hex
        });
    });
});