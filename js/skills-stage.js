(function () {
  'use strict';
  var root = document.querySelector('.skill-explorer');
  if (!root) return;
  var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-skill-filter]'));
  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-skill-card]'));
  var status = root.querySelector('.skill-filter-status');
  var labels = { all: 'all four capability areas', interface: 'the interface capability', systems: 'the systems capability', delivery: 'the delivery capability', creative: 'the creative work capability' };
  function select(filter) {
    var visible = 0;
    buttons.forEach(function (button) {
      var active = button.getAttribute('data-skill-filter') === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    cards.forEach(function (card) {
      var show = filter === 'all' || card.getAttribute('data-skill-card') === filter;
      card.classList.toggle('is-filtered-out', !show);
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) visible++;
    });
    if (status) status.textContent = 'Showing ' + labels[filter] + '.';
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () { select(button.getAttribute('data-skill-filter')); });
  });
  cards.forEach(function (card) {
    card.addEventListener('keydown', function (event) {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
        event.preventDefault();
        var link = card.querySelector('.skill-feature-body a');
        if (link) link.click();
      }
    });
  });
  select('all');
})();
