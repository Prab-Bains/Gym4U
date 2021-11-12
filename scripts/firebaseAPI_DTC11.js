var firebaseConfig = {
    apiKey: "AIzaSyART4gYv4W0BvIcT0yYkhX7GNj53p-zSdc",
    authDomain: "gym4u-1a561.firebaseapp.com",
    projectId: "gym4u-1a561",
    storageBucket: "gym4u-1a561.appspot.com",
    messagingSenderId: "600241083631",
    appId: "1:600241083631:web:5d34b3ca0c55592569771a"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();