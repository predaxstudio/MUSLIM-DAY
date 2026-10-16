/* =====================================================================
   ربط تطبيق "صلاتي" بـ Firebase (Authentication + Firestore اختياري)
   -----------------------------------------------------------------
   هذا الملف وحدة ES Module مستقلة عن script.js الأصلي (لا يُعدّل بنيته).
   يقوم بـ:
   1) تهيئة Firebase بإعداد المشروع الحقيقي (muslim-day-365) كما هو، دون أي تغيير.
   2) تفعيل تسجيل الدخول بالبريد الإلكتروني/كلمة المرور.
   3) اعتماد Firebase UID كمعرّف أساسي للحساب.
   4) استخدام الاستمرارية المحلية لـ Firebase (IndexedDB عبر browserLocalPersistence)
      بدل الاعتماد على localStorage لحفظ حالة تسجيل الدخول — الجلسة تبقى بعد
      إغلاق التطبيق وإعادة فتحه، تمامًا مثل أي تطبيق حقيقي متصل بحساب.
   5) توفير مزامنة اختيارية لبيانات المستخدم (الإعدادات وسجل "يوم المسلم")
      عبر Firestore مرتبطة بالـ UID، بحيث يمكن لاحقًا استخدام نفس الحساب
      على نسخة Android أو Windows من نفس المشروع.
   يعرض هذا الملف واجهة برمجية بسيطة على window.SalatiAuth، ويُطلق حدث
   'salati-firebase-ready' عند اكتمال التهيئة، لأن هذا سكربت من نوع module
   (مؤجّل تلقائيًا) وقد يبدأ تنفيذه بعد script.js الكلاسيكي — لذلك يعتمد
   script.js على هذا الحدث بدل افتراض ترتيب تحميل معيّن.
   ===================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics, isSupported as analyticsIsSupported } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { getMessaging, getToken, isSupported as messagingIsSupported } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInAnonymously,
  linkWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut as firebaseSignOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// إعداد Firebase الحقيقي كما وصل من Firebase Console — بدون أي تعديل على القيم.
const firebaseConfig = {
  apiKey: "AIzaSyABal1158Y5H-lmgMS5Lsfxx3wyr26VpAg",
  authDomain: "muslim-day-365.firebaseapp.com",
  projectId: "muslim-day-365",
  storageBucket: "muslim-day-365.firebasestorage.app",
  messagingSenderId: "220100633187",
  appId: "1:220100633187:web:256f3b20c00472ab308e56",
  measurementId: "G-S31GRHZMXE",
};

const app = initializeApp(firebaseConfig);

// Analytics اختياري تمامًا: قد يُحجب بمانع إعلانات أو دون اتصال، ويجب ألا يوقف باقي التطبيق أبدًا.
analyticsIsSupported()
  .then((ok) => { if (ok) { try { getAnalytics(app); } catch (e) { /* تجاهل */ } } })
  .catch(() => {});

const auth = getAuth(app);
const db = getFirestore(app);

// استمرارية محلية حقيقية (IndexedDB داخليًا) بدل الاعتماد على localStorage —
// هذا ما يجعل جلسة المستخدم تبقى بعد إغلاق التطبيق وإعادة فتحه.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("[Firebase] تعذّر ضبط استمرارية الجلسة المحلية:", err);
});

function mapUser(u) {
  if (!u) return null;
  return {
    uid: u.uid,                 // المعرّف الأساسي للحساب في كل أنحاء التطبيق
    name: u.displayName || "",
    email: u.email || "",
    picture: u.photoURL || "",
    isAnonymous: !!u.isAnonymous, // زائر: له UID حقيقي لكن بلا بريد/كلمة مرور بعد
  };
}

function friendlyAuthError(err) {
  const code = (err && err.code) || "";
  const map = {
    "auth/invalid-email": "البريد الإلكتروني غير صالح.",
    "auth/missing-password": "الرجاء إدخال كلمة المرور.",
    "auth/weak-password": "كلمة المرور ضعيفة جدًا (6 أحرف على الأقل).",
    "auth/email-already-in-use": "هذا البريد الإلكتروني مستخدم بالفعل — جرّب تسجيل الدخول بدل إنشاء حساب.",
    "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "auth/wrong-password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "auth/user-not-found": "لا يوجد حساب بهذا البريد الإلكتروني.",
    "auth/too-many-requests": "محاولات كثيرة جدًا، الرجاء المحاولة لاحقًا.",
    "auth/popup-closed-by-user": "تم إغلاق نافذة تسجيل الدخول قبل إكمالها.",
    "auth/network-request-failed": "تعذّر الاتصال بالشبكة، تحقق من الإنترنت.",
    "auth/requires-recent-login": "لأمانك، أعد تسجيل الدخول ثم حاول مرة أخرى.",
    "auth/unauthorized-domain": "هذا النطاق غير مصرّح به في Firebase. أضفه في Authentication ← Settings ← Authorized domains (أو افتح التطبيق من localhost / رابط مستضاف).",
    "auth/popup-blocked": "المتصفح حجب نافذة Google. اسمح بالنوافذ المنبثقة لهذا الموقع ثم أعد المحاولة.",
    "auth/cancelled-popup-request": "تم إلغاء الطلب، اضغط الزر مرة واحدة فقط وأعد المحاولة.",
    "auth/operation-not-supported-in-this-environment": "تسجيل الدخول بـ Google لا يعمل من ملف محلي (file://). افتح التطبيق عبر localhost أو رابط https.",
    "auth/internal-error": "تعذّر تحميل خدمة Google (قد تكون محجوبة بمانع إعلانات أو سياسة أمان). عطّل مانع الإعلانات وأعد المحاولة.",
    "auth/operation-not-allowed": "طريقة تسجيل الدخول هذه غير مُفعّلة بعد في إعدادات Firebase.",
    "auth/admin-restricted-operation": "طريقة تسجيل الدخول هذه غير مُفعّلة بعد في إعدادات Firebase.",
    "auth/user-disabled": "تم تعطيل هذا الحساب. تواصل مع الدعم.",
    "auth/credential-already-in-use": "هذا الحساب مرتبط بمستخدم آخر بالفعل.",
    "auth/provider-already-linked": "هذه الطريقة مرتبطة بحسابك بالفعل.",
    "auth/account-exists-with-different-credential": "يوجد حساب بهذا البريد بطريقة دخول مختلفة — سجّل الدخول بالطريقة التي أنشأته بها.",
  };
  return map[code] || ("حدث خطأ غير متوقع، الرجاء المحاولة مرة أخرى." + (code ? " (" + code + ")" : ""));
}

const authListeners = [];
let authResolved = false;
function emitAuth() {
  const mapped = mapUser(auth.currentUser);
  authListeners.forEach((fn) => {
    try { fn(mapped); } catch (e) { console.error(e); }
  });
}
onAuthStateChanged(auth, () => { authResolved = true; emitAuth(); });

window.SalatiAuth = {
  /** يُستدعى في كل مرة تتغيّر فيها حالة تسجيل الدخول (بما فيها استعادة الجلسة عند فتح التطبيق). */
  onChange(fn) {
    authListeners.push(fn);
    if (authResolved) { try { fn(mapUser(auth.currentUser)); } catch (e) { console.error(e); } }
  },
  getCurrentUser() {
    return mapUser(auth.currentUser);
  },
  /** المتابعة كزائر: مستخدم مجهول حقيقي في Firebase (له UID ثابت ويمكن ترقيته لاحقًا بدون فقدان البيانات). */
  async signInAsGuest() {
    if (auth.currentUser) return { user: mapUser(auth.currentUser) };
    try {
      const cred = await signInAnonymously(auth);
      return { user: mapUser(cred.user) };
    } catch (err) {
      const code = (err && err.code) || "";
      console.warn("[Firebase] Anonymous sign-in failed:", code, err);
      // unavailable=true → الواجهة تسمح بالاستخدام محليًا بدل حجب المستخدم (بلا اتصال أو الدخول المجهول غير مفعّل)
      return { error: friendlyAuthError(err), unavailable: true };
    }
  },
  async registerWithEmail(email, password, displayName) {
    try {
      const cur = auth.currentUser;
      let user;
      if (cur && cur.isAnonymous) {
        // ترقية الزائر إلى حساب دائم مع الاحتفاظ بنفس الـ UID
        user = (await linkWithCredential(cur, EmailAuthProvider.credential(email, password))).user;
      } else {
        user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      }
      if (displayName) {
        try { await updateProfile(user, { displayName }); } catch (e) { /* غير حرج */ }
      }
      // Firebase يطلق onAuthStateChanged قبل updateProfile (والربط لا يطلقه أصلًا)، فنُبلغ الواجهة بالحالة النهائية (الاسم الجديد)
      emitAuth();
      return { user: mapUser(user) };
    } catch (err) {
      return { error: friendlyAuthError(err) };
    }
  },
  async signInWithEmail(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return { user: mapUser(cred.user) };
    } catch (err) {
      return { error: friendlyAuthError(err) };
    }
  },
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { ok: true };
    } catch (err) {
      return { error: friendlyAuthError(err) };
    }
  },
  async signOutUser() {
    try {
      await firebaseSignOut(auth);
      return { ok: true };
    } catch (err) {
      return { error: friendlyAuthError(err) };
    }
  },
  /* ===== تأكيد الهوية قبل تعديل الحساب ===== */
  /** 'password' إن كان للحساب كلمة مرور (بريد)، وإلا 'google'. */
  getAuthMethod() {
    const u = auth.currentUser;
    if (!u) return null;
    if (u.isAnonymous) return "anonymous";
    return u.providerData.some((p) => p.providerId === "password") ? "password" : "google";
  },
  async reauthenticate(password) {
    const u = auth.currentUser;
    if (!u) return { error: friendlyAuthError(null) };
    try {
      if (this.getAuthMethod() === "password") {
        await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, password || ""));
      } else {
        return { error: friendlyAuthError({ code: "auth/requires-recent-login" }) };
      }
      return { ok: true };
    } catch (err) {
      const code = (err && err.code) || "";
      const wrongPassword = code === "auth/invalid-credential" || code === "auth/wrong-password";
      return { error: friendlyAuthError(err), wrongPassword };
    }
  },
  /* ===== تغيير كلمة المرور (حسابات البريد فقط) ===== */
  async changePassword(currentPassword, newPassword) {
    const u = auth.currentUser;
    if (!u || !u.email) return { error: friendlyAuthError(null) };
    if (this.getAuthMethod() !== "password") return { error: "not-password" };
    try {
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, currentPassword || ""));
    } catch (err) {
      const code = (err && err.code) || "";
      const wrong = code === "auth/invalid-credential" || code === "auth/wrong-password";
      return { error: friendlyAuthError(err), wrongPassword: wrong };
    }
    try {
      await updatePassword(u, newPassword);
      return { ok: true };
    } catch (err) {
      return { error: friendlyAuthError(err) };
    }
  },
  /* ===== تعديل الاسم وصورة الحساب ===== */
  async updateName(name) {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      return { ok: true };
    } catch (err) {
      return { error: friendlyAuthError(err) };
    }
  },
  // صورة الحساب تُحفظ مصغّرة (256px JPEG) داخل مستند المستخدم في Firestore، لأن photoURL في Auth لا يتّسع لصورة.
  async saveAvatar(uid, dataUrl) {
    try {
      await setDoc(doc(db, "users", uid), { avatar: dataUrl || "", updatedAt: serverTimestamp() }, { merge: true });
      return { ok: true };
    } catch (e) {
      console.warn("[Firestore] تعذّر حفظ صورة الحساب:", e);
      return { error: "avatar-save-failed" };
    }
  },
  async loadAvatar(uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      return snap.exists() ? (snap.data().avatar || "") : "";
    } catch (e) { return null; }
  },
  /* ===== عدّاد الزوار: مستند عام واحد stats/visitors يزيد بمقدار 1 مع كل فتح للتطبيق ===== */
  /** يزيد العدّاد (إن كان countIt=true) ثم يقرأ القيمة. يعيد عدد الزيارات المسجّلة أو null عند الفشل. */
  async trackVisit(countIt) {
    const ref = doc(db, "stats", "visitors");
    if (countIt) {
      try { await setDoc(ref, { count: increment(1) }, { merge: true }); }
      catch (e) { console.warn("[Firestore] تعذّر تسجيل الزيارة:", e); }
    }
    try {
      const snap = await getDoc(ref);
      const n = snap.exists() ? Number(snap.data().count) : 0;
      return Number.isFinite(n) ? n : null;
    } catch (e) {
      console.warn("[Firestore] تعذّرت قراءة عدد الزوار:", e);
      return null;
    }
  },
  /* ===== مزامنة اختيارية عبر Firestore، مرتبطة بـ UID (لا تكسر شيئًا إن لم تكن مُفعّلة) ===== */
  async loadCloudData(uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      console.warn("[Firestore] تعذّرت قراءة بيانات الحساب (تأكد من تفعيل Firestore في مشروع Firebase):", e);
      return null;
    }
  },
  async saveCloudData(uid, data) {
    try {
      await setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch (e) {
      console.warn("[Firestore] تعذّر حفظ بيانات الحساب (تأكد من تفعيل Firestore في مشروع Firebase):", e);
      return false;
    }
  },

  // ===== Firebase Cloud Messaging (Web Push) =====
  async enablePush() {
    try {
      if (!(await messagingIsSupported())) return { ok: false, reason: "unsupported" };
      if (!("Notification" in window)) return { ok: false, reason: "unsupported" };
      const perm = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (perm !== "granted") return { ok: false, reason: "denied" };
      const swReg = await navigator.serviceWorker.ready; // نفس sw.js المسجّل في script.js
      const token = await getToken(getMessaging(app), {
        vapidKey: "BFfYXGBJJUSFtBmWNYYDZfgv7bcN9GH7JnkYrGxJr4P7C1vGZ6b8X5Fir1csYF35eQyXCyjS7Ic862Z_HWA9B8I",
        serviceWorkerRegistration: swReg,
      });
      if (!token) return { ok: false, reason: "no-token" };
      const u = auth.currentUser;
      if (u) await setDoc(doc(db, "users", u.uid), { fcmToken: token, fcmUpdatedAt: serverTimestamp() }, { merge: true });
      return { ok: true, token };
    } catch (e) {
      console.warn("[FCM] تعذّر تفعيل الإشعارات:", e);
      return { ok: false, reason: "error" };
    }
  },
};

window.dispatchEvent(new Event("salati-firebase-ready"));
