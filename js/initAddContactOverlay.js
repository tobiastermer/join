function initAddOverlay() {
    document.getElementById("addContactOverlay").style.display = "flex";
}

/**
 * Add a new contact to the list.
 */
async function addContactExtra() {
    let fullName = document.getElementById("addContactName").value;
    let email = document.getElementById("addContactEmail").value;
    let phone = document.getElementById("addContactPhone").value;
    let initials = getInitials(fullName);
  
    if (!checkForRightInput(fullName, email, phone)) {
      return;
    }
  
    let randomColor =
      contactColors[Math.floor(Math.random() * contactColors.length)];
  
    contacts.push({
      name: fullName,
      email: email,
      phone: phone,
      initials: initials,
      color: randomColor,
    });
  
    localStorage.setItem(
      "contactColors",
      JSON.stringify(contacts.map((contact) => contact.color))
    );
  
    await setItem("contacts", JSON.stringify(contacts));
    hideAddContactOverlay();
    showSuccessMessage();
  }
