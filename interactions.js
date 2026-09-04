(function () {
  var body = document.body;
  var topbar = document.querySelector(".site-topbar");
  var interactiveItems = document.querySelectorAll(".site-animated .button, .site-animated .site-nav a, .site-animated .brand");

  interactiveItems.forEach(function (item) {
    item.addEventListener("pointermove", function (event) {
      var rect = item.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * 100;
      var y = ((event.clientY - rect.top) / rect.height) * 100;

      item.style.setProperty("--mx", x + "%");
      item.style.setProperty("--my", y + "%");
    });

    item.addEventListener("pointerleave", function () {
      item.style.removeProperty("--mx");
      item.style.removeProperty("--my");
    });
  });

  if (body && topbar) {
    var ticking = false;

    var syncTopbarState = function () {
      body.classList.toggle("is-scrolled", window.scrollY > 32);
      ticking = false;
    };

    var requestTopbarSync = function () {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(syncTopbarState);
    };

    window.addEventListener("scroll", requestTopbarSync, { passive: true });
    window.addEventListener("resize", requestTopbarSync);
    syncTopbarState();
  }

  var activityShortcut = document.querySelector(".activity-shortcut");

  if (activityShortcut) {
    var shortcutToggle = activityShortcut.querySelector(".activity-shortcut-toggle");
    var shortcutLinks = activityShortcut.querySelectorAll(".activity-shortcut-panel a");
    var closeTimer = null;

    var setShortcutOpen = function (open) {
      activityShortcut.classList.toggle("is-open", open);

      if (shortcutToggle) {
        shortcutToggle.setAttribute("aria-expanded", open ? "true" : "false");
      }
    };

    var openShortcut = function () {
      window.clearTimeout(closeTimer);
      setShortcutOpen(true);
    };

    var closeShortcut = function () {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        setShortcutOpen(false);
      }, 180);
    };

    activityShortcut.addEventListener("pointerenter", openShortcut);
    activityShortcut.addEventListener("pointerleave", closeShortcut);
    activityShortcut.addEventListener("focusin", openShortcut);
    activityShortcut.addEventListener("focusout", function (event) {
      if (!activityShortcut.contains(event.relatedTarget)) {
        closeShortcut();
      }
    });

    if (shortcutToggle) {
      shortcutToggle.addEventListener("click", function () {
        window.clearTimeout(closeTimer);
        setShortcutOpen(!activityShortcut.classList.contains("is-open"));
      });
    }

    shortcutLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setShortcutOpen(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (!activityShortcut.contains(event.target)) {
        setShortcutOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setShortcutOpen(false);
      }
    });
  }
})();
