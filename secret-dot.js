/*
  SECRET-DOT.JS
  ----------------------------------------
  Un puntito rojo casi invisible que aparece de vez en cuando, en una
  posición aleatoria de la pantalla, se queda unos segundos y luego
  se desvanece solo. Si alguien le da clic mientras está visible, lo
  manda a la página escondida.

  Para quitarlo de una página basta con no incluir este <script>.
  Para usarlo en otra página, solo agrega:
    <script src="secret-dot.js"></script>

  AJUSTES RÁPIDOS
  ----------------------------------------
  - DESTINATION: a qué página lleva el punto.
  - MIN_WAIT / MAX_WAIT: cada cuánto puede aparecer (en milisegundos).
  - VISIBLE_TIME: cuánto dura visible antes de desvanecerse si nadie
    le da clic.
*/
(function(){
  const DESTINATION = 'grieta.html';
  const MIN_WAIT = 40000;    // 40s
  const MAX_WAIT = 110000;   // 110s
  const VISIBLE_TIME = 5000; // 5s

  function randomBetween(min, max){
    return Math.random() * (max - min) + min;
  }

  function spawnDot(){
    // evita que aparezcan dos al mismo tiempo
    if(document.querySelector('.secret-dot')) return;

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'secret-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.tabIndex = -1;

    const margin = 60;
    const maxX = Math.max(margin, window.innerWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - margin);
    const x = randomBetween(margin, maxX);
    const y = randomBetween(margin, maxY);
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';

    document.body.appendChild(dot);
    requestAnimationFrame(()=> dot.classList.add('show'));

    let clicked = false;
    dot.addEventListener('click', ()=>{
      clicked = true;
      window.location.href = DESTINATION;
    });

    setTimeout(()=>{
      if(clicked) return;
      dot.classList.remove('show');
      setTimeout(()=> dot.remove(), 1400);
    }, VISIBLE_TIME);
  }

  function scheduleNext(){
    const wait = randomBetween(MIN_WAIT, MAX_WAIT);
    setTimeout(()=>{
      spawnDot();
      scheduleNext();
    }, wait);
  }

  scheduleNext();
})();
