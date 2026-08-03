// mp2 collapsible "additional information" column on the issue show page.
// Pure vanilla JS, no Prototype/jQuery dependency (Redmine 7 safe).
(function () {
  'use strict';

  function initCollapse() {
    var block = document.querySelector('.mp2-attributes');
    if (!block) { return; }

    var right = block.querySelector('.mp2-col-right');
    if (!right) { return; }

    // Default (collapsed) comes from CSS, so no flash. Toggle from here.
    var hideLink = right.querySelector('a.mp2-toggle-hide');
    var showLink = right.querySelector('a.mp2-toggle-show');

    function collapse(e) {
      if (e) { e.preventDefault(); }
      right.classList.remove('mp2-expanded');
    }
    function expand(e) {
      if (e) { e.preventDefault(); }
      right.classList.add('mp2-expanded');
    }

    if (hideLink) { hideLink.addEventListener('click', collapse); }
    if (showLink) { showLink.addEventListener('click', expand); }
  }

  function initCustomerMode() {
    var meta = document.querySelector('meta[name="mp2-customer-mode"]');
    if (meta && meta.getAttribute('content') === 'true') {
      document.body.classList.add('mp2-customer-mode');
    }
  }

  // On the issue EDIT form, promote custom fields 24 and 44 into the left
  // column so they sit next to status/priority. Core renders all custom
  // fields in a separate block below .splitcontent; we relocate the two
  // wanted ones. Runs after the DOM is ready and again after Redmine's
  // ajax form refresh (updateIssueFrom re-renders the attributes region).
  var MP2_PROMOTED_FIELDS = [24, 44];

  function promoteEditFields(root) {
    root = root || document;
    var left = root.querySelector('#issue-form .splitcontentleft') ||
               root.querySelector('.splitcontentleft');
    if (!left) { return; }

    MP2_PROMOTED_FIELDS.forEach(function (id) {
      // Core wraps each custom field <p> with class cf_<id>.
      var field = root.querySelector('p.cf_' + id + ':not(.mp2-promoted)');
      if (!field) { return; }
      field.classList.add('mp2-promoted');
      left.appendChild(field);
    });
  }

  // On the project overview: move the mp2 phase table to the very top of the
  // content area (the hook renders it after <%= yield %>, i.e. at the bottom),
  // and hide the members box. Guarded by presence of .mp2-phase-overview so it
  // only affects the project overview page.
  function arrangeProjectOverview() {
    var phase = document.querySelector('.mp2-phase-overview');
    if (!phase) { return; }

    var content = document.getElementById('content');
    if (content && phase.parentNode === content) {
      content.insertBefore(phase, content.firstChild);
    }
    // (Members box is hidden via CSS to avoid a load flash.)
  }

  function init() {
    initCollapse();
    initCustomerMode();
    promoteEditFields();
    arrangeProjectOverview();
  }

  // Re-run after Redmine refreshes the issue form via ajax.
  document.addEventListener('ajax:complete', function () {
    promoteEditFields();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
