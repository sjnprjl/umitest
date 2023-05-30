export const toast = (message = "", duration = 3000) => {
  const toastContainer = document.createElement("div");
  //using tailwind css
  toastContainer.classList.add(
    "fixed",
    "top-0",
    "right-0",
    "bg-ui-gray",
    "text-white",
    "rounded",
    "px-4",
    "py-2",
    "m-4",
    "z-50",
    "transition",
    "duration-300",
    "ease-in-out"
  );
  toastContainer.textContent = message;
  document.body.appendChild(toastContainer);
  setTimeout(() => {
    document.body.removeChild(toastContainer);
  }, duration);
};
