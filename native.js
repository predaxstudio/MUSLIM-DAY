(function(){
'use strict';
const cap = window.Capacitor;
const isNative = !!(cap &&((typeof cap.isNativePlatform === 'function' && cap.isNativePlatform())||(typeof cap.getPlatform === 'function' && cap.getPlatform()!== 'web')));
if(!isNative)return;
const LN =(cap.Plugins && cap.Plugins.LocalNotifications)||(typeof cap.registerPlugin === 'function' ? cap.registerPlugin('LocalNotifications'):null);
if(!LN){console.warn('LocalNotifications plugin not available');return;}
window.SALATI_NATIVE = true;
document.documentElement.classList.add('native-app');
const X = window.SalatiX ||{};
const HORIZON_DAYS = 21;
const PER_BATCH = 50;
const lsGet =(k,d)=>{try{const v = localStorage.getItem(k);return v === null ? d:v;}catch(e){return d;}};
const lsSet =(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const pad =(n)=> String(n).padStart(2,'0');
const hm =(s)=>{const m = String(s || '').match(/\d{1,2}:\d{2}/);return m ? m[0].padStart(5,'0'):null;};
const NATIVE_TEXT ={
exact:{ar:'لتعمل المنبهات بدقة الثانية، فعّل «المنبهات والتذكيرات» لهذا التطبيق في الشاشة التالية.',en:'For prayer alerts to fire exactly on time, enable “Alarms & reminders” for this app on the next screen.',fr:'Pour que les alertes sonnent à l’heure exacte, activez « Alarmes et rappels » pour cette application à l’écran suivant.',es:'Para que las alertas suenen a la hora exacta, activa «Alarmas y recordatorios» para esta app en la siguiente pantalla.',zh:'为使提醒准时响起，请在下一屏为此应用开启“闹钟和提醒”。',ru:'Чтобы сигналы срабатывали точно вовремя, включите «Будильники и напоминания» для этого приложения на следующем экране.',tr:'Uyarıların tam vaktinde çalması için bir sonraki ekranda bu uygulama için “Alarmlar ve hatırlatıcılar” iznini açın.'},
};
const nt =(k)=> NATIVE_TEXT[k][state.lang]|| NATIVE_TEXT[k].en;
function quietUntil(){const v = lsGet('salati_quiet_until','');if(!v)return 0;return v === 'inf' ? Infinity:(Number(v)|| 0);}
function zonedAt(y,mo,d,hhmm){
const tz = currentTz(),[h,m]= hhmm.split(':').map(Number),wall = Date.UTC(y,mo - 1,d,h,m,0);
let guess = wall;
for(let i = 0;i < 2;i++){const q = tzParts(new Date(guess),tz);guess += wall - Date.UTC(q.year,q.month - 1,q.day,q.hour,q.minute,q.second);}
return new Date(guess);
}
async function fetchMonth(y,m){
const{lat,lng}= state.coords,s = state.settings;
const key =['cal',y,m,lat.toFixed(2),lng.toFixed(2),s.method,s.school,buildTuneString()].join('|');
let cache ={};try{cache = JSON.parse(lsGet('salati_nat_cal','{}'))||{};}catch(e){}
if(cache[key])return cache[key];
const params = new URLSearchParams({latitude:lat,longitude:lng,school:s.school,tune:buildTuneString()});
const meth = s.method !== 'auto' ? s.method:autoMethod(lat,lng);
if(meth != null)params.set('method',meth);
if(Math.abs(lat)> 48)params.set('latitudeAdjustmentMethod','3');
const ctl = new AbortController(),to = setTimeout(()=> ctl.abort(),15000);
try{
const res = await fetch(`https://api.aladhan.com/v1/calendar/${y}/${m}?${params.toString()}`,{signal:ctl.signal});
const data = await res.json();
if(!res.ok || data.code !== 200 || !Array.isArray(data.data))throw new Error('bad calendar');
const rows = data.data.map(d =>{
const[dd,mm,yy]= String(d.date.gregorian.date).split('-').map(Number),tm = d.timings;
return{k:`${yy}-${pad(mm)}-${pad(dd)}`,Fajr:hm(tm.Fajr),Dhuhr:hm(tm.Dhuhr),Asr:hm(tm.Asr),Maghrib:hm(tm.Maghrib),Isha:hm(tm.Isha),Lastthird:hm(tm.Lastthird)};
});
cache[key]= rows;
const keys = Object.keys(cache);if(keys.length > 6)keys.slice(0,keys.length - 6).forEach(k => delete cache[k]);
lsSet('salati_nat_cal',JSON.stringify(cache));
return rows;
}finally{clearTimeout(to);}
}
const slotIdx ={Fajr:0,Dhuhr:1,Asr:2,Maghrib:3,Isha:4};
function adhanChannel(cfg){return cfg.adhan ? `adhan_${state.selectedSound}`:'notify';}
function makeNote(id,at,title,body,channelId,extra,withActions){
const n ={id,title,body,schedule:{at,allowWhileIdle:true},channelId,autoCancel:true,extra:extra ||{}};
if(channelId.indexOf('adhan_')=== 0)n.sound = channelId + '.mp3';
if(withActions)n.actionTypeId = 'ADHAN';
return n;
}
function buildNotifications(rowsByDate){
const s = state.settings,out =[],now = Date.now(),qUntil = quietUntil();
const remMin = Number(s.reminderMinutes)|| 0,names = t().prayerNames;
const qiyamOn = lsGet('salati_qiyam','0')=== '1',friOn = lsGet('salati_friday','0')=== '1';
const f2 = window.SalatiX2 && window.SalatiX2.f2;
const p = tzParts(new Date(),currentTz());
const push =(note)=>{const at = note.schedule.at.getTime();if(at > now + 3000 && at >= qUntil)out.push(note);};
for(let i = 0;i < HORIZON_DAYS;i++){
const dt = new Date(Date.UTC(p.year,p.month - 1,p.day + i)),y = dt.getUTCFullYear(),mo = dt.getUTCMonth()+ 1,d = dt.getUTCDate();
const row = rowsByDate.get(`${y}-${pad(mo)}-${pad(d)}`);if(!row)continue;
const base = y * 10000 + mo * 100 + d;
PRAYER_ORDER.forEach(k =>{
const cfg = s.notifPerPrayer[k];if(!row[k])return;
const at = zonedAt(y,mo,d,row[k]);
if(cfg.notify || cfg.adhan)push(makeNote(base * 100 + slotIdx[k],at,t().adhanTitle(names[k]),t().adhanBody,adhanChannel(cfg),{prayer:k},true));
if(cfg.reminder && remMin > 0)push(makeNote(base * 100 + 5 + slotIdx[k],new Date(at.getTime()- remMin * 60000),t().appName,t().reminderNotice(remMin,names[k]),'reminder',{prayer:k},false));
});
if(qiyamOn && f2 && row.Lastthird){
const early = Number(row.Lastthird.slice(0,2))< 12;
const day2 = new Date(Date.UTC(y,mo - 1,d +(early ? 1:0)));
push(makeNote(base * 100 + 10,zonedAt(day2.getUTCFullYear(),day2.getUTCMonth()+ 1,day2.getUTCDate(),row.Lastthird),f2('qiyamNotifT'),f2('qiyamNotifB'),'qiyam',{},false));
}
if(friOn && f2 && dt.getUTCDay()=== 5){
push(makeNote(base * 100 + 11,zonedAt(y,mo,d,'08:00'),f2('friMornT'),f2('friMornB'),'notify',{},false));
if(row.Dhuhr)push(makeNote(base * 100 + 12,new Date(zonedAt(y,mo,d,row.Dhuhr).getTime()- 30 * 60000),f2('friPreT'),f2('friPreB'),'notify',{},false));
}
}
return out;
}
async function setupChannels(){
try{
const names = t().soundNames;
for(const snd of ADHAN_SOUNDS){
await LN.createChannel({id:`adhan_${snd.id}`,name:names[snd.id]|| snd.id,description:t().adhanBody,importance:5,visibility:1,sound:`adhan_${snd.id}.mp3`,vibration:true,lights:true});
}
await LN.createChannel({id:'notify',name:t().notifTitle,importance:4,visibility:1,vibration:true});
await LN.createChannel({id:'reminder',name:t().reminderLabel || 'Reminder',importance:4,visibility:1,vibration:true});
await LN.createChannel({id:'qiyam',name:(window.SalatiX2 ? window.SalatiX2.f2('qiyamTitle'):'Night prayer'),importance:4,visibility:1,vibration:true});
}catch(e){console.warn('channels',e);}
}
async function setupActions(){
try{await LN.registerActionTypes({types:[{id:'ADHAN',actions:[{id:'prayed',title:XT('prayedAction')}]}]});}catch(e){console.warn('actions',e);}
}
async function ensurePermissions(){
try{
let p = await LN.checkPermissions();
if(p.display !== 'granted'){p = await LN.requestPermissions();if(p.display !== 'granted')return false;}
}catch(e){return false;}
try{
const ex = await LN.checkExactNotificationSetting();
if(ex && ex.exact_alarm && ex.exact_alarm !== 'granted'){
const last = Number(lsGet('salati_exact_asked','0'));
if(Date.now()- last > 7 * 86400000){
lsSet('salati_exact_asked',String(Date.now()));
alert(nt('exact'));
try{await LN.changeExactNotificationSetting();}catch(e){}
}
}
}catch(e){}
return true;
}
const PREF =(cap.Plugins && cap.Plugins.Preferences)||(typeof cap.registerPlugin === 'function' ? cap.registerPlugin('Preferences'):null);
async function syncWidget(rows){
if(!PREF || !PREF.set)return;
try{
const names = t().prayerNames,p = tzParts(new Date(),currentTz()),now = Date.now(),items =[];
for(let i = 0;i < 8;i++){
const dt = new Date(Date.UTC(p.year,p.month - 1,p.day + i)),y = dt.getUTCFullYear(),mo = dt.getUTCMonth()+ 1,d = dt.getUTCDate();
const row = rows.get(`${y}-${pad(mo)}-${pad(d)}`);if(!row)continue;
PRAYER_ORDER.forEach(k =>{if(!row[k])return;const at = zonedAt(y,mo,d,row[k]);if(at.getTime()> now - 60000)items.push({t:at.getTime(),n:names[k],h:row[k]});});
}
items.sort((x,y)=> x.t - y.t);
await PREF.set({key:'widget_data',value:JSON.stringify({v:1,label:t().nextPrayerLabel,items})});
window.SalatiNative.widget ={count:items.length};
}catch(e){console.warn('widget sync',e);}
}
function buildAbsence(){
const f4 = window.SalatiX4 && window.SalatiX4.f4;
if(!f4 || !window.SalatiX4.absenceOn())return[];
const last = Number(lsGet('salati_last_open','0'))|| Date.now(),out =[],now = Date.now(),qUntil = quietUntil();
[3,7,14].forEach(days =>{
const b = new Date(last);const at = new Date(b.getFullYear(),b.getMonth(),b.getDate()+ days,17,0,0);
if(at.getTime()> now + 3000 && at.getTime()>= qUntil)out.push(makeNote(900000000 + days,at,f4('absTitle'),f4(days === 3 ? 'abs1':'abs2'),'notify',{absence:days},false));
});
return out;
}
let running = false,again = false,timer = null;
window.SalatiNative ={last:null,widget:null};
async function cancelAllPending(){
try{const pend = await LN.getPending();const list =(pend && pend.notifications)||[];if(list.length)await LN.cancel({notifications:list.map(n =>({id:n.id}))});}catch(e){}
}
async function loadRows(){
const rows = new Map(),p = tzParts(new Date(),currentTz()),months = new Set();
for(let i = 0;i < HORIZON_DAYS;i++){const dt = new Date(Date.UTC(p.year,p.month - 1,p.day + i));months.add(dt.getUTCFullYear()+ '-' +(dt.getUTCMonth()+ 1));}
let ok = true;
for(const ym of months){const[y,m]= ym.split('-').map(Number);try{(await fetchMonth(y,m)).forEach(r => rows.set(r.k,r));}catch(e){ok = false;}}
if(!ok && rows.size === 0){
const key = `${p.year}-${pad(p.month)}-${pad(p.day)}`,tm = state.timings,tmr = new Date(Date.UTC(p.year,p.month - 1,p.day + 1));
rows.set(key,{k:key,Fajr:tm.Fajr,Dhuhr:tm.Dhuhr,Asr:tm.Asr,Maghrib:tm.Maghrib,Isha:tm.Isha,Lastthird:state.timingsExtra && state.timingsExtra.Lastthird});
if(state.tomorrowFajr){const k2 = `${tmr.getUTCFullYear()}-${pad(tmr.getUTCMonth() + 1)}-${pad(tmr.getUTCDate())}`;rows.set(k2,{k:k2,Fajr:state.tomorrowFajr});}
}
return{rows,ok};
}
async function resync(){
if(running){again = true;return;}
running = true;
try{
if(!state.coords || !state.timings)return;
const{rows,ok}= await loadRows();
await syncWidget(rows);
const adhanOn = !!state.settings.notifEnabled,absOn = !!(window.SalatiX4 && window.SalatiX4.absenceOn());
if(!adhanOn && !absOn){await cancelAllPending();window.SalatiNative.last ={count:0,off:true};return;}
if(!(await ensurePermissions())){window.SalatiNative.last ={count:0,denied:true};return;}
await setupChannels();await setupActions();
const notes =(adhanOn ? buildNotifications(rows):[]).concat(buildAbsence());
await cancelAllPending();
for(let i = 0;i < notes.length;i += PER_BATCH)await LN.schedule({notifications:notes.slice(i,i + PER_BATCH)});
window.SalatiNative.last ={count:notes.length,first:notes[0]&& notes[0].schedule.at,last:notes[notes.length - 1]&& notes[notes.length - 1].schedule.at,offlineFallback:!ok};
}catch(e){console.warn('native resync',e);window.SalatiNative.last ={error:String(e)};}
finally{running = false;if(again){again = false;schedule(300);}}
}
function schedule(ms){clearTimeout(timer);timer = setTimeout(resync,ms == null ? 1200:ms);}
window.SalatiNative.resync = resync;
try{
LN.addListener('localNotificationActionPerformed',(ev)=>{
const prayer = ev && ev.notification && ev.notification.extra && ev.notification.extra.prayer;
if(ev && ev.actionId === 'prayed' && prayer && X.markPrayed)X.markPrayed(prayer);
});
}catch(e){}
const _saveSettings = saveSettings;
saveSettings = function(){const r = _saveSettings.apply(this,arguments);schedule();return r;};
const _applyLanguage = applyLanguage;
applyLanguage = function(){const r = _applyLanguage.apply(this,arguments);schedule();return r;};
window.addEventListener('salati:quiet',()=> schedule(200));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(500);});
['qiyamToggle','friToggle','absToggle'].forEach(id =>{const el = document.getElementById(id);if(el)el.addEventListener('change',()=> schedule());});
let tries = 0;
const waitReady = setInterval(()=>{tries++;if((state.coords && state.timings)|| tries > 40){clearInterval(waitReady);schedule(300);}},1000);
try{
if(navigator.serviceWorker && navigator.serviceWorker.getRegistrations)navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
if(window.caches && caches.keys)caches.keys().then(ks => ks.forEach(k => caches.delete(k)));
}catch(e){}
})();
