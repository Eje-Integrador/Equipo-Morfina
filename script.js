const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const convoBtn = document.getElementById('convo-btn');
const pdfModal = document.getElementById('pdf-modal');
const closePdf = document.getElementById('close-pdf');

// Mostrar/ocultar menú
menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

//Mostrar y ocultar PDF 
convoBtn.addEventListener('click', () => {
  pdfModal.classList.add('show');
});

closePdf.addEventListener('click', () => {
  pdfModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === pdfModal) {
    pdfModal.classList.remove('show');
  }
});

