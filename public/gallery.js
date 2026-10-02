// Moved out of an inline onerror="" attribute so the /drawings gallery
// works under a strict Content-Security-Policy (no 'unsafe-inline' for
// script-src). Removes the whole <li> for a drawing whose image failed to
// load, same behavior as before.
(() => {
  document.querySelectorAll(".gallery img").forEach((img) => {
    img.addEventListener("error", () => {
      img.closest("li")?.remove();
    });
  });
})();
