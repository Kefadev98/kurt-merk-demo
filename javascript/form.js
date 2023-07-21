const firstname = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const interest = document.getElementById("interest");
const message = document.getElementById("message");

const submit = document.getElementsByClassName("contact__form")[0];

submit.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("clicked");

  let ebody = `
      <p>Name: </p>${firstname.value}
      <br>
      <p>Number: </p>${phone.value}
      <br>
      <p>Email: </p>${email.value}
      <br>
      <p>Interest</p>${interest.value}
      <br>
      <p>Message</p>${message.value}
      `;

  Email.send({
    SecureToken: "e5acf7e8-9310-43f3-8868-9e624aad3058",
    To: "stefankovacic4@gmail.com",
    From: "stefankovacic4@gmail.com",
    Subject: "Email from:" + email.value,
    Body: ebody,
  }).then((message) => alert(message));
});
