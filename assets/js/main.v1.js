/* ТриумфИвент: панель меню, ход вечера, заявка */

var WA_BASE = 'https://wa.me/375257725743';

document.addEventListener('DOMContentLoaded', function () {
  initDrawer();
  initEvening();
  initForm();
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* Панель меню: fixed-слой, блокировка прокрутки, ловушка фокуса, Escape */
function initDrawer() {
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  if (!burger || !drawer) return;
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    var btn = document.getElementById('drawer-close');
    if (btn) btn.focus({ preventScroll: true });
  }

  function close() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  burger.addEventListener('click', function () {
    if (drawer.hidden) open(); else close();
  });

  var closeBtn = document.getElementById('drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', close);

  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) { close(); return; }
    if (!e.target.closest('.drawer__inner')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (drawer.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var items = drawer.querySelectorAll('a, button');
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180 && !drawer.hidden) close();
  });
}

/* Ход вечера: переключение форматов */
function initEvening() {
  var tabs = document.querySelectorAll('.tabs .tab');
  if (!tabs.length) return;
  var panels = document.querySelectorAll('.evpanel');
  [].forEach.call(tabs, function (t) {
    t.addEventListener('click', function () {
      var pid = t.getAttribute('data-panel');
      [].forEach.call(tabs, function (o) {
        var on = o === t;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-selected', String(on));
      });
      [].forEach.call(panels, function (p) {
        p.classList.toggle('is-hidden', p.getAttribute('data-panel') !== pid);
      });
    });
  });
}

/* Заявка: собираем сообщение и отдаём в WhatsApp */
function initForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;
  var ok = document.getElementById('form-ok');
  var out = document.getElementById('order-text');
  var send = document.getElementById('order-send');
  var copy = document.getElementById('order-copy');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('f-name');
    var contact = document.getElementById('f-contact');
    var bad = false;
    [name, contact].forEach(function (el) {
      if (!el.value.trim()) { el.style.borderColor = '#D8395A'; bad = true; }
      else el.style.borderColor = '';
    });
    if (bad) return;

    var date = document.getElementById('f-date').value;
    var city = document.getElementById('f-city').value.trim();
    var what = document.getElementById('f-what').value;
    var guests = document.getElementById('f-guests').value;
    var format = document.getElementById('f-format').value;
    var note = document.getElementById('f-note').value.trim();

    var rows = [
      'Заявка с сайта: ТриумфИвент',
      'Имя: ' + name.value.trim(),
      'Контакт: ' + contact.value.trim(),
      'Повод: ' + what
    ];
    if (date) rows.push('Дата: ' + date.split('-').reverse().join('.'));
    if (city) rows.push('Город: ' + city);
    if (guests) rows.push('Гостей примерно: ' + guests);
    rows.push('Формат: ' + format);
    if (note) rows.push('О празднике: ' + note);

    var text = rows.join('\n');
    out.textContent = text;
    send.href = WA_BASE + '?text=' + encodeURIComponent(text);
    if (ok.hidden) {
      ok.hidden = false;
      form.querySelectorAll('input, select, textarea, .form__btn').forEach(function (el) { el.disabled = true; });
    }
    ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  if (copy) {
    copy.addEventListener('click', function () {
      var text = out.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      copy.textContent = 'Скопировано';
      setTimeout(function () { copy.textContent = 'Скопировать'; }, 1800);
    });
  }
}
