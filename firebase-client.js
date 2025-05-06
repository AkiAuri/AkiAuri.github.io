// Your Firebase config and initialization
const firebaseConfig = {
  apiKey: "AIzaSyAvJ2snE2WKMZMDNpIgk6TIXgBZjWnnWEo",
  authDomain: "dollistannotes.firebaseapp.com",
  projectId: "dollistannotes",
  storageBucket: "dollistannotes.firebasestorage.app",
  messagingSenderId: "601069415664",
  appId: "1:601069415664:web:35cdc23cc31d0bc4bc6635",
  measurementId: "G-4C2XYEDS1E"
};
firebase.initializeApp(firebaseConfig);
window._fb_db = firebase.database();