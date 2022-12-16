const express = require("express");
const fs = require("fs"); // file system
const sharp = require("sharp");
const ejs = require("ejs");
const sass = require("sass");
const {Client} = require("pg");
const formidable = require("formidable");

const{Utilizator}=require("./own_modules/utilizator.js")

const AccesBD=require("./own_modules/accessdb.js")

var cssBootstrap = sass.compile(__dirname + "/resources/sass/customize-bootstrap.scss",{sourceMap:true});

fs.writeFileSync(__dirname + "/resources/css/libraries/bootstrap-custom.css",cssBootstrap.css);

var client= new Client({database:"twproject",
        user:"diana", 
        password:"diana", 
        host:"localhost", 
        port:5432});
client.connect();

//var instanceDB = AccesBD.getInstance({init: "local"});
//var Client = instanceDB.getClient();

//instanceDB.select({fields:["lastname","firstname"], table: "discs"}, function(err, rez){})

client.query("select * from discs", function(err, res){
    if(err)
        console.log(err);
    else
        console.log(res);
});

app = express();

var vedeToataLumea = "ceva";
app.use("/*", function(req, res, next){
    res.locals.vede=vedeToataLumea;
    next();
})

app.set("view engine", "ejs");

app.use("/resources", express.static(__dirname + "/resources"));


////// users

app.post("/inregistrare",function(req, res){
    var username;
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        console.log(campuriText);
 
        var eroare="";

        var newUser = new Utilizator();

        try{
            newUser.setName(campuriText.nume);
            newUser.setUserame(campuriText.username);
            newUser.email=campuriText.email;
            newUser.firstname=campuriText.prenume;

            newUser.password=campuriText.parola;
            newUser.culoare_chat=campuriText.culoare_chat;
            newUser.saveUser();
        }catch(e){
            error += e.message;
            console.log(error)
        }
 
        if(!eroare){
           
        }
        else
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
    });
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
 
    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});

///////

globalObj = {
    errors: null,
    images: null
}

app.get(["/","/index", "/home"], function(req, res){
    res.render("pages/index", {ip: req.ip, images: globalObj.images});


});

function createErrors(){
    var fileContent = fs.readFileSync(__dirname + "/resources/json/errors.json").toString("utf8"); // buffer without utf8
    globalObj.errors = JSON.parse(fileContent);

}

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
}

app.get("/discs", function(req, res){
    client.query("select * from unnest(enum_range(null::genres))", function(err,rezCateg){
        client.query("select * from discs", function(err, rez){
            console.log(rezCateg);

            continueQuery = " "
            if(req.query.tip){
                continueQuery += "and tip='${req.query.tip}'"  // "tip = '" + req.query.tip + "'"
            }

            client.query("select * from discs where 1=1" + continueQuery, function(err,rez){
                if(err){
                        console.log(err);
                        renderError(res, 2); // error page index 2
                } 
                else
                    res.render("pages/discs", {discs :rez.rows, optiuni:rezCateg.rows});
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

app.get("/*.ejs", function(req, res){
    renderError(res, 403);
});

app.get("/*", function(req, res){
    console.log("url: " + req.url);
    res.render("pages" + req.url, function(err, resRender){

        if(err){
            if(err.message.includes("Failed to lookup view")){
               renderError(res, 404);
            } else {

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

}

createImages();


console.log("Hello!")

app.listen(8080);
console.log("Server is on!")