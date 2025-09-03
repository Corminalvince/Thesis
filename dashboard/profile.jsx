const { useState, useEffect } = React;

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyB3f_BJYyyO2T9V5VA_1vJTFuy3Jdjs9gA",
  authDomain: "hapagbayanihan-9e379.firebaseapp.com",
  projectId: "hapagbayanihan-9e379",
  storageBucket: "hapagbayanihan-9e379.firebasestorage.app",
  messagingSenderId: "975831570120",
  appId: "1:975831570120:web:b899b2d8e3865b72ea37fd"
};

// Initialize Firebase (from globals populated by signup.js)
let app, db;
try {
  app = window.hbFirebaseAuth ? window.hbFirebaseAuth.app : null;
  db = window.hbFirestoreDb || null;
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Profile Navbar Component
const ProfileNavbar = ({ user, onSignOut }) => {
  return (
    <nav id="profileNav" className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="user_dashboard.html">
          <span className="bi bi-arrow-left me-2"></span>
          <span className="bi bi-egg-fried"></span>
          <strong>Hapag Bayanihan</strong>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#profileNavContent" aria-controls="profileNavContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="profileNavContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <a href="user_dashboard.html" className="nav-link">
                <i className="bi bi-house me-1"></i>
                Dashboard
              </a>
            </li>
            <li className="nav-item ms-lg-2">
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-light small">Welcome, {user.name}</span>
                  <button className="btn btn-sm btn-outline-light" onClick={onSignOut}>Sign Out</button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-light small">Profile</span>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Profile Component
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isKitchen, setIsKitchen] = useState(false);
  const [kitchenName, setKitchenName] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      dietaryRestrictions: ['None'],
      favoriteCuisines: ['Filipino', 'Asian', 'Mediterranean']
    },
    stats: {
      totalOrders: 0,
      favoriteKitchens: 0,
      totalDonations: 0,
      communityPoints: 0
    }
  });

  // Load user from localStorage and Firestore database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const raw = window.localStorage.getItem('hb_user_profile');
        if (raw) {
          const profile = JSON.parse(raw);
          setUser({
            email: profile.email,
            name: profile.displayName || profile.email,
            role: profile.role || 'user'
          });
          // Early detect kitchen role from localStorage to prevent UI flash
          const roleLowerEarly = String(profile.role || '').toLowerCase();
          const isKitchenEarly = roleLowerEarly === 'community kitchen' || roleLowerEarly === 'kitchen';
          setIsKitchen(isKitchenEarly);
          if (isKitchenEarly && db) {
            try {
              const { doc, getDoc } = window.hbFirestore || {};
              if (doc && getDoc) {
                const kSnap = await getDoc(doc(db, 'community_kitchens', profile.uid));
                if (kSnap.exists()) {
                  const k = kSnap.data();
                  setKitchenName(k.name || '');
                }
              }
            } catch(_) {}
          }
          
          // Ensure Firestore is initialized
          if (!db) {
            try {
              const { getFirestore } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
              const firebaseApp = window.hbFirebaseAuth ? window.hbFirebaseAuth.app : app;
              if (firebaseApp) {
                db = getFirestore(firebaseApp);
              }
            } catch (e) {
              console.error("Failed to initialize Firestore:", e);
            }
          }

          // Try to fetch complete user data from Firestore
          if (!db) {
            try {
              const { getFirestore } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
              const firebaseApp = window.hbFirebaseAuth ? window.hbFirebaseAuth.app : app;
              if (firebaseApp) {
                db = getFirestore(firebaseApp);
              }
            } catch (e) {
              console.error("Failed to initialize Firestore:", e);
            }
          }

          if (db && (profile.uid || profile.email)) {
            try {
              // Prefer helper that fetches user and kitchen together
              if (window.hbSchema && window.hbSchema.findUser) {
                const result = await window.hbSchema.findUser({ uid: profile.uid, email: profile.email });
                if (result && result.user) {
                  const userData = result.user;
                  setUser({
                    email: userData.email || profile.email,
                    name: userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || profile.displayName || profile.email,
                    role: userData.role || profile.role || 'user'
                  });
                  const kitchenRole = String(userData.role||'').toLowerCase()==='community kitchen' || String(userData.role||'').toLowerCase()==='kitchen';
                  setIsKitchen(kitchenRole || !!result.kitchen);
                  if (result.kitchen && result.kitchen.name) {
                    setKitchenName(result.kitchen.name);
                    setUser(prev => ({ ...prev, name: result.kitchen.name }));
                  }
                  setProfileData(prev => ({
                    ...prev,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || profile.email || '',
                    address: userData.address || '',
                    phone: userData.contactNumber || '',
                    bio: userData.bio || ''
                  }));
                  return; // done
                }
              }

              const firestoreHelpers = window.hbFirestore || {};
              const { doc, getDoc, collection, query, where, getDocs, limit } = firestoreHelpers;
              if (!doc || !getDoc) throw new Error('Firestore helpers not available');
              let userData = null;
              if (profile.uid) {
                const userDocRef = doc(db, "users", profile.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  userData = userDoc.data();
                }
              }
              if (!userData && profile.email) {
                const q = query(collection(db, "users"), where("email", "==", profile.email), limit(1));
                const snap = await getDocs(q);
                snap.forEach((d)=>{ if (!userData) userData = d.data(); });
              }

              if (userData) {
                console.log("User data loaded from Firestore:", userData);
                
                // Update profile data with complete user info from Firestore
                setUser({
                  email: userData.email || profile.email,
                  name: userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || profile.displayName || profile.email,
                  role: userData.role || profile.role || 'user'
                });
                const roleLower = String(userData.role || '').toLowerCase();
                const kitchenRole = roleLower === 'community kitchen' || roleLower === 'kitchen';
                setIsKitchen(kitchenRole);
                if (kitchenRole) {
                  try {
                    const kSnap = await getDoc(doc(db, 'community_kitchens', userData.uid || profile.uid));
                    if (kSnap.exists()) {
                      const k = kSnap.data();
                      setKitchenName(k.name || '');
                      // prefer kitchen name for display
                      setUser(prev => ({ ...prev, name: k.name || prev.name }));
                    }
                  } catch (e) {
                    console.error('Error loading kitchen profile:', e);
                  }
                }

                setProfileData(prev => ({
                  ...prev,
                  firstName: userData.firstName || '',
                  lastName: userData.lastName || '',
                  email: userData.email || profile.email || '',
                  address: userData.address || '',
                  phone: userData.contactNumber || '',
                  bio: userData.bio || ''
                }));
              } else {
                console.log("No user document found in Firestore");
                // Fallback to localStorage data
                setProfileData(prev => ({
                  ...prev,
                  firstName: profile.displayName ? profile.displayName.split(' ')[0] || '' : '',
                  lastName: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') || '' : '',
                  email: profile.email || '',
                  address: profile.address || ''
                }));
              }
            } catch (firestoreError) {
              console.error("Error fetching from Firestore:", firestoreError);
              // Fallback to localStorage data
              setProfileData(prev => ({
                ...prev,
                firstName: profile.displayName ? profile.displayName.split(' ')[0] || '' : '',
                lastName: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') || '' : '',
                email: profile.email || '',
                address: profile.address || ''
              }));
            }
          } else {
            // Fallback to localStorage data if Firestore not available
            setProfileData(prev => ({
              ...prev,
              firstName: profile.displayName ? profile.displayName.split(' ')[0] || '' : '',
              lastName: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') || '' : '',
              email: profile.email || '',
              address: profile.address || ''
            }));
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [db]);

  const handleSignOut = () => {
    setUser(null);
    window.location.href = '../index.html';
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Update profile in Firestore if available
      if (db && user) {
        const raw = window.localStorage.getItem('hb_user_profile');
        if (raw) {
          const profile = JSON.parse(raw);
          const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
          
          const userData = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            address: profileData.address,
            contactNumber: profileData.phone,
            bio: profileData.bio,
            updatedAt: new Date().toISOString()
          };
          
          // Update in Firestore
          await setDoc(doc(db, "users", profile.uid), userData, { merge: true });
          console.log("Profile updated in Firestore successfully");
          
          // Update localStorage with new display name
          const newDisplayName = `${profileData.firstName} ${profileData.lastName}`.trim();
          const updatedProfile = {
            ...profile,
            displayName: newDisplayName
          };
          window.localStorage.setItem('hb_user_profile', JSON.stringify(updatedProfile));
          
          // Update user state
          setUser(prev => ({
            ...prev,
            name: newDisplayName
          }));
        }
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePreferenceChange = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileNavbar user={user} onSignOut={handleSignOut} />
      
      {/* Profile Content */}
      <div className="container-fluid" style={{ marginTop: '80px' }}>
        <div className="row">
          {/* Left Sidebar - Profile Navigation */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Profile Sections</h6>
                  <div className="nav flex-column nav-pills">
                    <button 
                      className={`nav-link text-start mb-2 ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      <i className="bi bi-person me-2"></i>
                      Personal Info
                    </button>
                    <button 
                      className={`nav-link text-start mb-2 ${activeTab === 'preferences' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preferences')}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Preferences
                    </button>
                    <button 
                      className={`nav-link text-start mb-2 ${activeTab === 'stats' ? 'active' : ''}`}
                      onClick={() => setActiveTab('stats')}
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Statistics
                    </button>
                    <button 
                      className={`nav-link text-start mb-2 ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Security
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="col-lg-9">
            {/* Profile Header */}
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center py-4">
                <div className="mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="fw-bold mb-1">{isKitchen ? (kitchenName || user?.name) : `${profileData.firstName} ${profileData.lastName}`}</h3>
                <p className="text-muted mb-2">{profileData.email}</p>
                <span className="badge bg-primary fs-6">{isKitchen ? 'Community Kitchen' : 'Community Member'}</span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card shadow-sm">
              <div className="card-body">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div>
                    {!isKitchen ? (
                      <>
                        <h5 className="fw-bold mb-3">Personal Information</h5>
                        <form onSubmit={handleProfileUpdate}>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label">First Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={profileData.firstName}
                                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Last Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={profileData.lastName}
                                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                value={profileData.email}
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Phone</label>
                              <input
                                type="tel"
                                className="form-control"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={profileData.address}
                              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            ></textarea>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Bio</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={profileData.bio}
                              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            ></textarea>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            <i className="bi bi-check-circle me-1"></i>
                            Update Profile
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <h5 className="fw-bold mb-3">Community Kitchen</h5>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const { doc, setDoc } = window.hbFirestore || {};
                            const raw = window.localStorage.getItem('hb_user_profile');
                            const profile = raw ? JSON.parse(raw) : {};
                            await setDoc(doc(db, 'community_kitchens', profile.uid), { name: kitchenName, last_updated: new Date().toISOString() }, { merge: true });
                            alert('Kitchen name updated');
                            setUser(prev => ({ ...prev, name: kitchenName }));
                          } catch (err) {
                            console.error('Failed updating kitchen name', err);
                            alert('Failed to update');
                          }
                        }}>
                          <div className="mb-3">
                            <label className="form-label">Kitchen Name</label>
                            <input type="text" className="form-control" value={kitchenName} onChange={(e)=>setKitchenName(e.target.value)} />
                          </div>
                          <button type="submit" className="btn btn-primary">Update</button>
                        </form>
                      </>
                    )}
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h5 className="fw-bold mb-3">Preferences & Settings</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Notifications</h6>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={profileData.preferences.notifications}
                            onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                          />
                          <label className="form-check-label">Push Notifications</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={profileData.preferences.emailUpdates}
                            onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                          />
                          <label className="form-check-label">Email Updates</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={profileData.preferences.smsUpdates}
                            onChange={(e) => handlePreferenceChange('smsUpdates', e.target.checked)}
                          />
                          <label className="form-check-label">SMS Updates</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Food Preferences</h6>
                        <div className="mb-3">
                          <label className="form-label">Dietary Restrictions</label>
                          <select className="form-select">
                            <option>None</option>
                            <option>Vegetarian</option>
                            <option>Vegan</option>
                            <option>Gluten-Free</option>
                            <option>Halal</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Favorite Cuisines</label>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Filipino</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Asian</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Mediterranean</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics Tab */}
                {activeTab === 'stats' && (
                  <div>
                    <h5 className="fw-bold mb-3">Your Community Statistics</h5>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <div className="card bg-primary text-white text-center">
                          <div className="card-body">
                            <div className="h2 mb-0">{profileData.stats.totalOrders}</div>
                            <small>Total Orders</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="card bg-success text-white text-center">
                          <div className="card-body">
                            <div className="h2 mb-0">{profileData.stats.favoriteKitchens}</div>
                            <small>Favorite Kitchens</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="card bg-info text-white text-center">
                          <div className="card-body">
                            <div className="h2 mb-0">{profileData.stats.totalDonations}</div>
                            <small>Total Donations</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="card bg-warning text-white text-center">
                          <div className="card-body">
                            <div className="h2 mb-0">{profileData.stats.communityPoints}</div>
                            <small>Community Points</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Recent Activity</h6>
                      <div className="list-group">
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i className="bi bi-heart-fill text-danger me-2"></i>
                            Favorited "Mama's Kitchen" Adobo
                          </div>
                          <small className="text-muted">2 hours ago</small>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i className="bi bi-cart-check text-success me-2"></i>
                            Placed order with "Community Hub"
                          </div>
                          <small className="text-muted">1 day ago</small>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i className="bi bi-gift text-primary me-2"></i>
                            Donated food to "Barangay Kitchen"
                          </div>
                          <small className="text-muted">3 days ago</small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h5 className="fw-bold mb-3">Security Settings</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Change Password</h6>
                        <form>
                          <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" />
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Change Password
                          </button>
                        </form>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Account Security</h6>
                        <div className="form-check form-switch mb-2">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <label className="form-check-label">Two-Factor Authentication</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <label className="form-check-label">Login Notifications</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">Biometric Login</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Render the profile
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UserProfile />);
