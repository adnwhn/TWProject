window.addEventListener("DOMContentLoaded", function(){
    document.getElementById("theme-change").onclick=function(){

        //themes_vector = ["dark", "light", "x", "y"];

        currentTheme = localStorage.getItem("theme");
        if (currentTheme){
            document.body.classList.add(currentTheme);
        }

        document.getElementById("theme-change").onclick=function(){
            if (document.body.classList.contains("dark")){
                document.body.classList.remove("dark");
                document.getElementById("theme-change").classList.remove("dark");
                document.getElementById("theme-change").classList.add("light");
                localStorage.removeItem("theme");
                // set themes_vector[1]
            } else {
                document.body.classList.add("dark");
                document.getElementById("theme-change").classList.remove("light");
                document.getElementById("theme-change").classList.add("dark");
                localStorage.setItem("theme", "dark");

            }

        }

        
    }

});