//_______________SOBRE NOSOTRXS SCRIPT_______________

// script.js - versión completa integrada (menú + visor PDF)
// ---------------------------------------------------------

// Elementos principales
const body = document.body;
const appContent = document.getElementById('appContent');
const menuPanel = document.getElementById('menuPanel');
const burgerBtn = document.getElementById('hamburguerBtn');
const backdrop = document.getElementById('menuBackdrop');

// PDF modal elements (pueden no existir hasta que agregues el HTML correspondiente)
let pdfBtn = document.getElementById('pdfBtn');
let pdfModal = document.getElementById('pdfModal');
let pdfBackdrop = document.getElementById('pdfBackdrop');
let pdfClose = document.getElementById('pdfClose');
let pdfFrame = document.getElementById('pdfFrame');

// Si por alguna razón el modal quedó dentro de .app-content, lo movemos al body
if (pdfModal && appContent && appContent.contains(pdfModal)) {
  document.body.appendChild(pdfModal);
  // re-obtener referencias por si cambian
  pdfModal = document.getElementById('pdfModal');
  pdfBackdrop = document.getElementById('pdfBackdrop');
  pdfClose = document.getElementById('pdfClose');
  pdfFrame = document.getElementById('pdfFrame');
}

// Guardar elemento que tuvo el foco antes de abrir (para devolver el foco)
let lastFocused = null;

// ---------------------
// FUNCIONES DEL MENÚ
// ---------------------
function openMenu() {
  lastFocused = document.activeElement;
  body.classList.add('menu-open');
  if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
  if (menuPanel) menuPanel.setAttribute('aria-hidden', 'false');

  if (menuPanel) {
    const firstLink = menuPanel.querySelector('.menu-link');
    if (firstLink) firstLink.focus();
  }
}

function closeMenu() {
  if (!body.classList.contains('menu-open')) return;

  body.classList.remove('menu-open');
  if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
  if (menuPanel) menuPanel.setAttribute('aria-hidden', 'true');

  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  } else if (burgerBtn) {
    burgerBtn.focus();
  }
  lastFocused = null;
}

// Agregar listeners del menú si existen elementos esperados
if (!burgerBtn) console.warn('No se encontró #hamburguerBtn en el DOM.');
if (!menuPanel) console.warn('No se encontró #menuPanel en el DOM.');

// Toggle con el botón del menú
if (burgerBtn) {
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu();
    else openMenu();
  });
}

// Cerrar al tocar el backdrop del panel (si existe)
if (backdrop) {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.dataset.close !== undefined) {
      closeMenu();
    }
  });
}

// Cerrar cuando se hace click/touch en cualquier parte fuera del panel (solo si menú abierto)
document.addEventListener('pointerdown', (e) => {
  if (!body.classList.contains('menu-open')) return;
  if (menuPanel && (menuPanel.contains(e.target) || (burgerBtn && burgerBtn.contains(e.target)))) return;
  closeMenu();
}, { passive: true });

// Cerrar con ESC para menú
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && body.classList.contains('menu-open')) {
    closeMenu();
  }
});

// Cerrar si un link del menú fue activado
if (menuPanel) {
  const links = menuPanel.querySelectorAll('.menu-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// ---------------------
// FUNCIONES DEL PDF (modal)
// ---------------------

// Intentar leer la ruta desde data-pdf en el botón
let PDF_SRC = null;
pdfBtn = document.getElementById('pdfBtn'); // re-obtener por si cambió
if (pdfBtn && pdfBtn.dataset && pdfBtn.dataset.pdf) {
  PDF_SRC = pdfBtn.dataset.pdf;
} else {
  // si no hay data-pdf, avisamos por consola (puedes setear PDF_SRC manualmente)
  if (pdfBtn) console.warn('El botón #pdfBtn existe pero no tiene data-pdf. Añade data-pdf="ruta/archivo.pdf" o asigna PDF_SRC en el script.');
}

// Comprobaciones (útiles para depuración)
if (!pdfBtn) console.warn('No se encontró #pdfBtn en el DOM. El visor PDF no podrá abrirse.');
if (!pdfModal) console.warn('No se encontró #pdfModal en el DOM. Inserta el HTML del modal antes de <script>.');
if (!pdfBackdrop) console.warn('No se encontró #pdfBackdrop en el DOM.');
if (!pdfFrame) console.warn('No se encontró #pdfFrame en el DOM.');
if (!pdfClose) console.warn('No se encontró #pdfClose en el DOM. Añade el botón de cerrar en el modal si quieres cierre con botón.');

// Abrir modal PDF
function openPdf() {
  if (!pdfModal || !pdfFrame) {
    console.error('Elementos del modal PDF no encontrados en el DOM.');
    return;
  }
  if (!PDF_SRC) {
    console.error('No se ha especificado la ruta del PDF (PDF_SRC está vacío). Asegura data-pdf en #pdfBtn o asigna PDF_SRC en el script.');
    return;
  }

  lastFocused = document.activeElement;

  // cerrar menú si está abierto
  if (body.classList.contains('menu-open')) closeMenu();

  // asignar src al iframe
  pdfFrame.src = PDF_SRC;

  // mostrar modal
  pdfModal.setAttribute('aria-hidden', 'false');
  body.classList.add('pdf-open');

  if (pdfClose) pdfClose.focus();
}

// Cerrar modal PDF
function closePdf() {
  if (!pdfModal || !pdfFrame) return;

  pdfModal.setAttribute('aria-hidden', 'true');
  body.classList.remove('pdf-open');

  // limpiar src para liberar recursos
  pdfFrame.src = '';

  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  } else if (burgerBtn) {
    burgerBtn.focus();
  }
  lastFocused = null;
}

// Eventos para abrir/cerrar PDF
if (pdfBtn) {
  pdfBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPdf();
  });
}

// Cerrar con click en backdrop del modal
if (pdfBackdrop) {
  pdfBackdrop.addEventListener('click', (e) => {
    if (e.target === pdfBackdrop || e.target.dataset.close !== undefined) closePdf();
  });
}

// Cerrar con el botón de cerrar del modal
if (pdfClose) {
  pdfClose.addEventListener('click', closePdf);
}

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (body.classList.contains('pdf-open')) closePdf();
  }
});

// Evitar que el pointerdown global cierre el modal cuando este está abierto.
// Si se hace click fuera del modal (no en el backdrop), cerramos el modal
document.addEventListener('pointerdown', (e) => {
  if (!body.classList.contains('pdf-open')) return;

  if (pdfModal && pdfModal.contains(e.target)) {
    // clic dentro del modal -> no cerrar aquí
    return;
  }

  // clic fuera del modal -> cerrar
  closePdf();
}, { passive: true });

// Observador para cambios dinámicos en data-pdf (si actualizas ruta en runtime)
if (pdfBtn) {
  const observer = new MutationObserver(() => {
    if (pdfBtn.dataset && pdfBtn.dataset.pdf) {
      PDF_SRC = pdfBtn.dataset.pdf;
    }
  });
  observer.observe(pdfBtn, { attributes: true, attributeFilter: ['data-pdf'] });
}

//SUPABASE

const SUPABASE_URL = "https://rqsewzppphnljpjghlzb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc2V3enBwcGhubGpwamdobHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTE0ODEsImV4cCI6MjA3NzIyNzQ4MX0.JA785SoB210vTRMfrT0tfQsW8K-3xPbn7HnyrV_97bI";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const input = document.getElementById('photoInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');
const previewContainer = document.getElementById('previewContainer');


// Cargar galería desde tabla fotos_1

async function loadGallery() {
  const { data, error } = await supabase
    .from('fotos_1')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error al cargar la galería:', error);
    return;
  }

  gallery.innerHTML = '';
  data.forEach(item => {
    const img = document.createElement('img');
    img.src = item.url;
    img.addEventListener("click", () => openLightbox(item.url));
    gallery.appendChild(img);
  });
}

loadGallery();


// Vista previa normal

input.addEventListener('change', () => {
  const file = input.files[0];
  previewContainer.innerHTML = '';

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});


// Subir foto a galería
uploadBtn.addEventListener('click', async () => {
  const file = input.files[0];
  if (!file) return alert('Selecciona una imagen primero.');

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Subiendo...";

  const fileName = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('Tema_1')
    .upload(fileName, file);

  if (uploadError) {
    alert('Error al subir imagen: ' + uploadError.message);
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Subir Foto";
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from('Tema_1')
    .getPublicUrl(fileName);

  const imageUrl = publicUrlData.publicUrl;

  const { error: insertError } = await supabase.from('fotos_1').insert([
    { url: imageUrl }
  ]);

  if (insertError) {
    alert('Error al guardar en la base de datos: ' + insertError.message);
  }

  previewContainer.innerHTML = '';
  input.value = '';
  uploadBtn.disabled = false;
  uploadBtn.textContent = "Subir Foto";

  loadGallery();
});


// Lightbox / Modal

const light = document.getElementById("lightbox");
const boxImg = document.getElementById("lightboxImg");
const modalPreview = document.getElementById("modalPreview");
const modalInput = document.getElementById("modalPhotoInput");

// Cerrar modal clickeando afuera
light.addEventListener("click", (e) => {
  if (e.target === light) {
    light.classList.add("hidden");
  }
});

document.getElementById("closeLightbox").addEventListener("click", () => {
  light.classList.add("hidden");
});


// ABRIR LIGHTBOX Y CARGAR COMPARACIÓN

async function openLightbox(url) {
  boxImg.src = url;
  modalPreview.innerHTML = "";
  light.classList.remove("hidden");

  // Buscar comparación en Supabase
  const { data, error } = await supabase
    .from("dialogo")
    .select("*")
    .eq("imagen_actual", url)
    .order("fecha", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error buscando comparación:", error);
    return;
  }

  if (!data || data.length === 0) return;

  const comp = data[0];

  // Crear contenedor lado a lado
  const cont = document.createElement("div");
  cont.style.display = "flex";
  cont.style.gap = "15px";
  cont.style.marginTop = "12px";

  const original = document.createElement("img");
  original.src = comp.imagen_actual;
  original.style.width = "45%";
  original.style.borderRadius = "10px";

  const nueva = document.createElement("img");
  nueva.src = comp.imagen_nueva;
  nueva.style.width = "45%";
  nueva.style.borderRadius = "10px";

  cont.appendChild(original);
  cont.appendChild(nueva);
  modalPreview.appendChild(cont);
}


// Vista previa modal

modalInput.addEventListener("change", () => {
  const file = modalInput.files[0];
  modalPreview.innerHTML = "";

  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.width = "120px";
    img.style.borderRadius = "8px";
    modalPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});


// SUBIR FOTO NUEVA (COMPARACIÓN)
document.getElementById("modalUploadBtn").addEventListener("click", uploadModal);

async function uploadModal() {
  const file = modalInput.files[0];
  if (!file) return alert("Selecciona una imagen");

  const originalUrl = boxImg.src;
  const fileName = `${Date.now()}-comparacion-${file.name}`;

  // Subir imagen nueva
  const { error: uploadError } = await supabase.storage
    .from("Tema_1")
    .upload(fileName, file);

  if (uploadError) {
    alert("Error al subir desde el modal");
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("Tema_1")
    .getPublicUrl(fileName);

  const newUrl = publicUrlData.publicUrl;

  // Guardar comparación en tabla
  await supabase.from("dialogo").insert([
    {
      imagen_actual: originalUrl,
      imagen_nueva: newUrl
    }
  ]);

  // Limpiar vista previa temporal
  modalPreview.innerHTML = "";
  modalInput.value = "";


  openLightbox(originalUrl);
}

