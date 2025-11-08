const SUPABASE_URL = "https://rqsewzppphnljpjghlzb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc2V3enBwcGhubGpwamdobHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTE0ODEsImV4cCI6MjA3NzIyNzQ4MX0.JA785SoB210vTRMfrT0tfQsW8K-3xPbn7HnyrV_97bI";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const input = document.getElementById('photoInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');
const previewContainer = document.getElementById('previewContainer');
//Nombre de la tabla
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
    gallery.appendChild(img);
  });
}

input.addEventListener('change', () => {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewContainer.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.innerHTML = '';
  }
});

uploadBtn.addEventListener('click', async () => {
  const file = input.files[0];
  if (!file) return alert('Selecciona una imagen primero.');

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Subiendo...";
//Nombre del bucket
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('Tema_1').upload(fileName, file);

  if (error) {
    alert('Error al subir imagen: ' + error.message);
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Subir Foto";
    return;
  }
//Nombre del bucket
  const { data: publicUrlData } = supabase.storage.from('Tema_1').getPublicUrl(fileName);
  const imageUrl = publicUrlData.publicUrl;
//Nombre de la tabla
  const { error: insertError } = await supabase.from('fotos_1').insert([{ url: imageUrl }]);

  if (insertError) {
    alert('Error al guardar en la base de datos: ' + insertError.message);
    console.error(insertError);
  } else {
    previewContainer.innerHTML = '';
    input.value = '';
    await loadGallery();
  }

  uploadBtn.disabled = false;
  uploadBtn.textContent = "Subir Foto";
});

loadGallery();