const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(`${__dirname}/signup.html`);    
})

app.post("/", function(req,res){
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    // app ids and keys
    const apikey = process.env.API_KEY;
    const listID = process.env.LIST_ID;
    const serverID = process.env.SERVER_ID;

    const url = `https://${serverID}.api.mailchimp.com/3.0/lists/${listID}`;
    
    const options = {
        method: "POST",
        auth: `cowsrus:${apikey}`
    }

    const request = https.request(url, options, function(response){        
        if (response.statusCode === 200){
            res.sendFile(`${__dirname}/success.html`);
        } else{
            res.sendFile(`${__dirname}/failure.html`);
        } 
    })

    request.write(jsonData); 
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.post("/success", function(req,res){
    res.redirect("/");
})

app.listen(port, function(){
    console.log(`Server is running on port ${port}`);
})