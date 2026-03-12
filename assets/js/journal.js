(function () {
  var MANIFEST_PATH = "/manifest.json";
  var entryCache = null;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatDate(value) {
    return new Date(value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function card(entry) {
    return ""
      + '<article class="journal-card">'
      + '<p class="journal-meta">' + formatDate(entry.date) + " · Week " + escapeHtml(entry.week) + "</p>"
      + '<h3><a href="/journal/entry/?slug=' + encodeURIComponent(entry.slug) + '">' + escapeHtml(entry.title) + "</a></h3>"
      + "<p>" + escapeHtml(entry.summary) + "</p>"
      + "</article>";
  }

  function markdownToHtml(markdown) {
    var lines = markdown.split("\n");
    var html = [];
    var inList = false;
    var paragraph = [];

    function flushParagraph() {
      if (paragraph.length) {
        html.push("<p>" + paragraph.join(" ") + "</p>");
        paragraph = [];
      }
    }

    function closeList() {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    }

    lines.forEach(function (raw) {
      var line = raw.trim();

      if (!line) {
        flushParagraph();
        closeList();
        return;
      }

      if (line.startsWith("## ")) {
        flushParagraph();
        closeList();
        html.push("<h2>" + escapeHtml(line.slice(3)) + "</h2>");
        return;
      }

      if (line.startsWith("### ")) {
        flushParagraph();
        closeList();
        html.push("<h3>" + escapeHtml(line.slice(4)) + "</h3>");
        return;
      }

      if (line.startsWith("- ")) {
        flushParagraph();
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push("<li>" + escapeHtml(line.slice(2)) + "</li>");
        return;
      }

      closeList();
      paragraph.push(escapeHtml(line));
    });

    flushParagraph();
    closeList();

    return html.join("\n");
  }

  async function loadEntries() {
    if (entryCache) {
      return entryCache;
    }

    var response = await fetch(MANIFEST_PATH);
    if (!response.ok) {
      throw new Error("Unable to load journal manifest");
    }

    var entries = await response.json();
    entryCache = entries.sort(function (a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return entryCache;
  }

  function renderError(root, message) {
    root.innerHTML = "<p class=\"journal-note\">" + escapeHtml(message) + "</p>";
  }

  window.renderJournalPreview = async function renderJournalPreview(limit) {
    var root = document.getElementById("journal-preview-list");
    if (!root) return;

    try {
      var entries = await loadEntries();
      root.innerHTML = entries.slice(0, limit || 2).map(card).join("\n");
    } catch (error) {
      renderError(root, "Journal preview failed to load.");
    }
  };

  window.renderJournalList = async function renderJournalList() {
    var root = document.getElementById("journal-list");
    if (!root) return;

    try {
      var entries = await loadEntries();
      root.innerHTML = entries.map(card).join("\n");
    } catch (error) {
      renderError(root, "Journal entries failed to load.");
    }
  };

  window.renderJournalEntry = async function renderJournalEntry() {
    var root = document.getElementById("journal-entry-content");
    if (!root) return;

    try {
      var entries = await loadEntries();
      var params = new URLSearchParams(window.location.search);
      var slug = params.get("slug");
      var entry = entries.find(function (item) {
        return item.slug === slug;
      });

      if (!entry) {
        root.innerHTML = "<article class=\"journal-entry container\"><h1>Entry not found</h1><p><a class=\"btn btn-secondary\" href=\"/journal/\">Back to all entries</a></p></article>";
        return;
      }

      var markdownResponse = await fetch(entry.file);
      if (!markdownResponse.ok) {
        throw new Error("Unable to load markdown file");
      }

      var markdown = await markdownResponse.text();
      var bodyHtml = markdownToHtml(markdown);

      document.title = entry.title + " | Sean Heffernan";
      root.innerHTML = ""
        + '<article class="journal-entry container">'
        + '<p class="journal-meta">' + formatDate(entry.date) + " · Week " + escapeHtml(entry.week) + "</p>"
        + "<h1>" + escapeHtml(entry.title) + "</h1>"
        + bodyHtml
        + '<p><a class="btn btn-secondary" href="/journal/">Back to all entries</a></p>'
        + "</article>";
    } catch (error) {
      root.innerHTML = "<article class=\"journal-entry container\"><h1>Unable to load entry</h1><p class=\"journal-note\">Run from a local server (for example: python3 -m http.server 8000).</p><p><a class=\"btn btn-secondary\" href=\"/journal/\">Back to all entries</a></p></article>";
    }
  };
})();
