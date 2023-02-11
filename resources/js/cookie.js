function setCookie(name, value, expireTime){ //expireTime in miliseconds
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
    document.cookie=`${name}=0; expires=${(new Date()).toUTCString()}`;
}

window.addEventListener("load", function(){
    if(getCookie("accepted_banner")){
        document.getElementById("banner-cookie").style.display="none";
    }

    document.getElementById("accept-cookies").onclick=function(){
        setCookie("accepted_banner", true, 60000); // "true" is converted to string; expTime=60000ms (1min)
        document.getElementById("banner-cookie").style.display="none";
    }
})

// cookie 2

window.addEventListener("load", function(){
    if(getCookie("accepted_banner2")){
        document.getElementById("banner-cookie2").style.display="none";
    }

    document.getElementById("accept-cookies2").onclick=function(){
        setCookie("accepted_banner2", true, 60000); // "true" is converted to string; expTime=60000ms (1min)
        document.getElementById("banner-cookie2").style.display="none";
    }
})