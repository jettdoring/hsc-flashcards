/*
  HSC Flashcards: Firebase settings (setup step 2)
  Replace the example block below with the firebaseConfig block Firebase shows you:
  Firebase console > Project settings (gear icon) > General > Your apps > SDK setup and configuration > Config.
  Until you do, the app still works, but progress is only saved on each device.
*/
const firebaseConfig = {
  apiKey: "AIzaSyA8dcOjxCmAgGeneDiptXGh8x9FT2ySdR8",
  authDomain: "hsc-flashcards-f2b8f.firebaseapp.com",
  projectId: "hsc-flashcards-f2b8f",
  storageBucket: "hsc-flashcards-f2b8f.firebasestorage.app",
  messagingSenderId: "501295605240",
  appId: "1:501295605240:web:e4c0bbfcd194f2a809620d"
};
window.FIREBASE_CONFIG = firebaseConfig;
