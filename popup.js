window.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {from: "popup"}, updatePage);
  });
}, true);

function updatePage(pageData) {
  let $ = function( id ) { return document.getElementById( id ); };
  updateTitle(pageData);
  $('curPageUpdatedTime').innerHTML = chrome.i18n.getMessage("curPageUpdatedTime", 
                [new Date(pageData.curUpdateTime).toLocaleString()]);
  $('enPageUpdatedTime').innerHTML = chrome.i18n.getMessage("enPageUpdatedTime", 
                [new Date(pageData.oriUpdateTime).toLocaleString()]);
}

function updateTitle(pageData) {
  const oneDay = 3600*24*1000;
  const diff = pageData.oriUpdateTime - pageData.curUpdateTime;
  const h2 = document.createElement("h2");
  if(diff >= oneDay) { // behind more than 1 days
    const days = Math.trunc(diff/oneDay);
    h2.innerHTML = chrome.i18n.getMessage("behindDays", [days, pageData.enURL]);
  } else if(diff <= 60*30*1000) { // up to date or less than 30min
    h2.innerText = chrome.i18n.getMessage("isUpToDate");
  } else { // behind less than 1 day
    h2.innerHTML = chrome.i18n.getMessage("behindLessThanOneDay", [pageData.enURL]);
  }
  // insert first
  document.body.insertBefore(h2, document.body.firstChild);
}