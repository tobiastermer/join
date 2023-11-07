// global variables
let greetingMobileAlreadyShown;

/**
 * Show the success message when successfully created or edited contact or task
 * needs an html element with id 'success
 */
function showSuccessMessage(text) {
  let successMessage = document.getElementById('successmessage');

  successMessage.style.opacity = 0;
  successMessage.style.display = "flex";
  successMessage.innerHTML = text;
  setTimeout(() => {
    successMessage.style.opacity = 1;
  }, 1000);

  setTimeout(() => {
    successMessage.style.opacity = 0;
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 1000);
  }, 3000);
}

function setGreetingMobileStatus() {
  localStorage.setItem('greetingMobileAlreadyShown', greetingMobileAlreadyShown);
}

function setGreetingMobileStatusToFalse() {
  greetingMobileAlreadyShown = false;
  setGreetingMobileStatus();
}

function setGreetingMobileStatusToTrue() {
  greetingMobileAlreadyShown = true;
  setGreetingMobileStatus();
}

function getGreetingMobileStatus() {
  greetingMobileAlreadyShown = localStorage.getItem('greetingMobileAlreadyShown');
}