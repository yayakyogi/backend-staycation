const buttonOpen = document.getElementById("buttonOpen");
const buttonClose = document.getElementById("buttonClose");
const sidebar = document.getElementById("sidebar");

buttonOpen.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

buttonClose.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// var openModal = document.querySelectorAll(".modal-open");

// for (var i = 0; i < openModal.length; i++) {
//   openModal[i].addEventListener("click", function (event) {
//     event.preventDefault();
//     toggleModal();
//   });
// }

// const overlay = document.querySelector(".modal-overlay");
// overlay.addEventListener("click", toggleModal);

// var closemodal = document.querySelectorAll(".modal-close");
// for (var i = 0; i < closemodal.length; i++) {
//   closemodal[i].addEventListener("click", toggleModal);
// }

// function toggleModal() {
//   const body = document.querySelector("body");
//   const modal = document.querySelector(".modal");
//   modal.classList.toggle("opacity-0");
//   modal.classList.toggle("pointer-events-none");
//   body.classList.toggle("modal-active");
// }
