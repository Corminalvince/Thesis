const { useState, useEffect } = React;

// Mock data for kitchen foods and community posts
const mockFeeds = [
  {
    id: 1,
    kitchenName: "Mama's Kitchen",
    kitchenAvatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face",
    location: "Quezon City",
    timestamp: "2 hours ago",
    content: "Fresh batch of Adobo and Sinigang ready for sharing! 🍖🥘",
    foodImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    likes: 24,
    comments: 8,
    favorites: 3,
    isLiked: false,
    isFavorited: false,
    price: "Free",
    quantity: "10 servings",
    pickupTime: "Today 6-8 PM",
    status: "Available",
    conversations: [
      {
        id: 1,
        userId: "user1",
        userName: "Maria Santos",
        message: "Hi! I'm interested in the Adobo. Is it still available?",
        timestamp: "1 hour ago",
        isKitchen: false
      },
      {
        id: 2,
        userId: "kitchen1",
        userName: "Mama's Kitchen",
        message: "Yes! We have 8 servings left. When would you like to pick up?",
        timestamp: "45 minutes ago",
        isKitchen: true
      }
    ]
  },
  {
    id: 2,
    kitchenName: "Community Food Hub",
    kitchenAvatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face",
    location: "Makati",
    timestamp: "5 hours ago",
    content: "We have extra Pancit Canton and Lumpia for families in need. Contact us! 🍜🥢",
    foodImage: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop",
    likes: 31,
    comments: 12,
    favorites: 5,
    isLiked: true,
    isFavorited: false,
    price: "₱50 per serving",
    quantity: "15 servings",
    pickupTime: "Tomorrow 2-4 PM",
    status: "Available",
    conversations: []
  },
  {
    id: 3,
    kitchenName: "Barangay Kitchen",
    kitchenAvatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face",
    location: "Taguig",
    timestamp: "1 day ago",
    content: "Kare-kare and Lechon Kawali available for pickup. Perfect for family dinner! 🥘🍖",
    foodImage: "https://1.bp.blogspot.com/--YtY_9RBbNA/Xj8rMjD8pqI/AAAAAAAA31k/JjFLhXVuniwUmqzi5oPPe8XCojX18m6mQCLcBGAsYHQ/s1600/Fried%2BPork%2BBelly%2BKare%2BKare_MCamaya.jpeg",
    likes: 45,
    comments: 18,
    favorites: 7,
    isLiked: false,
    isFavorited: false,
    price: "₱100 per serving",
    quantity: "8 servings",
    pickupTime: "Today 5-7 PM",
    status: "Available",
    conversations: []
  },
  {
    id: 4,
    kitchenName: "Neighbor's Table",
    kitchenAvatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face",
    location: "Pasig",
    timestamp: "2 days ago",
    content: "Sharing our homemade Bibingka and Puto Bumbong. Christmas spirit all year round! 🎄🍰",
    foodImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    likes: 67,
    comments: 23,
    favorites: 11,
    isLiked: true,
    isFavorited: true,
    price: "₱75 per serving",
    quantity: "12 servings",
    pickupTime: "Tomorrow 3-5 PM",
    status: "Available",
    conversations: []
  }
];

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
                  <span className="text-light small">Welcome, {user.email}</span>
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

  // Mock user data for demonstration
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({
        email: 'admin@hapag.com',
        name: 'John Doe',
        role: 'donor'
      });
      
      // Initialize favorite foods count from existing favorited posts
      const initialFavoriteFoods = feeds.filter(post => post.isFavorited).length;
      setUserStats(prevStats => ({
        ...prevStats,
        favoriteFoods: initialFavoriteFoods
      }));
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleSignOut = () => {
    setUser(null);
    // Add your sign out logic here
    console.log('User signed out');
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
      <DashboardNavbar user={user} onSignOut={handleSignOut} />
      
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
                    <button className="btn btn-primary btn-sm">
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
