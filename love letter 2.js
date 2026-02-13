$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");
  var btn_yes = $("#response-yes");
  
  // Elementos de la historia
  var btn_story = $("#story-btn");
  var overlay = $("#story-overlay");
  var btn_close_story = $("#close-story");
  
  // Variable para detener la lluvia de pétalos al cerrar
  var petalsInterval;

  // --- FECHA DE INICIO (Tu fecha) ---
  const startDate = new Date("2025-07-25T00:00:00"); 

  envelope.click(function () { open(); });
  btn_open.click(function () { open(); });
  btn_reset.click(function () { close(); });

  btn_yes.click(function (e) {
    e.stopPropagation();
    confetti({
      particleCount: 150, spread: 100, origin: { y: 0.7 },
      colors: ['#ff0000', '#ffcccc', '#ffffff', '#d9534f']
    });
    $(this).text("¡TE AMO! ❤️");
  });

  function open() {
    envelope.addClass("open").removeClass("close");
    btn_yes.fadeIn();
  }

  function close() {
    envelope.addClass("close").removeClass("open");
    btn_yes.fadeOut();
    setTimeout(function(){ btn_yes.text("¡SI! ❤️"); }, 500);
  }

  // --- HISTORIA ---
  btn_story.click(function() {
      overlay.css("display", "flex").hide().fadeIn(500); 
      setTimeout(() => {
          playTreeAnimation(); 
          startTimer();
      }, 100);
  });

  btn_close_story.click(function() {
      overlay.fadeOut(500);
      clearInterval(petalsInterval);
      $(".falling-petal").remove(); 
  });

  // 1. ÁRBOL SÚPER TUPIDO (LOGICA MEJORADA)
  function createLeaves() {
      const group = document.getElementById('leaves-group');
      group.innerHTML = ''; 
      
      // Definimos los puntos clave de las ramas (coordenadas aproximadas de tu SVG)
      // x, y: posición | r: radio de expansión de las hojas en esa rama
      const branchClusters = [
          { x: 250, y: 100, r: 80 }, // Copa central superior
          { x: 180, y: 300, r: 60 }, // Rama izquierda baja
          { x: 320, y: 250, r: 65 }, // Rama derecha media
          { x: 190, y: 180, r: 55 }, // Rama izquierda alta
          { x: 300, y: 140, r: 60 }, // Rama derecha alta
          { x: 250, y: 220, r: 70 }  // Relleno central
      ];

      // Colores de las hojas
      const colors = ["#ff0000", "#ff4d4d", "#ff9999", "#d9534f", "#e60073", "#cc0000"];

      // Recorremos cada rama y le ponemos muchas hojas
      branchClusters.forEach(cluster => {
          // Cantidad de hojas por cluster (entre 80 y 150 hojas POR RAMA)
          const leavesPerCluster = Math.floor(Math.random() * 50) + 100; 

          for (let i = 0; i < leavesPerCluster; i++) {
              const leaf = document.createElementNS("http://www.w3.org/2000/svg", "path");
              
              // Distribución aleatoria dentro del radio del cluster
              const angle = Math.random() * Math.PI * 2;
              const radius = Math.random() * cluster.r;
              
              const posX = cluster.x + radius * Math.cos(angle);
              const posY = cluster.y + radius * Math.sin(angle); 

              leaf.setAttribute("d", "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
              
              const color = colors[Math.floor(Math.random() * colors.length)];
              leaf.setAttribute("fill", color);
              leaf.setAttribute("class", "heart-leaf");
              
              // Ajuste de centro (-12) y escala inicial 0
              leaf.setAttribute("transform", `translate(${posX - 12}, ${posY - 12}) scale(0)`);
              
              group.appendChild(leaf);
          }
      });
  }

  // 2. MÁS PÉTALOS FLOTANTES
  function startFallingPetals() {
      // Intervalo más rápido (80ms) para generar más pétalos
      petalsInterval = setInterval(() => {
          const petal = document.createElement("div");
          petal.classList.add("falling-petal");
          petal.innerHTML = "❤"; 
          
          // Posición: Zona derecha de la pantalla
          const startLeft = window.innerWidth < 600 ? 50 + Math.random() * 40 : 60 + Math.random() * 30;
          const startTop = -10 + Math.random() * 40; // Desde un poco arriba
          
          // Variedad de tamaños
          const size = 10 + Math.random() * 20; // Pétalos más grandes y chicos
          const colors = ["#ff0000", "#ff4d4d", "#d9534f", "#e60073", "#ffb3b3"];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          $(petal).css({
              left: startLeft + "%",
              top: startTop + "%",
              fontSize: size + "px",
              color: color,
              opacity: 0.8,
              transform: `rotate(${Math.random() * 360}deg)`
          });
          
          $("#story-overlay").append(petal);
          
          // Animación de viento fuerte hacia la izquierda
          gsap.to(petal, {
              x: -window.innerWidth * 0.8, // Viajan casi toda la pantalla
              y: window.innerHeight + 100, // Caen hasta abajo
              rotation: Math.random() * 720,
              opacity: 0,
              duration: 5 + Math.random() * 6, // Duración variable
              ease: "none", // Movimiento lineal constante (como viento)
              onComplete: function() {
                  $(this.targets()[0]).remove();
              }
          });
          
      }, 80); // <--- 80ms: Mucho más rápido = Más pétalos
  }

  function playTreeAnimation() {
      createLeaves(); 
      
      const tl = gsap.timeline();
      
      gsap.set(".line-anim", { opacity: 0, y: 20 });
      gsap.set(".title-anim", { opacity: 0, scale: 0.8 });
      gsap.set(".trunk, .branch", { strokeDasharray: 1000, strokeDashoffset: 1000 }); 
      gsap.set(".heart-leaf", { scale: 0, transformOrigin: "center bottom" });

      // Animar tronco y ramas
      tl.to(".trunk", { strokeDashoffset: 0, duration: 2, ease: "power2.out" })
        .to(".branch", { strokeDashoffset: 0, duration: 1.5, stagger: 0.1, ease: "power1.out" }, "-=1.5");

      // Animar hojas (Explosión)
      tl.to(".heart-leaf", {
          scale: "random(0.5, 1.3)", 
          duration: 1.5,
          stagger: { amount: 2, from: "center" }, // Stagger un poco más largo para efecto dramático
          ease: "elastic.out(1, 0.4)",
          onComplete: startFallingPetals 
      }, "-=1");

      // Animar texto
      tl.to(".title-anim", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=2")
        .to(".line-anim", { opacity: 1, y: 0, duration: 0.8, stagger: 0.3 }, "-=1.5");
  }

  function startTimer() {
      setInterval(function() {
          const now = new Date();
          const diff = now - startDate;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          $("#days").text(days);
          $("#hours").text(hours < 10 ? "0" + hours : hours);
          $("#minutes").text(minutes < 10 ? "0" + minutes : minutes);
          $("#seconds").text(seconds < 10 ? "0" + seconds : seconds);
      }, 1000);
  }
});