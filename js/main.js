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
// TO CONNECT: set HUBSPOT.portalId + region below, and put each form's GUID in its
// data-hs-form-guid attribute (index.html = Utilities form, partners.html = Partners form).
// Until configured, forms run in "demo mode": they show the confirmation but send
// nothing (a warning is logged to the console). See LAUNCH-CHECKLIST.md.
(function(){
  var HUBSPOT = {
    portalId: "8502002",             // HubSpot Hub/Portal ID
    region:   "na2",                 // data center
    // per-form GUID comes from each form's data-hs-form-guid attribute.
    // form field [name] attribute  ->  HubSpot contact property (matches the HubSpot form fields)
    fieldMap: { firstname: "firstname", lastname: "lastname", company: "company", email: "email", message: "message" }
  };
  function placeholder(v){ return !v || v.indexOf("HUBSPOT_") === 0; }
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

      var formGuid = form.getAttribute('data-hs-form-guid');

      // Demo mode until HubSpot is configured
      if (placeholder(HUBSPOT.portalId) || placeholder(formGuid)){
        console.warn('[contact form] HubSpot not configured — set HUBSPOT.portalId in js/main.js and data-hs-form-guid on this form. Submission was NOT sent.');
        finish(true);
        return;
      }

      var fields = [];
      // The HubSpot form has no partner-type field, so fold the selection into the message.
      var pt = form.querySelector('[name="partner_type"]');
      var ptText = (pt && pt.value) ? ('Partner type: ' + pt.options[pt.selectedIndex].text + '\n\n') : '';
      Object.keys(HUBSPOT.fieldMap).forEach(function(k){
        var el = form.querySelector('[name="' + k + '"]');
        if (!el) return;
        var val = (k === 'message') ? (ptText + el.value) : el.value;
        if (val) fields.push({ name: HUBSPOT.fieldMap[k], value: val });
      });
      var payload = { fields: fields, context: { pageUri: location.href, pageName: document.title } };
      var hutk = cookie('hubspotutk'); if (hutk) payload.context.hutk = hutk;

      var host = HUBSPOT.region.indexOf('eu') === 0 ? 'api-eu1.hsforms.com' : 'api.hsforms.com';
      var url = 'https://' + host + '/submissions/v3/integration/submit/' + HUBSPOT.portalId + '/' + formGuid;

      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function(r){ finish(r.ok); })
        .catch(function(){ finish(false); });
    });
  });
})();
