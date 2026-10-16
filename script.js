const CUSTOM_TASK_COUNT = 3;
function normalizeCustomTasks(arr){
const out =[];
for(let i = 0;i < CUSTOM_TASK_COUNT;i++){
out.push(Array.isArray(arr)&& typeof arr[i]=== 'string' ? arr[i].trim().slice(0,60):'');
}
return out;
}
function loadSettings(){
const def ={
method:'auto',school:0,
tune:{Fajr:0,Dhuhr:0,Asr:0,Maghrib:0,Isha:0},
notifPerPrayer:{
Fajr:{notify:true,adhan:true,reminder:false},
Dhuhr:{notify:true,adhan:true,reminder:false},
Asr:{notify:true,adhan:true,reminder:false},
Maghrib:{notify:true,adhan:true,reminder:false},
Isha:{notify:true,adhan:true,reminder:false},
},
reminderMinutes:10,
notifEnabled:false,
selectedSound:ADHAN_SOUNDS[0].id,
methodMigrated:true,
lastPlace:null,
lastLocCheck:0,
radiusKm:5,
favoriteMosque:null,
lastCoords:null,
manualLocation:false,
trackedItems:{trackPrayers:true,jamaah:true,mosque:true,quran:true,quranMemorize:true,quranReview:true,
azkarMorning:true,azkarEvening:true,azkarAfter:true,qiyam:true,witr:true,parents:true,learning:true,
sadaqah:true,goodDeeds:true,fasting:true,rawatib:true,duha:true},
customTasks:['','',''],
};
try{
const raw = localStorage.getItem('salati_settings');
if(!raw)return def;
const saved = JSON.parse(raw);
if(!saved.methodMigrated){if(saved.method === 3)saved.method = 'auto';saved.methodMigrated = true;}
return{
...def,...saved,
tune:{...def.tune,...(saved.tune||{})},
notifPerPrayer:Object.fromEntries(PRAYER_ORDER.map(k =>[k,{...def.notifPerPrayer[k],...((saved.notifPerPrayer||{})[k]||{})}])),
trackedItems:{...def.trackedItems,...(saved.trackedItems||{})},
customTasks:normalizeCustomTasks(saved.customTasks),
};
}catch(e){console.error(e);return def;}
}
function saveSettings(){localStorage.setItem('salati_settings',JSON.stringify(state.settings));if(typeof scheduleCloudSave === 'function')scheduleCloudSave();}
let state ={
lang:localStorage.getItem('salati_lang')|| 'ar',
theme:localStorage.getItem('salati_theme')|| 'brand',
coords:null,
timings:null,
timingsExtra:null,
mosques:[],
selectedSound:ADHAN_SOUNDS[0].id,
notifTimers:[],
map:null,
mapMarkersLayer:null,
settings:loadSettings(),
mdViewDate:new Date(),
mdMonthOpen:false,
mdMonthOffset:0,
};
function t(){return STRINGS[state.lang];}
function syncPersistedSettings(){
const sid = state.settings.selectedSound;
if(sid && ADHAN_SOUNDS.some(x => x.id === sid))state.selectedSound = sid;
const tg = document.getElementById('notifToggle');
if(tg)tg.checked = !!state.settings.notifEnabled;
}
function flashSaved(anchor){
if(!anchor)return;
let f = anchor.querySelector(':scope > .saved-flag');
if(!f){f = document.createElement('span');f.className = 'saved-flag';anchor.appendChild(f);}
f.textContent = XT('saved');
f.classList.remove('show');void f.offsetWidth;f.classList.add('show');
clearTimeout(f._t);f._t = setTimeout(()=> f.classList.remove('show'),1800);
}
syncPersistedSettings();
function applyTheme(themeId){
document.documentElement.setAttribute('data-theme',themeId);
state.theme = themeId;
localStorage.setItem('salati_theme',themeId);
if(typeof scheduleCloudSave === 'function')scheduleCloudSave();
const meta = document.querySelector('meta[name="theme-color"]');
if(meta){
const grad1 = getComputedStyle(document.documentElement).getPropertyValue('--grad1').trim();
if(grad1)meta.setAttribute('content',grad1);
}
renderThemeGrid();
if(typeof updateMapTiles === 'function')updateMapTiles();
}
function renderThemeGrid(){
const grid = document.getElementById('themeGrid');
if(!grid)return;
const names = THEME_NAMES[state.lang]|| THEME_NAMES.en;
grid.innerHTML = THEME_GROUPS.map(g => `
    <div class="theme-group-title"><span>${g.icon}</span><span>${escapeHtml(THEME_GROUP_TITLE[g.key][state.lang] || THEME_GROUP_TITLE[g.key].en)}</span></div>
    <div class="theme-group-grid">
      ${g.ids.map(id => { const m = THEME_META[id]; const nm = names[id] || id; return `
        <div class="theme-card${state.theme===id ? ' active' : ''}" data-theme-id="${id}" role="button" aria-label="${escapeHtml(nm)}">
          <div class="tc-preview" style="background:${m.p};">
            <div class="tc-head" style="background:linear-gradient(135deg, ${m.g1}, ${m.g2});"></div>
            <div class="tc-body"><i style="background:${m.a};"></i><i style="background:${m.a};"></i></div>
          </div>
          <div class="tc-name">${escapeHtml(nm)}</div>
          <span class="check">✓</span>
        </div>`; }).join('')}
    </div>`).join('');
grid.querySelectorAll('.theme-card').forEach(el =>{
el.addEventListener('click',()=>{
applyTheme(el.dataset.themeId);
setThemeGridOpen(false);
});
});
updateCurrentThemePreview();
}
function updateCurrentThemePreview(){
const names = THEME_NAMES[state.lang]|| THEME_NAMES.en;
const current = THEMES.find(th => th.id === state.theme)|| THEMES[0];
const swatch = document.getElementById('themeCurrentSwatch');
const nameEl = document.getElementById('themeCurrentName');
if(swatch)swatch.style.background = `linear-gradient(135deg, ${current.c1}, ${current.c2})`;
if(nameEl)nameEl.textContent = names[current.id]|| current.id;
}
function applyChangeThemeButtonText(){
const btn = document.getElementById('toggleThemeGridBtn');
if(!btn)return;
const grid = document.getElementById('themeGrid');
const isOpen = grid && grid.style.display !== 'none';
const dict = isOpen ? HIDE_THEMES_TEXT:CHANGE_THEME_TEXT;
const label = btn.querySelector('span')|| btn;
label.textContent = dict[state.lang]|| dict.en;
}
function setThemeGridOpen(open){
const grid = document.getElementById('themeGrid');
if(!grid)return;
grid.style.display = open ? 'block':'none';
applyChangeThemeButtonText();
}
document.getElementById('toggleThemeGridBtn')?.addEventListener('click',()=>{
const grid = document.getElementById('themeGrid');
const isOpen = grid && grid.style.display !== 'none';
setThemeGridOpen(!isOpen);
});
let deferredInstallPrompt = null;
function isStandaloneMode(){
return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}
function refreshInstallBtn(){
const btn = document.getElementById('installAppBtn');
if(!btn)return;
btn.style.display = isStandaloneMode()? 'none':'block';
}
window.addEventListener('beforeinstallprompt',(e)=>{
e.preventDefault();
deferredInstallPrompt = e;
refreshInstallBtn();
});
window.addEventListener('appinstalled',()=>{
deferredInstallPrompt = null;
refreshInstallBtn();
if(typeof registerPushIfEnabled === 'function')registerPushIfEnabled();
});
document.getElementById('installAppBtn')?.addEventListener('click',async()=>{
const H = INSTALL_HELP_TEXT[state.lang]|| INSTALL_HELP_TEXT.en;
if(isStandaloneMode()){alert(H.done);refreshInstallBtn();return;}
if(deferredInstallPrompt){
deferredInstallPrompt.prompt();
try{await deferredInstallPrompt.userChoice;}catch(e){}
deferredInstallPrompt = null;
refreshInstallBtn();
return;
}
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)&& !window.MSStream;
alert(isIOS ? H.ios:H.other);
});
refreshInstallBtn();
window.matchMedia('(display-mode: standalone)').addEventListener?.('change',refreshInstallBtn);
if('serviceWorker' in navigator){
window.addEventListener('load',()=>{
navigator.serviceWorker.register('./sw.js').catch(()=>{});
});
}
(function initIosInstallBanner(){
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)&& !window.MSStream;
const isStandalone = window.navigator.standalone === true ||
window.matchMedia('(display-mode: standalone)').matches;
const dismissed = localStorage.getItem('salati_ios_banner_dismissed')=== '1';
if(!isIOS || isStandalone || dismissed)return;
const banner = document.getElementById('iosInstallBanner');
if(!banner)return;
banner.style.display = 'flex';
document.getElementById('iosInstallCloseBtn')?.addEventListener('click',()=>{
banner.style.display = 'none';
localStorage.setItem('salati_ios_banner_dismissed','1');
});
})();
const GATE_DISMISSED_KEY = 'salati_gate_dismissed';
const PROTECTED_VIEWS = new Set(['muslimday']);
let pendingViewAfterLogin = null;
state.currentUser = null;
state.authMode = 'login';
let cloudSyncTimer = null;
function renderAccountUI(user){
const signedOut = document.getElementById('accountSignedOut');
const signedIn = document.getElementById('accountSignedIn');
renderGreeting();
if(!signedOut || !signedIn)return;
const promptEl = document.getElementById('txtAccountSignedOutPrompt');
if(promptEl)promptEl.textContent =(user && user.isAnonymous)? t().accountGuestPrompt:t().accountSignedOutPrompt;
if(user && !user.isAnonymous){
signedOut.style.display = 'none';
signedIn.style.display = 'flex';
document.getElementById('accountAvatar').src = avatarFor(user);
document.getElementById('accountName').textContent = user.name ||(user.email || '');
document.getElementById('accountEmail').textContent = user.email || '';
}else{
signedOut.style.display = 'block';
signedIn.style.display = 'none';
}
}
function showGateMessage(kind,text){
const errBox = document.getElementById('gateAuthError');
const okBox = document.getElementById('gateAuthSuccess');
if(errBox){errBox.style.display = kind === 'error' && text ? 'block':'none';errBox.textContent = kind === 'error' ?(text||''):'';}
if(okBox){okBox.style.display = kind === 'success' && text ? 'block':'none';okBox.textContent = kind === 'success' ?(text||''):'';}
}
function setGateSubmitting(isSubmitting){
const form = document.getElementById('gateAuthForm');
const btn = document.getElementById('gateAuthSubmitBtn');
if(form)form.classList.toggle('auth-submitting',!!isSubmitting);
if(btn)btn.disabled = !!isSubmitting;
}
function showAuthGate(){
document.getElementById('authGateOverlay')?.classList.add('active');
}
function hideAuthGate(){
document.getElementById('authGateOverlay')?.classList.remove('active');
}
function isGateOpen(){
return !!document.getElementById('authGateOverlay')?.classList.contains('active');
}
function openGateForm(mode,keepMessage){
state.authMode = mode || 'login';
applyAuthModeTexts();
applyGateNameVisibility();
if(!keepMessage)showGateMessage(null,'');
setGateLoading(false);
showAuthGate();
}
function setGateLoading(isLoading){
const loading = document.getElementById('gateLoading');
const body = document.getElementById('gateAuthBody');
if(loading)loading.style.display = isLoading ? 'block':'none';
if(body)body.style.display = isLoading ? 'none':'block';
}
function applyGateNameVisibility(){
const nameInput = document.getElementById('gateName');
if(nameInput)nameInput.style.display = state.authMode === 'register' ? 'block':'none';
}
function withSalatiAuth(action){
return async(...args)=>{
if(!window.SalatiAuth){showGateMessage('error',t().authNotReady);return;}
return action(window.SalatiAuth,...args);
};
}
function collectCloudPayload(){
try{
return{
settings:state.settings,
muslimday:JSON.parse(localStorage.getItem('salati_muslimday')|| '{}'),
lang:state.lang,
theme:state.theme,
};
}catch(e){return{settings:state.settings,lang:state.lang,theme:state.theme};}
}
function scheduleCloudSave(){
if(!state.currentUser || !window.SalatiAuth)return;
clearTimeout(cloudSyncTimer);
cloudSyncTimer = setTimeout(()=>{
cloudSyncTimer = null;
if(!state.currentUser || !window.SalatiAuth)return;
window.SalatiAuth.saveCloudData(state.currentUser.uid,collectCloudPayload());
},1200);
}
async function pullCloudDataIntoApp(uid){
if(!window.SalatiAuth)return;
const cloud = await window.SalatiAuth.loadCloudData(uid);
if(!cloud){scheduleCloudSave();return;}
try{
if(cloud.settings){const localLoc ={lastCoords:state.settings.lastCoords,lastPlace:state.settings.lastPlace,manualLocation:state.settings.manualLocation,lastLocCheck:state.settings.lastLocCheck,notifEnabled:state.settings.notifEnabled};state.settings ={...state.settings,...cloud.settings,...localLoc,trackedItems:{...state.settings.trackedItems,...(cloud.settings.trackedItems||{})},customTasks:normalizeCustomTasks(cloud.settings.customTasks || state.settings.customTasks)};saveSettings();}
if(cloud.muslimday){localStorage.setItem('salati_muslimday',JSON.stringify(cloud.muslimday));}
if(cloud.lang && cloud.lang !== state.lang){state.lang = cloud.lang;localStorage.setItem('salati_lang',cloud.lang);}
if(cloud.theme && cloud.theme !== state.theme){applyTheme(cloud.theme);}
applyLanguage();
if(typeof renderMuslimDay === 'function')renderMuslimDay();
if(state.coords){try{renderCalcMethodOptions();initAsrSelect();}catch(e){}fetchPrayerTimes();}
}catch(e){console.warn('تعذّر تطبيق بيانات الحساب السحابية:',e);}
}
const VISITOR_BASE = 2000;
const VISITOR_CACHE_KEY = 'salati_visitors_total';
const VISITOR_SESSION_KEY = 'salati_visit_counted';
function renderVisitorCount(){
const card = document.getElementById('visitorsCard');
const el = document.getElementById('visitorsCount');
if(!card || !el)return;
const total = Number(localStorage.getItem(VISITOR_CACHE_KEY));
if(!Number.isFinite(total)|| total < VISITOR_BASE){card.style.display = 'none';return;}
let txt = String(total);
try{txt = total.toLocaleString(state.lang === 'ar' ? 'ar-EG':state.lang);}catch(e){}
el.textContent = txt;
card.style.display = '';
}
renderVisitorCount();
function trackAppVisit(SalatiAuth){
let first = false;
try{first = sessionStorage.getItem(VISITOR_SESSION_KEY)!== '1';}catch(e){first = true;}
SalatiAuth.trackVisit(first).then((n)=>{
if(first){try{sessionStorage.setItem(VISITOR_SESSION_KEY,'1');}catch(e){}}
if(n === null)return;
localStorage.setItem(VISITOR_CACHE_KEY,String(VISITOR_BASE + n));
renderVisitorCount();
});
}
function whenFirebaseReady(cb){
if(window.SalatiAuth)cb(window.SalatiAuth);
else window.addEventListener('salati-firebase-ready',()=> cb(window.SalatiAuth),{once:true});
}
if(localStorage.getItem(GATE_DISMISSED_KEY)!== '1'){
showAuthGate();
setGateLoading(true);
setTimeout(()=>{if(!window.SalatiAuth)setGateLoading(false);},4000);
}
document.getElementById('gateGuestBtn')?.addEventListener('click',async()=>{
if(state.currentUser){hideAuthGate();return;}
const localGuest =()=>{localStorage.setItem(GATE_DISMISSED_KEY,'1');hideAuthGate();};
if(!window.SalatiAuth){localGuest();return;}
setGateSubmitting(true);
const r = await window.SalatiAuth.signInAsGuest();
setGateSubmitting(false);
if(r && r.user)return;
if(r && r.unavailable)localGuest();
else showGateMessage('error',(r && r.error)|| t().authNotReady);
});
document.getElementById('openAuthGateBtn')?.addEventListener('click',()=>{
openGateForm(state.currentUser && state.currentUser.isAnonymous ? 'register':'login');
});
document.getElementById('gateAuthToggleModeBtn')?.addEventListener('click',()=>{
state.authMode = state.authMode === 'register' ? 'login':'register';
applyAuthModeTexts();
applyGateNameVisibility();
showGateMessage(null,'');
});
document.getElementById('gateAuthForgotBtn')?.addEventListener('click',withSalatiAuth(async(SalatiAuth)=>{
const email =(document.getElementById('gateEmail')?.value || '').trim();
if(!email){showGateMessage('error',t().authNeedEmailForReset);return;}
const result = await SalatiAuth.resetPassword(email);
if(result && result.error)showGateMessage('error',result.error);
else showGateMessage('success',t().authResetSent);
}));
document.getElementById('gateAuthForm')?.addEventListener('submit',async(e)=>{
e.preventDefault();
if(!window.SalatiAuth){showGateMessage('error',t().authNotReady);return;}
const SalatiAuth = window.SalatiAuth;
showGateMessage(null,'');
const name =(document.getElementById('gateName')?.value || '').trim();
const email =(document.getElementById('gateEmail')?.value || '').trim();
const password = document.getElementById('gatePassword')?.value || '';
if(!email || !password){showGateMessage('error',t().authNeedFields);return;}
const isRegister = state.authMode === 'register';
if(isRegister && !name){showGateMessage('error',t().authNeedName);return;}
setGateSubmitting(true);
const result = isRegister
? await SalatiAuth.registerWithEmail(email,password,name)
:await SalatiAuth.signInWithEmail(email,password);
setGateSubmitting(false);
if(result && result.error)showGateMessage('error',result.error);
});
document.getElementById('googleSignOutBtn')?.addEventListener('click',withSalatiAuth(async(SalatiAuth)=>{
if(cloudSyncTimer && state.currentUser){
clearTimeout(cloudSyncTimer);cloudSyncTimer = null;
try{await SalatiAuth.saveCloudData(state.currentUser.uid,collectCloudPayload());}catch(e){}
}
const r = await SalatiAuth.signOutUser();
if(r && r.ok){
localStorage.removeItem(GATE_DISMISSED_KEY);
localStorage.removeItem('salati_muslimday');
if(typeof renderMuslimDay === 'function')renderMuslimDay();
pendingViewAfterLogin = null;
}
}));
whenFirebaseReady((SalatiAuth)=>{
trackAppVisit(SalatiAuth);
let firstAuthCheck = true;
SalatiAuth.onChange((user)=>{
const prevUser = state.currentUser;
const wasFirst = firstAuthCheck;
applyStoredAvatar(user);
state.currentUser = user;
renderAccountUI(user);
firstAuthCheck = false;
setGateLoading(false);
if(user){
localStorage.removeItem(GATE_DISMISSED_KEY);
const gateWasOpen = isGateOpen();
showGateMessage(null,'');
hideAuthGate();
pullCloudDataIntoApp(user.uid);
refreshAvatarFromCloud(user);
const upgraded = prevUser && prevUser.isAnonymous && !user.isAnonymous && prevUser.uid === user.uid;
if(wasFirst && pendingViewAfterLogin){
const v = pendingViewAfterLogin;pendingViewAfterLogin = null;
switchView(v,{fromHistory:true});
}else if(!wasFirst && gateWasOpen && !upgraded){
const target = pendingViewAfterLogin || 'home';
pendingViewAfterLogin = null;
switchView(target);
}
}else if(localStorage.getItem(GATE_DISMISSED_KEY)!== '1'){
openGateForm('login',true);
}else if(wasFirst){
SalatiAuth.signInAsGuest();
if(pendingViewAfterLogin){const v = pendingViewAfterLogin;pendingViewAfterLogin = null;switchView(v,{fromHistory:true});}
}
});
});
const STRINGS_PROFILE ={
ar:{pfEdit:'تعديل الحساب',pfTitle:'تعديل الحساب',pfCamera:'كاميرا',pfGallery:'المعرض',pfFiles:'الملفات',pfRemove:'حذف الصورة',pfName:'الاسم',pfSave:'حفظ التغييرات',pfCancel:'إلغاء',pfReauthTitle:'تأكيد هويتك',pfReauthPw:'لحماية حسابك، أدخل كلمة المرور الحالية للمتابعة.',pfReauthGoogle:'لحماية حسابك، سنطلب منك تأكيد الدخول عبر Google.',pfPwPlaceholder:'كلمة المرور',pfConfirm:'تأكيد',pfWrongPw:'كلمة المرور غير صحيحة.',pfNeedPw:'الرجاء إدخال كلمة المرور.',pfNeedName:'الرجاء إدخال اسمك.',pfBadImage:'تعذّر استخدام هذه الصورة، اختر صورة أخرى.',pfFailed:'تعذّر حفظ التغييرات، تحقق من الاتصال وحاول مرة أخرى.'},
en:{pfEdit:'Edit account',pfTitle:'Edit account',pfCamera:'Camera',pfGallery:'Gallery',pfFiles:'Files',pfRemove:'Remove photo',pfName:'Name',pfSave:'Save changes',pfCancel:'Cancel',pfReauthTitle:'Confirm it\u2019s you',pfReauthPw:'To protect your account, enter your current password to continue.',pfReauthGoogle:'To protect your account, you\u2019ll be asked to confirm with Google.',pfPwPlaceholder:'Password',pfConfirm:'Confirm',pfWrongPw:'Incorrect password.',pfNeedPw:'Please enter your password.',pfNeedName:'Please enter your name.',pfBadImage:'This image can\u2019t be used. Please choose another one.',pfFailed:'Couldn\u2019t save changes. Check your connection and try again.'},
fr:{pfEdit:'Modifier le compte',pfTitle:'Modifier le compte',pfCamera:'Appareil photo',pfGallery:'Galerie',pfFiles:'Fichiers',pfRemove:'Supprimer la photo',pfName:'Nom',pfSave:'Enregistrer',pfCancel:'Annuler',pfReauthTitle:'Confirmez votre identité',pfReauthPw:'Pour prot\u00e9ger votre compte, saisissez votre mot de passe actuel.',pfReauthGoogle:'Pour prot\u00e9ger votre compte, une confirmation via Google vous sera demand\u00e9e.',pfPwPlaceholder:'Mot de passe',pfConfirm:'Confirmer',pfWrongPw:'Mot de passe incorrect.',pfNeedPw:'Veuillez saisir votre mot de passe.',pfNeedName:'Veuillez saisir votre nom.',pfBadImage:'Cette image est inutilisable, choisissez-en une autre.',pfFailed:'Impossible d\u2019enregistrer. V\u00e9rifiez votre connexion et r\u00e9essayez.'},
es:{pfEdit:'Editar cuenta',pfTitle:'Editar cuenta',pfCamera:'C\u00e1mara',pfGallery:'Galer\u00eda',pfFiles:'Archivos',pfRemove:'Quitar foto',pfName:'Nombre',pfSave:'Guardar cambios',pfCancel:'Cancelar',pfReauthTitle:'Confirma tu identidad',pfReauthPw:'Para proteger tu cuenta, introduce tu contrase\u00f1a actual.',pfReauthGoogle:'Para proteger tu cuenta, se te pedir\u00e1 confirmar con Google.',pfPwPlaceholder:'Contrase\u00f1a',pfConfirm:'Confirmar',pfWrongPw:'Contrase\u00f1a incorrecta.',pfNeedPw:'Introduce tu contrase\u00f1a.',pfNeedName:'Introduce tu nombre.',pfBadImage:'No se puede usar esta imagen. Elige otra.',pfFailed:'No se pudieron guardar los cambios. Revisa tu conexi\u00f3n e int\u00e9ntalo de nuevo.'},
zh:{pfEdit:'\u7f16\u8f91\u8d26\u6237',pfTitle:'\u7f16\u8f91\u8d26\u6237',pfCamera:'\u76f8\u673a',pfGallery:'\u76f8\u518c',pfFiles:'\u6587\u4ef6',pfRemove:'\u5220\u9664\u5934\u50cf',pfName:'\u59d3\u540d',pfSave:'\u4fdd\u5b58\u66f4\u6539',pfCancel:'\u53d6\u6d88',pfReauthTitle:'\u9a8c\u8bc1\u60a8\u7684\u8eab\u4efd',pfReauthPw:'\u4e3a\u4fdd\u62a4\u60a8\u7684\u8d26\u6237\uff0c\u8bf7\u8f93\u5165\u5f53\u524d\u5bc6\u7801\u4ee5\u7ee7\u7eed\u3002',pfReauthGoogle:'\u4e3a\u4fdd\u62a4\u60a8\u7684\u8d26\u6237\uff0c\u9700\u8981\u901a\u8fc7 Google \u8fdb\u884c\u9a8c\u8bc1\u3002',pfPwPlaceholder:'\u5bc6\u7801',pfConfirm:'\u786e\u8ba4',pfWrongPw:'\u5bc6\u7801\u4e0d\u6b63\u786e\u3002',pfNeedPw:'\u8bf7\u8f93\u5165\u5bc6\u7801\u3002',pfNeedName:'\u8bf7\u8f93\u5165\u60a8\u7684\u59d3\u540d\u3002',pfBadImage:'\u65e0\u6cd5\u4f7f\u7528\u8fd9\u5f20\u56fe\u7247\uff0c\u8bf7\u53e6\u9009\u4e00\u5f20\u3002',pfFailed:'\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5\u3002'},
ru:{pfEdit:'\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442',pfTitle:'\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442',pfCamera:'\u041a\u0430\u043c\u0435\u0440\u0430',pfGallery:'\u0413\u0430\u043b\u0435\u0440\u0435\u044f',pfFiles:'\u0424\u0430\u0439\u043b\u044b',pfRemove:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0444\u043e\u0442\u043e',pfName:'\u0418\u043c\u044f',pfSave:'\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c',pfCancel:'\u041e\u0442\u043c\u0435\u043d\u0430',pfReauthTitle:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043b\u0438\u0447\u043d\u043e\u0441\u0442\u044c',pfReauthPw:'\u0414\u043b\u044f \u0437\u0430\u0449\u0438\u0442\u044b \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0443\u0449\u0438\u0439 \u043f\u0430\u0440\u043e\u043b\u044c.',pfReauthGoogle:'\u0414\u043b\u044f \u0437\u0430\u0449\u0438\u0442\u044b \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u043f\u043e\u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 Google.',pfPwPlaceholder:'\u041f\u0430\u0440\u043e\u043b\u044c',pfConfirm:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c',pfWrongPw:'\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c.',pfNeedPw:'\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c.',pfNeedName:'\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f.',pfBadImage:'\u042d\u0442\u043e \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u043d\u0435 \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442, \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0435.',pfFailed:'\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0435\u0442\u044c \u0438 \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435.'},
tr:{pfEdit:'Hesabı düzenle',pfTitle:'Hesabı düzenle',pfCamera:'Kamera',pfGallery:'Galeri',pfFiles:'Dosyalar',pfRemove:'Fotoğrafı kaldır',pfName:'Ad',pfSave:'Değişiklikleri kaydet',pfCancel:'İptal',pfReauthTitle:'Kimliğinizi doğrulayın',pfReauthPw:'Hesabınızı korumak için devam etmek üzere mevcut şifrenizi girin.',pfReauthGoogle:'Hesabınızı korumak için Google ile doğrulama istenecek.',pfPwPlaceholder:'Şifre',pfConfirm:'Onayla',pfWrongPw:'Şifre yanlış.',pfNeedPw:'Lütfen şifrenizi girin.',pfNeedName:'Lütfen adınızı girin.',pfBadImage:'Bu görsel kullanılamıyor. Lütfen başka bir görsel seçin.',pfFailed:'Değişiklikler kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.'},
};
Object.keys(STRINGS_PROFILE).forEach(k => Object.assign(STRINGS[k],STRINGS_PROFILE[k]));
const REAUTH_TTL_MS = 5 * 60 * 1000;
const AVATAR_KEY_PREFIX = 'salati_avatar_';
let reauthVerifiedAt = 0;
let pendingAvatar = null;
const pfEl =(id)=> document.getElementById(id);
function applyProfileTexts(){
const s = t();
document.querySelectorAll('[data-pk]').forEach(el =>{if(s[el.dataset.pk])el.textContent = s[el.dataset.pk];});
const ni = pfEl('profileNameInput');if(ni)ni.placeholder = s.pfName;
const pw = pfEl('reauthPassword');if(pw)pw.placeholder = s.pfPwPlaceholder;
const eb = pfEl('editAccountBtn');if(eb)eb.setAttribute('aria-label',s.pfEdit);
const cq = pfEl('cityQuery');if(cq && s.citySearchPh)cq.placeholder = s.citySearchPh;
const pc = pfEl('pwCurrent');if(pc)pc.placeholder = s.pwCurrent;
const pn = pfEl('pwNew');if(pn)pn.placeholder = s.pwNew;
const pf = pfEl('pwConfirm');if(pf)pf.placeholder = s.pwConfirmNew;
const ts = pfEl('pwToggleShow');if(ts)ts.textContent =(pfEl('pwNew')&& pfEl('pwNew').type === 'text')? s.pwHide:s.pwShow;
}
function avatarFor(user){
if(user && user.picture)return user.picture;
const ch =(((user &&(user.name || user.email))|| '?').trim()[0]|| '?').toUpperCase().replace(/[<>&"']/g,'?');
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#0f766e"/><text x="48" y="64" font-size="44" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">' + ch + '</text></svg>';
return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function applyStoredAvatar(user){
if(!user)return;
try{const cached = localStorage.getItem(AVATAR_KEY_PREFIX + user.uid);if(cached)user.picture = cached;}catch(e){}
}
async function refreshAvatarFromCloud(user){
if(!window.SalatiAuth || !user)return;
const avatar = await window.SalatiAuth.loadAvatar(user.uid);
if(avatar === null || !state.currentUser || state.currentUser.uid !== user.uid)return;
try{avatar ? localStorage.setItem(AVATAR_KEY_PREFIX + user.uid,avatar):localStorage.removeItem(AVATAR_KEY_PREFIX + user.uid);}catch(e){}
if(avatar){state.currentUser.picture = avatar;renderAccountUI(state.currentUser);}
}
function showPfError(boxId,text){
const box = pfEl(boxId);if(!box)return;
box.style.display = text ? 'block':'none';box.textContent = text || '';
}
function ensureVerified(descText){
return new Promise((resolve)=>{
if(Date.now()- reauthVerifiedAt < REAUTH_TTL_MS){resolve(true);return;}
const A = window.SalatiAuth;
if(!A || !state.currentUser){resolve(false);return;}
const overlay = pfEl('reauthOverlay'),pw = pfEl('reauthPassword');
const confirmBtn = pfEl('reauthConfirmBtn'),cancelBtn = pfEl('reauthCancelBtn');
const isGoogle = A.getAuthMethod()=== 'google';
pfEl('reauthDesc').textContent = isGoogle ? t().pfReauthGoogle:(descText || t().pfReauthPw);
pw.style.display = isGoogle ? 'none':'block';
pw.value = '';showPfError('reauthError','');
overlay.classList.add('active');
if(!isGoogle)setTimeout(()=> pw.focus(),60);
const finish =(ok)=>{
overlay.classList.remove('active');pw.value = '';
confirmBtn.onclick = null;cancelBtn.onclick = null;pw.onkeydown = null;
resolve(ok);
};
const submit = async()=>{
if(!isGoogle && !pw.value){showPfError('reauthError',t().pfNeedPw);return;}
confirmBtn.disabled = true;
const r = await A.reauthenticate(pw.value);
confirmBtn.disabled = false;
if(r.error){showPfError('reauthError',r.wrongPassword ? t().pfWrongPw:r.error);return;}
reauthVerifiedAt = Date.now();
finish(true);
};
confirmBtn.onclick = submit;
cancelBtn.onclick =()=> finish(false);
pw.onkeydown =(e)=>{if(e.key === 'Enter'){e.preventDefault();submit();}};
});
}
function processAvatarFile(file){
return new Promise((resolve,reject)=>{
if(!file || !/^image\//.test(file.type)|| file.size > 15 * 1024 * 1024){reject(new Error('bad'));return;}
const fr = new FileReader();
fr.onerror =()=> reject(new Error('bad'));
fr.onload =()=>{
const img = new Image();
img.onerror =()=> reject(new Error('bad'));
img.onload =()=>{
const size = 256,side = Math.min(img.width,img.height);
const cv = document.createElement('canvas');cv.width = cv.height = size;
cv.getContext('2d').drawImage(img,(img.width - side)/ 2,(img.height - side)/ 2,side,side,0,0,size,size);
resolve(cv.toDataURL('image/jpeg',0.82));
};
img.src = fr.result;
};
fr.readAsDataURL(file);
});
}
async function openProfileEditor(){
if(!state.currentUser)return;
if(!(await ensureVerified()))return;
pendingAvatar = null;
pfEl('profileNameInput').value = state.currentUser.name || '';
pfEl('profileAvatarPreview').src = avatarFor(state.currentUser);
showPfError('profileError','');
const isPw = window.SalatiAuth && window.SalatiAuth.getAuthMethod()=== 'password';
pfEl('openPwBtn').style.display = isPw ? 'block':'none';
pfEl('pwGoogleNote').style.display = isPw ? 'none':'block';
pfEl('profileOverlay').classList.add('active');
}
function closeProfileEditor(){pfEl('profileOverlay').classList.remove('active');pendingAvatar = null;}
async function saveProfileChanges(){
const A = window.SalatiAuth,u = state.currentUser;
if(!A || !u)return;
const name = pfEl('profileNameInput').value.trim();
if(!name){showPfError('profileError',t().pfNeedName);return;}
if(!(await ensureVerified()))return;
const btn = pfEl('profileSaveBtn');btn.disabled = true;showPfError('profileError','');
let failed = false;
if(name !== u.name){
const r = await A.updateName(name);
if(r.error)failed = true;else state.currentUser.name = name;
}
if(!failed && pendingAvatar !== null){
const r = await A.saveAvatar(u.uid,pendingAvatar);
if(r.error)failed = true;
else{
try{pendingAvatar ? localStorage.setItem(AVATAR_KEY_PREFIX + u.uid,pendingAvatar):localStorage.removeItem(AVATAR_KEY_PREFIX + u.uid);}catch(e){}
state.currentUser.picture = pendingAvatar ||(A.getCurrentUser()||{}).picture || '';
}
}
btn.disabled = false;
renderAccountUI(state.currentUser);
if(failed){showPfError('profileError',t().pfFailed);return;}
closeProfileEditor();
}
pfEl('editAccountBtn')?.addEventListener('click',openProfileEditor);
pfEl('profileCancelBtn')?.addEventListener('click',closeProfileEditor);
pfEl('profileSaveBtn')?.addEventListener('click',saveProfileChanges);
pfEl('pickCameraBtn')?.addEventListener('click',()=> pfEl('avatarCameraInput').click());
pfEl('pickGalleryBtn')?.addEventListener('click',()=> pfEl('avatarGalleryInput').click());
pfEl('pickFilesBtn')?.addEventListener('click',()=> pfEl('avatarFilesInput').click());
pfEl('removeAvatarBtn')?.addEventListener('click',()=>{
pendingAvatar = '';
pfEl('profileAvatarPreview').src = avatarFor({name:pfEl('profileNameInput').value ||(state.currentUser && state.currentUser.name),email:state.currentUser && state.currentUser.email});
});
['avatarCameraInput','avatarGalleryInput','avatarFilesInput'].forEach((id)=>{
pfEl(id)?.addEventListener('change',async(e)=>{
const file = e.target.files && e.target.files[0];
e.target.value = '';
if(!file)return;
try{
pendingAvatar = await processAvatarFile(file);
pfEl('profileAvatarPreview').src = pendingAvatar;
showPfError('profileError','');
}catch(err){showPfError('profileError',t().pfBadImage);}
});
});
function setPwVisible(v){
['pwCurrent','pwNew','pwConfirm'].forEach(id =>{const el = pfEl(id);if(el)el.type = v ? 'text':'password';});
const b = pfEl('pwToggleShow');if(b)b.textContent = v ? t().pwHide:t().pwShow;
}
function showPwMsg(kind,text){
const e = pfEl('pwError'),o = pfEl('pwSuccess');
e.style.display = kind === 'error' && text ? 'block':'none';e.textContent = kind === 'error' ?(text || ''):'';
o.style.display = kind === 'success' && text ? 'block':'none';o.textContent = kind === 'success' ?(text || ''):'';
}
function openPasswordDialog(){
['pwCurrent','pwNew','pwConfirm'].forEach(id =>{pfEl(id).value = '';});
setPwVisible(false);showPwMsg(null,'');
pfEl('pwOverlay').classList.add('active');
setTimeout(()=> pfEl('pwCurrent').focus(),60);
}
function closePasswordDialog(){
pfEl('pwOverlay').classList.remove('active');
['pwCurrent','pwNew','pwConfirm'].forEach(id =>{pfEl(id).value = '';});
}
async function submitPasswordChange(){
const A = window.SalatiAuth;if(!A || !state.currentUser)return;
const cur = pfEl('pwCurrent').value,nw = pfEl('pwNew').value,cf = pfEl('pwConfirm').value;
const s = t();
if(!cur){showPwMsg('error',s.pwNeedCurrent);return;}
if(nw.length < 6){showPwMsg('error',s.pwTooShort);return;}
if(nw === cur){showPwMsg('error',s.pwSame);return;}
if(nw !== cf){showPwMsg('error',s.pwMismatch);return;}
const btn = pfEl('pwSaveBtn');btn.disabled = true;showPwMsg(null,'');
const r = await A.changePassword(cur,nw);
btn.disabled = false;
if(r.error){showPwMsg('error',r.wrongPassword ? s.pfWrongPw:(r.error === 'not-password' ? s.pwGoogleNote:r.error));return;}
reauthVerifiedAt = Date.now();
showPwMsg('success',s.pwDone);
['pwCurrent','pwNew','pwConfirm'].forEach(id =>{pfEl(id).value = '';});
setTimeout(closePasswordDialog,1400);
}
pfEl('openPwBtn')?.addEventListener('click',openPasswordDialog);
pfEl('pwCancelBtn')?.addEventListener('click',closePasswordDialog);
pfEl('pwSaveBtn')?.addEventListener('click',submitPasswordChange);
pfEl('pwToggleShow')?.addEventListener('click',()=> setPwVisible(pfEl('pwNew').type === 'password'));
['pwCurrent','pwNew','pwConfirm'].forEach(id => pfEl(id)?.addEventListener('keydown',(e)=>{if(e.key === 'Enter'){e.preventDefault();submitPasswordChange();}}));
applyProfileTexts();
function applyAuthModeTexts(){
const s = t();
const isRegister = state.authMode === 'register';
const submitEl = document.getElementById('txtGateAuthSubmit');
const toggleEl = document.getElementById('txtGateAuthToggleMode');
const pwInput = document.getElementById('gatePassword');
if(submitEl)submitEl.textContent = isRegister ? s.authSubmitRegister:s.authSubmitLogin;
if(toggleEl)toggleEl.textContent = isRegister ? s.authToggleToLogin:s.authToggleToRegister;
if(pwInput)pwInput.setAttribute('autocomplete',isRegister ? 'new-password':'current-password');
}
function escapeHtml(str){
const div = document.createElement('div');
div.textContent = String(str ?? '');
return div.innerHTML;
}
function haversine(lat1,lon1,lat2,lon2){
const R = 6371;
const dLat =(lat2-lat1)* Math.PI/180;
const dLon =(lon2-lon1)* Math.PI/180;
const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
return R * 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function dateKey(d){
const y = d.getFullYear(),m = String(d.getMonth()+1).padStart(2,'0'),day = String(d.getDate()).padStart(2,'0');
return `${y}-${m}-${day}`;
}
function isSameDay(a,b){return dateKey(a)=== dateKey(b);}
function localeForLang(){
return{ar:'ar',en:'en',fr:'fr',es:'es',zh:'zh',ru:'ru',tr:'tr'}[state.lang]|| 'en';
}
function getHijriInfo(date){
try{
let off = 0;try{off = Number(localStorage.getItem('salati_hijri_off'))|| 0;}catch(e){}
if(off)date = new Date(date.getFullYear(),date.getMonth(),date.getDate()+ off,12);
const cal =(Intl.DateTimeFormat.prototype.resolvedOptions &&(()=>{
try{return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura').resolvedOptions().calendar === 'islamic-umalqura';}catch(e){return false;}
})())? 'islamic-umalqura':'islamic';
const fmt = new Intl.DateTimeFormat(`${localeForLang()}-u-ca-${cal}`,{day:'numeric',month:'long',year:'numeric'});
const parts = fmt.formatToParts(date);
const day = Number(parts.find(p=>p.type==='day')?.value);
const text = fmt.format(date);
return{day,text};
}catch(e){
console.error(e);
return{day:null,text:'—'};
}
}
function renderGreeting(){
const g = GREETING_TEXT[state.lang]|| GREETING_TEXT.en;
const hi = document.getElementById('greetHi');
const nameEl = document.getElementById('greetName');
if(!hi || !nameEl)return;
const u = state.currentUser;
const name = u &&(u.name || '').trim();
hi.textContent = name ? g.hi:g.guest;
nameEl.textContent = name || '';
nameEl.style.display = name ? '':'none';
}
function applyLanguage(){
const cfg = LANGUAGES.find(l => l.code === state.lang)|| LANGUAGES[0];
const s = t();
document.getElementById('htmlRoot').setAttribute('lang',cfg.code);
document.getElementById('htmlRoot').setAttribute('dir',cfg.dir);
document.body.classList.toggle('lang-ltr',cfg.dir === 'ltr');
document.getElementById('pageTitle').textContent = s.appName;
document.getElementById('txtAppName').textContent = s.appName;
renderGreeting();
document.getElementById('txtNextPrayerLabel').textContent = s.nextPrayerLabel;
document.getElementById('txtTimesTitle').textContent = s.timesTitle;
document.getElementById('txtNotifTitle').textContent = s.notifTitle;
document.getElementById('txtNotifDesc').textContent = s.notifDesc;
document.getElementById('txtNotifHint').textContent = s.notifHint;
document.getElementById('txtMosquesTitle').textContent = s.mosquesTitle;
document.getElementById('findMosquesBtn').textContent = s.mosquesRefresh;
document.getElementById('txtSoundTitle').textContent = s.soundTitle;
document.getElementById('txtNavHome').textContent = s.navHome;
document.getElementById('txtNavMosques').textContent = s.navMosques;
document.getElementById('txtNavAzkar').textContent = s.navAzkar;
document.getElementById('txtAzkarTitle').textContent = s.azTitle;
document.getElementById('txtNavMuslimDay').textContent = s.navMuslimDay;
document.getElementById('txtSecSettingsLang').textContent = LANG_TITLE[state.lang]|| LANG_TITLE.en;
document.getElementById('txtNavSettings').textContent = s.navSettingsTitle || s.settingsTitle;
document.getElementById('txtExtraTimesTitle').textContent = s.extraTimesTitle;
document.getElementById('txtExtraSunrise').textContent = s.extraSunrise;
document.getElementById('txtExtraImsak').textContent = s.extraImsak;
document.getElementById('txtExtraMidnight').textContent = s.extraMidnight;
document.getElementById('txtExtraLastThird').textContent = s.extraLastThird;
document.getElementById('txtOpenMuslimDay').textContent = s.openMuslimDay;
document.getElementById('txtRadiusLabel').textContent = s.radiusLabel;
document.getElementById('txtFavMosqueTitle').textContent = s.favMosqueTitle;
document.getElementById('txtFavMosqueOpen').textContent = s.favMosqueOpen;
document.getElementById('txtMdTitle').textContent = s.mdTitleShort;
document.getElementById('txtMdHomeTitle').textContent = s.mdTitleShort;
document.getElementById('txtMdBackToday').textContent = s.mdBackToday;
document.getElementById('txtMdMonthBtn').textContent = state.mdMonthOpen ? s.mdMonthHide:s.mdMonthShow;
document.getElementById('mdHijriDisclaimer').textContent = s.hijriDisclaimer;
if(!state.mdMonthOpen)document.getElementById('txtMonthTitle').textContent = s.monthTitle;
document.getElementById('txtSecPrayers').textContent = s.secPrayers;
document.getElementById('txtSecNawafil').textContent = s.secNawafil;
document.getElementById('txtSecCustom').textContent = s.secCustom;
document.getElementById('txtSecQuran').textContent = s.secQuran;
document.getElementById('txtSecAzkar').textContent = s.secAzkar;
document.getElementById('txtSecNight').textContent = s.secNight;
document.getElementById('txtSecParents').textContent = s.secParents;
document.getElementById('txtSecLearning').textContent = s.secLearning;
document.getElementById('txtSecCharity').textContent = s.secCharity;
document.getElementById('txtSecFasting').textContent = s.secFasting;
document.getElementById('txtSecFriday').textContent = s.secFriday;
document.getElementById('txtCustomizeTitle').textContent = s.customizeTitle;
document.getElementById('txtCustomizeSave').textContent = s.customizeSave;
document.getElementById('txtSettingsTitle').textContent = s.settingsTitle;
document.getElementById('txtSecSettingsPrayer').textContent = s.secSettingsPrayer;
document.getElementById('txtCalcMethod').textContent = s.calcMethod;
document.getElementById('txtAsrMadhhab').textContent = s.asrMadhhab;
document.getElementById('optShafi').textContent = s.shafi;
document.getElementById('optMaliki').textContent = s.maliki;
document.getElementById('optHanbali').textContent = s.hanbali;
document.getElementById('optHanafi').textContent = s.hanafi;
document.getElementById('txtAsrNote').textContent = s.asrNote;
document.getElementById('txtAdjustTimes').textContent = s.adjustTimes;
document.getElementById('txtSecSettingsAdhan').textContent = s.secSettingsAdhan;
document.getElementById('txtReminderBefore').textContent = s.reminderBefore;
document.getElementById('optRemOff').textContent = s.reminderOff;
document.getElementById('txtSecSettingsLocation').textContent = s.secSettingsLocation;
document.getElementById('txtUseGps').textContent = s.useGps;
document.getElementById('txtManualCoords').textContent = s.manualCoords;
document.getElementById('txtSave').textContent = s.save;
document.getElementById('txtGeocodeNote').textContent = s.geocodeNote;
document.getElementById('txtSecSettingsMuslimDay').textContent = s.secSettingsMuslimDay;
document.getElementById('txtEditTracked').textContent = s.editTracked;
document.getElementById('txtResetToday').textContent = s.resetToday;
document.getElementById('txtClearHistory').textContent = s.clearHistory;
document.getElementById('txtSecSettingsThemes').textContent = THEMES_TITLE[state.lang]|| THEMES_TITLE.en;
document.getElementById('txtInstallApp').textContent = INSTALL_APP_TEXT[state.lang]|| INSTALL_APP_TEXT.en;
applyChangeThemeButtonText();
document.getElementById('txtIosInstallTitle').textContent = s.iosInstallTitle;
document.getElementById('txtIosInstallSteps').textContent = s.iosInstallSteps;
document.getElementById('txtSecSettingsAccount').textContent = s.secSettingsAccount;
document.getElementById('txtSignOut').textContent = s.signOut;
if(typeof applyProfileTexts === 'function')applyProfileTexts();
const txtVisitorsLabel = document.getElementById('txtVisitorsLabel');if(txtVisitorsLabel)txtVisitorsLabel.textContent = s.visitorsLabel;
if(typeof renderVisitorCount === 'function')renderVisitorCount();
const txtSignedOutPrompt = document.getElementById('txtAccountSignedOutPrompt');if(txtSignedOutPrompt)txtSignedOutPrompt.textContent =(state.currentUser && state.currentUser.isAnonymous)? s.accountGuestPrompt:s.accountSignedOutPrompt;
const txtOpenGate = document.getElementById('txtOpenAuthGate');if(txtOpenGate)txtOpenGate.textContent = s.openAuthGate;
const txtGateTitle = document.getElementById('txtGateTitle');if(txtGateTitle)txtGateTitle.textContent = s.gateTitle;
const txtGateSubtitle = document.getElementById('txtGateSubtitle');if(txtGateSubtitle)txtGateSubtitle.textContent = s.gateSubtitle;
const txtGateLoading = document.getElementById('txtGateLoading');if(txtGateLoading)txtGateLoading.textContent = s.gateLoading;
const txtGateGuest = document.getElementById('txtGateGuest');if(txtGateGuest)txtGateGuest.textContent = s.gateGuest;
const gateNameEl = document.getElementById('gateName');if(gateNameEl)gateNameEl.placeholder = s.authNamePlaceholder;
const gateEmailEl = document.getElementById('gateEmail');if(gateEmailEl)gateEmailEl.placeholder = s.authEmailPlaceholder;
const gatePasswordEl = document.getElementById('gatePassword');if(gatePasswordEl)gatePasswordEl.placeholder = s.authPasswordPlaceholder;
const txtGateAuthForgot = document.getElementById('txtGateAuthForgot');if(txtGateAuthForgot)txtGateAuthForgot.textContent = s.authForgot;
if(typeof applyAuthModeTexts === 'function')applyAuthModeTexts();
renderThemeGrid();
const locText = document.getElementById('locText');
if(!state.coords)locText.textContent = s.locPrompt;
if(state.timings)renderTimes();else document.getElementById('npCountdown').textContent = s.setLocFirst;
if(state.mosques.length || state.coords)renderMosques();
else document.getElementById('mosqueList').innerHTML = `<div class="status-msg">${escapeHtml(s.mosquesPrompt)}</div>`;
syncPersistedSettings();
renderSounds();
applyExtraTexts();
renderAzkar();
renderLangList();
renderRadiusChips();
renderFavMosqueBox();
renderCalcMethodOptions();
renderTuneRows();
renderPerPrayerNotifRows();
renderReminderSelect();
renderMuslimDay();
}
function updateCurrentLang(){
const cfg = LANGUAGES.find(l => l.code === state.lang)|| LANGUAGES[0];
const f = document.getElementById('langCurrentFlag'),n = document.getElementById('langCurrentName');
if(f)f.textContent = cfg.flag;
if(n)n.textContent = STRINGS[cfg.code].langName;
applyLangToggleText();
}
function applyLangToggleText(){
const btn = document.getElementById('toggleLangGridBtn'),grid = document.getElementById('langList');
if(!btn || !grid)return;
const open = grid.style.display !== 'none';
const dict = open ? LANG_HIDE_TEXT:LANG_CHANGE_TEXT;
btn.querySelector('span').textContent = dict[state.lang]|| dict.en;
}
function setLangGridOpen(open){
const grid = document.getElementById('langList');
if(!grid)return;
grid.style.display = open ? 'grid':'none';
applyLangToggleText();
}
document.getElementById('toggleLangGridBtn')?.addEventListener('click',()=>{
const grid = document.getElementById('langList');
setLangGridOpen(grid && grid.style.display === 'none');
});
function renderLangList(){
const list = document.getElementById('langList');
if(!list)return;
list.innerHTML = '';
updateCurrentLang();
LANGUAGES.forEach(l =>{
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'lang-chip' +(l.code === state.lang ? ' active':'');
btn.setAttribute('aria-pressed',l.code === state.lang ? 'true':'false');
btn.innerHTML = `<span class="flag">${l.flag}</span><span class="lname">${escapeHtml(STRINGS[l.code].langName)}</span><span class="lcheck" aria-hidden="true">✓</span>`;
btn.addEventListener('click',()=>{
if(l.code === state.lang)return;
state.lang = l.code;
localStorage.setItem('salati_lang',l.code);
if(typeof scheduleCloudSave === 'function')scheduleCloudSave();
applyLanguage();
setLangGridOpen(false);
positionTabIndicator(false);
});
list.appendChild(btn);
});
}
function deviceTz(){
try{return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';}catch(e){return 'UTC';}
}
function isQuietMode(){
try{const v = localStorage.getItem('salati_quiet_until');if(!v)return false;return v === 'inf' || Number(v)> Date.now();}catch(e){return false;}
}
function currentTz(){return state.tz || deviceTz();}
function tzParts(date,tz){
const f = new Intl.DateTimeFormat('en-CA',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
const o ={};
f.formatToParts(date).forEach(p =>{if(p.type !== 'literal')o[p.type]= Number(p.value);});
return o;
}
function tzDateKey(date,tz){
const p = tzParts(date,tz || currentTz());
return `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`;
}
function zonedTime(hhmm,dayOffset){
const tz = currentTz();
const[h,m]= String(hhmm).split(':').map(Number);
const p = tzParts(new Date(),tz);
const wall = Date.UTC(p.year,p.month - 1,p.day +(dayOffset || 0),h,m,0);
let guess = wall;
for(let i = 0;i < 2;i++){
const q = tzParts(new Date(guess),tz);
const asUtc = Date.UTC(q.year,q.month - 1,q.day,q.hour,q.minute,q.second);
guess += wall - asUtc;
}
return new Date(guess);
}
const LOC_REFRESH_MIN_KM = 3;
let locWatchId = null;
let locBusy = false;
function stopLocWatch(){
if(locWatchId !== null){try{navigator.geolocation.clearWatch(locWatchId);}catch(e){}locWatchId = null;}
}
function setLocText(txt){const el = document.getElementById('locText');if(el)el.textContent = txt;}
function placeLabel(){
const p = state.settings.lastPlace;
return p && p.name ? p.name:'';
}
function renderLocPill(accuracy){
const label = placeLabel();
const c = state.coords;
if(!c)return;
let txt = label ||(t().yourLocation + ` (${c.lat.toFixed(3)}, ${c.lng.toFixed(3)})`);
if(accuracy != null && !state.settings.manualLocation)txt += ` · ±${Math.round(accuracy)} ${t().meterShort || 'm'}`;
setLocText(txt);
document.getElementById('locDot').classList.add('live');
}
function applyPosition(lat,lng,accuracy,manual,placeName){
const prev = state.coords;
const moved = !prev ? Infinity:haversine(prev.lat,prev.lng,lat,lng);
state.coords ={lat,lng,accuracy:accuracy == null ? null:accuracy};
state.settings.manualLocation = !!manual;
state.settings.lastCoords ={lat,lng};
state.settings.lastLocCheck = Date.now();
if(placeName){state.settings.lastPlace ={name:placeName,lat,lng};}
else if(moved > 1 || !state.settings.lastPlace){state.settings.lastPlace = null;}
saveSettings();
renderLocPill(accuracy);
if(moved >= LOC_REFRESH_MIN_KM || !state.timings || manual){
onLocationReady();
}
if(!placeName)resolvePlaceName(lat,lng);
}
async function resolvePlaceName(lat,lng){
try{
const lp = state.settings.lastPlace;
if(lp && lp.name && haversine(lp.lat,lp.lng,lat,lng)< 3)return;
const ctl = new AbortController();const to = setTimeout(()=> ctl.abort(),7000);
const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&accept-language=${encodeURIComponent(state.lang)}&lat=${lat}&lon=${lng}`,{signal:ctl.signal});
clearTimeout(to);
if(!r.ok)return;
const d = await r.json();
const a = d.address ||{};
const city = a.city || a.town || a.village || a.municipality || a.county || a.state || '';
const name =[city,a.country].filter(Boolean).join('، ');
if(!name)return;
if(!state.coords || haversine(state.coords.lat,state.coords.lng,lat,lng)> 3)return;
state.settings.lastPlace ={name,lat,lng};
saveSettings();
renderLocPill(state.coords.accuracy);
}catch(e){}
}
function geoErrorText(err){
const s = t();
if(err && err.code === 1)return s.locDenied || s.locError;
if(err && err.code === 2)return s.locUnavailable || s.locError;
if(err && err.code === 3)return s.locTimeout || s.locError;
return s.locError;
}
function requestLocation(opts){
opts = opts ||{};
const silent = !!opts.silent;
if(!navigator.geolocation){if(!silent)setLocText(t().noGeo);return;}
if(locBusy)return;
locBusy = true;
stopLocWatch();
if(!silent)setLocText(t().locSearching);
let best = null,done = false,finishTimer = null;
const finish =()=>{
if(done)return;done = true;
clearTimeout(finishTimer);stopLocWatch();locBusy = false;
};
const accept =(pos,isFinal)=>{
best = pos;
applyPosition(pos.coords.latitude,pos.coords.longitude,pos.coords.accuracy,false,null);
if(isFinal)finish();
};
navigator.geolocation.getCurrentPosition(
(pos)=>{if(!done)accept(pos,silent || pos.coords.accuracy <= 100);},
(err)=>{
if(!best && err && err.code === 1){finish();if(!silent)setLocText(geoErrorText(err));}
},
{enableHighAccuracy:false,timeout:8000,maximumAge:5 * 60 * 1000}
);
if(silent){setTimeout(finish,9000);return;}
locWatchId = navigator.geolocation.watchPosition(
(pos)=>{
if(done)return;
if(!best || pos.coords.accuracy < best.coords.accuracy - 5)accept(pos,pos.coords.accuracy <= 30);
},
(err)=>{
if(done)return;
if(!best){finish();setLocText(geoErrorText(err));if(state.settings.lastCoords && !state.coords)restoreLastLocationIfAny();}
},
{enableHighAccuracy:true,timeout:15000,maximumAge:0}
);
finishTimer = setTimeout(()=>{if(!best && !done){setLocText(t().locTimeout || t().locError);}finish();},16000);
}
function setManualCoords(lat,lng,placeName){
applyPosition(lat,lng,null,true,placeName || null);
if(!placeName)setLocText(t().yourLocation + ` (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
}
function onLocationReady(){
fetchPrayerTimes();
fetchMosques();
}
document.getElementById('locPill').addEventListener('click',()=> requestLocation());
document.getElementById('gpsRefreshBtn').addEventListener('click',()=> requestLocation());
document.getElementById('manualCoordsBtn').addEventListener('click',()=>{
const lat = parseFloat(document.getElementById('manualLat').value);
const lng = parseFloat(document.getElementById('manualLng').value);
if(Number.isFinite(lat)&& Number.isFinite(lng)&& Math.abs(lat)<= 90 && Math.abs(lng)<= 180)setManualCoords(lat,lng);
});
async function searchCity(){
const q =(document.getElementById('cityQuery').value || '').trim();
const box = document.getElementById('cityResults');
if(q.length < 2){box.innerHTML = '';return;}
box.innerHTML = `<div class="status-msg">${escapeHtml(t().citySearching || '...')}</div>`;
try{
const ctl = new AbortController();const to = setTimeout(()=> ctl.abort(),9000);
const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&featuretype=settlement&accept-language=${encodeURIComponent(state.lang)}&q=${encodeURIComponent(q)}`,{signal:ctl.signal});
clearTimeout(to);
const list = await r.json();
if(!Array.isArray(list)|| !list.length){box.innerHTML = `<div class="status-msg">${escapeHtml(t().cityNoResults || '—')}</div>`;return;}
box.innerHTML = '';
list.forEach(item =>{
const a = item.address ||{};
const city = a.city || a.town || a.village || a.municipality || item.name || '';
const sub =[a.state,a.country].filter(Boolean).join('، ');
const btn = document.createElement('button');
btn.type = 'button';btn.className = 'city-result';
btn.innerHTML = `<span class="cr-name">${escapeHtml(city || item.display_name)}</span><span class="cr-sub">${escapeHtml(sub)}</span>`;
btn.addEventListener('click',()=>{
const name =[city,a.country].filter(Boolean).join('، ')|| item.display_name;
setManualCoords(parseFloat(item.lat),parseFloat(item.lon),name);
box.innerHTML = '';document.getElementById('cityQuery').value = '';
});
box.appendChild(btn);
});
}catch(e){
box.innerHTML = `<div class="status-msg">${escapeHtml(t().cityError || '—')}</div>`;
}
}
document.getElementById('citySearchBtn')?.addEventListener('click',searchCity);
document.getElementById('cityQuery')?.addEventListener('keydown',(e)=>{if(e.key === 'Enter'){e.preventDefault();searchCity();}});
function restoreLastLocationIfAny(){
const last = state.settings.lastCoords;
if(last && Number.isFinite(last.lat)&& Number.isFinite(last.lng)){
state.coords ={lat:last.lat,lng:last.lng,accuracy:null};
renderLocPill(null);
onLocationReady();
return true;
}
return false;
}
function silentLocationRefresh(){
if(state.settings.manualLocation || !navigator.geolocation)return;
const last = state.settings.lastLocCheck || 0;
if(Date.now()- last < 30 * 60 * 1000)return;
if(navigator.permissions && navigator.permissions.query){
navigator.permissions.query({name:'geolocation'}).then(r =>{if(r.state === 'granted')requestLocation({silent:true});}).catch(()=>{});
}
}
function buildTuneString(){
const tu = state.settings.tune;
return[0,tu.Fajr||0,0,tu.Dhuhr||0,tu.Asr||0,tu.Maghrib||0,0,tu.Isha||0,0].join(',');
}
const PT_CACHE_KEY = 'salati_pt_cache_v3';
function ptKey(){
const{lat,lng}= state.coords;
const s = state.settings;
return[lat.toFixed(2),lng.toFixed(2),s.method,s.school,buildTuneString()].join('|');
}
function clean(timeStr){return String(timeStr || '—').split(' ')[0];}
function autoMethod(lat,lng){
if(lat >= 30 && lat <= 37.2 && lng >= -1.5 && lng <= 8.6)return 19;
return null;
}
async function aladhanDay(ts){
const{lat,lng}= state.coords;
const s = state.settings;
const params = new URLSearchParams({latitude:lat,longitude:lng,school:s.school,tune:buildTuneString()});
const m = s.method !== 'auto' ? s.method:autoMethod(lat,lng);
if(m != null)params.set('method',m);
if(Math.abs(lat)> 48)params.set('latitudeAdjustmentMethod','3');
const ctl = new AbortController();const to = setTimeout(()=> ctl.abort(),12000);
try{
const res = await fetch(`https://api.aladhan.com/v1/timings/${ts}?${params.toString()}`,{signal:ctl.signal});
const data = await res.json();
if(!res.ok || data.code !== 200 || !data.data || !data.data.timings)throw new Error('bad response');
return data.data;
}finally{clearTimeout(to);}
}
function applyTimingsPayload(p){
state.tz = p.tz || state.tz || deviceTz();
state.timings = p.timings;
state.timingsExtra = p.extra;
state.timingsDate = p.date;
state.tomorrowFajr = p.tomorrowFajr || null;
renderTimes();
renderExtraTimes();
scheduleNotifications();
}
let ptFetching = false,ptLastTry = 0;
async function fetchPrayerTimes(){
if(!state.coords || ptFetching)return;
ptFetching = true;ptLastTry = Date.now();
const key = ptKey();
try{
const ts = Math.floor(Date.now()/1000);
const d0 = await aladhanDay(ts);
const tz =(d0.meta && d0.meta.timezone)|| deviceTz();
const times = d0.timings;
const payload ={key,tz,timings:{},extra:{},tomorrowFajr:null};
PRAYER_ORDER.forEach(k => payload.timings[k]= clean(times[k]));
payload.extra ={Sunrise:clean(times.Sunrise),Imsak:clean(times.Imsak),Midnight:clean(times.Midnight),Firstthird:clean(times.Firstthird),Lastthird:clean(times.Lastthird)};
payload.date = tzDateKey(new Date(),tz);
state.tz = tz;
try{
const d1 = await aladhanDay(ts + 86400);
payload.tomorrowFajr = clean(d1.timings.Fajr);
}catch(e){}
try{localStorage.setItem(PT_CACHE_KEY,JSON.stringify(payload));}catch(e){}
applyTimingsPayload(payload);
}catch(e){
console.error(e);
let used = false;
try{
const c = JSON.parse(localStorage.getItem(PT_CACHE_KEY)|| 'null');
if(c && c.key === key && c.date === tzDateKey(new Date(),c.tz)){applyTimingsPayload(c);used = true;}
}catch(err){}
if(!used)document.getElementById('npCountdown').textContent = t().prayerFetchError;
}finally{ptFetching = false;}
}
function renderTimes(){
const grid = document.getElementById('timesGrid');
grid.innerHTML = '';
const names = t().prayerNames;
PRAYER_ORDER.forEach(k =>{
const cell = document.createElement('div');
cell.className = 'time-cell';
cell.innerHTML = `<div class="n">${escapeHtml(names[k])}</div><div class="t">${escapeHtml(state.timings[k])}</div>`;
grid.appendChild(cell);
});
updateNextPrayer();
}
function renderExtraTimes(){
if(!state.timingsExtra)return;
document.getElementById('valSunrise').textContent = state.timingsExtra.Sunrise;
document.getElementById('valImsak').textContent = state.timingsExtra.Imsak;
document.getElementById('valMidnight').textContent = state.timingsExtra.Midnight;
document.getElementById('valLastThird').textContent = state.timingsExtra.Lastthird;
}
function timeStrToDate(hhmm){return zonedTime(hhmm,0);}
function updateNextPrayer(){
if(!state.timings)return;
const now = new Date();
if(state.timingsDate && tzDateKey(now)!== state.timingsDate && state.coords && Date.now()- ptLastTry > 30000){
fetchPrayerTimes();
}
let next = null,nextKey = null;
for(const k of PRAYER_ORDER){
const d = zonedTime(state.timings[k],0);
if(d > now){next = d;nextKey = k;break;}
}
if(!next){nextKey = 'Fajr';next = zonedTime(state.tomorrowFajr || state.timings.Fajr,1);}
document.getElementById('npName').textContent = t().prayerNames[nextKey];
const diff = Math.max(0,next - now);
const h = Math.floor(diff/3600000),m = Math.floor((diff%3600000)/60000),s = Math.floor((diff%60000)/1000);
document.getElementById('npCountdown').textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
document.querySelectorAll('#timesGrid .time-cell').forEach((cell,i)=>{
if(i < PRAYER_ORDER.length)cell.classList.toggle('active',PRAYER_ORDER[i]=== nextKey);
});
}
setInterval(updateNextPrayer,1000);
document.addEventListener('visibilitychange',()=>{
if(document.visibilityState !== 'visible')return;
if(state.timings){updateNextPrayer();scheduleNotifications();}
silentLocationRefresh();
});
window.addEventListener('online',()=>{if(state.coords && !state.timings)fetchPrayerTimes();});
function prayerQueue(){
if(!state.timings)return[];
const q = PRAYER_ORDER.map(k =>({k,time:zonedTime(state.timings[k],0)}));
if(state.tomorrowFajr)q.push({k:'Fajr',time:zonedTime(state.tomorrowFajr,1)});
return q;
}
const FIRED_KEY = 'salati_fired_v1';
const LATE_GRACE_MS = 90 * 1000;
function wasFired(id){try{return JSON.parse(localStorage.getItem(FIRED_KEY)|| '[]').includes(id);}catch(e){return false;}}
function markFired(id){try{const a = JSON.parse(localStorage.getItem(FIRED_KEY)|| '[]');a.push(id);localStorage.setItem(FIRED_KEY,JSON.stringify(a.slice(-40)));}catch(e){}}
function fireOnce(type,k,time,mins){
const id = type + k + time.getTime();
if(wasFired(id))return;
markFired(id);
if(type === 'A')fireAdhan(k);else fireReminder(k,mins);
}
function scheduleNotifications(){
state.notifTimers.forEach(clearTimeout);
state.notifTimers =[];
if(window.SALATI_NATIVE)return;
if(!state.timings)return;
if(!document.getElementById('notifToggle').checked)return;
const now = Date.now();
const remMin = Number(state.settings.reminderMinutes)|| 0;
const MAX_DELAY = 2147483000;
prayerQueue().forEach(({k,time})=>{
const cfg = state.settings.notifPerPrayer[k];
const delay = time.getTime()- now;
if(delay > 0 && delay < MAX_DELAY &&(cfg.notify || cfg.adhan)){
state.notifTimers.push(setTimeout(()=> fireOnce('A',k,time),delay));
}
if(delay > 0 && cfg.reminder && remMin > 0){
const remDelay = delay - remMin*60000;
if(remDelay > 0 && remDelay < MAX_DELAY){
state.notifTimers.push(setTimeout(()=> fireOnce('R',k,time,remMin),remDelay));
}
}
});
}
function precisionTick(){
if(window.SALATI_NATIVE)return;
if(!state.timings || !document.getElementById('notifToggle').checked)return;
const now = Date.now();
const remMin = Number(state.settings.reminderMinutes)|| 0;
prayerQueue().forEach(({k,time})=>{
const cfg = state.settings.notifPerPrayer[k];
const t = time.getTime();
if(cfg.adhan && t - now > 0 && t - now <= 60000)prewarmAdhan();
if((cfg.notify || cfg.adhan)&& now >= t && now - t <= LATE_GRACE_MS)fireOnce('A',k,time);
if(cfg.reminder && remMin > 0){
const rt = t - remMin*60000;
if(now >= rt && now < t && now - rt <= LATE_GRACE_MS)fireOnce('R',k,time,remMin);
}
});
}
setInterval(precisionTick,250);
async function showNotif(title,body,prayerKey){
if(isQuietMode())return;
if(!('Notification' in window)|| Notification.permission !== 'granted')return;
try{
const reg =('serviceWorker' in navigator)? await navigator.serviceWorker.getRegistration():null;
if(reg && reg.showNotification){await reg.showNotification(title,{body,icon:'icons/icon-192.png',tag:'salati-adhan',renotify:true,vibrate:[200,100,200],data:{prayer:prayerKey || null},actions:(prayerKey ?[{action:'prayed',title:XT('prayedAction')}]:[]).concat([{action:'stop',title:t().soundStop || 'Stop'}])});return;}
}catch(e){console.warn(e);}
try{new Notification(title,{body});}catch(e){console.warn(e);}
}
function fireAdhan(key){
if(isQuietMode())return;
const cfg = state.settings.notifPerPrayer[key];
if(cfg.adhan){state.adhanScheduled = key;playSelectedSound();}
if(cfg.notify)showNotif(t().adhanTitle(t().prayerNames[key]),t().adhanBody,key);
}
function fireReminder(key,mins){
if(isQuietMode())return;
showNotif(t().appName,t().reminderNotice(mins,t().prayerNames[key]));
}
function registerPushIfEnabled(){
try{
if(window.SalatiAuth && typeof window.SalatiAuth.enablePush === 'function' && 'Notification' in window && Notification.permission === 'granted'){
window.SalatiAuth.enablePush().catch(()=>{});
}
}catch(e){console.warn(e);}
}
document.getElementById('notifToggle').addEventListener('change',async(e)=>{
const on = e.target.checked;
state.settings.notifEnabled = on;
saveSettings();
flashSaved(e.target.closest('.home-toggle').firstElementChild);
if(on && 'Notification' in window){
if(Notification.permission === 'default'){try{await Notification.requestPermission();}catch(err){}}
if(Notification.permission === 'denied')alert(XT('notifDenied'));
}
if(on){const n = Date.now();prayerQueue().forEach(({k,time})=>{if(time.getTime()<= n){markFired('A' + k + time.getTime());markFired('R' + k + time.getTime());}});}
scheduleNotifications();
if(on)registerPushIfEnabled();
});
window.addEventListener('load',()=> setTimeout(()=>{if(state.settings.notifEnabled)registerPushIfEnabled();},1500));
document.addEventListener('visibilitychange',()=>{if(!document.hidden){scheduleNotifications();precisionTick();}});
function renderRadiusChips(){
const box = document.getElementById('radiusChips');
const options =[1,5,10,20];
box.innerHTML = options.map(km => `<button class="chip ${km===state.settings.radiusKm?'active':''}" data-km="${km}">${km} ${escapeHtml(t().km)}</button>`).join('');
box.querySelectorAll('.chip').forEach(btn =>{
btn.addEventListener('click',()=>{
state.settings.radiusKm = Number(btn.dataset.km);
saveSettings();
renderRadiusChips();
if(state.coords)fetchMosques();
});
});
}
function renderFavMosqueBox(){
const box = document.getElementById('favMosqueBox');
const fav = state.settings.favoriteMosque;
if(!fav){box.style.display = 'none';return;}
box.style.display = 'flex';
document.getElementById('favMosqueName').textContent = fav.name;
document.getElementById('favMosqueGoBtn').onclick =()=> openMosqueDetail(fav);
}
const OVERPASS_ENDPOINTS =[
'https://overpass-api.de/api/interpreter',
'https://overpass.kumi.systems/api/interpreter',
'https://overpass.private.coffee/api/interpreter',
'https://lz4.overpass-api.de/api/interpreter',
'https://z.overpass-api.de/api/interpreter',
];
function fetchOverpass(query){
const ctls =[];
const one =(endpoint)=> new Promise((resolve,reject)=>{
const c = new AbortController();ctls.push(c);
const to = setTimeout(()=> c.abort(),15000);
fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data=' + encodeURIComponent(query),signal:c.signal})
.then(r =>{if(!r.ok)throw new Error('HTTP ' + r.status);return r.json();})
.then(d =>{clearTimeout(to);resolve(d);})
.catch(e =>{clearTimeout(to);reject(e);});
});
return Promise.any(OVERPASS_ENDPOINTS.map(one)).then(d =>{ctls.forEach(c =>{try{c.abort();}catch(e){}});return d;});
}
const MOSQUE_CACHE_KEY = 'salati_mosques_v2';
function mosqueCacheId(lat,lng,radius){return `${lat.toFixed(3)},${lng.toFixed(3)},${radius}`;}
function parseMosques(data,lat,lng){
const seen = new Set();
return(data.elements ||[]).map(el =>{
const elat = el.lat ?? el.center?.lat,elng = el.lon ?? el.center?.lon;
if(elat == null || elng == null)return null;
const tags = el.tags ||{};
return{
id:`${el.type}/${el.id}`,
name:tags['name:' + state.lang]|| tags.name || tags['name:ar']|| tags['name:en']|| t().mosqueNoName,
lat:elat,lng:elng,
dist:haversine(lat,lng,elat,elng),
phone:tags.phone || tags['contact:phone']|| null,
website:tags.website || tags['contact:website']|| null,
hours:tags.opening_hours || null,
};
}).filter(m =>{if(!m || seen.has(m.id))return false;seen.add(m.id);return true;}).sort((a,b)=> a.dist - b.dist);
}
async function fetchMosquesNominatim(lat,lng,radiusM){
const dLat = radiusM / 111320,dLng = radiusM /(111320 * Math.max(0.2,Math.cos(lat * Math.PI / 180)));
const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=mosque&limit=40&bounded=1&accept-language=${state.lang}`
+ `&viewbox=${lng - dLng},${lat + dLat},${lng + dLng},${lat - dLat}`;
const ctl = new AbortController();const to = setTimeout(()=> ctl.abort(),12000);
try{
const res = await fetch(url,{signal:ctl.signal});
if(!res.ok)throw new Error('HTTP ' + res.status);
const arr = await res.json();
return{elements:arr.map(r =>({type:r.osm_type || 'node',id:r.osm_id,lat:Number(r.lat),lon:Number(r.lon),tags:{name:r.name ||(r.display_name || '').split(',')[0]}}))};
}finally{clearTimeout(to);}
}
async function fetchMosques(force){
const list = document.getElementById('mosqueList');
const{lat,lng}= state.coords;
const radius =(state.settings.radiusKm || 5)* 1000;
const cid = mosqueCacheId(lat,lng,radius);
try{
const c = JSON.parse(localStorage.getItem(MOSQUE_CACHE_KEY)|| 'null');
if(c && c.id === cid && Array.isArray(c.list)&& c.list.length){
state.mosques = c.list.map(m =>({...m,dist:haversine(lat,lng,m.lat,m.lng)})).sort((a,b)=> a.dist - b.dist);
renderMosques();
if(!force && Date.now()- c.t < 6*3600*1000){refreshGmapFrame();return;}
}else{
list.innerHTML = `<div class="status-msg">${escapeHtml(t().mosquesSearching)}</div>`;
}
}catch(e){list.innerHTML = `<div class="status-msg">${escapeHtml(t().mosquesSearching)}</div>`;}
const query = `[out:json][timeout:15];(nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});nwr["building"="mosque"](around:${radius},${lat},${lng}););out center tags 80;`;
try{
let data;
try{data = await fetchOverpass(query);}
catch(e1){console.warn('Overpass failed, trying Nominatim',e1);data = await fetchMosquesNominatim(lat,lng,radius);}
state.mosques = parseMosques(data,lat,lng);
try{localStorage.setItem(MOSQUE_CACHE_KEY,JSON.stringify({id:cid,t:Date.now(),list:state.mosques}));}catch(e){}
renderMosques();
}catch(e){
console.error(e);
if(!state.mosques.length)list.innerHTML = `<div class="status-msg">${escapeHtml(t().mosquesError)}</div>`;
}
refreshGmapFrame();
}
function isFavoriteMosque(m){
const fav = state.settings.favoriteMosque;
return fav && fav.id === m.id;
}
function toggleFavoriteMosque(m){
if(isFavoriteMosque(m))state.settings.favoriteMosque = null;
else state.settings.favoriteMosque ={id:m.id,name:m.name,lat:m.lat,lng:m.lng};
saveSettings();
renderMosques();
renderFavMosqueBox();
}
function fmtDist(d){
return d < 1 ? `${Math.round(d*1000)} ${XT('meter')}`:`${d.toFixed(1)} ${t().km}`;
}
function gmapsDirUrl(m){return `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}&travelmode=walking`;}
function renderMosques(){
const list = document.getElementById('mosqueList');
if(state.mosques.length === 0){
list.innerHTML = `<div class="status-msg">${escapeHtml(t().mosquesNone)}</div>`;
}else{
list.innerHTML = state.mosques.slice(0,20).map((m,i)=>
`<div class="mosque-item" data-idx="${i}">
        <div class="mosque-item-row">
          <div class="nm"><span class="num">${i+1}</span><div class="name">${escapeHtml(m.name)}</div></div>
          <div style="display:flex; align-items:center;">
            <button class="star-btn" data-fav-idx="${i}" title="★">${isFavoriteMosque(m) ? '★' : '☆'}</button>
            <div class="dist">${escapeHtml(fmtDist(m.dist))}</div>
            <button class="go-btn" data-go-idx="${i}" type="button" aria-label="Google Maps">🧭</button>
          </div>
        </div>
      </div>`
).join('');
list.querySelectorAll('.mosque-item').forEach(el =>{
el.addEventListener('click',(e)=>{
if(e.target.closest('.star-btn')|| e.target.closest('.go-btn'))return;
openMosqueDetail(state.mosques[Number(el.dataset.idx)]);
});
});
list.querySelectorAll('.star-btn').forEach(btn =>{
btn.addEventListener('click',(e)=>{
e.stopPropagation();
toggleFavoriteMosque(state.mosques[Number(btn.dataset.favIdx)]);
});
});
list.querySelectorAll('.go-btn').forEach(btn =>{
btn.addEventListener('click',(e)=>{
e.stopPropagation();
window.open(gmapsDirUrl(state.mosques[Number(btn.dataset.goIdx)]),'_blank','noopener');
});
});
}
renderMap();
}
function openMosqueDetail(m){
const s = t();
const body = document.getElementById('mosqueDetailBody');
const rows =[];
if(m.phone)rows.push(`<div class="md-detail-row"><b>${escapeHtml(s.detailPhone)}:</b>&nbsp;${escapeHtml(m.phone)}</div>`);
if(m.website)rows.push(`<div class="md-detail-row"><b>${escapeHtml(s.detailWebsite)}:</b>&nbsp;${escapeHtml(m.website)}</div>`);
if(m.hours)rows.push(`<div class="md-detail-row"><b>${escapeHtml(s.detailHours)}:</b>&nbsp;${escapeHtml(m.hours)}</div>`);
if(rows.length === 0)rows.push(`<div class="md-detail-row">${escapeHtml(s.detailNoExtra)}</div>`);
const isFav = m.id && isFavoriteMosque(m);
body.innerHTML = `
    <div class="md-detail-name">${escapeHtml(m.name)}</div>
    ${Number.isFinite(m.dist) ? `<div class="md-detail-dist">${s.detailDistance}: ${escapeHtml(fmtDist(m.dist))}</div>` : ''}
    ${rows.join('')}
    <div class="md-detail-actions">
      <button class="ghost" id="detailFavBtn" type="button">${isFav ? '★' : '☆'} ${escapeHtml(s.favMosqueTitle)}</button>
      <button class="primary" id="detailDirectionsBtn" type="button">🧭 ${escapeHtml(s.detailDirections)}</button>
    </div>
  `;
document.getElementById('detailDirectionsBtn').addEventListener('click',()=>{
window.open(gmapsDirUrl(m),'_blank','noopener');
});
document.getElementById('detailFavBtn').addEventListener('click',()=>{
if(!m.id)return;
toggleFavoriteMosque(m);
openMosqueDetail(m);
});
document.getElementById('mosqueDetailOverlay').classList.add('active');
}
document.getElementById('mosqueDetailOverlay').addEventListener('click',(e)=>{
if(e.target.id === 'mosqueDetailOverlay')e.target.classList.remove('active');
});
function mapTileUrl(){
return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
}
function updateMapTiles(){
if(!state.map)return;
const night = NIGHT_THEME_IDS.has(state.theme);
if(state.tileLayer)state.map.removeLayer(state.tileLayer);
state.tileLayer = L.tileLayer(mapTileUrl(),{maxZoom:19,className:night ? 'map-tiles-dark' : '',attribution:'Tiles &copy; Esri'}).addTo(state.map);
state.tileLayer.bringToBack();
}
let leafletPromise = null;
function loadLeaflet(){
if(typeof L !== 'undefined')return Promise.resolve();
if(leafletPromise)return leafletPromise;
leafletPromise = new Promise((resolve,reject)=>{
const css = document.createElement('link');
css.rel = 'stylesheet';css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';css.crossOrigin = '';
document.head.appendChild(css);
const js = document.createElement('script');
js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
js.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';js.crossOrigin = '';
js.onload =()=> resolve();
js.onerror =()=>{leafletPromise = null;reject(new Error('leaflet'));};
document.head.appendChild(js);
});
return leafletPromise;
}
function renderMap(){
if(!state.coords)return;
if(typeof L === 'undefined'){loadLeaflet().then(renderMap).catch(()=>{});return;}
if(!state.map){
state.map = L.map('map',{zoomControl:true}).setView([state.coords.lat,state.coords.lng],14);
updateMapTiles();
state.mapMarkersLayer = L.layerGroup().addTo(state.map);
}else{
state.map.setView([state.coords.lat,state.coords.lng],14);
state.mapMarkersLayer.clearLayers();
setTimeout(()=> state.map.invalidateSize(),200);
}
L.circleMarker([state.coords.lat,state.coords.lng],{radius:8,color:'#fff',weight:3,fillColor:'#2F80ED',fillOpacity:1})
.addTo(state.mapMarkersLayer).bindPopup(escapeHtml(t().yourLocation));
state.mosques.slice(0,20).forEach((m,i)=>{
const isFav = isFavoriteMosque(m);
const icon = L.divIcon({
className:'mosque-pin mosque-pin-num' +(isFav ? ' mosque-pin-fav':''),
html:String(i + 1),
iconSize:[28,28],iconAnchor:[14,14],
});
L.marker([m.lat,m.lng],{icon})
.addTo(state.mapMarkersLayer)
.bindTooltip(escapeHtml(m.name),{direction:'top',offset:[0,-14],className:'mosque-tooltip'})
.on('click',()=> openMosqueDetail(m));
});
}
function gmapEmbedUrl(){
const{lat,lng}= state.coords;
return `https://www.google.com/maps?q=${encodeURIComponent(`mosque near ${lat},${lng}`)}&z=15&hl=${state.lang}&output=embed`;
}
function refreshGmapFrame(){
const wrap = document.getElementById('gmapWrap');
if(!wrap || wrap.style.display === 'none' || !state.coords)return;
const fr = document.getElementById('gmapFrame'),url = gmapEmbedUrl();
if(fr.dataset.src !== url){fr.dataset.src = url;fr.src = url;}
}
function setMapMode(mode){
document.querySelectorAll('#mapModeRow .map-mode-btn').forEach(b => b.classList.toggle('active',b.dataset.mode === mode));
const g = mode === 'google';
document.getElementById('map').style.display = g ? 'none':'';
document.getElementById('gmapWrap').style.display = g ? '':'none';
if(g){refreshGmapFrame();}
else if(state.map){setTimeout(()=> state.map.invalidateSize(),150);}
}
document.querySelectorAll('#mapModeRow .map-mode-btn').forEach(b => b.addEventListener('click',()=>{
if(b.dataset.mode === 'google' && !state.coords){requestLocation();}
setMapMode(b.dataset.mode);
}));
document.getElementById('openGmapsBtn').addEventListener('click',()=>{
if(!state.coords){requestLocation();return;}
const{lat,lng}= state.coords;
window.open(`https://www.google.com/maps/search/mosque/@${lat},${lng},15z`,'_blank','noopener');
});
document.getElementById('findMosquesBtn').addEventListener('click',()=>{
if(!state.coords){requestLocation();return;}
fetchMosques(true);
});
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
let unlockPromise = null;
let currentPlayingId = null;
function setPlayingUI(id){
currentPlayingId = id;
document.querySelectorAll('#soundList .sound-item').forEach(it =>{
const on = !!id && it.dataset.id === id;
it.classList.toggle('playing',on);
const st = it.querySelector('.stop-btn');
if(st)st.disabled = !on;
});
}
function stopSound(){
const audio = document.getElementById('adhanAudio');
if(!audio)return;
try{audio.pause();audio.currentTime = 0;}catch(e){}
setPlayingUI(null);
}
async function playAdhanUrl(url){
const audio = document.getElementById('adhanAudio');
if(unlockPromise){try{await unlockPromise;}catch(e){}}
const attempt = async()=>{
audio.pause();
audio.muted = false;
audio.preload = 'auto';
if(audio.dataset.warm === url && audio.readyState >= 2){
audio.currentTime = 0;
}else{
audio.dataset.warm = '';
audio.src = url;
audio.load();
}
await audio.play();
};
try{await attempt();return true;}
catch(err1){
console.warn('محاولة التشغيل الأولى فشلت، نعيد المحاولة:',err1);
await new Promise(r => setTimeout(r,400));
try{await attempt();return true;}
catch(err2){console.warn('تعذر التشغيل:',err2);return false;}
}
}
const SOUND_GROUPS =[
{k:'gHaram',ids:['makkah','madina']},
{k:'gMuadhin',ids:['mishari','qatami','abdulbasit','islamsobhi','salman','halab','egypt']},
{k:'gFajr',ids:['fajrmishari']},
{k:'gAlert',ids:['beep']},
];
function updateSoundCurrentName(){
const el = document.getElementById('soundCurrentName');
if(el)el.textContent = t().soundNames[state.selectedSound]|| state.selectedSound;
}
function renderSounds(){
const list = document.getElementById('soundList');
const names = t().soundNames;
const item =(id)=>{const s = ADHAN_SOUNDS.find(x => x.id === id);if(!s)return '';
return `
    <div class="sound-item${id===state.selectedSound?' selected':''}" data-id="${escapeHtml(id)}">
      <label class="info">
        <input type="radio" name="adhanSound" value="${escapeHtml(id)}" ${id===state.selectedSound?'checked':''}>
        <span>${escapeHtml(names[id] || id)}</span>
      </label>
      <div class="sound-actions">
        <button class="play-btn" data-id="${escapeHtml(id)}" title="${escapeHtml(t().soundTry)}" type="button">▶</button>
        <button class="play-btn stop-btn" data-id="${escapeHtml(id)}" title="${escapeHtml(t().soundStop || 'Stop')}" type="button" disabled>⏹</button>
      </div>
    </div>`;};
list.innerHTML = SOUND_GROUPS.map(g => `<div class="sound-group-title">${escapeHtml(XT(g.k))}</div>${g.ids.map(item).join('')}`).join('');
list.querySelectorAll('input[name=adhanSound]').forEach(r =>{
r.addEventListener('change',(e)=>{
state.selectedSound = e.target.value;
state.settings.selectedSound = e.target.value;
saveSettings();
list.querySelectorAll('.sound-item').forEach(it => it.classList.toggle('selected',it.dataset.id === e.target.value));
updateSoundCurrentName();
flashSaved(document.getElementById('soundCurrentName').parentElement);
});
});
list.querySelectorAll('.play-btn:not(.stop-btn)').forEach(b =>{
b.addEventListener('click',async()=>{
const sound = ADHAN_SOUNDS.find(s => s.id === b.dataset.id);
if(!sound)return;
setPlayingUI(sound.id);
const ok = await playAdhanUrl(sound.url);
if(!ok){setPlayingUI(null);alert(t().soundPlayError);}
});
});
list.querySelectorAll('.stop-btn').forEach(b => b.addEventListener('click',stopSound));
const au = document.getElementById('adhanAudio');
if(au && !au.dataset.uiBound){
au.dataset.uiBound = '1';
['ended','pause','error'].forEach(ev => au.addEventListener(ev,()=>{if(au.src !== SILENT_WAV)setPlayingUI(null);}));
}
updateSoundCurrentName();
const a = document.getElementById('txtChooseSound');if(a)a.textContent = XT('chooseSound');
const b2 = document.getElementById('txtSoundDone');if(b2)b2.textContent = XT('done');
const c = document.getElementById('txtSoundSheetTitle');if(c)c.textContent = t().soundTitle;
}
function closeSoundSheet(){stopSound();document.getElementById('soundOverlay').classList.remove('active');}
document.getElementById('openSoundBtn').addEventListener('click',()=> document.getElementById('soundOverlay').classList.add('active'));
document.getElementById('soundDoneBtn').addEventListener('click',closeSoundSheet);
document.getElementById('soundOverlay').addEventListener('click',(e)=>{if(e.target.id === 'soundOverlay')closeSoundSheet();});
let audioUnlocked = false;
function unlockAudio(){
if(audioUnlocked || unlockPromise)return;
const au = document.getElementById('adhanAudio');
if(!au)return;
au.muted = true;
au.src = SILENT_WAV;
const finish =()=>{try{au.pause();}catch(e){}au.muted = false;audioUnlocked = true;};
let pr;
try{pr = au.play();}catch(e){pr = null;}
if(pr && pr.then){
unlockPromise = pr.then(finish).catch(()=>{au.muted = false;}).finally(()=>{unlockPromise = null;});
}else{finish();}
}
['pointerdown','touchstart','click','keydown'].forEach(ev => document.addEventListener(ev,unlockAudio,{passive:true}));
function prewarmAdhan(){
const au = document.getElementById('adhanAudio');
if(!au || !audioUnlocked || !au.paused)return;
const sound = ADHAN_SOUNDS.find(x => x.id === state.selectedSound)|| ADHAN_SOUNDS[0];
if(au.dataset.warm === sound.url)return;
au.dataset.warm = sound.url;au.muted = false;au.preload = 'auto';au.src = sound.url;au.load();
}
function hideAdhanBar(){const b = document.getElementById('adhanBar');if(b)b.style.display = 'none';}
function stopAdhanNow(){state.adhanScheduled = null;stopSound();hideAdhanBar();}
(function(){
const au = document.getElementById('adhanAudio'),bar = document.getElementById('adhanBar');
if(!au || !bar)return;
au.addEventListener('playing',()=>{
if(!state.adhanScheduled)return;
document.getElementById('adhanBarText').textContent = t().adhanTitle(t().prayerNames[state.adhanScheduled]);
document.getElementById('adhanBarStopTxt').textContent = t().soundStop || 'Stop';
bar.style.display = 'flex';
});
['pause','ended','error'].forEach(ev => au.addEventListener(ev,()=>{bar.style.display = 'none';if(ev !== 'pause')state.adhanScheduled = null;}));
document.getElementById('adhanBarStop').addEventListener('click',stopAdhanNow);
if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',(e)=>{if(e.data && e.data.type === 'stop-adhan')stopAdhanNow();});
})();
function playSelectedSound(){
const sound = ADHAN_SOUNDS.find(s => s.id === state.selectedSound)|| ADHAN_SOUNDS[0];
playAdhanUrl(sound.url).then(ok =>{if(!ok)console.warn('تعذر تشغيل الأذان تلقائيًا');});
}
function renderCalcMethodOptions(){
const sel = document.getElementById('calcMethodSelect');
const names = t().methodNames;
sel.innerHTML = CALC_METHODS.map(m => `<option value="${m.id}">${escapeHtml(names[m.key] || m.key)}</option>`).join('');
sel.value = String(state.settings.method);
}
document.getElementById('calcMethodSelect').addEventListener('change',(e)=>{
state.settings.method = e.target.value === 'auto' ? 'auto':Number(e.target.value);
saveSettings();
if(state.coords)fetchPrayerTimes();
});
document.getElementById('asrSelect').addEventListener('change',(e)=>{
state.settings.school = Number(e.target.value);
saveSettings();
if(state.coords)fetchPrayerTimes();
});
function initAsrSelect(){document.getElementById('asrSelect').value = String(state.settings.school);}
function renderTuneRows(){
const box = document.getElementById('tuneRows');
const names = t().prayerNames;
box.innerHTML = PRAYER_ORDER.map(k => `
    <div class="tune-row">
      <div class="tune-name">${escapeHtml(names[k])}</div>
      <div class="tune-controls">
        <button class="tune-btn" data-k="${k}" data-d="-1">−</button>
        <div class="tune-val" id="tuneVal-${k}">${state.settings.tune[k] > 0 ? '+' : ''}${state.settings.tune[k]}</div>
        <button class="tune-btn" data-k="${k}" data-d="1">+</button>
      </div>
    </div>
  `).join('');
box.querySelectorAll('.tune-btn').forEach(btn =>{
btn.addEventListener('click',()=>{
const k = btn.dataset.k,d = Number(btn.dataset.d);
state.settings.tune[k]= Math.max(-30,Math.min(30,(state.settings.tune[k]||0)+ d));
saveSettings();
document.getElementById(`tuneVal-${k}`).textContent =(state.settings.tune[k]> 0 ? '+':'')+ state.settings.tune[k];
if(state.coords)fetchPrayerTimes();
});
});
}
function renderPerPrayerNotifRows(){
const box = document.getElementById('perPrayerNotifRows');
const names = t().prayerNames,s = t();
box.innerHTML = PRAYER_ORDER.map(k =>{
const cfg = state.settings.notifPerPrayer[k];
return `
    <div class="notif-prayer-row">
      <div class="npr-name">${escapeHtml(names[k])}</div>
      <div class="npr-toggles">
        <label class="npr-toggle"><input type="checkbox" data-k="${k}" data-f="notify" ${cfg.notify?'checked':''}> 🔔 ${escapeHtml(s.notifyLabel)}</label>
        <label class="npr-toggle"><input type="checkbox" data-k="${k}" data-f="adhan" ${cfg.adhan?'checked':''}> 🔊 ${escapeHtml(s.adhanLabel)}</label>
        <label class="npr-toggle"><input type="checkbox" data-k="${k}" data-f="reminder" ${cfg.reminder?'checked':''}> ⏰ ${escapeHtml(s.reminderLabel)}</label>
      </div>
    </div>`;
}).join('');
box.querySelectorAll('input[type=checkbox]').forEach(cb =>{
cb.addEventListener('change',(e)=>{
state.settings.notifPerPrayer[e.target.dataset.k][e.target.dataset.f]= e.target.checked;
saveSettings();
scheduleNotifications();
});
});
}
function renderReminderSelect(){
document.getElementById('reminderMinutesSelect').value = String(state.settings.reminderMinutes || 0);
}
document.getElementById('reminderMinutesSelect').addEventListener('change',(e)=>{
state.settings.reminderMinutes = Number(e.target.value);
saveSettings();
scheduleNotifications();
});
function loadMuslimDayStore(){
try{
const raw = localStorage.getItem('salati_muslimday');
return raw ? JSON.parse(raw):{};
}catch(e){console.error(e);return{};}
}
function saveMuslimDayStore(store){
localStorage.setItem('salati_muslimday',JSON.stringify(store));
if(typeof scheduleCloudSave === 'function')scheduleCloudSave();
}
function emptyDayData(){
return{
prayers:Object.fromEntries(PRAYER_ORDER.map(k =>[k,{prayed:false,jamaah:false,mosque:false}])),
quran:{read:false,memorized:false,reviewed:false,pages:null,ayahs:null,minutes:null},
azkar:{morning:false,evening:false,after:false},
night:{qiyam:false,witr:false},
nawafil:{fajr:false,dhuhrBefore:false,dhuhrAfter:false,maghrib:false,isha:false,duha:false},
custom:[false,false,false],
parents:false,
learning:false,
charity:{sadaqah:false,helped:false,silaRahim:false,other:false},
fasting:{fasted:null},
friday:{kahf:false,salawat:false,dua:false,early:false,ghusl:false},
};
}
function getDayData(date){
const store = loadMuslimDayStore();
const key = dateKey(date);
const existing = store[key];
if(!existing)return emptyDayData();
const def = emptyDayData();
return{
prayers:Object.fromEntries(PRAYER_ORDER.map(k =>[k,{...def.prayers[k],...(existing.prayers?.[k]||{})}])),
quran:{...def.quran,...(existing.quran||{})},
azkar:{...def.azkar,...(existing.azkar||{})},
night:{...def.night,...(existing.night||{})},
nawafil:{...def.nawafil,...(existing.nawafil||{})},
custom:[0,1,2].map(i => !!(existing.custom && existing.custom[i])),
parents:existing.parents ?? false,
learning:existing.learning ?? false,
charity:{...def.charity,...(existing.charity||{})},
fasting:{...def.fasting,...(existing.fasting||{})},
friday:{...def.friday,...(existing.friday||{})},
};
}
function setDayData(date,data){
const store = loadMuslimDayStore();
store[dateKey(date)]= data;
saveMuslimDayStore(store);
}
function updateDayField(date,mutator){
const data = getDayData(date);
mutator(data);
setDayData(date,data);
renderMuslimDay();
}
function isFastingRecommendedDay(date){
const wd = date.getDay();
if(wd === 1)return 'monday';
if(wd === 4)return 'thursday';
const hijriDay = getHijriInfo(date).day;
if(hijriDay && hijriDay >= 13 && hijriDay <= 15)return 'white';
return null;
}
function isFriday(date){return date.getDay()=== 5;}
function computeApplicableTasks(date,data){
const tr = state.settings.trackedItems;
const tasks =[];
if(tr.trackPrayers){
PRAYER_ORDER.forEach(k => tasks.push(data.prayers[k].prayed));
}
if(tr.rawatib)tasks.push(data.nawafil.fajr,data.nawafil.dhuhrBefore,data.nawafil.dhuhrAfter,data.nawafil.maghrib,data.nawafil.isha);
if(tr.duha)tasks.push(data.nawafil.duha);
if(tr.quran)tasks.push(data.quran.read);
if(tr.quranMemorize)tasks.push(data.quran.memorized);
if(tr.quranReview)tasks.push(data.quran.reviewed);
if(tr.azkarMorning)tasks.push(data.azkar.morning);
if(tr.azkarEvening)tasks.push(data.azkar.evening);
if(tr.azkarAfter)tasks.push(data.azkar.after);
if(tr.qiyam)tasks.push(data.night.qiyam);
if(tr.witr)tasks.push(data.night.witr);
if(tr.parents)tasks.push(data.parents);
if(tr.learning)tasks.push(data.learning);
if(tr.sadaqah)tasks.push(data.charity.sadaqah);
if(tr.goodDeeds)tasks.push(data.charity.helped || data.charity.silaRahim || data.charity.other);
if(tr.fasting && isFastingRecommendedDay(date))tasks.push(data.fasting.fasted === true);
state.settings.customTasks.forEach((name,i)=>{if(name)tasks.push(data.custom[i]);});
if(isFriday(date))tasks.push(data.friday.kahf,data.friday.salawat,data.friday.dua,data.friday.early,data.friday.ghusl);
const total = tasks.length;
const done = tasks.filter(Boolean).length;
return{total,done};
}
function taskRow(label,checked,onToggle){
return{label,checked,onToggle};
}
function renderTaskList(containerId,rows){
const box = document.getElementById(containerId);
box.innerHTML = rows.map((r,i)=> `
    <div class="task-row">
      <div class="task-label">${escapeHtml(r.label)}</div>
      <button class="task-check ${r.checked?'checked':''}" data-i="${i}">✓</button>
    </div>
  `).join('');
box.querySelectorAll('.task-check').forEach(btn =>{
btn.addEventListener('click',()=> rows[Number(btn.dataset.i)].onToggle());
});
}
function renderMuslimDay(){
const s = t();
const date = state.mdViewDate;
const data = getDayData(date);
const tr = state.settings.trackedItems;
document.getElementById('mdWeekday').textContent = new Intl.DateTimeFormat(localeForLang(),{weekday:'long'}).format(date);
document.getElementById('mdGregorian').textContent = new Intl.DateTimeFormat(localeForLang(),{day:'numeric',month:'long',year:'numeric'}).format(date);
document.getElementById('mdHijri').textContent = getHijriInfo(date).text;
const{total,done}= computeApplicableTasks(date,data);
document.getElementById('mdProgressText').textContent = s.mdProgressText(done,total);
document.getElementById('mdProgressFill').style.width = total ? `${Math.round(done/total*100)}%`:'0%';
document.getElementById('mdHomeProgress').textContent = s.mdHomeProgress(done,total);
document.getElementById('mdHomeProgressFill').style.width = total ? `${Math.round(done/total*100)}%`:'0%';
document.getElementById('secPrayers').style.display = tr.trackPrayers ? '':'none';
if(tr.trackPrayers){
const namesP = s.prayerNames;
const box = document.getElementById('prayerRows');
box.innerHTML = PRAYER_ORDER.map(k =>{
const p = data.prayers[k];
const timeStr =(isSameDay(date,new Date())&& state.timings)? state.timings[k]:'';
return `
      <div class="prayer-row" data-k="${k}">
        <div class="prayer-row-top">
          <div class="pname">${escapeHtml(namesP[k])}</div>
          <div class="ptime">${escapeHtml(timeStr)}</div>
        </div>
        <div class="prayer-pill-row">
          <button class="prayer-pill ${p.prayed?'active':''}" data-f="prayed">${escapeHtml(s.prayed)}</button>
          ${tr.jamaah ? `<button class="prayer-pill ${p.jamaah?'active':''}" data-f="jamaah">${escapeHtml(s.jamaah)}</button>` : ''}
          ${tr.mosque ? `<button class="prayer-pill ${p.mosque?'active':''}" data-f="mosque">${escapeHtml(s.atMosque)}</button>` : ''}
        </div>
        ${p.mosque ? `<div class="prayer-mash">${escapeHtml(s.mashallah)}</div>` : ''}
      </div>`;
}).join('');
box.querySelectorAll('.prayer-pill').forEach(btn =>{
btn.addEventListener('click',()=>{
const row = btn.closest('.prayer-row');
const k = row.dataset.k,f = btn.dataset.f;
updateDayField(date,(d)=>{
d.prayers[k][f]= !d.prayers[k][f];
if(f === 'mosque' && d.prayers[k].mosque)d.prayers[k].jamaah = true;
if(f === 'mosque' && !d.prayers[k].mosque){}
if((f === 'jamaah' || f === 'mosque')&&(d.prayers[k].jamaah || d.prayers[k].mosque))d.prayers[k].prayed = true;
});
});
});
}
document.getElementById('secNawafil').style.display =(tr.rawatib||tr.duha)? '':'none';
{
const rows =[];
const nf =(key,label)=> rows.push(taskRow(label,data.nawafil[key],()=> updateDayField(date,d => d.nawafil[key]= !d.nawafil[key])));
if(tr.rawatib){
nf('fajr',s.nawafilFajr);nf('dhuhrBefore',s.nawafilDhuhrBefore);nf('dhuhrAfter',s.nawafilDhuhrAfter);
nf('maghrib',s.nawafilMaghrib);nf('isha',s.nawafilIsha);
}
if(tr.duha)nf('duha',s.nawafilDuha);
renderTaskList('nawafilRows',rows);
}
document.getElementById('secQuran').style.display =(tr.quran||tr.quranMemorize||tr.quranReview)? '':'none';
{
const rows =[];
if(tr.quran)rows.push(taskRow(s.quranRead,data.quran.read,()=> updateDayField(date,d => d.quran.read = !d.quran.read)));
if(tr.quranMemorize)rows.push(taskRow(s.quranMemorized,data.quran.memorized,()=> updateDayField(date,d => d.quran.memorized = !d.quran.memorized)));
if(tr.quranReview)rows.push(taskRow(s.quranReviewed,data.quran.reviewed,()=> updateDayField(date,d => d.quran.reviewed = !d.quran.reviewed)));
renderTaskList('quranRows',rows);
}
document.getElementById('secAzkar').style.display =(tr.azkarMorning||tr.azkarEvening||tr.azkarAfter)? '':'none';
{
const rows =[];
if(tr.azkarMorning)rows.push(taskRow(s.azkarMorning,data.azkar.morning,()=> updateDayField(date,d => d.azkar.morning = !d.azkar.morning)));
if(tr.azkarEvening)rows.push(taskRow(s.azkarEvening,data.azkar.evening,()=> updateDayField(date,d => d.azkar.evening = !d.azkar.evening)));
if(tr.azkarAfter)rows.push(taskRow(s.azkarAfter,data.azkar.after,()=> updateDayField(date,d => d.azkar.after = !d.azkar.after)));
renderTaskList('azkarRows',rows);
}
document.getElementById('secNight').style.display =(tr.qiyam||tr.witr)? '':'none';
{
const rows =[];
if(tr.qiyam)rows.push(taskRow(s.qiyam,data.night.qiyam,()=> updateDayField(date,d => d.night.qiyam = !d.night.qiyam)));
if(tr.witr)rows.push(taskRow(s.witr,data.night.witr,()=> updateDayField(date,d => d.night.witr = !d.night.witr)));
renderTaskList('nightRows',rows);
}
document.getElementById('secParents').style.display = tr.parents ? '':'none';
if(tr.parents)renderTaskList('parentsRows',[taskRow(s.parentsDone,data.parents,()=> updateDayField(date,d => d.parents = !d.parents))]);
document.getElementById('secLearning').style.display = tr.learning ? '':'none';
if(tr.learning)renderTaskList('learningRows',[taskRow(s.learningDone,data.learning,()=> updateDayField(date,d => d.learning = !d.learning))]);
document.getElementById('secCharity').style.display =(tr.sadaqah||tr.goodDeeds)? '':'none';
{
const rows =[];
if(tr.sadaqah)rows.push(taskRow(s.charitySadaqah,data.charity.sadaqah,()=> updateDayField(date,d => d.charity.sadaqah = !d.charity.sadaqah)));
if(tr.goodDeeds){
rows.push(taskRow(s.charityHelped,data.charity.helped,()=> updateDayField(date,d => d.charity.helped = !d.charity.helped)));
rows.push(taskRow(s.charitySilaRahim,data.charity.silaRahim,()=> updateDayField(date,d => d.charity.silaRahim = !d.charity.silaRahim)));
rows.push(taskRow(s.charityOther,data.charity.other,()=> updateDayField(date,d => d.charity.other = !d.charity.other)));
}
renderTaskList('charityRows',rows);
}
{
const rows =[];
state.settings.customTasks.forEach((name,i)=>{
if(name)rows.push(taskRow(name,data.custom[i],()=> updateDayField(date,d => d.custom[i]= !d.custom[i])));
});
document.getElementById('secCustom').style.display = rows.length ? '':'none';
renderTaskList('customRows',rows);
}
const fastReason = tr.fasting ? isFastingRecommendedDay(date):null;
document.getElementById('secFasting').style.display = fastReason ? '':'none';
if(fastReason){
const reasonText ={monday:s.fastingReasonMonday,thursday:s.fastingReasonThursday,white:s.fastingReasonWhite}[fastReason];
document.getElementById('fastingReason').textContent = reasonText;
const box = document.getElementById('fastingRows');
box.innerHTML = `
      <div class="task-row">
        <div class="task-label">${escapeHtml(s.fastingQuestion)}</div>
        <div class="prayer-pill-row" style="max-width:160px;">
          <button class="prayer-pill ${data.fasting.fasted===true?'active':''}" id="fastYesBtn">${escapeHtml(s.fastingYes)}</button>
          <button class="prayer-pill ${data.fasting.fasted===false?'active':''}" id="fastNoBtn">${escapeHtml(s.fastingNo)}</button>
        </div>
      </div>`;
document.getElementById('fastYesBtn').addEventListener('click',()=> updateDayField(date,d => d.fasting.fasted = d.fasting.fasted===true ? null:true));
document.getElementById('fastNoBtn').addEventListener('click',()=> updateDayField(date,d => d.fasting.fasted = d.fasting.fasted===false ? null:false));
}
document.getElementById('secFriday').style.display = isFriday(date)? '':'none';
if(isFriday(date)){
const rows =[
taskRow(s.fridayGhusl,data.friday.ghusl,()=> updateDayField(date,d => d.friday.ghusl = !d.friday.ghusl)),
taskRow(s.fridayEarly,data.friday.early,()=> updateDayField(date,d => d.friday.early = !d.friday.early)),
taskRow(s.fridayKahf,data.friday.kahf,()=> updateDayField(date,d => d.friday.kahf = !d.friday.kahf)),
taskRow(s.fridaySalawat,data.friday.salawat,()=> updateDayField(date,d => d.friday.salawat = !d.friday.salawat)),
taskRow(s.fridayDua,data.friday.dua,()=> updateDayField(date,d => d.friday.dua = !d.friday.dua)),
];
renderTaskList('fridayRows',rows);
}
if(state.mdMonthOpen)renderMonthly();
}
document.getElementById('mdPrevDay').addEventListener('click',()=>{
state.mdViewDate = new Date(state.mdViewDate.getTime()- 86400000);
renderMuslimDay();
});
document.getElementById('mdNextDay').addEventListener('click',()=>{
const next = new Date(state.mdViewDate.getTime()+ 86400000);
if(next <= new Date()){state.mdViewDate = next;renderMuslimDay();}
});
document.getElementById('mdTodayBtn').addEventListener('click',()=>{
state.mdViewDate = new Date();
renderMuslimDay();
});
document.getElementById('mdMonthToggleBtn').addEventListener('click',()=>{
state.mdMonthOpen = !state.mdMonthOpen;
if(state.mdMonthOpen)state.mdMonthOffset = 0;
document.getElementById('mdMonthlyBox').style.display = state.mdMonthOpen ? '':'none';
document.getElementById('txtMdMonthBtn').textContent = state.mdMonthOpen ? t().mdMonthHide:t().mdMonthShow;
if(state.mdMonthOpen)renderMonthly();
});
document.getElementById('openMuslimDayBtn').addEventListener('click',()=> switchView('muslimday'));
function renderMonthly(){
const s = t();
const today = new Date();
today.setHours(0,0,0,0);
const off = state.mdMonthOffset || 0;
const first = new Date(today.getFullYear(),today.getMonth()+ off,1);
const daysInMonth = new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
document.getElementById('txtMonthTitle').textContent =
new Intl.DateTimeFormat(localeForLang(),{month:'long',year:'numeric'}).format(first);
const nextBtn = document.getElementById('mdNextMonth');
if(nextBtn)nextBtn.disabled = off >= 0;
const lead =(first.getDay()+ 1)% 7;
const wdFmt = new Intl.DateTimeFormat(localeForLang(),{weekday:'narrow'});
const headCells =[];
for(let i=0;i<7;i++){
headCells.push(`<div class="month-head">${escapeHtml(wdFmt.format(new Date(2023,0,7+i)))}</div>`);
}
const cells =[];
for(let i=0;i<lead;i++)cells.push('<div class="month-day is-empty"></div>');
let elapsed = 0;
let statPrayed=0,statJamaah=0,statMosque=0,statQuran=0,statMorning=0,statEvening=0,statQiyam=0,statWitr=0,statFasting=0;
for(let n=1;n<=daysInMonth;n++){
const d = new Date(first.getFullYear(),first.getMonth(),n);
const isToday = d.getTime()=== today.getTime();
const isFuture = d > today;
let mark = '';
if(!isFuture){
elapsed++;
const data = getDayData(d);
const{total,done}= computeApplicableTasks(d,data);
mark = total>0 ?(done===total ? '✅':(done>0 ? '⚠️':'▫️')):'';
PRAYER_ORDER.forEach(k =>{
if(data.prayers[k].prayed)statPrayed++;
if(data.prayers[k].jamaah)statJamaah++;
if(data.prayers[k].mosque)statMosque++;
});
if(data.quran.read)statQuran++;
if(data.azkar.morning)statMorning++;
if(data.azkar.evening)statEvening++;
if(data.night.qiyam)statQiyam++;
if(data.night.witr)statWitr++;
if(data.fasting.fasted === true)statFasting++;
}
cells.push(`<div class="month-day ${isToday?'is-today':''} ${isFuture?'is-future':''}" data-date="${dateKey(d)}">
      <div class="md-dn">${n}</div>
      <div class="md-mk">${mark}</div>
    </div>`);
}
document.getElementById('monthGrid').innerHTML = headCells.join('')+ cells.join('');
document.querySelectorAll('#monthGrid .month-day[data-date]').forEach(el =>{
if(el.classList.contains('is-future'))return;
el.addEventListener('click',()=>{
const[y,m,dd]= el.dataset.date.split('-').map(Number);
state.mdViewDate = new Date(y,m-1,dd);
renderMuslimDay();
document.querySelector('main').scrollTop = 0;
});
});
const stats = document.getElementById('monthStats');
stats.innerHTML = `
    <div class="month-stat"><span>${escapeHtml(s.monthStatPrayed)}</span><b>${statPrayed}/${elapsed*5}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatJamaah)}</span><b>${statJamaah}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatMosque)}</span><b>${statMosque}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatQuran)}</span><b>${statQuran}/${elapsed}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatMorningAzkar)}</span><b>${statMorning}/${elapsed}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatEveningAzkar)}</span><b>${statEvening}/${elapsed}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatQiyam)}</span><b>${statQiyam}/${elapsed}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatWitr)}</span><b>${statWitr}/${elapsed}</b></div>
    <div class="month-stat"><span>${escapeHtml(s.monthStatFasting)}</span><b>${statFasting}</b></div>
  `;
}
document.getElementById('mdPrevMonth').addEventListener('click',()=>{state.mdMonthOffset =(state.mdMonthOffset||0)- 1;renderMonthly();});
document.getElementById('mdNextMonth').addEventListener('click',()=>{
if((state.mdMonthOffset||0)< 0){state.mdMonthOffset++;renderMonthly();}
});
function renderCustomizeList(){
const s = t();
const box = document.getElementById('customizeList');
box.innerHTML = TRACK_TOGGLES.map(item => `
    <label class="customize-item">
      <span>${escapeHtml(s[item.label])}</span>
      <input type="checkbox" data-key="${item.key}" ${state.settings.trackedItems[item.key] ? 'checked' : ''}>
    </label>
  `).join('')+ `
    <div class="custom-tasks-box">
      <div class="custom-tasks-title">${escapeHtml(s.customHeading)}</div>
      <div class="custom-tasks-hint">${escapeHtml(s.customHint)}</div>
      ${[0,1,2].map(i => `<input type="text" class="custom-task-input" data-custom="${i}" maxlength="60" placeholder="${escapeHtml(s.customPlaceholder(i+1))}">`).join('')}
    </div>`;
box.querySelectorAll('.custom-task-input').forEach(inp =>{
inp.value = state.settings.customTasks[Number(inp.dataset.custom)]|| '';
});
}
function openCustomize(){
renderCustomizeList();
document.getElementById('customizeOverlay').classList.add('active');
}
document.getElementById('mdCustomizeBtn').addEventListener('click',openCustomize);
document.getElementById('editTrackedBtn').addEventListener('click',openCustomize);
document.getElementById('customizeOverlay').addEventListener('click',(e)=>{
if(e.target.id === 'customizeOverlay')e.target.classList.remove('active');
});
document.getElementById('customizeSaveBtn').addEventListener('click',()=>{
document.querySelectorAll('#customizeList input[type=checkbox]').forEach(cb =>{
state.settings.trackedItems[cb.dataset.key]= cb.checked;
});
state.settings.customTasks = normalizeCustomTasks(
[...document.querySelectorAll('#customizeList .custom-task-input')].map(inp => inp.value)
);
saveSettings();
document.getElementById('customizeOverlay').classList.remove('active');
renderMuslimDay();
});
async function confirmSensitiveAction(msg){
if(!confirm(msg))return false;
const u = state.currentUser;
if(u && !u.isAnonymous && window.SalatiAuth){
reauthVerifiedAt = 0;
return await ensureVerified(XT('reauthDanger'));
}
return true;
}
document.getElementById('resetTodayBtn').addEventListener('click',async()=>{
if(!(await confirmSensitiveAction(t().confirmResetToday)))return;
const store = loadMuslimDayStore();
delete store[dateKey(new Date())];
saveMuslimDayStore(store);
renderMuslimDay();
});
document.getElementById('clearHistoryBtn').addEventListener('click',async()=>{
if(!(await confirmSensitiveAction(t().confirmClearHistory)))return;
localStorage.removeItem('salati_muslimday');
renderMuslimDay();
});
const tabbarEl = document.querySelector('nav.tabbar');
const tabIndicatorEl = tabbarEl.querySelector('.tab-indicator');
let currentViewName = 'home';
function positionTabIndicator(animate){
const btn = tabbarEl.querySelector('button.active');
if(!btn || !tabIndicatorEl)return;
if(animate === false)tabIndicatorEl.classList.add('no-anim');
tabIndicatorEl.style.width = btn.offsetWidth + 'px';
tabIndicatorEl.style.height = btn.offsetHeight + 'px';
tabIndicatorEl.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
tabIndicatorEl.classList.add('ready');
if(animate === false){
void tabIndicatorEl.offsetWidth;
tabIndicatorEl.classList.remove('no-anim');
}
}
function viewAllowed(viewName){
if(!PROTECTED_VIEWS.has(viewName))return true;
return !!state.currentUser || localStorage.getItem(GATE_DISMISSED_KEY)=== '1';
}
function switchView(viewName,opts){
if(!document.getElementById('view-' + viewName))viewName = 'home';
if(!viewAllowed(viewName)){
pendingViewAfterLogin = viewName;
openGateForm('login');
return;
}
const prevBtn = tabbarEl.querySelector('button.active');
const navBtn = document.querySelector(`nav.tabbar button[data-view="${viewName}"]`);
const sameView =(viewName === currentViewName)&& document.getElementById('view-' + viewName)?.classList.contains('active');
let dir = 0;
if(prevBtn && navBtn && prevBtn !== navBtn){
dir = navBtn.offsetLeft > prevBtn.offsetLeft ? 1:-1;
}
tabbarEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
if(navBtn){
navBtn.classList.add('active');
const ic = navBtn.querySelector('svg');
if(ic && !sameView){ic.classList.remove('tab-pop');void ic.getBoundingClientRect();ic.classList.add('tab-pop');}
}
const view = document.getElementById('view-' + viewName);
if(view){
view.style.setProperty('--enter-x',(dir * 28)+ 'px');
view.classList.add('active');
}
currentViewName = viewName;
positionTabIndicator(true);
document.querySelector('main').scrollTop = 0;
if(viewName === 'map' && state.map){
setTimeout(()=> state.map.invalidateSize(),150);
}
if(viewName === 'muslimday')renderMuslimDay();
if(viewName === 'azkar')renderAzkar();
if(!(opts && opts.fromHistory)&& location.hash !== '#' + viewName){
try{history.pushState({view:viewName},'','#' + viewName);}catch(e){}
}
}
window.addEventListener('popstate',()=>{
const v =(location.hash || '').slice(1);
if(v && v !== currentViewName)switchView(v,{fromHistory:true});
});
tabbarEl.querySelectorAll('button').forEach(btn =>{
btn.addEventListener('click',()=> switchView(btn.dataset.view));
});
window.addEventListener('resize',()=> positionTabIndicator(false));
if(document.fonts && document.fonts.ready)document.fonts.ready.then(()=> positionTabIndicator(false));
const AZKAR_CATS =[
{id:'morning',icon:'🌅',key:'azMorning'},
{id:'evening',icon:'🌙',key:'azEvening'},
{id:'afterPrayer',icon:'🕌',key:'azAfterPrayer'},
{id:'sleep',icon:'🛏️',key:'azSleep'},
{id:'wake',icon:'☀️',key:'azWake'},
];
const AZKAR_STORE_KEY = 'azkarProgress_v1';
let azkarCat = null;
let azkarProgress ={date:'',c:{}};
try{
const raw = JSON.parse(localStorage.getItem(AZKAR_STORE_KEY)|| 'null');
if(raw && raw.c)azkarProgress = raw;
}catch(e){}
function azkarEnsureToday(){
const today = dateKey(new Date());
if(azkarProgress.date !== today)azkarProgress ={date:today,c:{}};
}
function saveAzkarProgress(){
try{localStorage.setItem(AZKAR_STORE_KEY,JSON.stringify(azkarProgress));}catch(e){}
}
function azkarCount(cat,i){return azkarProgress.c[cat + ':' + i]|| 0;}
function azkarCardHtml(it,i,cat,s){
const n = azkarCount(cat,i),total = it.count,done = n >= total;
const pct = Math.min(100,Math.round(n / total * 100));
return `<div class="az-card ${done ? 'is-done' : ''} ${it.reading ? 'is-reading' : ''}" data-i="${i}">
    ${it.note ? `<div class="az-note-wrap"><span class="az-note">${escapeHtml(it.note)}</span></div>` : ''}
    <div class="az-text" dir="rtl" lang="ar">${escapeHtml(it.text)}</div>
    <div class="az-foot">
      <div class="az-src"><span aria-hidden="true">📖</span><span><b>${escapeHtml(s.azSource)}:</b> <span dir="rtl" lang="ar">${escapeHtml(it.source)}</span></span></div>
      <div class="az-counter">
        <button type="button" class="az-reset" title="${escapeHtml(s.azReset)}" aria-label="${escapeHtml(s.azReset)}">↺</button>
        <button type="button" class="az-tap" style="--p:${pct}" title="${escapeHtml(s.azTap)}" aria-label="${escapeHtml(s.azTap)}">
          <span class="az-num">${done && total === 1 ? '✓' : n}</span><span class="az-of">/ ${total}</span>
        </button>
      </div>
    </div>
  </div>`;
}
function renderAzkarProgress(items){
const s = t();
let done = 0;
items.forEach((it,i)=>{if(azkarCount(azkarCat,i)>= it.count)done++;});
document.getElementById('azkarProgressText').textContent = s.azProgress(done,items.length);
document.getElementById('azkarProgressFill').style.width =(items.length ? Math.round(done / items.length * 100):0)+ '%';
}
function renderAzkar(){
const listEl = document.getElementById('azkarList');
if(!listEl)return;
const s = t();
azkarEnsureToday();
if(!azkarCat)azkarCat =(new Date().getHours()< 12)? 'morning':'evening';
document.getElementById('azkarCats').innerHTML = AZKAR_CATS.map(c =>
`<button type="button" class="az-cat ${c.id === azkarCat ? 'is-active' : ''}" role="tab" aria-selected="${c.id === azkarCat}" data-cat="${c.id}"><span aria-hidden="true">${c.icon}</span><span>${escapeHtml(s[c.key])}</span></button>`
).join('');
const items = getAzkarItems(azkarCat);
listEl.innerHTML = items.map((it,i)=> azkarCardHtml(it,i,azkarCat,s)).join('');
document.getElementById('azkarFootnote').textContent = s.azFootnote;
renderAzkarProgress(items);
}
document.getElementById('azkarCats').addEventListener('click',(e)=>{
const btn = e.target.closest('.az-cat');
if(!btn || btn.dataset.cat === azkarCat)return;
azkarCat = btn.dataset.cat;
renderAzkar();
document.querySelector('main').scrollTop = 0;
const active = document.querySelector('#azkarCats .az-cat.is-active');
if(active && active.scrollIntoView)active.scrollIntoView({inline:'center',block:'nearest'});
});
document.getElementById('azkarList').addEventListener('click',(e)=>{
const card = e.target.closest('.az-card');
if(!card)return;
const i = Number(card.dataset.i);
const items = getAzkarItems(azkarCat);
const it = items[i];
if(!it)return;
azkarEnsureToday();
const key = azkarCat + ':' + i;
const cur = azkarProgress.c[key]|| 0;
if(e.target.closest('.az-reset')){
delete azkarProgress.c[key];
}else if(e.target.closest('.az-tap')){
if(cur >= it.count)return;
azkarProgress.c[key]= cur + 1;
try{if(navigator.vibrate)navigator.vibrate(cur + 1 >= it.count ?[18,40,28]:10);}catch(_){}
}else{
return;
}
saveAzkarProgress();
card.outerHTML = azkarCardHtml(it,i,azkarCat,t());
const tap = document.querySelector(`#azkarList .az-card[data-i="${i}"] .az-tap`);
if(tap && e.target.closest('.az-tap'))tap.classList.add('az-pop');
renderAzkarProgress(items);
syncAzkarToMuslimDay(azkarCat,items);
});
const AZKAR_TO_MD_FIELD ={morning:'morning',evening:'evening',afterPrayer:'after'};
function syncAzkarToMuslimDay(cat,items){
const field = AZKAR_TO_MD_FIELD[cat];
if(!field)return;
if(!items.every((it,i)=> azkarCount(cat,i)>= it.count))return;
const today = new Date();
if(getDayData(today).azkar[field])return;
updateDayField(today,d =>{d.azkar[field]= true;});
}
function applyExtraTexts(){
const a = document.getElementById('txtMapFast');if(a)a.textContent = XT('mapFast');
const b = document.getElementById('txtOpenGmaps');if(b)b.textContent = XT('openGmaps');
}
setTimeout(()=>{const sp = document.getElementById('splash');if(sp)sp.remove();},2800);
initAsrSelect();
applyTheme(state.theme);
applyLanguage();
positionTabIndicator(false);
requestAnimationFrame(()=> positionTabIndicator(false));
{
const startView =(location.hash || '').slice(1);
if(startView && startView !== 'home' && document.getElementById('view-' + startView)){
if(PROTECTED_VIEWS.has(startView)){pendingViewAfterLogin = startView;}
else switchView(startView,{fromHistory:true});
}
}
if(!restoreLastLocationIfAny()){
requestLocation();
}else{
silentLocationRefresh();
}
if(!localStorage.getItem('salati_md_onboarded')){
localStorage.setItem('salati_md_onboarded','1');
setTimeout(openCustomize,600);
}
