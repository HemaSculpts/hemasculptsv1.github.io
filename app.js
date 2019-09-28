var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


/*
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use("/public", express.static('../public/'));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use('/', indexRouter);
//app.use('/testpost', indexRouter);
app.use('/users', usersRouter); */

/*
var server = app.listen(5000, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
}) */

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser());  
//app.use(bodyParser.json({limit:'5mb'}));   
//app.use(bodyParser.urlencoded({extended:true}));  
   
  
app.use(function (req, res, next) { 
     res.setHeader('Access-Control-Allow-Origin', '*');    
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');      
     res.setHeader('Access-Control-Allow-Credentials', true);       
     next();  
 });  

 app.get("/api/getdata",function(req,res){
  var rawdata = fs.readFileSync('output.json');
  var result = JSON.parse(rawdata);
  console.log(result);
  res.json(result);
  //fs.close();
  res.send("getting data");
 });

 app.post("/api/postdata",function(req,res){
  //var rawdata = fs.readFileSync('output.json');
  var rawdata = [
    {
        "name": "SOUTH1",
        "value": "Love u to the core"
    }];
  var result = JSON.parse(rawdata.toString());
  //console.log("raw file:"+result[0].name);
  var mod = req.body;
  console.log("Post method:");
  console.log(mod.name+mod.value);
  console.log(mod);
  
  result.forEach(function(i){
    console.log("i.name & mod.name: "+i.name+" "+mod.name);
    if(i.name==mod.name)
    {
      i.value= mod.value;
    }
  });
  console.log(result);
  //fs.writeFile('output.json', JSON.stringify(result));
  //fs.close();
  res.send(mod);
 });

 app.put("/api/putdata",function(req,res){
  var rawdata = fs.readFileSync('output.json');
  var result = JSON.parse(rawdata.toString());
  var mod = req.body;
  console.log("Put method");
  console.log(mod);
  result.forEach(function(i){
    console.log("i.name & mod.name: "+i.name+" "+mod.name);
    if(i.name==mod.name)
    {
      i.value= mod.value;
    }
  });
  fs.writeFile('myjsonfile.json', JSON.stringify(result), 'utf8');
  res.send(mod);
 });

 
 var url = 'mongodb+srv://prakashinfo96:kambatham@prakash-367nr.mongodb.net/test';
 
 var Schema = mongoose.Schema;

 var UsersSchema = new Schema({      
  name: { type: String   },       
  value: { type: String   }   
 },{ versionKey: false }); 

 var model = mongoose.model('spanvalues', UsersSchema);

 var db = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false },function(err, db) {
     if(err)
    {
        console.log(err);
    }
    else{
      console.log('Connected to ' + db);
      
    }
 }); 

 app.get("/api/getdbdata",function(req,res){
  model.find({},function(err,data){
    if(err){  
      console.log(err);
    }  
    else{                
        console.log(data);
        res.send(data);
        }  
});    

});
 

 
 app.put("/api/postdbdata",function(req,res){
  console.log('in');

  var mod = req.body;
  console.log(mod);
  var found;

  model.find({"name":mod[0].name},function(err,data){
    if(err){  
      console.log(err);
    }
    if(!data)
    {
      console.log("No data")
    }
    else{
        console.log(data);
        found = data;
        console.log('found data:'+found);
        if(found.length>0)
        {
          console.log("Update record");
          model.findOneAndUpdate({"name":mod[0].name}, { value: mod[0].value},  
            function(err,data) {
            if (err) {  
            res.send(err);         
            }  
            else{
                   res.send(req.body);  
              }  
          });  

        }
        else{
          console.log("Create a record");
          var newRecord = new model({ name: mod[0].name, value: mod[0].value });
          newRecord.save(function(err,data){
            if(err){  
               res.send(err);                
            }  
            else{        
                res.send({data:"Record has been Inserted..!!"});  
            }  
       });

        }
        //res.send(found);
        }
});

 /*
  if(req.body.mode =="Save")  
  {
     mod.save(function(err,data){  
       if(err){  
          res.send(err);                
       }  
       else{        
           res.send({data:"Record has been Inserted..!!"});  
       }  
  });  
 }  
 else   
 { 
  model.findByIdAndUpdate(req.body.id, { name: req.body.name, address: req.body.address},  
    function(err,data) {  
    if (err) {  
    res.send(err);         
    }  
    else{        
           res.send({data:"Record has been Updated..!!"});  
      }  
  });    
 } */

  })



app.listen(process.env.PORT || 8082, function () {  
    
  console.log('Example app listening on port 8082!')  
 })


module.exports = app;
