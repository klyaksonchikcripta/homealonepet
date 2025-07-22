const toggle = document.getElementById("statusToggle");
const body = document.body;
const dog = document.getElementById("dogImage");
const alertMessage = document.getElementById("alertMessage");
const timeRemaining = document.getElementById("timeRemaining");

function setStatus(status) {
  if (status === "away") {
    body.style.backgroundColor = "#ffcccc"; // red
    dog.style.backgroundImage = "url('sad-dog.png')";
    toggle.checked = false;
    localStorage.setItem("leaveTime", Date.now());
    localStorage.setItem("alertSent", "false");
  } else {
    body.style.backgroundColor = "#ccffcc"; // green
    dog.style.backgroundImage = "url('happy-dog.png')";
    toggle.checked = true;
    localStorage.removeItem("leaveTime");
    localStorage.setItem("alertSent", "false");
  }

  localStorage.setItem("homeStatus", status);
}

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    setStatus("home");
  } else {
    setStatus("away");
  }
});

window.onload = function () {
  const saved = localStorage.getItem("homeStatus") || "home";
  setStatus(saved);
};

function sendPushNotification() {
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${ONESIGNAL_REST_KEY}`
    },
    body: JSON.stringify({
      app_id: "6fb0b6cf-9734-41ae-8aec-5675f3e18898",
      included_segments: ["Subscribed Users"],
      headings: { en: "🐾 Time to check in" },
      contents: { en: "You haven't confirmed you're back. Please check in!" },
      url: "https://klyaksonchikcripta.github.io/homealonepet/"
    })
  });
}

function checkTimeLimit() {
  const status = localStorage.getItem("homeStatus");
  const leaveTime = parseInt(localStorage.getItem("leaveTime") || "0");
  const alertSent = localStorage.getItem("alertSent") === "true";

  if (status === "away") {
    const now = Date.now();
    const diffMinutes = (now - leaveTime) / (1000 * 60);
    const minutesLeft = 1 - diffMinutes;

    if (minutesLeft <= 0) {
      alertMessage.innerText = "⏰ Time limit reached! Please check in.";

      if (!alertSent) {
        sendPushNotification();
        localStorage.setItem("alertSent", "true");
      }

      timeRemaining.innerText = "";
    } else {
      alertMessage.innerText = "";
      timeRemaining.innerText = `${Math.max(0, Math.floor(minutesLeft))} min`;
    }
  } else {
    alertMessage.innerText = "";
    timeRemaining.innerText = "";
  }
}

setInterval(checkTimeLimit, 60000);
checkTimeLimit();
