//Product Slider
const productSlider = tns({
  container: ".products",
  slideBy: 1,
  speed: 1000,
  nav: true,
  navPosition: "bottom",
  autoPlay: true,
  autoPlayTimeout: 7000,
  autoPlayButtonOutput: false,
  controlsContainer: "#controlProduct",
  prevButton: ".prev",
  nextButton: ".nxt",
  onInit: function (info) {
    const navButtons = document.querySelectorAll(".tns-nav button");
    const activeButton = navButtons[0];
    activeButton.style.border = "1px solid #005ca2";

    navButtons.forEach((button, index) => {
      button.addEventListener("click", function () {
        navButtons.forEach((btn) => (btn.style.border = ""));
        this.style.border = "1px solid #005ca2";
      });
    });
  },
});

//Client Slider
const clientSlider = tns({
  container: ".slider",
  slideBy: 1,
  speed: 700,
  nav: false,
  navPosition: "bottom",
  autoPlay: true,
  autoPlayTimeout: 7000,
  autoPlayButtonOutput: false,
  controlsContainer: "#controls",
  prevButton: ".previous",
  nextButton: ".next",
});
