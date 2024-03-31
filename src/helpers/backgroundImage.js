document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".background-image-container");

    console.log("hello");

    if (!container) {
        return;
      }
      
    let defaultScreenWidth = 0;
    adjustContainerHeight();
    window.addEventListener("resize", adjustContainerHeight);

    function adjustContainerHeight() {
        if (window.innerWidth !== defaultScreenWidth) {
          defaultScreenWidth = window.innerWidth;
          container.style.height = window.innerHeight + "px";
        }
      }
});