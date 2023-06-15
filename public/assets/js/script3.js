// [TR] JSON dosyasını oku.
// [EN] Read JSON file.
fetch("assets/json/test.json")
  .then((response) => response.json())
  .then((data) => {

    // [TR] Firma adı
    // [EN] Company name
    document.title = data.company_name + " Menü"

    // [TR] Karşılama Metni
    // [EN] Welcome Message
    document.getElementById("karsilama").textContent = data.welcome_text;

    // [TR] Footer Metni
    // [EN] Footer Text
    document.getElementById("footer").textContent = data.footer_text;

    // Menu
    const menuDiv = document.getElementById("menu");
    for (const category in data.menu) {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("menu-category");

      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = category;
      categoryDiv.appendChild(categoryTitle);

      const menuItems = data.menu[category];
      for (const menuItem of menuItems) {
        const menuItemDiv = document.createElement("div");
        menuItemDiv.classList.add("menu-item");

        const menuItemImage = document.createElement("img");
        menuItemImage.setAttribute("src", menuItem.resim);
        menuItemImage.setAttribute("alt", menuItem.ad);
        menuItemDiv.appendChild(menuItemImage);

        const menuItemInfo = document.createElement("div");
        menuItemInfo.classList.add("menu-item-info");

        const menuItemName = document.createElement("h3");
        menuItemName.textContent = menuItem.ad;
        menuItemInfo.appendChild(menuItemName);

        const menuItemDescription = document.createElement("p");
        menuItemDescription.classList.add("menu-item-description");
        menuItemDescription.textContent = menuItem.aciklama;
        menuItemInfo.appendChild(menuItemDescription);

        const menuItemPrice = document.createElement("span");
        menuItemPrice.classList.add("menu-item-price");
        menuItemPrice.textContent = menuItem.fiyat;
        menuItemInfo.appendChild(menuItemPrice);

        menuItemDiv.appendChild(menuItemInfo);

        categoryDiv.appendChild(menuItemDiv);
      }

      menuDiv.appendChild(categoryDiv);
    }
  })
  .catch((error) => console.error("Hata:", error));

window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.classList.add("hide");
});
