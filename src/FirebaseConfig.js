import firebaseApp from "firebase/app";
import 'firebase/storage';
import 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCfoIIOMUvL_eRwi5F6aghZg-BcL4NhsYQ",
  authDomain: "autocart-app.firebaseapp.com",
  databaseURL: "https://autocart-app.firebaseio.com",
  projectId: "autocart-app",
  storageBucket: "autocart-app.appspot.com",
  messagingSenderId: "903393673459",
  appId: "1:903393673459:web:f422c189ec8918ee7a7786",
  measurementId: "G-M7YR1QF67N"
};

export default firebaseApp.initializeApp(firebaseConfig);
