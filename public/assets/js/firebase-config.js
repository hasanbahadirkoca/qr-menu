// [TR] Firebase web uygulamanızın yapılandırma bilgileri
// [EN] Your web app's Firebase configuration
const firebaseConfig = {
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