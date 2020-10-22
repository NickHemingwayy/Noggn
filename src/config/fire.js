import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAP6nGzayxUTVFuKlwEcl45M9BpFQ6DD34",
    authDomain: "noggn-5e77c.firebaseapp.com",
    databaseURL: "https://noggn-5e77c.firebaseio.com",
    projectId: "noggn-5e77c",
    storageBucket: "noggn-5e77c.appspot.com",
    messagingSenderId: "465890059333",
    appId: "1:465890059333:web:a1e0fe12ac1a24a9ce2f2c",
    measurementId: "G-2KD7CXCEQB"
  };

  const fire = firebase.initializeApp(firebaseConfig);
  export default fire;
