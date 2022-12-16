function setCookie(name, value, expireTime){
    d=new Date();
    d.setTime(d.getTime()+expireTime);
    document.cookie=`${name}=${value}; expires=${d.toUTCString()}`;
}

function getCookie(name){
    parameters_vector = document.cookie.split(";") // ["a=smth", "b=smthElse"]
    for(let param of parameters_vector){
        if(param.trim().startsWith(name+"=")){
            return param.split("=")[1]
        }
    }
    return null;
}

function deleteCookie(name){
    document.cookie=`${name}; expires=${(new Date()).toUTCString()}`;
}

window.addEventListener("load", function(){
    if(getCookie("accepted_banner")){
        document.getElementById("banner").style.display="none";
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("accepted_banner", true, 60000); // "true" is converted to string; expTime=60000ms (1min)
        document.getElementById("banner").style.display="none";
    }
})