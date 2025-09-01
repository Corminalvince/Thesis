const { useState, useEffect } = React;

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
                  <span className="text-light small">Welcome, {user.email}</span>
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
  const [profileData, setProfileData] = useState({
    firstName: 'Carlo',
    lastName: 'Gelicame',
    email: 'admin@hapag.com',
    phone: '+63 912 345 6789',
    address: '123 Community Street, Quezon City, Metro Manila',
    bio: 'Passionate about community food sharing and helping others.',
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      dietaryRestrictions: ['None'],
      favoriteCuisines: ['Filipino', 'Asian', 'Mediterranean']
    },
    stats: {
      totalOrders: 24,
      favoriteKitchens: 8,
      totalDonations: 12,
      communityPoints: 1560
    }
  });

  // Mock user data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setUser({
        email: 'user@hapag.com',
        name: 'John Doe',
        role: 'donor'
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSignOut = () => {
    setUser(null);
    window.location.href = '../index.html';
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log('Profile updated:', profileData);
    alert('Profile updated successfully!');
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
                <h3 className="fw-bold mb-1">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-muted mb-2">{profileData.email}</p>
                <span className="badge bg-primary fs-6">Community Member</span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card shadow-sm">
              <div className="card-body">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div>
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
