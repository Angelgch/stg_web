const TITULOS={
 inicio:'Smart Talent Group - consultora especializada en recursos humanos',
 nosotros:'Nosotros | Smart Talent Group',
 servicios:'Servicios | Smart Talent Group',
 'como-trabajamos':'Cómo trabajamos | Smart Talent Group',
 contactanos:'Contáctanos | Smart Talent Group',
 'trabaja-con-nosotros':'Trabaja con nosotros | Smart Talent Group',
 privacidad:'Política de privacidad | Smart Talent Group'
};
const $=s=>document.querySelector(s);
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
let obs,carga=0,paradas=[];

async function traer(url){
 const r=await fetch(url);
 if(!r.ok)throw new Error('404');
 return r.text();
}
const paginaActual=()=>location.hash.replace(/^#\/?/,'')||'inicio';

const NOENCONTRADA='<section class="bloque"><div class="wrap"><h1 class="titulo">Página no encontrada</h1><p style="text-align:center"><a class="btn" href="#inicio">Volver al inicio</a></p></div></section>';
const mensajeServidor=()=>'<section class="bloque"><div class="wrap"><h1 class="titulo">Abre el sitio con un servidor</h1><p style="text-align:center">Este sitio junta archivos con JavaScript, así que no funciona con doble clic. Usa la extensión <strong>Live Server</strong> de VS Code (clic derecho en <code>index.html</code> → Open with Live Server) o súbelo a un hosting.</p></div></section>';

/* ---------- ¿hay que evitar movimiento automático? ---------- */
const quieto=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('a11y-sinanim');

/* ---------- carrusel genérico (hero y testimonios) ---------- */
function carrusel(raiz,pista,ms,etiqueta){
 const box=$(raiz),track=$(raiz+' '+pista);
 if(!box||!track)return;
 box.setAttribute('role','region');
 box.setAttribute('aria-roledescription','carrusel');
 box.setAttribute('aria-label',etiqueta);
 const n=track.children.length,dots=[...box.querySelectorAll('.dots button')];let i=0,t;
 const go=k=>{
  i=(k+n)%n;
  track.style.transform=`translateX(-${i*100}%)`;
  [...track.children].forEach((s,j)=>{s.inert=j!==i});
  dots.forEach((d,j)=>{d.classList.toggle('on',j===i);d.setAttribute('aria-current',j===i)});
 };
 const stop=()=>clearInterval(t);
 const auto=()=>{stop();if(!quieto())t=setInterval(()=>go(i+1),ms)};
 box.querySelector('.prev').onclick=()=>{go(i-1);auto()};
 box.querySelector('.next').onclick=()=>{go(i+1);auto()};
 dots.forEach((d,j)=>d.onclick=()=>{go(j);auto()});
 box.onmouseenter=stop;box.onmouseleave=auto;
 go(0);auto();
 paradas.push(stop);
}
function iniciarCarruseles(){
 paradas.forEach(f=>f());paradas=[];
 carrusel('.car','.slides',5000,'Presentación de Smart Talent Group');
 carrusel('.tcar','.tslides',6500,'Testimonios de clientes');
}

/* ---------- logos en desfile infinito (duplica los logos para el bucle) ---------- */
function marquee(){
 const t=$('.marquee-track');
 if(!t||t.dataset.listo)return;
 [...t.children].forEach(c=>{const k=c.cloneNode(true);k.setAttribute('aria-hidden','true');t.append(k)});
 t.dataset.listo=1;
}

/* ---------- animaciones al hacer scroll ---------- */
function animar(){
 obs?.disconnect();
 const els=document.querySelectorAll('.titulo,.quienes>*,.razon,.tarjeta,.cultura>*,.cgrid>.card,.plat>*,.faq-item,.paso,.tcar,.marquee');
 obs=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('vis');
  obs.unobserve(e.target);
  setTimeout(()=>e.target.classList.remove('reveal','vis'),1500);
 }),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
 els.forEach(el=>{
  el.classList.add('reveal');
  el.style.setProperty('--d',Math.min([...el.parentElement.children].indexOf(el),5)*90+'ms');
  obs.observe(el);
 });
}

/* ---------- barra de progreso + botón volver arriba ---------- */
function alScroll(){
 const h=document.documentElement.scrollHeight-innerHeight;
 $('#progreso').style.transform=`scaleX(${h>0?Math.min(scrollY/h,1):0})`;
 $('#arriba').classList.toggle('ver',scrollY>500);
}
addEventListener('scroll',alScroll,{passive:true});
addEventListener('resize',alScroll);

/* ---------- panel de accesibilidad ---------- */
const OPS=['contraste','grises','fuente','espaciado','enlaces','sinanim','cursor'];
const TAMANOS=['100%','112%','125%','150%'];
function aplicarA11y(c){
 const h=document.documentElement;
 h.dataset.fs=c.fs;
 OPS.forEach(o=>h.classList.toggle('a11y-'+o,c.ops.includes(o)));
}
function iniciarA11y(){
 const btn=$('#a11y-btn'),panel=$('#a11y-panel');
 let conf;
 try{conf=JSON.parse(localStorage.getItem('a11y'))||{}}catch(e){conf={}}
 conf.fs=conf.fs||0;conf.ops=conf.ops||[];
 const guardar=()=>{try{localStorage.setItem('a11y',JSON.stringify(conf))}catch(e){}};
 const pintar=()=>{
  aplicarA11y(conf);
  $('#fs-val').textContent=TAMANOS[conf.fs];
  panel.querySelectorAll('[data-op]').forEach(b=>b.setAttribute('aria-pressed',conf.ops.includes(b.dataset.op)));
 };
 const abrir=v=>{
  panel.hidden=!v;
  btn.setAttribute('aria-expanded',v);
  if(v)panel.querySelector('[data-paso]').focus();
 };
 btn.onclick=()=>abrir(panel.hidden);
 panel.querySelector('.a11y-x').onclick=()=>{abrir(false);btn.focus()};
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){abrir(false);btn.focus()}});
 document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!btn.contains(e.target))abrir(false)});
 panel.querySelectorAll('[data-paso]').forEach(b=>b.onclick=()=>{
  conf.fs=Math.max(0,Math.min(TAMANOS.length-1,conf.fs+Number(b.dataset.paso)));
  guardar();pintar();
 });
 panel.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>{
  const o=b.dataset.op;
  conf.ops=conf.ops.includes(o)?conf.ops.filter(x=>x!==o):[...conf.ops,o];
  guardar();pintar();
  if(o==='sinanim')iniciarCarruseles();
 });
 panel.querySelector('.a11y-reset').onclick=()=>{conf.fs=0;conf.ops=[];guardar();pintar();iniciarCarruseles()};
 pintar();
}

/* ---------- formulario de contacto: validación en vivo + envío sin salir de la página ---------- */
function iniciarForm(){
 const f=$('#form-contacto');
 if(!f)return;
 const reglas={
  nombres:v=>v.trim().length>=3||'Escribe tu nombre completo.',
  telefono:v=>/^[+()\d\s-]{7,18}$/.test(v.trim())||'Ingresa un teléfono válido.',
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Ingresa un correo válido.',
  mensaje:v=>v.trim().length>=10||'Cuéntanos un poco más (mínimo 10 caracteres).'
 };
 const validar=el=>{
  let msg='';
  if(el.type==='checkbox'){if(!el.checked)msg='Debes aceptar la política de privacidad.'}
  else if(reglas[el.name]){const r=reglas[el.name](el.value);if(r!==true)msg=r}
  else return true;
  el.setAttribute('aria-invalid',!!msg);
  el.closest('.campo').querySelector('.error').textContent=msg;
  return !msg;
 };
 const campos=[...f.querySelectorAll('input:not([name=_honey]),textarea')];
 campos.forEach(c=>{
  const er=c.closest('.campo').querySelector('.error');
  er.id='err-'+c.id;er.setAttribute('aria-live','polite');
  c.setAttribute('aria-describedby',er.id);
  if(reglas[c.name]||c.type==='checkbox')c.setAttribute('aria-required','true');
  c.addEventListener('blur',()=>{c.dataset.t=1;validar(c)});
  c.addEventListener(c.type==='checkbox'?'change':'input',()=>{if(c.dataset.t||c.getAttribute('aria-invalid')==='true')validar(c)});
 });
 const ex=$('.exito'),est=f.querySelector('.estado'),btn=f.querySelector('.btn');
 $('#otro').onclick=()=>{ex.hidden=true;f.hidden=false};
 f.addEventListener('submit',async e=>{
  e.preventDefault();
  let primero=null;
  campos.forEach(c=>{if(!validar(c)&&!primero)primero=c});
  if(primero){primero.focus();return}
  btn.disabled=true;btn.textContent='Enviando…';est.textContent='';est.className='estado';
  try{
   const datos=Object.fromEntries(new FormData(f));
   const r=await fetch('https://formsubmit.co/ajax/f52e2ebf56c330e331559a4c521bb50e',{
    method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify({...datos,_captcha:'false',_subject:'Nuevo mensaje desde la web - Smart Talent Group'})
   });
   const j=await r.json();
   if(!r.ok||String(j.success)==='false')throw new Error('envio');
   f.reset();
   campos.forEach(c=>{c.removeAttribute('aria-invalid');delete c.dataset.t});
   f.querySelectorAll('.error').forEach(x=>x.textContent='');
   f.hidden=true;ex.hidden=false;
   ex.setAttribute('tabindex','-1');ex.focus();
  }catch(err){
   est.className='estado err';
   est.textContent='No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a Servicios@stgconsultoria.com o por WhatsApp.';
  }
  btn.disabled=false;btn.textContent='Enviar mensaje';
 });
}

/* ---------- carga de páginas con transición suave ---------- */
async function cargarPagina(primera){
 const mi=++carga,p=paginaActual(),main=$('#contenido');
 if(!primera){main.classList.add('fuera');await esperar(220)}
 let html;
 try{html=await traer(`paginas/${p}.html`)}
 catch(e){html=e.message==='404'?NOENCONTRADA:mensajeServidor()}
 if(mi!==carga)return;
 main.innerHTML=html;
 document.title=TITULOS[p]||TITULOS.inicio;
 document.querySelectorAll('.menu a').forEach(a=>{
  const on=a.getAttribute('href')==='#'+p;
  a.classList.toggle('on',on);
  on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');
 });
 $('.menu')?.classList.remove('open');
 window.scrollTo({top:0,behavior:'instant'});
 iniciarCarruseles();marquee();iniciarForm();animar();alScroll();
 if(!primera){main.focus({preventScroll:true});$('#anuncio').textContent=document.title}
 requestAnimationFrame(()=>main.classList.remove('fuera'));
}

(async()=>{
 iniciarA11y();
 $('.saltar').onclick=e=>{e.preventDefault();$('#contenido').focus()};
 $('#arriba').onclick=()=>scrollTo({top:0,behavior:'smooth'});

 try{
  const [nav,foot]=await Promise.all([traer('componentes/navbar.html'),traer('componentes/footer.html')]);
  $('#navbar').innerHTML=nav;
  $('#footer').innerHTML=foot;
 }catch(e){$('#contenido').innerHTML=mensajeServidor();return}

 const b=$('.burger');
 b.onclick=()=>b.setAttribute('aria-expanded',$('.menu').classList.toggle('open'));
 addEventListener('keydown',e=>{
  if(e.key==='Escape'&&$('.menu.open')){$('.menu').classList.remove('open');b.setAttribute('aria-expanded',false);b.focus()}
 });

 const tema=$('.tema'),oscuro=()=>document.documentElement.dataset.theme==='dark';
 tema.setAttribute('aria-pressed',oscuro());
 tema.onclick=()=>{
  const t=oscuro()?'light':'dark';
  document.documentElement.dataset.theme=t;
  tema.setAttribute('aria-pressed',oscuro());
  try{localStorage.setItem('tema',t)}catch(e){}
 };

 await cargarPagina(true);
 addEventListener('hashchange',()=>cargarPagina());
})();