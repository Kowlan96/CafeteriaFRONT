function hideAll() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("noticias").style.display = "none";
    document.getElementById("comite").style.display = "none";
    document.getElementById("prev").style.display = "none";
}

function showComite() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("noticias").style.display = "none";
    document.getElementById("comite").style.display = "flex";
    document.getElementById("prev").style.display = "none";
}

function showPrevencion() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("noticias").style.display = "none";
    document.getElementById("comite").style.display = "none";
    document.getElementById("prev").style.display = "flex";
}

function showAll(){
document.getElementById("inicio").style.display = "flex";
document.getElementById("noticias").style.display = "block";
document.getElementById("comite").style.display = "none";
document.getElementById("prev").style.display = "none";
}