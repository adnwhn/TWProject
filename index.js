const express = require("express");
const fs = require("fs"); // file system
const sharp = require("sharp");
const ejs = require("ejs");
const sass = require("sass");
const {Client} = require("pg");

var cssBootstrap = sass.compile(__dirname + "/resources/sass/customize-bootstrap.scss",{sourceMap:true});

fs.writeFileSync(__dirname + "/resources/css/libraries/bootstrap-custom.css",cssBootstrap.css);

var client= new Client({database:"TW_Project",
        user:"diana", 
        password:"diana", 
        host:"localhost", 
        port:5432});
client.connect();

client.query("select * from test_table", function(err, res){
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

app.get("/produse", function(req, res){
    client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err,rezCateg){
        client.query("select * from prajituri", function(err, rez){

            continuareQuery = " "
            if(req.query.tip){
                continuareQuery += "and tip='${req.query.tip}'"  // "tip = '" + req.query.tip + "'"
            }

            client.query("select * from prajituri where 1=1" + continuareQuery, function(err,rez){
                if(err){
                        console.log(err);
                        renderError(res, 2);
                } 
                else
                    res.render("pages/produse", {produse:rez.rows, optiuni:rezCateg.rows});
                });
            });  
    });
});

app.get("/produs", function(req, res){
    console.log(req.params);
    client.query("select * from prajituri where id=" + req.params.id, function(err, rez){
        if(err){
            console.log(err);
            renderError(res, 2);
        } 
        else
            res.render("pages/produse", {produse:rez.rows[0]});
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