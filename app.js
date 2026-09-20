const units = [
  { id: 'scoopy', name: 'Honda Scoopy', type: 'Automatic • 110cc', price: '95.000', available: true },
  { id: 'nmax', name: 'Yamaha NMAX', type: 'Automatic • 155cc', price: '175.000', available: true },
  { id: 'vespa', name: 'Vespa Primavera', type: 'Automatic • 150cc', price: '225.000', available: true }
];
const baseOrders = [
  { name: 'Alvin Pratama', phone: '0812 3421 9090', unit: 'Yamaha NMAX', dates: '21 – 24 Sep', status: 'Ongoing' },
  { name: 'Nadia Putri', phone: '0856 9910 2113', unit: 'Honda Scoopy', dates: '22 – 23 Sep', status: 'Confirmed' },
  { name: 'Raka Mahendra', phone: '0813 8782 1489', unit: 'Vespa Primavera', dates: '25 – 27 Sep', status: 'Pending' }
];
let orders = JSON.parse(localStorage.getItem('ren-orders') || 'null') || baseOrders;
let selectedUnit = null;
const dateToday = new Date().toISOString().slice(0, 10);
document.querySelectorAll('input[type="date"]').forEach(input => input.min = dateToday);

function renderFleet() {
  document.getElementById('fleetGrid').innerHTML = units.map((unit, i) => `<article class="fleet-card"><div class="fleet-photo motor-placeholder"><span class="photo-label">UNIT ${String(i + 1).padStart(2, '0')} — PLACEHOLDER</span><div class="motor-silhouette">▰<i></i><b></b></div><p>Foto ${unit.name}</p><span class="availability">Tersedia</span></div><div class="fleet-copy"><h3>${unit.name}</h3><p>${unit.type}</p><div class="fleet-bottom"><strong>Rp${unit.price} <small>/ hari</small></strong><button class="book-unit" data-unit="${unit.id}">Pesan →</button></div></div></article>`).join('');
}
function openBooking(unitId) {
  selectedUnit = units.find(unit => unit.id === unitId) || units[0];
  document.getElementById('bookingTitle').textContent = `Pesan ${selectedUnit.name}`;
  document.getElementById('bookingMeta').textContent = `${selectedUnit.type} • Rp${selectedUnit.price}/hari`;
  const modal = document.getElementById('bookingPanel'); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
}
function saveOrders() { localStorage.setItem('ren-orders', JSON.stringify(orders)); }
function statusClass(status) { return status.toLowerCase(); }
function renderOrders() {
  document.getElementById('ordersBody').innerHTML = orders.map((order, index) => `<tr><td><div class="customer-name">${order.name}</div><div class="customer-phone">${order.phone}</div></td><td>${order.unit}</td><td>${order.dates}</td><td><span class="status ${statusClass(order.status)}">${order.status}</span></td><td><button class="order-action" data-order="${index}">${order.status === 'Pending' ? 'Konfirmasi' : 'Lihat detail'}</button></td></tr>`).join('');
  document.getElementById('activeOrders').textContent = String(orders.filter(order => ['Ongoing', 'Confirmed'].includes(order.status)).length).padStart(2, '0');
  document.getElementById('pendingOrders').textContent = String(orders.filter(order => order.status === 'Pending').length).padStart(2, '0');
}
renderFleet();
document.getElementById('fleetGrid').addEventListener('click', event => { const id = event.target.dataset.unit; if (id) openBooking(id); });
document.getElementById('quickBooking').addEventListener('submit', event => { event.preventDefault(); openBooking('scoopy'); });
document.getElementById('closeBooking').addEventListener('click', () => document.getElementById('bookingPanel').classList.remove('open'));
document.getElementById('reservationForm').addEventListener('submit', event => {
  event.preventDefault(); const data = new FormData(event.target); const start = data.get('start'); const end = data.get('end');
  if (end <= start) { alert('Tanggal selesai harus setelah tanggal mulai.'); return; }
  orders.unshift({ name: data.get('name'), phone: data.get('phone'), unit: selectedUnit.name, dates: `${new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`, status: 'Pending' });
  saveOrders(); renderOrders(); event.target.reset(); document.getElementById('bookingPanel').classList.remove('open'); document.getElementById('successPanel').classList.add('open');
});
document.getElementById('closeSuccess').addEventListener('click', () => document.getElementById('successPanel').classList.remove('open'));
document.getElementById('staffAccess').addEventListener('click', () => document.getElementById('staffGate').classList.add('open'));
document.getElementById('closeStaff').addEventListener('click', () => document.getElementById('staffGate').classList.remove('open'));
document.getElementById('staffLogin').addEventListener('submit', event => { event.preventDefault(); if (document.getElementById('staffPin').value !== '1234') { alert('PIN demo tidak sesuai.'); return; } document.getElementById('staffGate').classList.remove('open'); document.querySelector('main').style.display = 'none'; document.querySelector('footer').style.display = 'none'; document.querySelector('.site-header').style.display = 'none'; document.querySelector('.announcement').style.display = 'none'; document.getElementById('dashboard').classList.add('open'); renderOrders(); });
document.getElementById('logout').addEventListener('click', () => location.reload());
document.getElementById('ordersBody').addEventListener('click', event => { const index = event.target.dataset.order; if (index === undefined) return; if (orders[index].status === 'Pending') { orders[index].status = 'Confirmed'; saveOrders(); renderOrders(); } });
document.getElementById('refreshOrders').addEventListener('click', renderOrders);
