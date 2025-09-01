const { useState, useEffect } = React;

// Get Supabase client from global scope
const getSupabaseClient = () => {
  if (window.supabaseClient && window.supabaseClient.auth) {
    return window.supabaseClient;
  }
  return null;
};

// Initialize auth and db when available
let auth = null;
let db = null;

const ScrollLink = ({ href, className = '', children, onClick }) => {
  const handleClick = (e) => {
    if (!href || !href.startsWith('#')) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    
    // Call the onClick prop if provided (for active state management)
    if (onClick) {
      onClick();
    }
    
    const nav = document.querySelector('#mainNav');
    const yOffset = nav ? nav.offsetHeight : 0;
    
    // Get the element's position
    const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
    
    // Calculate the final scroll position to show the section header clearly
    const y = elementTop - yOffset - 20; // Add 20px extra space for better visibility
    
    // Smooth scroll to the target position
    window.scrollTo({ 
      top: y, 
      behavior: 'smooth' 
    });
    
    // Add a small delay and then ensure the section is properly positioned
    setTimeout(() => {
      const finalY = elementTop - yOffset - 20;
      if (Math.abs(window.pageYOffset - finalY) > 10) {
        window.scrollTo({ top: finalY, behavior: 'smooth' });
      }
    }, 500);
    
    // Add visual feedback - highlight the clicked section briefly
    el.style.transition = 'all 0.3s ease';
    el.style.transform = 'scale(1.02)';
    el.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
    
    setTimeout(() => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
    }, 300);
  };
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

const Navbar = ({ user, onSignOut }) => {
  const [activeNav, setActiveNav] = useState('whats-here');
  
  // Update active nav based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['whats-here', 'driver', 'about'];
      const navHeight = document.querySelector('#mainNav')?.offsetHeight || 0;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.querySelector(`#${sections[i]}`);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= navHeight + 100) {
            setActiveNav(sections[i]);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setActiveNav(sectionId);
  };

  return (
    <nav id="mainNav" className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#top">
          <span className="bi bi-egg-fried"></span>
          <strong>Hapag Bayanihan</strong>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <ScrollLink 
                className={`nav-link ${activeNav === 'whats-here' ? 'active' : ''}`} 
                href="#whats-here"
                onClick={() => handleNavClick('whats-here')}
              >
                What's Here
                {activeNav === 'whats-here' && <span className="nav-indicator"></span>}
              </ScrollLink>
            </li>
            <li className="nav-item">
              <ScrollLink 
                className={`nav-link ${activeNav === 'driver' ? 'active' : ''}`} 
                href="#driver"
                onClick={() => handleNavClick('driver')}
              >
                Be Our Driver
                {activeNav === 'driver' && <span className="nav-indicator"></span>}
              </ScrollLink>
            </li>
            <li className="nav-item">
              <ScrollLink 
                className={`nav-link ${activeNav === 'about' ? 'active' : ''}`} 
                href="#about"
                onClick={() => handleNavClick('about')}
              >
                About
                {activeNav === 'about' && <span className="nav-indicator"></span>}
              </ScrollLink>
            </li>
            <li className="nav-item ms-lg-2">
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-light small">Welcome, {user.email}</span>
                  <button className="btn btn-sm btn-outline-light" onClick={onSignOut}>Sign Out</button>
                </div>
              ) : (
                <>
              <button className="btn btn-sm btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#modalLogin">Login</button>
              <button className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#modalSignup">Sign Up</button>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Reusable count-up animation
const CountUp = ({ end = 0, duration = 1500, className = '' }) => {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startAnimation = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const from = 0;
      const to = end;
      const animate = (t) => {
        const elapsed = t - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setValue(Math.floor(from + (to - from) * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimation();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return <span ref={ref} className={className}>{value}</span>;
};

const Hero = ({ user }) => {
  const [selectedFood, setSelectedFood] = useState(null);

  const openFoodModal = (name, image, description) => {
    setSelectedFood({ name, image, description });
  };

  return (
  <header id="top" className="hero-section pt-7 pb-5">
    <div className="container">
      <div className="row align-items-center g-4">
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold mb-3 text-white">
            <span className="scooter-track">
              <img className="scooter-inline" src="assets/icon/truck.png" alt="Delivery truck" style={{width: '3rem', height: 'auto'}} />
              Bringing Communities
            </span>
            {" "} Together, One Meal at a Time.
          </h1>
          <p className="lead text-light opacity-75 mb-4">Connect with your community through food sharing. Whether you want to donate, request food, or Become our driver, Hapag Bayanihan brings us all together.</p>
          <ScrollLink href="#whats-here" className="btn btn-light btn-lg me-2">Read more</ScrollLink>
          {!user && (
          <button className="btn btn-outline-light btn-lg" data-bs-toggle="modal" data-bs-target="#modalSignup">Get Started</button>
          )}
        </div>
        <div className="col-lg-6">
          <div className="hero-food-grid rounded-4 overflow-hidden shadow-lg">
            <div className="row g-2">
              <div className="col-6">
                <img 
                  src="https://tse4.mm.bing.net/th/id/OIP.nPy3qgLPU8oqsYYRKeXz0AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" 
                  className="img-fluid rounded food-clickable" 
                  alt="Filipino adobo"
                  onClick={() => openFoodModal('Adobo', 'https://tse4.mm.bing.net/th/id/OIP.nPy3qgLPU8oqsYYRKeXz0AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', 'Classic Filipino adobo - tender meat braised in soy sauce, vinegar, and spices. A staple comfort food in Filipino households.')}
                />
              </div>
              <div className="col-6">
                <img 
                  src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop" 
                  className="img-fluid rounded food-clickable" 
                  alt="Filipino pancit"
                  onClick={() => openFoodModal('Pancit', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop', 'Traditional Filipino noodle dish stir-fried with vegetables and meat. A popular choice for celebrations and family gatherings.')}
                />
              </div>
              <div className="col-6">
                <img src="data:image/webp;base64,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"
                  className="img-fluid rounded" 
                alt="Filipino lumpia" 
                onClick={() => openFoodModal('Lumpia', 'data:image/webp;base64,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', ' traditional Filipino recipe for lumpia, or fried spring rolls. It made with paper-thin lumpia wrappers and filled with a savory mixture of ground pork, cabbage, and other vegetables. Serve lumpia as a side dish or appetizer with a sweet chili dipping sauce.')}
                
                />
              </div>
              <div className="col-6">
                <img src="https://1.bp.blogspot.com/--YtY_9RBbNA/Xj8rMjD8pqI/AAAAAAAA31k/JjFLhXVuniwUmqzi5oPPe8XCojX18m6mQCLcBGAsYHQ/s1600/Fried%2BPork%2BBelly%2BKare%2BKare_MCamaya.jpeg" 
                className="img-fluid rounded" 
                alt="Filipino kare-kare"
                onClick={() => openFoodModal('Kare-kare', 'https://1.bp.blogspot.com/--YtY_9RBbNA/Xj8rMjD8pqI/AAAAAAAA31k/JjFLhXVuniwUmqzi5oPPe8XCojX18m6mQCLcBGAsYHQ/s1600/Fried%2BPork%2BBelly%2BKare%2BKare_MCamaya.jpeg', 'Kare Kare is a traditional Filipino stew complimented with a thick savory peanut sauce. The commonly used meats for this dish are ox tail, tripe, and pork leg; on some occasions goat and chicken meat are also used. Besides the peanuts, this dish depends on the shrimp paste (on the side) in order to be fully enjoyed. Traditionally, “palayok” (clay cooking pot) is used to cook this dish and it is also used as the serving pot.')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Food Modal */}
    {selectedFood && (
      <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedFood.name}</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedFood(null)}></button>
            </div>
            <div className="modal-body text-center">
              <img src={selectedFood.image} className="img-fluid rounded mb-3" alt={selectedFood.name} style={{maxHeight: '400px'}} />
              <p className="text-body-secondary">{selectedFood.description}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedFood(null)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </header>
);
};

const WhatsHere = () => (
  <section id="whats-here" className="py-5 bg-body-tertiary">
    <div className="container">
      <div className="text-center mb-4">
        <h2 className="fw-bold">What's Here</h2>
        <p className="text-body-secondary mb-0">Discover how Hapag Bayanihan connects communities through food sharing, creating bonds that go beyond just sharing meals.</p>
      </div>
      <div className="row g-4">
        {[{
          icon: 'bi-gift', title: 'Food Donations', text: 'Share your extra food with community members who need it most. Every meal makes a difference.'
        }, {
          icon: 'bi-geo-alt', title: 'Community Kitchens', text: 'Find local kitchens where you can donate, volunteer, or request meals.'
        }, {
          icon: 'bi-truck', title: 'Delivery Network', text: 'Join our driver network to help deliver food donations across the community.'
        }, {
          icon: 'bi-geo', title: 'Local Impact', text: 'Make a direct impact in your neighborhood by connecting with nearby community members.'
        }].map((c, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="display-6 text-primary mb-2"><i className={`bi ${c.icon}`}></i></div>
              <h5 className="card-title">{c.title}</h5>
              <p className="card-text text-body-secondary">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Add extra spacing to push Be Our Driver section down */}
    <div className="py-5"></div>
  </section>
);

{/* Spacer section to ensure proper separation */}
const Spacer = () => (
  <section className="py-5 bg-white">
    <div className="container">
      <div className="text-center">
        <div className="py-3"></div>
      </div>
    </div>
  </section>
);

const Driver = ({ user }) => (
  <section id="driver" className="py-5 mt-5">
    <div className="container">
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">Be Our Driver</h3>
          <p className="text-body-secondary">Join our community of volunteer drivers and help deliver food donations directly to families in need. Make a difference with your time and vehicle.</p>
          <ul className="list-unstyled small text-body-secondary mb-4">
            <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>Flexible scheduling - drive when you can</li>
            <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>Simple app-based pickup and delivery</li>
            <li className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>Be part of a community making real impact</li>
          </ul>
          {!user && (
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalSignup">Sign Up as Driver</button>
          )}
        </div>
        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-uppercase text-body-secondary mb-3">Quick Stats</h6>
                  <div className="d-flex justify-content-center gap-5 text-center">
                    <div>
                      <div className="h2 mb-0"><CountUp end={0} /></div>
                      <div className="small text-body-secondary">Deliveries Made</div>
                    </div>
                    <div>
                      <div className="h2 mb-0"><CountUp end={0} /></div>
                      <div className="small text-body-secondary">Active Drivers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-uppercase text-body-secondary mb-3">Requirements</h6>
                  <ul className="mb-0 small text-body-secondary">
                    <li>Valid driver's license</li>
                    <li>Reliable vehicle</li>
                    <li>Smartphone for app</li>
                    <li>Background check (we'll help with this)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-5 bg-light">
    <div className="container">
      <div className="text-center mb-4">
        <h3 className="fw-bold">About Hapag Bayanihan</h3>
        <p className="text-body-secondary small mx-auto" style={{ maxWidth: '760px' }}>
          "Hapag" means table in Filipino, and "Bayanihan" represents the Filipino spirit of community cooperation. Together, we're building a platform where every table has room for one more, and every community member can both give and receive support.
        </p>
      </div>
      <div className="row g-4">
        {[{
          icon: 'bi-people', title: 'Community First', text: 'We believe in the power of neighbors helping neighbors, creating stronger bonds through shared meals and kindness.'
        }, {
          icon: 'bi-recycle', title: 'Zero Waste', text: 'Reducing food waste while ensuring no one goes hungry. Every meal saved is a meal shared with someone who needs it.'
        }, {
          icon: 'bi-geo-alt', title: 'Local Impact', text: 'Starting with local communities and growing organically, one neighborhood at a time, one meal at a time.'
        }].map((c, i) => (
          <div className="col-md-4" key={i}>
            <div className="card h-100 text-center border-0 shadow-sm p-3">
              <div className="display-6 text-primary mb-2"><i className={`bi ${c.icon}`}></i></div>
              <h5>{c.title}</h5>
              <p className="text-body-secondary small mb-0">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Mission = () => (
  <section id="mission" className="py-5">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-sm p-4 p-md-5 text-center">
            <h5 className="fw-bold mb-3">Our Mission</h5>
            <p className="text-body-secondary mb-0">To eliminate food insecurity in our communities while fostering the Filipino values of sharing, caring, and helping one another. Because when we come together around the table, we're stronger as a community.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ user }) => (
  <footer className="bg-dark text-light pt-5 pb-4">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-egg-fried"></i>
            <strong>Hapag Bayanihan</strong>
          </div>
          <p className="small text-secondary mb-2">Building stronger communities through food sharing. Every meal matters, every neighbor counts, and every table has room for one more.</p>
          <div className="small text-secondary">Made with <span className="text-danger">♥</span> for our communities</div>
        </div>
        <div className="col-6 col-md-4">
          <h6 className="text-white-50">Get Involved</h6>
          <ul className="list-unstyled small">
            {!user ? (
              <>
            <li><button className="btn btn-link p-0 link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalSignup">Donate Food</button></li>
            <li><button className="btn btn-link p-0 link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalSignup">Request Food</button></li>
            <li><button className="btn btn-link p-0 link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalSignup">Volunteer</button></li>
              </>
            ) : (
              <>
                <li><span className="link-light">Donate Food</span></li>
                <li><span className="link-light">Request Food</span></li>
                <li><span className="link-light">Volunteer</span></li>
              </>
            )}
            <li><ScrollLink className="link-light text-decoration-none" href="#driver">Become a Driver</ScrollLink></li>
          </ul>
        </div>
        <div className="col-6 col-md-4">
          <h6 className="text-white-50">Support</h6>
          <ul className="list-unstyled small">
            <li><a className="link-light text-decoration-none" href="#help">Help Center</a></li>
            <li><a className="link-light text-decoration-none" href="#contact">Contact Us</a></li>
            <li><a className="link-light text-decoration-none" href="#privacy">Privacy Policy</a></li>
            <li><a className="link-light text-decoration-none" href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-top border-secondary mt-3 pt-3 d-flex justify-content-between small text-secondary">
        <div>© {new Date().getFullYear()} Hapag Bayanihan. Building communities, one meal at a time.</div>
        <a href="#top" className="link-light text-decoration-none">Back to top</a>
      </div>
    </div>
  </footer>
);

// Simple intent-based chatbot
const matchIntent = (text) => {
  const t = text.toLowerCase();
  if (/hello|hi|hey/.test(t)) return 'Hi! How can I help you today?';
  if (/donate/.test(t)) return 'To donate food: click Get Involved → Donate Food or Sign Up and choose "Donate Food".';
  if (/request|need food|help/.test(t)) return 'To request food: Sign Up and select "Request Food". We will connect you to nearby donors.';
  if (/driver|deliver|volunteer/.test(t)) return 'To volunteer as a driver: open the "Be Our Driver" section or Sign Up and choose "Become a Driver".';
  if (/contact|support|help center/.test(t)) return 'You can reach us via the Contact link in the footer. We usually reply within 24 hours.';
  if (/login|sign in/.test(t)) return 'Use the Login button in the top-right or press L on your keyboard.';
  if (/sign up|create account|register/.test(t)) return 'Click the Sign Up button in the navbar or Get Started on the hero.';
  if (/mission|about/.test(t)) return 'Our mission is to fight food insecurity through sharing and community action.';
  if (/developer|dev|facebook|fb/.test(t)) return 'You can message our developers on \n Facebook:\nJoe Lito Vince Corminal : https://www.facebook.com/ur.Vncejoe10 \n  Carlo Gelicame : https://www.facebook.com/carl.gelicame';
  return "I'm not sure yet, but I'm learning! Try asking about donating, requesting food, or volunteering.";
};

const Chatbot = () => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: 'Hello! I\'m here to help with donations, requests, and drivers.' }
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reply = matchIntent(text);
    setMessages((prev) => [...prev, { from: 'user', text }, { from: 'bot', text: reply }]);
    setInput('');
    setTimeout(() => {
      const scroller = document.querySelector('.hb-chatbot .messages');
      scroller && (scroller.scrollTop = scroller.scrollHeight);
    }, 50);
  };

  // React.useEffect(() => {
  //   const handler = (e) => {
  //     if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
  //       const active = document.activeElement;
  //       if (active && active.id === 'hbChatInput') {
  //         e.preventDefault();
  //         send();
  //       }
  //     }
  //     if (e.key.toLowerCase() === 'l' && !open) {
  //       // Quick open login
  //       const modal = new bootstrap.Modal(document.getElementById('modalLogin'));
  //       modal.show();
  //     }
  //   };
  //   window.addEventListener('keydown', handler);
  //   return () => window.removeEventListener('keydown', handler);
  // }, [open]);

  // Turn URLs into clickable links
  const renderText = (text) => {
    const urlRegex = /(https?:\/\/[\w.%\-/?=&#]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <>
      <button className="btn btn-primary rounded-circle hb-chatbot-toggle" onClick={() => setOpen(!open)} aria-label="Toggle chatbot">
        <i className="bi bi-chat-dots"></i>
      </button>
      {open && (
        <div className="hb-chatbot">
          <div className="card shadow-lg border-0">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-robot text-primary"></i>
                <strong>Hapag Assistant</strong>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)}><i className="bi bi-x"></i></button>
            </div>
            <div className="card-body messages">
              {messages.map((m, i) => (
                <div key={i} className={`d-flex ${m.from === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                  <span className={`hb-msg ${m.from}`}>{renderText(m.text)}</span>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <div className="input-group">
                <input id="hbChatInput" className="form-control" placeholder="Ask about donating, requesting, drivers..." value={input} onChange={(e)=>setInput(e.target.value)} />
                <button className="btn btn-primary" onClick={send}><i className="bi bi-send"></i></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Login Modal Component
const LoginModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check for default account
      if (email === 'carlogelicame@hapag.com' && password === 'carlogwapo123') {
        // Default account login successful
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
        if (modal) modal.hide();
        
        // Reset form
        setEmail('');
        setPassword('');
        
        // Redirect to dashboard
        window.location.href = 'dashboard/user_dashboard.html';
        return;
      }

      // Regular Supabase authentication
      if (auth && auth.signInWithPassword) {
        const { data, error } = await auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Close modal on success
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
        if (modal) modal.hide();
        
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        throw new Error('Authentication service not available');
      }
    } catch (error) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade hb-modal" id="modalLogin" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Welcome back</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body p-0">
            <div className="row g-0">
              <div className="col-md-5 d-none d-md-block">
                <div className="illustration h-100" style={{backgroundImage: 'url(https://i.etsystatic.com/46307212/r/il/265235/5356527170/il_1080xN.5356527170_pzem.jpg)'}}></div>
              </div>
              <div className="col-md-7 p-4 p-md-5">
                <h5 className="fw-bold mb-3">Login</h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin} className="vstack gap-3">
                  <div className="input-icon">
                    <i className="bi bi-envelope"></i>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required 
                    />
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-lock"></i>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required 
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button type="button" className="btn btn-link p-0">Forgot password?</button>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <div className="text-center small text-body-secondary">
                    Don't have an account? <button type="button" className="btn btn-link p-0" data-bs-target="#modalSignup" data-bs-toggle="modal">Sign up</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Modal Component
const SignupModal = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Donate Food',
    contactNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Map role selection to database role
      const roleMap = {
        'Donate Food': 'donor',
        'Request Food': 'recipient',
        'Volunteer': 'volunteer',
        'Become a Driver': 'driver'
      };

      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: roleMap[formData.role] || 'recipient',
        contact_number: formData.contactNumber,
        address: formData.address
      };

      console.log('Starting signup process...');
      const { data, error } = await auth.signUp({ 
        email: userData.email, 
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            contact_number: userData.contact_number,
            address: userData.address
          }
        }
      });
      if (error) throw error;
      
      console.log('Signup successful, data:', data);
      setSuccess('Account created successfully! You can now log in.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Donate Food',
        contactNumber: '',
        address: ''
      });
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalSignup'));
        if (modal) modal.hide();
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade hb-modal" id="modalSignup" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create your account</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body p-0">
            <div className="row g-0">
              <div className="col-md-5 d-none d-md-block">
                <div className="illustration h-100" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop)'}}></div>
              </div>
              <div className="col-md-7 p-4 p-md-5">
                <h5 className="fw-bold mb-3">Sign Up</h5>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSignup} className="vstack gap-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="input-icon">
                        <i className="bi bi-person"></i>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="First name" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          autoComplete="given-name"
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-icon">
                        <i className="bi bi-person"></i>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Last name" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          autoComplete="family-name"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-envelope"></i>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="you@example.com" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required 
                    />
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-lock"></i>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Create a password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      required 
                    />
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-telephone"></i>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Contact number (optional)" 
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-geo-alt"></i>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Address (optional)" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                    />
                  </div>
                  <div>
                    <label className="form-label">How would you like to help?</label>
                    <select 
                    type="text" 
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option>Donate Food</option>
                      <option>Request Food</option>
                      <option>Community Kitchen</option>
                      <option>Become a Driver</option>
                    </select>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="agreeTerms" required />
                    <label className="form-check-label" htmlFor="agreeTerms">I agree to the Terms and Privacy Policy</label>
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                  <div className="text-center small text-body-secondary">
                    Already have an account? <button type="button" className="btn btn-link p-0" data-bs-target="#modalLogin" data-bs-toggle="modal">Log in</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth and db when component mounts
    const initializeAuth = () => {
      const client = getSupabaseClient();
      if (client) {
        auth = client.auth;
        db = client;
        return true;
      }
      return false;
    };

    // Check for existing session
    const checkUser = async () => {
      try {
        // Try to initialize auth
        if (!initializeAuth()) {
          // If auth is not available yet, wait a bit and try again
          setTimeout(() => {
            if (initializeAuth()) {
              checkUser();
            } else {
              setLoading(false);
            }
          }, 100);
          return;
        }
        
        const { data: { user: currentUser } } = await auth.getSession();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    let authStateResult;
    try {
      if (auth && auth.onAuthStateChange) {
        authStateResult = auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
        });
      }
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
    }

    // Safely handle the subscription
    if (authStateResult && authStateResult.data && authStateResult.data.subscription) {
      return () => authStateResult.data.subscription.unsubscribe();
    } else {
      // Return a no-op cleanup function if subscription is not available
      return () => {};
    }
  }, []);

  const handleSignOut = async () => {
    try {
      if (!auth || !auth.signOut) {
        console.warn('Auth not available for sign out');
        setUser(null);
        return;
      }
      
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <Navbar user={user} onSignOut={handleSignOut} />
      <Hero user={user} />
      <WhatsHere />
      <Spacer />
      <Driver user={user} />
      <About />
      <Mission />
          {/* Auth Modals */}
    <LoginModal />
    <SignupModal />


    <Footer user={user} />
    <Chatbot />
  </>
);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


