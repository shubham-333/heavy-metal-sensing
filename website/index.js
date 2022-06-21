//console.log("hi2");

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getDatabase,onValue, onChildAdded,onChildChanged,  ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import {getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiLTBylHxOyt_UKk7idl93INTq7akZvJA",
  authDomain: "heavy-metal-detection-f41f6.firebaseapp.com",
  databaseURL: "https://heavy-metal-detection-f41f6-default-rtdb.firebaseio.com",
  projectId: "heavy-metal-detection-f41f6",
  storageBucket: "heavy-metal-detection-f41f6.appspot.com",
  messagingSenderId: "414213176253",
  appId: "1:414213176253:web:d3e2db3e60f529de11b0d4"

};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
//const db = getStorage(firebaseApp);
//const db = getFirestore(firebaseApp);
const database = getDatabase();
const auth = getAuth();
const storage = getStorage(firebaseApp);
//var userId;
onAuthStateChanged(auth, (user) => {
  console.log("hi");
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    //const uid = user.uid;
    console.log("here");
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    
    var user = auth.currentUser;
    //userId = user.uid;
    //console.log("user id is " + userId);
    //window.sessionStorage.setItem("userId", userId);
    if (user != null) {
    var email_id = user.email;
    //var email_verified = user.emailVerified;
    document.getElementById("user_para").innerHTML = "Welcome: " + email_id; // + "<br/> Verified: " + email_verified;

    //   if (email_verified) {
    //     document.getElementById("verify-btn").style.display = "none";
    //   } else {
    //     document.getElementById("verify-btn").style.display = "block";
    //   }
    }
  } else {
    // User is signed out
    //window.sessionStorage.removeItem("userId");
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
      //window.sessionStorage.setItem("userId", user.uid);
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
      //window.sessionStorage.setItem("userId", user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert("Error: " + errorMessage);
    });
});

document.querySelector("#logout-btn").addEventListener("click", (e) => {
  console.log("logout");
  //window.sessionStorage.removeItem("userId");
  //console.log("removed user id is " + userId);
  e.preventDefault();
  auth.signOut();
});

// document.querySelector("#verify-btn").addEventListener("click", (e) => {
//     console.log("verify");
//     e.preventDefault();
//     var user = auth.currentUser;
//     sendEmailVerification(user)
//     .then(() => {
//         // Email sent.
//         window.alert("Verification email sent");
//     })
//     .catch((error) => {
//         // An error happened.
//         window.alert("Error: " + error.message);
//     });
// });

document.querySelector("#add-btn").addEventListener("click", (e) => {
  console.log("add");
  const userEmail = document.querySelector("#email_field").value;
  // var trialNo = document.querySelector("#trial-no").value;
  var inputCadmium = document.querySelector("#input-Cadmium").value;
  var inputLead = document.querySelector("#input-Lead").value;
  var inputCopper = document.querySelector("#input-Copper").value;
  var inputMercury = document.querySelector("#input-Mercury").value;
  console.log("added to user: " + userName);
  let dateTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');
  //dateTime= now;//.toISOString();
  //dateTime.format("isoDateTime");
  console.log(dateTime);
  //async (dispatch) => {
  (async function () {
    await set(ref(database, 'users/' + userName + '/' + dateTime), {
      // DateTime: dateTime,
      CadmiumConc: inputCadmium,
      CopperConc: inputLead,
      LeadConc: inputCopper,
      MercuryConc: inputMercury,
    });
  })();
  //};
});


  

//var trialNo = document.querySelector("#trial-no").value;
const list_div = document.querySelector("#list_div");
const userEmail = document.querySelector("#email_field").value;
const userName = userEmail.split("@")[0];
//const q = query(collection(db, "Users"), where("capital", "==", true));

// const q = query(collection(database, userId.toString()));
// console.log(q);
// const querySnapshot = await getDocs(q);
list_div.insertAdjacentHTML("beforebegin",
  `<div class="list-item heading">
  <div class="list-item-subtitle">Date Time</div>
  <div class="list-item-subtitle">Cadmium</div>
  <div class="list-item-subtitle">Copper</div>
  <div class="list-item-subtitle">Lead</div>
  <div class="list-item-subtitle">Mercury</div>
  </div>`
);


//console.log("user id is 1 " + userId);
//const userId = auth.currentUser.uid;
//var userId = auth.currentUser.uid;


//var getuid = window.sessionStorage.getItem("userId")
//console.log(getuid) // will log the UID
//const dbRef = ref(database, 'users/' + getuid + '/');


//if(auth.currentUser != null){
// onValue(ref(database, 'users/' + userName + '/'), (snapshot) => {
//     //const data = snapshot.val();
//     snapshot.forEach((childSnapshot) => {
//       const childKey = childSnapshot.key;
//       const childData = childSnapshot.val();
//       //console.log(childKey);
//       //console.log(childData);
//       list_div.insertAdjacentHTML("beforebegin",
//           `<div class="list-item">
//           <div class="list-item-subtitle"> ${childData.TrialNo}</div>
//           <div class="list-item-subtitle">${childData.CadmiumConc}</div>
//           <div class="list-item-subtitle">${childData.CopperConc}</div>
//           <div class="list-item-subtitle">${childData.LeadConc}</div>
//           <div class="list-item-subtitle">${childData.MercuryConc}</div>
//           </div>`
//       );
//     });
//   }, {
//     onlyOnce: true
//   });

onChildAdded(ref(database, 'users/' + document.querySelector("#email_field").value.split("@")[0] + '/'), (data) => {
    //console.log(data);

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

  // onChildUpdated(ref(database, 'users/' + document.querySelector("#email_field").value.split("@")[0] + '/'), (data) => {

  //   list_div.insertAdjacentHTML("beforebegin",
  //       `<div class="list-item">
  //       <div class="list-item-subtitle"> ${data.val().TrialNo}</div>
  //       <div class="list-item-subtitle">${data.val().CadmiumConc}</div>
  //       <div class="list-item-subtitle">${data.val().CopperConc}</div>
  //       <div class="list-item-subtitle">${data.val().LeadConc}</div>
  //       <div class="list-item-subtitle">${data.val().MercuryConc}</div>
  //       </div>`
  //   );
  // });

//}

// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     querySnapshot.docChanges().forEach((change) => {
//     //querySnapshot.forEach((doc) => {
//         if (change.type === "added") {
//             console.log("data");
//             // doc.data() is never undefined for query doc snapshots
//             //console.log(doc.id, " => ", doc.data());
//             list_div.insertAdjacentHTML("beforebegin",
//                 `<div class="list-item">
//                 <div class="list-item-subtitle"> ${change.doc.data().TrialNo}</div>
//                 <div class="list-item-subtitle">${change.doc.data().CadmiumConc}</div>
//                 <div class="list-item-subtitle">${change.doc.data().CopperConc}</div>
//                 <div class="list-item-subtitle">${change.doc.data().LeadConc}</div>
//                 <div class="list-item-subtitle">${change.doc.data().MercuryConc}</div>
//                 </div>`
//             );
//         }
// });
// });

// const storageref = ref(storage,'users/' + document.querySelector("#email_field").value.split("@")[0] + '/');
// var imageName, imageUrl;
// var file;
// var reader;

// document.querySelector("#select-btn").addEventListener("click", (e) => {
//   var input = document.createElement('input');
//   input.type = 'file';
  

//   input.onchange = e => {
//     files = e.target.files;
//     reader = new FileReader();
//     reader.readAdDataURL(file);
//   }
//   input.click();

// });

// document.querySelector("#upload-btn").addEventListener("click", (e) => {
//   uploadBytes(storageref, file).then((snapshot) => {
//     console.log('Uploaded the file!');
//   });
// });



// uploadBytes(storageRef, file).then((snapshot) => {
//   console.log('Uploaded a blob or file!');
// });

// const storage = getStorage();
// const dataRef = ref(storage, 'data.csv');


var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');


    
fileButton.addEventListener('change', function(e){
  var file = e.target.files[0];
  const storageRef = sRef(storage, 'dataFile/'+file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader.value = progress;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  });

});
  
