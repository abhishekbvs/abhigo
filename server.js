var express = require('express');
var app = express();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhi4shek`123",
  database: "usercredentials"
});

app.use(express.static('htmlfiles'));
app.get('/homepage', function (req, res) {
   res.sendFile( __dirname+"/"+"htmlfiles/abhigo.html" );
});

app.get('/loginpage', function (req, res) {
  res.sendFile( __dirname+ "/" + "htmlfiles/loginform.html" );
});
app.get('/verify', function (req, res) {
    var response ={
                    username:req.query.username,
                    password:req.query.password
                    };
    console.log(response.username);
    console.log(response.password);
    con.query('SELECT password FROM userids WHERE username = ?',response.username, function (error, result, fields) {
        if (error) {
                    res.send({
                                "code":400,
                                "failed":"error ocurred"
                            });
                    }
        else{
            if(result.length >0){
                if(result[0].password == response.password){
                res.send({
                            "code":200,
                            "success":"login sucessfull"
                        });
                
                                }
                else{
                res.send({
                            "code":204,
                            "success":"username and password does not match"
                        });
          }
                            }
            else{
                res.send({
                            "code":204,
                            "success":"username does not exits"
                    });
                }           
            }
    });

});

var server = app.listen(2018, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})