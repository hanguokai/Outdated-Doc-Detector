// global data object
var pageData = null;

async function init() {
  const analyzer = Analyzer.initAnalyzer();
  if(analyzer.isEn()) {
    return
  }

  const curUpdateTime = await analyzer.findCurrentPageLastModified();
  if(!curUpdateTime) {
    return
  }

  const oriUpdateTime = await analyzer.findEnPageLastModified();
  if(!oriUpdateTime) {
    return
  }

  // console.log("curUpdateTime: " + curUpdateTime);
  // console.log("oriUpdateTime: " + oriUpdateTime);

  pageData = {
    oriUpdateTime: oriUpdateTime.getTime(),
    curUpdateTime: curUpdateTime.getTime(),
    enURL: analyzer.getEnPageUrl(),
    curURL: document.location.href
  }

  const data = {
    oriUpdateTime: oriUpdateTime.getTime(),
    curUpdateTime: curUpdateTime.getTime()
  }
  // send to event page to show icon.
  chrome.runtime.sendMessage(data);

  // show warning banner
  chrome.storage.sync.get({
    showBanner: true // default true
  }, function(items) {
    if(items.showBanner) {
      showBanner();
    }
  });
}

/**
 * Show warning banner in the page.
 * This is the same logic with popup.js
 */
var banner;
function showBanner() {
  const diff = pageData.oriUpdateTime - pageData.curUpdateTime;
  if(diff <= 60*30*1000) { // up to date or less than 30min
    return;
  }

  if(!banner || !document.body.contains(banner)) {
    banner = document.createElement('div');
    banner.style.cssText = "position:fixed; width: 314px; margin-left: -157px; top: 12%; left: 50%; color: blue; border: 2px solid red; background-color: yellow; z-index: 1000000; font-size: 12px; padding: 3px;";
    // note element
    const note = document.createElement('span');
    banner.appendChild(note);
    // close element
    const close = document.createElement('span');
    close.innerText = "[X]";
    close.title = "close";
    close.style.cssText = "cursor: pointer;";
    close.onclick = function(){
      banner.remove();
      banner = null;
    };
    banner.appendChild(close);
    document.body.appendChild(banner);
  }

  // update
  const oneDay = 3600*24*1000;
  const noteString = chrome.i18n.getMessage("note");
  if(diff >= oneDay) { // behind more than 1 days
    const days = Math.trunc(diff/oneDay);
    banner.firstElementChild.innerHTML = noteString + chrome.i18n.getMessage("behindDays", [days, pageData.enURL]);
  } else if(diff > 0) { // behind less than 1 day
    banner.firstElementChild.innerHTML = noteString + chrome.i18n.getMessage("behindLessThanOneDay", [pageData.enURL]);
  }
}

// reponse popup to get page info.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(sender.tab) {
      return;
    }
    sendResponse(pageData);
  }
);

function watchUrlChanged() {
  let metaURL = document.head.querySelector("meta[property='og:url']");
  if(metaURL) {
    let config = { childList: true };
    let observer = new MutationObserver((list, observer) => {
      for(const mutation of list) {
        for(const node of mutation.addedNodes) {
          if(node.getAttribute('property') === "og:url") {
            console.log('url changed')
            if(banner) {
              banner.remove();
              banner = null;
              chrome.runtime.sendMessage({reset: true});
            }
            init();
            return;
          }
        }
      }
    });
    observer.observe(document.head, config);
  }
}

init();
watchUrlChanged();
