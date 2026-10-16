// يُحمَّل هذا الملف مبكرًا في <head> لتفعيل الثيم المحفوظ فورًا قبل رسم الصفحة (يمنع "ومضة" الثيم الافتراضي)
(function(){
  try{
    var t = localStorage.getItem('salati_theme') || 'brand';
    document.documentElement.setAttribute('data-theme', t);
  }catch(e){}
})();

// العرض وسهولة الاستخدام: تطبيق حجم الخط والتباين وتقليل الحركة مبكرًا لتجنّب ومضة التغيير
(function(){
  try{
    var a = JSON.parse(localStorage.getItem('salati_a11y') || 'null'); if(!a) return;
    var r = document.documentElement;
    if(a.fs) r.style.setProperty('--fs', String(a.fs));
    if(a.contrast) r.setAttribute('data-contrast', 'high');
    if(a.reduce) r.setAttribute('data-motion', 'reduce');
  }catch(e){}
})();
