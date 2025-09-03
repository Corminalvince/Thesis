import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, limit } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
  const db = getFirestore(app);

  // Expose auth helpers globally so React (Babel) code can use them
  window.hbFirebaseAuth = auth;
  window.hbFirestoreDb = db;
  window.hbFirestore = { doc, setDoc, getDoc, collection, query, where, getDocs, limit };
  window.hbFirebaseSignIn = async (email, password) => {
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js");
    console.log("Attempting Firebase sign in for:", email);
    
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("Firebase sign in successful:", cred.user);
    
    // Update lastLogin timestamp in Firestore
    if (cred && cred.user) {
      try {
        const userRef = doc(db, "users", cred.user.uid);
        await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
        console.log("Last login timestamp updated in Firestore");
      } catch (firestoreError) {
        console.error("Error updating last login:", firestoreError);
        // Continue with login even if Firestore update fails
      }
    }
    
    try {
      // Also store a friendly displayName in localStorage if available
      const userRef = doc(db, "users", cred.user.uid);
      const { getDoc } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
      const snap = await getDoc(userRef);
      const userData = snap.exists() ? snap.data() : {};
      const displayName = userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || cred.user.displayName || email;
      const role = userData.role || 'user';
      const profileData = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName,
        role
      };
      try { window.localStorage.setItem('hb_user_profile', JSON.stringify(profileData)); } catch(_) {}
    } catch (_) {}

    return cred;
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
        const roleInput = document.querySelector('select[name="role"]');
        const contactInput = document.querySelector('input[name="contactNumber"]');
        const addressInput = document.querySelector('input[name="address"]');
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";
        const firstName = firstNameInput ? firstNameInput.value.trim() : "";
        const lastName = lastNameInput ? lastNameInput.value.trim() : "";
        const role = roleInput ? roleInput.value : "Donate Food";
        const contactNumber = contactInput ? contactInput.value.trim() : "";
        const address = addressInput ? addressInput.value.trim() : "";

        if (!email || !password) {
          alert("Please enter email and password.");
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (cred && cred.user) {
          console.log("Firebase Auth user created:", cred.user);
          
          // Store user data in Firestore
          try {
            const userData = {
              uid: cred.user.uid,
              email: cred.user.email,
              firstName: firstName,
              lastName: lastName,
              fullName: `${firstName} ${lastName}`.trim(),
              role: role,
              contactNumber: contactNumber,
              address: address,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              isActive: true
            };

            console.log("Saving user data to Firestore:", userData);

            // Save to Firestore in 'users' collection
            await setDoc(doc(db, "users", cred.user.uid), userData);
            console.log("User data saved to Firestore successfully");

            // If user is Community Kitchen, also create entry in 'community_kitchens'
            try {
              const roleText = (role || '').toLowerCase();
              if (roleText === 'community kitchen' || roleText === 'kitchen') {
                const kitchenData = {
                  kitchen_id: cred.user.uid,
                  name: `${firstName} ${lastName}`.trim() || (cred.user.email || 'Community Kitchen'),
                  location: address || '',
                  contact_person: `${firstName} ${lastName}`.trim(),
                  capacity: 0,
                  createdAt: new Date().toISOString(),
                  last_updated: new Date().toISOString()
                };
                console.log("Saving community kitchen data:", kitchenData);
                await setDoc(doc(db, "community_kitchens", cred.user.uid), kitchenData, { merge: true });
                console.log("Community kitchen document created");
              }
            } catch(kitchenErr) {
              console.error("Error creating community_kitchens doc:", kitchenErr);
            }
          } catch (firestoreError) {
            console.error("Error saving to Firestore:", firestoreError);
            // Continue with signup even if Firestore fails
          }

          alert("Account created successfully! You can now log in.");
          // Persist minimal profile for dashboard/login
          try {
            const displayName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (cred.user.displayName || "");
            const profileData = {
              uid: cred.user.uid,
              email: cred.user.email || email,
              displayName: displayName || (cred.user.email || email),
              role: role
            };
            console.log("Saving profile to localStorage:", profileData);
            window.localStorage.setItem('hb_user_profile', JSON.stringify(profileData));
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
  