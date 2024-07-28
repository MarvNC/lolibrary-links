// ==UserScript==
// @name        lolibrary Links
// @namespace   https://github.com/MarvNC
// @match       https://lolibrary.moe/*
// @grant       none
// @version     1.0.1
// @author      MarvNC
// @description Add Anna's Archive links to lolibrary.moe
// @run-at      document-end
// ==/UserScript==

const annasArchiveUrl = (hash) => `https://annas-archive.org/md5/${hash}`;

/**
 * @param {MouseEvent} event
 */
function handleDivClick(event) {
  const div = event.currentTarget;
  const hash = div.dataset.uniqueId;
  window.open(annasArchiveUrl(hash), '_blank');
}

function addAnnasArchiveSearches() {
  console.log("Adding Anna's Archive URLs");
  /** @type{HTMLDivElement[]} */ ([
    ...document.querySelectorAll('div[data-unique-id]'),
  ])
    .filter((div) => div.textContent?.includes(`Anna's Archive`))
    .map((div) => {
      // Set the div to be a link
      div.style.cursor = 'pointer';
      div.onclick = handleDivClick;
    });
}

const getMainPage = () =>
  /** @type{HTMLElement | null} */ (
    document.querySelector('main[class^="page_wrapper')
  );

/**
 * @param {HTMLElement} mainPage
 */
function observeMainPage(mainPage) {
  new MutationObserver(() => addAnnasArchiveSearches()).observe(mainPage, {
    childList: true,
    subtree: true,
  });
}

(async function () {
  while (true) {
    const mainPage = getMainPage();
    if (mainPage) {
      console.log('Page loaded');
      observeMainPage(mainPage);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
})();
