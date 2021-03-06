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
        var n=req.body.nof;
        console.log(n);
        var rooms = req.body.rooms
        var Date1=req.body.Date1;
        var Date2=req.body.Date2;
        console.log(rooms);
        console.log(Date1);
          
    con.query('select Name from userids where id =?',u_id, function(error,result1,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                var name=result1[0].Name;
                console.log(name);
                con.query('select hotelname from hotels where (hid='+h_id+' and place_id='+p_id+')',function(error,result2,fields){
                    
                    var hotelname=result2[0].hotelname;
                    console.log(hotelname);
                    console.log(rooms);
                    console.log(n);
                    if(n<=rooms)
                    {
                        rooms=rooms-n;
                        con.query("UPDATE Bookings SET remaining = remaining-"+n+" WHERE date between '"+Date1+"' and '"+Date2+"' order by date");
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
app.post('/userpage:id/place:p_id/hotel',function(req,res){
        var u_id = req.params.id;
        var p_id = req.params.p_id;
        var response ={ 
                    H_id:req.body.hotelid,
                    Date1:req.body.date1,
                    Date2:req.body.date2,
                    };
    console.log(u_id);
    console.log(p_id);
    console.log(response.Date1);
    console.log(response.Date2);
    con.query('select Name from userids where id =?',u_id, function(error,result1,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                con.query("select min(remaining) from Bookings where date between '"+response.Date1+"' and '"+response.Date2+"' order by date",
                function(error,result2,fields){
                if(error){
                    res.send({
                    "failed":"error occured"
                            });
                    }
                else{
                    var x = 'min(remaining)';
                    console.log(result2[0][x]);
                    res.render( path.join(__dirname+ "/" + "htmlfiles/bookingpage"),{Name:result1[0].Name, Userid:u_id, Placeid:p_id,   Hotelid:response.H_id,n:result2[0][x], Date1:response.Date1, Date2:response.Date2});
                    }
                        });
                }
    });
    
});
app.get('/userpage:id/place:p_id',function(req,res){
        var u_id = req.params.id;
        var p_id = req.params.p_id;
    
    con.query('select place_name from places where place_id =?',p_id, function(error,result,fields){
            if(error){
                res.send({
                    "failed":"error occured"
                });
                    }
            else{
                res.render( path.join(__dirname+ "/" + "htmlfiles/hotels"),{PlaceName:result[0].place_name, p_id:p_id, u_id:u_id });
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

