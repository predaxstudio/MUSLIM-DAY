/* ======================================================================
   notes.js — «ملاحظاتي»: دفتر ملاحظات متكامل مع التطبيق.
   • 7 لغات (ar/en/fr/es/zh/ru/tr) + RTL/LTR تلقائيًا عبر applyLanguage
   • كل الألوان من متغيّرات الثيم → يتبع الثيمات كلها وعالي التباين وحجم الخط (--fs)
   • حفظ محلي (salati_notes) + مزامنة سحابية مع حساب المستخدم (دمج حسب آخر تعديل)
   يُحمَّل آخرًا بعد native.js.
   ====================================================================== */
(function(){
'use strict';
const X = window.SalatiX || {};
const $ = (id) => document.getElementById(id);
const esc = X.esc || ((s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
const toast = X.toast || (() => {});
const KEY = 'salati_notes';
const CATS = ['general','worship','quran','dua','ideas','personal'];

/* ---------------- النصوص (7 لغات) ---------------- */
const T = (ar,en,fr,es,zh,ru,tr) => ({ar,en,fr,es,zh,ru,tr});
const L = {
  nav:T('ملاحظات','Notes','Notes','Notas','笔记','Заметки','Notlar'),
  title:T('ملاحظاتي','My notes','Mes notes','Mis notas','我的笔记','Мои заметки','Notlarım'),
  add:T('ملاحظة جديدة','New note','Nouvelle note','Nueva nota','新建笔记','Новая заметка','Yeni not'),
  search:T('ابحث في ملاحظاتك…','Search your notes…','Rechercher dans vos notes…','Buscar en tus notas…','搜索笔记…','Поиск по заметкам…','Notlarda ara…'),
  all:T('الكل','All','Toutes','Todas','全部','Все','Tümü'),
  pinned:T('المثبّتة','Pinned','Épinglées','Fijadas','置顶','Закреплённые','Sabitlenenler'),
  c_general:T('عامة','General','Général','General','常规','Общие','Genel'),
  c_worship:T('عبادات','Worship','Dévotion','Adoración','礼拜','Ибадат','İbadet'),
  c_quran:T('قرآن','Quran','Coran','Corán','古兰经','Коран','Kur’an'),
  c_dua:T('أدعية','Duas','Invocations','Súplicas','祈祷词','Дуа','Dualar'),
  c_ideas:T('أفكار','Ideas','Idées','Ideas','想法','Идеи','Fikirler'),
  c_personal:T('شخصي','Personal','Personnel','Personal','个人','Личное','Kişisel'),
  count:{ ar:n=>`${n} ملاحظة`, en:n=>`${n} ${n===1?'note':'notes'}`, fr:n=>`${n} note${n>1?'s':''}`, es:n=>`${n} ${n===1?'nota':'notas'}`, zh:n=>`${n} 条笔记`, ru:n=>`Заметок: ${n}`, tr:n=>`${n} not` },
  empty:T('لا توجد ملاحظات بعد.\nاضغط «ملاحظة جديدة» لتبدأ.','No notes yet.\nTap “New note” to start.','Aucune note pour le moment.\nAppuyez sur « Nouvelle note ».','Aún no hay notas.\nToca «Nueva nota» para empezar.','还没有笔记。\n点击“新建笔记”开始。','Заметок пока нет.\nНажмите «Новая заметка».','Henüz not yok.\nBaşlamak için “Yeni not”a dokunun.'),
  none:T('لا نتائج مطابقة.','No matching notes.','Aucun résultat.','Sin resultados.','没有匹配的笔记。','Ничего не найдено.','Eşleşen not yok.'),
  untitled:T('بدون عنوان','Untitled','Sans titre','Sin título','无标题','Без названия','Başlıksız'),
  tPh:T('العنوان','Title','Titre','Título','标题','Заголовок','Başlık'),
  bPh:T('اكتب ملاحظتك هنا…','Write your note here…','Écrivez votre note ici…','Escribe tu nota aquí…','在此写下笔记…','Пишите заметку здесь…','Notunuzu buraya yazın…'),
  cat:T('التصنيف','Category','Catégorie','Categoría','分类','Категория','Kategori'),
  save:T('حفظ','Save','Enregistrer','Guardar','保存','Сохранить','Kaydet'),
  cancel:T('إلغاء','Cancel','Annuler','Cancelar','取消','Отмена','İptal'),
  del:T('حذف','Delete','Supprimer','Eliminar','删除','Удалить','Sil'),
  pin:T('تثبيت','Pin','Épingler','Fijar','置顶','Закрепить','Sabitle'),
  unpin:T('إلغاء التثبيت','Unpin','Désépingler','Desfijar','取消置顶','Открепить','Sabitlemeyi kaldır'),
  share:T('مشاركة','Share','Partager','Compartir','分享','Поделиться','Paylaş'),
  copied:T('تم النسخ ✓','Copied ✓','Copié ✓','Copiado ✓','已复制 ✓','Скопировано ✓','Kopyalandı ✓'),
  saved:T('تم الحفظ ✓','Saved ✓','Enregistré ✓','Guardado ✓','已保存 ✓','Сохранено ✓','Kaydedildi ✓'),
  confirmDel:T('حذف هذه الملاحظة نهائيًا؟','Delete this note permanently?','Supprimer définitivement cette note ?','¿Eliminar esta nota definitivamente?','永久删除这条笔记？','Удалить заметку навсегда?','Bu not kalıcı olarak silinsin mi?'),
};
const lang = () => (typeof state !== 'undefined' && state.lang) || 'ar';   // state معرّف بـ const في script.js (ليس خاصية على window)
const nt = (k, ...a) => { const d = L[k]; const v = d[lang()] || d.en; return typeof v === 'function' ? v(...a) : v; };
const fmtDate = (ms) => { try{ return new Date(ms).toLocaleDateString(lang() === 'zh' ? 'zh-CN' : lang(), { day:'numeric', month:'short', year:'numeric' }); }catch(e){ return ''; } };

/* ---------------- البيانات ---------------- */
let D = load();            // { n: [ {id,t,b,c,p,u,m} ], d: { id: وقت الحذف } }
let q = '', cat = 'all', draft = null;
function load(){ try{ const r = JSON.parse(localStorage.getItem(KEY) || 'null'); if(r && Array.isArray(r.n)) return { n: r.n.map(clean).filter(Boolean), d: r.d || {} }; }catch(e){} return { n: [], d: {} }; }
function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(D)); }catch(e){} if(typeof scheduleCloudSave === 'function') scheduleCloudSave(); }
function clean(r){
  if(!r || typeof r !== 'object') return null;
  const id = String(r.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 24); if(!id) return null;
  return { id, t:String(r.t || '').slice(0, 120), b:String(r.b || '').slice(0, 20000), c: CATS.includes(r.c) ? r.c : 'general', p: !!r.p, u: Number(r.u) || Date.now(), m: Number(r.m) || Date.now() };
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const norm = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0300-\u036F]/g, '');

/* ---------------- الواجهة ---------------- */
function build(){
  $('view-notes').innerHTML = `
    <h2 class="section-title"><span>📝</span><span id="ntTitle"></span></h2>
    <div class="nt-bar"><input id="ntSearch" class="auth-input" type="search" autocomplete="off"><button id="ntAdd" class="primary nt-add" type="button"></button></div>
    <div class="nt-chips" id="ntChips" role="tablist"></div>
    <div class="nt-count" id="ntCount" aria-live="polite"></div>
    <div id="ntList"></div>`;
  const o = document.createElement('div'); o.className = 'lang-sheet-overlay'; o.id = 'ntOverlay';
  o.innerHTML = `<div class="lang-sheet nt-sheet" role="dialog" aria-modal="true">
    <input id="ntT" class="auth-input nt-t" maxlength="120" dir="auto">
    <textarea id="ntB" class="auth-input nt-b" rows="9" maxlength="20000" dir="auto"></textarea>
    <div class="nt-lbl" id="ntCatLbl"></div><div class="nt-chips nt-wrap" id="ntCatPick"></div>
    <div class="nt-actions"><button id="ntPin" class="ghost small" type="button"></button><button id="ntShare" class="ghost small" type="button"></button><button id="ntDel" class="ghost small nt-danger" type="button"></button></div>
    <button id="ntSave" class="primary" type="button"></button><div class="nt-cancel"><button id="ntCancel" class="link-btn" type="button"></button></div></div>`;
  document.body.appendChild(o);

  $('ntSearch').addEventListener('input', (e) => { q = e.target.value; render(); });
  $('ntAdd').addEventListener('click', () => openEditor(null));
  $('ntChips').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if(b){ cat = b.dataset.c; render(); } });
  const open = (e) => { const c = e.target.closest('.nt-card'); if(c) openEditor(c.dataset.id); };
  $('ntList').addEventListener('click', open);
  $('ntList').addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(e); } });
  o.addEventListener('click', (e) => { if(e.target === o) closeEditor(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && o.classList.contains('active')) closeEditor(); });
  $('ntCatPick').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if(b){ draft.c = b.dataset.c; pickCats(); } });
  $('ntPin').addEventListener('click', () => { draft.p = !draft.p; pinLabel(); });
  $('ntShare').addEventListener('click', shareNote);
  $('ntDel').addEventListener('click', delNote);
  $('ntSave').addEventListener('click', saveNote);
  $('ntCancel').addEventListener('click', closeEditor);
}

function labels(){
  if(!$('ntTitle')) return;
  const nav = $('txtNavNotes'); if(nav) nav.textContent = nt('nav');
  $('ntTitle').textContent = nt('title'); $('ntSearch').placeholder = nt('search'); $('ntAdd').textContent = '＋ ' + nt('add');
  $('ntT').placeholder = nt('tPh'); $('ntB').placeholder = nt('bPh'); $('ntCatLbl').textContent = nt('cat');
  $('ntShare').textContent = nt('share'); $('ntDel').textContent = nt('del'); $('ntSave').textContent = nt('save'); $('ntCancel').textContent = nt('cancel');
  if(draft){ pickCats(); pinLabel(); }
  render();
}
const chip = (id, label, on) => `<button type="button" class="chip${on ? ' active' : ''}" data-c="${id}" role="tab" aria-selected="${on}">${esc(label)}</button>`;
function render(){
  if(!$('ntList')) return;
  $('ntChips').innerHTML = chip('all', nt('all'), cat === 'all') + chip('pinned', '📌 ' + nt('pinned'), cat === 'pinned') + CATS.map((c) => chip(c, nt('c_' + c), cat === c)).join('');
  const k = norm(q);
  const rows = D.n.filter((n) => (cat === 'all' || (cat === 'pinned' ? n.p : n.c === cat)) && (!k || norm(n.t + ' ' + n.b).includes(k)))
                  .sort((a, b) => (Number(b.p) - Number(a.p)) || (b.m - a.m));
  $('ntCount').textContent = rows.length ? nt('count', rows.length) : '';
  $('ntList').innerHTML = rows.length ? rows.map((n) => `
    <article class="card nt-card" data-id="${n.id}" tabindex="0" role="button">
      <div class="nt-top"><h3>${esc(n.t || nt('untitled'))}</h3>${n.p ? '<span class="nt-pin" aria-hidden="true">📌</span>' : ''}</div>
      ${n.b ? `<p class="nt-prev" dir="auto">${esc(n.b.slice(0, 220))}</p>` : ''}
      <div class="nt-meta"><span class="nt-tag">${esc(nt('c_' + n.c))}</span><time>${esc(fmtDate(n.m))}</time></div>
    </article>`).join('')
    : `<div class="nt-empty"><b>📝</b>${esc(D.n.length ? nt('none') : nt('empty')).replace(/\n/g, '<br>')}</div>`;
}

/* ---------------- المحرّر ---------------- */
const pickCats = () => { $('ntCatPick').innerHTML = CATS.map((c) => chip(c, nt('c_' + c), draft.c === c)).join(''); };
const pinLabel = () => { $('ntPin').textContent = '📌 ' + nt(draft.p ? 'unpin' : 'pin'); };
function openEditor(id){
  const n = id && D.n.find((x) => x.id === id);
  draft = n ? { ...n } : { id: uid(), t:'', b:'', c: (CATS.includes(cat) ? cat : 'general'), p: cat === 'pinned', u: Date.now(), m: Date.now(), isNew: true };
  $('ntT').value = draft.t; $('ntB').value = draft.b; pickCats(); pinLabel();
  $('ntDel').style.display = draft.isNew ? 'none' : '';
  $('ntOverlay').classList.add('active');
  setTimeout(() => { try{ (draft.isNew ? $('ntT') : $('ntB')).focus({ preventScroll:true }); }catch(e){} }, 120);
}
function closeEditor(){ $('ntOverlay').classList.remove('active'); draft = null; }
function saveNote(){
  if(!draft) return;
  draft.t = $('ntT').value.trim(); draft.b = $('ntB').value.replace(/\s+$/, '');
  if(!draft.t && !draft.b){ closeEditor(); return; }
  draft.m = Date.now(); const { isNew, ...n } = draft; const i = D.n.findIndex((x) => x.id === n.id);
  if(i >= 0) D.n[i] = n; else D.n.push(n);
  delete D.d[n.id]; persist(); closeEditor(); render(); toast(nt('saved'));
}
async function delNote(){
  if(!draft) return; const id = draft.id, msg = nt('confirmDel');
  const ok = typeof confirmSensitiveAction === 'function' ? await confirmSensitiveAction(msg) : window.confirm(msg);
  if(!ok) return;
  D.n = D.n.filter((x) => x.id !== id); D.d[id] = Date.now();
  const keep = Object.entries(D.d).sort((a, b) => b[1] - a[1]).slice(0, 200); D.d = Object.fromEntries(keep);
  persist(); closeEditor(); render();
}
async function shareNote(){
  const txt = ($('ntT').value.trim() ? $('ntT').value.trim() + '\n\n' : '') + $('ntB').value;
  try{ if(navigator.share){ await navigator.share({ title: $('ntT').value.trim(), text: txt }); return; } await navigator.clipboard.writeText(txt); toast(nt('copied')); }catch(e){}
}

/* ---------------- المزامنة السحابية (دمج حسب آخر تعديل) ---------------- */
function merge(rn, rd){
  const m = new Map(D.n.map((n) => [n.id, n]));
  for(const [id, ts] of Object.entries(rd || {})) if(!(D.d[id] >= ts)) D.d[id] = Number(ts) || 0;
  for(const r0 of (rn || [])){ const r = clean(r0); if(!r || D.d[r.id] >= r.m) continue; const l = m.get(r.id); if(!l || r.m > l.m) m.set(r.id, r); }
  D.n = [...m.values()].filter((n) => !(D.d[n.id] >= n.m));
  persist(); render();
}
if(typeof collectCloudPayload === 'function'){
  const _c = collectCloudPayload;
  collectCloudPayload = function(){ const p = _c.apply(this, arguments) || {}; p.notes = D.n; p.notesDel = D.d; return p; };
}
if(typeof pullCloudDataIntoApp === 'function'){
  const _p = pullCloudDataIntoApp;
  pullCloudDataIntoApp = async function(uid){
    const r = await _p.apply(this, arguments);
    try{ const c = window.SalatiAuth && await window.SalatiAuth.loadCloudData(uid); if(c && Array.isArray(c.notes)) merge(c.notes, c.notesDel); else persist(); }catch(e){}
    return r;
  };
}

/* ---------------- الربط بالتطبيق ---------------- */
if(typeof PROTECTED_VIEWS !== 'undefined') PROTECTED_VIEWS.add('notes');   // نفس حماية «يوم المسلم»
if(typeof applyLanguage === 'function'){ const _a = applyLanguage; applyLanguage = function(){ const r = _a.apply(this, arguments); try{ labels(); }catch(e){ console.error(e); } return r; }; }
if(typeof switchView === 'function'){ const _s = switchView; switchView = function(){ const r = _s.apply(this, arguments); if(typeof currentViewName !== 'undefined' && currentViewName === 'notes') render(); return r; }; }
window.addEventListener('storage', (e) => { if(e.key === KEY){ D = load(); render(); } });   // تعدّد النوافذ

if($('view-notes')){ build(); labels(); }
})();
