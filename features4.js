(function(){
'use strict';
const X = window.SalatiX;
if(!X)return;
const{esc,toast}= X;
const $ =(id)=> document.getElementById(id);
const lsGet =(k,d)=>{try{const v = localStorage.getItem(k);return v === null ? d:v;}catch(e){return d;}};
const lsSet =(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const F4 ={
absTitle:{ar:'اشتقنا إليك 🌿',en:'We miss you 🌿',fr:'Vous nous manquez 🌿',es:'Te echamos de menos 🌿',zh:'我们想你了 🌿',ru:'Мы скучаем 🌿',tr:'Seni özledik 🌿'},
abs1:{ar:'لا بأس إن غبت، فباب العودة مفتوح. ابدأ اليوم بصلاة واحدة وأذكار قليلة.',en:'It’s okay to take a break — the door is always open. Start today with one prayer and a short dhikr.',fr:'Ce n’est pas grave de faire une pause : la porte reste ouverte. Reprenez aujourd’hui avec une prière et un court dhikr.',es:'No pasa nada por tomarte un descanso: la puerta siempre está abierta. Empieza hoy con una oración y un breve dhikr.',zh:'休息一下没关系，大门始终敞开。今天从一次礼拜和一句简短的赞词重新开始吧。',ru:'Ничего страшного, если вы сделали перерыв — дверь всегда открыта. Начните сегодня с одного намаза и короткого зикра.',tr:'Ara vermek sorun değil, kapı hep açık. Bugün bir namaz ve kısa bir zikirle başlayın.'},
abs2:{ar:'نذكّرك بلطف: كل يوم صفحة جديدة. افتح التطبيق وسجّل صلاتك الأولى، وأنت لا تبدأ من الصفر.',en:'A gentle reminder: every day is a fresh page. Open the app and log your first prayer — you’re not starting from zero.',fr:'Un rappel doux : chaque jour est une page neuve. Ouvrez l’application et notez votre première prière — vous ne repartez pas de zéro.',es:'Un recordatorio amable: cada día es una página nueva. Abre la app y registra tu primera oración; no empiezas de cero.',zh:'温馨提醒：每一天都是新的一页。打开应用，记录你的第一次礼拜——你并不是从零开始。',ru:'Мягкое напоминание: каждый день — новая страница. Откройте приложение и отметьте первый намаз — вы начинаете не с нуля.',tr:'Nazik bir hatırlatma: her gün yeni bir sayfa. Uygulamayı açın ve ilk namazınızı işaretleyin; sıfırdan başlamıyorsunuz.'},
wbTitle:{ar:'أهلًا بعودتك 🤍',en:'Welcome back 🤍',fr:'Bon retour 🤍',es:'Bienvenido de nuevo 🤍',zh:'欢迎回来 🤍',ru:'С возвращением 🤍',tr:'Tekrar hoş geldin 🤍'},
wbBody:{ar:'سعدنا برؤيتك. كل يوم بداية جديدة، وأفضل سلسلة وصلت إليها محفوظة لك.',en:'Great to see you. Every day is a fresh start, and your best streak is still saved.',fr:'Content de vous revoir. Chaque jour est un nouveau départ, et votre meilleure série est toujours conservée.',es:'Qué bueno verte. Cada día es un nuevo comienzo y tu mejor racha sigue guardada.',zh:'很高兴见到你。每天都是新的开始，你的最佳连续记录依然保留。',ru:'Рады вас видеть. Каждый день — новое начало, а ваша лучшая серия сохранена.',tr:'Seni görmek güzel. Her gün yeni bir başlangıç ve en iyi serin hâlâ kayıtlı.'},
wbOk:{ar:'لنبدأ',en:'Let’s go',fr:'C’est parti',es:'Vamos',zh:'开始吧',ru:'Поехали',tr:'Hadi başlayalım'},
absToggle:{ar:'رسالة ودّية عند الغياب',en:'Friendly nudge when away',fr:'Message amical en cas d’absence',es:'Mensaje amable si te ausentas',zh:'久未打开时的友好提醒',ru:'Дружеское напоминание при долгом отсутствии',tr:'Uzun süre uzak kalınca nazik mesaj'},
absHint:{ar:'بعد 3 و7 و14 يومًا بلا فتح (إشعارات في تطبيق أندرويد)',en:'After 3, 7 and 14 days away (notifications in the Android app)',fr:'Après 3, 7 et 14 jours d’absence (notifications dans l’application Android)',es:'Tras 3, 7 y 14 días sin abrir (notificaciones en la app de Android)',zh:'3、7、14 天未打开后（安卓应用中的通知）',ru:'Через 3, 7 и 14 дней без открытия (уведомления в приложении Android)',tr:'3, 7 ve 14 gün açılmayınca (Android uygulamasında bildirim)'},
widgetHint:{ar:'📱 لإضافة الودجت: اضغط مطولًا على الشاشة الرئيسية ← الأدوات (Widgets) ← Muslim Day.',en:'📱 To add the widget: long-press your home screen → Widgets → Muslim Day.',fr:'📱 Pour ajouter le widget : appui long sur l’écran d’accueil → Widgets → Muslim Day.',es:'📱 Para añadir el widget: mantén pulsada la pantalla de inicio → Widgets → Muslim Day.',zh:'📱 添加小组件：长按主屏幕 → 小组件 → Muslim Day。',ru:'📱 Чтобы добавить виджет: удерживайте главный экран → Виджеты → Muslim Day.',tr:'📱 Widget eklemek için: ana ekrana uzun basın → Widget’lar → Muslim Day.'},
updTitle:{ar:'تحديث جديد متاح',en:'A new update is available',fr:'Une mise à jour est disponible',es:'Hay una actualización disponible',zh:'有新版本可用',ru:'Доступно обновление',tr:'Yeni güncelleme mevcut'},
updBody:{ar:v=>`الإصدار ${v} جاهز للتنزيل.`,en:v=>`Version ${v} is ready to download.`,fr:v=>`La version ${v} est prête à être téléchargée.`,es:v=>`La versión ${v} está lista para descargar.`,zh:v=>`版本 ${v} 可供下载。`,ru:v=>`Версия ${v} готова к загрузке.`,tr:v=>`${v} sürümü indirmeye hazır.`},
updBtn:{ar:'تحميل التحديث',en:'Download update',fr:'Télécharger la mise à jour',es:'Descargar actualización',zh:'下载更新',ru:'Скачать обновление',tr:'Güncellemeyi indir'},
updLater:{ar:'لاحقًا',en:'Later',fr:'Plus tard',es:'Más tarde',zh:'稍后',ru:'Позже',tr:'Sonra'},
updHint:{ar:'بعد التنزيل افتح الملف لتثبيت التحديث فوق النسخة الحالية.',en:'After downloading, open the file to install the update over the current version.',fr:'Après le téléchargement, ouvrez le fichier pour installer la mise à jour par-dessus la version actuelle.',es:'Tras descargar, abre el archivo para instalar la actualización sobre la versión actual.',zh:'下载后打开文件，即可覆盖安装更新。',ru:'После загрузки откройте файл, чтобы установить обновление поверх текущей версии.',tr:'İndirdikten sonra dosyayı açarak güncellemeyi mevcut sürümün üzerine kurun.'},
};
const f4 =(k,...a)=>{const d = F4[k];const v = d[state.lang]|| d.en;return typeof v === 'function' ? v(...a):v;};
const LAST_KEY = 'salati_last_open';
const absenceOn =()=> lsGet('salati_absence','1')=== '1';
function touch(){
const prev = Number(lsGet(LAST_KEY,'0'))|| 0,now = Date.now();
lsSet(LAST_KEY,String(now));
return prev ? Math.floor((now - prev)/ 86400000):0;
}
let wbShown = false;
function renderWelcome(show){
const c = $('welcomeBackCard');if(!c)return;
if(show)wbShown = true;
c.style.display =(wbShown && absenceOn())? '':'none';
$('wbTitle').textContent = f4('wbTitle');$('wbBody').textContent = f4('wbBody');$('wbOk').textContent = f4('wbOk');
}
function onForeground(){const days = touch();if(days >= 3 && absenceOn())renderWelcome(true);}
const UPDATE_URL = 'https://muslimappdaybypredaxstudio.netlify.app/apk-version.json';
let updInfo = null;
function readCachedInfo(){try{return JSON.parse(lsGet('salati_upd_info','null'));}catch(e){return null;}}
function renderUpdate(){
const c = $('updateCard');if(!c)return;
const info = updInfo,mine = Number(window.APP_BUILD)|| 0;
const newer = !!(window.SALATI_NATIVE && info && Number(info.build)> mine && lsGet('salati_upd_dismiss','')!== String(info.build));
c.style.display = newer ? '':'none';
if(!newer)return;
$('updTitle').textContent = f4('updTitle');$('updBody').textContent = f4('updBody',info.version || info.build);
const notes = info.notes &&(info.notes[state.lang]|| info.notes.en);
$('updNotes').textContent = notes || '';$('updNotes').style.display = notes ? '':'none';
$('updHint').textContent = f4('updHint');$('updBtn').textContent = f4('updBtn');$('updLater').textContent = f4('updLater');
}
async function checkUpdate(force){
if(!window.SALATI_NATIVE)return;
const last = Number(lsGet('salati_upd_checked','0'))|| 0;
if(!force && Date.now()- last < 6 * 3600 * 1000){updInfo = readCachedInfo();renderUpdate();return;}
const ctl = new AbortController(),to = setTimeout(()=> ctl.abort(),10000);
try{
const url =(lsGet('salati_update_url','')|| UPDATE_URL)+ '?t=' + Date.now();
const res = await fetch(url,{cache:'no-store',signal:ctl.signal});
if(!res.ok)throw new Error('HTTP ' + res.status);
updInfo = await res.json();
lsSet('salati_upd_info',JSON.stringify(updInfo));lsSet('salati_upd_checked',String(Date.now()));
}catch(e){updInfo = readCachedInfo();}
finally{clearTimeout(to);}
renderUpdate();
}
function openExternal(url){
try{
const cap = window.Capacitor,B = cap &&((cap.Plugins && cap.Plugins.Browser)||(cap.registerPlugin && cap.registerPlugin('Browser')));
if(B && B.open){B.open({url});return;}
}catch(e){}
window.open(url,'_blank','noopener');
}
function renderAll4(){
renderWelcome(false);renderUpdate();
const t1 = $('absToggleTitle');if(t1){t1.textContent = f4('absToggle');$('absToggleHint').textContent = f4('absHint');$('absToggle').checked = absenceOn();}
const w = $('widgetHint');if(w)w.textContent = f4('widgetHint');
}
function inject(){
const home = $('view-home');
if(home && !$('welcomeBackCard')){
const anchor = $('quietBanner');
const html = `
      <div class="card notice-card welcome-card" id="welcomeBackCard" style="display:none;">
        <div class="notice-title" id="wbTitle">—</div><div class="notice-body" id="wbBody">—</div>
        <div class="notice-actions"><button type="button" class="primary" id="wbOk">—</button></div>
      </div>
      <div class="card notice-card update-card" id="updateCard" style="display:none;">
        <div class="notice-title">⬇️ <span id="updTitle">—</span></div><div class="notice-body" id="updBody">—</div>
        <div class="notice-notes" id="updNotes"></div><div class="notice-hint" id="updHint"></div>
        <div class="notice-actions"><button type="button" class="primary" id="updBtn">—</button><button type="button" class="ghost" id="updLater">—</button></div>
      </div>`;
if(anchor)anchor.insertAdjacentHTML('afterend',html);else home.insertAdjacentHTML('afterbegin',html);
}
const fri = $('friToggle'),row = fri && fri.closest('.home-toggle');
if(row && !$('absToggle')){
row.insertAdjacentHTML('afterend',`
      <div class="home-toggle"><div><div class="toggle-title" id="absToggleTitle">—</div><div class="toggle-desc" id="absToggleHint">—</div></div>
        <label class="switch"><input type="checkbox" id="absToggle"><span class="slider"></span></label></div>
      <div class="occ-note native-only" id="widgetHint"></div>`);
}
}
function bind(){
$('wbOk').addEventListener('click',()=>{wbShown = false;renderWelcome(false);});
$('updLater').addEventListener('click',()=>{if(updInfo)lsSet('salati_upd_dismiss',String(updInfo.build));renderUpdate();});
$('updBtn').addEventListener('click',()=>{if(updInfo && updInfo.url)openExternal(updInfo.url);});
const tg = $('absToggle');
if(tg)tg.addEventListener('change',(e)=>{lsSet('salati_absence',e.target.checked ? '1':'0');renderWelcome(false);});
}
const _al4 = applyLanguage;
applyLanguage = function(){const r = _al4.apply(this,arguments);try{renderAll4();}catch(e){console.error(e);}return r;};
inject();bind();
const daysAway = touch();
renderAll4();
if(daysAway >= 3 && absenceOn())renderWelcome(true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){onForeground();checkUpdate(false);}});
setInterval(()=>{if(!document.hidden)lsSet(LAST_KEY,String(Date.now()));},5 * 60 * 1000);
setTimeout(()=> checkUpdate(false),4000);
window.SalatiX4 ={f4,checkUpdate,daysAway,absenceOn};
})();
