(function(){
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
})();

// Mobile nav toggle
(function(){
  var nav = document.querySelector('.site-nav');
  var toggle = nav && nav.querySelector('.nav-toggle');
  if (!toggle) return;
  function close(){
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', function(){
    var open = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('#primary-nav a').forEach(function(a){
    a.addEventListener('click', close);
  });
})();
