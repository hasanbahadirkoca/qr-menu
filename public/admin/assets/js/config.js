// [TR] Firebase web uygulamanızın yapılandırma bilgileri
// [EN] Your web app's Firebase configuration
const firebaseConfig = {
  // SECRET
  apiKey: "AIzaSyAuCXKt50hv6Etjr48el3qo2k_1L1qNnXo",
  authDomain: "thehbk-qrmenu.firebaseapp.com",
  projectId: "thehbk-qrmenu",
  storageBucket: "thehbk-qrmenu.appspot.com",
  messagingSenderId: "453244318667",
  appId: "1:453244318667:web:6ab205ad336a77f2b9fc4e",
};

// [TR] Firebase'i başlatın
// [EN] Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// [TR] Firebase veritabanı bağlantısı
// [EN] Firebase database connection
const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // [TR] Kullanıcı giriş yaptı, kullanılabilir özelliklerin listesi için dökümantasyona bakın
    // [EN] User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User

    // console.log("user", user.uid); // [TR] Kullanıcı ID'si | [EN] User ID

    // [TR] Mevcut URL'yi kontrol edin, eğer login içeriyorsa index.html'ye yönlendirin
    // [EN] Check current URL, if it is include login then redirect to index.html
    if (window.location.href.includes("login")) {
      window.location.href = "./index.html";
    }

    // ...
  } else {
    // [TR] Kullanıcı çıkış yaptı
    // [EN] User is signed out

    // [TR] Mevcut URL'yi kontrol edin, eğer login içermiyorsa ./login.html'ye yönlendirin
    // [EN] Check current URL, if it is not include login then redirect to login.html
    if (!window.location.href.includes("login")) {
      window.location.href = "./login.html";
    }
  }
});

// [TR] Kullanıcı çıkış yapma fonksiyonu
// [EN] User sign out function
function signOut() {
  window.location.href = "./login.html";
  //return;
  firebase
    .auth()
    .signOut()
    .then(() => {
      // [TR] Çıkış başarılı
      // [EN] Sign-out successful.
      window.location.href = "./login.html";
    })
    .catch((error) => {
      // [TR] Hata
      // [EN] An error happened.
    });
}
