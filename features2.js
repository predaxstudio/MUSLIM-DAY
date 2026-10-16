(function(){
'use strict';
const X = window.SalatiX;
if(!X)return;
const{today0,addDays,esc,toast,withStoreCache}= X;
const $ =(id)=> document.getElementById(id);
const F2 ={
advTitle:{ar:'التذكيرات والتخصيص',en:'Reminders & customization',fr:'Rappels et personnalisation',es:'Recordatorios y personalización',zh:'提醒与个性化',ru:'Напоминания и настройки',tr:'Hatırlatmalar ve özelleştirme'},
hjTitle:{ar:'تصحيح التاريخ الهجري',en:'Hijri date adjustment',fr:'Ajustement de la date hégirienne',es:'Ajuste de la fecha hégira',zh:'伊斯兰历日期校正',ru:'Коррекция даты хиджры',tr:'Hicri tarih düzeltmesi'},
hjHint:{ar:'إن اختلف تاريخ بلدك عن المحسوب، عدّله يومًا. يؤثر على المناسبات والأيام البيض.',en:'If your country’s date differs, shift it by a day. Affects occasions and White Days.',fr:'Si la date de votre pays diffère, décalez-la d’un jour. Cela affecte les occasions et les jours blancs.',es:'Si la fecha de tu país difiere, desplázala un día. Afecta a las fechas y a los días blancos.',zh:'如果您所在国家的日期不同，可调整一天，会影响节日和白日。',ru:'Если дата в вашей стране отличается, сдвиньте её на день. Влияет на даты и белые дни.',tr:'Ülkenizdeki tarih farklıysa bir gün kaydırın. Özel günleri ve Eyyâm-ı Bîd’i etkiler.'},
hjVal:{ar:n=>n===0?'بدون تعديل':`${n>0?'+':''}${n} يوم`,en:n=>n===0?'No adjustment':`${n>0?'+':''}${n} day(s)`,fr:n=>n===0?'Aucun ajustement':`${n>0?'+':''}${n} jour(s)`,es:n=>n===0?'Sin ajuste':`${n>0?'+':''}${n} día(s)`,zh:n=>n===0?'不调整':`${n>0?'+':''}${n} 天`,ru:n=>n===0?'Без коррекции':`${n>0?'+':''}${n} дн.`,tr:n=>n===0?'Düzeltme yok':`${n>0?'+':''}${n} gün`},
atTitle:{ar:'الثيم التلقائي',en:'Automatic theme',fr:'Thème automatique',es:'Tema automático',zh:'自动主题',ru:'Автотема',tr:'Otomatik tema'},
atHint:{ar:'ليلي بعد المغرب وصباحي بعد الفجر',en:'Night theme after Maghrib, day theme after Fajr',fr:'Thème de nuit après le Maghrib, de jour après le Fajr',es:'Tema nocturno tras el Maghrib y diurno tras el Fajr',zh:'昏礼后切换夜间主题，晨礼后切换日间主题',ru:'Ночная тема после Магриба, дневная после Фаджра',tr:'Akşamdan sonra gece, sabahtan sonra gündüz teması'},
atDay:{ar:'ثيم النهار',en:'Day theme',fr:'Thème de jour',es:'Tema de día',zh:'日间主题',ru:'Дневная тема',tr:'Gündüz teması'},
atNight:{ar:'ثيم الليل',en:'Night theme',fr:'Thème de nuit',es:'Tema de noche',zh:'夜间主题',ru:'Ночная тема',tr:'Gece teması'},
qiyamTitle:{ar:'تنبيه قيام الليل',en:'Night prayer alert',fr:'Alerte prière de nuit',es:'Aviso de oración nocturna',zh:'夜间礼拜提醒',ru:'Напоминание о ночном намазе',tr:'Gece namazı uyarısı'},
qiyamHint:{ar:'عند بداية الثلث الأخير من الليل',en:'At the start of the last third of the night',fr:'Au début du dernier tiers de la nuit',es:'Al inicio del último tercio de la noche',zh:'在夜晚最后三分之一开始时',ru:'В начале последней трети ночи',tr:'Gecenin son üçte birinin başında'},
qiyamNotifT:{ar:'الثلث الأخير من الليل',en:'Last third of the night',fr:'Dernier tiers de la nuit',es:'Último tercio de la noche',zh:'夜晚最后三分之一',ru:'Последняя треть ночи',tr:'Gecenin son üçte biri'},
qiyamNotifB:{ar:'وقت إجابة الدعاء وقيام الليل',en:'A time for prayer, dua and night worship',fr:'Un moment pour prier et invoquer',es:'Momento para orar y suplicar',zh:'适合礼拜与祈祷的时刻',ru:'Время для намаза и дуа',tr:'Namaz ve dua vakti'},
friTitle:{ar:'تذكير الجمعة',en:'Friday reminders',fr:'Rappels du vendredi',es:'Recordatorios del viernes',zh:'主麻日提醒',ru:'Напоминания пятницы',tr:'Cuma hatırlatmaları'},
friHint:{ar:'صباح الجمعة وقبل صلاة الجمعة بنصف ساعة',en:'Friday morning and 30 minutes before Jumu’ah',fr:'Vendredi matin et 30 min avant la prière du Joumou’a',es:'Viernes por la mañana y 30 min antes del Yumu’a',zh:'周五早晨及主麻拜前30分钟',ru:'Утром в пятницу и за 30 минут до джума-намаза',tr:'Cuma sabahı ve Cuma namazından 30 dk önce'},
friMornT:{ar:'يوم الجمعة',en:'It’s Friday',fr:'C’est vendredi',es:'Es viernes',zh:'今天是主麻日',ru:'Сегодня пятница',tr:'Bugün Cuma'},
friMornB:{ar:'اقرأ سورة الكهف وأكثر من الصلاة على النبي ﷺ',en:'Read Surah Al-Kahf and send abundant blessings on the Prophet ﷺ',fr:'Lisez la sourate Al-Kahf et priez abondamment sur le Prophète ﷺ',es:'Lee la sura Al-Kahf y bendice mucho al Profeta ﷺ',zh:'诵读《山洞章》，多多为先知ﷺ祈福',ru:'Прочтите суру «Аль-Кахф» и чаще благословляйте Пророка ﷺ',tr:'Kehf suresini okuyun, Peygamber ﷺ’e çokça salavat getirin'},
friPreT:{ar:'صلاة الجمعة بعد نصف ساعة',en:'Jumu’ah prayer in 30 minutes',fr:'Prière du Joumou’a dans 30 minutes',es:'Oración del Yumu’a en 30 minutos',zh:'主麻拜将在30分钟后开始',ru:'Джума-намаз через 30 минут',tr:'Cuma namazına 30 dakika kaldı'},
friPreB:{ar:'اغتسل وتطيّب وبكّر إلى المسجد',en:'Perform ghusl, wear perfume and go early to the mosque',fr:'Faites le ghusl, parfumez-vous et partez tôt à la mosquée',es:'Haz el ghusl, perfúmate y ve temprano a la mezquita',zh:'沐浴、涂香，早些前往清真寺',ru:'Совершите гусль, воспользуйтесь благовониями и отправляйтесь в мечеть пораньше',tr:'Gusül alın, güzel koku sürün ve camiye erken gidin'},
kidsBtn:{ar:'وضع الأطفال',en:'Kids mode',fr:'Mode enfants',es:'Modo infantil',zh:'儿童模式',ru:'Детский режим',tr:'Çocuk modu'},
kidsGreat:{ar:'أحسنت يا بطل! 🌟',en:'Well done, champion! 🌟',fr:'Bravo champion ! 🌟',es:'¡Bien hecho, campeón! 🌟',zh:'太棒了，小冠军！🌟',ru:'Молодец, чемпион! 🌟',tr:'Aferin şampiyon! 🌟'},
kidsAllDone:{ar:'أتممت صلوات اليوم كلها! 🏆',en:'You finished all of today’s prayers! 🏆',fr:'Tu as fait toutes les prières du jour ! 🏆',es:'¡Terminaste todas las oraciones de hoy! 🏆',zh:'你完成了今天所有的礼拜！🏆',ru:'Ты совершил все намазы за сегодня! 🏆',tr:'Bugünkü tüm namazları kıldın! 🏆'},
kidsTap:{ar:'المس النجمة بعد أن تصلي',en:'Tap the star after you pray',fr:'Touche l’étoile après ta prière',es:'Toca la estrella después de rezar',zh:'礼拜后点一下星星',ru:'Нажми на звезду после намаза',tr:'Namazdan sonra yıldıza dokun'},
kidsExit:{ar:'اضغط مطولًا للخروج',en:'Press and hold to exit',fr:'Appuyez longuement pour quitter',es:'Mantén pulsado para salir',zh:'长按退出',ru:'Нажмите и удерживайте для выхода',tr:'Çıkmak için basılı tutun'},
kidsStars:{ar:n=>`${n} من 5 نجوم`,en:n=>`${n} of 5 stars`,fr:n=>`${n} sur 5 étoiles`,es:n=>`${n} de 5 estrellas`,zh:n=>`${n}/5 颗星`,ru:n=>`${n} из 5 звёзд`,tr:n=>`${n}/5 yıldız`},
tlGuide:{ar:'دليل الصلاة',en:'Prayer guide',fr:'Guide de prière',es:'Guía de oración',zh:'礼拜指南',ru:'Руководство',tr:'Namaz rehberi'},
tlNames:{ar:'الأسماء الحسنى',en:'Names of Allah',fr:'Noms d’Allah',es:'Nombres de Allah',zh:'真主尊名',ru:'Имена Аллаха',tr:'Esmâü’l-Hüsnâ'},
tlKids:{ar:'الأطفال',en:'Kids',fr:'Enfants',es:'Niños',zh:'儿童',ru:'Дети',tr:'Çocuk'},
nmTitle:{ar:'أسماء الله الحسنى',en:'The Names of Allah',fr:'Les Noms d’Allah',es:'Los Nombres de Allah',zh:'真主的尊名',ru:'Имена Аллаха',tr:'Esmâü’l-Hüsnâ'},
nmToday:{ar:'اسم اليوم',en:'Name of the day',fr:'Nom du jour',es:'Nombre del día',zh:'今日尊名',ru:'Имя дня',tr:'Günün ismi'},
nmList:{ar:'القائمة',en:'List',fr:'Liste',es:'Lista',zh:'列表',ru:'Список',tr:'Liste'},
nmQuiz:{ar:'اختبار',en:'Quiz',fr:'Quiz',es:'Prueba',zh:'测验',ru:'Викторина',tr:'Test'},
nmQ:{ar:'ما معنى هذا الاسم؟',en:'What does this name mean?',fr:'Que signifie ce nom ?',es:'¿Qué significa este nombre?',zh:'这个尊名是什么意思？',ru:'Что означает это имя?',tr:'Bu ismin anlamı nedir?'},
nmScore:{ar:(c,n)=>`النتيجة: ${c} / ${n}`,en:(c,n)=>`Score: ${c} / ${n}`,fr:(c,n)=>`Score : ${c} / ${n}`,es:(c,n)=>`Puntuación: ${c} / ${n}`,zh:(c,n)=>`得分：${c} / ${n}`,ru:(c,n)=>`Счёт: ${c} / ${n}`,tr:(c,n)=>`Skor: ${c} / ${n}`},
nmNext:{ar:'التالي',en:'Next',fr:'Suivant',es:'Siguiente',zh:'下一个',ru:'Далее',tr:'Sonraki'},
nmNote:{ar:'',en:'',fr:'Les sens sont affichés en anglais',es:'Los significados se muestran en inglés',zh:'含义以英文显示',ru:'Значения показаны на английском',tr:'Anlamlar İngilizce gösterilir'},
gdTitle:{ar:'دليل الصلاة والوضوء',en:'Prayer & wudu guide',fr:'Guide de la prière et du wudu',es:'Guía de oración y wudu',zh:'礼拜与小净指南',ru:'Руководство: намаз и омовение',tr:'Namaz ve abdest rehberi'},
gdWudu:{ar:'الوضوء',en:'Wudu',fr:'Wudu',es:'Wudu',zh:'小净',ru:'Омовение',tr:'Abdest'},
gdPrayer:{ar:'الصلاة',en:'Prayer',fr:'Prière',es:'Oración',zh:'礼拜',ru:'Намаз',tr:'Namaz'},
gdRakaat:{ar:'الركعات',en:'Rak‘ahs',fr:'Rakaat',es:'Rak‘as',zh:'拜数',ru:'Ракааты',tr:'Rekâtlar'},
gdUnit:{ar:'ركعات',en:'rak‘ahs',fr:'rakaat',es:'rak‘as',zh:'拜',ru:'ракята',tr:'rekât'},
qdTitle:{ar:'الصلوات الفائتة (القضاء)',en:'Missed prayers (qada)',fr:'Prières manquées (qada)',es:'Oraciones perdidas (qada)',zh:'补礼拜（盖达）',ru:'Пропущенные намазы (када)',tr:'Kaza namazları'},
qdHint:{ar:'اكتب عدد ما عليك من كل صلاة',en:'Enter how many of each prayer you owe',fr:'Saisissez combien de chaque prière vous devez',es:'Escribe cuántas de cada oración debes',zh:'输入每种礼拜欠的数量',ru:'Укажите, сколько каждого намаза нужно восполнить',tr:'Her namazdan kaç tane borcunuz olduğunu girin'},
qdTotal:{ar:n=>`المتبقي: ${n}`,en:n=>`Remaining: ${n}`,fr:n=>`Restant : ${n}`,es:n=>`Restante: ${n}`,zh:n=>`剩余：${n}`,ru:n=>`Осталось: ${n}`,tr:n=>`Kalan: ${n}`},
qdPace:{ar:'وتيرتي اليومية',en:'My daily pace',fr:'Mon rythme quotidien',es:'Mi ritmo diario',zh:'我的每日进度',ru:'Мой темп в день',tr:'Günlük hızım'},
qdEta:{ar:d=>d === 1 ? 'ينتهي القضاء خلال يوم واحد':(d === 2 ? 'ينتهي القضاء خلال يومين':`ينتهي القضاء بعد نحو ${d} ${d <= 10 ? 'أيام' : 'يومًا'}`),en:d=>`About ${d} days to finish`,fr:d=>`Environ ${d} jours pour terminer`,es:d=>`Unos ${d} días para terminar`,zh:d=>`约 ${d} 天完成`,ru:d=>`Примерно ${d} дн. до завершения`,tr:d=>`Yaklaşık ${d} günde biter`},
qdDone:{ar:'قضيت',en:'Made up',fr:'Rattrapée',es:'Recuperada',zh:'已补',ru:'Восполнил',tr:'Kıldım'},
qdAllClear:{ar:'ما شاء الله، لا شيء متبقٍّ ✓',en:'Masha’Allah, nothing remaining ✓',fr:'Macha’Allah, rien à rattraper ✓',es:'Masha’Allah, nada pendiente ✓',zh:'玛莎安拉，已全部补完 ✓',ru:'Маша’Аллах, ничего не осталось ✓',tr:'Maşallah, kalan yok ✓'},
rpBtn:{ar:'تقرير الشهر',en:'Monthly report',fr:'Rapport mensuel',es:'Informe mensual',zh:'月度报告',ru:'Отчёт за месяц',tr:'Aylık rapor'},
rpStreak:{ar:'أفضل سلسلة',en:'Best streak',fr:'Meilleure série',es:'Mejor racha',zh:'最佳连续',ru:'Лучшая серия',tr:'En iyi seri'},
rpComplete:{ar:'إتمام الصلوات',en:'Prayer completion',fr:'Prières accomplies',es:'Oraciones completadas',zh:'礼拜完成率',ru:'Выполнение намазов',tr:'Namaz tamamlama'},
rpDays:{ar:n=>n <= 10 ?(n === 1 ? 'يوم':(n === 2 ? 'يومان':'أيام')):'يومًا',en:'days',fr:'jours',es:'días',zh:'天',ru:'дн.',tr:'gün'},
};
const f2 =(k,...a)=>{const d = F2[k];const v = d[state.lang]|| d.en;return typeof v === 'function' ? v(...a):v;};
const lsGet =(k,d)=>{try{const v = localStorage.getItem(k);return v === null ? d:v;}catch(e){return d;}};
const lsSet =(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const jsonGet =(k,d)=>{try{const r = JSON.parse(localStorage.getItem(k)|| 'null');return r ?{...d,...r}:d;}catch(e){return d;}};
const openSheet =(id)=> $(id).classList.add('active');
const closeSheet =(id)=> $(id).classList.remove('active');
async function notify(title,body,tag){
if(isQuietMode())return;
try{
const reg =(navigator.serviceWorker && navigator.serviceWorker.getRegistration)? await navigator.serviceWorker.getRegistration():null;
if(reg && reg.showNotification){await reg.showNotification(title,{body,icon:'icons/icon-192.png',tag});return;}
new Notification(title,{body,icon:'icons/icon-192.png'});
}catch(e){}
}
const hasNotif =()=>('Notification' in window)&& Notification.permission === 'granted';
async function askNotifPerm(){if('Notification' in window && Notification.permission === 'default'){try{await Notification.requestPermission();}catch(e){}}}
function hjSet(n){
n = Math.max(-2,Math.min(2,n));
lsSet('salati_hijri_off',String(n));
renderAdv();X.refresh();
try{renderMuslimDay();}catch(e){}
}
let at ={on:false,day:'fajr',night:'layl'};
function isNightNow(){
const tm = state.timings;
if(!tm || !tm.Fajr || !tm.Maghrib){const h = new Date().getHours();return h >= 19 || h < 5;}
const now = Date.now();
return now >= zonedTime(tm.Maghrib,0).getTime()|| now < zonedTime(tm.Fajr,0).getTime();
}
function autoThemeTick(force){
if(!at.on)return;
const period = isNightNow()? 'night':'day';
if(!force && lsGet('salati_at_period','')=== period)return;
lsSet('salati_at_period',period);
const id = at[period];
if(id && id !== state.theme && THEMES.some(t => t.id === id))applyTheme(id);
}
function fillThemeSelects(){
const names = THEME_NAMES[state.lang]|| THEME_NAMES.en;
const opts = THEME_GROUPS.map(g => `<optgroup label="${esc((THEME_GROUP_TITLE[g.key][state.lang] || THEME_GROUP_TITLE[g.key].en))}">${g.ids.map(id => `<option value="${id}">${esc(names[id] || id)}</option>`).join('')}</optgroup>`).join('');
['atDay','atNight'].forEach(id =>{const el = $(id);if(el){el.innerHTML = opts;el.value = at[id === 'atDay' ? 'day':'night'];}});
}
function fireOnce2(id){
let a =[];try{a = JSON.parse(lsGet('salati_rem_fired','[]'));}catch(e){}
if(a.includes(id))return false;
a.push(id);lsSet('salati_rem_fired',JSON.stringify(a.slice(-40)));
return true;
}
function remindTick(){
if(window.SALATI_NATIVE || isQuietMode()|| !hasNotif())return;
const now = Date.now(),d = new Date(),key = d.getFullYear()+ '-' +(d.getMonth()+ 1)+ '-' + d.getDate();
if(lsGet('salati_qiyam','0')=== '1' && state.timingsExtra && state.timingsExtra.Lastthird){
const t0 = zonedTime(state.timingsExtra.Lastthird,0).getTime();
if(now >= t0 && now - t0 <= 90000 && fireOnce2('q-' + key))notify(f2('qiyamNotifT'),f2('qiyamNotifB'),'salati-qiyam');
}
if(lsGet('salati_friday','0')=== '1' && d.getDay()=== 5){
const m0 = new Date(d.getFullYear(),d.getMonth(),d.getDate(),8,0).getTime();
if(now >= m0 && now - m0 <= 2 * 3600000 && fireOnce2('fm-' + key))notify(f2('friMornT'),f2('friMornB'),'salati-friday');
if(state.timings && state.timings.Dhuhr){
const dh = zonedTime(state.timings.Dhuhr,0).getTime();
if(now >= dh - 30 * 60000 && now < dh && fireOnce2('fp-' + key))notify(f2('friPreT'),f2('friPreB'),'salati-friday');
}
}
}
let qd ={Fajr:0,Dhuhr:0,Asr:0,Maghrib:0,Isha:0,pace:2};
const qdSave =()=> lsSet('salati_qada',JSON.stringify(qd));
function renderQada(){
const card = $('qdCard');if(!card)return;
const names = t().prayerNames;
$('qdTitle').textContent = f2('qdTitle');$('qdHint').textContent = f2('qdHint');
$('qdRows').innerHTML = PRAYER_ORDER.map(k => `
    <div class="qd-row" data-k="${k}"><span class="qd-name">${esc(names[k])}</span>
      <input type="number" class="qd-input" min="0" max="99999" inputmode="numeric" value="${qd[k]}">
      <button type="button" class="ghost small qd-done">✓ ${esc(f2('qdDone'))}</button></div>`).join('');
const total = PRAYER_ORDER.reduce((a,k)=> a +(Number(qd[k])|| 0),0);
$('qdPaceLbl').textContent = f2('qdPace');$('qdPace').value = qd.pace;
$('qdTotal').textContent = total > 0 ? f2('qdTotal',total):f2('qdAllClear');
$('qdEta').textContent = total > 0 ? f2('qdEta',Math.ceil(total / Math.max(1,Number(qd.pace)|| 1))):'';
}
const NAMES =[
['الله','الإله المعبود بحق','The One true God worthy of worship'],['الرحمن','واسع الرحمة بجميع خلقه','The Most Gracious'],['الرحيم','الرحيم بالمؤمنين','The Most Merciful'],['الملك','صاحب الملك التام','The King'],['القدوس','المنزّه عن كل نقص','The Most Holy'],
['السلام','السالم من كل عيب','The Source of Peace'],['المؤمن','المصدّق لرسله ومانح الأمان','The Giver of Security'],['المهيمن','الرقيب الحافظ لكل شيء','The Guardian'],['العزيز','الغالب الذي لا يُغلب','The Almighty'],['الجبار','القاهر الذي يجبر الكسر','The Compeller'],
['المتكبر','المتعالي عن صفات الخلق','The Supreme'],['الخالق','المقدّر والموجد للأشياء','The Creator'],['البارئ','الموجد للخلق على غير مثال','The Evolver'],['المصور','الذي يصوّر خلقه كما شاء','The Fashioner'],['الغفار','كثير المغفرة للذنوب','The Constant Forgiver'],
['القهار','الغالب لكل شيء','The All-Subduer'],['الوهاب','كثير العطاء بلا مقابل','The Bestower'],['الرزاق','المتكفل بأرزاق خلقه','The Provider'],['الفتاح','فاتح أبواب الرحمة والرزق','The Opener'],['العليم','الذي يعلم كل شيء','The All-Knowing'],
['القابض','الذي يقبض الأرزاق والأرواح','The Withholder'],['الباسط','الذي يبسط الرزق لمن يشاء','The Extender'],['الخافض','الذي يخفض من يشاء','The Reducer'],['الرافع','الذي يرفع من يشاء','The Exalter'],['المعز','الذي يعزّ من يشاء','The Honourer'],
['المذل','الذي يذلّ من يشاء','The Abaser'],['السميع','الذي يسمع كل صوت','The All-Hearing'],['البصير','الذي يرى كل شيء','The All-Seeing'],['الحكم','الفاصل بين خلقه بالحق','The Judge'],['العدل','المنزّه عن الظلم','The Utterly Just'],
['اللطيف','الرفيق بعباده الخبير بدقائق الأمور','The Subtle, Most Kind'],['الخبير','العالم ببواطن الأمور','The All-Aware'],['الحليم','الذي لا يعجل بالعقوبة','The Forbearing'],['العظيم','ذو العظمة والجلال','The Magnificent'],['الغفور','كثير الستر والمغفرة','The Great Forgiver'],
['الشكور','يثيب على القليل الكثير','The Appreciative'],['العلي','المرتفع فوق كل شيء','The Most High'],['الكبير','ذو الكبرياء','The Most Great'],['الحفيظ','الحافظ لكل شيء','The Preserver'],['المقيت','المتكفل بالأقوات','The Sustainer'],
['الحسيب','الكافي والمحاسب لعباده','The Reckoner'],['الجليل','ذو الجلال والعظمة','The Majestic'],['الكريم','كثير الخير والعطاء','The Most Generous'],['الرقيب','المراقب لكل شيء','The Watchful'],['المجيب','الذي يجيب دعاء من دعاه','The Responsive'],
['الواسع','واسع العلم والرحمة والعطاء','The All-Encompassing'],['الحكيم','الذي يضع الأمور في مواضعها','The All-Wise'],['الودود','المحب لعباده الصالحين','The Loving'],['المجيد','العظيم الكريم','The Glorious'],['الباعث','يبعث الخلق يوم القيامة','The Resurrector'],
['الشهيد','الشاهد على كل شيء','The Witness'],['الحق','الثابت الذي لا شك فيه','The Truth'],['الوكيل','المتولي أمور عباده','The Trustee'],['القوي','صاحب القوة الكاملة','The Strong'],['المتين','شديد القوة الذي لا يضعف','The Firm'],
['الولي','الناصر والمتولي لعباده المؤمنين','The Protecting Friend'],['الحميد','المستحق للحمد','The Praiseworthy'],['المحصي','الذي أحصى كل شيء عددًا','The Reckoner of All'],['المبدئ','الذي بدأ الخلق','The Originator'],['المعيد','الذي يعيد الخلق بعد فنائه','The Restorer'],
['المحيي','واهب الحياة','The Giver of Life'],['المميت','الذي يقدّر الموت على من يشاء','The Bringer of Death'],['الحي','الذي لا يموت','The Ever-Living'],['القيوم','القائم بنفسه المقيم لغيره','The Self-Subsisting'],['الواجد','الذي لا يعوزه شيء','The Finder'],
['الماجد','واسع الكرم والمجد','The Noble'],['الواحد','الذي لا شريك له','The One'],['الصمد','السيد الذي تُقصد إليه الحوائج','The Eternal Refuge'],['القادر','الذي يقدر على كل شيء','The Able'],['المقتدر','البالغ القدرة','The All-Powerful'],
['المقدم','يقدّم من يشاء','The Expediter'],['المؤخر','يؤخر من يشاء','The Delayer'],['الأول','الذي ليس قبله شيء','The First'],['الآخر','الذي ليس بعده شيء','The Last'],['الظاهر','الذي ليس فوقه شيء','The Manifest'],
['الباطن','الذي ليس دونه شيء','The Hidden'],['الوالي','المالك المدبر للأمور','The Governor'],['المتعالي','المنزّه عن صفات النقص','The Most Exalted'],['البر','الكثير الإحسان إلى عباده','The Source of Goodness'],['التواب','يقبل توبة التائبين','The Acceptor of Repentance'],
['المنتقم','الذي ينتقم من الظالمين','The Avenger'],['العفو','الذي يمحو الذنوب ويتجاوز','The Pardoner'],['الرؤوف','شديد الرحمة','The Most Compassionate'],['مالك الملك','الذي يتصرف في ملكه كيف يشاء','The Owner of Sovereignty'],['ذو الجلال والإكرام','صاحب العظمة والكرم','Lord of Majesty and Generosity'],
['المقسط','العادل في حكمه','The Equitable'],['الجامع','يجمع الخلق ليوم الحساب','The Gatherer'],['الغني','المستغني عن كل أحد','The Self-Sufficient'],['المغني','الذي يغني من يشاء','The Enricher'],['المانع','الذي يمنع ما يشاء لحكمة','The Preventer'],
['الضار','الذي يقدّر الضر لحكمة','The Distresser'],['النافع','الذي يقدّر النفع لمن يشاء','The Benefactor'],['النور','منوّر السماوات والأرض','The Light'],['الهادي','الذي يهدي من يشاء','The Guide'],['البديع','المبدع على غير مثال','The Incomparable Originator'],
['الباقي','الذي لا يفنى','The Everlasting'],['الوارث','الباقي بعد فناء الخلق','The Inheritor'],['الرشيد','المرشد إلى الخير','The Guide to the Right Path'],['الصبور','الذي لا يعاجل بالعقوبة','The Patient'],
];
const nameMeaning =(n)=> state.lang === 'ar' ? n[1]:n[2];
let nmTab = 'list',quiz = null,quizScore = 0,quizCount = 0;
function dayName(){const dayNo = Math.floor((today0()- new Date(2020,0,1))/ 86400000);return NAMES[((dayNo % NAMES.length)+ NAMES.length)% NAMES.length];}
function nextQuiz(){
const i = Math.floor(Math.random()* NAMES.length),opts = new Set([i]);
while(opts.size < 4)opts.add(Math.floor(Math.random()* NAMES.length));
const arr = Array.from(opts).sort(()=> Math.random()- 0.5);
quiz ={i,opts:arr,answered:null};
}
function renderNames(){
if(!$('nmOverlay'))return;
$('nmTitle').textContent = f2('nmTitle');
const dn = dayName();
$('nmTodayBox').innerHTML = `<small>${esc(f2('nmToday'))}</small><div class="nm-big">${esc(dn[0])}</div><div class="nm-mean">${esc(nameMeaning(dn))}</div>`;
$('nmTabs').querySelectorAll('button').forEach(b =>{b.classList.toggle('active',b.dataset.t === nmTab);b.textContent = b.dataset.t === 'list' ? f2('nmList'):f2('nmQuiz');});
$('nmNote').textContent = f2('nmNote');
$('nmNote').style.display = f2('nmNote')? '':'none';
if(nmTab === 'list'){
$('nmBody').innerHTML = `<div class="nm-list">${NAMES.map((n, i) => `<div class="nm-item"><span class="nm-no">${i + 1}</span><b>${esc(n[0])}</b><span>${esc(nameMeaning(n))}</span></div>`).join('')}</div>`;
}else{
if(!quiz)nextQuiz();
const q = quiz;
$('nmBody').innerHTML = `
      <div class="nm-quiz"><div class="nm-q">${esc(f2('nmQ'))}</div><div class="nm-big">${esc(NAMES[q.i][0])}</div>
      ${q.opts.map(o => `<button type="button" class="nm-opt${q.answered !== null ? (o === q.i ? ' ok' : (o === q.answered ? ' bad' : '')) : ''}" data-o="${o}" ${q.answered !== null ? 'disabled' : ''}>${esc(nameMeaning(NAMES[o]))}</button>`).join('')}
      <div class="nm-score">${esc(f2('nmScore', quizScore, quizCount))}</div>
      ${q.answered !== null ? `<button type="button" class="primary nm-next" id="nmNext">${esc(f2('nmNext'))}</button>` : ''}</div>`;
}
}
function openKids(){renderKids();$('kidsOverlay').classList.add('active');}
function renderKids(){
const ov = $('kidsOverlay');if(!ov)return;
const data = getDayData(new Date()),names = t().prayerNames;
const stars = PRAYER_ORDER.filter(k => data.prayers[k].prayed).length;
$('kidsTitle').textContent = '🧒 ' + f2('kidsBtn');
$('kidsStars').innerHTML = PRAYER_ORDER.map(k => `<button type="button" class="kid-star${data.prayers[k].prayed ? ' on' : ''}" data-k="${k}"><span class="kid-ic">${data.prayers[k].prayed ? '⭐' : '☆'}</span><span>${esc(names[k])}</span></button>`).join('');
$('kidsAzkar').innerHTML =[['morning','🌅',t().azkarMorning],['evening','🌙',t().azkarEvening]].map(([k,ic,label])=> `<button type="button" class="kid-az${data.azkar[k] ? ' on' : ''}" data-az="${k}"><span class="kid-ic">${ic}</span><span>${esc(label)}</span><b>${data.azkar[k] ? '✓' : ''}</b></button>`).join('');
$('kidsMsg').textContent = stars === 5 ? f2('kidsAllDone'):(stars > 0 ? f2('kidsGreat'):f2('kidsTap'));
$('kidsCount').textContent = f2('kidsStars',stars);
$('kidsTrophy').style.display = stars === 5 ? '':'none';
$('kidsExitTxt').textContent = f2('kidsExit');
}
const WUDU =[
['🤲',{ar:'انوِ الوضوء بقلبك وقل: بسم الله.',en:'Intend wudu in your heart and say: Bismillah.',fr:'Formulez l’intention du wudu dans le cœur et dites : Bismillah.',es:'Haz la intención del wudu en tu corazón y di: Bismillah.',zh:'心中立意小净，并念“以真主之名”。',ru:'Намерьтесь в сердце совершить омовение и скажите: «Бисмиллях».',tr:'Kalbinizle abdest niyeti edin ve “Bismillah” deyin.'}],
['🙌',{ar:'اغسل كفّيك ثلاث مرات.',en:'Wash both hands three times.',fr:'Lavez les deux mains trois fois.',es:'Lava ambas manos tres veces.',zh:'洗双手三次。',ru:'Вымойте обе кисти рук три раза.',tr:'Ellerinizi üç kez yıkayın.'}],
['💦',{ar:'تمضمض واستنشق واستنثر ثلاث مرات.',en:'Rinse your mouth and nose three times.',fr:'Rincez-vous la bouche et le nez trois fois.',es:'Enjuaga la boca y la nariz tres veces.',zh:'漱口、呛鼻各三次。',ru:'Трижды прополощите рот и нос.',tr:'Ağzınızı ve burnunuzu üç kez çalkalayın.'}],
['🙂',{ar:'اغسل وجهك ثلاث مرات من منبت الشعر إلى الذقن.',en:'Wash your face three times, from hairline to chin.',fr:'Lavez le visage trois fois, de la racine des cheveux au menton.',es:'Lava el rostro tres veces, de la línea del cabello a la barbilla.',zh:'洗脸三次，从发际到下巴。',ru:'Трижды умойте лицо — от линии волос до подбородка.',tr:'Yüzünüzü saç diplerinden çeneye kadar üç kez yıkayın.'}],
['💪',{ar:'اغسل يديك مع المرفقين ثلاث مرات، اليمنى ثم اليسرى.',en:'Wash your arms up to and including the elbows three times, right then left.',fr:'Lavez les bras jusqu’aux coudes inclus, trois fois, droit puis gauche.',es:'Lava los brazos hasta los codos incluidos, tres veces: derecho y luego izquierdo.',zh:'洗双臂至肘（含肘）三次，先右后左。',ru:'Трижды вымойте руки до локтей включительно: сначала правую, потом левую.',tr:'Kollarınızı dirseklerle birlikte üç kez yıkayın; önce sağ, sonra sol.'}],
['💆',{ar:'امسح رأسك مرة واحدة ثم أذنيك.',en:'Wipe your head once, then your ears.',fr:'Passez les mains mouillées sur la tête une fois, puis sur les oreilles.',es:'Pasa las manos mojadas por la cabeza una vez y luego por las orejas.',zh:'擦头一次，再擦双耳。',ru:'Один раз проведите влажными руками по голове, затем по ушам.',tr:'Başınızı bir kez, ardından kulaklarınızı mesh edin.'}],
['🦶',{ar:'اغسل قدميك مع الكعبين ثلاث مرات، اليمنى ثم اليسرى.',en:'Wash your feet up to and including the ankles three times, right then left.',fr:'Lavez les pieds jusqu’aux chevilles incluses, trois fois, droit puis gauche.',es:'Lava los pies hasta los tobillos incluidos, tres veces: derecho y luego izquierdo.',zh:'洗双脚至踝（含踝）三次，先右后左。',ru:'Трижды вымойте стопы до щиколоток включительно: сначала правую, потом левую.',tr:'Ayaklarınızı topuk kemikleriyle birlikte üç kez yıkayın; önce sağ, sonra sol.'}],
['🤍',{ar:'قل: أشهد أن لا إله إلا الله وأن محمدًا عبده ورسوله.',en:'Say: I bear witness that there is no god but Allah, and that Muhammad is His servant and messenger.',fr:'Dites : J’atteste qu’il n’y a de dieu qu’Allah et que Muhammad est Son serviteur et Son messager.',es:'Di: Atestiguo que no hay más dios que Allah y que Muhammad es Su siervo y mensajero.',zh:'念：我作证，除真主外无神，穆罕默德是祂的仆人和使者。',ru:'Скажите: «Свидетельствую, что нет бога кроме Аллаха, и что Мухаммад — Его раб и посланник».',tr:'“Allah’tan başka ilah olmadığına ve Muhammed’in O’nun kulu ve elçisi olduğuna şehadet ederim” deyin.'}],
];
const PRAYER_STEPS =[
['🧭',{ar:'استقبل القبلة وانوِ الصلاة في قلبك.',en:'Face the qibla and intend the prayer in your heart.',fr:'Faites face à la qibla et formulez l’intention de prier dans le cœur.',es:'Mira hacia la qibla e intenta la oración en tu corazón.',zh:'面向基卜拉，心中立意礼拜。',ru:'Повернитесь к кибле и в сердце определите намерение.',tr:'Kıbleye dönün ve kalbinizle namaza niyet edin.'}],
['🙆',{ar:'كبّر تكبيرة الإحرام: «الله أكبر» وارفع يديك، ثم ضع اليمنى على اليسرى.',en:'Say “Allahu akbar” raising your hands, then place the right hand over the left.',fr:'Dites « Allahou akbar » en levant les mains, puis posez la main droite sur la gauche.',es:'Di “Allahu akbar” levantando las manos y coloca la mano derecha sobre la izquierda.',zh:'举手说“真主至大”，然后右手放在左手上。',ru:'Скажите «Аллаху акбар», подняв руки, затем положите правую руку на левую.',tr:'Ellerinizi kaldırarak “Allahü ekber” deyin, sonra sağ elinizi sol elinizin üstüne koyun.'}],
['📖',{ar:'اقرأ سورة الفاتحة ثم ما تيسّر من القرآن.',en:'Recite Al-Fatiha, then what you can of the Quran.',fr:'Récitez Al-Fatiha, puis ce que vous pouvez du Coran.',es:'Recita Al-Fatiha y luego lo que puedas del Corán.',zh:'诵读《开端章》，再诵读你能诵读的经文。',ru:'Прочтите «Аль-Фатиха», затем что-нибудь из Корана.',tr:'Fâtiha’yı, ardından Kur’an’dan bildiğiniz kadarını okuyun.'}],
['🙇',{ar:'كبّر واركع، ثم قل: سبحان ربي العظيم.',en:'Say “Allahu akbar” and bow (ruku), saying: Subhana rabbiyal-azim.',fr:'Dites « Allahou akbar », inclinez-vous (roukou‘) et dites : Soubhana rabbiyal-‘azim.',es:'Di “Allahu akbar”, inclínate (ruku) y di: Subhana rabbiyal-azim.',zh:'说“真主至大”并鞠躬，念：赞美我伟大的主。',ru:'Скажите «Аллаху акбар», совершите поясной поклон и скажите: «Субхана раббияль-азым».',tr:'“Allahü ekber” deyip rükûya varın ve “Sübhâne rabbiyel-azîm” deyin.'}],
['🧍',{ar:'ارفع من الركوع قائلًا: سمع الله لمن حمده، ثم: ربنا ولك الحمد.',en:'Rise saying: Sami‘a Allahu liman hamidah, then: Rabbana wa lakal-hamd.',fr:'Relevez-vous en disant : Sami‘a Allahou liman hamidah, puis : Rabbana wa lakal-hamd.',es:'Levántate diciendo: Sami‘a Allahu liman hamidah, y luego: Rabbana wa lakal-hamd.',zh:'起身时念：真主听到赞颂祂的人；然后念：我们的主，赞颂全归于你。',ru:'Выпрямитесь, говоря: «Сами‘а Аллаху лиман хамидах», затем: «Раббана ва лакаль-хамд».',tr:'Doğrulurken “Semi‘allahü limen hamideh”, ardından “Rabbenâ ve lekel-hamd” deyin.'}],
['🧎',{ar:'كبّر واسجد، ثم قل: سبحان ربي الأعلى.',en:'Say “Allahu akbar” and prostrate (sujud), saying: Subhana rabbiyal-a‘la.',fr:'Dites « Allahou akbar », prosternez-vous (soujoud) et dites : Soubhana rabbiyal-a‘la.',es:'Di “Allahu akbar”, postérnate (sujud) y di: Subhana rabbiyal-a‘la.',zh:'说“真主至大”并叩头，念：赞美我至高的主。',ru:'Скажите «Аллаху акбар», совершите земной поклон и скажите: «Субхана раббияль-а‘ля».',tr:'“Allahü ekber” deyip secdeye gidin ve “Sübhâne rabbiyel-a‘lâ” deyin.'}],
['🪑',{ar:'اجلس بين السجدتين ثم اسجد الثانية؛ وبذلك تتم ركعة.',en:'Sit between the two prostrations, then prostrate again. That completes one rak‘ah.',fr:'Asseyez-vous entre les deux prosternations, puis prosternez-vous de nouveau. Cela complète une rak‘a.',es:'Siéntate entre las dos postraciones y postérnate de nuevo. Así se completa una rak‘a.',zh:'两次叩头之间坐下，再叩头一次，一拜即完成。',ru:'Сядьте между двумя земными поклонами и поклонитесь снова — так завершается один ракят.',tr:'İki secde arasında oturun, sonra tekrar secde edin; böylece bir rekât tamamlanır.'}],
['🕊️',{ar:'اجلس للتشهد في آخر الصلاة، ثم سلّم عن يمينك ويسارك.',en:'Sit for the tashahhud at the end, then give salam to the right and left.',fr:'Asseyez-vous pour le tachahhoud à la fin, puis donnez le salam à droite et à gauche.',es:'Siéntate para el tashahhud al final y saluda a la derecha y a la izquierda.',zh:'末拜坐下读作证词，然后向右、向左道平安。',ru:'В конце сядьте для ташаххуда, затем произнесите салям вправо и влево.',tr:'Sonda teşehhüd için oturun, ardından sağa ve sola selam verin.'}],
];
const RAKAAT ={Fajr:2,Dhuhr:4,Asr:4,Maghrib:3,Isha:4};
let gdTab = 'wudu';
function renderGuide(){
if(!$('gdOverlay'))return;
$('gdTitle').textContent = f2('gdTitle');
$('gdTabs').querySelectorAll('button').forEach(b =>{b.classList.toggle('active',b.dataset.t === gdTab);b.textContent = f2({wudu:'gdWudu',prayer:'gdPrayer',rakaat:'gdRakaat'}[b.dataset.t]);});
const L =(o)=> o[state.lang]|| o.en;
if(gdTab === 'rakaat'){
$('gdBody').innerHTML = `<div class="gd-rak">${PRAYER_ORDER.map(k => `<div class="gd-rak-row"><span>${esc(t().prayerNames[k])}</span><b>${RAKAAT[k]} ${esc(f2('gdUnit'))}</b></div>`).join('')}</div>`;
return;
}
const steps = gdTab === 'wudu' ? WUDU:PRAYER_STEPS;
$('gdBody').innerHTML = steps.map((s,i)=> `<div class="gd-step"><div class="gd-ic">${s[0]}</div><div class="gd-no">${i + 1}</div><div class="gd-tx">${esc(L(s[1]))}</div></div>`).join('');
}
async function buildMonthReport(){
const s = t(),today = today0(),off = state.mdMonthOffset || 0;
const first = new Date(today.getFullYear(),today.getMonth()+ off,1);
const dim = new Date(first.getFullYear(),first.getMonth()+ 1,0).getDate();
const R = withStoreCache(()=>{
const r ={elapsed:0,prayed:0,jamaah:0,mosque:0,quran:0,morning:0,evening:0,qiyam:0,witr:0,fasting:0,best:0,cells:[]};
let run = 0;const tr = state.settings.trackedItems;
for(let n = 1;n <= dim;n++){
const d = new Date(first.getFullYear(),first.getMonth(),n);
if(d > today){r.cells.push(null);continue;}
r.elapsed++;
const data = getDayData(d),res = computeApplicableTasks(d,data);
PRAYER_ORDER.forEach(k =>{if(data.prayers[k].prayed)r.prayed++;if(data.prayers[k].jamaah)r.jamaah++;if(data.prayers[k].mosque)r.mosque++;});
if(data.quran.read)r.quran++;if(data.azkar.morning)r.morning++;if(data.azkar.evening)r.evening++;
if(data.night.qiyam)r.qiyam++;if(data.night.witr)r.witr++;if(data.fasting.fasted === true)r.fasting++;
const good = tr.trackPrayers ? PRAYER_ORDER.every(k => data.prayers[k].prayed):(res.total > 0 && res.done / res.total >= 0.8);
run = good ? run + 1:0;r.best = Math.max(r.best,run);
r.cells.push(res.total ? res.done / res.total:0);
}
return r;
});
const lead0 =(first.getDay()+ 1)% 7,rows = Math.ceil((lead0 + dim)/ 7);
const W = 1080,H = Math.max(1500,1130 + rows * 100 + 110),c = document.createElement('canvas');c.width = W;c.height = H;
const g = c.getContext('2d'),cs = getComputedStyle(document.documentElement);
const v =(nme,d)=>(cs.getPropertyValue(nme)|| '').trim()|| d;
const rtl =(LANGUAGES.find(l => l.code === state.lang)||{}).dir === 'rtl';
const serif = "'Amiri','Tajawal',serif",sans = "'Tajawal','Inter',sans-serif";
try{await Promise.all([document.fonts.load(`700 60px ${serif}`),document.fonts.load(`700 40px ${sans}`)]);}catch(e){}
const bg = g.createLinearGradient(0,0,W,H);bg.addColorStop(0,v('--grad1','#3A1470'));bg.addColorStop(1,v('--grad2','#123E8C'));
g.fillStyle = bg;g.fillRect(0,0,W,H);
g.fillStyle = 'rgba(255,255,255,0.05)';[[W * 0.9,120,300],[60,800,240],[W * 0.8,H - 120,340]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();});
g.direction = rtl ? 'rtl':'ltr';g.textAlign = 'center';
const amber = v('--amber','#E8B75A');
g.fillStyle = '#fff';g.font = `700 64px ${serif}`;g.fillText('📄 ' + f2('rpBtn'),W / 2,125);
g.fillStyle = amber;g.font = `700 44px ${sans}`;
g.fillText(new Intl.DateTimeFormat(localeForLang(),{month:'long',year:'numeric'}).format(first),W / 2,195);
const pct = r => r.elapsed ? Math.round(r.prayed /(r.elapsed * 5)* 100):0,p = pct(R);
g.lineWidth = 26;g.strokeStyle = 'rgba(255,255,255,0.18)';g.beginPath();g.arc(W / 2,410,140,0,Math.PI * 2);g.stroke();
g.strokeStyle = amber;g.lineCap = 'round';g.beginPath();g.arc(W / 2,410,140,-Math.PI / 2,-Math.PI / 2 + Math.PI * 2 * p / 100);g.stroke();
g.fillStyle = '#fff';g.font = `800 84px 'Inter',${sans}`;g.direction = 'ltr';g.fillText(p + '%',W / 2,438);g.direction = rtl ? 'rtl':'ltr';
g.fillStyle = 'rgba(255,255,255,0.85)';g.font = `600 34px ${sans}`;g.fillText(f2('rpComplete'),W / 2,625);
const tiles =[[s.monthStatPrayed,`${R.prayed}/${R.elapsed * 5}`],[s.monthStatJamaah,R.jamaah],[s.monthStatMosque,R.mosque],[s.monthStatQuran,R.quran],
[s.monthStatMorningAzkar,R.morning],[s.monthStatEveningAzkar,R.evening],[s.monthStatQiyam,R.qiyam],[s.monthStatFasting,R.fasting],[f2('rpStreak'),`${R.best} ${f2('rpDays', R.best)}`]];
const tw = 300,th = 130,gap = 22,x0 =(W -(tw * 3 + gap * 2))/ 2;
tiles.forEach(([label,val],i)=>{
const x = x0 +(i % 3)*(tw + gap),y = 670 + Math.floor(i / 3)*(th + gap);
g.fillStyle = 'rgba(255,255,255,0.14)';roundRectLocal(g,x,y,tw,th,28);g.fill();
g.direction = 'ltr';g.fillStyle = amber;g.font = `800 48px 'Inter',${sans}`;g.fillText(String(val),x + tw / 2,y + 62);
g.direction = rtl ? 'rtl':'ltr';g.fillStyle = 'rgba(255,255,255,0.85)';g.font = `600 24px ${sans}`;
const txt = String(label);g.fillText(txt.length > 24 ? txt.slice(0,23)+ '…':txt,x + tw / 2,y + 106);
});
const lead =(first.getDay()+ 1)% 7,cell = 90,cgap = 10,gx =(W -(cell * 7 + cgap * 6))/ 2,gy = 1130;
R.cells.forEach((val,i)=>{
const idx = lead + i,col = rtl ? 6 -(idx % 7):idx % 7,x = gx + col *(cell + cgap),y = gy + Math.floor(idx / 7)*(cell + cgap);
g.fillStyle = val === null ? 'rgba(255,255,255,0.07)':`rgba(255,255,255,${0.14 + val * 0.7})`;
roundRectLocal(g,x,y,cell,cell,18);g.fill();
g.direction = 'ltr';g.fillStyle = val !== null && val > 0.55 ? '#111':'rgba(255,255,255,0.75)';g.font = `700 28px 'Inter',${sans}`;g.fillText(String(i + 1),x + cell / 2,y + 58);
});
g.direction = 'ltr';g.fillStyle = 'rgba(255,255,255,0.8)';g.font = `600 28px 'Inter',${sans}`;g.fillText('Muslim Day  ·  By Predax Studio',W / 2,H - 50);
return await new Promise(res => c.toBlob(res,'image/png'));
}
function roundRectLocal(g,x,y,w,h,r){
g.beginPath();g.moveTo(x + r,y);g.arcTo(x + w,y,x + w,y + h,r);g.arcTo(x + w,y + h,x,y + h,r);g.arcTo(x,y + h,x,y,r);g.arcTo(x,y,x + w,y,r);g.closePath();
}
async function shareMonthReport(){
const btn = $('rpBtn');if(btn)btn.disabled = true;
try{
const blob = await buildMonthReport(),file = new File([blob],'muslim-day-month-report.png',{type:'image/png'});
if(navigator.canShare && navigator.canShare({files:[file]}))await navigator.share({files:[file],title:'Muslim Day'});
else{const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=> URL.revokeObjectURL(a.href),4000);}
}catch(e){if(!e || e.name !== 'AbortError')console.error(e);}
finally{if(btn)btn.disabled = false;}
}
function renderAdv(){
if(!$('advCard'))return;
$('advTitle').textContent = f2('advTitle');
$('hjTitle').textContent = f2('hjTitle');$('hjHint').textContent = f2('hjHint');
$('hjVal').textContent = f2('hjVal',Number(lsGet('salati_hijri_off','0'))|| 0);
$('atTitle').textContent = f2('atTitle');$('atHint').textContent = f2('atHint');
$('atDayLbl').textContent = f2('atDay');$('atNightLbl').textContent = f2('atNight');
$('atToggle').checked = at.on;$('atRow').style.display = at.on ? '':'none';
fillThemeSelects();
$('qiyamTitle').textContent = f2('qiyamTitle');$('qiyamHint').textContent = f2('qiyamHint');$('qiyamToggle').checked = lsGet('salati_qiyam','0')=== '1';
$('friTitle').textContent = f2('friTitle');$('friHint').textContent = f2('friHint');$('friToggle').checked = lsGet('salati_friday','0')=== '1';
}
function renderTools(){
if(!$('toolsRow'))return;
$('tlGuideTxt').textContent = f2('tlGuide');$('tlNamesTxt').textContent = f2('tlNames');
}
function renderAll2(){
renderAdv();renderTools();renderQada();renderNames();renderKids();renderGuide();
const rb = $('rpBtnTxt');if(rb)rb.textContent = f2('rpBtn');
}
function inject2(){
const vd = $('vdCard');
if(vd && !$('toolsRow')){
vd.insertAdjacentHTML('afterend',`
      <div class="tools-row" id="toolsRow">
        <button type="button" id="tlGuide"><span>📖</span><span id="tlGuideTxt">—</span></button>
        <button type="button" id="tlNames"><span>✨</span><span id="tlNamesTxt">—</span></button>
      </div>`);
}
if(!$('advCard')){
const html = `
      <div class="card" id="advCard">
        <h3 class="section-title" style="font-size:16px;"><span>🛠️</span><span id="advTitle">—</span></h3>
        <div class="adv-block">
          <div class="toggle-title" id="hjTitle">—</div><div class="toggle-desc" id="hjHint">—</div>
          <div class="hj-ctrl"><button type="button" class="ghost small" id="hjMinus">−</button><span id="hjVal">—</span><button type="button" class="ghost small" id="hjPlus">+</button></div>
        </div>
        <div class="home-toggle"><div><div class="toggle-title" id="atTitle">—</div><div class="toggle-desc" id="atHint">—</div></div>
          <label class="switch"><input type="checkbox" id="atToggle"><span class="slider"></span></label></div>
        <div class="at-row" id="atRow" style="display:none;">
          <label><span id="atDayLbl">—</span><select id="atDay"></select></label>
          <label><span id="atNightLbl">—</span><select id="atNight"></select></label>
        </div>
        <div class="home-toggle"><div><div class="toggle-title" id="qiyamTitle">—</div><div class="toggle-desc" id="qiyamHint">—</div></div>
          <label class="switch"><input type="checkbox" id="qiyamToggle"><span class="slider"></span></label></div>
        <div class="home-toggle"><div><div class="toggle-title" id="friTitle">—</div><div class="toggle-desc" id="friHint">—</div></div>
          <label class="switch"><input type="checkbox" id="friToggle"><span class="slider"></span></label></div>
      </div>`;
const anchor = $('a11yCard');
if(anchor)anchor.insertAdjacentHTML('afterend',html);
else{const sl = document.querySelector('.studio-link');if(sl)sl.insertAdjacentHTML('beforebegin',html);}
}
const stats = $('mdStatsCard');
if(stats && !$('qdCard')){
stats.insertAdjacentHTML('afterend',`
      <div class="card" id="qdCard">
        <h3 class="section-title" style="font-size:16px;"><span>⏳</span><span id="qdTitle">—</span></h3>
        <div class="st-sub" id="qdHint">—</div>
        <div id="qdRows"></div>
        <div class="qd-pace"><span id="qdPaceLbl">—</span><input type="number" id="qdPace" min="1" max="50" inputmode="numeric"></div>
        <div class="qd-total" id="qdTotal"></div><div class="qd-eta" id="qdEta"></div>
      </div>`);
}
const ms = $('monthStats');
if(ms && !$('rpBtn'))ms.insertAdjacentHTML('afterend',`<button type="button" class="ghost" id="rpBtn" style="width:100%; margin-top:12px;">📄 <span id="rpBtnTxt">—</span></button>`);
if(!$('nmOverlay')){
document.body.insertAdjacentHTML('beforeend',`
    <div class="lang-sheet-overlay" id="nmOverlay"><div class="lang-sheet nm-sheet">
      <h3 id="nmTitle">—</h3>
      <div class="nm-today" id="nmTodayBox"></div>
      <div class="vd-tabs nm-tabs" id="nmTabs"><button type="button" data-t="list"></button><button type="button" data-t="quiz"></button></div>
      <div class="occ-note" id="nmNote"></div>
      <div id="nmBody"></div>
      <button class="primary" id="nmClose" type="button" style="margin:10px 16px 4px; width:calc(100% - 32px);"><span id="nmCloseTxt">OK</span></button>
    </div></div>
    <div class="lang-sheet-overlay" id="gdOverlay"><div class="lang-sheet gd-sheet">
      <h3 id="gdTitle">—</h3>
      <div class="vd-tabs gd-tabs" id="gdTabs"><button type="button" data-t="wudu"></button><button type="button" data-t="prayer"></button><button type="button" data-t="rakaat"></button></div>
      <div id="gdBody"></div>
      <button class="primary" id="gdClose" type="button" style="margin:10px 16px 4px; width:calc(100% - 32px);"><span id="gdCloseTxt">OK</span></button>
    </div></div>
    <div class="kids-overlay" id="kidsOverlay">
      <div class="kids-inner">
        <h2 id="kidsTitle">—</h2>
        <div class="kids-msg" id="kidsMsg">—</div>
        <div class="kids-trophy" id="kidsTrophy" style="display:none;">🏆</div>
        <div class="kids-stars" id="kidsStars"></div>
        <div class="kids-count" id="kidsCount">—</div>
        <div class="kids-azkar" id="kidsAzkar"></div>
        <button type="button" class="kids-exit" id="kidsExit"><span id="kidsExitTxt">—</span></button>
      </div>
    </div>`);
}
}
function bind2(){
$('hjMinus').addEventListener('click',()=> hjSet((Number(lsGet('salati_hijri_off','0'))|| 0)- 1));
$('hjPlus').addEventListener('click',()=> hjSet((Number(lsGet('salati_hijri_off','0'))|| 0)+ 1));
$('atToggle').addEventListener('change',(e)=>{at.on = e.target.checked;lsSet('salati_autotheme',JSON.stringify(at));$('atRow').style.display = at.on ? '':'none';autoThemeTick(true);});
$('atDay').addEventListener('change',(e)=>{at.day = e.target.value;lsSet('salati_autotheme',JSON.stringify(at));autoThemeTick(true);});
$('atNight').addEventListener('change',(e)=>{at.night = e.target.value;lsSet('salati_autotheme',JSON.stringify(at));autoThemeTick(true);});
$('qiyamToggle').addEventListener('change',async(e)=>{lsSet('salati_qiyam',e.target.checked ? '1':'0');if(e.target.checked)await askNotifPerm();});
$('friToggle').addEventListener('change',async(e)=>{lsSet('salati_friday',e.target.checked ? '1':'0');if(e.target.checked)await askNotifPerm();});
$('qdRows').addEventListener('change',(e)=>{
const row = e.target.closest('.qd-row');if(!row || !e.target.classList.contains('qd-input'))return;
qd[row.dataset.k]= Math.max(0,Math.floor(Number(e.target.value)|| 0));qdSave();renderQada();
});
$('qdRows').addEventListener('click',(e)=>{
const b = e.target.closest('.qd-done');if(!b)return;const k = b.closest('.qd-row').dataset.k;
if((Number(qd[k])|| 0)> 0){qd[k]= Number(qd[k])- 1;qdSave();renderQada();toast(f2('qdDone')+ ' ✓');}
});
$('qdPace').addEventListener('change',(e)=>{qd.pace = Math.max(1,Math.min(50,Math.floor(Number(e.target.value)|| 1)));qdSave();renderQada();});
$('tlNames').addEventListener('click',()=>{renderNames();openSheet('nmOverlay');});
$('nmClose').addEventListener('click',()=> closeSheet('nmOverlay'));
$('nmOverlay').addEventListener('click',(e)=>{if(e.target.id === 'nmOverlay')closeSheet('nmOverlay');});
$('nmTabs').addEventListener('click',(e)=>{const b = e.target.closest('button');if(!b)return;nmTab = b.dataset.t;if(nmTab === 'quiz' && !quiz)nextQuiz();renderNames();});
$('nmBody').addEventListener('click',(e)=>{
const o = e.target.closest('.nm-opt');
if(o && quiz && quiz.answered === null){quiz.answered = Number(o.dataset.o);quizCount++;if(quiz.answered === quiz.i)quizScore++;renderNames();return;}
if(e.target.closest('#nmNext')){nextQuiz();renderNames();}
});
$('tlGuide').addEventListener('click',()=>{renderGuide();openSheet('gdOverlay');});
$('gdClose').addEventListener('click',()=> closeSheet('gdOverlay'));
$('gdOverlay').addEventListener('click',(e)=>{if(e.target.id === 'gdOverlay')closeSheet('gdOverlay');});
$('gdTabs').addEventListener('click',(e)=>{const b = e.target.closest('button');if(!b)return;gdTab = b.dataset.t;renderGuide();});
$('kidsStars').addEventListener('click',(e)=>{
const b = e.target.closest('.kid-star');if(!b)return;
updateDayField(new Date(),(d)=>{d.prayers[b.dataset.k].prayed = !d.prayers[b.dataset.k].prayed;});
renderKids();
});
$('kidsAzkar').addEventListener('click',(e)=>{
const b = e.target.closest('.kid-az');if(!b)return;
updateDayField(new Date(),(d)=>{d.azkar[b.dataset.az]= !d.azkar[b.dataset.az];});
renderKids();
});
let holdT = null;const ex = $('kidsExit');
const startHold =()=>{ex.classList.add('holding');holdT = setTimeout(()=>{$('kidsOverlay').classList.remove('active');ex.classList.remove('holding');},1200);};
const endHold =()=>{clearTimeout(holdT);ex.classList.remove('holding');};
ex.addEventListener('pointerdown',startHold);['pointerup','pointerleave','pointercancel'].forEach(ev => ex.addEventListener(ev,endHold));
$('rpBtn').addEventListener('click',shareMonthReport);
}
const _al2 = applyLanguage;
applyLanguage = function(){const r = _al2.apply(this,arguments);try{renderAll2();}catch(e){console.error(e);}return r;};
const _rmd2 = renderMuslimDay;
renderMuslimDay = function(){const r = _rmd2.apply(this,arguments);try{renderQada();if($('kidsOverlay')&& $('kidsOverlay').classList.contains('active'))renderKids();}catch(e){}return r;};
at = jsonGet('salati_autotheme',at);
qd = jsonGet('salati_qada',qd);
inject2();
bind2();
['nmCloseTxt','gdCloseTxt'].forEach(id =>{const el = $(id);if(el)el.textContent =(typeof XT === 'function')? XT('done'):'OK';});
renderAll2();
X.refresh();
setTimeout(()=> autoThemeTick(true),1500);
setInterval(()=>{autoThemeTick(false);remindTick();},30000);
setTimeout(remindTick,3000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){autoThemeTick(false);remindTick();}});
window.SalatiX2 ={isNightNow,autoThemeTick,remindTick,NAMES,openKids,f2};
})();
