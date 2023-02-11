const AccessDB=require('./accessdb.js');
const passwords=require('./passwords.js')
const {RoleFactory}=require('./roles.js');

const crypto=require("crypto");
const nodemailer=require("nodemailer");
const {getMaxListeners, argv} = require('process');
const {generateToken} = require('./passwords.js');

class User{
    static connectionType="local";
    static table="users";
    static cryptPassword="cryptprojecttw";
    static codeLength=64;
    static emailServer="aavrecs@gmail.com";
    static domainName="localhost:8080";
    #error;

    constructor({id, username, lastname, firstname, email, password, rol, chat_color="black", phone, image}={}) {
        
        // optional in constructor
        /*try{
            if(this.checkUsername(username)){
                this.username = username;
            }
        } catch(e){ this.#error = e.message} */
        if (arguments.length>0){
            for(let prop in arguments[0]){
                this[prop] = arguments[0][prop]
            }
            if(this.rol) this.rol=this.rol.cod? RoleFactory.createRole(this.rol.cod): RoleFactory.createRole(this.rol);
        }
        
        /*this.id=id;this.username = username;this.lastname = lastname;this.firstname = firstname;this.email = email;this.password = password;this.rol=rol;this.chat_color=chat_color;this.phone=phone;this.image=image;*/ 
        this.#error="";
    }

    checkName(name){
        return name != "" && name.match(new RegExp("^[A-Z][a-z]+$"))
    }

    set setName(name){
        if(this.checkName(name)){
            this.lastname = name
        }else{
            throw new Error("Invalid name!")
        }
    }

    checkUsername(username){
        return username != "" && username.match(new RegExp("^[A-Za-z0-9]+$"))
    }

    //setUsername is used only for registration because it checks whether the username already exists
    set setUserame(username){
        if(this.checkUsername(username)){
            this.username = username
        }else{
            throw new Error("Invalid username!")
        }
    }

    checkPhone(){
        return phone.match(new RegExp("[+]?0[0-9]{9,}"))
    }

    /**
    * Checks that the password has at least one uppercase letter, one digit and at least eight characters.
    * @return {bool} True if the password matches the croiteria, false otherwise.
    */
    checkPassword(){
        return password != "" && password.match(new RegExp("(?=.*[A-Z])(?=.*[0-9])(?=.{8,}"))
    }

    static async getUserByUsernameAsync(username){
        if(!username){return null;}
        
        try{
            let rezSelect=await AccessDB.getInstance(User.connectionType).selectAsync({
                                    table:"users", 
                                    fields:['*'], 
                                    conditionsAnd:[`username='${username}'`] 
                                });
            if(rezSelect.rowCount!==0){
                return new User(rezSelect.rows[0]);
            }else{
                console.log("getUserByUsernameAsync: The user hasn't been found!");
                return null;
            }
        }catch(e){
            console.log("getUserByUsernameAsync: ", e);
            return null;
        }
    }

    static getUserByUsername(username, obParam, processUser){
        if(!username){return null;}
        let errorProc=null;

        AccessDB.getInstance(User.connectionType).select({
                table:"users", 
                fields:['*'], 
                conditionsAnd:[`username=$1`] 
            },function(err, rezSelect){
                if(err){
                    console.log("User: ", err);
                    console.log("User: ", rezSelect.rows.length);
                    //throw new Error()
                    errorProc=-2;
                } else if(rezSelect.rowCount==0){
                    errorProc=-1;
                }
                let u=new User(rezSelect.rows[0]/*{id:rezSelect.rows[0].id,username:rezSelect.rows[0].username,lastname:rezSelect.rows[0].last_name,firstname:rezSelect.rows[0]. first_name,email:rezSelect.rows[0].email,password:rezSelect.rows[0].password,rol:rezSelect.rows[0].rol,chat_color:rezSelect.rows[0].chat_color,image:rezSelect.rows[0].image}*/)
                processUser(u, obParam, errorProc);
            }, [username]);
    }

    /**
     * Encrypts the password.
     * @param {string} password - The length of the token (number of characters).
     * @return {string} The encrypyed password.
     */
    static cryptPass(password){
        return crypto.scryptSync(password, User.cryptPassword, User.codeLength).toString("hex");
    }

    saveUser(){
        let cryptedPassword = User.cryptPass(this.password);
        let user=this;
        let token=generateToken(50);

        AccessDB.getInstance(User.connectionType).insert({
                table:User.table, 
                fields:["username", 
                    "last_name", 
                    "first_name", 
                    "passw", 
                    "email", 
                    "chat_color", 
                    "code",
                    "image",
                    "phone"], 
                values:[`'${this.username}'`, 
                    `'${this.lastname}'`, 
                    `'${this.firstname}'`, 
                    `'${cryptedPassword}'`, 
                    `'${this.email}'`, 
                    `'${this.chat_color}'`, 
                    `'${token}'`,
                    `'${this.image}'`,
                    `'${this.phone}'`
            ]}, function(err, rez){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        // let us=user.username;
                                        // let usUP=us.toUpperCase();
                                        // let token2
                                        user.sendMail(
                                            "Registration successful! You are now registered.",
                                            "Your username is "+user.username,
                                            `<h1><p>Hi</p> <p>${user.firstname}</p> <p>!</p></h1>
                                            <h2>Welcome to <b><i><u>AAV Recs</u></i></b>!</h2>
                                            <p style='color:blue'>Your username is ${user.username}.</p> 
                                            <p>
                                                <a href='http://${User.domainName}/code/${token}/${user.username}'>Click here to confirm</a>
                                            </p>`
                                        );
                                    }
                                    
            }
        )
    }

    async sendMail(subject, messageText, messageHtml, attachments=[]){
        var transp = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{ //data login 
                user:User.emailServer,
                pass:"sykvpoatdhbqqeqw"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //generate HTML
        await transp.sendMail({
            from:User.emailServer,
            to:this.email,
            subject:subject, //"Registration successful! You are now registered."
            text:messageText, //"Your username is "+username
            html:messageHtml, // `<h1>Hi!</h1><p style='color:blue'>Your username is ${username}.</p> <p><a href='http://${domainName}/code/${username}/${token}'>Click here to confirm</a></p>`,
            attachments:attachments
        })
        console.log("Mail sent!");
    }

    hasPrivilege(privilege){
        return this.rol.hasPrivilege(privilege);
    }

    static search({object}={}, callback){
        if(!object){return null;}
        let errorProc=null;

        AccessDB.getInstance(User.connectionType).select({
                table:"users", 
                fields:['*'], 
                conditionsAnd:[`username='${object.username}'`] 
            },function(err, rezSelect){
                if(err){
                    console.log("Search user: ", err);
                    errorProc=-2;
                } else if(rezSelect.rowCount==0){
                    errorProc=-1;
                }
            });
    }

    static async searchAsync(object){
        if(!object){return null;}
        //for(prop in object){object[prop]} =>conditionsAnd +=
        
        try{
            let rezSelect=await AccessDB.getInstance(User.connectionType).selectAsync({
                                    table:"users", 
                                    fields:['*'], 
                                    conditionsAnd:[`username='${username}'`] 
                                });
            if(rezSelect.rowCount!==0){
                return new User(rezSelect.rows[0]);
            }else{
                console.log("searchAsync: The user hasn't been found!");
                return null;
            }
        }catch(e){
            console.log("searchAsync: ", e);
            return null;
        }
    }
 
}

module.exports={User:User}