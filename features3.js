(function(){
'use strict';
const X = window.SalatiX;
if(!X)return;
const{today0,addDays,esc,toast}= X;
const $ =(id)=> document.getElementById(id);
const F3 ={
wdTitle:{ar:'ورد القرآن اليومي',en:'Daily Quran portion',fr:'Wird quotidien du Coran',es:'Porción diaria del Corán',zh:'每日诵读',ru:'Ежедневный урок Корана',tr:'Günlük Kur’an virdi'},
wdPace:{ar:'صفحات في اليوم',en:'Pages per day',fr:'Pages par jour',es:'Páginas al día',zh:'每日页数',ru:'Страниц в день',tr:'Günlük sayfa'},
wdPreset:{ar:d=>`ختمة في ${d} يومًا`,en:d=>`Finish in ${d} days`,fr:d=>`Terminer en ${d} jours`,es:d=>`Terminar en ${d} días`,zh:d=>`${d} 天读完`,ru:d=>`За ${d} дн.`,tr:d=>`${d} günde hatim`},
wdToday:{ar:(a,b)=>a===b?`ورد اليوم: صفحة ${a}`:`ورد اليوم: من صفحة ${a} إلى ${b}`,en:(a,b)=>a===b?`Today: page ${a}`:`Today: pages ${a}–${b}`,fr:(a,b)=>a===b?`Aujourd’hui : page ${a}`:`Aujourd’hui : pages ${a}–${b}`,es:(a,b)=>a===b?`Hoy: página ${a}`:`Hoy: páginas ${a}–${b}`,zh:(a,b)=>a===b?`今日：第 ${a} 页`:`今日：第 ${a}–${b} 页`,ru:(a,b)=>a===b?`Сегодня: стр. ${a}`:`Сегодня: стр. ${a}–${b}`,tr:(a,b)=>a===b?`Bugün: sayfa ${a}`:`Bugün: sayfa ${a}–${b}`},
wdJuz:{ar:n=>`الجزء ${n}`,en:n=>`Juz ${n}`,fr:n=>`Juz ${n}`,es:n=>`Yuz ${n}`,zh:n=>`第 ${n} 部`,ru:n=>`Джуз ${n}`,tr:n=>`${n}. cüz`},
wdProgress:{ar:p=>`${p} من 604 صفحة`,en:p=>`${p} of 604 pages`,fr:p=>`${p} sur 604 pages`,es:p=>`${p} de 604 páginas`,zh:p=>`${p} / 604 页`,ru:p=>`${p} из 604 стр.`,tr:p=>`604 sayfadan ${p}`},
wdDone:{ar:'أتممت ورد اليوم',en:'I finished today’s portion',fr:'J’ai terminé le wird du jour',es:'Terminé la porción de hoy',zh:'我完成了今日诵读',ru:'Я прочитал сегодняшнюю часть',tr:'Bugünkü virdi tamamladım'},
wdDoneToday:{ar:'تم ورد اليوم ✓',en:'Today’s portion done ✓',fr:'Wird du jour fait ✓',es:'Porción de hoy hecha ✓',zh:'今日诵读完成 ✓',ru:'Сегодняшняя часть прочитана ✓',tr:'Bugünkü vird tamam ✓'},
wdUndo:{ar:'تراجع',en:'Undo',fr:'Annuler',es:'Deshacer',zh:'撤销',ru:'Отменить',tr:'Geri al'},
wdKhatmas:{ar:n=>`الختمات: ${n}`,en:n=>`Completions: ${n}`,fr:n=>`Khatmas : ${n}`,es:n=>`Jatmas: ${n}`,zh:n=>`已读完：${n}`,ru:n=>`Хатмов: ${n}`,tr:n=>`Hatim: ${n}`},
wdEta:{ar:d=>`الختمة المتوقعة: ${d}`,en:d=>`Expected completion: ${d}`,fr:d=>`Fin prévue : ${d}`,es:d=>`Finalización prevista: ${d}`,zh:d=>`预计完成：${d}`,ru:d=>`Ожидаемое завершение: ${d}`,tr:d=>`Tahmini bitiş: ${d}`},
wdKhatmaDone:{ar:'ما شاء الله! أتممت ختمة 🎉',en:'Masha’Allah! You completed a khatma 🎉',fr:'Macha’Allah ! Vous avez terminé une khatma 🎉',es:'¡Masha’Allah! Completaste una jatma 🎉',zh:'玛莎安拉！你读完了一遍《古兰经》🎉',ru:'Маша’Аллах! Вы завершили хатм 🎉',tr:'Maşallah! Bir hatim tamamladınız 🎉'},
wdNote:{ar:'حسب مصحف المدينة (604 صفحات)',en:'Based on the Madinah mushaf (604 pages)',fr:'Selon le mushaf de Médine (604 pages)',es:'Según el mushaf de Medina (604 páginas)',zh:'依据麦地那版经本（604页）',ru:'По мусхафу Медины (604 стр.)',tr:'Medine mushafına göre (604 sayfa)'},
wdPos:{ar:'وصلتُ إلى صفحة',en:'I’m at page',fr:'J’en suis à la page',es:'Voy por la página',zh:'我读到第几页',ru:'Я на странице',tr:'Şu sayfadayım'},
tlRamadan:{ar:'الإمساكية',en:'Ramadan',fr:'Ramadan',es:'Ramadán',zh:'斋月',ru:'Рамадан',tr:'İmsakiye'},
kidsRowTitle:{ar:'وضع الأطفال',en:'Kids mode',fr:'Mode enfants',es:'Modo infantil',zh:'儿童模式',ru:'Детский режим',tr:'Çocuk modu'},
kidsRowSub:{ar:'واجهة مبسّطة بنجوم لصلوات اليوم',en:'A simple screen with stars for today’s prayers',fr:'Un écran simple avec des étoiles pour les prières du jour',es:'Una pantalla simple con estrellas para las oraciones de hoy',zh:'用星星记录今日礼拜的简易界面',ru:'Простой экран со звёздами за сегодняшние намазы',tr:'Bugünkü namazlar için yıldızlı basit ekran'},
invRowSub:{ar:'بطاقة برمز QR لدعوة أهلك وأصدقائك',en:'A QR card to invite family and friends',fr:'Une carte QR pour inviter vos proches',es:'Una tarjeta QR para invitar a tus allegados',zh:'用二维码卡片邀请亲友',ru:'Карточка с QR-кодом для приглашения близких',tr:'Yakınlarınızı davet etmek için QR kartı'},
invTitle:{ar:'ادعُ أحبابك',en:'Invite loved ones',fr:'Invitez vos proches',es:'Invita a tus seres queridos',zh:'邀请亲友',ru:'Пригласите близких',tr:'Sevdiklerinizi davet edin'},
invLink:{ar:'رابط التطبيق',en:'App link',fr:'Lien de l’application',es:'Enlace de la app',zh:'应用链接',ru:'Ссылка на приложение',tr:'Uygulama bağlantısı'},
invTag:{ar:'مواقيت الصلاة والأذان والأذكار ويوم المسلم',en:'Prayer times, adhan, azkar and your Muslim day',fr:'Horaires de prière, adhan, adhkar et journée du musulman',es:'Horarios de oración, adhan, adhkar y tu día musulmán',zh:'礼拜时间、宣礼、赞词与穆斯林的一天',ru:'Время намаза, азан, азкары и день мусульманина',tr:'Namaz vakitleri, ezan, zikirler ve Müslüman’ın günü'},
invScan:{ar:'امسح الرمز أو افتح الرابط',en:'Scan the code or open the link',fr:'Scannez le code ou ouvrez le lien',es:'Escanea el código o abre el enlace',zh:'扫描二维码或打开链接',ru:'Отсканируйте код или откройте ссылку',tr:'Kodu tarayın veya bağlantıyı açın'},
invShare:{ar:'مشاركة',en:'Share',fr:'Partager',es:'Compartir',zh:'分享',ru:'Поделиться',tr:'Paylaş'},
invCopy:{ar:'نسخ الرابط',en:'Copy link',fr:'Copier le lien',es:'Copiar enlace',zh:'复制链接',ru:'Копировать ссылку',tr:'Bağlantıyı kopyala'},
invCopied:{ar:'تم النسخ ✓',en:'Copied ✓',fr:'Copié ✓',es:'Copiado ✓',zh:'已复制 ✓',ru:'Скопировано ✓',tr:'Kopyalandı ✓'},
invMsg:{ar:'جرّب تطبيق Muslim Day: مواقيت الصلاة والأذان والأذكار',en:'Try Muslim Day: prayer times, adhan and azkar',fr:'Essayez Muslim Day : horaires de prière, adhan et adhkar',es:'Prueba Muslim Day: horarios de oración, adhan y adhkar',zh:'试试 Muslim Day：礼拜时间、宣礼和赞词',ru:'Попробуйте Muslim Day: время намаза, азан и азкары',tr:'Muslim Day’i deneyin: namaz vakitleri, ezan ve zikirler'},
invBad:{ar:'أدخل رابطًا صحيحًا (حتى 200 حرف)',en:'Enter a valid link (up to 200 characters)',fr:'Saisissez un lien valide (200 caractères max)',es:'Introduce un enlace válido (hasta 200 caracteres)',zh:'请输入有效链接（最多200个字符）',ru:'Введите корректную ссылку (до 200 символов)',tr:'Geçerli bir bağlantı girin (en fazla 200 karakter)'},
rmTitle:{ar:y=>`إمساكية رمضان ${y}`,en:y=>`Ramadan ${y} timetable`,fr:y=>`Imsakiyya Ramadan ${y}`,es:y=>`Calendario de Ramadán ${y}`,zh:y=>`${y} 斋月时间表`,ru:y=>`Расписание Рамадана ${y}`,tr:y=>`Ramazan ${y} imsakiyesi`},
rmDay:{ar:'اليوم',en:'Day',fr:'Jour',es:'Día',zh:'日',ru:'День',tr:'Gün'},
rmDate:{ar:'التاريخ',en:'Date',fr:'Date',es:'Fecha',zh:'日期',ru:'Дата',tr:'Tarih'},
rmImsak:{ar:'الإمساك',en:'Imsak',fr:'Imsak',es:'Imsak',zh:'封斋',ru:'Имсак',tr:'İmsak'},
rmIftar:{ar:'الإفطار',en:'Iftar',fr:'Iftar',es:'Iftar',zh:'开斋',ru:'Ифтар',tr:'İftar'},
rmImage:{ar:'حفظ كصورة',en:'Save as image',fr:'Enregistrer en image',es:'Guardar como imagen',zh:'保存为图片',ru:'Сохранить как изображение',tr:'Resim olarak kaydet'},
rmPdf:{ar:'حفظ كـ PDF',en:'Save as PDF',fr:'Enregistrer en PDF',es:'Guardar como PDF',zh:'保存为 PDF',ru:'Сохранить как PDF',tr:'PDF olarak kaydet'},
rmLoading:{ar:'جارٍ تحميل الإمساكية...',en:'Loading the timetable...',fr:'Chargement du calendrier...',es:'Cargando el calendario...',zh:'正在加载时间表...',ru:'Загрузка расписания...',tr:'İmsakiye yükleniyor...'},
rmError:{ar:'تعذّر تحميل الإمساكية. تحقق من الاتصال وحاول مجددًا.',en:'Couldn’t load the timetable. Check your connection and try again.',fr:'Impossible de charger le calendrier. Vérifiez votre connexion.',es:'No se pudo cargar el calendario. Revisa tu conexión.',zh:'无法加载时间表，请检查网络后重试。',ru:'Не удалось загрузить расписание. Проверьте подключение.',tr:'İmsakiye yüklenemedi. Bağlantınızı kontrol edin.'},
rmNote:{ar:'الأوقات حسب موقعك وطريقة الحساب في الإعدادات. قد تختلف التواريخ مع رؤية الهلال.',en:'Times follow your location and calculation method. Dates may vary with moon sighting.',fr:'Les horaires suivent votre position et la méthode de calcul. Les dates peuvent varier selon l’observation de la lune.',es:'Los horarios dependen de tu ubicación y método de cálculo. Las fechas pueden variar según el avistamiento de la luna.',zh:'时间依据您的位置与计算方法，日期可能因观月而异。',ru:'Время зависит от вашего места и метода расчёта. Даты могут отличаться из-за наблюдения за луной.',tr:'Vakitler konumunuza ve hesaplama yöntemine göre; tarihler hilal görülmesine göre değişebilir.'},
};
const f3 =(k,...a)=>{const d = F3[k];const v = d[state.lang]|| d.en;return typeof v === 'function' ? v(...a):v;};
const lsGet =(k,d)=>{try{const v = localStorage.getItem(k);return v === null ? d:v;}catch(e){return d;}};
const lsSet =(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const openSheet =(id)=> $(id).classList.add('active');
const closeSheet =(id)=> $(id).classList.remove('active');
const fmtDate =(d,opt)=> new Intl.DateTimeFormat(localeForLang(),opt).format(d);
async function shareOrDownload(blob,name,mime,extra){
const file = new File([blob],name,{type:mime});
try{
if(navigator.canShare && navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Muslim Day',...(extra ||{})});return;}
}catch(e){if(e && e.name === 'AbortError')return;}
const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = name;
document.body.appendChild(a);a.click();a.remove();setTimeout(()=> URL.revokeObjectURL(a.href),4000);
}
const WD_TOTAL = 604;
const JUZ_START =[1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
const juzOf =(p)=>{let j = 1;JUZ_START.forEach((s,i)=>{if(p >= s)j = i + 1;});return j;};
let wd ={pace:5,pos:0,khatmas:0,done:null};
try{const r = JSON.parse(lsGet('salati_wird','null'));if(r)wd ={...wd,...r};}catch(e){}
const wdSave =()=> lsSet('salati_wird',JSON.stringify(wd));
const wdIsDone =()=> !!(wd.done && wd.done.date === dateKey(new Date()));
function wdRange(){return[Math.min(WD_TOTAL,wd.pos + 1),Math.min(WD_TOTAL,wd.pos + wd.pace)];}
function wdComplete(){
if(wdIsDone())return;
const[a,b]= wdRange(),n = b - a + 1,prev = wd.pos;
wd.pos += n;wd.done ={date:dateKey(new Date()),pages:n,prev,khatma:false};
if(wd.pos >= WD_TOTAL){wd.khatmas++;wd.pos = 0;wd.done.khatma = true;toast(f3('wdKhatmaDone'));}
wdSave();
try{updateDayField(new Date(),(d)=>{d.quran.read = true;d.quran.pages =(Number(d.quran.pages)|| 0)+ n;});}catch(e){}
renderWird();
}
function wdUndo(){
if(!wdIsDone())return;
const dn = wd.done;wd.pos = dn.prev;if(dn.khatma)wd.khatmas = Math.max(0,wd.khatmas - 1);wd.done = null;wdSave();
try{updateDayField(new Date(),(d)=>{const left = Math.max(0,(Number(d.quran.pages)|| 0)- dn.pages);d.quran.pages = left || null;if(!left)d.quran.read = false;});}catch(e){}
renderWird();
}
function renderWird(){
const card = $('wdCard');if(!card)return;
$('wdTitle').textContent = f3('wdTitle');
const done = wdIsDone(),[a,b]= wdRange();
$('wdTodayLine').textContent = f3('wdToday',a,b);
$('wdJuzLine').textContent = f3('wdJuz',juzOf(a))+(juzOf(b)!== juzOf(a)? ' → ' + f3('wdJuz',juzOf(b)):'');
$('wdBar').style.width = Math.round(wd.pos / WD_TOTAL * 100)+ '%';
$('wdProgress').textContent = f3('wdProgress',wd.pos)+ '  ·  ' + f3('wdKhatmas',wd.khatmas);
const remaining = WD_TOTAL - wd.pos,daysLeft = Math.max(1,Math.ceil(remaining / Math.max(1,wd.pace)));
const eta = addDays(today0(),done ? daysLeft:daysLeft - 1);
$('wdEta').textContent = f3('wdEta',fmtDate(eta,{day:'numeric',month:'long',year:'numeric'}));
$('wdDoneBtn').style.display = done ? 'none':'';
$('wdDoneBtn').textContent = '📖 ' + f3('wdDone');
$('wdDoneRow').style.display = done ? '':'none';
$('wdDoneTxt').textContent = f3('wdDoneToday');$('wdUndoBtn').textContent = f3('wdUndo');
$('wdPaceLbl').textContent = f3('wdPace');$('wdPace').value = wd.pace;
$('wdPosLbl').textContent = f3('wdPos');$('wdPos').value = wd.pos;
$('wdPresets').innerHTML =[30,60,90,180].map(d =>{const p = Math.ceil(WD_TOTAL / d);return `<button type="button" class="wd-chip${p === wd.pace ? ' active' : ''}" data-p="${p}">${esc(f3('wdPreset', d))}</button>`;}).join('');
$('wdNote').textContent = f3('wdNote');
}
const QR =(function(){
const EXP = new Array(512),LOG = new Array(256);
let v = 1;for(let i = 0;i < 255;i++){EXP[i]= v;LOG[v]= i;v <<= 1;if(v & 0x100)v ^= 0x11D;}
for(let i = 255;i < 512;i++)EXP[i]= EXP[i - 255];
const mul =(a,b)=>(a === 0 || b === 0)? 0:EXP[LOG[a]+ LOG[b]];
function rsGen(deg){
let g =[1];
for(let i = 0;i < deg;i++){const ng = new Array(g.length + 1).fill(0);for(let j = 0;j < g.length;j++){ng[j]^= g[j];ng[j + 1]^= mul(g[j],EXP[i]);}g = ng;}
return g;
}
function rsRem(data,deg){
const g = rsGen(deg),res = new Array(deg).fill(0);
for(const b of data){const f = b ^ res[0];res.shift();res.push(0);if(f !== 0)for(let i = 0;i < deg;i++)res[i]^= mul(g[i + 1],f);}
return res;
}
const EC_M =[null,[10,[[1,16]]],[16,[[1,28]]],[26,[[1,44]]],[18,[[2,32]]],[24,[[2,43]]],[16,[[4,27]]],[18,[[4,31]]],[22,[[2,38],[2,39]]],[22,[[3,36],[2,37]]],[26,[[4,43],[1,44]]]];
const ALIGN =[null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];
const dataCap =(ver)=> EC_M[ver][1].reduce((a,[n,d])=> a + n * d,0);
const getBit =(x,i)=>((x >>> i)& 1)!== 0;
function encode(text){
const bytes = Array.from(new TextEncoder().encode(text));
let ver = 0;
for(let k = 1;k <= 10;k++){const cnt = k < 10 ? 8:16;if(4 + cnt + 8 * bytes.length <= dataCap(k)* 8){ver = k;break;}}
if(!ver)throw new Error('too long');
const cap = dataCap(ver),bits =[];
const put =(val,len)=>{for(let i = len - 1;i >= 0;i--)bits.push((val >>> i)& 1);};
put(4,4);put(bytes.length,ver < 10 ? 8:16);bytes.forEach(b => put(b,8));
put(0,Math.min(4,cap * 8 - bits.length));
while(bits.length % 8)bits.push(0);
const data =[];for(let i = 0;i < bits.length;i += 8){let b = 0;for(let j = 0;j < 8;j++)b =(b << 1)| bits[i + j];data.push(b);}
for(let pad = 0xEC;data.length < cap;pad ^= 0xEC ^ 0x11)data.push(pad);
const[ecLen,groups]= EC_M[ver],blocks =[];
let off = 0;
groups.forEach(([n,d])=>{for(let i = 0;i < n;i++){const blk = data.slice(off,off + d);off += d;blocks.push({d:blk,e:rsRem(blk,ecLen)});}});
const maxD = Math.max(...blocks.map(b => b.d.length)),out =[];
for(let i = 0;i < maxD;i++)blocks.forEach(b =>{if(i < b.d.length)out.push(b.d[i]);});
for(let i = 0;i < ecLen;i++)blocks.forEach(b => out.push(b.e[i]));
return{ver,codewords:out};
}
function build(text){
const{ver,codewords}= encode(text),size = 17 + 4 * ver;
const mod = Array.from({length:size},()=> new Array(size).fill(false)),fn = Array.from({length:size},()=> new Array(size).fill(false));
const setFn =(x,y,dark)=>{if(x >= 0 && x < size && y >= 0 && y < size){mod[y][x]= dark;fn[y][x]= true;}};
for(let i = 0;i < size;i++){setFn(6,i,i % 2 === 0);setFn(i,6,i % 2 === 0);}
const finder =(cx,cy)=>{for(let dy = -4;dy <= 4;dy++)for(let dx = -4;dx <= 4;dx++){const d = Math.max(Math.abs(dx),Math.abs(dy));setFn(cx + dx,cy + dy,d !== 2 && d !== 4);}};
finder(3,3);finder(size - 4,3);finder(3,size - 4);
const ap = ALIGN[ver];
ap.forEach((cx,i)=> ap.forEach((cy,j)=>{
if((i === 0 && j === 0)||(i === 0 && j === ap.length - 1)||(i === ap.length - 1 && j === 0))return;
for(let dy = -2;dy <= 2;dy++)for(let dx = -2;dx <= 2;dx++)setFn(cx + dx,cy + dy,Math.max(Math.abs(dx),Math.abs(dy))!== 1);
}));
const drawFormat =(mask)=>{
const d =(0 << 3)| mask;let rem = d;
for(let i = 0;i < 10;i++)rem =(rem << 1)^((rem >>> 9)* 0x537);
const bits =((d << 10)| rem)^ 0x5412;
for(let i = 0;i <= 5;i++)setFn(8,i,getBit(bits,i));
setFn(8,7,getBit(bits,6));setFn(8,8,getBit(bits,7));setFn(7,8,getBit(bits,8));
for(let i = 9;i < 15;i++)setFn(14 - i,8,getBit(bits,i));
for(let i = 0;i < 8;i++)setFn(size - 1 - i,8,getBit(bits,i));
for(let i = 8;i < 15;i++)setFn(8,size - 15 + i,getBit(bits,i));
setFn(8,size - 8,true);
};
drawFormat(0);
if(ver >= 7){
let rem = ver;for(let i = 0;i < 12;i++)rem =(rem << 1)^((rem >>> 11)* 0x1F25);
const bits =(ver << 12)| rem;
for(let i = 0;i < 18;i++){const c = getBit(bits,i),a = size - 11 + i % 3,b = Math.floor(i / 3);setFn(a,b,c);setFn(b,a,c);}
}
const total = codewords.length * 8;let bi = 0;
for(let right = size - 1;right >= 1;right -= 2){
if(right === 6)right = 5;
for(let vert = 0;vert < size;vert++)for(let j = 0;j < 2;j++){
const x = right - j,upward =((right + 1)& 2)=== 0,y = upward ? size - 1 - vert:vert;
if(!fn[y][x]&& bi < total){mod[y][x]=((codewords[bi >>> 3]>>>(7 -(bi & 7)))& 1)!== 0;bi++;}
}
}
const maskFn =[(x,y)=>(x + y)% 2 === 0,(x,y)=> y % 2 === 0,(x,y)=> x % 3 === 0,(x,y)=>(x + y)% 3 === 0,
(x,y)=>(Math.floor(x / 3)+ Math.floor(y / 2))% 2 === 0,(x,y)=>(x * y)% 2 +(x * y)% 3 === 0,
(x,y)=>((x * y)% 2 +(x * y)% 3)% 2 === 0,(x,y)=>((x + y)% 2 +(x * y)% 3)% 2 === 0];
const applyMask =(m)=>{for(let y = 0;y < size;y++)for(let x = 0;x < size;x++)if(!fn[y][x]&& maskFn[m](x,y))mod[y][x]= !mod[y][x];};
const penalty =()=>{
let p = 0;
const lines =[];
for(let y = 0;y < size;y++)lines.push(mod[y].slice());
for(let x = 0;x < size;x++)lines.push(mod.map(r => r[x]));
lines.forEach(line =>{
let run = 1;
for(let i = 1;i <= size;i++){
if(i < size && line[i]=== line[i - 1])run++;
else{if(run >= 5)p += 3 +(run - 5);run = 1;}
}
const s = line.map(b => b ? '1':'0').join('');
for(let i = 0;i + 11 <= size;i++){const w = s.substr(i,11);if(w === '10111010000' || w === '00001011101')p += 40;}
});
for(let y = 0;y < size - 1;y++)for(let x = 0;x < size - 1;x++){const c = mod[y][x];if(c === mod[y][x + 1]&& c === mod[y + 1][x]&& c === mod[y + 1][x + 1])p += 3;}
let dark = 0;mod.forEach(r => r.forEach(b =>{if(b)dark++;}));
p +=(Math.ceil(Math.abs(dark * 20 - size * size * 10)/(size * size))- 1)* 10;
return p;
};
let best = 0,bestP = Infinity;
for(let m = 0;m < 8;m++){applyMask(m);drawFormat(m);const p = penalty();if(p < bestP){bestP = p;best = m;}applyMask(m);}
applyMask(best);drawFormat(best);
return mod;
}
return{build};
})();
const qrOk =(url)=>{try{return QR.build(url);}catch(e){return null;}};
const DEFAULT_SHARE_URL = 'https://muslimappdaybypredaxstudio.netlify.app/';
function appUrl(){return lsGet('salati_share_url','')|| DEFAULT_SHARE_URL;}
function roundRect3(g,x,y,w,h,r){g.beginPath();g.moveTo(x + r,y);g.arcTo(x + w,y,x + w,y + h,r);g.arcTo(x + w,y + h,x,y + h,r);g.arcTo(x,y + h,x,y,r);g.arcTo(x,y,x + w,y,r);g.closePath();}
function wrapText(g,text,maxW){
const words = text.split(/\s+/),lines =[];let cur = '';
words.forEach(w =>{const t = cur ? cur + ' ' + w:w;if(g.measureText(t).width > maxW && cur){lines.push(cur);cur = w;}else cur = t;});
if(cur)lines.push(cur);return lines;
}
async function drawInvite(canvas,url){
const W = 1080,H = 1500;canvas.width = W;canvas.height = H;
const g = canvas.getContext('2d'),cs = getComputedStyle(document.documentElement);
const v =(n,d)=>(cs.getPropertyValue(n)|| '').trim()|| d;
const rtl =(LANGUAGES.find(l => l.code === state.lang)||{}).dir === 'rtl';
const serif = "'Amiri','Tajawal',serif",sans = "'Tajawal','Inter',sans-serif";
try{await Promise.all([document.fonts.load(`700 60px ${serif}`),document.fonts.load(`700 40px ${sans}`)]);}catch(e){}
const bg = g.createLinearGradient(0,0,W,H);bg.addColorStop(0,v('--grad1','#3A1470'));bg.addColorStop(1,v('--grad2','#123E8C'));
g.fillStyle = bg;g.fillRect(0,0,W,H);
g.fillStyle = 'rgba(255,255,255,0.06)';[[W * 0.9,150,320],[40,900,260],[W * 0.85,H - 100,360]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();});
g.textAlign = 'center';g.direction = rtl ? 'rtl':'ltr';
const logo = document.querySelector('header img, .hero img');
if(logo && logo.complete && logo.naturalWidth){const lw = 170,lh = lw * logo.naturalHeight / logo.naturalWidth;try{g.drawImage(logo,W / 2 - lw / 2,90,lw,lh);}catch(e){}}
else{g.font = `120px ${sans}`;g.fillStyle = '#fff';g.fillText('🕌',W / 2,220);}
g.fillStyle = '#fff';g.font = `700 92px ${serif}`;g.fillText('Muslim Day',W / 2,345);
g.fillStyle = 'rgba(255,255,255,0.9)';g.font = `500 40px ${sans}`;
wrapText(g,f3('invTag'),860).forEach((ln,i)=> g.fillText(ln,W / 2,425 + i * 56));
const box = 700,bx =(W - box)/ 2,by = 560;
g.fillStyle = '#fff';roundRect3(g,bx,by,box,box,48);g.fill();
const m = url ? qrOk(url):null;
if(m){
const n = m.length,quiet = 3,ms = Math.floor((box - 80)/(n + quiet * 2)),qs = ms * n,qx = bx +(box - qs)/ 2,qy = by +(box - qs)/ 2;
g.fillStyle = '#111';
for(let y = 0;y < n;y++)for(let x = 0;x < n;x++)if(m[y][x])g.fillRect(qx + x * ms,qy + y * ms,ms,ms);
}else{g.fillStyle = '#999';g.font = `600 36px ${sans}`;g.fillText('—',W / 2,by + box / 2);}
g.fillStyle = v('--amber','#E8B75A');g.font = `700 46px ${sans}`;g.fillText(f3('invScan'),W / 2,by + box + 90);
g.direction = 'ltr';g.fillStyle = 'rgba(255,255,255,0.92)';g.font = "600 34px 'Inter',sans-serif";
const label = url.length > 46 ? url.slice(0,44)+ '…':url;
g.fillText(label,W / 2,by + box + 140);
g.fillStyle = 'rgba(255,255,255,0.8)';g.font = "600 28px 'Inter',sans-serif";g.fillText('By Predax Studio',W / 2,H - 34);
return canvas;
}
let invTimer = null;
async function renderInvite(){
if(!$('invOverlay'))return;
$('invTitle').textContent = f3('invTitle');$('invLinkLbl').textContent = f3('invLink');
$('invShareTxt').textContent = f3('invShare');$('invCopyTxt').textContent = f3('invCopy');
const url = $('invUrl').value.trim(),valid = /^https?:\/\/\S{4,}$/.test(url)&& url.length <= 200 && !!qrOk(url);
$('invErr').textContent =(url && !valid)? f3('invBad'):'';
await drawInvite($('invCanvas'),valid ? url:'');
}
async function shareInvite(){
const url = $('invUrl').value.trim();
if(!/^https?:\/\/\S{4,}$/.test(url)|| url.length > 200){$('invErr').textContent = f3('invBad');return;}
lsSet('salati_share_url',url);
const blob = await new Promise(res => $('invCanvas').toBlob(res,'image/png'));
await shareOrDownload(blob,'muslim-day-invite.png','image/png',{text:f3('invMsg')+ '\n' + url,url});
}
async function copyInvite(){
const url = $('invUrl').value.trim();if(!url)return;
try{await navigator.clipboard.writeText(url);toast(f3('invCopied'));}catch(e){try{$('invUrl').select();document.execCommand('copy');toast(f3('invCopied'));}catch(e2){}}
}
let rm ={year:0,rows:[],loading:false,error:false};
function ramadanYear(){
const h = X.hparts(today0());
return h.m > 9 ? h.y + 1:h.y;
}
const stripTime =(s)=>{const m = String(s || '').match(/\d{1,2}:\d{2}/);return m ? m[0].padStart(5,'0'):'—';};
function rmKey(year){
const c = state.coords,s = state.settings;
return[year,c.lat.toFixed(2),c.lng.toFixed(2),s.method,s.school,(typeof buildTuneString === 'function' ? buildTuneString():''),lsGet('salati_hijri_off','0')].join('|');
}
async function fetchRamadan(year){
const{lat,lng}= state.coords,s = state.settings;
const params = new URLSearchParams({latitude:lat,longitude:lng,school:s.school,tune:buildTuneString()});
const m = s.method !== 'auto' ? s.method:autoMethod(lat,lng);
if(m != null)params.set('method',m);
if(Math.abs(lat)> 48)params.set('latitudeAdjustmentMethod','3');
const off = Number(lsGet('salati_hijri_off','0'))|| 0;if(off)params.set('adjustment',String(off));
const ctl = new AbortController(),to = setTimeout(()=> ctl.abort(),15000);
try{
const res = await fetch(`https://api.aladhan.com/v1/hijriCalendar/${year}/9?${params.toString()}`,{signal:ctl.signal});
const data = await res.json();
if(!res.ok || data.code !== 200 || !Array.isArray(data.data))throw new Error('bad response');
return data.data.map((d,i)=>{
const[dd,mm,yy]= String(d.date.gregorian.date).split('-').map(Number);
return{n:i + 1,d:new Date(yy,mm - 1,dd),imsak:stripTime(d.timings.Imsak),fajr:stripTime(d.timings.Fajr),maghrib:stripTime(d.timings.Maghrib)};
});
}finally{clearTimeout(to);}
}
async function loadRamadan(){
if(!state.coords){if(typeof requestLocation === 'function')requestLocation();alert(t().setLocFirst);return;}
const year = ramadanYear(),key = rmKey(year);
rm ={year,rows:[],loading:true,error:false};
let cached = null;
try{cached = JSON.parse(lsGet('salati_ramadan_v1','null'));}catch(e){}
if(cached && cached.k === key && Array.isArray(cached.rows)){rm.rows = cached.rows.map(r =>({...r,d:new Date(r.d)}));rm.loading = false;renderRamadan();return;}
renderRamadan();
try{
rm.rows = await fetchRamadan(year);
lsSet('salati_ramadan_v1',JSON.stringify({k:key,rows:rm.rows.map(r =>({...r,d:r.d.toISOString()}))}));
}catch(e){
console.warn(e);
if(cached && Array.isArray(cached.rows))rm.rows = cached.rows.map(r =>({...r,d:new Date(r.d)}));else rm.error = true;
}
rm.loading = false;renderRamadan();
}
function renderRamadan(){
if(!$('rmOverlay'))return;
$('rmTitle').textContent = f3('rmTitle',rm.year || ramadanYear());
$('rmNote').textContent = f3('rmNote');
$('rmImageTxt').textContent = f3('rmImage');$('rmPdfTxt').textContent = f3('rmPdf');
const ready = rm.rows.length > 0;
$('rmImageBtn').disabled = !ready;$('rmPdfBtn').disabled = !ready;
if(rm.loading){$('rmBody').innerHTML = `<div class="rm-msg">${esc(f3('rmLoading'))}</div>`;return;}
if(!ready){$('rmBody').innerHTML = `<div class="rm-msg">${esc(f3('rmError'))}</div>`;return;}
const t0 = today0().getTime(),names = t().prayerNames;
const head = `<div class="rm-row rm-head"><span>${esc(f3('rmDay'))}</span><span>${esc(f3('rmDate'))}</span><span>${esc(f3('rmImsak'))}</span><span>${esc(names.Fajr)}</span><span>${esc(f3('rmIftar'))}</span></div>`;
$('rmBody').innerHTML = head + rm.rows.map(r => `<div class="rm-row${r.d.getTime() === t0 ? ' today' : ''}"><span>${r.n}</span><span>${esc(fmtDate(r.d, { weekday:'short', day:'numeric', month:'short' }))}</span><span>${r.imsak}</span><span>${r.fajr}</span><span>${r.maghrib}</span></div>`).join('');
const today = $('rmBody').querySelector('.rm-row.today');if(today)setTimeout(()=> today.scrollIntoView({block:'center'}),60);
}
async function buildRamadanCanvas(){
const W = 1080,H = 1527,c = document.createElement('canvas');c.width = W;c.height = H;
const g = c.getContext('2d'),cs = getComputedStyle(document.documentElement);
const v =(n,d)=>(cs.getPropertyValue(n)|| '').trim()|| d;
const rtl =(LANGUAGES.find(l => l.code === state.lang)||{}).dir === 'rtl';
const serif = "'Amiri','Tajawal',serif",sans = "'Tajawal','Inter',sans-serif",names = t().prayerNames;
try{await Promise.all([document.fonts.load(`700 60px ${serif}`),document.fonts.load(`700 30px ${sans}`)]);}catch(e){}
g.fillStyle = '#fff';g.fillRect(0,0,W,H);
const hg = g.createLinearGradient(0,0,W,230);hg.addColorStop(0,v('--grad1','#3A1470'));hg.addColorStop(1,v('--grad2','#123E8C'));
g.fillStyle = hg;g.fillRect(0,0,W,230);
g.textAlign = 'center';g.direction = rtl ? 'rtl':'ltr';
g.fillStyle = '#fff';g.font = `700 76px ${serif}`;g.fillText('🌙 ' + f3('rmTitle',rm.year),W / 2,112);
const place = state.settings.lastPlace && state.settings.lastPlace.name;
g.fillStyle = v('--amber','#E8B75A');g.font = `600 36px ${sans}`;g.fillText(place || 'Muslim Day',W / 2,176);
const cols =[0.09,0.30,0.52,0.72,0.90],rowH = 36,top = 250;
const xs = cols.map(p => W * p);
const accent = v('--teal','#5A3FE0');
g.fillStyle = accent;roundRect3(g,40,top - 6,W - 80,46,14);g.fill();
g.fillStyle = '#fff';g.font = `700 26px ${sans}`;
[f3('rmDay'),f3('rmDate'),f3('rmImsak'),names.Fajr,f3('rmIftar')].forEach((tx,i)=> g.fillText(tx,xs[i],top + 28));
const t0 = today0().getTime();
rm.rows.forEach((r,i)=>{
const y = top + 52 + i * rowH;
if(r.d.getTime()=== t0){g.fillStyle = 'rgba(232,183,90,0.35)';g.fillRect(40,y - 2,W - 80,rowH - 2);}
else if(i % 2 === 0){g.fillStyle = 'rgba(0,0,0,0.045)';g.fillRect(40,y - 2,W - 80,rowH - 2);}
g.fillStyle = '#222';g.font = `600 24px 'Inter',${sans}`;g.direction = 'ltr';
g.fillText(String(r.n),xs[0],y + 24);
g.fillText(fmtDate(r.d,{weekday:'short',day:'numeric',month:'short'}),xs[1],y + 24);
g.fillText(r.imsak,xs[2],y + 24);g.fillText(r.fajr,xs[3],y + 24);
g.fillStyle = accent;g.font = `800 25px 'Inter',${sans}`;g.fillText(r.maghrib,xs[4],y + 24);
g.direction = rtl ? 'rtl':'ltr';
});
g.fillStyle = '#666';g.font = `500 22px ${sans}`;
g.fillText(f3('rmNote').length > 90 ? f3('rmNote').slice(0,88)+ '…':f3('rmNote'),W / 2,H - 62);
g.direction = 'ltr';g.fillStyle = '#888';g.font = "600 22px 'Inter',sans-serif";g.fillText('Muslim Day  ·  By Predax Studio',W / 2,H - 28);
return c;
}
function pdfFromJpeg(jpeg,iw,ih){
const enc = new TextEncoder(),parts =[],offsets =[];let len = 0;
const push =(x)=>{const b = typeof x === 'string' ? enc.encode(x):x;parts.push(b);len += b.length;};
const PW = 595,PH = 842,sc = Math.min(PW / iw,PH / ih),w =(iw * sc).toFixed(2),h =(ih * sc).toFixed(2),x =((PW - iw * sc)/ 2).toFixed(2),y =((PH - ih * sc)/ 2).toFixed(2);
const content = `q ${w} 0 0 ${h} ${x} ${y} cm /Im0 Do Q`;
push('%PDF-1.4\n');
const obj =(n,body)=>{offsets[n]= len;push(`${n} 0 obj\n${body}\nendobj\n`);};
obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
offsets[4]= len;push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);push(jpeg);push('\nendstream\nendobj\n');
obj(5,`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
const xref = len;let xr = 'xref\n0 6\n0000000000 65535 f \n';
for(let i = 1;i <= 5;i++)xr += String(offsets[i]).padStart(10,'0')+ ' 00000 n \n';
push(xr + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
return new Blob(parts,{type:'application/pdf'});
}
async function saveRamadan(kind){
if(!rm.rows.length)return;
const btn = $(kind === 'pdf' ? 'rmPdfBtn':'rmImageBtn');btn.disabled = true;
try{
const c = await buildRamadanCanvas();
if(kind === 'pdf'){
const dataUrl = c.toDataURL('image/jpeg',0.92),bin = atob(dataUrl.split(',')[1]),bytes = new Uint8Array(bin.length);
for(let i = 0;i < bin.length;i++)bytes[i]= bin.charCodeAt(i);
await shareOrDownload(pdfFromJpeg(bytes,c.width,c.height),`ramadan-${rm.year}.pdf`,'application/pdf');
}else{
const blob = await new Promise(res => c.toBlob(res,'image/png'));
await shareOrDownload(blob,`ramadan-${rm.year}.png`,'image/png');
}
}catch(e){console.error(e);}
finally{btn.disabled = !rm.rows.length;}
}
function renderTools3(){
const a = $('tlRamadanTxt');if(a)a.textContent = f3('tlRamadan');
const k = $('kidsRowTitle');if(k){k.textContent = f3('kidsRowTitle');$('kidsRowSub').textContent = f3('kidsRowSub');$('invRowTitle').textContent = f3('invTitle');$('invRowSub').textContent = f3('invRowSub');}
}
function inject3(){
const row = $('toolsRow');
if(row && !$('tlRamadan')){
row.insertAdjacentHTML('beforeend',`
      <button type="button" id="tlRamadan"><span>🌙</span><span id="tlRamadanTxt">—</span></button>`);
}
if(!$('openKidsRow')){
const locH = $('txtSecSettingsLocation'),locCard = locH ? locH.closest('.card'):null;
const rows = `
      <button type="button" class="card act-card" id="openKidsRow"><span class="act-ic">🧒</span><span class="act-tx"><b id="kidsRowTitle">—</b><small id="kidsRowSub">—</small></span></button>
      <button type="button" class="card act-card" id="openInviteRow"><span class="act-ic">📲</span><span class="act-tx"><b id="invRowTitle">—</b><small id="invRowSub">—</small></span></button>`;
if(locCard)locCard.insertAdjacentHTML('afterend',rows);
else{const sl = document.querySelector('.studio-link');if(sl)sl.insertAdjacentHTML('beforebegin',rows);}
}
const qd = $('mdStatsCard')|| $('qdCard');
if(qd && !$('wdCard')){
qd.insertAdjacentHTML('afterend',`
      <div class="card" id="wdCard">
        <h3 class="section-title" style="font-size:16px;"><span>📖</span><span id="wdTitle">—</span></h3>
        <div class="wd-today" id="wdTodayLine">—</div>
        <div class="wd-juz" id="wdJuzLine"></div>
        <div class="wd-bar"><div id="wdBar"></div></div>
        <div class="wd-progress" id="wdProgress"></div>
        <button type="button" class="primary wd-done" id="wdDoneBtn">—</button>
        <div class="wd-doneRow" id="wdDoneRow" style="display:none;"><span id="wdDoneTxt">—</span><button type="button" class="ghost small" id="wdUndoBtn">—</button></div>
        <div class="wd-eta" id="wdEta"></div>
        <div class="wd-presets" id="wdPresets"></div>
        <div class="qd-pace"><span id="wdPaceLbl">—</span><input type="number" id="wdPace" min="1" max="60" inputmode="numeric"></div>
        <div class="qd-pace"><span id="wdPosLbl">—</span><input type="number" id="wdPos" min="0" max="603" inputmode="numeric"></div>
        <div class="occ-note" id="wdNote"></div>
      </div>`);
}
if(!$('invOverlay')){
document.body.insertAdjacentHTML('beforeend',`
    <div class="lang-sheet-overlay" id="invOverlay"><div class="lang-sheet inv-sheet">
      <h3 id="invTitle">—</h3>
      <div class="inv-body">
        <canvas id="invCanvas" class="inv-canvas"></canvas>
        <label class="inv-field"><span id="invLinkLbl">—</span><input type="url" id="invUrl" dir="ltr" inputmode="url" placeholder="https://"></label>
        <div class="inv-err" id="invErr"></div>
        <div class="inv-actions">
          <button type="button" class="primary" id="invShareBtn">📤 <span id="invShareTxt">—</span></button>
          <button type="button" class="ghost" id="invCopyBtn">🔗 <span id="invCopyTxt">—</span></button>
        </div>
      </div>
      <button class="ghost" id="invClose" type="button" style="margin:6px 16px 4px; width:calc(100% - 32px);">✕</button>
    </div></div>
    <div class="lang-sheet-overlay" id="rmOverlay"><div class="lang-sheet rm-sheet">
      <h3 id="rmTitle">—</h3>
      <div id="rmBody" class="rm-body"></div>
      <div class="occ-note" id="rmNote"></div>
      <div class="rm-actions">
        <button type="button" class="primary" id="rmImageBtn">🖼️ <span id="rmImageTxt">—</span></button>
        <button type="button" class="primary" id="rmPdfBtn">📄 <span id="rmPdfTxt">—</span></button>
      </div>
      <button class="ghost" id="rmClose" type="button" style="margin:6px 16px 4px; width:calc(100% - 32px);">✕</button>
    </div></div>`);
}
}
function bind3(){
$('wdDoneBtn').addEventListener('click',wdComplete);
$('wdUndoBtn').addEventListener('click',wdUndo);
$('wdPresets').addEventListener('click',(e)=>{const b = e.target.closest('.wd-chip');if(!b)return;wd.pace = Number(b.dataset.p);wdSave();renderWird();});
$('wdPace').addEventListener('change',(e)=>{wd.pace = Math.max(1,Math.min(60,Math.floor(Number(e.target.value)|| 1)));wdSave();renderWird();});
$('wdPos').addEventListener('change',(e)=>{wd.pos = Math.max(0,Math.min(WD_TOTAL - 1,Math.floor(Number(e.target.value)|| 0)));wd.done = null;wdSave();renderWird();});
const openInvite =()=>{$('invUrl').value = appUrl();openSheet('invOverlay');renderInvite();};
$('openInviteRow').addEventListener('click',openInvite);
$('openKidsRow').addEventListener('click',()=>{if(window.SalatiX2 && window.SalatiX2.openKids)window.SalatiX2.openKids();});
$('invUrl').addEventListener('input',()=>{clearTimeout(invTimer);invTimer = setTimeout(renderInvite,250);});
$('invShareBtn').addEventListener('click',shareInvite);
$('invCopyBtn').addEventListener('click',copyInvite);
$('invClose').addEventListener('click',()=> closeSheet('invOverlay'));
$('invOverlay').addEventListener('click',(e)=>{if(e.target.id === 'invOverlay')closeSheet('invOverlay');});
$('tlRamadan').addEventListener('click',()=>{openSheet('rmOverlay');loadRamadan();});
$('rmClose').addEventListener('click',()=> closeSheet('rmOverlay'));
$('rmOverlay').addEventListener('click',(e)=>{if(e.target.id === 'rmOverlay')closeSheet('rmOverlay');});
$('rmImageBtn').addEventListener('click',()=> saveRamadan('image'));
$('rmPdfBtn').addEventListener('click',()=> saveRamadan('pdf'));
}
function renderAll3(){
renderTools3();renderWird();
if($('invOverlay')&& $('invOverlay').classList.contains('active'))renderInvite();
if($('rmOverlay')&& $('rmOverlay').classList.contains('active'))renderRamadan();
}
const ACC_KEY = 'salati_acc';
let accState ={};try{accState = JSON.parse(lsGet(ACC_KEY,'{}'))||{};}catch(e){}
function accordionize(card,key,icon){
if(!card || card.dataset.acc)return;
const head = Array.from(card.children).find(el => el.tagName === 'H3');
if(!head)return;
card.dataset.acc = key;card.classList.add('acc-card');
const lead = head.firstElementChild;
if(lead && lead.tagName === 'SPAN' && !lead.id && !icon){icon = lead.textContent.trim();lead.remove();}
head.classList.add('acc-head');head.setAttribute('role','button');head.tabIndex = 0;
if(icon)head.dataset.icon = icon;
const body = document.createElement('div');body.className = 'acc-body';
while(head.nextSibling)body.appendChild(head.nextSibling);
card.appendChild(body);
if(head.querySelector('span[id]')){const sum = document.createElement('span');sum.className = 'acc-sum';head.appendChild(sum);}
const apply =()=>{const open = !!accState[key];card.classList.toggle('open',open);head.setAttribute('aria-expanded',String(open));};
const toggle =()=>{accState[key]= !accState[key];lsSet(ACC_KEY,JSON.stringify(accState));apply();};
head.addEventListener('click',toggle);
head.addEventListener('keydown',(e)=>{if(e.key === 'Enter' || e.key === ' '){e.preventDefault();toggle();}});
apply();
}
function updateAccSummaries(){
const set =(cardId,txt)=>{const c = $(cardId);const s = c && c.querySelector('.acc-sum');if(s)s.textContent = txt;};
const t0 = document.querySelector('#stTiles .st-tile b');set('mdStatsCard',t0 ? t0.textContent:'');
set('wdCard',Math.round(wd.pos / WD_TOTAL * 100)+ '%');
let total = 0;try{const q = JSON.parse(lsGet('salati_qada','null'))||{};PRAYER_ORDER.forEach(k =>{total += Number(q[k])|| 0;});}catch(e){}
set('qdCard',total > 0 ? '⏳ ' + total:'✓');
}
function setupAccordions(){
accordionize($('mdStatsCard'),'md-stats');
accordionize($('wdCard'),'md-wird');
accordionize($('qdCard'),'md-qada');
const sec =(id)=>{const h = $(id);return h ? h.closest('.card'):null;};
accordionize(sec('txtSecSettingsPrayer'),'st-prayer','🕋');
accordionize(sec('txtSecSettingsAdhan'),'st-adhan','🔔');
const adhanCard = sec('txtSecSettingsAdhan'),adv = $('advCard');
if(adhanCard && adv)adhanCard.insertAdjacentElement('afterend',adv);
accordionize(adv,'st-adv');
accordionize($('a11yCard'),'st-a11y');
accordionize(sec('txtSecSettingsLocation'),'st-loc','📍');
updateAccSummaries();
if(window.MutationObserver){
const mo = new MutationObserver(()=> updateAccSummaries());
['mdStatsCard','wdCard','qdCard'].forEach(id =>{const b = $(id)&& $(id).querySelector('.acc-body');if(b)mo.observe(b,{subtree:true,childList:true,characterData:true});});
}
}
const _al3 = applyLanguage;
applyLanguage = function(){const r = _al3.apply(this,arguments);try{renderAll3();}catch(e){console.error(e);}return r;};
const _rmd3 = renderMuslimDay;
renderMuslimDay = function(){const r = _rmd3.apply(this,arguments);try{renderWird();}catch(e){}return r;};
inject3();
bind3();
renderAll3();
setupAccordions();
window.SalatiX3 ={qrMatrix:(s)=> QR.build(s),pdfFromJpeg,wdRange,juzOf,buildRamadanCanvas:()=> buildRamadanCanvas()};
})();
