const { Client } = require("pg");

class AccessDB{
    static #instance = null;

    constructor({}={}){
        if(AccessDB.#instance){
            throw new Error("Instance already exists!")
        }
        AccessDB.#instance=-1;
    }

    initLocal(){
        this.client = new Client({database:"twproject",
            user:"diana", 
            password:"diana", 
            host:"localhost", 
            port:5432});
        this.Client.connect();
    }

    getClient(){
        if(!this.#instance || this.#instance==-1){
            throw new Error("No class instance!")
        }
    }


    static getInstance({init="local"}={}){
        // "this" is the class, not the instance, because the method is static
        if(!this.#instance){
            this.#instance=new AccessDB();
            switch(init){
                case "local":this.#instance.initLocal();
            }
        }
        return this.#instance;
    }

    select({table="", fields=[], conditionsAnd=[]}={}){
        let conditionWhere="";
        if(conditionsAnd.length>0){
            conditionWhere=`where ${conditionsAnd.join(" and ")}`
        }
        let command = `select ${fields.join(",")} from ${table} where ${conditionsAnd}`
    }

    insert({table="", fields=[], values=[]}={}, callback){
        if(fields.length!=values.length){
            throw new Error("Fields number =/= values number!")
        }

        let command=`insert into ${table}(${fields.join(",")}) values ( ${values.join(",")})`;

        console.log(command);

        this.client.query(command,callback)
    }

}