window.onload = function () {
  render();
};

let render = () => {
  // [TR] reCAPTCHA için bir instance oluştur
  // [EN] Create an instance for reCAPTCHA
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container"
  );
  recaptchaVerifier.render();
};

let sendnumber = () => {
  // [TR] Telefon numarasını al
  // [EN] Get the phone number
  let number1 = document.getElementById("num").value;
  console.log(number1);

  // [TR] Telefon numarasının uygunluğunu kontrol et
  // [EN] Check the validity of the phone number
  if (!checkPhoneNumber()) {
    return;
  }

  // [TR] Telefon numarası doğrulama kodu ile Firebase'e gönder
  // [EN] Send the phone number with verification code to Firebase
  firebase
    .auth()
    .signInWithPhoneNumber(number1, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      coderesult = confirmationResult;
      console.log(coderesult);
      alert("Doğrulama kodu gönderildi.");

      // [TR] Kayıt bölümünü gizle ve doğrulama bölümünü göster
      // [EN] Hide the register section and show the verification section
      document.getElementById("register").style.display = "none";
      document.getElementById("verify").style.display = "block";
    })
    .catch((error) => {
      alert(error.message);
    });
};

let verifyUser = () => {
  // [TR] Doğrulama kodunu al
  // [EN] Get the verification code
  let code = document.getElementById("verificationcode").value;
  console.log(code);

  // [TR] Doğrulama kodunu Firebase'e gönder ve kullanıcıyı doğrula
  // [EN] Send the verification code to Firebase and verify the user
  coderesult
    .confirm(code)
    .then(function (result) {
      alert("Doğrulama Başarılı");

      // [TR] Doğrulama başarılı olduğunda index.html sayfasına yönlendir
      // [EN] Redirect to index.html when verification is successful
      window.location.href = "index.html";

      let user = result.user;
      console.log(user);
    })
    .catch(function (error) {
      alert(error.message);
    });
};

function formatPhoneNumber() {
  var phoneNumberInput = document.getElementById("num");
  var phoneNumber = phoneNumberInput.value;
  phoneNumber = phoneNumber.replace(/[^+0-9]/g, "");

  // [TR] Telefon numarasının "+90" ile başlayıp başlamadığını kontrol et
  // [EN] Check if the phone number starts with "+90"
  if (!phoneNumber.startsWith("+90")) {
    phoneNumber = "+90" + phoneNumber;
  }

  // [TR] Telefon numarasının toplam karakter sayısını kontrol et
  // [EN] Check the total character count of the phone number
  if (phoneNumber.length > 13) {
    phoneNumber = phoneNumber.slice(0, 13);
  }

  phoneNumberInput.value = phoneNumber;
}

function checkPhoneNumber() {
  var phoneNumberInput = document.getElementById("num");
  var phoneNumber = phoneNumberInput.value;


  // [TR] Telefon numarası girişi boş mu kontrol et
  // [EN] Check if the phone number entry is empty
  if (phoneNumber === "") {
    alert("Lütfen sisteme kayıtlı telefon numaranızı giriniz.");
    return false;
  }

  // [TR] Telefon numarasının "+90" ile başlamalı ve "+901231231212" formatında olmalıdır
  // [EN] Phone number must start with "+90" and be in the format "+901231231212"
  else if (!phoneNumber.startsWith("+90")) {
    alert("Telefon numarası +90 ile başlamalıdır.");
    return false;
  } else if (phoneNumber.length !== 13) {
    alert(
      "Telefon numarası +90 ile başlamalı ve 10 karakterli telefon numarasını içermelidir. (Örn: +905301234567)"
    );
    return false;
  } else {
    return true;
  }
}
