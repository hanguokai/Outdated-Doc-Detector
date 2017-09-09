function getLang() {
  return document.documentElement.lang;
} 

async function findCurrentPageLastModified() {
  // for android dev site 
  // <meta itemprop="dateModified" content="2017-07-27T14:36:46.324130">
  const meta = document.head.querySelector("meta[itemprop='dateModified'");
  if(meta) {
    return getDateAsUTC(meta.content);
  }

  // for firebase, google-dev, cloud, tensorflow
  // <p itemprop="datePublished" content="2017-08-07T20:49:39.902150">
  // This info maybe not in some pages.
  const p = document.querySelector("p[itemprop='datePublished'");
  if(p) {
    return getDateAsUTC(p.getAttribute("content"));
  }

  return await getHTTPLastModified(document.location.href);
}

function getDateAsUTC(datestr) {
  return new Date(datestr + 'Z')
}

async function findEnPageLastModified() {
  return await getHTTPLastModified(getEnPageUrl());
} 

async function getHTTPLastModified(url) {
  try {
    const option = {
      method: 'HEAD', 
      credentials: 'same-origin'
    }
    const response = await fetch(url, option);
    if(response.ok && response.headers.has("Last-Modified")) {
      // This is GMT timezone
      return new Date(response.headers.get("Last-Modified"));
    } else {
      return null;
    }
  } catch(e) {
    return null;
  }
}

function getEnPageUrl() {
  const params = new URLSearchParams(location.search);
  // set ?hl=en param
  params.set('hl', 'en');
  return `${location.pathname}?${params}`;
}

var pageData = null;

async function init() {
  const lang = getLang();
  if(!lang || lang === "en") {
    return
  }

  const curUpdateTime = await findCurrentPageLastModified();
  if(!curUpdateTime) {
    return
  }

  const oriUpdateTime = await findEnPageLastModified();
  if(!oriUpdateTime) {
    return
  }
  
  // console.log("curUpdateTime: " + curUpdateTime);
  // console.log("oriUpdateTime: " + oriUpdateTime);

  pageData = {
    oriUpdateTime: oriUpdateTime.getTime(),
    curUpdateTime: curUpdateTime.getTime(),
    enURL: location.protocol 
          + "//" 
          + location.hostname
          + getEnPageUrl(),
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