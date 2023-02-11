window.addEventListener("load", function(){
    x=100

    document.getElementById("inp-price").onchange=function(){
        console.log(this.value);
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }
})

