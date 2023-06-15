// Stil dosyasını eklemek için yeni bir <link> elementi oluştur
var linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "./theme/style.css";

// <head> elementine stil dosyasını ekle
document.head.appendChild(linkElement);

// <header> elementini oluştur
var headerElement = document.createElement("header");
headerElement.innerHTML = `
<nav>
    <a href="./index.html"><h1>TheHBK QR Menü</h1></a>
    <span class="menu-icon">&#9776;</span>
    <div class="menu-middle">
        <a href="#">Ana Sayfa</a>
        <a href="#">Ana Sayfa</a>
        <a href="#">Ana Sayfa</a>
    </div>
    <div class="user">
        <p>Kullanıcı Adı</p>
        <div class="submenu">
            <a href="#">Çıkış Yap</a>
        </div>
    </div>
</nav>

<div class="menu-overlay">
    <a href="./index.html">Ana Sayfa</a>
    <a href="./profile.html">Profil</a>
    <a href="#">Ana Sayfa</a>
    <a href="#">Ana Sayfa</a>

    <button class="signout-button">Çıkış Yap</button>
</div>



`;
// <header> elementini <body> elementinin en başına ekle
document.body.insertBefore(headerElement, document.body.firstChild);

// menu-icon elementi tıklandığında menu-overlay elementinin görünürlüğünü değiştir
document.querySelector(".menu-icon").addEventListener("click", function () {
  document.querySelector(".menu-overlay").style.display = "flex";
});

// menu-overlay elementi tıklandığında menu-overlay elementinin görünürlüğünü değiştir
document.querySelector(".menu-overlay").addEventListener("click", function () {
  this.style.display = "none";
});

// add footer
var footerElement = document.createElement("footer");
footerElement.innerHTML = `
<div class="footer">
    <p>© TheHBK QR Menü | Nişantaşı Final Projesi</p>
</div>
`;
document.body.appendChild(footerElement);

// sign out button
document
  .querySelector(".signout-button")
  .addEventListener("click", function () {
    signOut();
  });

// [TR] Buton için animasyon ekle
// [EN] Add animation for button
function buttonStatus(button, state = "active") {
  const timeout = 1500;
  button.classList.remove("error");
  button.classList.remove("active");
  switch (state) {
    case "active":
      button.classList.add("active");
      button.innerHTML = "Kaydediliyor...";
      break;
    case "success":
      button.classList.add("success");
      button.innerHTML = "Kaydedildi";
      setTimeout(() => {
        button.classList.remove("success");
        button.innerHTML = "Kaydet";
      }, timeout);
      break;
    default:
      button.classList.add("error");
      button.innerHTML = state;
      setTimeout(() => {
        button.classList.remove("error");
        button.innerHTML = "Kaydet";
      }, timeout);
      break;
  }
}
