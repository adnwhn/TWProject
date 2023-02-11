const {Client} = require("pg");

class AccessDB{
    static #instance = null;
    static #initialized=false;

    /**
     * Represents an instance to the data base.
     * @constructor
     */
    constructor(){
        if(AccessDB.#instance){
            throw new Error("Instance already exists!")
        }else if(!AccessDB.#initialized){
            throw new Error("Call the constructor through getInstance, without any error!");
        }
    }

    /**
     * Represents the connection to the data base. Connects the client.
     */
    initLocal(){
        this.client = new Client({database:"twproject",
            user:"diana", 
            password:"diana", 
            host:"localhost", 
            port:5432});
        this.client.connect();
    }

    /**
     * Gets the client.
     * @@return {client} The client object.
     */
    getClient(){
        if(!AccessDB.#instance || AccessDB.#instance==-1){
            throw new Error("No class instance!")
        }
        return this.client;
    }

     /**
    * @typedef {object} ObjectConnection - object received by functions that require connection
    * @property {string} init - connection type ("init", "render" etc.)
    */

    /**
    * Return unique instance
    * @param {ObjectConnection}
    * @returns {AccessDB}
    */
    
    static getInstance({init="local"}={}){
        // "this" is the class, not the instance, because the method is static
        if(!this.#instance){
            this.#initialized=true;
            this.#instance=new AccessDB();
            // initialization can throw errors
            try{
                switch(init){
                    case "local":this.#instance.initLocal();
                } // case "render"

                //if this is reached, no error occurred
            } catch(e){
                console.error("Data base initialization error")
            }
            
        }
        return this.#instance;
    }

    /**
    * @typedef {object} ObjectQuery - object received by functions that execute queries
    * @property {string} table - table name
    * @property {string[]} fields - list of strings with name of columns
    * @property {string[]} conditionsAnd - list of strings with conditions for 'where'
    */

    /**
    * Query callback
    * @callback QueryyCallBack
    * @param {Error} err - possible error of query
    * @param {Object} rez - query result
    */

    /**
    * Select records from data base
    * @param {ObjectQuery} obj - object with data for query
    * @param {function} callback
    */

    select({table="", fields=[], conditionsAnd=[]}={}, callback, paramsQuery=[]){
        let conditionsWhere="";
        if(conditionsAnd.length>0){
            conditionsWhere = `where ${conditionsAnd.join(" and ")}`
        }
        let command = `select ${fields.join(",")} from ${table} ${conditionsWhere}`;
        //console.log(command);
        this.client.query(command, paramsQuery, callback)
    }

    async selectAsync({table="", fields=[], conditionsAnd=[]}={}){
        let conditionsWhere="";
        if(conditionsAnd.length>0){
            conditionsWhere = `where ${conditionsAnd.join(" and ")}`
        }
        let command = `select ${fields.join(",")} from ${table} ${conditionsWhere}`;
        console.error("selectAsync: ", command)
        try{
            let rez=await this.client.query(command);
            console.log("selectAsync: ", rez);
            return rez;
        }catch(e){
            console.log(e);
            return null;
        }
    }

    insert({table="", fields=[], values=[]}={}, callback){
        if(fields.length!=values.length){
            throw new Error("Fields number =/= values number!")
        }

        let vect=[]
        for(let i=0; i<fields.length; i++){
            vect.push(`${fields[i]}=$${i+1}`);
        }

        let command=`insert into ${table} (${vect.join(",")}) values (${values.join(",")})`;
        //console.log(command);
        this.client.query(command, values, callback)
    }

    /*update({table="", fields=[], values=[], conditionsAnd=[]} = {}, callback, paramsQuery=[]){
        if(fields.length!=values.length)
            throw new Error("Fields number =/= values number!")

        let fieldsUpdated=[];
        for(let i=0; i<fields.length; i++){
            fieldsUpdated.push(`${fields[i]}='${values[i]}'`);
        }
            
        let conditionsWhere="";
        if(conditionsAnd.length>0){
            conditionsWhere=`where ${conditionsAnd.join(" and ")}`;
        }
            
        let command=`update ${table} set ${fieldsUpdated.join(", ")} ${conditionsWhere}`;
        //console.log(command);
        this.client.query(command, callback)
    }*/

    // param update
    update({table="", fields=[], values=[], conditionsAnd=[]} = {}, callback){
        if(fields.length!=values.length)
            throw new Error("Fields number =/= values number!")

        let fieldsUpdated=[];
        for(let i=0; i<fields.length; i++){
            fieldsUpdated.push(`${fields[i]}=$${i+1}`);
        }
            
        let conditionsWhere="";
        if(conditionsAnd.length>0){
            conditionsWhere=`where ${conditionsAnd.join(" and ")}`;
        }
            
        let command=`update ${table} set ${fieldsUpdated.join(", ")} ${conditionsWhere}`;
        //console.log(command);
        this.client.query(command, values, callback)
    }

    delete({table="", conditionsAnd=[]} = {}, callback, paramsQuery=[]){
        let conditionsWhere="";
        if(conditionsAnd.length>0){
            conditionsWhere=`where ${conditionsAnd.join(" and ")}`;
        }
        
        let command=`delete from ${table} ${conditionsWhere}`;
        //console.log(command);
        this.client.query(command, paramsQuery, callback)
    }
}

module.exports=AccessDB;