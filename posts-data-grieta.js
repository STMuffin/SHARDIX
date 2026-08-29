/*
  POSTS-DATA-GRIETA.JS
  ----------------------------------------
  La versión escondida de posts-data.js — aquí viven los posts del
  blog oculto (grieta.html). Funciona exactamente igual que el blog
  normal: mismo formato de post, mismo post-render.js, mismas reglas.

  CÓMO PUBLICAR AQUÍ
  ----------------------------------------
  Puedes usar new-post.html normalmente: en "OPCIONES AVANZADAS", en
  el campo de la ruta del archivo, escribe:
      posts-data-grieta.js
  en vez de dejar el valor por defecto (posts-data.js). Así el botón
  "PUBLICAR EN GITHUB" edita este archivo en lugar del otro. También
  puedes editar el arreglo de abajo a mano, igual que en el blog
  normal.
*/

const POSTS = [
  {
    slug: "test",
    title: "test",
    date: "2026-08-29T01:35",
    tags: ["test"],
    cover: "images/1787992623031-screenshot-2026-08-20-103228.png",
    excerpt: "asdasd",
    content: "asdasdasd"
  },
  {
    slug: "no-deberias-estar-aqui",
    title: "NO DEBERÍAS ESTAR AQUÍ",
    date: "2026-08-22",
    tags: ["???"],
    excerpt: "Encontraste el punto rojo. Bien. O mal. Todavía no lo sé.",
    content: "## Si estás leyendo esto, encontraste el punto.\n\nNo aparece siempre. No aparece en el mismo lugar dos veces. Y si parpadeas, probablemente te lo pierdas — vuelve a intentarlo la próxima vez que abras el blog.\n\nEsta es la parte de la página que no está en el menú. Aquí voy a dejar cosas distintas: ideas a medio terminar, borradores raros, cosas que no encajan en el blog normal.\n\n, y ya."
  }
];
