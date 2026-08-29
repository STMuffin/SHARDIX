/*
  GITHUB-AUTH.JS
  ----------------------------------------
  Login (token de GitHub) + helpers de la API, compartido por
  new-post.html, edit-post.html y delete-post.html.

  Requiere que la página tenga estos elementos con estos IDs:
  loginScreen, loginForm, l-repo, l-token, advancedToggle,
  advancedFields, l-branch, l-path, sessionBar, whoText, logoutBtn,
  formWrap.

  Si la página define window.onGithubLogin(auth), se llama justo
  después de iniciar sesión (o si ya había una sesión guardada).

  Si la página define window.GH_AUTH_KEY (ANTES de cargar este script),
  la sesión se guarda bajo esa llave en vez de la llave por defecto
  ("gh_auth"). Esto es lo que usa new-post-grieta.html para tener su
  propia sesión, separada de la del blog normal — así iniciar sesión
  en una página no te deja publicando sin querer en el archivo de la
  otra.
*/

const GH_AUTH_KEY = window.GH_AUTH_KEY || 'gh_auth';

function getAuth(){
  const raw = sessionStorage.getItem(GH_AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

function ghShowApp(){
  const auth = getAuth();
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('sessionBar').style.display = 'flex';
  document.getElementById('formWrap').style.display = 'flex';
  document.getElementById('whoText').innerHTML = `Conectado como <strong>${auth.owner}/${auth.repo}</strong> (${auth.branch})`;
  if(typeof window.onGithubLogin === 'function') window.onGithubLogin(auth);
}

function ghShowLogin(){
  document.getElementById('loginScreen').style.display = 'block';
  document.getElementById('sessionBar').style.display = 'none';
  document.getElementById('formWrap').style.display = 'none';
}

function initGithubLogin(){
  document.getElementById('advancedToggle').addEventListener('click', ()=>{
    const box = document.getElementById('advancedFields');
    const btn = document.getElementById('advancedToggle');
    const open = box.style.display !== 'none';
    box.style.display = open ? 'none' : 'block';
    btn.textContent = open ? 'OPCIONES AVANZADAS ▾' : 'OPCIONES AVANZADAS ▴';
  });

  document.getElementById('loginForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const repoField = document.getElementById('l-repo').value.trim();
    const branch = document.getElementById('l-branch').value.trim() || 'main';
    const path = document.getElementById('l-path').value.trim() || 'posts-data.js';
    const token = document.getElementById('l-token').value.trim();

    const parts = repoField.split('/').map(p=>p.trim()).filter(Boolean);
    if(parts.length !== 2 || !token){
      alert('Escribe el repositorio como usuario/repositorio y pega tu token.');
      return;
    }
    const [owner, repo] = parts;
    sessionStorage.setItem(GH_AUTH_KEY, JSON.stringify({owner, repo, branch, path, token}));
    ghShowApp();
  });

  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    sessionStorage.removeItem(GH_AUTH_KEY);
    ghShowLogin();
  });

  if(getAuth()) ghShowApp(); else ghShowLogin();
}

/* ---------- helpers de codificación ---------- */
function utf8ToBase64(str){
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToUtf8(b64){
  const binary = atob(b64.replace(/\n/g,''));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function jsStringLiteral(str){
  return JSON.stringify(str);
}

function slugify(text){
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'')
    .trim()
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-');
}

function sanitizeFilename(name){
  const dotIdx = name.lastIndexOf('.');
  const ext = dotIdx !== -1 ? name.slice(dotIdx) : '';
  const base = dotIdx !== -1 ? name.slice(0, dotIdx) : name;
  const clean = base.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  return (clean || 'archivo') + ext.toLowerCase();
}

/* ---------- API de GitHub ---------- */
function authHeaders(auth){
  return {
    'Authorization': `Bearer ${auth.token}`,
    'Accept': 'application/vnd.github+json'
  };
}

async function githubErrorMessage(res, prefix){
  let detail = '';
  try{
    const data = await res.json();
    detail = data.message || '';
  }catch(e){}
  if(res.status === 401) detail = 'Token inválido o vencido.';
  if(res.status === 403) detail = detail || 'Sin permisos suficientes en el repositorio (revisa el scope del token).';
  if(res.status === 404) detail = 'No encontré ese repositorio, rama o archivo. Revisa usuario/repo/ruta.';
  return `${prefix}: ${detail} (código ${res.status})`;
}

async function fetchPostsFile(auth){
  const apiBase = `https://api.github.com/repos/${auth.owner}/${auth.repo}/contents/${auth.path}`;
  const res = await fetch(`${apiBase}?ref=${encodeURIComponent(auth.branch)}`, {
    headers: authHeaders(auth)
  });
  if(!res.ok) throw new Error(await githubErrorMessage(res, 'No pude leer el archivo de posts'));
  const data = await res.json();
  return { content: base64ToUtf8(data.content), sha: data.sha, apiBase };
}

async function putPostsFile(auth, apiBase, content, sha, message){
  const res = await fetch(apiBase, {
    method: 'PUT',
    headers: {...authHeaders(auth), 'Content-Type': 'application/json'},
    body: JSON.stringify({
      message,
      content: utf8ToBase64(content),
      sha,
      branch: auth.branch
    })
  });
  if(!res.ok) throw new Error(await githubErrorMessage(res, 'No pude guardar los cambios'));
  const data = await res.json();
  return data.commit && data.commit.html_url ? data.commit.html_url : null;
}

async function uploadAssetToGithub(file, auth){
  const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const base64 = await new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ()=> resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const apiUrl = `https://api.github.com/repos/${auth.owner}/${auth.repo}/contents/images/${filename}`;
  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {...authHeaders(auth), 'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: `Subir archivo: ${filename}`,
      content: base64,
      branch: auth.branch
    })
  });
  if(!res.ok) throw new Error(await githubErrorMessage(res, 'No pude subir el archivo'));
  return `images/${filename}`;
}

/* ---------- localizar un post exacto dentro del código fuente ---------- */
/*
  Recorre el texto de posts-data.js carácter por carácter (respetando
  strings entre comillas) para encontrar cada objeto { ... } dentro del
  arreglo POSTS, sin depender de expresiones regulares frágiles.
  Devuelve [{start, end, raw, slug}], donde start/end son índices del
  '{' y '}' de cada post (end es inclusivo).
*/
function extractPostObjects(content){
  const marker = 'const POSTS = [';
  const startIdx = content.indexOf(marker);
  if(startIdx === -1) throw new Error(`No encontré "${marker}" en el archivo.`);

  const objects = [];
  let i = startIdx + marker.length;
  let arrayDepth = 1;
  let inString = false;
  let stringChar = '';
  let objStart = -1;
  let objDepth = 0;

  for(; i < content.length; i++){
    const ch = content[i];

    if(inString){
      if(ch === '\\'){ i++; continue; }
      if(ch === stringChar){ inString = false; }
      continue;
    }

    if(ch === '"' || ch === "'" || ch === '`'){
      inString = true; stringChar = ch; continue;
    }
    if(ch === '['){ arrayDepth++; continue; }
    if(ch === ']'){
      arrayDepth--;
      if(arrayDepth === 0) break;
      continue;
    }
    if(ch === '{'){
      if(objDepth === 0) objStart = i;
      objDepth++;
      continue;
    }
    if(ch === '}'){
      objDepth--;
      if(objDepth === 0 && objStart !== -1){
        const objEnd = i;
        const raw = content.slice(objStart, objEnd + 1);
        const slugMatch = raw.match(/slug:\s*"((?:[^"\\]|\\.)*)"/);
        const slug = slugMatch ? JSON.parse(`"${slugMatch[1]}"`) : null;
        objects.push({ start: objStart, end: objEnd, raw, slug });
        objStart = -1;
      }
      continue;
    }
  }

  return objects;
}

function replacePostObject(content, objects, targetSlug, newObjectCode){
  const target = objects.find(o => o.slug === targetSlug);
  if(!target) throw new Error(`No encontré el post "${targetSlug}" dentro del archivo (¿lo editó alguien más?).`);
  const braceOnly = newObjectCode.slice(newObjectCode.indexOf('{'), newObjectCode.lastIndexOf('}') + 1);
  return content.slice(0, target.start) + braceOnly + content.slice(target.end + 1);
}

function removePostObject(content, objects, targetSlug){
  const target = objects.find(o => o.slug === targetSlug);
  if(!target) throw new Error(`No encontré el post "${targetSlug}" dentro del archivo (¿lo borró alguien más?).`);

  let removeStart = target.start;
  let removeEnd = target.end + 1;

  let j = removeEnd;
  while(j < content.length && /\s/.test(content[j])) j++;
  if(content[j] === ','){
    removeEnd = j + 1;
  }else{
    let k = removeStart - 1;
    while(k >= 0 && /\s/.test(content[k])) k--;
    if(content[k] === ','){
      removeStart = k;
    }
  }

  return content.slice(0, removeStart) + content.slice(removeEnd);
}

/* ---------- construir el código de un post ---------- */
function buildPostObjectCode({slug, title, date, tags, cover, coverNsfw, font, excerpt, content}){
  const tagsCode = '[' + tags.map(t => jsStringLiteral(t)).join(', ') + ']';
  const contentCode = jsStringLiteral(content.replace(/\r\n/g,'\n'));
  const coverLine = cover ? `\n    cover: ${jsStringLiteral(cover)},` : '';
  const coverNsfwLine = (cover && coverNsfw) ? `\n    coverNsfw: true,` : '';
  const fontLine = font ? `\n    font: ${jsStringLiteral(font)},` : '';

  return `  {
    slug: ${jsStringLiteral(slug)},
    title: ${jsStringLiteral(title)},
    date: ${jsStringLiteral(date)},
    tags: ${tagsCode},${coverLine}${coverNsfwLine}${fontLine}
    excerpt: ${jsStringLiteral(excerpt)},
    content: ${contentCode}
  },`;
}
