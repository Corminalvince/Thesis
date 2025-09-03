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

// Initialize Firebase (if not already initialized)
let app, db;
try {
  app = window.hbFirebaseAuth ? window.hbFirebaseAuth.app : null;
  db = window.hbFirestoreDb || null;
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Initial feeds are empty; will populate from Firestore or user posts
const mockFeeds = [];

// Feed Post Component
const FeedPost = ({ post, onLike, onComment, onFavorite, onStartConversation, onSendMessage }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    servings: 1,
    pickupTime: '',
    specialRequests: ''
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(post.id, messageText);
      setMessageText('');
    }
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    // Handle order submission
    console.log('Order submitted:', orderDetails);
    setShowOrderForm(false);
    setShowConversation(true);
  };

  return (
    <div className="card mb-3 shadow-sm">
      {/* Post Header */}
      <div className="card-header bg-white border-0 d-flex align-items-center p-3">
        <img 
          src={post.kitchenAvatar} 
          alt={post.kitchenName}
          className="rounded-circle me-3"
          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1">
          <h6 className="mb-0 fw-bold">{post.kitchenName}</h6>
          <small className="text-muted">
            <i className="bi bi-geo-alt me-1"></i>
            {post.location} • {post.timestamp}
          </small>
        </div>
        <button className="btn btn-link text-muted p-0">
          <i className="bi bi-three-dots"></i>
        </button>
      </div>

      {/* Post Content */}
      <div className="card-body p-0">
        <p className="px-3 pb-2 mb-0">{post.content}</p>
        <img 
          src={post.foodImage} 
          alt="Food"
          className="img-fluid w-100"
          style={{ height: '300px', objectFit: 'cover' }}
        />
        
        {/* Order Details */}
        <div className="px-3 py-3 bg-light">
          <div className="row text-center">
            <div className="col-3">
              <div className="text-primary fw-bold">{post.price}</div>
              <small className="text-muted">Price</small>
            </div>
            <div className="col-3">
              <div className="text-success fw-bold">{post.quantity}</div>
              <small className="text-muted">Available</small>
            </div>
            <div className="col-3">
              <div className="text-info fw-bold">{post.pickupTime}</div>
              <small className="text-muted">Pickup</small>
            </div>
            <div className="col-3">
              <div className="text-warning fw-bold">{post.status}</div>
              <small className="text-muted">Status</small>
            </div>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="card-footer bg-white border-0">
        {/* Action Buttons */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button 
            className={`btn btn-sm ${post.isLiked ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onLike(post.id)}
          >
            <i className={`bi ${post.isLiked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
            {post.likes} Likes
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowComments(!showComments)}
          >
            <i className="bi bi-chat me-1"></i>
            {post.comments} Comments
          </button>
          <button 
            className={`btn btn-sm ${post.isFavorited ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => onFavorite(post.id)}
          >
            <i className={`bi ${post.isFavorited ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
            {post.favorites} Favorites
          </button>
        </div>

        {/* Order & Conversation Buttons */}
        <div className="d-flex gap-2 mb-2">
          <button 
            className="btn btn-success btn-sm flex-fill"
            onClick={() => setShowOrderForm(true)}
          >
            <i className="bi bi-cart-plus me-1"></i>
            Order Now
          </button>
          <button 
            className="btn btn-outline-primary btn-sm flex-fill"
            onClick={() => setShowConversation(!showConversation)}
          >
            <i className="bi bi-messenger me-1"></i>
            Chat with Kitchen
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="border-top pt-2">
            <form onSubmit={handleSubmitComment} className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Post</button>
            </form>
            <div className="small text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Comments help kitchens know their food is appreciated!
            </div>
          </div>
        )}

        {/* Order Form */}
        {showOrderForm && (
          <div className="border-top pt-2">
            <h6 className="fw-bold mb-2">Place Your Order</h6>
            <form onSubmit={handleOrderSubmit} className="vstack gap-2">
              <div className="row">
                <div className="col-6">
                  <label className="form-label small">Servings</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="1"
                    value={orderDetails.servings}
                    onChange={(e) => setOrderDetails({...orderDetails, servings: e.target.value})}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Pickup Time</label>
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    value={orderDetails.pickupTime}
                    onChange={(e) => setOrderDetails({...orderDetails, pickupTime: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="form-label small">Special Requests</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="Any special requests or dietary needs?"
                  value={orderDetails.specialRequests}
                  onChange={(e) => setOrderDetails({...orderDetails, specialRequests: e.target.value})}
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success btn-sm flex-fill">
                  Submit Order
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowOrderForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Conversation Section */}
        {showConversation && (
          <div className="border-top pt-2">
            <h6 className="fw-bold mb-2">Chat with {post.kitchenName}</h6>
            
            {/* Existing Messages */}
            {post.conversations.length > 0 && (
              <div className="mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {post.conversations.map((msg, index) => (
                  <div key={index} className={`d-flex mb-2 ${msg.isKitchen ? 'justify-content-start' : 'justify-content-end'}`}>
                    <div className={`p-2 rounded ${msg.isKitchen ? 'bg-light' : 'bg-primary text-white'}`} style={{ maxWidth: '80%' }}>
                      <small className="d-block fw-bold">{msg.userName}</small>
                      <div>{msg.message}</div>
                      <small className="opacity-75">{msg.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Message Form */}
            <form onSubmit={handleSendMessage} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Send</button>
            </form>
            
            <div className="small text-muted mt-1">
              <i className="bi bi-info-circle me-1"></i>
              Chat directly with the kitchen to negotiate orders and ask questions!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simplified Navbar for User Dashboard
const DashboardNavbar = ({ user, onSignOut }) => {
  return (
    <nav id="dashboardNav" className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#top">
          <span className="bi bi-egg-fried"></span>
          <strong>Hapag Bayanihan</strong>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardNavContent" aria-controls="dashboardNavContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="dashboardNavContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <a href="profile.html" className="nav-link">
                <i className="bi bi-person-circle me-1"></i>
                Profile
              </a>
            </li>
            <li className="nav-item ms-lg-2">
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-light small">Welcome, {user.name} ({user.role})</span>
                  <button className="btn btn-sm btn-outline-light" onClick={onSignOut}>Sign Out</button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-light small">Dashboard</span>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Main Dashboard Component
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState(mockFeeds);
  const [activeTab, setActiveTab] = useState('feeds');
  const [userStats, setUserStats] = useState({
    donationsMade: 12,
    mealsShared: 48,
    favoriteKitchens: 8,
    favoriteFoods: 0
  });
  const [newPost, setNewPost] = useState({ content: '', imageUrl: '' });

  const isKitchenRole = (role) => {
    const r = (role || '').toLowerCase();
    return r === 'community kitchen' || r === 'kitchen';
  };

  // Load user from localStorage and Firestore database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const raw = window.localStorage.getItem('hb_user_profile');
        if (raw) {
          const profile = JSON.parse(raw);
          
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
          if (db && (profile.uid || profile.email)) {
            try {
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
              // Fallback: query by email if no uid doc
              if (!userData && profile.email) {
                const q = query(collection(db, "users"), where("email", "==", profile.email), limit(1));
                const snap = await getDocs(q);
                snap.forEach((d)=>{ if (!userData) userData = d.data(); });
              }
              
              if (userData) {
                console.log("User data loaded from Firestore:", userData);
                
                // Resolve display name (prefer community kitchen name when role matches)
                let resolvedName = userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || profile.displayName || profile.email;
                try {
                  const roleLower = String(userData.role || '').toLowerCase();
                  if ((roleLower === 'community kitchen' || roleLower === 'kitchen') && window.hbFirestore && db) {
                    const { doc, getDoc } = window.hbFirestore;
                    const kSnap = await getDoc(doc(db, 'community_kitchens', userData.uid || profile.uid));
                    if (kSnap && kSnap.exists()) {
                      const k = kSnap.data();
                      if (k && k.name) resolvedName = k.name;
                    }
                  }
                } catch (e) {
                  console.error('Error loading kitchen name:', e);
                }

                // Set user with complete data from Firestore
                setUser({
                  uid: userData.uid || profile.uid,
                  email: userData.email || profile.email,
                  name: resolvedName,
                  role: userData.role || profile.role || 'user',
                  firstName: userData.firstName || '',
                  lastName: userData.lastName || '',
                  address: userData.address || '',
                  contactNumber: userData.contactNumber || ''
                });

                // Persist nicer displayName to localStorage for future loads
                try {
                  const newDisplayName = userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
                  const updatedProfile = {
                    ...profile,
                    displayName: newDisplayName || profile.displayName || profile.email
                  };
                  window.localStorage.setItem('hb_user_profile', JSON.stringify(updatedProfile));
                } catch(_) {}
              } else {
                console.log("No user document found in Firestore, using localStorage data");
                // Fallback to localStorage data
                setUser({
                  uid: profile.uid,
                  email: profile.email,
                  name: profile.displayName || profile.name || profile.email,
                  role: profile.role || 'user'
                });
              }
            } catch (firestoreError) {
              console.error("Error fetching from Firestore:", firestoreError);
              // Fallback to localStorage data
              setUser({
                uid: profile.uid,
                email: profile.email,
                name: profile.displayName || profile.name || profile.email,
                role: profile.role || 'user'
              });
            }
          } else {
            // Fallback to localStorage data if Firestore not available
            setUser({
              uid: profile.uid,
              email: profile.email,
              name: profile.displayName || profile.name || profile.email,
              role: profile.role || 'user'
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        // Initialize favorite foods count from existing favorited posts
        const initialFavoriteFoods = feeds.filter(post => post.isFavorited).length;
        setUserStats(prevStats => ({
          ...prevStats,
          favoriteFoods: initialFavoriteFoods
        }));
        
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [db, feeds]);

  const handleSignOut = () => {
    try { window.localStorage.removeItem('hb_user_profile'); } catch(_) {}
    setUser(null);
    window.location.href = '../index.html';
  };

  const handleLike = (postId) => {
    setFeeds(prevFeeds => 
      prevFeeds.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleComment = (postId, commentText) => {
    setFeeds(prevFeeds => 
      prevFeeds.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
  };

  const handleFavorite = (postId) => {
    setFeeds(prevFeeds => 
      prevFeeds.map(post => 
        post.id === postId 
          ? { ...post, isFavorited: !post.isFavorited, favorites: post.isFavorited ? post.favorites - 1 : post.favorites + 1 }
          : post
      )
    );

    // Update user stats when favoriting/unfavoriting
    setUserStats(prevStats => {
      const post = feeds.find(p => p.id === postId);
      if (post) {
        const isCurrentlyFavorited = post.isFavorited;
        return {
          ...prevStats,
          favoriteFoods: isCurrentlyFavorited 
            ? prevStats.favoriteFoods - 1  // Unfavoriting
            : prevStats.favoriteFoods + 1  // Favoriting
        };
      }
      return prevStats;
    });
  };

  const handleSendMessage = (postId, messageText) => {
    setFeeds(prevFeeds => 
      prevFeeds.map(post => 
        post.id === postId 
          ? {
              ...post,
              conversations: [
                ...post.conversations,
                {
                  id: Date.now(),
                  userId: "currentUser",
                  userName: "You",
                  message: messageText,
                  timestamp: "Just now",
                  isKitchen: false
                }
              ]
            }
          : post
      )
    );
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
      <DashboardNavbar user={user || { email: '', name: '', role: '' }} onSignOut={handleSignOut} />
      
      {/* Dashboard Content */}
      <div className="container-fluid" style={{ marginTop: '80px' }}>
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary btn-sm"
                      disabled={!isKitchenRole(user?.role)}
                      title={isKitchenRole(user?.role) ? '' : 'Only Community Kitchen accounts can post'}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Share Food
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-search me-2"></i>
                      Find Food
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <i className="bi bi-box-seam me-2"></i>
                      Track Your Order
                    </button>
                  </div>
                  
                  <hr />
                  
                  <h6 className="fw-bold mb-3">Your Stats</h6>
                  <div className="text-center">
                    <div className="h4 text-primary mb-1">{userStats.donationsMade}</div>
                    <small className="text-muted">Donations Made</small>
                  </div>
                  <div className="text-center mt-3">
                    <div className="h4 text-success mb-1">{userStats.mealsShared}</div>
                    <small className="text-muted">Meals Shared</small>
                  </div>
                  <div className="text-center mt-3">
                    <div className="h4 text-warning mb-1">{userStats.favoriteKitchens}</div>
                    <small className="text-muted">Favorite Kitchens</small>
                  </div>
                  <div className="text-center mt-3">
                    <div className="h4 text-danger mb-1">{userStats.favoriteFoods}</div>
                    <small className="text-muted">Favorite Foods</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="col-lg-6">
            {/* Welcome Section */}
            {user && (
              <div className="card shadow-sm mb-4">
                <div className="card-body text-center">
                  <h4 className="text-primary mb-2">Welcome back, {user.name}! 👋</h4>
                  <p className="text-muted mb-2">You're signed in as a <strong>{user.role}</strong></p>
                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <span className="badge bg-primary">{user.email}</span>
                    <span className="badge bg-success">{user.role}</span>
                  </div>
                  {user.firstName && user.lastName && (
                    <div className="row text-center">
                      <div className="col-md-6">
                        <small className="text-muted">First Name</small>
                        <div className="fw-bold">{user.firstName}</div>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted">Last Name</small>
                        <div className="fw-bold">{user.lastName}</div>
                      </div>
                    </div>
                  )}
                  {user.address && (
                    <div className="mt-3">
                      <small className="text-muted">Address</small>
                      <div className="fw-bold">{user.address}</div>
                    </div>
                  )}
                  {user.contactNumber && (
                    <div className="mt-2">
                      <small className="text-muted">Contact</small>
                      <div className="fw-bold">{user.contactNumber}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Community Food Feed</h5>
              <div className="btn-group btn-group-sm">
                <button 
                  className={`btn ${activeTab === 'feeds' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('feeds')}
                >
                  Feeds
                </button>
                <button 
                  className={`btn ${activeTab === 'nearby' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('nearby')}
                >
                  Nearby
                </button>
              </div>
            </div>

            {/* Post Composer for Kitchens */}
            {user && isKitchenRole(user.role) && (
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Create a Post</h6>
                  <div className="mb-2">
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Share what's cooking, availability, pickup time..."
                      value={newPost.content}
                      onChange={(e)=>setNewPost({...newPost, content: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="input-group mb-2">
                    <span className="input-group-text"><i className="bi bi-image"></i></span>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="Image URL (optional)"
                      value={newPost.imageUrl}
                      onChange={(e)=>setNewPost({...newPost, imageUrl: e.target.value})}
                    />
                  </div>
                  <div className="text-end">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={async () => {
                        if (!newPost.content.trim()) return;
                        const created = {
                          id: Date.now(),
                          kitchenName: user.name || 'Your Kitchen',
                          kitchenAvatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face',
                          location: 'Your area',
                          timestamp: 'just now',
                          content: newPost.content.trim(),
                          foodImage: newPost.imageUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
                          likes: 0,
                          comments: 0,
                          favorites: 0,
                          isLiked: false,
                          isFavorited: false,
                          price: 'Free',
                          quantity: 'N/A',
                          pickupTime: 'TBD',
                          status: 'Available',
                          conversations: []
                        };
                        // Persist to Firestore feeds collection using helper
                        try {
                          if (window.hbSchema && user?.uid) {
                            const saved = await window.hbSchema.createFeed({
                              user_id: user.uid,
                              kitchen_id: user.uid, // replace with actual kitchen_id when available
                              post_type: 'kitchen_update',
                              content: created.content,
                              image_url: newPost.imageUrl || ''
                            });
                            // reflect any normalized values if needed
                            created.id = saved.id;

                            // Also create a food_details entry with the same kitchen id
                            await window.hbSchema.createFoodDetail({
                              food_name: 'Posted Item',
                              food_desc: created.content,
                              price: 'Free',
                              Status: 'Available',
                              kitchen_id: user.uid
                            });
                          }
                        } catch (e) {
                          console.error('Failed to save feed:', e);
                        }

                        setFeeds(prev => [created, ...prev]);
                        setNewPost({ content: '', imageUrl: '' });
                      }}
                    >
                      <i className="bi bi-send me-1"></i>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Feed Posts */}
            {feeds.map(post => (
              <FeedPost 
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onFavorite={handleFavorite}
                onSendMessage={handleSendMessage}
              />
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Trending Kitchens</h6>
                  <div className="d-flex align-items-center mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=40&h=40&fit=crop&crop=face"
                      alt="Kitchen"
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px' }}
                    />
                    <div>
                      <small className="fw-bold d-block">Mama's Kitchen</small>
                      <small className="text-muted">Quezon City</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=40&h=40&fit=crop&crop=face"
                      alt="Kitchen"
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px' }}
                    />
                    <div>
                      <small className="fw-bold d-block">Community Hub</small>
                      <small className="text-muted">Makati</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Today's Highlights</h6>
                  <div className="text-center">
                    <div className="h3 text-warning mb-1">🍽️</div>
                    <small className="text-muted">24 kitchens active today</small>
                  </div>
                  <div className="text-center mt-2">
                    <div className="h3 text-success mb-1">❤️</div>
                    <small className="text-muted">156 meals shared</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Render the dashboard
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UserDashboard />);
