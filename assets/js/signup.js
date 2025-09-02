import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB3f_BJYyyO2T9V5VA_1vJTFuy3Jdjs9gA",
    authDomain: "hapagbayanihan-9e379.firebaseapp.com",
    projectId: "hapagbayanihan-9e379",
    storageBucket: "hapagbayanihan-9e379.firebasestorage.app",
    messagingSenderId: "975831570120",
    appId: "1:975831570120:web:b899b2d8e3865b72ea37fd"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  // Expose auth helpers globally so React (Babel) code can use them
  window.hbFirebaseAuth = auth;
  window.hbFirebaseSignIn = async (email, password) => {
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js");
    return signInWithEmailAndPassword(auth, email, password);
  };
  // Attach listener after DOM is ready; use delegation so it works with React-rendered modal
  document.addEventListener("click", async function(event) {
    const target = event.target;
    if (!target) return;
    // Match the signup button by id
    if (target.id === "submit") {
      event.preventDefault();
      try {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const firstNameInput = document.querySelector('input[name="firstName"]');
        const lastNameInput = document.querySelector('input[name="lastName"]');
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";
        const firstName = firstNameInput ? firstNameInput.value.trim() : "";
        const lastName = lastNameInput ? lastNameInput.value.trim() : "";

        if (!email || !password) {
          alert("Please enter email and password.");
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (cred && cred.user) {
          alert("Account created successfully! You can now log in.");
          // Persist minimal profile for dashboard/login
          try {
            const displayName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (cred.user.displayName || "");
            window.localStorage.setItem('hb_user_profile', JSON.stringify({
              uid: cred.user.uid,
              email: cred.user.email || email,
              displayName: displayName || (cred.user.email || email)
            }));
          } catch (_) {}
          // Close the signup modal if it's open
          try {
            const modalEl = document.getElementById("modalSignup");
            if (modalEl && window.bootstrap && window.bootstrap.Modal) {
              const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
              modal.hide();
            }
          } catch (_) {}
        }
      } catch (err) {
        const msg = err && err.message ? err.message : "Failed to create account";
        alert(msg);
      }
    }
  });
  