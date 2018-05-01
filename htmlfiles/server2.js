
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
  database: "Hotel_Bookings"
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
app.post('/userpage:id/place:p_id/hotel:h_id/check',function(req,res){
        var u_id = req.params.id;
        var p_id = req.params.p_id;
        var h_id = req.params.h_id;
        var name;
        var n=req.body.nof;
       
   
    con.query('select Name from userids where id =?',u_id, function(error,result1,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                name=result1[0].Name;
                console.log(name);
                
                con.query('select hotelname, remaining from hotels where (hid='+h_id+' and place_id='+p_id+')',function(error,result2,fields){
                    
                    var hotelname=result2[0].hotelname;
                    var rooms=result2[0].remaining;
                    console.log(hotelname);
                    console.log(rooms);
                    console.log(n);
                    if(n<=rooms)
                    {
                        rooms=rooms-n;
                        con.query('UPDATE hotels SET remaining ='+rooms+' WHERE (hid='+h_id+' and place_id='+p_id+')');
                        res.render( path.join(__dirname+ "/" + "htmlfiles/bookingsuccess"),{Name:name, Userid:u_id, Placeid:p_id, Hotelid:h_id,HotelName:hotelname});
                    }
                    else
                    {
                         res.render( path.join(__dirname+ "/" + "htmlfiles/bookingfail"),{Name:name, Userid:u_id, Placeid:p_id, Hotelid:h_id,HotelName:hotelname});
                    }
                    
                });
                
                
                
                
                }
    });
    
    
});
app.get('/userpage:id/place:p_id/hotel:h_id',function(req,res){
        var u_id = req.params.id;
        var p_id = req.params.p_id;
        var h_id = req.params.h_id;
    
    con.query('select Name from userids where id =?',u_id, function(error,result,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                res.render( path.join(__dirname+ "/" + "htmlfiles/bookingpage"),{Name:result[0].Name, Userid:u_id, Placeid:p_id, Hotelid:h_id});
                }
    })
    
});
app.get('/userpage:id/place:p_id',function(req,res){
        var u_id = req.params.id;
        var p_id = req.params.p_id;
    
    con.query('select Name from userids where id =?',u_id, function(error,result,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                res.render( path.join(__dirname+ "/" + "htmlfiles/hotels"),{Name:result[0].Name, Userid:u_id, Placeid:p_id});
                }
    })
    
});
app.get('/userpage:id/profile',function(req,res){
         var u_id = req.params.id;
    con.query('select Name from userids where id =?',u_id, function(error,result,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                res.render( path.join(__dirname+ "/" + "htmlfiles/profile"),{Name:result[0].Name, Userid:u_id});
                }
    })
    
});
app.get('/userpage:id',function(req,res){
            var u_id = req.params.id;
    con.query('select Name from userids where id =?',u_id, function(error,result,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                res.render( path.join(__dirname+ "/" + "htmlfiles/userpage"),{Name:result[0].Name, Userid:u_id});
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
                res.sendFile( path.join(__dirname+ "/" + "htmlfiles/loginfailed.html") );
          }
                            }
            else{
                console.log("login failed");
                 res.sendFile( path.join(__dirname+ "/" + "htmlfiles/loginfailed.html") );
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

