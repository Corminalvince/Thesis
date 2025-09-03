// Firestore Schema Helper (browser-friendly)
// Depends on signup.js having initialized window.hbFirestoreDb and window.hbFirestore

(function initSchemaHelper(){
  const db = window.hbFirestoreDb;
  const f = window.hbFirestore || {};
  if (!db || !f.doc || !f.setDoc || !f.getDoc || !f.collection) {
    console.warn('Firestore not initialized. Include assets/js/signup.js before firestoreSchema.js');
    return;
  }

  const nowIso = () => new Date().toISOString();

  // Collections inspired by provided schema (simplified for MVP)
  const collections = {
    users: (id) => f.doc(db, 'users', id),
    community_kitchens: (id) => f.doc(db, 'community_kitchens', id),
    food_details: (id) => f.doc(db, 'food_details', id),
    food_inventory: (id) => f.doc(db, 'food_inventory', id),
    food_requests: (id) => f.doc(db, 'food_requests', id),
    deliveries: (id) => f.doc(db, 'deliveries', id),
    donations: (id) => f.doc(db, 'donations', id),
    donation_items: (id) => f.doc(db, 'donation_items', id),
    donation_payments: (id) => f.doc(db, 'donation_payments', id),
    feeds: (id) => f.doc(db, 'feeds', id),
    payments: (id) => f.doc(db, 'payments', id),
    status_logs: (id) => f.doc(db, 'status_logs', id)
  };

  // User-friendly creators with sensible defaults
  async function ensureUser(user) {
    const id = user.uid || user.user_id;
    if (!id) throw new Error('User id is required');
    const ref = collections.users(id);
    const snap = await f.getDoc(ref);
    const data = {
      uid: id,
      email: user.email || '',
      name: user.name || user.fullName || '',
      role: user.role || 'user',
      contactNumber: user.contact_number || user.contactNumber || '',
      address: user.address || '',
      createdAt: snap.exists() ? (user.created_at || user.createdAt || nowIso()) : nowIso(),
      lastLogin: user.last_login || user.lastLogin || nowIso(),
      isActive: user.isActive !== undefined ? user.isActive : true
    };
    await f.setDoc(ref, data, { merge: true });
    return { id, ref, data };
  }

  async function createKitchen(kitchen) {
    const id = kitchen.kitchen_id || kitchen.id || crypto.randomUUID();
    const ref = collections.community_kitchens(id);
    const data = {
      kitchen_id: id,
      name: kitchen.name || 'Community Kitchen',
      location: kitchen.location || '',
      contact_person: kitchen.contact_person || '',
      capacity: kitchen.capacity || 0,
      createdAt: nowIso(),
      last_updated: nowIso()
    };
    await f.setDoc(ref, data, { merge: true });
    return { id, ref, data };
  }

  async function createFeed(feed) {
    const id = feed.feed_id || feed.id || Date.now().toString();
    const ref = collections.feeds(id);
    const data = {
      feed_id: id,
      user_id: feed.user_id || feed.userId || '',
      post_type: feed.post_type || 'kitchen_update',
      content: feed.content || '',
      image_url: feed.image_url || feed.imageUrl || '',
      date_posted: feed.date_posted || nowIso(),
      kitchen_id: feed.kitchen_id || '',
      status: feed.status || 'active'
    };
    await f.setDoc(ref, data, { merge: true });
    return { id, ref, data };
  }

  async function createFoodDetail(detail) {
    const id = detail.food_id || detail.id || crypto.randomUUID();
    const ref = collections.food_details(id);
    const data = {
      food_id: id,
      food_name: detail.food_name || '',
      food_desc: detail.food_desc || '',
      price: detail.price || 'Free',
      Status: detail.Status || 'Available',
      kitchen_id: detail.kitchen_id || '',
      last_updated: nowIso()
    };
    await f.setDoc(ref, data, { merge: true });
    return { id, ref, data };
  }

  window.hbSchema = {
    ensureUser,
    createKitchen,
    createFeed,
    createFoodDetail,
    async findUser({ uid, email }) {
      const { doc, getDoc, collection, query, where, getDocs, limit } = f;
      let userSnap = null;
      if (uid) {
        userSnap = await getDoc(doc(db, 'users', uid));
      }
      if ((!userSnap || !userSnap.exists()) && email) {
        const q = query(collection(db, 'users'), where('email', '==', email), limit(1));
        const snaps = await getDocs(q);
        snaps.forEach((s)=>{ if (!userSnap) userSnap = s; });
      }
      const userData = userSnap && userSnap.exists() ? userSnap.data() : null;
      let kitchenData = null;
      if (userData && (String(userData.role||'').toLowerCase() === 'community kitchen' || String(userData.role||'').toLowerCase() === 'kitchen')) {
        const kSnap = await getDoc(doc(db, 'community_kitchens', userData.uid || uid || ''));
        if (kSnap.exists()) kitchenData = kSnap.data();
      }
      return { user: userData, kitchen: kitchenData };
    },
    _collections: collections,
    _nowIso: nowIso
  };
})();


