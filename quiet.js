(function(){
'use strict';
const X = window.SalatiX;
if(!X)return;
const{esc,toast}= X;
const $ =(id)=> document.getElementById(id);
const KEY = 'salati_quiet_until',DUR_KEY = 'salati_quiet_dur';
const Q ={
btn:{ar:'هادئ',en:'Quiet',fr:'Silence',es:'Silencio',zh:'静音',ru:'Тишина',tr:'Sessiz'},
hint:{ar:'كتم الإشعارات والأذان أثناء الصلاة',en:'Mute notifications while you pray',fr:'Couper les notifications pendant la prière',es:'Silenciar las notificaciones durante la oración',zh:'礼拜时静音通知',ru:'Отключить уведомления на время намаза',tr:'Namaz sırasında bildirimleri sustur'},
title:{ar:'وضع الصلاة الهادئ',en:'Quiet prayer mode',fr:'Mode prière silencieux',es:'Modo oración en silencio',zh:'礼拜静音模式',ru:'Тихий режим молитвы',tr:'Sessiz namaz modu'},
sub:{ar:'إشعارات التطبيق والأذان مكتومة',en:'App notifications and adhan are muted',fr:'Les notifications et l’adhan de l’application sont coupés',es:'Se silencian las notificaciones y el adhan de la app',zh:'应用通知和宣礼已静音',ru:'Уведомления и азан приложения отключены',tr:'Uygulama bildirimleri ve ezan sessizde'},
durLbl:{ar:'مدة الصمت',en:'Silence for',fr:'Silence pendant',es:'Silencio durante',zh:'静音时长',ru:'Тишина на',tr:'Sessiz süre'},
min:{ar:n=>`${n} د`,en:n=>`${n} min`,fr:n=>`${n} min`,es:n=>`${n} min`,zh:n=>`${n} 分钟`,ru:n=>`${n} мин`,tr:n=>`${n} dk`},
inf:{ar:'حتى أُنهيه',en:'Until I end it',fr:'Jusqu’à l’arrêt',es:'Hasta que lo termine',zh:'直到我关闭',ru:'Пока не выключу',tr:'Ben bitirene kadar'},
left:{ar:m=>`ينتهي بعد ${m} د`,en:m=>`Ends in ${m} min`,fr:m=>`Se termine dans ${m} min`,es:m=>`Termina en ${m} min`,zh:m=>`${m} 分钟后结束`,ru:m=>`Закончится через ${m} мин`,tr:m=>`${m} dk sonra biter`},
noEnd:{ar:'بلا نهاية — أنهِه عند الحاجة',en:'No end time — end it when you’re done',fr:'Sans fin — arrêtez-le quand vous voulez',es:'Sin fin — termínalo cuando quieras',zh:'无结束时间，需要时手动关闭',ru:'Без окончания — выключите, когда нужно',tr:'Bitiş yok — işiniz bitince kapatın'},
end:{ar:'إنهاء الوضع الهادئ',en:'End quiet mode',fr:'Arrêter le mode silencieux',es:'Terminar el modo silencio',zh:'结束静音模式',ru:'Выключить тихий режим',tr:'Sessiz modu bitir'},
close:{ar:'إغلاق الشاشة',en:'Close screen',fr:'Fermer l’écran',es:'Cerrar pantalla',zh:'关闭此屏',ru:'Закрыть экран',tr:'Ekranı kapat'},
banner:{ar:'الوضع الهادئ نشط',en:'Quiet mode is on',fr:'Mode silencieux actif',es:'Modo silencio activo',zh:'静音模式已开启',ru:'Тихий режим включён',tr:'Sessiz mod açık'},
ended:{ar:'انتهى الوضع الهادئ',en:'Quiet mode ended',fr:'Mode silencieux terminé',es:'Modo silencio terminado',zh:'静音模式已结束',ru:'Тихий режим завершён',tr:'Sessiz mod bitti'},
};
const q =(k,...a)=>{const d = Q[k];const v = d[state.lang]|| d.en;return typeof v === 'function' ? v(...a):v;};
const DURATIONS =[15,30,60,'inf'];
const lsGet =(k,d)=>{try{const v = localStorage.getItem(k);return v === null ? d:v;}catch(e){return d;}};
const lsSet =(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const untilMs =()=>{const v = lsGet(KEY,'');if(!v)return 0;return v === 'inf' ? Infinity:(Number(v)|| 0);};
const active =()=> isQuietMode();
const preferred =()=>{const v = lsGet(DUR_KEY,'30');return v === 'inf' ? 'inf':(Number(v)|| 30);};
const emit =(on)=>{try{window.dispatchEvent(new CustomEvent('salati:quiet',{detail:{on}}));}catch(e){}};
function startQuiet(dur){
lsSet(DUR_KEY,String(dur));
lsSet(KEY,dur === 'inf' ? 'inf':String(Date.now()+ dur * 60000));
try{if(typeof stopAdhanNow === 'function')stopAdhanNow();}catch(e){}
emit(true);renderAll();
}
function endQuiet(silent){
lsSet(KEY,'');
emit(false);renderAll();
if(!silent)toast(q('ended'));
}
function leftMin(){const u = untilMs();return u === Infinity ? Infinity:Math.max(1,Math.ceil((u - Date.now())/ 60000));}
function nextPrayer(){
try{
const now = Date.now(),list =(typeof prayerQueue === 'function')? prayerQueue():[];
const hit = list.find(x => x.time.getTime()> now);
if(!hit)return null;
const isTomorrow = list.indexOf(hit)>= 5;
const hhmm = isTomorrow ? state.tomorrowFajr:state.timings[hit.k];
return{key:hit.k,time:hit.time,hhmm};
}catch(e){return null;}
}
const pad =(n)=> String(n).padStart(2,'0');
function fmtCount(ms){const s = Math.max(0,Math.floor(ms / 1000));return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;}
function renderOverlay(){
const ov = $('quietOverlay');if(!ov)return;
$('qmTitle').textContent = q('title');$('qmSub').textContent = q('sub');
$('qmNextLbl').textContent = t().nextPrayerLabel;$('qmDurLbl').textContent = q('durLbl');
$('qmEndTxt').textContent = q('end');$('qmCloseTxt').textContent = q('close');
$('qmDur').innerHTML = DURATIONS.map(d => `<button type="button" class="qm-chip${d === preferred() ? ' active' : ''}" data-d="${d}">${esc(d === 'inf' ? q('inf') : q('min', d))}</button>`).join('');
$('qmLeft').textContent = active()?(untilMs()=== Infinity ? q('noEnd'):q('left',leftMin())):'';
tickOverlay();
}
function tickOverlay(){
const n = nextPrayer();
if(!$('qmNextName'))return;
if(!n){$('qmNextName').textContent = '—';$('qmCount').textContent = '--:--:--';$('qmNextTime').textContent = '';return;}
$('qmNextName').textContent = t().prayerNames[n.key];
$('qmCount').textContent = fmtCount(n.time.getTime()- Date.now());
$('qmNextTime').textContent = n.hhmm;
}
function renderBanner(){
const b = $('quietBanner');if(!b)return;
const on = active()&& !$('quietOverlay').classList.contains('active');
b.style.display = on ? '':'none';
if(on){$('qbText').textContent = '🤫 ' + q('banner')+ ' · ' +(untilMs()=== Infinity ? '∞':q('left',leftMin()));$('qbEnd').textContent = q('end');}
}
function renderAll(){
const tb = $('tlQuietTxt');if(tb){tb.textContent = q('title');$('tlQuietHint').textContent = q('hint');}
const btn = $('tlQuiet');if(btn)btn.classList.toggle('quiet-on',active());
renderOverlay();renderBanner();
}
const openOverlay =()=>{$('quietOverlay').classList.add('active');renderAll();};
const closeOverlay =()=>{$('quietOverlay').classList.remove('active');renderAll();};
function inject(){
const row = $('toolsRow');
if(row && !$('tlQuiet'))row.insertAdjacentHTML('beforeend',`<button type="button" id="tlQuiet" class="tl-wide"><span class="act-ic">🤫</span><span class="act-tx"><b id="tlQuietTxt">—</b><small id="tlQuietHint">—</small></span></button>`);
const home = $('view-home');
if(home && !$('quietBanner'))home.insertAdjacentHTML('afterbegin',`<div class="quiet-banner" id="quietBanner" style="display:none;"><span id="qbText">—</span><button type="button" id="qbEnd">—</button></div>`);
if(!$('quietOverlay')){
document.body.insertAdjacentHTML('beforeend',`
    <div class="quiet-overlay" id="quietOverlay" role="dialog" aria-modal="true">
      <div class="quiet-inner">
        <div class="quiet-moon">🤫</div>
        <h2 id="qmTitle">—</h2>
        <div class="quiet-sub" id="qmSub">—</div>
        <div class="quiet-next-lbl" id="qmNextLbl">—</div>
        <div class="quiet-next" id="qmNextName">—</div>
        <div class="quiet-count" id="qmCount">--:--:--</div>
        <div class="quiet-time" id="qmNextTime"></div>
        <div class="quiet-durlbl" id="qmDurLbl">—</div>
        <div class="quiet-dur" id="qmDur"></div>
        <div class="quiet-left" id="qmLeft"></div>
        <div class="quiet-actions">
          <button type="button" class="ghost" id="qmEnd"><span id="qmEndTxt">—</span></button>
          <button type="button" class="primary" id="qmClose"><span id="qmCloseTxt">—</span></button>
        </div>
      </div>
    </div>`);
}
}
function bind(){
$('tlQuiet').addEventListener('click',()=>{if(!active())startQuiet(preferred());openOverlay();});
$('qmDur').addEventListener('click',(e)=>{const b = e.target.closest('.qm-chip');if(!b)return;startQuiet(b.dataset.d === 'inf' ? 'inf':Number(b.dataset.d));});
$('qmEnd').addEventListener('click',()=>{endQuiet(false);closeOverlay();});
$('qmClose').addEventListener('click',closeOverlay);
$('qbEnd').addEventListener('click',()=> endQuiet(false));
}
function tick(){
const v = lsGet(KEY,'');
if(v && v !== 'inf' && Number(v)<= Date.now()){lsSet(KEY,'');emit(false);renderAll();toast(q('ended'));return;}
if($('quietOverlay').classList.contains('active'))tickOverlay();
}
setInterval(tick,1000);
setInterval(()=>{if(active())renderAll();},30000);
const _al = applyLanguage;
applyLanguage = function(){const r = _al.apply(this,arguments);try{renderAll();}catch(e){console.error(e);}return r;};
inject();bind();renderAll();
window.SalatiQuiet ={start:startQuiet,end:endQuiet,active,untilMs};
})();
