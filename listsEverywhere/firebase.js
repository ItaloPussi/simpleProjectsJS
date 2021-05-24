var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage().ref('lists.json')
