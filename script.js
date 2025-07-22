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
  } else {
    body.style.backgroundColor = "#ccffcc"; // green
    dog.style.backgroundImage = "url('happy-dog.png')";
    toggle.checked = true;
    timeRemaining.innerText = "";
    alertMessage.innerText = "";
  }

  localStorage.setItem("homeStatus", status);
  checkTimeLimit(); // пересчитать время сразу после переключения
}

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    setStatus("home");
  } else {
    setStatus("away");
  }
});

function checkTimeLimit() {
  const status = localStorage.getItem("homeStatus");
  const leaveTime = parseInt(localStorage.getItem("leaveTime") || "0");

  if (status === "away") {
    const now = Date.now();
    const diffHours = (now - leaveTime) / (1000 * 60 * 60);
    const hoursLeft = 0.0166 - diffHours; // ~1 минута для теста

    if (hoursLeft <= 0) {
      alertMessage.innerText = "⏰ Time limit reached! Please check in.";
      timeRemaining.innerText = "";

      // 👉 Push notification через OneSignal
      OneSignal.push(function () {
        OneSignal.sendSelfNotification(
          "⚠️ Your pet might be alone",
          "You haven't checked in. Please confirm you're okay.",
          "https://klyaksonchikcripta.github.io/homealonepet/",
          "https://klyaksonchikcripta.github.io/homealonepet/icon.png"
        );
      });
    } else {
      alertMessage.innerText = "";
      const hrs = Math.floor(hoursLeft);
      const mins = Math.floor((hoursLeft - hrs) * 60);
      timeRemaining.innerText = `${hrs}h ${mins}min`;
    }
  } else {
    alertMessage.innerText = "";
    timeRemaining.innerText = "";
  }
}

window.onload = function () {
  const saved = localStorage.getItem("homeStatus") || "home";
  setStatus(saved);
  checkTimeLimit();
};

setInterval(checkTimeLimit, 60000); // проверяем каждую минуту
