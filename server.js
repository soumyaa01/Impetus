var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose 	   = require('mongoose');
var path = require('path');
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/css')));

mongoose.Promise = global.Promise;

app.listen(8080);
console.log('Server running on 8080');

mongoose.connect('mongodb://localhost/org');
app.get('/',function(req,res)
{
    res.sendFile( __dirname+ '/public/index.html');
});


// Mongoose Schema for Database
var userschema = mongoose.Schema({ 
    name : String,
    email : String, 
    password : String,
    role : String,

    volunteer : {
    name : String,
    branch : String,
    year : String,
    contact : String,
    reason :  String,
    duty : String,
    ieee : String
    },
    userdata : {
    	org1 : String,
    	org2 : String,
    	org3 : String,
    	cont1 : String,
    	cont2 : String,
    	cont3 : String,
    	date : String,
    	eventname : String,
    	desc : String,
      duration: String,
      items : String,
      bud : String,
      vol : String, 
    	team : Number,
      remark : String


    }
});

var Users = mongoose.model('users',userschema);


//Signup Function 
app.post('/api/user/signup',function(req,res){
	
	
			
				
        newuser = new Users({email : req.body.email, password : req.body.pass, name : req.body.name, role : req.body.role});
        
            Users.findOne({email : req.body.email},function(err,result){
              if(err)
              {
                console.log(err);

              }
              else if(result)
              { 
                res.json("Email already exists"); 
              }
              else
              {

                newuser.save(function(err){
                  if(err)
                    throw err;
                  else
                  {
                    console.log(newuser);
                      console.log(req.body);
                res.json("Registered. Login to continue.");
                  }
                });
                
              }
            });
});
				


//Login function

app.post('/api/user/login',function(req,res){

    
   
            Users.findOne({ email: req.body.emai, password : req.body.pas},function(err,user){
              if(err)
              {
                console.log("error");
              }
              else
              {    
                if(user){
                res.json({email : user.email , role : user.role }); 
               }

               else
               {
                res.json("Incorrect Email/Password");
               }
             }

      });
  });       

// 	---------------------- Client side functions --------------


//Inserting data in database when user fills the form the first time

app.post('/api/user/data',function(req,res){
	 

     
      console.log(req.body);

     	Users.findOneAndUpdate({ email : req.body.email},{ $set:  { 'userdata.org1' : req.body.org1,
 
     	 'userdata.org2' : req.body.org2,
     	'userdata.org3' : req.body.org3,
    	'userdata.cont1' : req.body.cont1,
    	'userdata.cont2' : req.body.cont2,
    	'userdata.cont3' : req.body.cont3,
    	'userdata.eventname' : req.body.event,
    	'userdata.desc' : req.body.desc,
    	'userdata.team': req.body.team,
    	'userdata.duration' : req.body.duration,
    	'userdata.vol' : req.body.vol, 
      'userdata.items' : req.body.items,
      'userdata.bud' : req.body.bud}},function(err,user){
     		if(err)
     			{ res.json('Failed to submit. Try again!');
     			}
     		else
     		{
     			
     			res.json("Event Data Saved");
     			console.log("saved");
     		}
   			
   		});
  });

// Load Data for user to view

app.post('/api/user/loaddata',function(req,res){
	Users.findOne({email : req.body.email},'-_id userdata.org1 userdata.org2 userdata.org3 userdata.cont1 userdata.cont2 userdata.cont3 userdata.eventname userdata.desc userdata.date userdata.team userdata.bud userdata.vol userdata.items userdata.duration userdata.remark',function(err,result){
		if(err)
			throw err;
		else
		{	console.log(req.body.email);
			console.log(result);
			res.json(result);
		}
		
	});

});


// Edit function

app.post('/api/user/update',function(req,res){
	Users.findOneAndUpdate({ email : req.body.email},{ $set:  { 'userdata.org1' : req.body.org1,
 
     	'userdata.org2' : req.body.org2,
     	'userdata.org3' : req.body.org3,
    	'userdata.cont1' : req.body.cont1,
    	'userdata.cont2' : req.body.cont2,
    	'userdata.cont3' : req.body.cont3,
    	'userdata.eventname' : req.body.event,
    	'userdata.desc' : req.body.desc,
    	'userdata.team': req.body.team,
    	'userdata.duration' : req.body.duration,
    	'userdata.bud' : req.body.bud,
      'userdata.items' : req.body.items, 
      'userdata.vol' : req.body.vol}},function(err,user){
     		if(err)
     			res.json('Update failed');
     		else
     		{
     			
     			res.json("Updated Successfully");
     			console.log("saved");
     		}
   			
   		});
});

// -------------------------------------------------------------------------------------------------------------------

//--------------- ADMIN SIDE FUNCTIONS---------------------------------------------------------------------------------


// Load all data for admin view 

app.post('/api/admin/loadall',function(req,res){
  Users.find({},'-_id email userdata.org1 userdata.org2 userdata.org3 userdata.cont1 userdata.cont2 userdata.cont3 userdata.eventname userdata.desc userdata.date userdata.team userdata.bud userdata.vol userdata.duration userdata.items userdata.remark',function(err,result){
    if(err)
      throw err;
    else
    { 
        console.log(result);
      res.json(result);
    }
    
  });

});
app.post('/api/admin/loadday1',function(req,res){

	
	Users.find({'userdata.date' : '24/03/2017'},'-_id email userdata.org1 userdata.org2 userdata.org3 userdata.cont1 userdata.cont2 userdata.cont3 userdata.eventname userdata.desc userdata.date userdata.team userdata.bud userdata.vol userdata.duration userdata.items userdata.remark',function(err,result){
		if(err)
			throw err;
		else
		{	
				console.log(result);
			res.json(result);
		}
		
	});
});
app.post('/api/admin/loadday2',function(req,res){

	
	Users.find({'userdata.date' : '25/03/2017'},'-_id email userdata.org1 userdata.org2 userdata.org3 userdata.cont1 userdata.cont2 userdata.cont3 userdata.eventname userdata.desc userdata.date userdata.team userdata.bud userdata.vol userdata.duration userdata.items userdata.remark',function(err,result){
		if(err)
			throw err;
		else
		{	
				console.log(result);
			res.json(result);
		}
		
	});
});


//Update admin
app.post('/api/admin/update',function(req,res){

	Users.findOneAndUpdate({ email : req.body.email},{ $set:  { 'userdata.org1' : req.body.org1,
 
     	 'userdata.org2' : req.body.org2,
     	'userdata.org3' : req.body.org3,
    	'userdata.cont1' : req.body.cont1,
    	'userdata.cont2' : req.body.cont2,
    	'userdata.cont3' : req.body.cont3,
    	'userdata.date' : req.body.date,
    	'userdata.eventname' : req.body.event,
    	'userdata.desc' : req.body.desc,
    	'userdata.team': req.body.team,
    	'userdata.bud' : req.body.bud,
       'userdata.vol': req.body.vol,
      'userdata.duration' : req.body.duration,
       'userdata.items' : req.body.items,
    	'userdata.remark' : req.body.remark }},function(err,user){
     		if(err)
     		{
     			console.log(err);
     			res.json('Update failed');
     		}
     		else
     		{	
     			
     			res.json("Data Updated Successfully");
     			console.log("saved");
     		}
   			
   		});


});

//Admin delete

app.post('/api/admin/delete',function(req,res){
	
	Users.findOne({ email : req.body.email},function(err,result){
			console.log(result);
			if(err)
			{
				res.json('Delete failed');
			}
			 
			result.userdata.org1 = undefined;
			result.userdata.org2 = undefined;
			result.userdata.org3 = undefined;
			result.userdata.cont1 = undefined;
			result.userdata.cont2 = undefined;
			result.userdata.cont3 = undefined;
			result.userdata.date = undefined;
			result.userdata.eventname = undefined;
			result.userdata.desc = undefined;
			result.userdata.bud = undefined;
      result.userdata.vol = undefined;
      result.userdata.duration= undefined;
      result.userdata.items= undefined;
			result.userdata.remark = undefined;
		
			result.save();
			 
			 console.log("working");
       		
       		 res.json("Entry Deleted. Reload window.");


		});
     		
   			



});


//Admin load for volunteers
app.post('/api/admin/findvol',function(req,res){
  Users.find({},'-_id email volunteer.name volunteer.branch volunteer.year volunteer.contact volunteer.reason volunteer.duty volunteer.ieee',function(err,result){
    if(err)
      throw err;
    else 
    {
      console.log(result);
      res.json(result);
    }

  });


});

// Volunteer Update
app.post('/api/admin/volupdate',function(req,res){
  Users.findOneAndUpdate({ email : req.body.email},{ $set:  { 'volunteer.name' : req.body.name,
 
       'volunteer.branch' : req.body.branch,
        'volunteer.year' : req.body.year,
        'volunteer.contact' : req.body.cont,
        'volunteer.duty' : req.body.duty,
        'volunteer.ieee' : req.body.ieee


          }},function(err,user){
        if(err)
        {
          console.log(err);
          res.json('Update failed');
        }
        else
        { 
          
          res.json("Data Updated Successfully");
          console.log("saved");
        }
        
      });    

});
//Delete Volunteer 


// _______________________________________________________________________________________________________

//--------------------- VOLUNTEER SIDE--------------------------------------------------------------------


//Volunteer submit data
app.post('/api/volunteer/data',function(req,res){

    Users.findOneAndUpdate({ email : req.body.email},{ $set:  { 'volunteer.name' : req.body.name,
 
       'volunteer.branch' : req.body.branch,
        'volunteer.year' : req.body.year,
        'volunteer.contact' : req.body.cont,
        'volunteer.reason' : req.body.reason,
        'volunteer.ieee' : req.body.ieee


          }},function(err,user){
        if(err)
        {
          console.log(err);
          res.json('Update failed');
        }
        else
        { 
          
          res.json("Data Updated Successfully");
          console.log("saved");
        }
        
      });    

});


//Volunteer View

app.post('/api/volunteer/loadpro',function(req,res){
  console.log("working");
    Users.findOne({email : req.body.email},'-_id volunteer.name volunteer.ieee volunteer.branch volunteer.year volunteer.contact volunteer.reason volunteer.duty',function(err,result){
    if(err)
      throw err;
    else
    { console.log(req.body.email);
      console.log(result);
      res.json(result);
    }
    
  });

});

// Volunteer Update
app.post('/api/volunteer/update',function(req,res){
  Users.findOneAndUpdate({ email : req.body.email},{ $set:  { 'volunteer.name' : req.body.name,
 
       'volunteer.branch' : req.body.branch,
        'volunteer.year' : req.body.year,
        'volunteer.contact' : req.body.cont,
        'volunteer.reason' : req.body.reason,
        'volunteer.ieee' : req.body.ieee


          }},function(err,user){
        if(err)
        {
          console.log(err);
          res.json('Update failed');
        }
        else
        { 
          
          res.json("Data Updated Successfully");
          console.log("saved");
        }
        
      });    

});