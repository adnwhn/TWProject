window.addEventListener("load", function(){

    // * virtual cart

    // in local storage, the product ids (and quantity) will be saved in a list, separated by commas
    // example: "3|2, 4|1" -> 2 products with id=3 and 1 product with id=4

    //take data from VC
    let idsProducts=localStorage.getItem("virtual_cart");
    idsProducts=idsProducts?idsProducts.split(","):[];

    for(let idp of idsProducts){
        let ch = document.querySelector(`[value='${idp}'].select-ch-cart`);
        if(ch){
            ch.checked=true;
        }else{
            console.log("Id cos virtual doesn't exist: ", idp);
        }
    }

    //add data in VC
    let checkboxes = document.getElementsByClassName("select-ch-cart");
    for(let ch of checkboxes){
        ch.onchange=function(){
            let idsProducts=localStorage.getItem("virtual_cart");
            idsProducts=idsProducts?idsProducts.split(","):[];
            
            if(ch.checked){
                idsProducts.push(this.value);
            }else{
                let pos = idsProducts.indexOf(this.value);
                if(pos!=-1){
                    idsProducts.splice(pos,1);
                }
            }
            localStorage.setItem("virtual_cart", idsProducts.join(","))
        }
    }

    // *

    document.getElementById("inp-price").onchange = function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
    }

    document.getElementById("filter").onclick = function(){
        //text input check
        checkCond = true;
        var inpName = document.getElementById("inp-lastname").value.toLowerCase().trim();
        checkCond = checkCond && inpName.match(new RegExp("^[a-zA-Z]*$"));
        
        if(!checkCond){
            alert("Wrong inputs!")
            return;
        }
 
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

        if(stringRadio!="all"){
            stringRadio=stringRadio.split(":");
            stringRadio[0]=parseInt(stringRadio[0]);
            stringRadio[1]=parseInt(stringRadio[1]);
        }

        //checkboxes
        var checkBox = document.getElementsByName("gr_chck");
        var stringCheck=[]; //vector=[]
		for(let ch of checkBox){
			if(ch.checked)
                stringCheck.push(ch.value); //vector.push(ch.value)
		}

        
        //multi select
        var multiOptions = document.getElementById("i_sel_multi").options;		
		stringMulti=[];
		for(let opt of multiOptions){
			if(opt.selected)
                stringMulti.push(opt.value);
		}

        //datalist
        var datalist = document.getElementById("i_datalist").value;

        //text area
		var textArea = document.getElementById("i_textarea").value.toLowerCase().trim();

        //minimum price range
        var minPrice = parseFloat(document.getElementById("inp-price").value);

        var products = document.getElementsByClassName("disc");
        contor = 0
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

            let numberOfSongs = parseInt(product.getElementsByClassName("val-songs")[0].innerHTML);
            if(stringRadio=="all" || (stringRadio[0]<=numberOfSongs && stringRadio[1]>=numberOfSongs)){
                cond3 = true;
            }

            let releaseYear = parseInt(product.getElementsByClassName("val-year")[0].innerHTML);
            for(str of stringCheck){
                str = str.split(":");
                str[0] = parseInt( str[0]);
                str[1] = parseInt( str[1]);
                if((str[0]<= releaseYear && str[1]>= releaseYear) || str[0] == releaseYear){
                    cond4 = true;
                }
            }

            let condition = product.getElementsByClassName("val-condition")[0].innerHTML;
            if(stringMulti.includes(condition)){
                cond5 = true;
            }
            
            let price = parseFloat(product.getElementsByClassName("val-price")[0].innerHTML);
            if(minPrice<=price){
                cond6 = true;
            }

            let description= product.getElementsByClassName("description")[0].innerHTML.toLowerCase().trim();
            if(description.includes(textArea))
            {
                cond7 = true;
            }

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7){
                product.style.display = "block"; 
                contor += 1
            }

        }

        if (contor ==0 )
        {
            // get by id noprodfount display 
        }
    }

    document.getElementById("reset").onclick = function(){
        //reset products
        var products = document.getElementsByClassName("disc");
        for (let product of products){
            product.style.display = "block";
        }

        //reset filters
        document.getElementById("inp-lastname").value="";  
        document.getElementById("i_rad4").checked=true;
        document.getElementById("i_check1").checked=true;
        document.getElementById("i_check2").checked=true;
        document.getElementById("i_check3").checked=true;
        document.getElementById("i_check4").checked=true;
        document.getElementById("sel-all").selected=true;
        document.getElementById("sel-multi").selected=true;
    }


    function sort(sign){
        var products = document.getElementsByClassName("disc");
        var v_products = Array.from(products);

        v_products.sort(function(a, b){
            var name_a = a.getElementsByClassName("val-album")[0].innerHTML;
            var name_b = b.getElementsByClassName("val-album")[0].innerHTML;
            

            if(name_a==name_b){

                var songsNumber_a = parseFloat(a.getElementsByClassName("val-songs")[0].innerHTML);
                var songsNumber_b = parseFloat(b.getElementsByClassName("val-songs")[0].innerHTML);

                var price_a = parseFloat(a.getElementsByClassName("val-price")[0].innerHTML);
                var price_b = parseFloat(b.getElementsByClassName("val-price")[0].innerHTML);

                var division_a = songsNumber_a / price_a; 
                var division_b = songsNumber_b / price_b; 
        
                return sign*(division_a - division_b);
            }
            
            return sign*name_a.localeCompare(name_b);
        })

        for (let product of  v_products){
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

});

  
// Alt+"C"
    window.onkeydown=function(e){
        console.log(e);
        if(e.key=='c' && e.altKey){
            var products = document.getElementsByClassName("disc");
            let sum = 0;
            for (let prod of products){
                if(prod.style.display != "none"){
                   sum += parseFloat(prod.getElementsByClassName("val-price")[0].innerHTML);
                }
            }
            console.log(sum);

            if (!document.getElementById("result")){
                result = document.createElement("p");
                result.id = "result";
                result.innerHTML="<b> Total sum: </b>" +sum;

                //document.getElementById("discs").appendChild(result);

                var ps = document.getElementById("p-sum");
                ps.parentNode.insertBefore(result, ps.nextSibling);

                //disappear on click
                result.style.border = "1px solid black";
                result.onclick = function(){
                    this.remove();
                }

                //remove after 2 sec
                setTimeout(function(){
                    document.getElementById("result").remove();
                }, 20000);
            }
        }
    }