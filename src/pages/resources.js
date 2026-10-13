import { db } from '../../firebase.js';
import { collection, getDocs, orderBy, query } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';

const grid = document.querySelector('.resources-grid');

function setEmptyState() {
  if (!grid) return;
  grid.innerHTML = `
    <div class="resource-item resource-empty">
      <div class="resource-card" aria-label="No uploaded resources">PDF</div>
      <p class="resource-empty-message">No PDFs uploaded yet.</p>
    </div>
  `;
}

async function loadResources() {
  if (!grid) return;

  try {
    const resourcesRef = query(collection(db, 'resources'), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(resourcesRef);
    const resources = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

    if (!resources.length) {
      setEmptyState();
      return;
    }

    grid.innerHTML = resources
      .map(
        (resource) => `
          <div class="resource-item">
            <div class="resource-card" aria-label="${resource.name || 'PDF resource'}">PDF</div>
            <a
              class="resource-button"
              href="${resource.url || '#'}"
              target="_blank"
              rel="noopener noreferrer"
              download="${resource.name || 'resource.pdf'}"
            >
              ${resource.name || 'Download PDF'}
            </a>
          </div>
        `,
      )
      .join('');
  } catch (error) {
    console.error('Unable to load resource downloads:', error);
    setEmptyState();
  }
}

loadResources();
