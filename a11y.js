(function(){
  'use strict';
  var KEY = 'lumina_a11y';
  var state = { font:0, contrast:false, gray:false, links:false, stop:false, readable:false, cursor:false };
  try { var s = localStorage.getItem(KEY); if (s) state = Object.assign(state, JSON.parse(s)); } catch(e){}

  var css = document.createElement('style');
  css.textContent = [
    '.a11y-btn{position:fixed;bottom:96px;right:24px;z-index:96;width:52px;height:52px;border-radius:50%;background:#1a1440;border:1px solid rgba(139,123,255,.75);display:grid;place-items:center;cursor:pointer;transition:transform .2s}',
    '.a11y-btn:hover{transform:scale(1.08)}',
    '.a11y-btn svg{width:26px;height:26px;fill:#fff}',
    '.a11y-panel{position:fixed;bottom:160px;right:24px;z-index:97;width:290px;max-width:calc(100vw - 40px);background:#0a0a12;border:1px solid rgba(255,255,255,.2);padding:18px;display:none;max-height:70vh;overflow:auto;color:#fff;font-family:Heebo,sans-serif}',
    '.a11y-panel.open{display:block}',
    '.a11y-panel h3{font-size:15px;font-weight:400;margin-bottom:4px;color:#fff}',
    '.a11y-panel .hint{font-size:11.5px;color:#9a9aa8;margin-bottom:14px;line-height:1.6}',
    '.a11y-panel button.opt{display:flex;align-items:center;gap:10px;width:100%;text-align:right;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);color:#fff;padding:11px 13px;margin-bottom:7px;font-size:13.5px;font-family:inherit;font-weight:300;cursor:pointer;transition:background .2s}',
    '.a11y-panel button.opt:hover{background:rgba(139,123,255,.2)}',
    '.a11y-panel button.opt[aria-pressed="true"]{background:rgba(139,123,255,.32);border-color:#8b7bff}',
    '.a11y-panel .fontrow{display:flex;gap:7px;margin-bottom:7px}',
    '.a11y-panel .fontrow button{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);color:#fff;padding:11px 0;font-size:15px;cursor:pointer;font-family:inherit}',
    '.a11y-panel .reset{margin-top:8px;background:transparent;border:1px solid rgba(255,255,255,.5);width:100%;color:#fff;padding:11px;font-size:12.5px;cursor:pointer;font-family:inherit;letter-spacing:.1em}',
    '.a11y-panel .legal{margin-top:12px;font-size:11.5px;text-align:center}',
    '.a11y-panel .legal a{color:#8b7bff}',
    '.a11y-close{position:absolute;top:10px;left:12px;background:none;border:none;color:#fff;font-size:22px;line-height:1;cursor:pointer}',
    'html.a11y-contrast body{background:#000!important}',
    'html.a11y-contrast *{color:#fff!important;border-color:#fff!important}',
    'html.a11y-contrast .price-badge,html.a11y-contrast .btn{background:#000!important;border:2px solid #fff!important}',
    'html.a11y-gray{filter:grayscale(1)}',
    'html.a11y-links a{text-decoration:underline!important;text-underline-offset:3px}',
    'html.a11y-stop *,html.a11y-stop *::before,html.a11y-stop *::after{animation:none!important;transition:none!important}',
    'html.a11y-readable body,html.a11y-readable body *{font-family:Arial,Helvetica,sans-serif!important;letter-spacing:normal!important;font-weight:400!important}',
    'html.a11y-cursor,html.a11y-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath d=\'M6 2 L6 32 L14 25 L19 36 L25 33 L20 22 L31 22 Z\' fill=\'%23fff\' stroke=\'%23000\' stroke-width=\'2\'/%3E%3C/svg%3E") 4 2, auto!important}',
    '.skip-link{position:absolute;right:-9999px;top:0;z-index:200;background:#fff;color:#000;padding:12px 22px;font-size:14px}',
    '.skip-link:focus{right:12px;top:12px}',
    '.cookie-bar{position:fixed;bottom:0;right:0;left:0;z-index:95;background:rgba(6,6,12,.97);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,.16);padding:16px 22px;display:none;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;font-family:Heebo,sans-serif}',
    '.cookie-bar.show{display:flex}',
    '.cookie-bar p{color:#c9c9d6;font-size:13px;font-weight:300;max-width:560px;line-height:1.7}',
    '.cookie-bar a{color:#8b7bff}',
    '.cookie-bar button{border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;padding:10px 22px;font-size:12.5px;cursor:pointer;font-family:inherit;letter-spacing:.08em}',
    '.cookie-bar button.ok{background:#fff;color:#000;border-color:#fff}',
    '@media (max-width:600px){.a11y-btn{bottom:80px;right:18px;width:48px;height:48px}.a11y-panel{bottom:136px;right:18px}}'
  ].join('\n');
  document.head.appendChild(css);

  function apply(){
    var r = document.documentElement;
    r.classList.toggle('a11y-contrast', state.contrast);
    r.classList.toggle('a11y-gray', state.gray);
    r.classList.toggle('a11y-links', state.links);
    r.classList.toggle('a11y-stop', state.stop);
    r.classList.toggle('a11y-readable', state.readable);
    r.classList.toggle('a11y-cursor', state.cursor);
    r.style.fontSize = state.font ? (100 + state.font*10) + '%' : '';
    if (state.stop) { document.querySelectorAll('video').forEach(function(v){ v.pause(); }); }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){}
    document.querySelectorAll('[data-a11y]').forEach(function(b){
      b.setAttribute('aria-pressed', String(!!state[b.getAttribute('data-a11y')]));
    });
  }

  function build(){
    var skip = document.createElement('a');
    skip.className = 'skip-link'; skip.href = '#main'; skip.textContent = 'דלג לתוכן הראשי';
    document.body.insertBefore(skip, document.body.firstChild);

    var btn = document.createElement('button');
    btn.className = 'a11y-btn'; btn.setAttribute('aria-label','תפריט נגישות'); btn.setAttribute('aria-expanded','false');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M20.5 7.5c-2.6.9-5.3 1.4-8.5 1.4s-5.9-.5-8.5-1.4L3 9.4c2.1.8 4.4 1.3 6.8 1.5l-.7 3.4L6.4 21h2.2l2.2-5.3h2.4L15.4 21h2.2l-2.7-6.7-.7-3.4c2.4-.2 4.7-.7 6.8-1.5z"/></svg>';
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'a11y-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','אפשרויות נגישות');
    panel.innerHTML =
      '<button class="a11y-close" aria-label="סגירה">&#215;</button>' +
      '<h3>נגישות</h3>' +
      '<p class="hint">ההעדפות נשמרות לביקורים הבאים</p>' +
      '<div class="fontrow"><button data-act="fminus" aria-label="הקטנת טקסט">א-</button><button data-act="freset" aria-label="גודל רגיל">א</button><button data-act="fplus" aria-label="הגדלת טקסט">א+</button></div>' +
      '<button class="opt" data-a11y="stop">עצירת אנימציות וסרטונים</button>' +
      '<button class="opt" data-a11y="contrast">ניגודיות גבוהה</button>' +
      '<button class="opt" data-a11y="gray">גווני אפור</button>' +
      '<button class="opt" data-a11y="links">הדגשת קישורים</button>' +
      '<button class="opt" data-a11y="readable">גופן קריא</button>' +
      '<button class="opt" data-a11y="cursor">סמן גדול</button>' +
      '<button class="reset">איפוס הגדרות</button>' +
      '<p class="legal"><a href="/legal.html#accessibility">הצהרת הנגישות המלאה</a></p>';
    document.body.appendChild(panel);

    function toggle(open){
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) panel.querySelector('button').focus();
    }
    btn.addEventListener('click', function(){ toggle(!panel.classList.contains('open')); });
    panel.querySelector('.a11y-close').addEventListener('click', function(){ toggle(false); btn.focus(); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape' && panel.classList.contains('open')) { toggle(false); btn.focus(); } });

    panel.querySelectorAll('[data-a11y]').forEach(function(b){
      b.addEventListener('click', function(){ var k = b.getAttribute('data-a11y'); state[k] = !state[k]; apply(); });
    });
    panel.querySelectorAll('[data-act]').forEach(function(b){
      b.addEventListener('click', function(){
        var a = b.getAttribute('data-act');
        if (a === 'fplus') state.font = Math.min(state.font + 1, 4);
        if (a === 'fminus') state.font = Math.max(state.font - 1, -2);
        if (a === 'freset') state.font = 0;
        apply();
      });
    });
    panel.querySelector('.reset').addEventListener('click', function(){
      state = { font:0, contrast:false, gray:false, links:false, stop:false, readable:false, cursor:false };
      apply();
    });

    // ---- cookie bar ----
    var CK = 'lumina_cookies';
    var seen = null;
    try { seen = localStorage.getItem(CK); } catch(e){}
    if (!seen) {
      var bar = document.createElement('div');
      bar.className = 'cookie-bar show';
      bar.setAttribute('role','region'); bar.setAttribute('aria-label','הודעת עוגיות');
      bar.innerHTML =
        '<p>האתר עושה שימוש בעוגיות לצרכים טכניים ולשיפור חוויית הגלישה. פרטים נוספים ב<a href="/legal.html#privacy">מדיניות הפרטיות</a>.</p>' +
        '<button class="ok">אישור</button><button class="no">דחייה</button>';
      document.body.appendChild(bar);
      function close(v){ try { localStorage.setItem(CK, v); } catch(e){} bar.classList.remove('show'); }
      bar.querySelector('.ok').addEventListener('click', function(){ close('accepted'); });
      bar.querySelector('.no').addEventListener('click', function(){ close('declined'); });
    }
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
