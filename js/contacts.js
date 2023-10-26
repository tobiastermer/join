let contacts = [];
let selectedContactIndex = -1;

async function init() {
  loadContacts();
}

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    displayContacts();
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function showAddContactOverlay() {
  document.getElementById("addContactOverlay").style.display = "flex";
}

function hideAddContactOverlay() {
  document.getElementById("addContactOverlay").style.display = "none";
}

function hideEditContactOverlay() {
  document.getElementById("editContactOverlay").style.display = "none";
}

async function addContact() {
  let name = document.getElementById("addContactName").value;
  let email = document.getElementById("addContactEmail").value;
  let phone = document.getElementById("addContactPhone").value;
  let initials = getInitials(name);

  contacts.push({
    name: name,
    email: email,
    phone: phone,
    initials: initials,
  });

  await setItem("contacts", JSON.stringify(contacts));
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function displayContacts() {
  let contactListDiv = document.getElementById("contactList");
  let bigContactDiv = document.getElementById("rightSideContactHeader");

  contactListDiv.innerHTML = "";
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let currentInitial = "";
  contacts.forEach((contact, index) => {
    let initials = getInitials(contact.name);
    let firstInitial = initials.charAt(0).toUpperCase();

    if (firstInitial !== currentInitial) {
      currentInitial = firstInitial;
      contactListDiv.innerHTML += `
                <div class="contact_letter">${currentInitial}</div>
                <div class="space_line"></div>`;
    }

    contactListDiv.innerHTML += `
    <div class="contact" onclick="showContactInfo(${index})">
                <button class="contact_initial_image">${initials}</button>
                <div class="contact_name_mail">
                    <div class="contact_name">${contact.name}</div>
                    <div class="contact_mail">
                        <a a href="mailto:${contact.email}">${contact.email}</a>
                    </div>
                </div>
            </div>`;
  });
}

// function to show Contact Informations
function showContactInfo(contactIndex) {
  let contact = contacts[contactIndex];
  let bigContactDiv = document.getElementById("contactDetails");
  bigContactDiv.innerHTML = `
            <div class="big_contact_top">
                <div class="big_contact_initial_image"><button>${getInitials(
                  contact.name
                )}</button></div>
                <div class="big_contact_name_settings">
                    <div class="big_contact_name">${contact.name}</div>
                    <div class="big_contact_settings">
                    <button onclick="showEditContactOverlay(${contactIndex})"><img src="./img/edit.png" alt="Edit Icon">Edit</button>

                        <button><img src="./img/delete_contact.png" alt="Delete Icon">Delete</button>
                    </div>
                </div>
            </div>
            <div class="big_contact_info">
                <div class="big_contact_headline">Contact Information</div>
                <div class="big_contact_mail">
                    <b>Email</b>
                    <div class="contact_mail"><a href="mailto:${
                      contact.email
                    }">${contact.email}</a></div>
                </div>
                <div class="big_contact_phone">
                    <b>Phone</b>
                    ${contact.phone}
                </div>
        </div>`;
}

function saveContact() {
  let editContactName = document.getElementById("editContactName").value;
  let editContactEmail = document.getElementById("editContactEmail").value;
  let editContactPhone = document.getElementById("editContactPhone").value;

  contacts[selectedContactIndex].name = editContactName;
  contacts[selectedContactIndex].email = editContactEmail;
  contacts[selectedContactIndex].phone = editContactPhone;

  setItem("contacts", JSON.stringify(contacts));
  displayContacts(selectedContactIndex);
  showContactInfo(selectedContactIndex);
  hideEditContactOverlay();
}

function showEditContactOverlay(contactIndex) {
  selectedContactIndex = contactIndex; // Setzen Sie den ausgewählten Kontakt-Index
  document.getElementById("editContactOverlay").style.display = "flex";
  populateEditFields(contactIndex); // Rufen Sie die Funktion zum Ausfüllen der Felder auf
}

function populateEditFields(contactIndex) {
  // Fülle die Edit-Felder mit den Daten des ausgewählten Kontakts
  let contact = contacts[contactIndex];
  document.getElementById("editContactName").value = contact.name;
  document.getElementById("editContactEmail").value = contact.email;
  document.getElementById("editContactPhone").value = contact.phone;
}
