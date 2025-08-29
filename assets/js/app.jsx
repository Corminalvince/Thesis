const ScrollLink = ({ href, className = '', children }) => {
  const onClick = (e) => {
    if (!href || !href.startsWith('#')) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    const nav = document.querySelector('#mainNav');
    const yOffset = nav ? nav.offsetHeight : 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset + 1;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
};

const Navbar = () => (
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
          <li className="nav-item"><ScrollLink className="nav-link" href="#whats-here">What's Here</ScrollLink></li>
          <li className="nav-item"><ScrollLink className="nav-link" href="#driver">Be Our Driver</ScrollLink></li>
          <li className="nav-item"><ScrollLink className="nav-link" href="#about">About</ScrollLink></li>
          <li className="nav-item ms-lg-2">
            <button className="btn btn-sm btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#modalLogin">Login</button>
            <button className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#modalSignup">Sign Up</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

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

const Hero = () => (
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
          <p className="lead text-light opacity-75 mb-4">Connect with your community through food sharing. Whether you want to donate, request food, or volunteer as a driver, Hapag Bayanihan brings us all together.</p>
          <ScrollLink href="#whats-here" className="btn btn-light btn-lg me-2">Read more</ScrollLink>
          <button className="btn btn-outline-light btn-lg" data-bs-toggle="modal" data-bs-target="#modalSignup">Get Started</button>
        </div>
        <div className="col-lg-6">
          <div className="hero-image rounded-4 overflow-hidden shadow-lg">
            <img src="https://i.pinimg.com/originals/6f/3d/3b/6f3d3be1604e1226233df75aadd90802.jpg" className="img-fluid" alt="Food trays" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

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
  </section>
);

const Driver = () => (
  <section id="driver" className="py-5">
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
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalSignup">Sign Up as Driver</button>
        </div>
        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-uppercase text-body-secondary mb-3">Quick Stats</h6>
                  <div className="d-flex justify-content-center gap-5 text-center">
                    <div>
                      <div className="h2 mb-0"><CountUp end={500} />+</div>
                      <div className="small text-body-secondary">Deliveries Made</div>
                    </div>
                    <div>
                      <div className="h2 mb-0"><CountUp end={50} />+</div>
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

const Footer = () => (
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
            <li><button className="btn btn-link p-0 link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalSignup">Donate Food</button></li>
            <li><button className="btn btn-link p-0 link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalSignup">Request Food</button></li>
            <li><button className="btn btn-link p-0 link-light text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalSignup">Volunteer</button></li>
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
  if (/developer|dev|facebook|fb/.test(t)) return 'You can message the developer on Facebook: https://www.facebook.com/ur.Vncejoe10';
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

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
        const active = document.activeElement;
        if (active && active.id === 'hbChatInput') {
          e.preventDefault();
          send();
        }
      }
      if (e.key.toLowerCase() === 'l' && !open) {
        // Quick open login
        const modal = new bootstrap.Modal(document.getElementById('modalLogin'));
        modal.show();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

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

const App = () => (
  <>
    <Navbar />
    <Hero />
    <WhatsHere />
    <Driver />
    <About />
    <Mission />
    {/* Auth Modals */}
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
                <form className="vstack gap-3">
                  <div className="input-icon">
                    <i className="bi bi-envelope"></i>
                    <input type="email" className="form-control" placeholder="you@example.com" required />
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-lock"></i>
                    <input type="password" className="form-control" placeholder="Your password" required />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button type="button" className="btn btn-link p-0">Forgot password?</button>
                  </div>
                  <button type="button" className="btn btn-primary w-100">Login</button>
                  <div className="text-center small text-body-secondary">Don't have an account? <button className="btn btn-link p-0" data-bs-target="#modalSignup" data-bs-toggle="modal">Sign up</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                <form className="vstack gap-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="input-icon">
                        <i className="bi bi-person"></i>
                        <input type="text" className="form-control" placeholder="First name" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-icon">
                        <i className="bi bi-person"></i>
                        <input type="text" className="form-control" placeholder="Last name" required />
                      </div>
                    </div>
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-envelope"></i>
                    <input type="email" className="form-control" placeholder="you@example.com" required />
                  </div>
                  <div className="input-icon">
                    <i className="bi bi-lock"></i>
                    <input type="password" className="form-control" placeholder="Create a password" required />
                  </div>
                  <div>
                    <label className="form-label">How would you like to help?</label>
                    <select className="form-select">
                      <option>Donate Food</option>
                      <option>Request Food</option>
                      <option>Volunteer</option>
                      <option>Become a Driver</option>
                    </select>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="agreeTerms" required />
                    <label className="form-check-label" htmlFor="agreeTerms">I agree to the Terms and Privacy Policy</label>
                  </div>
                  <button type="button" className="btn btn-success w-100">Create account</button>
                  <div className="text-center small text-body-secondary">Already have an account? <button className="btn btn-link p-0" data-bs-target="#modalLogin" data-bs-toggle="modal">Log in</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <Chatbot />
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


