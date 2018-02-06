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
function showBanner() {
  const diff = pageData.oriUpdateTime - pageData.curUpdateTime;
  if(diff <= 60*30*1000) { // up to date or less than 30min
    return;
  }

  // container element
  const container = document.createElement('div');
  const oneDay = 3600*24*1000;
  const noteString = chrome.i18n.getMessage("note");
  if(diff >= oneDay) { // behind more than 1 days
    const days = Math.trunc(diff/oneDay);
    container.innerHTML = noteString + chrome.i18n.getMessage("behindDays", [days, pageData.enURL]);
  } else if(diff > 0) { // behind less than 1 day
    container.innerHTML = noteString + chrome.i18n.getMessage("behindLessThanOneDay", [pageData.enURL]);
  }
  container.style.cssText = "position:fixed; width: 314px; margin-left: -157px; top: 12%; left: 50%; color: blue; border: 2px solid red; background-color: yellow; z-index: 1000000; font-size: 12px; padding: 3px;";
  // close element
  const close = document.createElement('span');
  close.innerText = "[X]";
  close.title = "close";
  close.style.cssText = "cursor: pointer;";
  close.onclick = function(){
    close.parentElement.hidden = true;
  };
  container.appendChild(close);
  // add to body
  document.body.appendChild(container);
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

init();
