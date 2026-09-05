// Everything below reads from data/content.json.
// Add, remove, or edit sections in that file — no code changes needed.
// Any section with a "type" the renderer doesn't recognize (schedule,
// speakers, resources, links) automatically falls back to a generic
// card layout, so new categories just work.

async function loadContent() {
  const root = document.getElementById('sections');
  try {
    const res = await fetch('data/content.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('content.json not found');
    const data = await res.json();
    renderEvent(data.event);
    renderSections(data.sections || [], root);
  } catch (err) {
    root.innerHTML = `
      <div class="section">
        <div class="empty-hint">
          Couldn't load <code>data/content.json</code>. Make sure the file
          exists and is valid JSON, then refresh.
        </div>
      </div>`;
    console.error(err);
  }
}

function renderEvent(event = {}) {
  const set = (id, value, fallback = '') => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || fallback;
  };
  set('event-title', event.title, 'Event Hub');
  set('event-tagline', event.tagline, '');
  set('event-description', event.description, '');
  set('event-date', event.date, 'TBA');
  set('event-location', event.location, 'TBA');
  if (event.title) document.title = event.title;
}

function renderSections(sections, root) {
  root.innerHTML = '';
  if (!sections.length) {
    root.innerHTML = `
      <div class="section">
        <div class="empty-hint">
          No sections yet. Add one to <code>data/content.json</code> — for
          example a <code>"resources"</code>, <code>"schedule"</code>,
          <code>"speakers"</code>, <code>"links"</code>, or any custom
          <code>type</code> — and it will show up here automatically.
        </div>
      </div>`;
    return;
  }

  sections.forEach((section, i) => {
    const el = document.createElement('section');
    el.className = 'section';
    el.id = section.id || `section-${i}`;

    const items = section.items || [];
    const idx = String(i + 1).padStart(2, '0');

    el.innerHTML = `
      <div class="section-head">
        <h2>${escapeHtml(section.title || 'Untitled section')}</h2>
        <span class="section-index">${idx}</span>
      </div>
      ${renderBody(section.type, items)}
    `;
    root.appendChild(el);
  });
}

function renderBody(type, items) {
  if (!items.length) {
    return `<div class="empty-hint">No items in this section yet.</div>`;
  }
  switch (type) {
    case 'schedule':
      return renderSchedule(items);
    case 'speakers':
      return renderSpeakers(items);
    case 'resources':
      return renderResources(items);
    case 'links':
      return renderLinks(items);
    default:
      return renderGeneric(items); // covers any custom / "other" type
  }
}

function renderSchedule(items) {
  return `<div class="timeline">${items.map(it => `
    <div class="timeline-item">
      <span class="time">${escapeHtml(it.time || '')}</span>
      <h3>${escapeHtml(it.title || '')}</h3>
      ${it.description ? `<p>${escapeHtml(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
}

function renderSpeakers(items) {
  return `<div class="grid">${items.map(it => `
    <div class="card">
      <h3>${escapeHtml(it.name || '')}</h3>
      ${it.role ? `<p class="role">${escapeHtml(it.role)}</p>` : ''}
      ${it.bio ? `<p>${escapeHtml(it.bio)}</p>` : ''}
    </div>`).join('')}</div>`;
}

function renderResources(items) {
  return `<div class="grid">${items.map(it => `
    ${it.url ? `<a class="card-link" href="${escapeAttr(it.url)}">` : ''}
    <div class="card">
      <h3>${escapeHtml(it.title || '')}</h3>
      ${it.description ? `<p>${escapeHtml(it.description)}</p>` : ''}
      ${it.tag ? `<span class="tag">${escapeHtml(it.tag)}</span>` : ''}
    </div>
    ${it.url ? `</a>` : ''}`).join('')}</div>`;
}

function renderLinks(items) {
  return `<ul class="link-list">${items.map(it => `
    <li><a href="${escapeAttr(it.url || '#')}">
      <span>${escapeHtml(it.label || it.url || '')}</span>
      <span class="go">open</span>
    </a></li>`).join('')}</ul>`;
}

// Generic fallback: renders whatever key/value fields an item has,
// so a brand-new section type in the JSON still displays sensibly.
function renderGeneric(items) {
  return `<div class="grid">${items.map(it => {
    const entries = Object.entries(it).filter(([k]) => k !== 'url');
    const body = entries.map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</p>`).join('');
    const inner = `<div class="card">${body}</div>`;
    return it.url ? `<a class="card-link" href="${escapeAttr(it.url)}">${inner}</a>` : inner;
  }).join('')}</div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', loadContent);
