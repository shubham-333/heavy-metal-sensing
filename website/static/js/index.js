import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase,onValue, onChildAdded,onChildChanged, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""

};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth();


onAuthStateChanged(auth, (user) => {
  console.log("hi");
  if (user) {
    // User is signed in
    console.log("here");
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    
    var user = auth.currentUser;
    if (user != null) {
    var email_id = user.email;
    document.getElementById("user_para").innerHTML = "Welcome: " + email_id; // + "<br/> Verified: " + email_verified;
    }
  } else {
    // User is signed out
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});


document.querySelector("#login-btn").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("login");
  const userEmail = document.querySelector("#email_field").value;
  const userPass = document.querySelector("#password_field").value;
  signInWithEmailAndPassword(auth, userEmail, userPass)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(document.querySelector("#email_field").value.split("@")[0]);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert("Error: " + errorMessage);
    });
});


document.querySelector("#register-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const userEmail = document.querySelector("#email_field").value;
  const userPass = document.querySelector("#password_field").value;
  createUserWithEmailAndPassword(auth, userEmail, userPass)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert("Error: " + errorMessage);
    });
});


document.querySelector("#logout-btn").addEventListener("click", (e) => {
  console.log("logout");
  e.preventDefault();
  auth.signOut();
});


document.querySelector("#add-btn").addEventListener("click", (e) => {
  const userEmail = document.querySelector("#email_field").value;
  var inputCadmium = document.querySelector("#input-Cadmium").value;
  var inputLead = document.querySelector("#input-Lead").value;
  var inputCopper = document.querySelector("#input-Copper").value;
  var inputMercury = document.querySelector("#input-Mercury").value;

  let dateTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');

  (async function () {
    await set(ref(database, 'users/' + userName + '/' + dateTime), {
      CadmiumConc: inputCadmium,
      CopperConc: inputLead,
      LeadConc: inputCopper,
      MercuryConc: inputMercury,
    });
  })();
});
 

const list_div = document.querySelector("#list_div");
const userEmail = document.querySelector("#email_field").value;
const userName = userEmail.split("@")[0];

list_div.insertAdjacentHTML("beforebegin",
  `<div class="list-item heading">
  <div class="list-item-subtitle">Date Time</div>
  <div class="list-item-subtitle">Cadmium</div>
  <div class="list-item-subtitle">Copper</div>
  <div class="list-item-subtitle">Lead</div>
  <div class="list-item-subtitle">Mercury</div>
  </div>`
);


onChildAdded(ref(database, 'users/' + document.querySelector("#email_field").value.split("@")[0] + '/'), (data) => {
    list_div.insertAdjacentHTML("afterend",
        `<div class="list-item">
        <div class="list-item-subtitle"> ${data.key}</div>
        <div class="list-item-subtitle">${data.val().CadmiumConc}</div>
        <div class="list-item-subtitle">${data.val().CopperConc}</div>
        <div class="list-item-subtitle">${data.val().LeadConc}</div>
        <div class="list-item-subtitle">${data.val().MercuryConc}</div>
        </div>`
    );
  });

  
