// ── Audio Configuration ──
// Replace 'sound-file.mp3' with your actual filenames
const sounds = {
  slide: new Howl({
    src: ['swipe.mp3'],
    volume: 0.5
  }),
  click: new Howl({
    src: ['click.mp3'],
    volume: 0.4
  }),
  reveal: new Howl({
    src: ['whoosh.mp3'],
    volume: 0.3
  })
};

// ── Slide Logic ──
const track = document.getElementById('slidesTrack');
const dotsContainer = document.getElementById('slideDots');
const slides = track.querySelectorAll('.slide');
let current = 0;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.onclick = () => {
    sounds.click.play();
    goTo(i);
  };
  dotsContainer.appendChild(dot);
});

function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function changeSlide(dir) {
  sounds.slide.play();
  goTo(current + dir);
}

// Auto-advance every 6s (silent — calls goTo directly, not changeSlide)
setInterval(() => goTo(current + 1), 6000);

// ── Nav Sound Logic ──
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    sounds.click.play();
  });
});

// ── Skill Bar Animation on Scroll ──
const bars = document.querySelectorAll('.skill-bar-fill');
const widths = Array.from(bars).map(b => b.style.width);
bars.forEach(b => b.style.width = '0');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sounds.reveal.play(); // Sound plays when bars start filling
      bars.forEach((b, i) => b.style.width = widths[i]);
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) observer.observe(skillsSection);