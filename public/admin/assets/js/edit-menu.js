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

// [TR] Formu doldur
// [EN] Fill form
async function fillForm() {
  const menu = await getMenu(menuID);
  const menuName = document.getElementById("menu-name");
  const welcomeText = document.getElementById("welcome-text");

  menuName.value = menu.name ? menu.name : "";
  welcomeText.value = menu.welcome_text ? menu.welcome_text : "";

  // [TR] Menü listesini döngü ile oluştur
  // [EN] Create menu list with loop
  menu.menu.forEach((category) => {
    const categoryName = Object.keys(category)[0];
    const categoryItem = addItem(categoryName);

    category[categoryName].forEach((product) => {
      const productItem = addItem(product.title, categoryItem);

      const productDescription = productItem.querySelector(
        ".product-description"
      );
      productDescription.innerHTML = product.description
        ? product.description
        : "-";

      const productPrice = productItem.querySelector(".product-price");
      productPrice.innerHTML = product.price ? product.price : "-";
    });
  });
}

fillForm();

// [TR] Geri

// [TR] Menüyü kaydet
// [EN] Save menu
async function saveMenu(button) {
  const menuName = document.getElementById("menu-name");
  const welcomeText = document.getElementById("welcome-text");

  buttonStatus(button, "active");

  if (!menuName.value) {
    buttonStatus(button, "Menü adı boş bırakılamaz");
    return;
  }

  const db = firebase.firestore();
  db.collection("menus")
    .doc(menuID)
    .update({
      name: menuName.value,
      welcome_text: welcomeText.value,
      menu: getListAsArray(),
    })
    .then(() => {
      buttonStatus(button, "success");
    })
    .catch((error) => {
      buttonStatus(button, "Hata Oluştu");
    });
}

const categoryList = document.querySelector(".category-list");
const addCategoryButton = document.querySelector(".add-category-button");

// [TR] Kategori ekleme butonuna tıklandığında prompt ile kullanıcıdan kategori adı alınır
// [EN] When the add category button is clicked, prompt the user to enter a category name
addCategoryButton.addEventListener("click", function () {
  const categoryInput = prompt("Kategori için isim giriniz:");
  if (categoryInput) {
    const newCategory = addItem(categoryInput);
    highlightItem(newCategory);
  }
});

// [TR] Belirtilen kategori adını ve ebeveyn kategoriyi kullanarak bir kategori ekler
// [EN] Adds a category using the specified category name and parent category
function addItem(categoryName, parentCategory) {
  // [TR] Kategori öğesini oluşturur
  // [EN] Creates the category item
  const categoryItem = document.createElement("li");

  // [TR] Kategori başlığını oluşturur
  // [EN] Creates the category title
  const categoryHead = document.createElement("div");
  categoryHead.classList.add("category-head");
  categoryItem.appendChild(categoryHead);

  // [TR] Kategori başlığının içeriğini oluşturur
  // [EN] Creates the category title content
  const categoryTitle = document.createElement("span");
  categoryTitle.textContent = categoryName;
  categoryTitle.classList.add("category-title");
  categoryHead.appendChild(categoryTitle);

  // [TR] Kategori başlığının butonlarını oluşturur
  // [EN] Creates the category title buttons
  categoryHead.appendChild(createButtons(categoryItem));

  if (parentCategory) {
    // [TR] Alt Kategori
    // [EN] Subcategory
    categoryItem.classList.add("product-item");
    parentCategory.querySelector("ul").appendChild(categoryItem);

    // [TR] Ürün açıklamasını göstermek için bir p etiketi oluşturur
    // [EN] Creates a p tag to show the product description
    const productDescription = document.createElement("p");
    productDescription.classList.add("product-description");
    categoryItem.appendChild(productDescription);

    // [TR] Ürün fiyatını göstermek için bir p etiketi oluşturur
    // [EN] Creates a p tag to show the product price
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    categoryItem.appendChild(productPrice);

    return categoryItem;
  } else {
    // [TR] Kategori
    // [EN] Category
    categoryItem.classList.add("category-item");
    const subCategoryList = document.createElement("ul");
    categoryItem.appendChild(subCategoryList);

    // [TR] Alt Kategori ekleme butonu
    // [EN] Add subcategory button
    createButton(
      "Ürün Ekle",
      function () {
        const subCategoryInput = prompt("Ürün Adını Giriniz:");
        if (subCategoryInput) {
          const subCategory = addItem(subCategoryInput, categoryItem);
          highlightItem(subCategory);
        }
      },
      categoryItem
    );

    categoryList.appendChild(categoryItem);

    return categoryItem;
  }
}

// [TR] Belirtilen öğeye ait butonları oluşturur ve döndürür
// [EN] Creates and returns the buttons associated with the specified item
function createButtons(item) {
  const buttonsSpan = document.createElement("span");
  buttonsSpan.classList.add("category-buttons");

  // [TR] Düzenleme butonu
  // [EN] Edit button
  createButton(
    "Dzn",
    function () {
      // [TR] Ürün düzenleme
      // [EN] Edit product
      if (item.classList.contains("product-item")) {
        const productName = item.querySelector(".category-title");
        const newProductName = prompt(
          "Ürün adını giriniz, değiştirmek istemiyorsanız Tamam'a tıklayarak devam edebilirsiniz.",
          productName.textContent
        );
        if (newProductName) {
          productName.textContent = newProductName;
          highlightItem(item);
        }

        // [TR] Ürün açıklaması düzenleme
        // [EN] Edit product description
        const productDescription = item.querySelector(".product-description");
        const newProductDescription = prompt(
          "Ürün açıklamasını giriniz, değiştirmek istemiyorsanız Tamam'a tıklayarak devam edebilirsiniz.",
          productDescription.textContent
        );
        if (newProductDescription) {
          productDescription.textContent = newProductDescription;
          highlightItem(item);
        }

        // [TR] Ürün fiyatı düzenleme
        // [EN] Edit product price
        const productPrice = item.querySelector(".product-price");
        const newProductPrice = prompt(
          "Ürün fiyatını giriniz, değiştirmek istemiyorsanız Tamam'a tıklayarak devam edebilirsiniz.",
          productPrice.textContent.slice(0, -1)
        );
        if (newProductPrice) {
          productPrice.textContent = newProductPrice + "₺";
          highlightItem(item);
        }

        return;
      }

      const categoryTitle = item.querySelector(".category-title");
      const newCategoryName = prompt(
        "Kategori adını giriniz, değiştirmek istemiyorsanız Tamam'a tıklayarak devam edebilirsiniz.",
        categoryTitle.textContent
      );
      if (newCategoryName) {
        categoryTitle.textContent = newCategoryName;
        highlightItem(item);
      }
    },
    buttonsSpan
  );

  // [TR] Silme butonu
  // [EN] Delete button
  createButton(
    "Sil",
    function () {
      highlightItem(item, "#ff5a5a");
      setTimeout(() => {
        // [TR] Onaylama işlemi
        // [EN] Confirmation process
        const categoryName = item.children[0].children[0].textContent;
        if (
          confirm(
            "Are you sure you want to delete the '" + categoryName + "' ?"
          )
        ) {
          item.remove();
        }
      }, 500);
    },
    buttonsSpan
  );

  // [TR] Yukarı kaydırma butonu
  // [EN] Scroll up button
  createButton(
    "▲",
    function () {
      const prevItem = item.previousElementSibling;
      if (prevItem) {
        highlightItem(item);
        item.parentNode.insertBefore(item, prevItem);
        item.scrollIntoView({ behavior: "smooth" });
      }
    },
    buttonsSpan
  );

  // [TR] Aşağı kaydırma butonu
  // [EN] Scroll down button
  createButton(
    "▼",
    function () {
      const nextItem = item.nextElementSibling;
      if (nextItem) {
        highlightItem(item);
        item.parentNode.insertBefore(nextItem, item);
        item.scrollIntoView({ behavior: "smooth" });
      }
    },
    buttonsSpan
  );

  return buttonsSpan;
}

// [TR] Belirtilen metin, tıklama işlevi ve ebeveyn öğeyi kullanarak bir buton oluşturur
// [EN] Creates a button using the specified text, click function, and parent element
function createButton(text, onClick, parentElement) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  parentElement.appendChild(button);
}

// [TR] Değişiklik yapılan öğeleri belirli süre boyunca aydınlatır.
// [EN] Highlights the items that have been modified for a certain period of time.
function highlightItem(item, color = "#56ff56") {
  item.style.setProperty("--highlight-color", color);
  item.classList.add("highlight");
  setTimeout(function () {
    item.classList.remove("highlight");
  }, 3000);
}

// [TR] Listeyi dize olarak döndürür
// [EN] Returns the list as a string
function getListAsArray() {
  const categoryList = document.querySelector(".category-list");
  const categoryItems = Array.from(
    categoryList.querySelectorAll(".category-item")
  );
  const data = categoryItems.map((categoryItem) => {
    const categoryTitle =
      categoryItem.querySelector(".category-title").textContent;
    const productItems = Array.from(
      categoryItem.querySelectorAll(".product-item")
    );
    const products = productItems.map((productItem) => {
      const productTitle =
        productItem.querySelector(".category-title").textContent;
      const productDescription = productItem.querySelector(
        ".product-description"
      ).textContent;
      const productPrice =
        productItem.querySelector(".product-price").textContent;

      return {
        title: productTitle,
        description: productDescription,
        price: productPrice,
      };
    });

    const categoryData = {
      [categoryTitle]: products,
    };

    return categoryData;
  });

  return data;
}

/* ------------------------------------- */
/* ------------------------------------- */
/* ------------ DEBUG CODES ------------ */
/* ------------------------------------- */
/* ------------------------------------- */

function testFunction() {
  // [TR] 2 adet Kategori ve her birine 3 adet Alt Kategori eklemek için for döngüsü kullanılır
  // [EN] Use a for loop to add 2 categories and 3 subcategories to each category
  for (let i = 0; i < 2; i++) {
    const category = addItem("Category " + (i + 1));
    for (let j = 0; j < 3; j++) {
      addItem("Subcategory " + (j + 1), category);
    }
  }
}
//testFunction();
