let swRegistration = null;
const VAPID_PUBLIC_KEY = "BN5fivAZJmCIfAuUsPmAG62iHUvNbPaAyPJKgui_Nz_lQks6j_wfJ7QOG1s9O5m1SHahyW8sQwdp50niNDYZBn0="

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported");
  }
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  swRegistration = registration;
  console.log("Service Worker registered & ready");
}


const notifyBtn = document.getElementById("notify-btn");
const clockBtn = document.querySelector('.icon-btn[title="Notification time"]');
const galleryBtn = document.getElementById("gallery-btn");
const timeModal = document.getElementById("time-modal");
const galleryModal = document.getElementById("gallery-modal");
const saveTimeBtn = document.getElementById("save-time");
const cancelTimeBtn = document.getElementById("cancel-time");
const closeGalleryBtn = document.getElementById("close-gallery");
const notificationTimeInput = document.getElementById("notification-time");
const timeDisplay = document.getElementById("time-display");
const currentTimeSpan = document.getElementById("current-time");
const notificationStatus = document.getElementById("notification-status");
const galleryCount = document.getElementById("gallery-count");
const saveQuoteBtn = document.getElementById("save-quote");
const shareQuoteBtn = document.getElementById("share-quote");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");

// Initialize gallery
updateGalleryCount();

// Check if notifications are already enabled
function checkNotificationStatus() {
  const endpoint = localStorage.getItem('pushEndpoint');
  if (endpoint) {
    notificationStatus.textContent = "On";
    notificationStatus.classList.add("active");
  }
}

// Show AM/PM when time changes
notificationTimeInput.addEventListener("change", (e) => {
  const time = e.target.value;
  if (time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    timeDisplay.textContent = `${displayHour}:${minutes} ${ampm}`;
  }
});

// Clock button functionality
clockBtn.addEventListener("click", () => {
  timeModal.style.display = "block";
});

// Close modal
cancelTimeBtn.addEventListener("click", () => {
  timeModal.style.display = "none";
});

// Gallery button functionality
galleryBtn.addEventListener("click", () => {
  displayGallery();
  galleryModal.style.display = "block";
});

// Close gallery
closeGalleryBtn.addEventListener("click", () => {
  galleryModal.style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (e) => {
  if (e.target === timeModal) {
    timeModal.style.display = "none";
  }
  if (e.target === galleryModal) {
    galleryModal.style.display = "none";
  }
});

// Save notification time
saveTimeBtn.addEventListener("click", async () => {
  const time = notificationTimeInput.value;
  if (!time) {
    alert("Please select a time");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/notification-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        endpoint: getStoredEndpoint(),
        notify_time: time 
      })
    });

    if (response.ok) {
      alert("Notification time saved successfully!");
      currentTimeSpan.textContent = time;
      timeModal.style.display = "none";
    } else {
      alert("Failed to save notification time");
    }
  } catch (error) {
    console.error("Error saving notification time:", error);
    alert("Failed to save notification time");
  }
});

// Save quote functionality
saveQuoteBtn.addEventListener("click", () => {
  console.log("Save button clicked!"); // Debug log
  const quote = {
    content: quoteText.textContent.replace(/[""]/g, ''),
    author: quoteAuthor.textContent.replace(/— /g, '').trim(),
    savedDate: new Date().toISOString().split('T')[0]
  };
  
  const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
  
  // Check if quote already exists
  const exists = savedQuotes.some(q => 
    q.content === quote.content && q.author === quote.author
  );
  
  if (exists) {
    showNotification('Quote already in your gallery!', 'info');
    return;
  }
  
  savedQuotes.push(quote);
  localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
  
  updateGalleryCount();
  showNotification('Quote saved to gallery!', 'success');
});

// Debug: Check if elements exist
console.log("Save button element:", saveQuoteBtn);
console.log("Share button element:", shareQuoteBtn);
console.log("Quote text element:", quoteText);
console.log("Quote author element:", quoteAuthor);

// Share quote functionality
shareQuoteBtn.addEventListener("click", () => {
  const quote = {
    content: quoteText.textContent.replace(/[""]/g, ''),
    author: quoteAuthor.textContent.replace(/— /g, '').trim()
  };
  
  if (navigator.share) {
    navigator.share({
      title: "Daily Quote",
      text: `"${quote.content}" - ${quote.author}`
    }).catch(err => console.error('Error sharing:', err));
  } else {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(`"${quote.content}" - ${quote.author}`);
    alert("Quote copied to clipboard!");
  }
});

// Helper function to get stored endpoint
function getStoredEndpoint() {
  return localStorage.getItem('pushEndpoint') || '';
}

// Beautiful notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = 'notification-content';
  notification.innerHTML = `
    <div class="notification-close" onclick="this.parentElement.remove()">×</div>
    <h4><i class="fa-solid fa-bell"></i> ${type === 'success' ? 'Success!' : 'Notification'}</h4>
    <p>${message}</p>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove();
  }, 5000);
}

// Gallery functions
function updateGalleryCount() {
  const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
  galleryCount.textContent = savedQuotes.length;
}

function displayGallery() {
  const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
  const galleryContainer = document.getElementById('gallery-container');
  
  if (savedQuotes.length === 0) {
    galleryContainer.innerHTML = `
      <div class="empty-gallery" id="empty-gallery">
        <i class="fa-solid fa-book-open"></i>
        <p>Your gallery is empty</p>
        <p>Save quotes to build your collection!</p>
      </div>
    `;
    return;
  }
  
  galleryContainer.innerHTML = savedQuotes.map((quote, index) => `
    <div class="quote-card">
      <div class="quote-card-text">"${quote.content}"</div>
      <div class="quote-card-author">— ${quote.author}</div>
      <div class="quote-card-date">Saved on ${quote.savedDate}</div>
      <div class="quote-card-actions">
        <button class="quote-card-btn" onclick="shareFromGallery(${index})">
          <i class="fa-regular fa-share"></i> Share
        </button>
        <button class="quote-card-btn delete" onclick="deleteFromGallery(${index})">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

function deleteFromGallery(index) {
  const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
  savedQuotes.splice(index, 1);
  localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
  
  updateGalleryCount();
  displayGallery();
  showNotification('Quote removed from gallery', 'info');
}

function shareFromGallery(index) {
  const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
  const quote = savedQuotes[index];
  
  if (navigator.share) {
    navigator.share({
      title: "Quote from Illuminate",
      text: `"${quote.content}" - ${quote.author}`
    }).catch(err => console.error('Error sharing:', err));
  } else {
    navigator.clipboard.writeText(`"${quote.content}" - ${quote.author}`);
    showNotification('Quote copied to clipboard!', 'success');
  }
}

notifyBtn.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Notifications not supported");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Notification permission denied");
    return;
  }

  await registerServiceWorker();

  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });

  await fetch("http://127.0.0.1:5000/api/subscribe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ subscription })
});

console.log("Push subscription saved:", subscription);
localStorage.setItem('pushEndpoint', subscription.endpoint);

// Show beautiful notification
showNotification('Notifications enabled successfully!', 'success');

// Update UI
notificationStatus.textContent = "On";
notificationStatus.classList.add("active");
});

const main = document.querySelector(".main");

async function loadQuote() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/today-quote");
    const data = await response.json();

    // Update existing quote elements instead of replacing them
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    
    if (quoteText && quoteAuthor) {
      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `— ${data.author}`;
    }

  } catch (error) {
    console.error("Failed to load quote:", error);
    document.getElementById("quote-text").textContent = "Failed to load quote";
    document.getElementById("quote-author").textContent = "";
  }
}

loadQuote();
