    // ── Slide logic ──
    const track = document.getElementById('slidesTrack');
    const dotsContainer = document.getElementById('slideDots');
    const slides = track.querySelectorAll('.slide');
    let current = 0;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goTo(i);
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function changeSlide(dir) { goTo(current + dir); }

    // Auto-advance every 6s
    setInterval(() => changeSlide(1), 6000);

    // ── Skill bar animation on scroll ──
    const bars = document.querySelectorAll('.skill-bar-fill');
    const widths = Array.from(bars).map(b => b.style.width);
    bars.forEach(b => b.style.width = '0');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach((b, i) => b.style.width = widths[i]);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) observer.observe(skillsSection);
