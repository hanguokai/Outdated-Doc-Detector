function show(request, sender, sendResponse) {
  if(!sender.tab) {
    return;
  }

  const tabId = sender.tab.id;
  chrome.action.enable(tabId);

  if(request.reset) {
    chrome.action.setIcon({tabId: tabId, path: 'oudated-128.png'});
    return;
  }

  const oneDay = 3600*24*1000;
  const diff = request.oriUpdateTime - request.curUpdateTime;
  if(diff <= 60*30*1000) { // up to date or less than 30min
    chrome.action.setIcon({tabId: tabId, path: 'icons/emoji_u1f600.png'});
  } else if(diff < oneDay*45) { // warning
    chrome.action.setIcon({tabId: tabId, path: 'icons/emoji_u26a0.png'});
  } else { // dangerous
    chrome.action.setIcon({tabId: tabId, path: 'icons/emoji_u2620.png'});
  }
}

function onStartup() {
  chrome.action.disable();
}

chrome.runtime.onInstalled.addListener(onStartup);
chrome.runtime.onStartup.addListener(onStartup);
chrome.runtime.onMessage.addListener(show);