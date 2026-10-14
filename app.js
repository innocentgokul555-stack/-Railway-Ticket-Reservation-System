// ============================================================
//  Railway Ticket Reservation System — Main Logic
// ============================================================

// ---------- Valid credentials ----------
const VALID_USERS = [
  { username: "admin", password: "admin123" },
  { username: "user",  password: "user123"  },
];

// ---------- Price map ----------
const CLASS_PRICE = {
  SL: 350,
  "3A": 850,
  "2A": 1250,
  "1A": 2100,
};

// ---------- Booking history (in-memory) ----------
let bookings = [];
let pnrCounter = 1000;

// ---------- DOM references ----------
const loginPage       = document.getElementById("loginPage");
const reservationPage = document.getElementById("reservationPage");
const loginForm       = document.getElementById("loginForm");
const loginError      = document.getElementById("loginError");
const usernameInput   = document.getElementById("username");
const passwordInput   = document.getElementById("password");
const welcomeUser     = document.getElementById("welcomeUser");
const logoutBtn       = document.getElementById("logoutBtn");

const bookingForm     = document.getElementById("bookingForm");
const bookingSection  = document.getElementById("bookingSection");
const ticketSection   = document.getElementById("ticketSection");
const ticketDetails   = document.getElementById("ticketDetails");
const newBookingBtn   = document.getElementById("newBookingBtn");
const historyWrapper  = document.getElementById("historyTableWrapper");
const journeyDateEl   = document.getElementById("journeyDate");

// ---------- Set min date for journey to today ----------
(function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  journeyDateEl.setAttribute("min", today);
})();

// ===================== LOGIN =====================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const uname = usernameInput.value.trim();
  const pass  = passwordInput.value.trim();

  if (uname && pass) {
    loginError.hidden = true;
    loginPage.classList.add("hidden");
    reservationPage.classList.remove("hidden");
    welcomeUser.textContent = `Welcome, ${uname}`;
  } else {
    loginError.hidden = false;
    passwordInput.focus();
  }
});

// ===================== LOGOUT =====================
logoutBtn.addEventListener("click", function () {
  reservationPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  loginForm.reset();
  loginError.hidden = true;
});

// ===================== BOOKING =====================
bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const from = document.getElementById("fromStation").value;
  const to   = document.getElementById("toStation").value;

  // Validate same station
  if (from === to) {
    alert("'From' and 'To' stations cannot be the same!");
    return;
  }

  const classCode    = document.getElementById("travelClass").value;
  const numPass      = parseInt(document.getElementById("numPassengers").value, 10);
  const pricePerHead = CLASS_PRICE[classCode];
  const totalPrice   = pricePerHead * numPass;

  pnrCounter++;
  const booking = {
    pnr:       "PNR" + pnrCounter,
    name:      document.getElementById("passengerName").value.trim(),
    age:       document.getElementById("age").value,
    gender:    document.getElementById("gender").value,
    phone:     document.getElementById("phone").value.trim(),
    from:      from,
    to:        to,
    date:      document.getElementById("journeyDate").value,
    class:     classCode,
    passengers: numPass,
    total:     totalPrice,
    bookedAt:  new Date().toLocaleString(),
  };

  bookings.push(booking);
  showTicket(booking);
  updateHistory();
  bookingForm.reset();
  // Re-set min date after reset
  const today = new Date().toISOString().split("T")[0];
  journeyDateEl.setAttribute("min", today);
});

// ===================== SHOW TICKET =====================
function showTicket(b) {
  bookingSection.classList.add("hidden");
  ticketSection.classList.remove("hidden");

  ticketDetails.innerHTML = `
    <div class="ticket-header">🚆 Indian Railways — E-Ticket</div>
    <div class="row"><span class="label">PNR Number:</span>  <span>${b.pnr}</span></div>
    <div class="row"><span class="label">Passenger:</span>   <span>${b.name}</span></div>
    <div class="row"><span class="label">Age / Gender:</span><span>${b.age} / ${b.gender}</span></div>
    <div class="row"><span class="label">Phone:</span>       <span>${b.phone}</span></div>
    <div class="row"><span class="label">From:</span>        <span>${b.from}</span></div>
    <div class="row"><span class="label">To:</span>          <span>${b.to}</span></div>
    <div class="row"><span class="label">Date:</span>        <span>${b.date}</span></div>
    <div class="row"><span class="label">Class:</span>       <span>${b.class}</span></div>
    <div class="row"><span class="label">Passengers:</span>  <span>${b.passengers}</span></div>
    <div class="row"><span class="label">Total Fare:</span>  <span><strong>₹${b.total.toLocaleString("en-IN")}</strong></span></div>
    <div class="row"><span class="label">Booked At:</span>   <span>${b.bookedAt}</span></div>
  `;
}

// ===================== NEW BOOKING =====================
newBookingBtn.addEventListener("click", function () {
  ticketSection.classList.add("hidden");
  bookingSection.classList.remove("hidden");
});

// ===================== BOOKING HISTORY TABLE =====================
function updateHistory() {
  if (bookings.length === 0) {
    historyWrapper.innerHTML = `<p class="empty-state">No bookings yet.</p>`;
    return;
  }

  let rows = bookings
    .map(
      (b) => `
    <tr>
      <td>${b.pnr}</td>
      <td>${b.name}</td>
      <td>${b.from} → ${b.to}</td>
      <td>${b.date}</td>
      <td>${b.class}</td>
      <td>${b.passengers}</td>
      <td>₹${b.total.toLocaleString("en-IN")}</td>
    </tr>`
    )
    .join("");

  historyWrapper.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>PNR</th>
          <th>Passenger</th>
          <th>Route</th>
          <th>Date</th>
          <th>Class</th>
          <th>Pax</th>
          <th>Fare</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
