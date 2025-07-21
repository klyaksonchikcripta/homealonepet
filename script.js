const toggle = document.getElementById("statusToggle");
const body = document.body;
const dog = document.getElementById("dogImage");
const alertMessage = document.getElementById("alertMessage");
const timeRemaining = document.getElementById("timeRemaining");

function setStatus(status) {
  if (status === "away") {
    body.style.backgroundColor = "#ffcccc"; // красный
    dog.style.backgroundImage = "url('sad-dog.png')";
    toggle.checked = false;
    localStorage.setItem("leaveTime", Date.now());
  } else {
    body.style.backgroundColor = "#ccffcc"; // зелёный
    dog.style.backgroundImage = "url('happy-dog.png')";
    toggle.checked = true;
    timeRemaining.innerText = "";
    alertMessage.innerText = "";
  }

  localStorage.setItem("homeStatus", status);
  checkTimeLimit();
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
    const hoursLeft = 0.0166 - diffHours;

    if (hoursLeft <= 0) {
      alertMessage.innerText = "⏰ Time limit reached! Please check in.";
      timeRemaining.innerText = "";
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

setInterval(checkTimeLimit, 60000); // проверка каждую минуту
