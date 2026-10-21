// NAVBAR Y FOOTER COMPARTIDOS — edítalos aquí y cambian en todas las páginas
const LINKS=[
    {href:'index.html',text:'Inicio'},
    {href:'nosotros.html',text:'Nosotros'},
    {href:'servicios.html',text:'Servicios'},
    {href:'contactanos.html',text:'Contáctanos'},
    {href:'trabaja-con-nosotros.html',text:'Trabaja con nosotros',cta:true}
];
const page=location.pathname.split('/').pop()||'index.html';

const nav=LINKS.map(l=>{
const cls=[l.cta?'cta':'',l.href===page?'on':''].filter(Boolean).join(' ');
return `<li><a href="${l.href}"${cls?` class="${cls}"`:''}>${l.text}</a></li>`;
}).join('');

document.getElementById('site-header').innerHTML=`
<div class="wrap">
<a class="brand" href="index.html"><img src="imagenes/logo1.webp" alt="Logo Smart Talent Group"><span><span class="l1">Smart</span> <span class="l2">Talent</span> <span class="l3">Group</span></span></a>
<button class="burger" aria-label="Abrir menú" aria-expanded="false">&#9776;</button>
<ul class="menu">${nav}</ul>
</div>`;

const foot=LINKS.map(l=>`<li><a href="${l.href}">${l.text}</a></li>`).join('');
document.getElementById('site-footer').innerHTML=`
<div class="wrap"><div class="fgrid">
<div><h5>Acerca de Nosotros</h5><p>Somos una consultora especializada en recursos humanos. Nuestra experiencia nos permite ofrecer servicios personalizados que se adaptan a las necesidades de nuestros clientes.</p></div>
<div><h5>Navegación</h5><ul>${foot}</ul></div>
<div><h5>Contacto</h5><ul><li><i class="fas fa-envelope"></i>Servicios@stgconsultoria.com</li><li><i class="fas fa-phone"></i>+(51) 994685378</li><li><i class="fas fa-phone"></i>+(51) 949087636</li></ul></div>
<div><h5>Redes Sociales</h5><ul>
<li><a href="https://www.facebook.com/SmartTalentGroup?mibextid=ZbWKwL" target="_blank" rel="noopener"><i class="fab fa-facebook"></i>Facebook</a></li>
<li><a href="https://www.linkedin.com/company/smartalentgroup/" target="_blank" rel="noopener"><i class="fab fa-linkedin-in"></i>Linkedin</a></li>
<li><a href="https://www.instagram.com/smartalentconsultoria?igsh=MWhyY2l3cnY1ajMzdw==" target="_blank" rel="noopener"><i class="fab fa-instagram"></i>Instagram</a></li></ul></div>
</div></div>
<div class="copy">Copyright 2022 Todos Los Derechos Reservados Por: <strong>Smart Talent Group S.R.L.</strong></div>`;
