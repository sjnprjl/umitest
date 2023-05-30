export class Loader {
  constructor() {
    this.backdrop = document.createElement("div");
    this.backdrop.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "z-50",
      "flex",
      "justify-center",
      "items-center",
      "bg-gray-900",
      "bg-opacity-50"
    );
    //border top color and border bottom color and spin
    this.backdrop.innerHTML = `
    <div class="w-16 h-16 border-4 border-t-ui-primary border-b-ui-light rounded-full animate-spin"></div>
        `;
  }
  //show loader
  show() {
    document.body.appendChild(this.backdrop);
  }

  //hide loader
  hide() {
    this.backdrop.remove();
  }
}
