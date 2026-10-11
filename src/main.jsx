import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingBag, Plus, Minus, X, Clock3, MapPin, Leaf, Flame,
  Star, Utensils, Coffee, CheckCircle2, MessageCircle, TicketPercent,
  ClipboardList, ChevronRight, Heart, Menu, ArrowLeft, Phone, Send
} from "lucide-react";
import "./styles.css";

const MENU = [
  { id: 1, name: "Masala Dosa", category: "Breakfast", price: 45, rating: 4.8, time: "10 min", tag: "Bestseller", emoji: "🥞", desc: "Crispy dosa, potato masala & chutney", veg: true },
  { id: 2, name: "Idli (2 pcs)", category: "Breakfast", price: 25, rating: 4.7, time: "7 min", tag: "Light bite", emoji: "🍘", desc: "Soft steamed idlis with sambar", veg: true },
  { id: 3, name: "Veg Fried Rice", category: "Lunch", price: 70, rating: 4.6, time: "15 min", tag: "Popular", emoji: "🍚", desc: "Wok-tossed rice with fresh vegetables", veg: true },
  { id: 4, name: "Paneer Wrap", category: "Lunch", price: 65, rating: 4.8, time: "12 min", tag: "Student pick", emoji: "🌯", desc: "Spiced paneer, crunchy veggies & mint", veg: true },
  { id: 5, name: "Veg Sandwich", category: "Snacks", price: 40, rating: 4.5, time: "8 min", tag: "Quick", emoji: "🥪", desc: "Toasted sandwich with fresh veggies", veg: true },
  { id: 6, name: "Samosa (2 pcs)", category: "Snacks", price: 25, rating: 4.6, time: "5 min", tag: "Value combo", emoji: "🥟", desc: "Golden, flaky pastry with spiced filling", veg: true },
  { id: 7, name: "Cold Coffee", category: "Drinks", price: 45, rating: 4.7, time: "4 min", tag: "Chilled", emoji: "🧋", desc: "Creamy coffee served cold", veg: true },
  { id: 8, name: "Fresh Lime Soda", category: "Drinks", price: 30, rating: 4.4, time: "3 min", tag: "Refreshing", emoji: "🍋", desc: "Fresh lime, soda & a hint of mint", veg: true },
];

const CATEGORIES = ["All", "Breakfast", "Lunch", "Snacks", "Drinks"];
const money = (n) => `₹${n.toFixed(0)}`;

function App() {
  const [cart, setCart] = useState({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [screen, setScreen] = useState("home");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", roll: "", pickup: "12:30 PM", payment: "UPI (demo)" });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("campusBitesOrders") || "[]"); } catch { return []; }
  });
  const [activeOrder, setActiveOrder] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, message: "" });
  const [feedbacks, setFeedbacks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("campusBitesFeedback") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const filtered = useMemo(() => MENU.filter(p =>
    (category === "All" || p.category === category) &&
    `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = MENU.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }
  function add(id) {
    setCart(old => ({ ...old, [id]: (old[id] || 0) + 1 }));
  }
  function changeQty(id, delta) {
    setCart(old => {
      const next = { ...old, [id]: Math.max(0, (old[id] || 0) + delta) };
      if (!next[id]) delete next[id];
      return next;
    });
  }
  function nav(to) {
    setScreen(to);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function placeOrder(e) {
    e.preventDefault();
    if (!count) return notify("Add at least one item to your cart.");
    if (!customer.name.trim() || !customer.roll.trim()) return notify("Enter your name and student ID.");
    const order = {
      id: `CB${Date.now().toString().slice(-6)}`,
      customer: { ...customer },
      items: MENU.filter(p => cart[p.id]).map(p => ({ ...p, qty: cart[p.id] })),
      total, status: "Confirmed", created: new Date().toLocaleString()
    };
    const next = [order, ...orders];
    setOrders(next);
    localStorage.setItem("campusBitesOrders", JSON.stringify(next));
    setActiveOrder(order);
    setCart({});
    setCoupon("");
    setCouponApplied(false);
    setCheckoutOpen(false);
    nav("orders");
    notify("Order placed! This is a demo checkout.");
  }
  function submitFeedback(e) {
    e.preventDefault();
    if (!feedback.message.trim()) return notify("Please enter your feedback.");
    const next = [{ ...feedback, date: new Date().toLocaleDateString() }, ...feedbacks];
    setFeedbacks(next);
    localStorage.setItem("campusBitesFeedback", JSON.stringify(next));
    setFeedback({ rating: 5, message: "" });
    notify("Thanks for sharing your feedback!");
  }
  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "CAMPUS10") {
      setCouponApplied(true);
      notify("CAMPUS10 applied — 10% off!");
    } else {
      setCouponApplied(false);
      notify("Try the demo code CAMPUS10.");
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => nav("home")} aria-label="Campus Bites home">
          <span className="brand-mark"><Utensils size={21} /></span>
          <span className="brand-copy"><b>campus<span>bites</span></b><small>YOUR CAMPUS. YOUR CRAVINGS.</small></span>
        </button>
        <nav className="desktop-nav">
          <button className={screen === "home" ? "nav-link active" : "nav-link"} onClick={() => nav("home")}>Explore menu</button>
          <button className={screen === "orders" ? "nav-link active" : "nav-link"} onClick={() => nav("orders")}>My orders</button>
          <button className={screen === "feedback" ? "nav-link active" : "nav-link"} onClick={() => nav("feedback")}>Feedback</button>
        </nav>
        <div className="top-actions">
          <button className="cart-button" onClick={() => setCheckoutOpen(true)}><ShoppingBag size={18}/><span>Cart</span>{count > 0 && <b className="cart-count">{count}</b>}</button>
          <button className="icon-button mobile-only" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Menu size={21}/></button>
        </div>
      </header>
      {mobileMenu && <div className="mobile-nav"><button onClick={() => nav("home")}>Explore menu</button><button onClick={() => nav("orders")}>My orders</button><button onClick={() => nav("feedback")}>Feedback</button></div>}

      {screen === "home" && <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse"></span> CAMPUS CANTEEN, REIMAGINED</div>
            <h1>Your break.<br/><em>Your bites.</em></h1>
            <p>Skip the queue, not the good food. Pre-order your favourites and pick them up between classes.</p>
            <div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>Order your meal <ChevronRight size={18}/></button><span className="hero-note"><Clock3 size={15}/> Ready in 3–15 min</span></div>
            <div className="hero-stats"><div><b>8+</b><span>Student favourites</span></div><div><b>₹25</b><span>Starting price</span></div><div><b>0</b><span>Queue stress</span></div></div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
            <div className="hero-food">🍱</div><div className="floating-card float-top"><span className="float-icon">⚡</span><span><b>Quick pick-up</b><small>Less waiting, more living</small></span></div>
            <div className="floating-card float-bottom"><span className="rating-star">★</span><span><b>Student-approved</b><small>Made for your timetable</small></span></div>
            <div className="hero-sticker">FRESH<br/> & FAST</div>
          </div>
        </section>
        <section className="promo-strip"><div className="promo-icon"><TicketPercent size={22}/></div><div><b>Hungry for a deal?</b><span>Use <strong>CAMPUS10</strong> for 10% off your demo order.</span></div><button onClick={() => { setCoupon("CAMPUS10"); setCheckoutOpen(true); }}>Get offer <ChevronRight size={16}/></button></section>
        <section className="menu-section" id="menu">
          <div className="section-heading"><div><div className="eyebrow">MADE FOR YOUR BREAK</div><h2>Find your <em>favourite.</em></h2><p>Fresh picks from your campus canteen.</p></div><div className="canteen-status"><span className="status-dot"></span> Canteen open <small>Demo status</small></div></div>
          <div className="menu-controls"><div className="searchbox"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search dosa, coffee, snacks..." aria-label="Search menu"/></div><div className="category-tabs">{CATEGORIES.map(c => <button key={c} className={category === c ? "category-tab selected" : "category-tab"} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
          <div className="product-grid">{filtered.map(p => <article className="product-card" key={p.id}>
            <div className={`product-art art-${p.id}`}><span className="food-emoji">{p.emoji}</span><span className="product-tag">{p.tag}</span><button className="heart-button" aria-label={`Save ${p.name}`} onClick={e => { e.currentTarget.classList.toggle("hearted"); notify("Saved to your favourites (demo)."); }}><Heart size={17}/></button></div>
            <div className="product-info"><div className="product-meta"><span className="veg-mark"></span><span>{p.category}</span><span className="rating"><Star size={13} fill="currentColor"/>{p.rating}</span></div><h3>{p.name}</h3><p>{p.desc}</p><div className="product-bottom"><div><b>{money(p.price)}</b><span><Clock3 size={12}/>{p.time}</span></div>{cart[p.id] ? <div className="qty-control"><button onClick={() => changeQty(p.id, -1)} aria-label="Decrease quantity"><Minus size={15}/></button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id, 1)} aria-label="Increase quantity"><Plus size={15}/></button></div> : <button className="add-button" onClick={() => add(p.id)}><Plus size={16}/> Add</button>}</div></div>
          </article>)}</div>
          {filtered.length === 0 && <div className="empty-state"><Search size={26}/><h3>No bites found</h3><p>Try a different search or category.</p><button className="secondary-button" onClick={() => {setQuery("");setCategory("All");}}>Clear filters</button></div>}
        </section>
        <section className="how-section"><div className="eyebrow">THREE STEPS. ZERO QUEUE.</div><h2>Your food, <em>on your time.</em></h2><div className="steps-grid"><div className="step"><span>01</span><div className="step-icon"><Search/></div><h3>Pick your bites</h3><p>Explore the menu and add your favourites to the cart.</p></div><div className="step"><span>02</span><div className="step-icon"><ShoppingBag/></div><h3>Place your order</h3><p>Choose a pickup slot and a demo payment option.</p></div><div className="step"><span>03</span><div className="step-icon"><Coffee/></div><h3>Grab & go</h3><p>Show your order ID at the counter and enjoy your break.</p></div></div></section>
      </main>}

      {screen === "orders" && <main className="inner-page"><div className="eyebrow">YOUR FOOD JOURNEY</div><h1 className="page-title">My <em>orders.</em></h1><p className="page-subtitle">Your recent canteen orders, all in one place.</p>
        {orders.length ? <div className="orders-list">{orders.map(o => <article className="order-card" key={o.id}><div className="order-head"><div><span className="order-label">ORDER ID</span><h3>{o.id}</h3></div><span className="order-status"><CheckCircle2 size={15}/>{o.status}</span></div><div className="order-items">{o.items.map(i => <span key={i.id}>{i.emoji} {i.name} × {i.qty}</span>)}</div><div className="order-details"><span><Clock3 size={15}/> Pickup: {o.customer.pickup}</span><b>{money(o.total)}</b></div><div className="order-timeline"><span className="timeline-step done"><i>1</i>Confirmed</span><span className="timeline-line"></span><span className="timeline-step"><i>2</i>Preparing</span><span className="timeline-line"></span><span className="timeline-step"><i>3</i>Ready for pickup</span></div><small className="order-date">Placed {o.created} · Demo order status</small></article>)}</div> : <div className="empty-state large"><ClipboardList size={34}/><h3>No orders yet</h3><p>Your next favourite meal is just a few taps away.</p><button className="primary-button" onClick={() => nav("home")}>Explore menu <ChevronRight size={17}/></button></div>}
        <div className="demo-note"><CheckCircle2 size={18}/><span><b>Prototype note:</b> Orders are stored in this browser on this device. Real multi-user order management needs a backend.</span></div>
      </main>}

      {screen === "feedback" && <main className="inner-page"><div className="eyebrow">HELP US SERVE YOU BETTER</div><h1 className="page-title">Your voice, <em>our recipe.</em></h1><p className="page-subtitle">Tell us how we can make your canteen experience better.</p><div className="feedback-layout"><form className="feedback-form" onSubmit={submitFeedback}><label>How was your experience?</label><div className="rating-picker">{[1,2,3,4,5].map(n => <button type="button" key={n} onClick={() => setFeedback(f => ({...f, rating:n}))} className={n <= feedback.rating ? "star-button active" : "star-button"} aria-label={`${n} stars`}><Star fill="currentColor" size={27}/></button>)}</div><label htmlFor="feedback-message">Your feedback</label><textarea id="feedback-message" rows="5" value={feedback.message} onChange={e => setFeedback(f => ({...f,message:e.target.value}))} placeholder="Food, waiting time, menu ideas..."/><button className="primary-button" type="submit">Send feedback <Send size={16}/></button></form><aside className="feedback-aside"><div className="feedback-aside-icon"><MessageCircle size={24}/></div><h3>Every bite can be better.</h3><p>Your feedback helps the canteen team improve food quality, service and pickup times.</p><div className="contact-row"><Phone size={16}/><span>For a real deployment, add the canteen's verified contact number here.</span></div></aside></div>{feedbacks.length > 0 && <section className="recent-feedback"><h2>Recent feedback <span>{feedbacks.length}</span></h2>{feedbacks.slice(0,4).map((f,i)=><div className="feedback-item" key={i}><div className="feedback-stars">{"★".repeat(f.rating)}<span>{"★".repeat(5-f.rating)}</span></div><p>{f.message}</p><small>{f.date}</small></div>)}</section>}</main>}

      <footer className="footer"><div className="footer-brand"><span className="brand-mark"><Utensils size={18}/></span><b>campus<span>bites</span></b></div><p>Good food. Better breaks. Made for campus life.</p><div className="footer-links"><button onClick={() => nav("home")}>Menu</button><button onClick={() => nav("orders")}>Orders</button><button onClick={() => nav("feedback")}>Feedback</button></div><small>Student project prototype · Simulated checkout · © 2026 Campus Bites</small></footer>

      {checkoutOpen && <div className="modal-backdrop" onClick={e => { if(e.target === e.currentTarget) setCheckoutOpen(false); }}><section className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart"><div className="drawer-head"><div><div className="eyebrow">YOUR ORDER</div><h2>My <em>cart.</em> <span className="drawer-count">{count} items</span></h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close cart"><X/></button></div>
        {count === 0 ? <div className="empty-state cart-empty"><ShoppingBag size={35}/><h3>Your cart is hungry.</h3><p>Add something delicious from the menu.</p><button className="primary-button" onClick={() => {setCheckoutOpen(false);nav("home");}}>Explore menu</button></div> : <><div className="cart-items">{MENU.filter(p => cart[p.id]).map(p=><div className="cart-item" key={p.id}><span className="cart-food">{p.emoji}</span><div className="cart-item-copy"><b>{p.name}</b><small>{money(p.price)} each</small><div className="qty-control"><button onClick={() => changeQty(p.id,-1)} aria-label="Decrease"><Minus size={13}/></button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id,1)} aria-label="Increase"><Plus size={13}/></button></div></div><strong>{money(p.price*cart[p.id])}</strong></div>)}</div>
        <div className="coupon-row"><TicketPercent size={18}/><input value={coupon} onChange={e => {setCoupon(e.target.value);setCouponApplied(false);}} placeholder="Coupon code (try CAMPUS10)"/><button onClick={applyCoupon}>Apply</button></div>
        <form className="checkout-form" onSubmit={placeOrder}><div className="form-row"><div><label htmlFor="student-name">Student name</label><input id="student-name" required value={customer.name} onChange={e => setCustomer(c=>({...c,name:e.target.value}))} placeholder="Your name"/></div><div><label htmlFor="student-roll">Student ID</label><input id="student-roll" required value={customer.roll} onChange={e => setCustomer(c=>({...c,roll:e.target.value}))} placeholder="Roll number"/></div></div><label htmlFor="pickup-time">Pickup slot</label><select id="pickup-time" value={customer.pickup} onChange={e => setCustomer(c=>({...c,pickup:e.target.value}))}><option>12:30 PM</option><option>12:45 PM</option><option>1:00 PM</option><option>1:15 PM</option><option>4:00 PM</option><option>4:15 PM</option></select><label htmlFor="payment-option">Demo payment method</label><select id="payment-option" value={customer.payment} onChange={e => setCustomer(c=>({...c,payment:e.target.value}))}><option>UPI (demo)</option><option>Card (demo)</option><option>Pay at counter</option></select><div className="bill-lines"><div><span>Subtotal</span><span>{money(subtotal)}</span></div>{discount > 0 && <div className="discount-line"><span>Campus offer (10%)</span><span>−{money(discount)}</span></div>}<div className="bill-total"><b>Total</b><b>{money(total)}</b></div></div><div className="payment-warning">Demo only: no real payment will be collected.</div><button className="primary-button checkout-submit" type="submit">Place demo order <ChevronRight size={17}/></button></form></>}
        </section></div>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
      {count > 0 && !checkoutOpen && <button className="floating-cart" onClick={() => setCheckoutOpen(true)}><ShoppingBag size={18}/> View cart · {count} · {money(subtotal)} <ChevronRight size={18}/></button>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
