/* ==========================================================================
   ExtraSheet — script.js
   Loads data/papers.json, handles the search form, and renders results.
   ========================================================================== */

(function () {
  "use strict";

  const DATA_URL = "https://yogeshkumarai.github.io/extrasheet-papers/Public/data/papers.json";

  const form = document.getElementById("search-form");
  const resultArea = document.getElementById("result-area");
  const boardSelect = document.getElementById("board");
  const subjectSelect = document.getElementById("subject");
  const yearSelect = document.getElementById("year");
  const typeSelect = document.getElementById("type");

  let papersCache = null;

  /**
   * Fetch and cache the papers dataset.
   * @returns {Promise<Array<Object>>}
   */
  async function loadPapers() {
    if (papersCache) return papersCache;

    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error("Unable to load papers.json (" + response.status + ")");
    }
    papersCache = await response.json();
    return papersCache;
  }

  /**
   * Normalize a string for comparison: trim, lowercase, collapse whitespace.
   * @param {*} value
   * @returns {string}
   */
  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /**
   * Check if two subject strings should be considered a match.
   * Handles cases like JSON "Mathematics" vs dropdown "Mathematics Basic"
   * (and vice versa) by checking containment in either direction.
   * @param {string} paperSubject
   * @param {string} criteriaSubject
   * @returns {boolean}
   */
  function subjectMatches(paperSubject, criteriaSubject) {
    const a = normalize(paperSubject);
    const b = normalize(criteriaSubject);
    if (!a || !b) return false;
    return a === b || a.includes(b) || b.includes(a);
  }

  /**
   * Find ALL papers matching the given search criteria.
   * @param {Array<Object>} papers
   * @param {Object} criteria
   * @returns {Array<Object>}
   */
  function findPaper(papers, criteria) {
    return papers.filter(function (paper) {
      const boardOk = normalize(paper.board) === normalize(criteria.board);
      const subjectOk = subjectMatches(paper.subject, criteria.subject);
      const yearOk = String(paper.year || "").trim() === String(criteria.year || "").trim();

      // Type is intentionally NOT filtered — JSON structure already handles it.
      return boardOk && subjectOk && yearOk;
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Render the "no results" message.
   */
  function renderEmptyState() {
    resultArea.innerHTML =
      '<div class="result-empty" role="status">No paper found for the selected criteria.</div>';
  }

  /**
   * Render a generic loading/error message.
   * @param {string} message
   */
  function renderMessage(message) {
    resultArea.innerHTML =
      '<div class="result-empty" role="status">' + escapeHtml(message) + "</div>";
  }

  /**
   * Render result cards for ALL matching papers.
   * @param {Array<Object>} papers
   */
  function renderResultCard(papers) {
    let html = "";

    papers.forEach(function (paper) {
      const pdfUrl = escapeHtml(paper.pdf);
      const titlePart = paper.title ? " - " + escapeHtml(paper.title) : "";

      html +=
        '<div class="result-card">' +

        '  <div class="result-head">' +
        '    <h2 class="result-title">' +
        escapeHtml(paper.subject) +
        " — " +
        escapeHtml(paper.year) +
        titlePart +
        "</h2>" +
        '    <span class="status-stamp"><span class="dot"></span>Available</span>' +
        "  </div>" +

        '  <div class="result-grid">' +

        '    <div class="result-item">' +
        '      <div class="k">Board</div>' +
        '      <div class="v">' + escapeHtml(paper.board) + "</div>" +
        "    </div>" +

        '    <div class="result-item">' +
        '      <div class="k">Class</div>' +
        '      <div class="v">' + escapeHtml(paper.class) + "</div>" +
        "    </div>" +

        '    <div class="result-item">' +
        '      <div class="k">Subject</div>' +
        '      <div class="v">' + escapeHtml(paper.subject) + "</div>" +
        "    </div>" +

        '    <div class="result-item">' +
        '      <div class="k">Year</div>' +
        '      <div class="v">' + escapeHtml(paper.year) + "</div>" +
        "    </div>" +

        "  </div>" +

        '  <div class="result-actions">' +
        '    <a class="btn btn-solid" href="' + pdfUrl + '" target="_blank">Read PDF</a>' +
        '    <a class="btn btn-outline" href="' + pdfUrl + '" download>Download PDF</a>' +
        "  </div>" +

        "</div>";
    });

    resultArea.innerHTML = html;
  }

  /**
   * Handle the search form submission.
   * @param {SubmitEvent} event
   */
  async function handleSearch(event) {
    event.preventDefault();

    const criteria = {
      board: boardSelect.value,
      subject: subjectSelect.value,
      year: yearSelect.value,
      type: typeSelect.value,
    };

    if (!criteria.board || !criteria.subject || !criteria.year) {
      renderMessage("Please select a board, subject and year to search.");
      return;
    }

    renderMessage("Searching…");

    try {
      const papers = await loadPapers();
      const matches = findPaper(papers, criteria);

      if (matches.length > 0) {
        renderResultCard(matches);
      } else {
        renderEmptyState();
      }
    } catch (error) {
      renderMessage("Something went wrong while loading papers. Please try again.");
      console.error(error);
    }
  }

  function init() {
    form.addEventListener("submit", handleSearch);
  }

  document.addEventListener("DOMContentLoaded", init);
})();