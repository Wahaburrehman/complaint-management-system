// Plain JavaScript: theme toggle + navbar shadow on scroll
function toggleTheme(){var d=document.documentElement,n=d.dataset.theme==="dark"?"light":"dark";d.dataset.theme=n}
window.addEventListener("scroll",function(){var n=document.getElementById("nav");if(n)n.classList.toggle("nav-shadow",window.scrollY>10)});
