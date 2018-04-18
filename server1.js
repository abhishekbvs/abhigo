var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
var bodyParser  =   require("body-parser");
var server = require('http').createServer(app);
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhi4shek`123",
  database: "usercredentials"
});
server.listen(2018);
console.log("Server Started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('htmlfiles'));
app.set('view engine','ejs')
app.get('/homepage', function (req, res) {
   res.sendFile( path.join(__dirname+"/"+"htmlfiles/abhigo.html") );
});
app.get('/userpage:id',function(req,res){
    con.query('select Name from userids where id =?',req.params.id, function(error,result,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                res.render( path.join(__dirname+ "/" + "htmlfiles/userpage"),{Name:result[0].Name});
                }
    })
    
});
app.get('/loginpage', function (req, res) {
  res.sendFile( path.join(__dirname+ "/" + "htmlfiles/loginform1.html") );
});
app.post('/verify', function (req, res) {
    var response ={ 
                    username:req.body.username,
                    password:req.body.password,
                    };
    con.query('SELECT id, password FROM userids WHERE username = ?;',response.username, function (error, result, fields) {
        if (error) {
                    res.send({
                                "code":400,
                                "failed":"error ocurred"
                            });
                    }
        else{
            if(result.length >0){
                if(result[0].password == response.password){
                console.log("login successful");
                var id = result[0].id;
                res.redirect('/userpage'+id);
                    }
                else{
                console.log("login failed");
                res.send({
                            "success":"username and password does not match"
                        });
          }
                            }
            else{
                console.log("login failed");
                res.send({
                            "success":"username does not exits"
                    });
                }           
            }
    });

});
app.get('/createuser', function(req,res){
    res.sendFile(path.join(__dirname+ "/" + "htmlfiles/signupform.html") );
});
app.post('/adduser', function(req,res){
    var response ={
                    name:req.body.name,
                    username:req.body.username,
                    password:req.body.password
                    };
    console.log(response.name);
    con.query("INSERT INTO userids (name,username, password) VALUES ('"+response.name+"','"+response.username+"','"+response.password+"')", function(error,result,fields){
        if(error){
            res.send({
                                "code":400,
                                "failed":"error ocurred"
                            });
                }
        else {
            console.log("Successfully Registered");
             res.redirect('/homepage');
            
            }
    });
});
app.get('/userpage:id/hotel:hid')

