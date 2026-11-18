(() => {
  "use strict";

  /* ---------- Toast + copy to clipboard ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("on"), 1800);
  }

  function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(area);
    return ok;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return legacyCopy(text);
    }
  }

  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const text = el.dataset.copy;
      const ok = await copyText(text);
      showToast(ok ? `Copied ${text}` : `Couldn’t copy. Name: ${text}`);
    });
  });

  /* ---------- Dropdown groups ---------- */
  document.querySelectorAll(".dd-head").forEach((head) => {
    const group = head.parentNode;
    let timer;

    head.addEventListener("click", () => {
      const open = !group.classList.contains("open");
      clearTimeout(timer);
      group.classList.toggle("open", open);
      head.setAttribute("aria-expanded", open);

      if (open) {
        // allow hover-scaled bars to overflow once the open animation is done
        timer = setTimeout(() => group.classList.add("ovf"), 420);
      } else {
        group.classList.remove("ovf");
      }
    });
  });

  /* ---------- View counter ---------- */
  const viewsBox = document.getElementById("views");
  const viewCount = document.getElementById("view-count");
  const navEntry = performance.getEntriesByType?.("navigation")[0];
  const action = navEntry && navEntry.type !== "navigate" ? "get" : "hit"; // don't count reloads

  // Hover tooltips don't exist on touch screens, so tapping shows the same info
  viewsBox.addEventListener("click", () => {
    showToast(`Total visits: ${viewCount.textContent}`);
  });

  fetch(`https://countapi.mileshilliard.com/api/v1/${action}/ayegh-hatsauce-introduction-views`)
    .then((res) => res.json())
    .then((data) => {
      const value = parseInt(data.value, 10);
      if (!Number.isNaN(value)) {
        viewCount.textContent = value.toLocaleString();
        viewsBox.hidden = false;
      }
    })
    .catch(() => { /* counter is optional */ });
})();
