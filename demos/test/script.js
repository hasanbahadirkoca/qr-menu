const categoryList = document.querySelector(".category-list");
const addCategoryButton = document.querySelector(".add-category-button");

// [TR] Kategori ekleme butonuna tıklandığında prompt ile kullanıcıdan kategori adı alınır
// [EN] When the add category button is clicked, prompt the user to enter a category name
addCategoryButton.addEventListener("click", function () {
  const categoryInput = prompt("Enter a category name");
  if (categoryInput) {
    const newCategory = addCategory(categoryInput);
    highlightItem(newCategory);
  }
});

// [TR] Belirtilen kategori adını ve ebeveyn kategoriyi kullanarak bir kategori ekler
// [EN] Adds a category using the specified category name and parent category
function addCategory(categoryName, parentCategory) {
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
    categoryItem.classList.add("subcategory-item");
    parentCategory.querySelector("ul").appendChild(categoryItem);
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
      "Add Subcategory",
      function () {
        const subCategoryInput = prompt("Enter a subcategory name");
        if (subCategoryInput) {
          const subCategory = addCategory(subCategoryInput, categoryItem);
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
    "Edit",
    function () {

      // [TR] Subcategory'ler farklı sayfaya yönlendirilir
      // [EN] Subcategories are redirected to a different page
      if (item.classList.contains("subcategory-item")) {
        alert("Subcategories are redirected to a different page");
        return;
      }

      const categoryTitle = item.querySelector(".category-title");
      const newCategoryName = prompt("Enter a new category name", categoryTitle.textContent);
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
    "Del",
    function () {
      highlightItem(item, "#ff5a5a");
      setTimeout(() => {
        // [TR] Onaylama işlemi
        // [EN] Confirmation process
        const categoryName = item.children[0].children[0].textContent
        if (confirm("Are you sure you want to delete the '" + categoryName + "' ?")) {
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

/* ------------------------------------- */
/* ------------------------------------- */
/* ------------ DEBUG CODES ------------ */
/* ------------------------------------- */
/* ------------------------------------- */

function testFunction() {
  // [TR] 2 adet Kategori ve her birine 3 adet Alt Kategori eklemek için for döngüsü kullanılır
  // [EN] Use a for loop to add 2 categories and 3 subcategories to each category
  for (let i = 0; i < 2; i++) {
    const category = addCategory("Category " + (i + 1));
    for (let j = 0; j < 3; j++) {
      addCategory("Subcategory " + (j + 1), category);
    }
  }
}
testFunction();
