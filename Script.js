// let currentUser = null;
// const profilesContainer = document.getElementById("profiles");
// const filterInput = document.getElementById("tagFilter");

// const authStatus = document.getElementById("authStatus");
// const loginBtn = document.getElementById("loginBtn");
// const emailInput = document.getElementById("email");
// const importSection = document.getElementById("importSection");

// loginBtn.onclick = async () => {
//   const email = emailInput.value;
//   const actionCodeSettings = {
//     url: window.location.href,
//     handleCodeInApp: true,
//   };
//   await auth.sendSignInLinkToEmail(email, actionCodeSettings);
//   window.localStorage.setItem("emailForSignIn", email);
//   authStatus.innerText = "Login link sent! Check your email.";
// };

// auth.onAuthStateChanged((user) => {
//   if (user) {
//     currentUser = user;
//     authStatus.innerText = `Logged in as ${user.email}`;
//     importSection.style.display = "block";
//     loadProfiles();
//   }
// });

// window.addEventListener("load", async () => {
//   if (auth.isSignInWithEmailLink(window.location.href)) {
//     let email = window.localStorage.getItem("emailForSignIn");
//     if (!email) email = window.prompt("Enter your email:");
//     await auth.signInWithEmailLink(email, window.location.href);
//     window.localStorage.removeItem("emailForSignIn");
//   }
// });

// // Load profiles from Firestore
// function loadProfiles() {
//   db.collection("profiles").onSnapshot(snapshot => {
//     const users = [];
//     snapshot.forEach(doc => {
//       users.push(doc.data());
//     });
//     renderProfiles(users);
//   });
// }

// // CSV import
// document.getElementById("csvFile").addEventListener("change", async function () {
//   const file = this.files[0];
//   const text = await file.text();
//   const rows = text.split("\n").slice(1);
//   for (let row of rows) {
//     const [email, name, tagsStr] = row.split(",");
//     if (!email) continue;
//     const tags = tagsStr ? tagsStr.split(";").map(t => t.trim()) : [];
//     await db.collection("profiles").doc(email).set({
//       email,
//       name,
//       tags,
//       links: [],
//       active: true
//     });
//   }
//   alert("Users imported!");
// });

// // Render
// function renderProfiles(users, filter = "") {
//   profilesContainer.innerHTML = "";
//   users.forEach(user => {
//     if (!user.active) return;
//     if (
//       filter &&
//       !user.tags.some(tag =>
//         tag.toLowerCase().includes(filter.toLowerCase())
//       )
//     )
//       return;

//     const div = document.createElement("div");
//     div.className = "profile";
//     div.innerHTML = `
//       <h3>${user.name}</h3>
//       <p><strong>Email:</strong> ${user.email}</p>
//       <div class="tags">${user.tags
//         .map(tag => `<span>${tag}</span>`)
//         .join("")}</div>
//       <div>
//         ${user.links
//           .map(link => `<a href="${link}" target="_blank">${link}</a>`)
//           .join("<br/>")}
//       </div>
//     `;
//     profilesContainer.appendChild(div);
//   });
// }

// filterInput.addEventListener("input", async (e) => {
//   const snapshot = await db.collection("profiles").get();
//   const users = snapshot.docs.map(doc => doc.data());
//   renderProfiles(users, e.target.value);
// });


import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

// DOM elements
const emailInput = document.getElementById('emailInput');
const sendLinkBtn = document.getElementById('sendLinkBtn');
const profileSection = document.getElementById('profileSection');
const userEmail = document.getElementById('userEmail');
const tagsInput = document.getElementById('tagsInput');
const linksInput = document.getElementById('linksInput');
const activeCheckbox = document.getElementById('activeCheckbox');
const saveBtn = document.getElementById('saveBtn');
const usersList = document.getElementById('usersList');
const filterInput = document.getElementById('filterInput');

sendLinkBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    alert("Login link sent to your email!");
  } catch (error) {
    alert("Error: " + error.message);
  }
});

if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = prompt("Please enter your email");
  }

  signInWithEmailLink(auth, email, window.location.href)
    .then(() => {
      window.localStorage.removeItem('emailForSignIn');
      showProfile(email);
    })
    .catch((error) => {
      alert("Sign-in error: " + error.message);
    });
}

function showProfile(email) {
  userEmail.textContent = email;
  document.getElementById('authSection').classList.add('hidden');
  profileSection.classList.remove('hidden');
}

saveBtn.addEventListener('click', () => {
  const tags = tagsInput.value.split(',').map(tag => tag.trim());
  const links = linksInput.value.split(',').map(link => link.trim());
  const active = activeCheckbox.checked;
  const profile = {
    email: userEmail.textContent,
    tags,
    links,
    active
  };

  const all = JSON.parse(localStorage.getItem('profiles') || '[]');
  const updated = all.filter(p => p.email !== profile.email);
  updated.push(profile);
  localStorage.setItem('profiles', JSON.stringify(updated));
  renderUsers();
});

function renderUsers() {
  const filterTag = filterInput.value.trim().toLowerCase();
  const all = JSON.parse(localStorage.getItem('profiles') || '[]');
  usersList.innerHTML = '';
  all.filter(p => p.active && (filterTag === '' || p.tags.some(t => t.toLowerCase().includes(filterTag))))
    .forEach(user => {
      const div = document.createElement('div');
      div.classList.add('user-card');
      div.innerHTML = `
        <strong>${user.email}</strong><br>
        Tags: ${user.tags.join(', ')}<br>
        Links: ${user.links.map(l => `<a href="${l}" target="_blank">${l}</a>`).join(', ')}
      `;
      usersList.appendChild(div);
    });
}

const sendDashboardLinkBtn = document.getElementById('sendDashboardLinkBtn');

sendDashboardLinkBtn.addEventListener('click', () => {
  const email = userEmail.textContent;
  if (!email) {
    alert("User email not found. Please log in.");
    return;
  }
  const links = linksInput.value.split(',').map(link => link.trim()).filter(link => link);
  if (links.length === 0) {
    alert("Please add at least one dashboard link in the Links field.");
    return;
  }
  const dashboardLink = links[0]; // Use the first link as dashboard link

  const serviceID = 'service_ta151gh'; // Replace with your EmailJS service ID
  const templateID = 'template_twslqio'; // Replace with your EmailJS template ID
  const templateParams = {
    user_email: email,
    dashboard_link: dashboardLink
  };

  emailjs.send(serviceID, templateID, templateParams)
    .then(() => {
      alert("Dashboard link email sent successfully!");
    }, (error) => {
      alert("Failed to send dashboard link email: " + error.text);
    });
});

filterInput.addEventListener('input', renderUsers);
renderUsers();
