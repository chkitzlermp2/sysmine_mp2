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

  // On the project overview: move the mp2 phase table (rendered at the bottom
  // by the hook) directly above the Tickets box (core: div.issues.box), i.e.
  // below the project information. Guarded by .mp2-phase-overview presence.
  // NOTE: our own phase block also contains a .issues.box, so we must exclude
  // anything inside .mp2-phase-overview when locating the core Tickets box.
  function arrangeProjectOverview() {
    var phase = document.querySelector('.mp2-phase-overview');
    if (!phase) { return; }

    var ticketsBox = null;
    var boxes = document.querySelectorAll('#content .issues.box');
    for (var i = 0; i < boxes.length; i++) {
      if (!phase.contains(boxes[i])) { ticketsBox = boxes[i]; break; }
    }
    if (ticketsBox && ticketsBox.parentNode && ticketsBox !== phase) {
      ticketsBox.parentNode.insertBefore(phase, ticketsBox);
    }
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
