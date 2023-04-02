const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const { urlencoded } = require("body-parser");
const { copyFileSync } = require("fs");
const { dirname } = require("path");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started.");
})

app.get("/", function(req, res) {                   // "gets" the signup.html page from the server
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {                  // "posts" the data entered from the form to the server
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    let url = "https://us21.api.mailchimp.com/3.0/lists/194b59209d";
    let options = {
        method: "POST",
        auth: "sancti:9710e57dda718c0656debd79e3fadee0-us21"
    }

        

    const request = https.request(url, options, function(response){

        if (response.error_count === 0) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
            console.error();
        })
        
    })
    request.write(jsonData);
    request.end();
})


app.post("/failure", function(req, res) {
    res.redirect("/");
})

//9710e57dda718c0656debd79e3fadee0-us21

//194b59209d

//const client = require("@mailchimp/mailchimp_marketing");

// client.setConfig({
//   apiKey: "9710e57dda718c0656debd79e3fadee0-us21",
//   server: "us21",
// });

// const run = async () => {
//   const response = await client.lists.batchListMembers("list_id", {
//     members: [{}],
//   });
//   console.log(response);
// };

// run();