window.addEventListener("load",function(){

	prod_sel=localStorage.getItem("virtual_cart");

	if (prod_sel){
		var vect_ids=prod_sel.split(",");
		fetch("/products_cart", {		
			method: "POST",
			headers:{'Content-Type': 'application/json'},
			mode: 'cors',		
			cache: 'default',
			body: JSON.stringify({
				ids_prod: vect_ids
			})
		})
		.then(function(answ){ console.log(answ); x=answ.json(); console.log(x); return x})
		.then(function(objson) {
	
			console.log(objson); // objson is the vector of products
			let main=document.getElementsByTagName("main")[0];
			let btn=document.getElementById("buy");

			for (let prod of objson){
				let article=document.createElement("article");
				article.classList.add("virtual-cart");
				var h2=document.createElement("h2");
				h2.innerHTML=prod.album;
				article.appendChild(h2);
				let image=document.createElement("img");
				image.src="/resources/images/disc-galery/"+prod.image;
				article.appendChild(image);
				
				let description=document.createElement("p");
				description.innerHTML=prod.description+" <b>Price:</b>"+prod.price;
				article.appendChild(description);
				main.insertBefore(article, btn);
			}
		}
		).catch(function(err){console.log(err)});

		document.getElementById("buy").onclick=function(){
			prod_sel=localStorage.getItem("virtual_cart");
			if (prod_sel){
				var vect_ids=prod_sel.split(",");
				fetch("/buy", {		
					method: "POST",
					headers:{'Content-Type': 'application/json'},
					mode: 'cors',		
					cache: 'default',
					body: JSON.stringify({
						ids_prod: vect_ids
					})
				})
				.then(function(answ){ console.log(answ); return answ.text()})
				.then(function(answerText) {
					console.log(answerText);
					if(answerText){
						localStorage.removeItem("virtual_cart")
						let p=document.createElement("p");
						p.innerHTML=answerText;
						document.getElementsByTagName("main")[0].innerHTML="";
						document.getElementsByTagName("main")[0].appendChild(p)
					}
				}).catch(function(err){console.log(err)});
			}
		}
	}
	else{
		document.getElementsByTagName("main")[0].innerHTML="<p>Your cart is empty!</p>";
	}
});