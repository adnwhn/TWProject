window.onload = function(){
    x=100
    document.getElementById("filter").onclick = function(){
        var inpName = document.getElementById("inp-name").value.toLowerCase().trim();
        var inpCat = document.getElementById("inp-cat").value;

        //radiobuttons
        var radioBut=document.getElementsByName("gr_rad");
        stringRadio="";
        for(let rad of radioBut){
			if(rad.checked){
				stringRadio=rad.value;
				break;//exit for because only one radiobutton can be checked
			}
		}

        //checkboxes
        var checkBox = document.getElementsByName("gr_chck");
        var stringCheck=""; //vector=[]
		for(let ch of checkBox){
			if(ch.checked)
            stringCheck+=ch.value+" "; //vector.push(ch.value)
		}
        
        //multi select
        var multiOptions = document.getElementById("i_sel_multi").options;		
		stringMulti="";
		for(let opt of multiOptions){
			if(opt.selected)
                stringMulti+=opt.value+" ";
		}

        //datalist
        var datalist = document.getElementById("i_datalist").value;

        //text area
		var textArea = document.getElementById("i_textarea").value;

        var products = document.getElementsByClassName("disc");
        for (let product of products){
            var cond1 = false, cond2 = false, cond3 = false, cond4 = false, cond5 = false, cond6 = false, cond7 = false, cond8 = false;
            product.style.display = "none";

            let name = product.getElementsByClassName("val-album")[0].innerHTML.toLowerCase().trim();
            if(name.includes(inpName)){
                // keep the elem
                cond1 = true; 
            }

            let category = product.getElementsByClassName("val-genre")[0].innerHTML;
            if(inpCat=="all" || category==inpCat){
                cond2 = true;
            }

            let numberOfSongs = product.getElementsByClassName("val-songs")[0].innerHTML;
            if(stringRadio=="all" || (stringRadio[0]<=numberOfSongs && stringRadio[1]>=numberOfSongs)){
                cond3 = true;
            }

            let releaseYear = product.getElementsByClassName("val-year")[0].innerHTML;

            ////
            
            for(str of stringCheck){
                if((str[0]<= releaseYear && str[1]>= releaseYear) || str[0] == releaseYear){
                    cond4 = true;
                }
            }
            
            // SAU??

            if(stringCheck.includes(releaseYear)){
                cond4 = true;
            }
            
            ////

            let condition = product.getElementsByClassName("val-condition")[0].innerHTML;
            if(stringMulti=="A" || stringMulti.includes(condition)){
                cond5 = true;
            }
            

            if(cond1 && cond2 && cond3 && cond5){
                product.style.display = "block"; 
            }

        }
    }

    document.getElementById("reset").onclick = function(){
        //reset products
        var products = document.getElementsByClassName("disc");
        for (let product of products){
            product.style.display = "block";
        }

        //reset filters
        document.getElementById("inp-name").value="";  
        document.getElementById("i_rad4").checked=true;
        document.getElementById("i_check1").checked=true;
        document.getElementById("sel-all").selected=true;
        document.getElementById("sel-multi-A").selected=true;
    }


    function sort(sign){
        var products = document.getElementsByClassName("disc");
        var v_products = Array.from(products);

        v_products.sort(function(a, b){
            var price_a = parseFloat(a.getElementsByClassName("val-price")[0].innerHTML);
            var price_b = parseFloat(b.getElementsByClassName("val-price")[0].innerHTML);
            if(price_a==price_b){
                var name_a = a.getElementsByClassName("val-name")[0].innerHTML;
                var name_b = b.getElementsByClassName("val-name")[0].innerHTML;
                return sign*name_a.localeCompare(name_b);
            }
            return sign*(price_a-price_b);
        })

        for (let product of products){
            product.parentNode.appendChild(product);
        }
    }

    // sort ascendent button
    document.getElementById("sortAsc").onclick = function(){
        sort(1);
    }

    // sort descendent button
    document.getElementById("sortDesc").onclick = function(){
        sort(-1);
    }
}