 window.onload= function(){
    var form=document.getElementById("form_reg");
    if(form){
    form.onsubmit= function(){
            allowed_extensions=["JPEG", "JPG", "PNG"];
            let allowed = false;
            for(exp in allowed_extensions){
                if(document.getElementById("image").value.endsWith(exp)){
                    allowed = true;
                }
            }
            if(!allowed){
                alert("Image file format incorrect!");
                return false;
            }
            
            if(document.getElementById("username").value==''){
                alert("The username can't be null.");
                return false;
            }
            if(document.getElementById("username").value.includes("/")
            ||document.getElementById("username").value.includes("..")
            ||document.getElementById("username").value.includes("./")
            ||document.getElementById("username").value.includes("<")
            ||document.getElementById("username").value.includes(">")){
                alert("Username contains characters that are not allowed! Please reintroduce your username.");
                return false;
            }

            if(document.getElementById("lastname").value==''){
                alert("The last name can't be null.");
                return false;
            }
            if(document.getElementById("lastname").value.includes("/")
            ||document.getElementById("lastname").value.includes("..")
            ||document.getElementById("lastname").value.includes("./")
            ||document.getElementById("lastname").value.includes("<")
            ||document.getElementById("lastname").value.includes(">")){
                alert("Last name contains characters that are not allowed! Please reintroduce your last name.");
                return false;
            }

            if(document.getElementById("firstname").value==''){
                alert("The first name can't be null.");
                return false;
            }
            if(document.getElementById("firstname").value.includes("/")
            ||document.getElementById("firstname").value.includes("..")
            ||document.getElementById("firstname").value.includes("./")
            ||document.getElementById("firstname").value.includes("<")
            ||document.getElementById("firstname").value.includes(">")){
                alert("First name contains characters that are not allowed! Please reintroduce your first name.");
                return false;
            }

            if(document.getElementById("email").value==''){
                alert("The email can't be null.");
                return false;
            }
            if(document.getElementById("email").value.includes("/")
            ||document.getElementById("email").value.includes("..")
            ||document.getElementById("email").value.includes("./")
            ||document.getElementById("email").value.includes("<")
            ||document.getElementById("email").value.includes(">")){
                alert("Email contains characters that are not allowed! Please reintroduce your email.");
                return false;
            }

            if(document.getElementById("passw").value==''){
                alert("The password can't be null.");
                return false;
            }

            if(document.getElementById("repeatpassw").value==''){
                alert("The repeated password can't be null.");
                return false;
            }

            if(document.getElementById("passw").value!=document.getElementById("repeatpassw").value){
                alert("The passwords don't match.");
                return false;
            }
            return true;
        }
    }
 }