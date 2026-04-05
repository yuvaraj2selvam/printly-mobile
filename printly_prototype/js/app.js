/* PRINTLY — SHARED JS UTILITIES */

// Toast Notification
function toast(msg) {
  const t = document.getElementById('toastEl');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2400);
}

// Lucide Icons Reinit
function reinitIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Data Loader (works both local and served)
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path);
    return await res.json();
  } catch (e) {
    console.warn('JSON fetch failed for ' + path + ', using embedded data');
    return null;
  }
}

// Format Currency
function formatKWD(amount) {
  return 'KWD ' + Number(amount).toFixed(3);
}

// Format Number
function formatNum(num) {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

// Date Formatter
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

// Relative Time
function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return formatDate(dateStr);
}

// Simple Star Rating HTML
function starRatingHTML(rating, size = 12) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '';
  for (let i = 0; i < full; i++) {
    html += `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  if (half) {
    html += `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="#F59E0B" stroke="none" opacity=".5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  for (let i = 0; i < empty; i++) {
    html += `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="#E5E7EB" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return html;
}

// Status Badge HTML
function statusBadge(status) {
  const map = {
    'confirmed': { label: 'Confirmed', cls: 'badge-p' },
    'processing': { label: 'Processing', cls: 'badge-p' },
    'printing': { label: 'In Printing', cls: 'badge-warn' },
    'quality_check': { label: 'Quality Check', cls: 'badge-warn' },
    'shipped': { label: 'Shipped', cls: 'badge-p' },
    'delivered': { label: 'Delivered', cls: 'badge-ok' },
    'cancelled': { label: 'Cancelled', cls: 'badge-danger' },
    'pending': { label: 'Pending', cls: 'badge-dark' },
    'active': { label: 'Active', cls: 'badge-ok' },
    'inactive': { label: 'Inactive', cls: 'badge-dark' },
    'approved': { label: 'Approved', cls: 'badge-ok' },
    'rejected': { label: 'Rejected', cls: 'badge-danger' },
    'pending_review': { label: 'Pending Review', cls: 'badge-warn' }
  };
  const s = map[status] || { label: status, cls: 'badge-dark' };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

// Simple Chart Drawing
function drawBarChart(containerId, data, maxVal) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const max = maxVal || Math.max(...data.map(d => d.value));
  container.innerHTML = data.map(d => `
    <div class="bar-col">
      <div class="bar-val">${formatKWD(d.value)}</div>
      <div class="bar-fill" style="height:${(d.value / max) * 100}%"></div>
      <div class="bar-label">${d.label}</div>
    </div>
  `).join('');
}

// Portal Page Switching
function switchPortalPage(pageId, linkEl) {
  // Hide all portal pages
  document.querySelectorAll('.portal-page').forEach(p => p.style.display = 'none');
  // Show target
  const target = document.getElementById('pp-' + pageId);
  if (target) { target.style.display = 'block'; window.scrollTo(0, 0); }
  // Update sidebar active
  document.querySelectorAll('.ps-link').forEach(l => l.classList.remove('on'));
  if (linkEl) linkEl.classList.add('on');
  // Close mobile sidebar
  const sidebar = document.querySelector('.portal-sidebar');
  if (sidebar) sidebar.classList.remove('open');
  const overlay = document.getElementById('portalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  reinitIcons();
}

// Portal Sidebar Toggle (mobile)
function togglePortalSidebar() {
  const s = document.querySelector('.portal-sidebar');
  const o = document.getElementById('portalOverlay');
  if (s) s.classList.toggle('open');
  if (o) o.classList.toggle('open');
  document.body.style.overflow = s && s.classList.contains('open') ? 'hidden' : '';
}

// Donut Chart (simple SVG)
function drawDonutChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = ['#473BF0', '#16A34A', '#D97706', '#DC2626', '#6B7280', '#EC4899'];
  let cumulative = 0;
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 50;
  const strokeWidth = 20;

  let paths = '';
  data.forEach((d, i) => {
    const pct = d.value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const largeArc = pct > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    paths += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${strokeWidth}" />`;
  });

  let legend = data.map((d, i) => `
    <div style="display:flex;align-items:center;gap:6px;font-size:12px">
      <div style="width:10px;height:10px;border-radius:2px;background:${colors[i % colors.length]};flex-shrink:0"></div>
      <span style="color:var(--body)">${d.label}</span>
      <span style="margin-left:auto;font-weight:700;color:var(--dark)">${d.value}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${strokeWidth}" />
        ${paths}
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="var(--dark)" font-size="20" font-weight="900" font-family="Poppins">${total}</text>
        <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="var(--muted)" font-size="10" font-weight="500" font-family="Poppins">Total</text>
      </svg>
      <div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:120px">${legend}</div>
    </div>
  `;
}
