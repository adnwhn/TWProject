const Privileges=require('./Privileges.js');

class Role{
    static get type() {return "generic"}
    static get Privileges() {return []}
    constructor (){
        this.cod=this.constructor.type;
    }

    hasPrivilege(privilege){ // privilege must be Symbol
        return this.constructor.Privileges.includes(privilege); 
    }
}

class RoleAdmin extends Role{
    static get type() {return "admin"}
    constructor (){
        super()
    }
    hasPrivilege(){
        return true; // because it's admin
    }
}

class RoleManager extends Role{
    static get type() {return "manager"}
    static get Privileges() { return [
        Privileges.addProducts,
        Privileges.deleteProducts,
        Privileges.updateProducts
    ] }
    constructor (){
        super()
    }
}

class RoleModerator extends Role{
    static get type() {return "moderator"}
    static get Privileges() { return [
        Privileges.viewUsers,
        Privileges.deleteUsers
    ] }
    constructor (){
        super()
    }
}

class RoleClient extends Role{
    static get type() {return "common"}
    static get Privileges() { return [
        Privileges.buyProducts
    ] }
    constructor (){
        super()
    }
}

class RoleFactory{
    static createRole(type){
        switch(type){
            case RoleAdmin.type: return new RoleAdmin();
            case RoleModerator.type: return new RoleModerator();
            case RoleClient.type: return new RoleClient();
            default: throw Error("Invalid role!");
        } 
    }
}

module.exports={
    RoleFactory:RoleFactory,
    RoleAdmin:RoleAdmin
}