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
    document.getElementById("calendario-entero").style.display = "none";
}

function showPrevencion() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("noticias").style.display = "none";
    document.getElementById("comite").style.display = "none";
    document.getElementById("prev").style.display = "grid";
    document.getElementById("calendario-entero").style.display = "none";
}

function showAll(){
document.getElementById("inicio").style.display = "flex";
document.getElementById("noticias").style.display = "block";
document.getElementById("comite").style.display = "none";
document.getElementById("prev").style.display = "none";
document.getElementById("calendario-entero").style.display = "block";
}

//SLIDER NOTICIAS
const slider = document.querySelector('.news-slider');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let counter = 0;
const slideWidth = document.querySelector('.news-slide').clientWidth;

nextBtn.addEventListener('click', () => {
  counter++;
  if (counter === slider.children.length) {
    counter = 0;
  }
  slider.style.transform = `translateX(${-slideWidth * counter}px)`;
});

prevBtn.addEventListener('click', () => {
  counter--;
  if (counter < 0) {
    counter = slider.children.length - 1;
  }
  slider.style.transform = `translateX(${-slideWidth * counter}px)`;
});