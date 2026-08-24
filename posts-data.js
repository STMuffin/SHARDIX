/*
  POSTS-DATA.JS
  ----------------------------------------
  Aquí viven todos los posts del blog. blog.html lee este arreglo y
  construye la lista y el detalle de cada entrada automáticamente.

  Para publicar una entrada nueva, la forma normal es entrar a
  new-post.html, iniciar sesión con tu repositorio (usuario/repo) y tu
  token de GitHub, llenar el formulario y darle "PUBLICAR EN GITHUB":
  el commit a este archivo lo hace la propia página. Si prefieres
  hacerlo a mano, ahí mismo puedes copiar el código generado y pegarlo
  dentro del arreglo POSTS de aquí abajo.

  Como el sitio es estático (GitHub Pages), no hay una base de datos
  detrás: este archivo ES la base de datos del blog.

  IMÁGENES
  ----------------------------------------
  Las imágenes NO se guardan en base64 dentro de este archivo — se
  suben como archivos aparte a la carpeta images/ del repositorio, y
  aquí solo se guarda la ruta relativa.
  - Portada (opcional): "cover: 'images/nombre-del-archivo.png'".
    Se muestra en la tarjeta de la lista y arriba del post completo.
  - Imágenes dentro del contenido: escribe una línea así, sola y con
    líneas en blanco antes y después, en cualquier parte de "content":
      ![texto alternativo](images/nombre-del-archivo.png)
  new-post.html sube el archivo a images/ y arma todo esto solo con su
  botón "+ Insertar imagen" — no hace falta escribirlo a mano.
*/

const POSTS = [
  
  {
    slug: "shardix-update-1",
    title: "SHARDIX - UPDATE 1",
    date: "2026-08-21",
    tags: ["SHARDIX UPDATES"],
    cover: "images/1787382808858-pixil-frame-0.png",
    excerpt: "Una pequeña actualizacion de SHARDIX, la pagina web que te encuentras ahora mismo - #1",
    content: "## **¡SHARDIX UPDATE #1! - FIXES AND TESTING**\n\n¡Hola personita que lee los posts de mi blog! Como posiblemente sepas, estoy desarrollando esta pagina con el poco conocimiento que llevo acerca de [color=#e6e600]desarrollo web[/color] y tal, así que he usado [color=#e6e600]IA[/color] en la mayoria de este, dandole retoques en lo que entiendo y así poder mejorarlo de manera personal.\n\n![Muffin Girando](images/1787382887238-chibi-starymuffin-x32-turn.gif)\n\n\n\n## ¡Cambios en la pagina principal!\n\nAhora cuando [color=#d80e0e]entras[/color] por primera vez hay una mejora visual, agregando el logo y una ligera animacion de la pagina, esto se hace para darle una mejor imagen al espectador/visualizador\n\nTambien se ha corregido el cambio de **tipo de letra** a la hora de visualizar blogs, asi como darle [color=#e6e600]soporte[/color] a __imagenes__, __archivos__, __enlaces de redes sociales__ y mucho mas! \n\nLes dejo uno de mis videos de mi canal de youtube, para el que desee seguirme y apoyarme en youtube!\n\nhttps://www.youtube.com/watch?v=nTNyjLbzyDI\n\n\n\n## CANCION DEL POST\n\nEn cada post hare esta seccion, una seccion la cual recomendare una cancion que me gusta mucho o que ha estado en mi radar la ultima semana.\n\n### La cancion del post es...\n\nhttps://open.spotify.com/track/0mMlo76aVZHpuvoR6fjBSK?si=abd2aa223423403c"
  },
  
  
  
  {
    slug: "fin-de-cubikasmp-temporada-3-muchas-gracias-por-jugar",
    title: "FIN DE CUBIKASMP TEMPORADA 3 - MUCHAS GRACIAS POR JUGAR",
    date: "2026-07-28",
    tags: ["CUBIKASMP T3"],
    cover: "https://i.imgur.com/2fw5zpY.png",
    excerpt: "CUBIKASMP T3",
    content: "Escribo este post para anunciar el cierre de CubikaSMP TEMPORADA 3, fue una temporada de pruebas y risas, y aunque tuvo sus momentos incomodos, se logró sobrellevar el servidor y se vivieron momentos increibles, gracias por todo."
  }
];
