// PRINTLY — SHARED JS UTILITIES

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
