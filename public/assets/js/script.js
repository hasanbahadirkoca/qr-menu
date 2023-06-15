// [TR] URL'den menü ID'sini al
// [EN] Get menu ID from URL
const url = window.location.href;
const urlParamsIndex = url.indexOf("?");
const menuID = url.substring(urlParamsIndex + 1);

// [TR] Firebase veritabanından menüyü al
// [EN] Get menu from Firebase database
async function getMenu(menuID) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    db.collection("menus")
      .doc(menuID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject("No such document!");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// [TR] Menüyü ekrana yazdır
// [EN] Print menu to screen
async function printMenu() {
  const menu = await getMenu(menuID);
  console.log(menu);

  // [TR] Sayfa başlığı ve şirket adı
  // [EN] Page title and company name
  document.title = menu.name + " - QR Menu";
  document.querySelector(".company-name").innerHTML = menu.name
    ? menu.name
    : "";

  // [TR] Hoşgeldiniz metni
  // [EN] Welcome text
  document.querySelector(".welcome-text").innerHTML = menu.welcome_text
    ? menu.welcome_text
    : "";

  // [TR] Menü listesini döngü ile oluştur
  // [EN] Create menu list with loop
  menu.menu.forEach((category) => {
    const categoryName = Object.keys(category)[0];
    console.log(categoryName);

    // [TR] Kategori başlıklarını oluştur ve sayfaya ekle
    // [EN] Create category titles and add to page
    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category");

    const categoryTitle = document.createElement("h2");
    categoryTitle.classList.add("category-title");
    categoryTitle.innerHTML = categoryName;

    categoryItem.appendChild(categoryTitle);
    document.querySelector(".menu").appendChild(categoryItem);

    // [TR] Ürünleri oluştur ve sayfaya ekle
    // [EN] Create products and add to page
    category[categoryName].forEach((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("menu-item");

      const menuItemInfo = document.createElement("div");
      menuItemInfo.classList.add("menu-item-info");

      // [TR] Ürün adı
      // [EN] Product name
      const menuItemName = document.createElement("h3");
      menuItemName.textContent = product.title;
      menuItemInfo.appendChild(menuItemName);

      // [TR] Ürün açıklaması
      // [EN] Product description
      const menuItemDescription = document.createElement("p");
      menuItemDescription.classList.add("menu-item-description");
      menuItemDescription.textContent = product.description || "";
      menuItemInfo.appendChild(menuItemDescription);

      // [TR] Ürün fiyatı
      // [EN] Product price
      const menuItemPrice = document.createElement("span");
      menuItemPrice.classList.add("menu-item-price");
      menuItemPrice.textContent = product.price;
      
      menuItemInfo.appendChild(menuItemPrice);
      productItem.appendChild(menuItemInfo);
      categoryItem.appendChild(productItem);
    });
  });
  removeLoading();
}
printMenu();

// [TR] Sayfa yükleniyor animasyonunu kaldır
// [EN] Remove loading animation
function removeLoading() {
  const loader = document.getElementById("loader");
  loader.classList.add("hide");
}
