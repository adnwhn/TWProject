window.onload = function(){
    x=100
    document.getElementById("filter").onclick = function(){
        var inpName = document.getElementById("inp-name").value.toLowerCase().trim();
        var inpCat = document.getElementById("inp-cat").value;

        var products = document.getElementsByClassName("disc");
        for (let product of products){
            var cond1 = false, cond2 = false;
            product.style.display = "none";

            let name = product.getElementsByClassName("val-album")[0].innerHTML.toLowerCase().trim();
            if(name.includes(inpName)){
                // keep the elem
                cond1 = true; 
            }

            let categorie = product.getElementsByClassName("val-genre")[0].innerHTML;
            console.log(categorie, inpCat);
            if(inpCat=="all" || categorie==inpCat){
                cond2 = true;
            }

            if(cond1 && cond2){
                product.style.display = "block"; 
            }
        }

        

        
        
    }

    //resetare filtre
    document.getElementById("reset").onclick = function(){
        document.getElementById("inp-name").value="";  
        document.getElementById("sel-all").selected=true;
    }
}