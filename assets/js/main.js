// Smooth scroll for internal links
document.addEventListener('click', function (e) {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const href = target.getAttribute('href');
  if (href.length <= 1) return;
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    const yOffset = document.querySelector('#mainNav')?.offsetHeight || 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset + 1;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
});

// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();


