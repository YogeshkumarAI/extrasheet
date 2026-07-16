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
   * Find a paper matching the given search criteria.
   * @param {Array<Object>} papers
   * @param {Object} criteria
   * @returns {Object|undefined}
   */
  function findPaper(papers, criteria) {
    return papers.find(function (paper) {
      return (
        normalize(paper.board) === normalize(criteria.board) &&
        normalize(paper.subject) === normalize(criteria.subject) &&
        String(paper.year) === String(criteria.year) &&
        normalize(paper.type) === normalize(criteria.type)
      );
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
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
   * Render the result card for a found paper.
   * @param {Object} paper
   */
  function renderResultCard(paper) {
    const pdfUrl = escapeHtml(paper.pdf);

    resultArea.innerHTML =
      '<div class="result-card">' +
      '  <div class="result-head">' +
      '    <h2 class="result-title">' + escapeHtml(paper.subject) + " — " + escapeHtml(paper.year) + "</h2>" +
      '    <span class="status-stamp"><span class="dot" aria-hidden="true"></span>Available</span>' +
      "  </div>" +
      '  <div class="result-grid">' +
      '    <div class="result-item"><div class="k">Board</div><div class="v">' + escapeHtml(paper.board) + "</div></div>" +
      '    <div class="result-item"><div class="k">Class</div><div class="v">Class 10</div></div>' +
      '    <div class="result-item"><div class="k">Subject</div><div class="v">' + escapeHtml(paper.subject) + "</div></div>" +
      '    <div class="result-item"><div class="k">Year</div><div class="v">' + escapeHtml(paper.year) + "</div></div>" +
      "  </div>" +
      '  <div class="result-actions">' +
      '    <a class="btn btn-solid" href="' + pdfUrl + '" target="_blank" rel="noopener noreferrer">Read PDF</a>' +
      '    <a class="btn btn-outline" href="' + pdfUrl + '" download>Download PDF</a>' +
      "  </div>" +
      "</div>";
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
      const match = findPaper(papers, criteria);

      if (match) {
        renderResultCard(match);
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
