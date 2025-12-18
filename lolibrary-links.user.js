// ==UserScript==
// @name         lolibrary Links
// @namespace    https://github.com/MarvNC
// @version      1.0.2
// @description  Add Anna's Archive links to lolibrary.moe
// @author       MarvNC
// @match        https://lolibrary.moe/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

const WAIT_MS = 50;

/**
 * @param {string} hash
 */
const getAnnasArchiveUrl = (hash) => `https://annas-archive.org/md5/${hash}`;

/**
 * @param {string} query
 */
const getNyaaSearchUrl = (query) =>
  `https://nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(query)}`;

const ALPINDALE_URL = "https://cache.animetosho.org/nyaasi/view/2035929";
const PEEPO_URL = getNyaaSearchUrl("PeepoHappyBooks 2");

/**
 * @param {MouseEvent} event
 */
function handleAnnasArchiveClick(event) {
  const div = /** @type {HTMLDivElement} */ (event.currentTarget);
  const hash = div.dataset.uniqueId;
  if (hash) {
    window.open(getAnnasArchiveUrl(hash), "_blank");
  }
}

function addLinks() {
  /** @type{NodeListOf<HTMLDivElement>} */ (
    document.querySelectorAll("div[data-unique-id]")
  ).forEach((div) => {
    if (div.onclick) return;

    const sourceSpan = div.querySelector('span[class*="source"]');
    if (!sourceSpan) return;
    const sourceText = sourceSpan.textContent || "";

    if (sourceText.includes("Anna's Archive")) {
      div.style.cursor = "pointer";
      div.onclick = handleAnnasArchiveClick;
    } else if (sourceText.includes("TMW eBook Collection Pt.")) {
      const match = sourceText.match(/TMW eBook Collection Pt\. (\d+)/);
      if (match) {
        div.style.cursor = "pointer";
        div.onclick = () =>
          window.open(
            getNyaaSearchUrl(`TMW eBook Collection Pt. ${match[1]}`),
            "_blank"
          );
      }
    } else if (sourceText.includes("Alpindale's Collection v2")) {
      div.style.cursor = "pointer";
      div.onclick = () => window.open(ALPINDALE_URL, "_blank");
    } else if (sourceText.includes("PeepoHappyBooks 2")) {
      div.style.cursor = "pointer";
      div.onclick = () => window.open(PEEPO_URL, "_blank");
    }
  });
}

const getMainPage = () =>
  /** @type{HTMLElement | null} */ (
    document.querySelector('main[class^="page_wrapper"]')
  );

/**
 * @param {HTMLElement} mainPage
 */
function observeMainPage(mainPage) {
  new MutationObserver(() => {
    addLinks();
  }).observe(mainPage, {
    childList: true,
    subtree: true,
  });
}

(async function () {
  while (true) {
    const mainPage = getMainPage();
    if (mainPage) {
      console.log("Page loaded");
      observeMainPage(mainPage);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
  }
})();
