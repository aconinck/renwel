(function () {
  'use strict';
  const STORAGE_KEY = 'renwel-selected-services-v1';
  let memorySelection = window.parent.__renwelMem || [];

  function readSelection() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value.filter(item => item && typeof item.name === 'string' && typeof item.category === 'string') : [];
    } catch (_) {
      return memorySelection;
    }
  }
  function writeSelection(items) {
    memorySelection = items; window.parent.__renwelMem = items;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
    updateCount();
  }
  function updateCount() {
    const count = readSelection().length;
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = count;
      el.hidden = count === 0;
    });
    document.querySelectorAll('[data-selection-count]').forEach(el => { el.textContent = count; });
  }
  function key(item) { return item.category + '\u0000' + item.name; }

  const menu = document.querySelector('.menu-trigger');
  const mobileNav = document.querySelector('#mobile-nav');
  if (menu && mobileNav) {
    menu.addEventListener('click', function () {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.querySelector('span').textContent = open ? '×' : '☰';
      mobileNav.hidden = !open;
    });
  }

  document.querySelectorAll('input[data-service]').forEach(input => {
    const item = {name: input.dataset.service, category: input.dataset.category};
    input.checked = readSelection().some(saved => key(saved) === key(item));
    input.addEventListener('change', function () {
      const next = readSelection().filter(saved => key(saved) !== key(item));
      if (input.checked) next.push(item);
      writeSelection(next);
    });
  });

  const selectedList = document.querySelector('#selected-services');
  function renderSelected() {
    if (!selectedList) return;
    selectedList.replaceChildren();
    const items = readSelection();
    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No services selected yet. You can also describe your project below.';
      selectedList.append(empty);
      return;
    }
    items.forEach(item => {
      const row = document.createElement('p');
      const text = document.createElement('span');
      text.textContent = item.name + ' · ' + item.category;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-service';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + item.name);
      remove.addEventListener('click', function () {
        writeSelection(readSelection().filter(saved => key(saved) !== key(item)));
        renderSelected();
      });
      row.append(text, remove);
      selectedList.append(row);
    });
  }
  renderSelected();
  updateCount();

  const form = document.querySelector('#quote-form');
  if (form) {
    const output = document.querySelector('#request-output');
    const result = document.querySelector('#request-text');
    const status = document.querySelector('#copy-status');
    const copy = document.querySelector('#copy-request');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const items = readSelection();
      const val = id => document.querySelector(id).value.trim() || 'Not provided';
      const lines = items.length ? items.map(item => '• ' + item.name + ' (' + item.category + ')').join('\n') : 'To be discussed';
      result.value = 'Hello! I would like a quote for home services.\n\nServices:\n' + lines + '\n\nName: ' + val('#customer-name') + '\nEmail or phone: ' + val('#customer-contact') + '\nZIP code: ' + val('#customer-zip') + '\nProject details: ' + val('#customer-details');
      output.hidden = false;
      status.textContent = 'Review your message, then copy it to share.';
      result.focus();
    });
    copy.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(result.value);
        status.textContent = 'Copied. Your request is ready to share.';
      } catch (_) {
        result.focus();
        result.select();
        status.textContent = 'Select and copy the message above.';
      }
    });
  }
}());
