const express = require("express");
const fs = require("fs"); // file system
const sharp = require("sharp");
const ejs = require("ejs");
const sass = require("sass");
//const {Client} = require("pg");
const formidable = require("formidable");
const path=require('path');
const QRCode=require("qrcode");
const puppeteer=require("puppeteer"); // needs internet connection
const mongodb=require("mongodb");
const helmet=require("helmet");
const socket = require('socket.io');
const xmljs=require('xml-js');
const{User}=require("./own_modules/user.js");
const AccessDB=require("./own_modules/accessdb.js");
const session = require('express-session');
const Privileges = require("./own_modules/Privileges.js");
console.log(Privileges, "privileges")

//create aux folders
folders=["temp", "uploaded_user_pictures"];
for (let folder of folders){
    let pathFolder=path.join(__dirname, folder);
    if (!fs.existsSync(pathFolder))
        fs.mkdirSync(pathFolder);
}

var cssBootstrap = sass.compile(__dirname + "/resources/sass/customize-bootstrap.scss",{sourceMap:true});

fs.writeFileSync(__dirname + "/resources/css/libraries/bootstrap-custom.css",cssBootstrap.css);

// var client= new Client({database:"twproject",user:"diana",password:"diana",host:"localhost",port:5432});
// client.connect();

var instanceDB = AccessDB.getInstance({init: "local"});
var client = instanceDB.getClient();

/*client.query("select * from discs", function(err, res){
    if(err)
        console.log(err);
    else
        console.log(res);
});*/

app = express();
app.use(["/products_cart","/buy"], express.json({limit:'2mb'})); //must be set for the json body request

app.use(["/contact"], express.urlencoded({extended:true}));

app.use(session({ //  create "session" property
    secret: 'abcdefg', // cript session id
    resave: true,
    saveUninitialized: false
}));

//client.query("select * from unnest(enum_range(null::genres))");
var vedeToataLumea = "ceva";
app.use("/*", function(req, res, next){
    res.locals.vede=vedeToataLumea;
    res.locals.Privileges=Privileges;
    if(req.session.user){
        req.user=res.locals.user=new User(req.session.user);
        //console.log("////////////", req.user.hasPrivilege(Privileges.viewUsers));
    }
    res.locals.menuOptions=globalObj.menuOptions;
    next();
});

function getIp(req){ // for Heroku/Render
    var ip = req.headers["x-forwarded-for"]; // the user ip for whom the message is forwarded
    if (ip){
        let vect=ip.split(",");
        return vect[vect.length-1];
    }
    else if (req.ip){
        return req.ip;
    }
    else{
     return req.connection.remoteAddress;
    }
}

app.set("view engine", "ejs");
app.use("/resources", express.static(__dirname + "/resources"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/uploaded_user_pictures", express.static(__dirname + "/uploaded_user_pictures"));
app.use("/css", express.static("css"));
 
var url = "mongodb://localhost:27017"; // for older Node versions
var url = "mongodb://0.0.0.0:27017";

//helmet; protect against iframes
app.use(helmet.frameguard());

////////////////////////////////////////////////////////////////
//chat
//init socket.io
const http=require('http')
const server = new http.createServer(app);  
var  io = socket(server)
io = io.listen(server); //listen on the same port as the server
io.on("connection", function (socket)  {  
    console.log("Connect!");
	//if(!connection_index)
	//	connection_index=socket
    socket.on('disconnect', function() {connection_index=null;console.log('Disconnect')});
});

app.use(["/message"], express.json({limit:'2mb'}));

app.post('/message', function(req, res) {
    console.log("message received");
    console.log(req.body);
    io.sockets.emit('new_message', req.body.name, req.body.colorC, req.body.message, req.body.strRadio);
    res.send("ok");
});

app.get('/chat', function(req, res) {
    console.log(req.ip);
    if(req.ip){
        res.render('pages/chat.ejs', {port:s_port});
    }else{
        renderError(res, 403);
    }
});

////////////////////////////////////////////////////////////////

//saving in DB the events of logged users
/*app.all("/*", function(req, res, next){
    let id_user=req?.session?.user?.id; 
    id_user= id_user?id_user:null;
    console.log(id_user)
    AccessDB.getInstance().insert({
       table:"acces",
       fields:["ip", "user_id", "page"],
       values:[`'${getIp(req)}'`, `${id_user}`, `'${req.url}'`]
       }, function(err, rezQuery){
           console.log(err);
       }
   )
    next();
});*/

var active_ips={};
app.all("/*",function(req,res,next){
    let ipReq=getIp(req);
    let ip_found=active_ips[ipReq+"|"+req.url];
    current_time=new Date();
    if(ip_found){
    
        if( (current_time-ip_found.data)< 20*1000) {//diff in milisec; check if last acces was <20sec
            if (ip_found.nr>10){//more than 10 requests 
                res.send("<h1>Too many requests in a short period of time! STOP! >:| </h1>");
                ip_found.data=current_time
                return;
            }
            else{  
                ip_found.data=current_time;
                ip_found.nr++;
            }
        }
        else{
            ip_found.data=current_time;
            ip_found.nr=1; //enough time passed since last request; reset
        }
    }
    else{
        active_ips[ipReq+"|"+req.url]={nr:1, data:current_time};
    }
    let param_command= `insert into acces(ip, user_id, page) values ($1::text, $2,  $3::text)`;
    if (ipReq && ip_found && (current_time-ip_found.data)< 20*1000){
        var id_user=req.session.user?req.session.user.id:null;
        //console.log("id_user", id_user);
        client.query(param_command, [ipReq, id_user, req.url], function(err, rez){
            if(err) console.log(err);
        });
    }
    next();   
});

function deleteAccesOld(){
    AccessDB.getInstance().delete({table:"acces", 
                                conditionsAnd:["now()-acces_date >= interval '`10` minutes'"
                                ]}, function(err, rez){
                                    console.log(err);
                                })
}
deleteAccesOld();
// deleteAccesOld without parentheses because the interval is set on the function not on what the function returns (null)
setInterval(deleteAccesOld, 60*60*1000); // min * sec * 1000

globalObj = {
    errors: null,
    images: [],
    protocol: "http://",
    domainName: "localhost:8080",
    clientMongo:mongodb.MongoClient,
    dbMongo:null,
    menuOptions: null
};

client.query("SELECT * from UNNEST(enum_range(null::genres))", function(err, genres){
    if(err){
        console.log(err);
        renderError(res, 2);
    }else{
        globalObj.menuOptions=genres.rows;
    }
});

globalObj.clientMongo.connect(url, function(err, bd) {
    console.log("Mongo connection")
    if (err) {
        console.log(err);
    }else{
        globalObj.dbMongo = bd.db("tweb");
    }
});

////// users
app.post("/registration",function(req, res){
    var username;
    var form= new formidable.IncomingForm()
    form.parse(req, function(err, fieldsText, fieldsFile ){ // 4
        console.log("Registration: ", fieldsText);
        console.log(fieldsFile);
        var error="";
        var newUser = new User();
        try{
            newUser.setName = fieldsText.lastname;
            newUser.setUserame = fieldsText.username;
            newUser.password=fieldsText.password;
            newUser.email=fieldsText.email;
            newUser.firstname=fieldsText.firstname;
            newUser.chat_color=fieldsText.chat_color;
            newUser.phone=fieldsText.phone;
            newUser.image=fieldsFile.image.originalFilename; 

            User.getUserByUsername(fieldsText.username, {}, function(u, {}, errorProc){
                if(errorProc==-1){ // username doesn't exist in DB
                    newUser.saveUser();
                }else{
                    errorProc+="Username already exists!";
                }

                if(!error){
                    res.render("pages/registration", {answer:"Registration successful!"});
                }
                else{
                    res.render("pages/registration", {err: "Error: "+error});
                }
                    
            })

            
        }catch(e){
            console.log(e.message)
            error += "Site error! Come back later!"
            console.log(error)
            res.render("pages/registration", {err: "Error: "+error});
                
        }
        
    });
    form.on("field", function(name,val){  //1
   
        console.log(`--- ${name}=${val}`);
       
        if(name=="username")
            username=val;
    })
    form.on("fileBegin", function(name,file){ //2
        console.log("fileBegin");
        console.log(name,file);

        let folderUser=path.join(__dirname, "uploaded_user_pictures", username);
        if(!fs.existsSync(folderUser)){
            fs.mkdirSync(folderUser);
        }
        file.filepath=path.join(folderUser, file.originalFilename)
    })    
    form.on("file", function(name,file){ //3
        console.log("file");
        console.log(name,file);
    });
});

//http://${User.domainName}/code/${user.username}/${token}
app.get("/code/:token/:username", function(req, res){
    try{
        User.getUserByUsername(req.params.username, {res:res, token:req.params.token}, function(u, obParam){
                AccessDB.getInstance().update({
                        table:"users", 
                        fields:['confirmed_mail'], 
                        values:['true'], 
                        conditionsAnd:[`code='${obParam.token}'`]
                    }, function (err, rezUpdate){
                        if(err || rezUpdate.rowCount==0){
                            console.log("Token code: ", err);
                            renderError(res, 3);
                        }else{
                            res.render("pages/confirm.ejs");
                        }
                    });      
        })
    }catch(e){
        console.log(e);
        renderError(res, 2);
    }
    
});

app.post("/login",function(req, res){
    var username;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fieldsText, fieldsFile){
        User.getUserByUsername(fieldsText.username, {req: req, res: res, password: fieldsText.password}, function(u, obParam){
                let passCrypt = User.cryptPass(obParam.password);
                if(u.password=passCrypt){
                    //TODO add "default.png" instead of ""
                    u.image=u.image?path.join("uploaded_user_pictures", u.username, u.image):""; // if user has "image" -> path.join ; else -> null string
                    obParam.req.session.user=u;
                    obParam.req.session.successLogin="Login successful!";
                    obParam.res.redirect("/index");
                    //ob.param.render("/login");
                } else {
                    obParam.req.session.successLogin="Incorrect login data OR the mail hasn't been confirmed yet!"; 
                    obParam.res.redirect("/index");
                }
        })
    });
});

app.post("/profile", function(req, res){
    console.log("profile");
    if (!req.session.user){
        renderError(res,403,)
        res.render("pages/error",{text:"You are not logged."});
        return;
    }
    var form= new formidable.IncomingForm();
 
    form.parse(req, function(err, fieldsText, fieldsFile){
       
        var cryptedPassword=User.cryptPass(fieldsText.password);
        AccessDB.getInstance().update(
            {table:"users",
            fileds:["last_name","first_name","email","chat_color", "phone"],
            valori:[`${fieldsText.name}`,`${fieldsText.firstname}`,`${fieldsText.email}`,`${fieldsText.chat_color}`,`${fieldsText.phone}`],
            conditionsAnd:[`password='${cryptedPassword}'`]
        },  function(err, rez){
            if(err){
                console.log(err);
                renderError(res,2);
                return;
            }
            console.log(rez.rowCount);
            if (rez.rowCount==0){
                res.render("pages/profile",{message:"Update unsuccessful. Check the password."});
                return;
            }
            else{            
                //update session
                console.log("update session");
                req.session.user.lastname= fieldsText.name;
                req.session.user.firstname= fieldsText.firstname;
                req.session.user.email= fieldsText.email;
                req.session.user.chat_color= fieldsText.chat_color;
                req.session.user.phone= fieldsText.phone;
                res.locals.user=req.session.user;
            }
 
            res.render("pages/profile",{message:"Update successful."});
        });
    });
});

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.user=null;
    res.render("pages/logout");
});

// Manage users
app.get("/users", function(req, res){
   
    if(req?.user?.hasPrivilege?.(Privileges.viewUsers)){
        AccessDB.getInstance().select({table:"users", fields:["*"]}, function(err, rezQuery){
            console.log(err);
            res.render("pages/users", {users: rezQuery.rows});
        });
    }
    else{
        renderError(res, 403);
    }
});

app.post("/delete_user", function(req, res){
    if(req?.user?.hasPrivilege?.(Privileges.deleteUsers)){
        var form= new formidable.IncomingForm();
 
        form.parse(req,function(err, fieldsText, fieldsFile){
           
            AccessDB.getInstance().delete({table:"users", conditionsAnd:[`id=${fieldsText.id_user}`]}, function(err, rezQuery){
                console.log(err);
                res.redirect("/users");
            });
        });
    }else{
        renderError(res, 403);
    }
})

//Delete account
app.post("/delete_account", function(req, res){
    var form= new formidable.IncomingForm();

    form.parse(req,function(err, fieldsText){
        
        AccessDB.getInstance().delete({table:"users", conditionsAnd:[`id=${req.session.user.id}`]}, 
            function(err, rezQuery){
                console.log(err);
                res.redirect("/profile");
            });
        messageText=`Dear ${req.session.user.first_name}, we are so sorry to see you go.`
        messageHtml=`<h2>Dear ${req.session.user.username},</h2> we are so sorry to see you go. Your account is deleted.`
        req.user.sendMail(
                            "Goodbye", 
                            messageText, 
                            messageHtml
                        );
        res.send("Goodbye!");
    });
    
})

//Manage products
app.post("/delete_product", function(req, res){
    if(req?.user?.hasPrivilege?.(Privileges.deleteProducts)){
        var form= new formidable.IncomingForm();
 
        form.parse(req,function(err, fieldsText, fieldsFile){
           
            AccessDB.getInstance().delete({table:"discs", conditionsAnd:[`id=${fieldsText.id_product}`]}, function(err, rezQuery){
                console.log(err);
                res.redirect("/products");
            });
        });
    }else{
        renderError(res, 403);
    }
})

///////
app.get(["/","/index", "/home", "/login"], async function(req, res){
    //let rez;
    //rez=await instanceDB.selectAsync({fields:['*'], table:"discs"});
    //console.log("======", rez.rows);
    let string =  req.session.successLogin;
    req.session.successLogin=null;

    client.query("select username, last_name, first_name from users where id in (select distinct user_id from acces where now()-acces_date <= interval '8 minutes')",
        function(err, rez){
            let userOnline=[]
            if(!err && rez.rowCount!=0){
                userOnline=rez.rows
            }
            res.render("pages/index", {ip: req.ip, images: globalObj.images, successLogin:string, usersOnline:userOnline});
        });   
});

function createErrors(){
    var fileContent = fs.readFileSync(__dirname + "/resources/json/errors.json").toString("utf8"); // buffer without utf8
    globalObj.errors = JSON.parse(fileContent);

};
createErrors();

function renderError(res, idx, title, text, image){
    var err = globalObj.errors.error_types.find(function(element){
        return element.idx == idx;
    })

    title = title || (err && err.title) || globalObj.errors.default_error.title;

    text = text || (err && err.text) || globalObj.errors.default_error.text;

    image = image || (err && globalObj.errors.base_path + "/" + err.image) || globalObj.errors.base-path + "/" + globalObj.errors.default_error.image;

    if(err && err.status){
        res.status(err.idx).render("pages/error", {title:title, text:text, image:image})
    } else {
        res.render("pages/error", {title:title, text:text, image:image})
    }
};

/*app.get("/discs", function(req, res){
    client.query("select * from unnest(enum_range(null::genres))", function(err, rezCateg){
        client.query("select * from discs", function(err, rez){
            console.log(rezCateg);

            continueQuery = " ";
            if(req.query.genre){
                continueQuery += `and genre='${req.query.genre}'`  
            }

            client.query("select * from discs where 1=1" + continueQuery, function(err,rez){
                if(err){
                        console.log(err);
                        renderError(res, 2); // error page index 2
                } 
                else
                    res.render("pages/discs", {discs:rez.rows, options:rezCateg.rows});
                });
            });  
    });
}); */

app.get("/discs", function(req, res) {
    client.query("SELECT album, description FROM discs LIMIT 1", function(err, rezInput){
        client.query("SELECT * from UNNEST(enum_range(null::conditions))", function(err, rezCondition) {
            client.query('SELECT DISTINCT EXTRACT(year from release) AS year FROM discs ORDER BY year ASC', function(err, rezRelease) {
                client.query("SELECT * from UNNEST(enum_range(null::genres))", function(err, genres){
                    client.query("SELECT min(price), max(price) from discs", function(err, rezPrice) {
                        client.query("SELECT songs from discs)", function(err, songs){
                            continueQuery = " ";
                            if(req.query.genre){
                                continueQuery += `and genre='${req.query.genre}'`  
                            }
                            client.query("SELECT * FROM discs WHERE 1 = 1" + continueQuery, function(err, rez){
                                if(err){
                                    console.log(err);
                                    renderError(res, 2);
                                }
                                else{
                                    res.render("pages/discs", 
                                                    {   
                                                        discs: rez.rows,
                                                        options: globalObj.menuOptions, 
                                                        inputs: rezPrice.rows[0], // min; max
                                                        suboptionsGenres: genres.rows, //edm; rock; hip hop; groove
                                                        releaseYears: rezRelease.rows,
                                                        conditions: rezCondition.rows,
                                                        inpAlbum: rezInput.rows[0].album,
                                                        inpDescription: rezInput.rows[0].description
                                                });
                                                console.log(rezCondition.rows);
                                                //console.log(conditions[0].unnest);
                                                
                                    }
                            });
                        });
                    });
                });
            });
        });
    });
});

app.get("/disc/:id", function(req, res){
    client.query("select * from discs where id=" + req.params.id, function(err, rez){
        if(err){
            console.log(err);
            renderError(res, 2);
        } 
        else
            res.render("pages/disc", {disc:rez.rows[0]});
    });
    
});

// Virtual cart
app.post("/products_cart",function(req, res){
    console.log(req.body);
    if(req.body.ids_prod.length!=0){
        AccessDB.getInstance().select({table:"discs", 
                                    fields:"album, artist, songs, price, description, image".split(","), 
                                    conditionsAnd:[`id in (${req.body.ids_prod})`]
                                }, function(err, rez){
                                    if(err){
                                        res.send([]);
                                    }else{
                                        res.send(rez.rows);
                                    }
                                });
    }
    else{
        res.send([]);
    }
});

{path_qr="./resources/images/qrcode";
if (fs.existsSync(path_qr))
  fs.rmSync(path_qr, {force:true, recursive:true});
fs.mkdirSync(path_qr);
client.query("select id from discs", function(err, rez){
    console.log(err)
    for(let prod of rez.rows){
        let cale_prod=globalObj.protocol+globalObj.domainName+"/product/"+prod.id;
        //console.log(cale_prod);
        QRCode.toFile(path_qr+"/"+prod.id+".png",cale_prod);
    }
});
}

async function generatePdf(stringHTML, nameFile, callback){
    const chrome=await puppeteer.launch();
    const document=await chrome.newPage();
    await document.setContent(stringHTML, {waitUntil:"load"});
    //document.setContent(stringHTML, {waitUntil:"networkidle2"});
    await document.pdf({path:nameFile, format: "A4"});
    await chrome.close();
    if(callback){
        callback(nameFile);
    }
};

app.post("/buy", function(req, res){
    console.log(req.body);
    if(req?.user?.hasPrivilege?.(Privileges.buyProducts)){
        AccessDB.getInstance().select({
            table:"discs",
            fields:["*"],
            conditionsAnd:[`id in (${req.body.ids_prod})`]
        }, function(err,rez){
            console.log(err)
            if(!err && rez.rowCount>0){
                let rezFactura=ejs.render(fs.readFileSync("views/pages/invoice.ejs").toString("utf-8"),{
                    protocol: globalObj.protocol,
                    domainName: globalObj.domainName,
                    user: req.session.user,
                    products: rez.rows
                });
                let nameFile=`./temp/invoice ${(new Date()).getTime()}.pdf`;
                generatePdf(rezFactura, nameFile, function(nameFile){
                    messageText=`Dear ${req.session.user.username}, below you have the invoice.`
                    messageHtml=`<h2>Dear ${req.session.user.username},</h2> below you have the invoice.`
                    req.user.sendMail(
                                                "Invoice", 
                                                messageText, 
                                                messageHtml, 
                                                [{
                                                    filename: "invoice.pdf",
                                                    content: fs.readFileSync(nameFile)
                                                }]
                                            );
                    res.send("Everything is fine!");
                });
                rez.rows.forEach(function(elem){
                    elem.quantity=1
                });
                let jsonInvoice={
                    data: new Date(),
                    username: req.session.user.username,
                    products: rez.rows
                }
                if(globalObj.dbMongo){
                    globalObj.dbMongo.collection("invoices").insertOne(jsonInvoice, function(err, rezMongo){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("Invoice inserted in Mongo!");
                        }
                        globalObj.dbMongo.collection("invoices").find({}).toArray(
                            function(err, rezInsert){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("Mongo Insert: ", rezInsert);
                                }
                            }
                        );
                    })
                }
            }
        });
    }else{
        res.send("You cannot buy unless you are logged or unless you have privilege.")
    }
});

// Charts
app.get("/charts", function(req, res){
    if(!(req?.session?.user && req.user.hasPrivilege(Privileges.viewCharts))){
        renderError(res, 403);
        return;
    }
    res.render("pages/charts")
});

app.get("/update_invoices", function(req, res){
    globalObj.dbMongo.collection("invoices").find({}).toArray(function(err, result){
        res.send(JSON.stringify(result));
    })
});

//Contact
pathXMLmessages="resources/xml/contact.xml";
headerXML=`<?xml version="1.0" encoding="utf-8"?>`;
function createXMLifNotExist(){
    if (!fs.existsSync(pathXMLmessages)){
        let initXML={
            "declaration":{
                "attributes":{
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name":"contact",
                    "elements": [
                        {
                            "type": "element",
                            "name":"messages",
                            "elements":[]                            
                        }
                    ]
                }
            ]
        }
        let strXml=xmljs.js2xml(initXML,{compact:false, spaces:4}); //string xml (with tags)
        //console.log(strXml);
        fs.writeFileSync(pathXMLmessages,strXml);
        return false; //it was created
    }
    return true;
}

function parseMessages(){
    let alreadyExists=createXMLifNotExist();
    let messagesXml=[];
    let obJson;
    if (alreadyExists){
        let strXML=fs.readFileSync(pathXMLmessages, 'utf8');
        obJson=xmljs.xml2js(strXML,{compact:false, spaces:4});
       
        let elementMessages=obJson.elements[0].elements.find(function(el){
                return el.name=="messages"
            });
        let vectElemsMessages=elementMessages.elements?elementMessages.elements:[]; // condition ? val_true: val_false
        console.log("Messages: ",obJson.elements[0].elements.find(function(el){
            return el.name=="messages"
        }))
        messagesXml=vectElemsMessages.filter(function(el){return el.name=="message"});
        return [obJson, elementMessages,messagesXml];
    }
    return [obJson,[],[]];
}

app.get("/contact", function(req, res){
    let obJson, elementMessages, messagesXml;
    [obJson, elementMessages, messagesXml] =parseMessages();
    res.render("pages/contact",{ user:req.session.user, messages:messagesXml})
});

app.post("/contact", function(req, res){
    let obJson, elementMessages, messagesXml;
    [obJson, elementMessages, messagesXml] =parseMessages();
        
    let u= req.session.user?req.session.user.username:"anonim";
    let newMessage={
        type:"element", 
        name:"message", 
        attributes:{
            username:u, 
            data:new Date()
        },
        elements:[{type:"text", "text":req.body.message}]
    };
    if(elementMessages.elements)
        elementMessages.elements.push(newMessage);
    else 
        elementMessages.elements=[newMessage];
    //console.log(elementMessages.elements);
    let strXml=xmljs.js2xml(obJson,{compact:false, spaces:4});
    //console.log("XML: ",strXml);
    fs.writeFileSync("resources/xml/contact.xml",strXml);
    
    res.render("pages/contact",{ user:req.session.user, messages:elementMessages.elements})
});

////

app.get("/*.ejs", function(req, res){
    renderError(res, 403);
});

app.get("/*", function(req, res){
    console.log("url: " + req.url);
    res.render("pages" + req.url, function(err, resRender){

        if(err){
            console.log(err)
            if(err.message.includes("Failed to lookup view")){
               renderError(res, 404);
            }
        } else {
            res.send(resRender);
        }
    });
});

function createImages(){
    var fileContent = fs.readFileSync(__dirname + "/resources/json/galery.json").toString("utf8"); 
    var object  = JSON.parse(fileContent);
    var dim_medium = 300;
    var dim_small = 150;

    globalObj.images = object.images;

    globalObj.images.forEach( function(elem){
        [fileName, extension] = elem.file.split(".");
        
        //folder creation
        if(!fs.existsSync(object.galery_path + "/medium/")){
            fs.mkdirSync(object.galery_path + "/medium/");
        }

        elem.file_medium = object.galery_path + "/medium/" + fileName + ".webp";
        elem.file = object.galery_path + "/" + elem.file;
        sharp(__dirname + "/" + elem.file).resize(dim_medium).toFile(__dirname + "/" + elem.file_medium)

        if(!fs.existsSync(object.galery_path + "/small/")){
            fs.mkdirSync(object.galery_path + "/small/");
        }

        elem.file_small = object.galery_path + "/small/" + fileName + ".webp";
        sharp(__dirname + "/" + elem.file).resize(dim_small).toFile(__dirname + "/" + elem.file_small)

    } );

};
createImages();

console.log("Hello!");
//app.listen(8080);
s_port = process.env.PORT || 8080
server.listen(s_port)
console.log('Server started on port'+ s_port);
console.log("Server is on!");