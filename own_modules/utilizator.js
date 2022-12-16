const AccessDB=require('./accessdb.js');
const crypto=require("crypto");

class Utilizator{
    static tipConexiune="local";
    static table="users";
    #eroare;

    constructor({id, username, lastname, firstname, email, rol, culoare_chat="black", poza}={}) {
        this.id=id;
        this.username = username;
        this.nume = nume;
        this.prenume = prenume;
        this.email = email;
        this.rol=rol; //TO DO clasa Rol
        this.culoare_chat=culoare_chat;
        this.poza=poza;

        this.#eroare="";
    }

    checkName(name){
        return name != "" && name.match(new RegExp("^[A-Z][a-z]+$"))
    }

    set setName(name){
        if(this.checkName(name)){
            this.name = name
        }else{
            throw new Error("Invalid name!")
        }
    }

    checkUsername(username){
        return username != "" && username.match(new RegExp("^[A-Z][a-z]+$"))
    }

    set setUserame(username){
        if(this.checkUsername(username)){
            this.username = username
        }else{
            throw new Error("Invalid username!")
        }
    }

    saveUser(){

        let criptedPassword = crypto.scryptSync(this.password, Utilizator.criptPassword, 64).toString("hex")

        AccessDB.getInstance().insert({table:Utilizator.table, fields: ["username", "lastname", "firstname", "password", "email", "chat_color", "code"], values: [`'${this.username}'`, `'${this.lastname}'`, `'${this.firstname}'`, `'${criptedPassword}'`, `'${this.email}'`, `'${this.chat_color}'`, ``]}, function(err, rez){
            if(err){
                console.log(err);
            }
        })
    }
/*
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:obGlobal.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:obGlobal.emailServer,
            to:email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   */ 
}

module.exports={Utilizator:Utilizator}