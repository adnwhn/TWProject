window.addEventListener("DOMContentLoaded", function(){

        currentTheme = localStorage.getItem("theme");
        if (currentTheme){
            document.body.classList.add(currentTheme);
            document.getElementById("inp-theme").value = currentTheme;
        }

        document.getElementById("theme-change").onclick=function(){
            if (document.body.classList.contains("dark")){
                document.body.classList.remove("dark");
                document.getElementById("theme-change").classList.remove("dark");
                document.getElementById("theme-change").classList.add("light");
                localStorage.removeItem("theme");
            } else {
                document.body.classList.add("dark");
                document.getElementById("theme-change").classList.remove("light");
                document.getElementById("theme-change").classList.add("dark");
                localStorage.setItem("theme", "dark");

            }

        }


        themes_vector = ["dark", "light", "blackwhite", "green"];
        
        document.getElementById("inp-theme").onchange=function(){
            for (let i of themes_vector){
                document.body.classList.remove(i);
            }
    
            document.body.classList.add(this.value);
            localStorage.setItem("theme", this.value);
        }

});