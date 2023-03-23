const express = require("express")
const bodyParser = require("body-parser")
const mailchimp = require("@mailchimp/mailchimp_transactional")("b4fd09affb24c8c93b7ca2b1bdff6e42-us21")
const https = require("node:https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req, res)=>{
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/d9ee4b073d"
    const options = {
        method: "POST",
        auth: "prathu2mk:b4fd09affb24c8c93b7ca2b1bdff6e42-us21"
    }

    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")

        }
        
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });
    });

    request.on("error", (err)=>{
        console.log(err);
    });

    // request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started at port 3000"); 
});


// API Key
// b4fd09affb24c8c93b7ca2b1bdff6e42-us21

// List ID
// d9ee4b073d