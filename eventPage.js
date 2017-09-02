function show(request, sender, sendResponse) {
  if(!sender.tab) {
    return;
  }

  const tabId = sender.tab.id;
  chrome.pageAction.show(tabId);

  const oneDay = 3600*24*1000;
  const diff = request.oriUpdateTime - request.curUpdateTime;
  if(diff <= 0) { // up to date
    chrome.pageAction.setIcon({tabId: tabId, path: 'icons/emoji_u1f600.png'});
  } else if(diff < oneDay*45) { // warning
    chrome.pageAction.setIcon({tabId: tabId, path: 'icons/emoji_u26a0.png'});
  } else { // dangerous
    chrome.pageAction.setIcon({tabId: tabId, path: 'icons/emoji_u2620.png'});
  }
}

chrome.runtime.onMessage.addListener(show);