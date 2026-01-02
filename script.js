const photos = [
  { src: 'assets/photos/bocchi1.jpg' },
  { src: 'assets/photos/bocchi2.jpg' },
  { src: 'assets/photos/bocchi3.jpg' },
  { src: 'assets/photos/bocchi4.jpg' },
  { src: 'assets/photos/bocchi5.jpg' },
  { src: 'assets/photos/bocchi6.jpg' },
  { src: 'assets/photos/bocchi7.jpg' },
  { src: 'assets/photos/bocchi8.jpg' },
  { src: 'assets/photos/bocchi9.jpg' },
  { src: 'assets/photos/bocchi10.jpg' },
  { src: 'assets/photos/bocchi11.jpg' },
  { src: 'assets/photos/bocchi12.jpg' },
  { src: 'assets/photos/bocchi13.jpg' },
  { src: 'assets/photos/bocchi14.jpg' },
  { src: 'assets/photos/bocchi15.jpg' },
  { src: 'assets/photos/bocchi16.jpg' },
  { src: 'assets/photos/bocchi17.jpg' },
  { src: 'assets/photos/bocchi18.jpg' },
  { src: 'assets/photos/bocchi19.jpg' },
  { src: 'assets/photos/bocchi20.jpg' },
  { src: 'assets/photos/bocchi21.jpg' },
  { src: 'assets/photos/bocchi22.jpg' },
  { src: 'assets/photos/bocchi23.jpg' },
  { src: 'assets/photos/bocchi24.jpg' },
  { src: 'assets/photos/bocchi25.jpg' },
  { src: 'assets/photos/bocchi26.jpg' },
  { src: 'assets/photos/bocchi27.jpg' }
];

const photosPerPage = 9;
let currentPage = 1;
let activePhoto = null;

/* ELEMENT */
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const farcasterBtn = document.getElementById('farcasterBtn');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageIndicator = document.getElementById('page-indicator');
const footer = document.getElementById('footer');

/* =========================
   FARCASTER
   ========================= */
function openFarcasterDraft(photoSrc) {
  const origin = window.location.origin;
  const imageURL = new URL(photoSrc, origin).href;

  // 
  const textLines = [
    "[You must add a quote here]",
    imageURL
  ];

  const text = encodeURIComponent(textLines.join("\n"));

  window.open(
    "https://warpcast.com/~/compose?text=" + text,
    "_blank"
  );
}

/* =========================
   SKELETON LOADING
   ========================= */
function showSkeleton() {
  gallery.innerHTML = '';
  for (let i = 0; i < photosPerPage; i++) {
    const skel = document.createElement('div');
    skel.className = 'skeleton';
    gallery.appendChild(skel);
  }
}

/* =========================
   RENDER GALLERY (FADE)
   ========================= */
function renderGallery() {
  gallery.classList.remove('fade-in');
  gallery.classList.add('fade-out');

  showSkeleton();

  setTimeout(() => {
    gallery.innerHTML = '';

    const start = (currentPage - 1) * photosPerPage;
    const end = start + photosPerPage;
    const currentPhotos = photos.slice(start, end);

    currentPhotos.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.src;
      img.draggable = false;

      img.onclick = () => {
        activePhoto = photo.src;
        lightbox.style.display = 'block';
        lightboxImg.src = photo.src;
        document.body.style.overflow = 'hidden';
      };

      gallery.appendChild(img);
    });

    const totalPages = Math.ceil(photos.length / photosPerPage);
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    gallery.classList.remove('fade-out');
    gallery.classList.add('fade-in');
  }, 300);
}

/* =========================
   FARCASTER BUTTON
   ========================= */
farcasterBtn.onclick = e => {
  e.stopPropagation();
  if (activePhoto) {
    openFarcasterDraft(activePhoto);
  }
};

/* =========================
   CLOSE LIGHTBOX
   ========================= */
lightbox.onclick = e => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
};

/* =========================
   PAGINATION
   ========================= */
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderGallery();
  }
};

nextBtn.onclick = () => {
  if (currentPage < Math.ceil(photos.length / photosPerPage)) {
    currentPage++;
    renderGallery();
  }
};

/* =========================
   SWIPE (HP)
   ========================= */
let touchStartX = 0;
let touchEndX = 0;

gallery.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

gallery.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const distance = touchEndX - touchStartX;
  const minSwipe = 60;

  if (distance < -minSwipe && currentPage < Math.ceil(photos.length / photosPerPage)) {
    currentPage++;
    renderGallery();
  }

  if (distance > minSwipe && currentPage > 1) {
    currentPage--;
    renderGallery();
  }
}

/* =========================
   PREVENT IMAGE DOWNLOAD
   ========================= */
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

document.addEventListener('dragstart', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

/* =========================
   FOOTER
   ========================= */
window.addEventListener('load', () => {
  if (footer) footer.classList.add('show');
});

/* INIT */
renderGallery();
