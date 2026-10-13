import '../../firebase.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { db, snapshotToList } from '../../firebase.js';

const backButton = document.querySelector('.back-button');
const listEl = document.getElementById('scheduledSessionsList');

if (backButton) backButton.addEventListener('click', () => window.history.back());

function escapeHtml(str){ if (str==null) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function getStoredUser(){ try{ return JSON.parse(localStorage.getItem('skillsTrackCurrentUser')||'{}'); }catch(e){return{}} }

let currentUid = null;
let bookingsUnsub = null;

function renderSessions(sessions){
  if(!listEl) return;
  if(!sessions.length){ listEl.innerHTML = '<p class="empty">No scheduled sessions found.</p>'; return; }

  listEl.innerHTML = sessions.map(s => `\
    <article class="session-item">\
      <div class="session-title">${escapeHtml(s.topic||'Support session')}</div>\
      <div class="session-meta">Date: ${escapeHtml(s.scheduledDate||s.preferredDate||'Not set')} — Time: ${escapeHtml(s.scheduledTime||'Not set')}</div>\
      <div class="session-meta">Learner: ${escapeHtml((s.learnerName||'') + ' ' + (s.learnerSurname||''))}</div>\
    </article>\
  `).join('');
}

function attachBookingsListener(uid){
  if(bookingsUnsub){ try{ bookingsUnsub(); }catch(e){} bookingsUnsub=null; }
  if(!uid){ renderSessions([]); return; }

  const bookingsRef = ref(db, 'bookings');
  bookingsUnsub = onValue(bookingsRef, (snap)=>{
    const all = snapshotToList(snap).filter(Boolean);

    const stored = getStoredUser();
    const email = stored.email || '';
    const fullname = stored.fullName || `${stored.learnerName||''} ${stored.learnerSurname||''}`.trim();

    const mine = all.filter(b=>{
      if(!b) return false;
      if(b.status !== 'scheduled') return false;
      if(b.learnerId && String(b.learnerId)===String(uid)) return true;
      if(email && b.learnerEmail && b.learnerEmail===email) return true;
      const bookingFull = `${b.learnerName||''} ${b.learnerSurname||''}`.trim();
      if(bookingFull && fullname && bookingFull.toLowerCase()===fullname.toLowerCase()) return true;
      return false;
    }).sort((a,b)=>{
      const da = a.scheduledDate? new Date(a.scheduledDate).getTime(): Infinity;
      const dbt = b.scheduledDate? new Date(b.scheduledDate).getTime(): Infinity;
      return da - dbt;
    });

    renderSessions(mine);
  }, (err)=>{ console.error('Failed to read bookings realtime', err); renderSessions([]); });
}

// Listen for userDataUpdated from firebase.js to get UID
window.addEventListener('userDataUpdated', (e)=>{
  const uid = e?.detail?.uid || null;
  currentUid = uid;
  attachBookingsListener(uid);
});

window.addEventListener('userLoggedOut', ()=>{ currentUid = null; attachBookingsListener(null); });

// Initial: try stored user
const stored = getStoredUser();
if(stored && (stored.uid||stored.userId)){
  attachBookingsListener(stored.uid||stored.userId);
} else {
  // render empty until auth event
  renderSessions([]);
}
