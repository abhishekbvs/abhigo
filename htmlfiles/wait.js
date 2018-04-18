var sql = "select password from userids where username = ? ";
    con.query(sql, response.username, function (err, password) {
    if (err) throw err;
    if(password==response.password)
        {
            window.alert("You are logged in as "+response.username);
        }
    else 
        {
            window.alert("Authentication failed. Try Again");
        }