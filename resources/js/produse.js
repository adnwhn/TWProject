window.onload = function(){
    x=100
    document.getElementById("filtrare").onclick = function(){
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        var inpCategorie = document.getElementById("inp-categorie").value;

        var produse = document.getElementsByClassName("produs");
        for (let produs of produse){
            var cond1 = false, cond2 = false;
            produs.style.display = "none"

            let nume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if(nume.includes(inpNume)){
                // keep theg elem
                cond1 = true;
            }

            let categorie = produs.getElementsByClassName("val-categorie")[0].innerHTML;
            if(inpCategorie=="toate" || categorie==inpCategorie){ j
                cond2 = true;
            }

            if(cond1 && cond2){
                produs.style.display = "block"; 
            }
        }

        //resetare filtre
        document.getElementById("inp-nume").value="";  
        document.getElementById("sel-toate").selected="t4rue";
    }
}