const menuForm = document.querySelector(".menu-form");
const menuList = menuForm.querySelector("ul");
const addButton = menuForm.querySelector(".add-button");

// [TR] Sayfa yüklendiğinde kullanıcının menülerini getirir
// [EN] When the page is loaded, it brings the user's menus
window.addEventListener("load", async function () {
  const user = await getUserInfo();
  const menus = await getMenus(user.uid);
});

// [TR] Menü ekleme butonuna tıklandığında prompt ile kullanıcıdan işletme adı alınır
// [EN] When the add menu button is clicked, the user is prompted for the business name
addButton.addEventListener("click", function () {
  const businessName = prompt("Lütfen işletme adını giriniz");
  if (businessName) {
    if (businessName.length > 20) {
      alert("İşletme adı 20 karakterden fazla olamaz");
      return;
    }
    createMenu(businessName);
  }
});

// [TR]  Menü düzenleme butonuna tıklandığında ilgili menüyü düzenleme sayfasına yönlendirir
// [EN] When the edit menu button is clicked, it directs the relevant menu to the edit menu page
menuList.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-button")) {
    const menuItem = e.target.parentElement.parentElement;
    const menuID = menuItem.querySelector(".id").innerText.slice(1, -1);
    window.location.href = "./edit-menu.html?" + menuID;
  }
});

// [TR] Menü listesindeki sil butonuna tıklandığında ilgili item onay alınarak silinir.
// [EN] When the delete button in the menu list is clicked, the relevant item is deleted with confirmation.
menuList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-button")) {
    const menuItem = e.target.parentElement.parentElement;
    const menuName = menuItem.querySelector(".form-list-item-text").innerText;
    const menuID = menuItem.querySelector(".id").innerText.slice(1, -1);
    const result = confirm(
      menuName + " menüsünü silmek istediğinize emin misiniz?"
    );
    if (result) {
      deleteMenu(menuID);
      menuItem.remove();
    }
  }
});

// [TR] Veritabanına bağlanarak menüyü oluşturur
// [EN] Connects to the database and creates the menu
async function createMenu(menuName) {
  var menuID = generateId();
  const user = await getUserInfo();

  // [TR] Menü ID'si özgün değilse yeni bir ID oluşturur.
  // [EN] If the menu ID is not unique, it creates a new ID.
  const menu = await db.collection("menus").doc(menuID).get();
  if (menu.exists) {
    menuID = generateId();
  }

  // [TR] Menüyü veritabanına kaydeder
  // [EN] Saves the menu to the database
  db.collection("menus")
    .doc(menuID)
    .set({
      name: menuName,
      id: menuID,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      authorized_name: user.displayName,
      authorized_phone: user.phoneNumber,
      authorized_uid: user.uid,
    })
    .then(() => {
      addItemToList(menuList, menuName, menuID);
    })
    .catch((error) => {
      throw error;
    });
}

// [TR] Menüyü veritabanından siler
// [EN] Deletes the menu from the database
async function deleteMenu(menuID) {
  console.log(menuID, "silindi");
  db.collection("menus")
    .doc(menuID)
    .delete()
    .catch((error) => {
      throw error;
    });
}

// [TR] Kullanıcı bilgilerini alır ve döndürür
// [EN] Gets and returns user information
async function getUserInfo() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        resolve(user);
      } else {
        resolve(false);
      }
    });
  });
}

// [TR] Menü için rastgele bir id oluşturur
// [EN] Generates a random id for the menu
function generateId() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return id;
}

// [TR] Veritabanına bağlanarak kullanıcının menü içeriklerini getirir ve ekler
// [EN] Connects to the database and retrieves and adds the user's menu content
async function getMenus(userUID) {
  const menus = await getUsersMenus(userUID);
  console.log(menus);
  menus.forEach((menuID) => {
    db.collection("menus")
      .doc(menuID)
      .get()
      .then((doc) => {
        const menu = doc.data();
        addItemToList(menuList, menu.name, menu.id);
      });
  });
}

// [TR] Veritabanına bağlanarak kullanıcının menülerini getirir
// [EN] Connects to the database and retrieves the user's menus
async function getUsersMenus(userUID) {
  const menus = await db
    .collection("menus")
    .where("authorized_uid", "==", userUID)
    .get();

  return menus.docs.map((doc) => doc.id);
}

// [TR] Menü listesine yeni bir item ekler
// [EN] Adds a new item to the menu list
function addItemToList(form, item, id) {
  const li = document.createElement("li");
  li.innerHTML = `
  <div class="form-list-item-text">
      <span>${item} <span class="id">(${id})</span></span>
  </div>
  <div class="form-list-item-buttons">
      <button class="edit-button">Düzenle</button>
      <button class="delete-button">Sil</button>
  </div>
  `;
  form.appendChild(li);

  return li;
}
