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