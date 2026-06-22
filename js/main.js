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

// Contact form -> HubSpot Forms API
// TODO(launch): fill in the three HUBSPOT values once leadership grants access.
// Until then the form runs in "demo mode": it shows the confirmation but does
// NOT send anywhere (a warning is logged to the console). See LAUNCH-CHECKLIST.md.
(function(){
  var HUBSPOT = {
    portalId: "HUBSPOT_PORTAL_ID",   // <-- HubSpot Hub/Portal ID, e.g. "1234567"
    formGuid: "HUBSPOT_FORM_GUID",   // <-- HubSpot form GUID, e.g. "0a1b2c3d-...-...."
    region:   "na1",                 // <-- data center: na1 | na2 | eu1
    // form field [name] attribute  ->  HubSpot contact property (confirm against your form)
    fieldMap: { name: "firstname", company: "company", email: "email", message: "message" }
  };
  var configured = HUBSPOT.portalId.indexOf("HUBSPOT_") !== 0 && HUBSPOT.formGuid.indexOf("HUBSPOT_") !== 0;

  function cookie(n){ var m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)'); return m ? m.pop() : ''; }

  document.querySelectorAll('form.contact-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      var status = document.getElementById('form-status');
      if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }

      function finish(ok){
        if (btn){ btn.textContent = ok ? 'Sent ✓' : 'Try again'; btn.disabled = !ok; }
        if (status){ status.textContent = ok
          ? 'Thanks, we’ll be in touch shortly.'
          : 'Something went wrong. Please email support@optiwatt.com.'; }
      }

      // Demo mode until HubSpot is configured
      if (!configured){
        console.warn('[contact form] HubSpot not configured — set portalId/formGuid in js/main.js. Submission was NOT sent.');
        finish(true);
        return;
      }

      var fields = [];
      Object.keys(HUBSPOT.fieldMap).forEach(function(k){
        var el = form.querySelector('[name="' + k + '"]');
        if (el && el.value) fields.push({ name: HUBSPOT.fieldMap[k], value: el.value });
      });
      var payload = { fields: fields, context: { pageUri: location.href, pageName: document.title } };
      var hutk = cookie('hubspotutk'); if (hutk) payload.context.hutk = hutk;

      var host = HUBSPOT.region.indexOf('eu') === 0 ? 'api-eu1.hsforms.com' : 'api.hsforms.com';
      var url = 'https://' + host + '/submissions/v3/integration/submit/' + HUBSPOT.portalId + '/' + HUBSPOT.formGuid;

      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function(r){ finish(r.ok); })
        .catch(function(){ finish(false); });
    });
  });
})();
