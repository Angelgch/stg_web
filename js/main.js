const burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
if(burger)burger.addEventListener('click',()=>{burger.setAttribute('aria-expanded',menu.classList.toggle('open'))});

const track=document.querySelector('.slides');
if(track){
 const n=track.children.length,dots=[...document.querySelectorAll('.dots button')];let i=0,t;
 const go=k=>{i=(k+n)%n;track.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,j)=>d.classList.toggle('on',j===i))};
 const auto=()=>{clearInterval(t);t=setInterval(()=>go(i+1),5000)};
 document.querySelector('.prev').onclick=()=>{go(i-1);auto()};
 document.querySelector('.next').onclick=()=>{go(i+1);auto()};
 dots.forEach((d,j)=>d.onclick=()=>{go(j);auto()});
 go(0);auto();
}
