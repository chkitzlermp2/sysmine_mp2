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
  // Read the configured "right column" field keys from the meta tag.
  function mp2RightFields() {
    var meta = document.querySelector('meta[name="mp2-right-fields"]');
    if (!meta) { return []; }
    return meta.getAttribute('content').split(',')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  // Find the <p> wrapper for a given field key inside the edit form.
  // Internal fields: the input/select has id "issue_<key>" (e.g.
  // issue_assigned_to_id), so we climb to the wrapping <p>.
  // Custom fields: the wrapper <p> carries class "cf_<id>".
  function mp2FindFieldWrapper(root, key) {
    if (key.indexOf('cf_') === 0) {
      return root.querySelector('p.' + key);
    }
    var input = root.querySelector('#issue_' + key);
    if (!input) { return null; }
    return input.closest('p');
  }

  // On the issue EDIT form, move the configured fields into a collapsible
  // right column that mirrors the show page ("Zusätzliche Informationen").
  function arrangeEditForm(root) {
    root = root || document;
    var form = root.querySelector('#issue-form');
    if (!form) { return; }

    var right = form.querySelector('.splitcontentright');
    if (!right) { return; }

    var keys = mp2RightFields();
    if (!keys.length) { return; }

    // Build (once) a collapsible wrapper at the top of the right column.
    var wrapper = form.querySelector('.mp2-edit-additional');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'mp2-edit-additional mp2-col-right';

      var toggle = document.createElement('a');
      toggle.href = '#';
      toggle.className = 'mp2-toggle mp2-edit-toggle';
      var labelMeta = document.querySelector('meta[name="mp2-additional-label"]');
      toggle.textContent = labelMeta ? labelMeta.getAttribute('content') : 'Zusätzliche Informationen';

      var details = document.createElement('div');
      details.className = 'mp2-details';

      wrapper.appendChild(toggle);
      wrapper.appendChild(details);
      right.insertBefore(wrapper, right.firstChild);

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        wrapper.classList.toggle('mp2-expanded');
      });
    }
    var detailsContainer = wrapper.querySelector('.mp2-details');

    // Move each configured field into the details container (once).
    keys.forEach(function (key) {
      var p = mp2FindFieldWrapper(root, key);
      if (!p || p.classList.contains('mp2-moved') || wrapper.contains(p)) { return; }
      p.classList.add('mp2-moved');
      detailsContainer.appendChild(p);
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
    arrangeEditForm();
    arrangeProjectOverview();
  }

  // Re-run after Redmine refreshes the issue form via ajax.
  document.addEventListener('ajax:complete', function () {
    arrangeEditForm();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
