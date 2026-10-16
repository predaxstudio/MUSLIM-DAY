(function(){
'use strict';
const F ={
occTitle:{ar:'المناسبات الهجرية',en:'Hijri occasions',fr:'Occasions hégiriennes',es:'Fechas islámicas',zh:'伊斯兰历节日',ru:'Исламские даты',tr:'Hicri günler'},
occNext:{ar:'المناسبة القادمة',en:'Next occasion',fr:'Prochaine occasion',es:'Próxima fecha',zh:'下一个节日',ru:'Ближайшая дата',tr:'Sıradaki gün'},
occToday:{ar:'اليوم',en:'Today',fr:'Aujourd’hui',es:'Hoy',zh:'今天',ru:'Сегодня',tr:'Bugün'},
occTomorrow:{ar:'غدًا',en:'Tomorrow',fr:'Demain',es:'Mañana',zh:'明天',ru:'Завтра',tr:'Yarın'},
occInDays:{ar:n=>n === 2 ? 'بعد يومين':`بعد ${n} ${n <= 10 ? 'أيام' : 'يومًا'}`,en:n=>`in ${n} days`,fr:n=>`dans ${n} jours`,es:n=>`en ${n} días`,zh:n=>`${n} 天后`,ru:n=>`через ${n} дн.`,tr:n=>`${n} gün sonra`},
occOpen:{ar:'التقويم',en:'Calendar',fr:'Calendrier',es:'Calendario',zh:'日历',ru:'Календарь',tr:'Takvim'},
occRemind:{ar:'تذكيري بالمناسبات',en:'Remind me of occasions',fr:'Me rappeler les occasions',es:'Recordarme las fechas',zh:'提醒我节日',ru:'Напоминать о датах',tr:'Günleri hatırlat'},
occRemindHint:{ar:'إشعار قبلها بيوم وفي يومها أثناء عمل التطبيق.',en:'Notified the day before and on the day itself while the app is running.',fr:'Notification la veille et le jour même lorsque l’application est active.',es:'Aviso el día antes y el mismo día mientras la app esté activa.',zh:'应用运行时，会在前一天和当天提醒。',ru:'Уведомление накануне и в сам день, пока приложение запущено.',tr:'Uygulama çalışırken bir gün önce ve o gün bildirim gelir.'},
occFast:{ar:'صيام مستحب',en:'Fasting recommended',fr:'Jeûne recommandé',es:'Ayuno recomendado',zh:'建议斋戒',ru:'Рекомендован пост',tr:'Oruç tavsiye edilir'},
occNone:{ar:'لا توجد مناسبات في هذا الشهر',en:'No occasions this month',fr:'Aucune occasion ce mois-ci',es:'Sin fechas este mes',zh:'本月没有节日',ru:'В этом месяце дат нет',tr:'Bu ay özel gün yok'},
tsTitle:{ar:'المسبحة',en:'Tasbih counter',fr:'Compteur de tasbih',es:'Contador de tasbih',zh:'念珠计数器',ru:'Тасбих',tr:'Tesbih'},
tsTap:{ar:'المس للعدّ',en:'Tap to count',fr:'Touchez pour compter',es:'Toca para contar',zh:'点按计数',ru:'Нажимайте для счёта',tr:'Saymak için dokunun'},
tsTarget:{ar:'الهدف',en:'Target',fr:'Objectif',es:'Meta',zh:'目标',ru:'Цель',tr:'Hedef'},
tsReset:{ar:'تصفير',en:'Reset',fr:'Réinitialiser',es:'Reiniciar',zh:'重置',ru:'Сбросить',tr:'Sıfırla'},
tsVibrate:{ar:'الاهتزاز',en:'Vibration',fr:'Vibration',es:'Vibración',zh:'振动',ru:'Вибрация',tr:'Titreşim'},
tsToday:{ar:'مجموع اليوم',en:'Today’s total',fr:'Total du jour',es:'Total de hoy',zh:'今日总数',ru:'Итого за сегодня',tr:'Bugünün toplamı'},
tsAll:{ar:'الإجمالي',en:'All time',fr:'Total',es:'Total general',zh:'累计',ru:'Всего',tr:'Toplam'},
tsDone:{ar:'اكتمل الهدف ✓',en:'Target reached ✓',fr:'Objectif atteint ✓',es:'Meta alcanzada ✓',zh:'已达成目标 ✓',ru:'Цель достигнута ✓',tr:'Hedefe ulaşıldı ✓'},
stTitle:{ar:'إحصاءات والتزامي',en:'Stats & streaks',fr:'Statistiques et séries',es:'Estadísticas y rachas',zh:'统计与连续记录',ru:'Статистика и серии',tr:'İstatistik ve seriler'},
stStreak:{ar:'سلسلة الصلوات',en:'Prayer streak',fr:'Série de prières',es:'Racha de oraciones',zh:'礼拜连续天数',ru:'Серия намазов',tr:'Namaz serisi'},
stBest:{ar:'أفضل سلسلة',en:'Best streak',fr:'Meilleure série',es:'Mejor racha',zh:'最佳连续',ru:'Лучшая серия',tr:'En iyi seri'},
stAvg7:{ar:'متوسط 7 أيام',en:'7-day average',fr:'Moyenne 7 jours',es:'Promedio 7 días',zh:'7天平均',ru:'Среднее за 7 дней',tr:'7 günlük ortalama'},
stLast7:{ar:'آخر 7 أيام',en:'Last 7 days',fr:'7 derniers jours',es:'Últimos 7 días',zh:'最近7天',ru:'Последние 7 дней',tr:'Son 7 gün'},
stBadges:{ar:'الشارات',en:'Badges',fr:'Badges',es:'Insignias',zh:'徽章',ru:'Награды',tr:'Rozetler'},
stUnit:{ar:n=>n <= 10 ? 'أيام':'يومًا',en:'days',fr:'jours',es:'días',zh:'天',ru:'дн.',tr:'gün'},
vdAyah:{ar:'آية اليوم',en:'Verse of the day',fr:'Verset du jour',es:'Versículo del día',zh:'今日经文',ru:'Аят дня',tr:'Günün ayeti'},
vdHadith:{ar:'حديث اليوم',en:'Hadith of the day',fr:'Hadith du jour',es:'Hadiz del día',zh:'今日圣训',ru:'Хадис дня',tr:'Günün hadisi'},
vdNew:{ar:'آخر',en:'Another',fr:'Une autre',es:'Otra',zh:'换一个',ru:'Другой',tr:'Başka'},
a11yTitle:{ar:'العرض وسهولة الاستخدام',en:'Display & accessibility',fr:'Affichage et accessibilité',es:'Pantalla y accesibilidad',zh:'显示与无障碍',ru:'Экран и доступность',tr:'Görüntü ve erişilebilirlik'},
a11yFont:{ar:'حجم الخط',en:'Text size',fr:'Taille du texte',es:'Tamaño del texto',zh:'字号',ru:'Размер текста',tr:'Yazı boyutu'},
a11yS:{ar:'صغير',en:'Small',fr:'Petit',es:'Pequeño',zh:'小',ru:'Мелкий',tr:'Küçük'},
a11yM:{ar:'عادي',en:'Normal',fr:'Normal',es:'Normal',zh:'标准',ru:'Обычный',tr:'Normal'},
a11yL:{ar:'كبير',en:'Large',fr:'Grand',es:'Grande',zh:'大',ru:'Крупный',tr:'Büyük'},
a11yXL:{ar:'كبير جدًا',en:'Extra large',fr:'Très grand',es:'Muy grande',zh:'特大',ru:'Очень крупный',tr:'Çok büyük'},
a11yContrast:{ar:'تباين عالٍ',en:'High contrast',fr:'Contraste élevé',es:'Alto contraste',zh:'高对比度',ru:'Высокая контрастность',tr:'Yüksek kontrast'},
a11yContrastHint:{ar:'نصوص أوضح وحدود أقوى',en:'Clearer text and stronger borders',fr:'Texte plus net, bordures plus marquées',es:'Texto más claro y bordes más marcados',zh:'文字更清晰，边框更明显',ru:'Более чёткий текст и рамки',tr:'Daha net metin ve belirgin kenarlıklar'},
a11yMotion:{ar:'تقليل الحركة',en:'Reduce motion',fr:'Réduire les animations',es:'Reducir animaciones',zh:'减少动画',ru:'Меньше анимации',tr:'Hareketi azalt'},
shShare:{ar:'مشاركة',en:'Share',fr:'Partager',es:'Compartir',zh:'分享',ru:'Поделиться',tr:'Paylaş'},
};
const ft =(k,...a)=>{const d = F[k];const v = d[state.lang]|| d.en;return typeof v === 'function' ? v(...a):v;};
const $ =(id)=> document.getElementById(id);
const esc =(s)=>(typeof escapeHtml === 'function' ? escapeHtml(String(s)):String(s).replace(/[&<>"']/g,c =>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
const addDays =(d,n)=> new Date(d.getFullYear(),d.getMonth(),d.getDate()+ n);
const today0 =()=>{const n = new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());};
const OCC_NAMES ={
newyear:{ar:'رأس السنة الهجرية',en:'Islamic New Year',fr:'Nouvel an hégirien',es:'Año Nuevo islámico',zh:'伊斯兰新年',ru:'Исламский Новый год',tr:'Hicri yılbaşı'},
ashura:{ar:'يوم عاشوراء',en:'Day of Ashura',fr:'Jour d’Achoura',es:'Día de Áshura',zh:'阿舒拉日',ru:'День Ашура',tr:'Aşure günü'},
ramadan:{ar:'بداية رمضان',en:'Start of Ramadan',fr:'Début du Ramadan',es:'Inicio de Ramadán',zh:'斋月开始',ru:'Начало Рамадана',tr:'Ramazan başlangıcı'},
last10:{ar:'العشر الأواخر من رمضان',en:'Last ten nights of Ramadan',fr:'Dix dernières nuits du Ramadan',es:'Últimas diez noches de Ramadán',zh:'斋月最后十夜',ru:'Последние десять ночей Рамадана',tr:'Ramazan’ın son on gecesi'},
eidfitr:{ar:'عيد الفطر',en:'Eid al-Fitr',fr:'Aïd al-Fitr',es:'Eid al-Fitr',zh:'开斋节',ru:'Ид аль-Фитр',tr:'Ramazan Bayramı'},
shawwal6:{ar:'صيام ست من شوال',en:'Six days of Shawwal',fr:'Six jours de Chawwal',es:'Seis días de Shawwal',zh:'沙瓦鲁月六日斋',ru:'Шесть дней шавваля',tr:'Şevval’in altı günü'},
dhulhijja:{ar:'عشر ذي الحجة',en:'First ten days of Dhul Hijjah',fr:'Dix premiers jours de Dhou al-Hijja',es:'Primeros diez días de Dhul Hiyya',zh:'朝觐月头十日',ru:'Первые десять дней зуль-хиджжа',tr:'Zilhicce’nin ilk on günü'},
arafah:{ar:'يوم عرفة',en:'Day of Arafah',fr:'Jour d’Arafat',es:'Día de Arafat',zh:'阿拉法特日',ru:'День Арафа',tr:'Arefe günü'},
eidadha:{ar:'عيد الأضحى',en:'Eid al-Adha',fr:'Aïd al-Adha',es:'Eid al-Adha',zh:'宰牲节',ru:'Ид аль-Адха',tr:'Kurban Bayramı'},
tashreeq:{ar:'أيام التشريق (11–13)',en:'Days of Tashreeq (11–13)',fr:'Jours de Tachriq (11–13)',es:'Días de Tashrik (11–13)',zh:'塔什里克日（11–13）',ru:'Дни ташрик (11–13)',tr:'Teşrik günleri (11–13)'},
white:{ar:'الأيام البيض (13–15)',en:'White Days (13–15)',fr:'Jours blancs (13–15)',es:'Días blancos (13–15)',zh:'白日（13–15）',ru:'Белые дни (13–15)',tr:'Eyyâm-ı Bîd (13–15)'},
};
const OCC =[
{id:'newyear',m:1,d:1},{id:'ashura',m:1,d:10,fast:true},
{id:'ramadan',m:9,d:1},{id:'last10',m:9,d:21},{id:'eidfitr',m:10,d:1},{id:'shawwal6',m:10,d:2,fast:true},
{id:'dhulhijja',m:12,d:1},{id:'arafah',m:12,d:9,fast:true},{id:'eidadha',m:12,d:10},{id:'tashreeq',m:12,d:11},
{id:'white',m:0,d:13,fast:true},
];
const occName =(o)=>(OCC_NAMES[o.id][state.lang]|| OCC_NAMES[o.id].en);
let _hcal = null,_hfmt = null;
const hOff =()=>{try{return Number(localStorage.getItem('salati_hijri_off'))|| 0;}catch(e){return 0;}};
const hShift =(date)=>{const o = hOff();return o ? new Date(date.getFullYear(),date.getMonth(),date.getDate()+ o,12):date;};
function hparts(date){
date = hShift(date);
if(!_hfmt){
try{_hcal = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura').resolvedOptions().calendar === 'islamic-umalqura' ? 'islamic-umalqura':'islamic';}catch(e){_hcal = 'islamic';}
_hfmt = new Intl.DateTimeFormat('en-u-ca-' + _hcal,{day:'numeric',month:'numeric',year:'numeric'});
}
const p = _hfmt.formatToParts(date),g =(ty)=> Number((p.find(x => x.type === ty)||{}).value);
return{d:g('day'),m:g('month'),y:g('year')};
}
const occOn =(h)=> OCC.filter(o =>(o.m === 0 || o.m === h.m)&& o.d === h.d);
function nextOccasion(){
const base = today0();
for(let i = 0;i < 400;i++){
const date = addDays(base,i),list = occOn(hparts(date));
if(list.length)return{occ:list[0],date,days:i};
}
return null;
}
function daysText(n){return n === 0 ? ft('occToday'):(n === 1 ? ft('occTomorrow'):ft('occInDays',n));}
function hFirst(date){return addDays(date,-(hparts(date).d - 1));}
function hNextFirst(first){let d = addDays(first,29),g = 0;while(hparts(d).d !== 1 && g++ < 3)d = addDays(d,1);return d;}
function hPrevFirst(first){return hFirst(addDays(first,-1));}
function hMonthFirst(offset){
let f = hFirst(today0());
for(let i = 0;i < Math.abs(offset);i++)f = offset > 0 ? hNextFirst(f):hPrevFirst(f);
return f;
}
let occOffset = 0;
function renderOccSheet(){
const first = hMonthFirst(occOffset),next = hNextFirst(first);
const len = Math.round((next - first)/ 86400000);
const loc = localeForLang();
let title = '';
try{title = new Intl.DateTimeFormat(`${loc}-u-ca-${_hcal || 'islamic'}`,{month:'long',year:'numeric'}).format(hShift(first));}catch(e){title = '—';}
$('occMonthTitle').textContent = title;
$('occSheetTitle').textContent = ft('occTitle');
const lead =(first.getDay()+ 1)% 7;
const wd = new Intl.DateTimeFormat(loc,{weekday:'narrow'});
const cells =[];
for(let i = 0;i < 7;i++)cells.push(`<div class="occ-head">${esc(wd.format(new Date(2023, 0, 7 + i)))}</div>`);
for(let i = 0;i < lead;i++)cells.push('<div class="occ-cell is-empty"></div>');
const t0 = today0(),items =[];
for(let n = 0;n < len;n++){
const date = addDays(first,n),h = hparts(date),list = occOn(h);
const cls =['occ-cell'];
if(date.getTime()=== t0.getTime())cls.push('is-today');
if(list.length)cls.push(list.some(o => o.fast)? 'has-fast':'has-occ');
cells.push(`<div class="${cls.join(' ')}"><b>${h.d}</b><small>${date.getDate()}</small></div>`);
list.forEach(o => items.push({date,o}));
}
$('occGrid').innerHTML = cells.join('');
const df = new Intl.DateTimeFormat(loc,{weekday:'short',day:'numeric',month:'short'});
$('occList').innerHTML = items.length ? items.map(({date,o})=> `
    <div class="occ-item"><div class="occ-date">${esc(df.format(date))}</div>
      <div class="occ-name">${esc(occName(o))}${o.fast ? `<span class="occ-fast">${esc(ft('occFast'))}</span>` : ''}</div></div>`).join('')
:`<div class="occ-none">${esc(ft('occNone'))}</div>`;
$('occNote').textContent = t().hijriDisclaimer || '';
$('occRemindTitle').textContent = ft('occRemind');
$('occRemindHint').textContent = ft('occRemindHint');
$('occCloseTxt').textContent =(typeof XT === 'function')? XT('done'):'OK';
$('occRemindToggle').checked = localStorage.getItem('salati_occ_remind')=== '1';
}
function renderOccStrip(){
const strip = $('occStrip');if(!strip)return;
const n = nextOccasion();
$('occStripTitle').textContent = '🗓️ ' + ft('occNext');
$('occStripName').textContent = n ? occName(n.occ):'—';
$('occStripWhen').textContent = n ? daysText(n.days):'';
$('occStripCta').textContent = ft('occOpen');
}
async function checkOccReminders(){
if(isQuietMode())return;
if(localStorage.getItem('salati_occ_remind')!== '1')return;
if(!('Notification' in window)|| Notification.permission !== 'granted')return;
let fired =[];try{fired = JSON.parse(localStorage.getItem('salati_occ_fired')|| '[]');}catch(e){}
const base = today0();
for(const i of[0,1]){
const date = addDays(base,i);
for(const o of occOn(hparts(date))){
const id = `${dateKey(date)}-${o.id}-${i}`;
if(fired.includes(id))continue;
fired.push(id);
localStorage.setItem('salati_occ_fired',JSON.stringify(fired.slice(-40)));
const title = `${i === 0 ? ft('occToday') : ft('occTomorrow')}: ${occName(o)}`;
const body = o.fast ? ft('occFast'):'';
try{
const reg =('serviceWorker' in navigator)? await navigator.serviceWorker.getRegistration():null;
if(reg && reg.showNotification)await reg.showNotification(title,{body,icon:'icons/icon-192.png',tag:'salati-occ'});
else new Notification(title,{body,icon:'icons/icon-192.png'});
}catch(e){}
}
}
}
const DHIKR =['سُبْحَانَ اللَّهِ','الْحَمْدُ لِلَّهِ','اللَّهُ أَكْبَرُ','لَا إِلَهَ إِلَّا اللَّهُ','أَسْتَغْفِرُ اللَّهَ','اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ'];
const TARGETS =[33,99,100,0];
const TS_KEY = 'salati_tasbih';
let ts ={dhikr:0,count:0,target:33,vib:true,days:{},all:0};
function tsLoad(){try{const r = JSON.parse(localStorage.getItem(TS_KEY)|| 'null');if(r)ts ={...ts,...r};}catch(e){}}
function tsSave(){
const keys = Object.keys(ts.days).sort();if(keys.length > 60)keys.slice(0,keys.length - 60).forEach(k => delete ts.days[k]);
try{localStorage.setItem(TS_KEY,JSON.stringify(ts));}catch(e){}
}
function renderTasbih(){
$('tsTitle').textContent = ft('tsTitle');
$('tsChips').innerHTML = DHIKR.map((d,i)=> `<button type="button" class="ts-chip${i === ts.dhikr ? ' active' : ''}" data-i="${i}">${esc(d)}</button>`).join('');
$('tsDhikr').textContent = DHIKR[ts.dhikr];
$('tsCount').textContent = ts.count;
const reached = ts.target > 0 && ts.count >= ts.target;
$('tsHint').textContent = reached ? ft('tsDone'):ft('tsTap');
$('tsTap').classList.toggle('reached',reached);
$('tsTargetLbl').textContent = ft('tsTarget');
$('tsTargets').innerHTML = TARGETS.map(n => `<button type="button" class="ts-target${n === ts.target ? ' active' : ''}" data-n="${n}">${n === 0 ? '∞' : n}</button>`).join('');
const k = dateKey(new Date());
$('tsToday').innerHTML = `<span>${esc(ft('tsToday'))}</span><b>${ts.days[k] || 0}</b>`;
$('tsAll').innerHTML = `<span>${esc(ft('tsAll'))}</span><b>${ts.all}</b>`;
$('tsReset').textContent = ft('tsReset');
$('tsVib').textContent = `${ft('tsVibrate')}: ${ts.vib ? 'ON' : 'OFF'}`;
$('tsVib').classList.toggle('on',!!ts.vib);
$('tsCloseTxt').textContent =(typeof XT === 'function')? XT('done'):'OK';
$('openTasbihTitle').textContent = ft('tsTitle');
}
function tsTap(){
if(ts.target > 0 && ts.count >= ts.target)ts.count = 0;
ts.count++;ts.all++;
const k = dateKey(new Date());ts.days[k]=(ts.days[k]|| 0)+ 1;
if(ts.vib && navigator.vibrate){try{navigator.vibrate(ts.target > 0 && ts.count === ts.target ?[70,50,70]:12);}catch(e){}}
tsSave();renderTasbih();
}
function withStoreCache(fn){
const orig = loadMuslimDayStore,snap = orig();
loadMuslimDayStore =()=> snap;
try{return fn();}finally{loadMuslimDayStore = orig;}
}
function computeStats(){
return withStoreCache(()=>{
const base = today0(),tr = state.settings.trackedItems,days =[];
for(let i = 0;i < 365;i++){
const d = addDays(base,-i),data = getDayData(d),r = computeApplicableTasks(d,data);
const pct = r.total ? r.done / r.total:0;
const good = tr.trackPrayers ? PRAYER_ORDER.every(k => data.prayers[k].prayed):(r.total > 0 && pct >= 0.8);
days.push({d,pct,good});
}
let cur = 0,i = days[0].good ? 0:1;
while(i < days.length && days[i].good){cur++;i++;}
let best = 0,run = 0;
for(const x of days){if(x.good){run++;best = Math.max(best,run);}else run = 0;}
const last7 = days.slice(0,7).reverse();
const avg7 = Math.round(last7.reduce((a,x)=> a + x.pct,0)/ 7 * 100);
return{cur,best,last7,avg7};
});
}
const BADGES =[[3,'🔥'],[7,'⭐'],[30,'🏅'],[100,'🏆']];
function renderMdStats(){
const card = $('mdStatsCard');if(!card)return;
const s = computeStats();
$('stTitle').textContent = ft('stTitle');
$('stTiles').innerHTML = `
    <div class="st-tile"><b>🔥 ${s.cur}</b><span>${esc(ft('stStreak'))}</span></div>
    <div class="st-tile"><b>🏆 ${s.best}</b><span>${esc(ft('stBest'))}</span></div>
    <div class="st-tile"><b>📊 ${s.avg7}%</b><span>${esc(ft('stAvg7'))}</span></div>`;
$('stLast7Lbl').textContent = ft('stLast7');
const wd = new Intl.DateTimeFormat(localeForLang(),{weekday:'narrow'});
$('stBars').innerHTML = s.last7.map((x,i)=> `
    <div class="st-bar${i === 6 ? ' today' : ''}"><div class="st-fill" style="height:${Math.max(4, Math.round(x.pct * 80))}%"></div><span>${esc(wd.format(x.d))}</span></div>`).join('');
$('stBadgesLbl').textContent = ft('stBadges');
$('stBadges').innerHTML = BADGES.map(([n,ic])=> `<span class="st-badge${s.best >= n ? ' on' : ''}">${ic} ${n} ${esc(ft('stUnit', n))}</span>`).join('');
}
function roundRect(g,x,y,w,h,r){
g.beginPath();g.moveTo(x + r,y);g.arcTo(x + w,y,x + w,y + h,r);g.arcTo(x + w,y + h,x,y + h,r);
g.arcTo(x,y + h,x,y,r);g.arcTo(x,y,x + w,y,r);g.closePath();
}
async function buildTimesImage(){
const W = 1080,H = 1350,c = document.createElement('canvas');c.width = W;c.height = H;
const g = c.getContext('2d'),cs = getComputedStyle(document.documentElement);
const v =(n,d)=>(cs.getPropertyValue(n)|| '').trim()|| d;
const g1 = v('--grad1','#3A1470'),g2 = v('--grad2','#123E8C'),amber = v('--amber','#E8B75A'),onA = v('--on-accent','#0A0A18');
const rtl =(LANGUAGES.find(l => l.code === state.lang)||{}).dir === 'rtl';
const serif = "'Amiri','Tajawal',serif",sans = "'Tajawal','Inter',sans-serif";
try{await Promise.all([document.fonts.load(`700 60px ${serif}`),document.fonts.load(`700 40px ${sans}`)]);}catch(e){}
const bg = g.createLinearGradient(0,0,W,H);bg.addColorStop(0,g1);bg.addColorStop(1,g2);
g.fillStyle = bg;g.fillRect(0,0,W,H);
g.fillStyle = 'rgba(255,255,255,0.06)';
[[W * 0.9,H * 0.08,300],[W * 0.05,H * 0.55,220],[W * 0.85,H * 0.92,340]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,Math.PI * 2);g.fill();});
g.direction = rtl ? 'rtl':'ltr';g.textAlign = 'center';g.fillStyle = '#fff';
g.font = `700 74px ${serif}`;g.fillText('🕌  Muslim Day',W / 2,150);
const place = state.settings.lastPlace && state.settings.lastPlace.name;
g.font = `700 42px ${sans}`;g.fillStyle = amber;
if(place)g.fillText(place,W / 2,225);
const now = new Date();
g.fillStyle = 'rgba(255,255,255,0.9)';g.font = `500 34px ${sans}`;
g.fillText(new Intl.DateTimeFormat(localeForLang(),{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now),W / 2,place ? 285:245);
g.fillStyle = 'rgba(255,255,255,0.75)';g.font = `500 30px ${sans}`;
g.fillText(getHijriInfo(now).text,W / 2,place ? 332:292);
const s = t(),tm = state.timings;
const rows =[['Fajr',s.prayerNames.Fajr],['Sunrise',s.extraSunrise],['Dhuhr',s.prayerNames.Dhuhr],['Asr',s.prayerNames.Asr],['Maghrib',s.prayerNames.Maghrib],['Isha',s.prayerNames.Isha]];
const top = 400,rowH = 130,pad = 70;
g.fillStyle = 'rgba(255,255,255,0.14)';roundRect(g,60,top - 20,W - 120,rows.length * rowH + 40,44);g.fill();
rows.forEach(([k,label],i)=>{
const y = top + i * rowH + 82,minor = k === 'Sunrise';
if(i > 0){g.fillStyle = 'rgba(255,255,255,0.16)';g.fillRect(60 + pad,top + i * rowH - 4,W - 120 - pad * 2,2);}
g.fillStyle = minor ? 'rgba(255,255,255,0.7)':'#fff';g.font = `${minor ? 500 : 700} ${minor ? 40 : 50}px ${sans}`;
g.textAlign = rtl ? 'right':'left';g.fillText(label,rtl ? W - 60 - pad:60 + pad,y);
g.fillStyle = minor ? 'rgba(255,255,255,0.7)':amber;g.font = `800 ${minor ? 44 : 60}px 'Inter',${sans}`;
g.direction = 'ltr';g.textAlign = rtl ? 'left':'right';g.fillText((k === 'Sunrise' ?(state.timingsExtra && state.timingsExtra.Sunrise):(tm && tm[k]))|| '—',rtl ? 60 + pad:W - 60 - pad,y);
g.direction = rtl ? 'rtl':'ltr';
});
g.textAlign = 'center';g.fillStyle = 'rgba(255,255,255,0.85)';g.font = `600 30px 'Inter',${sans}`;g.direction = 'ltr';
g.fillText('Muslim Day  ·  By Predax Studio',W / 2,H - 70);
return await new Promise(res => c.toBlob(res,'image/png'));
}
async function shareTimes(){
if(!state.timings){alert(t().setLocFirst);return;}
const btn = $('shareTimesBtn');if(btn)btn.disabled = true;
try{
const blob = await buildTimesImage();
const file = new File([blob],'muslim-day-prayer-times.png',{type:'image/png'});
if(navigator.canShare && navigator.canShare({files:[file]})){
await navigator.share({files:[file],title:'Muslim Day'});
}else{
const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = file.name;
document.body.appendChild(a);a.click();a.remove();setTimeout(()=> URL.revokeObjectURL(a.href),4000);
}
}catch(e){if(!e || e.name !== 'AbortError')console.error(e);}
finally{if(btn)btn.disabled = false;}
}
const AYAT =[
['لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا','البقرة: 286'],
['فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا','الشرح: 5-6'],
['أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ','الرعد: 28'],
['فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ','البقرة: 152'],
['وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ','الطلاق: 2-3'],
['وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ','الطلاق: 3'],
['إِنَّ اللَّهَ مَعَ الصَّابِرِينَ','البقرة: 153'],
['وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا','الإسراء: 23'],
['لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ','الزمر: 53'],
['ادْعُونِي أَسْتَجِبْ لَكُمْ','غافر: 60'],
['وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ','البقرة: 186'],
['وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ','آل عمران: 139'],
['مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ','الضحى: 3'],
['لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ','إبراهيم: 7'],
['لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا','التوبة: 40'],
['وَقُل رَّبِّ زِدْنِي عِلْمًا','طه: 114'],
['وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا','العنكبوت: 69'],
['فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ حَقٌّ','غافر: 55'],
['وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ','آل عمران: 148'],
['وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ','الأعراف: 156'],
['وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ','الحديد: 4'],
['رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ','البقرة: 201'],
];
const HADITH =[
['إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى','متفق عليه'],
['الدِّينُ النَّصِيحَةُ','رواه مسلم'],
['لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ','متفق عليه'],
['مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ','متفق عليه'],
['تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ','رواه الترمذي'],
['خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ','رواه البخاري'],
['الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ','متفق عليه'],
['أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ','متفق عليه'],
['مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ','رواه مسلم'],
['الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ','متفق عليه'],
['إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ','رواه مسلم'],
['لَا تَغْضَبْ','رواه البخاري'],
['اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ','رواه الترمذي'],
['لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ','متفق عليه'],
['الطُّهُورُ شَطْرُ الْإِيمَانِ','رواه مسلم'],
['مَنْ لَا يَرْحَمْ لَا يُرْحَمْ','متفق عليه'],
['مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ','رواه مسلم'],
['أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ','رواه مسلم'],
];
let vdTab = 'ayah',vdShift = 0;
function vdCurrent(){
const list = vdTab === 'ayah' ? AYAT:HADITH;
const dayNo = Math.floor((today0()- new Date(2020,0,1))/ 86400000);
const[text,ref]= list[((dayNo + vdShift)% list.length + list.length)% list.length];
const shown = vdTab === 'ayah' ? `﴿ ${text} ﴾`:`« ${text} »`;
return{shown,ref};
}
function renderVerse(){
const card = $('vdCard');if(!card)return;
card.querySelectorAll('.vd-tabs button').forEach(b =>{
b.classList.toggle('active',b.dataset.t === vdTab);
b.textContent = b.dataset.t === 'ayah' ? ft('vdAyah'):ft('vdHadith');
});
const c = vdCurrent();
$('vdText').textContent = c.shown;$('vdRef').textContent = c.ref;
$('vdShareTxt').textContent = ft('shShare');$('vdNext').textContent = '↻ ' + ft('vdNew');
}
function wrapLines(g,text,maxW){
const words = text.split(/\s+/),lines =[];let cur = '';
for(const w of words){
const test = cur ? cur + ' ' + w:w;
if(g.measureText(test).width > maxW && cur){lines.push(cur);cur = w;}else cur = test;
}
if(cur)lines.push(cur);
return lines;
}
async function shareVerse(){
const W = 1080,H = 1080,c = document.createElement('canvas');c.width = W;c.height = H;
const g = c.getContext('2d'),cs = getComputedStyle(document.documentElement);
const v =(n,d)=>(cs.getPropertyValue(n)|| '').trim()|| d;
const serif = "'Amiri','Tajawal',serif";
try{await document.fonts.load(`700 56px ${serif}`);}catch(e){}
const bg = g.createLinearGradient(0,0,W,H);bg.addColorStop(0,v('--grad1','#3A1470'));bg.addColorStop(1,v('--grad2','#123E8C'));
g.fillStyle = bg;g.fillRect(0,0,W,H);
g.fillStyle = 'rgba(255,255,255,0.06)';
[[W * 0.92,H * 0.1,260],[W * 0.06,H * 0.9,300]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,Math.PI * 2);g.fill();});
g.direction = 'rtl';g.textAlign = 'center';
g.fillStyle = v('--amber','#E8B75A');g.font = `700 44px ${serif}`;
g.fillText(vdTab === 'ayah' ? ft('vdAyah'):ft('vdHadith'),W / 2,130);
const cur = vdCurrent();let size = 64,lines;
for(;size >= 36;size -= 4){g.font = `700 ${size}px ${serif}`;lines = wrapLines(g,cur.shown,W - 200);if(lines.length * size * 1.7 <= 640)break;}
const lh = size * 1.7,top = 520 -(lines.length * lh)/ 2 + lh * 0.7;
g.fillStyle = '#fff';lines.forEach((ln,i)=> g.fillText(ln,W / 2,top + i * lh));
g.fillStyle = v('--amber','#E8B75A');g.font = `700 40px ${serif}`;g.fillText(cur.ref,W / 2,900);
g.direction = 'ltr';g.fillStyle = 'rgba(255,255,255,0.8)';g.font = "600 28px 'Inter',sans-serif";g.fillText('Muslim Day  ·  By Predax Studio',W / 2,H - 60);
const blob = await new Promise(res => c.toBlob(res,'image/png'));
const file = new File([blob],'muslim-day-verse.png',{type:'image/png'});
try{
if(navigator.canShare && navigator.canShare({files:[file]}))await navigator.share({files:[file],title:'Muslim Day'});
else{const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=> URL.revokeObjectURL(a.href),4000);}
}catch(e){if(!e || e.name !== 'AbortError')console.error(e);}
}
let toastTimer = null;
function toast(msg){
let el = $('appToast');
if(!el){el = document.createElement('div');el.id = 'appToast';el.className = 'app-toast';el.setAttribute('role','status');document.body.appendChild(el);}
el.textContent = msg;el.classList.add('show');
clearTimeout(toastTimer);toastTimer = setTimeout(()=> el.classList.remove('show'),2600);
}
function markPrayed(key){
if(!PRAYER_ORDER.includes(key))return;
updateDayField(new Date(),(d)=>{d.prayers[key].prayed = true;});
toast(XT('prayedLogged')(t().prayerNames[key]));
}
const A11Y_KEY = 'salati_a11y';
const FS_STEPS =[0.9,1,1.15,1.3];
let a11y ={fs:1,contrast:false,reduce:false};
function a11yLoad(){try{const r = JSON.parse(localStorage.getItem(A11Y_KEY)|| 'null');if(r)a11y ={...a11y,...r};}catch(e){}}
function a11yApply(){
const r = document.documentElement;
r.style.setProperty('--fs',String(a11y.fs));
if(a11y.contrast)r.setAttribute('data-contrast','high');else r.removeAttribute('data-contrast');
if(a11y.reduce)r.setAttribute('data-motion','reduce');else r.removeAttribute('data-motion');
try{localStorage.setItem(A11Y_KEY,JSON.stringify(a11y));}catch(e){}
}
function renderA11y(){
const card = $('a11yCard');if(!card)return;
$('a11yTitle').textContent = ft('a11yTitle');$('a11yFontLbl').textContent = ft('a11yFont');
const names =['a11yS','a11yM','a11yL','a11yXL'];
$('a11ySizes').innerHTML = FS_STEPS.map((v,i)=> `<button type="button" class="a11y-size${v === a11y.fs ? ' active' : ''}" data-fs="${v}" style="font-size:${12 + i * 2}px">${esc(ft(names[i]))}</button>`).join('');
$('a11yContrastTitle').textContent = ft('a11yContrast');$('a11yContrastHint').textContent = ft('a11yContrastHint');
$('a11yMotionTitle').textContent = ft('a11yMotion');
$('a11yContrast').checked = !!a11y.contrast;$('a11yMotion').checked = !!a11y.reduce;
}
function inject(){
const mdBtn = $('openMuslimDayBtn');
if(mdBtn && !$('occStrip')){
mdBtn.insertAdjacentHTML('afterend',`
      <button type="button" class="strip-card occ-strip" id="occStrip">
        <span class="strip-body">
          <span class="strip-title" id="occStripTitle">—</span>
          <span class="occ-strip-name" id="occStripName">—</span>
          <span class="strip-progress-text" id="occStripWhen"></span>
        </span>
        <span class="strip-cta"><span id="occStripCta">—</span><span class="chevron">›</span></span>
      </button>`);
}
const occS = $('occStrip');
if(occS && !$('vdCard')){
occS.insertAdjacentHTML('afterend',`
      <div class="card vd-card" id="vdCard">
        <div class="vd-tabs"><button type="button" data-t="ayah"></button><button type="button" data-t="hadith"></button></div>
        <div class="vd-text" id="vdText"></div>
        <div class="vd-ref" id="vdRef"></div>
        <div class="vd-actions">
          <button type="button" class="ghost small" id="vdShare">📤 <span id="vdShareTxt">—</span></button>
          <button type="button" class="ghost small" id="vdNext">↻</button>
        </div>
      </div>`);
}
if(!$('a11yCard')){
const anchor =(($('themeGrid')&& $('themeGrid').closest('.card'))|| null);
const html = `
      <div class="card" id="a11yCard">
        <h3 class="section-title" style="font-size:16px;"><span>♿</span><span id="a11yTitle">—</span></h3>
        <div class="settings-sub-title" id="a11yFontLbl" style="margin-top:10px;">—</div>
        <div class="a11y-sizes" id="a11ySizes"></div>
        <div class="home-toggle" style="margin-top:12px;">
          <div><div class="toggle-title" id="a11yContrastTitle">—</div><div class="toggle-desc" id="a11yContrastHint">—</div></div>
          <label class="switch"><input type="checkbox" id="a11yContrast"><span class="slider"></span></label>
        </div>
        <div class="home-toggle">
          <div><div class="toggle-title" id="a11yMotionTitle">—</div></div>
          <label class="switch"><input type="checkbox" id="a11yMotion"><span class="slider"></span></label>
        </div>
      </div>`;
if(anchor)anchor.insertAdjacentHTML('afterend',html);
else{const sl = document.querySelector('.studio-link');if(sl)sl.insertAdjacentHTML('beforebegin',html);}
}
const az = $('view-azkar');
if(az && !$('openTasbihBtn')){
const h2 = az.querySelector('h2');
(h2 || az.firstChild).insertAdjacentHTML(h2 ? 'afterend':'beforebegin',`
      <button type="button" class="strip-card tasbih-strip" id="openTasbihBtn">
        <span class="strip-body"><span class="strip-title">📿 <span id="openTasbihTitle">—</span></span></span>
        <span class="strip-cta"><span class="chevron">›</span></span>
      </button>`);
}
const month = $('mdMonthlyBox');
if(month && !$('mdStatsCard')){
month.insertAdjacentHTML('beforebegin',`
      <div class="card" id="mdStatsCard">
        <h3 class="section-title" style="font-size:16px;"><span>📊</span><span id="stTitle">—</span></h3>
        <div class="st-tiles" id="stTiles"></div>
        <div class="st-sub" id="stLast7Lbl"></div>
        <div class="st-bars" id="stBars"></div>
        <div class="st-sub" id="stBadgesLbl"></div>
        <div class="st-badges" id="stBadges"></div>
      </div>`);
}
const lbl = document.querySelector('#nextPrayerCard .hero-times-label');
if(lbl && !$('shareTimesBtn')){
lbl.insertAdjacentHTML('beforeend',`<button type="button" class="share-times-btn" id="shareTimesBtn">📤 <span id="shareTimesTxt">—</span></button>`);
}
if(!$('occOverlay')){
document.body.insertAdjacentHTML('beforeend',`
    <div class="lang-sheet-overlay" id="occOverlay">
      <div class="lang-sheet occ-sheet">
        <h3 id="occSheetTitle">—</h3>
        <div class="occ-nav">
          <button class="md-arrow" id="occPrev" type="button" aria-label="prev">‹</button>
          <div class="occ-month" id="occMonthTitle">—</div>
          <button class="md-arrow" id="occNext" type="button" aria-label="next">›</button>
        </div>
        <div class="occ-grid" id="occGrid"></div>
        <div class="occ-list" id="occList"></div>
        <div class="occ-note" id="occNote"></div>
        <div class="home-toggle occ-remind">
          <div><div class="toggle-title" id="occRemindTitle">—</div><div class="toggle-desc" id="occRemindHint">—</div></div>
          <label class="switch"><input type="checkbox" id="occRemindToggle"><span class="slider"></span></label>
        </div>
        <button class="primary" id="occClose" type="button" style="margin:10px 16px 4px; width:calc(100% - 32px);"><span id="occCloseTxt">OK</span></button>
      </div>
    </div>
    <div class="lang-sheet-overlay" id="tasbihOverlay">
      <div class="lang-sheet tasbih-sheet">
        <h3 id="tsTitle">—</h3>
        <div class="ts-chips" id="tsChips"></div>
        <div class="ts-dhikr" id="tsDhikr"></div>
        <button type="button" class="ts-tap" id="tsTap"><span class="ts-count" id="tsCount">0</span><small id="tsHint"></small></button>
        <div class="ts-target-row"><span id="tsTargetLbl">—</span><div class="ts-targets" id="tsTargets"></div></div>
        <div class="ts-stats"><div class="ts-stat" id="tsToday"></div><div class="ts-stat" id="tsAll"></div></div>
        <div class="ts-actions">
          <button class="ghost small" id="tsReset" type="button">—</button>
          <button class="ghost small" id="tsVib" type="button">—</button>
        </div>
        <button class="primary" id="tsClose" type="button" style="margin:8px 16px 4px; width:calc(100% - 32px);"><span id="tsCloseTxt">OK</span></button>
      </div>
    </div>`);
}
}
function bind(){
const open =(id)=> $(id).classList.add('active'),close =(id)=> $(id).classList.remove('active');
$('occStrip').addEventListener('click',()=>{occOffset = 0;renderOccSheet();open('occOverlay');});
$('occClose').addEventListener('click',()=> close('occOverlay'));
$('occOverlay').addEventListener('click',(e)=>{if(e.target.id === 'occOverlay')close('occOverlay');});
$('occPrev').addEventListener('click',()=>{occOffset--;renderOccSheet();});
$('occNext').addEventListener('click',()=>{occOffset++;renderOccSheet();});
$('occRemindToggle').addEventListener('change',async(e)=>{
localStorage.setItem('salati_occ_remind',e.target.checked ? '1':'0');
if(e.target.checked && 'Notification' in window && Notification.permission === 'default'){try{await Notification.requestPermission();}catch(err){}}
if(e.target.checked)checkOccReminders();
});
$('openTasbihBtn').addEventListener('click',()=>{renderTasbih();open('tasbihOverlay');});
$('tsClose').addEventListener('click',()=> close('tasbihOverlay'));
$('tasbihOverlay').addEventListener('click',(e)=>{if(e.target.id === 'tasbihOverlay')close('tasbihOverlay');});
$('tsTap').addEventListener('click',tsTap);
$('tsChips').addEventListener('click',(e)=>{const b = e.target.closest('.ts-chip');if(!b)return;ts.dhikr = Number(b.dataset.i);ts.count = 0;tsSave();renderTasbih();});
$('tsTargets').addEventListener('click',(e)=>{const b = e.target.closest('.ts-target');if(!b)return;ts.target = Number(b.dataset.n);tsSave();renderTasbih();});
$('tsReset').addEventListener('click',()=>{ts.count = 0;tsSave();renderTasbih();});
$('tsVib').addEventListener('click',()=>{ts.vib = !ts.vib;tsSave();renderTasbih();});
$('shareTimesBtn').addEventListener('click',shareTimes);
$('vdCard').querySelectorAll('.vd-tabs button').forEach(b => b.addEventListener('click',()=>{vdTab = b.dataset.t;vdShift = 0;renderVerse();}));
$('vdNext').addEventListener('click',()=>{vdShift++;renderVerse();});
$('vdShare').addEventListener('click',shareVerse);
const a = $('a11yCard');
if(a){
$('a11ySizes').addEventListener('click',(e)=>{const b = e.target.closest('.a11y-size');if(!b)return;a11y.fs = Number(b.dataset.fs);a11yApply();renderA11y();});
$('a11yContrast').addEventListener('change',(e)=>{a11y.contrast = e.target.checked;a11yApply();});
$('a11yMotion').addEventListener('change',(e)=>{a11y.reduce = e.target.checked;a11yApply();});
}
if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',(e)=>{if(e.data && e.data.type === 'mark-prayed')markPrayed(e.data.prayer);});
}
function renderExtras(){
renderOccStrip();
const sb = $('shareTimesTxt');if(sb)sb.textContent = ft('shShare');
renderTasbih();
renderVerse();
renderA11y();
renderMdStats();
if($('occOverlay')&& $('occOverlay').classList.contains('active'))renderOccSheet();
}
const _applyLanguage = applyLanguage;
applyLanguage = function(){const r = _applyLanguage.apply(this,arguments);try{renderExtras();}catch(e){console.error(e);}return r;};
const _renderMuslimDay = renderMuslimDay;
renderMuslimDay = function(){const r = _renderMuslimDay.apply(this,arguments);try{renderMdStats();}catch(e){console.error(e);}return r;};
window.SalatiX ={today0,addDays,esc,toast,withStoreCache,hparts,hShift,markPrayed,refresh:()=> renderExtras()};
tsLoad();
a11yLoad();a11yApply();
inject();
bind();
renderExtras();
try{
const q = new URLSearchParams(location.search).get('prayed');
if(q){markPrayed(q);history.replaceState(null,'',location.pathname);}
}catch(e){}
checkOccReminders();
setInterval(()=>{renderOccStrip();checkOccReminders();},60 * 60 * 1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){renderOccStrip();checkOccReminders();}});
})();
