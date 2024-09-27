/**
 * Analyzer base class for detecting document update time.
 * Note: subclass need to impelment these methods:
 *   async findCurrentPageLastModified() {}
 *   async findEnPageLastModified() {}
 *   getEnPageUrl() {}
 */
class Analyzer {
  /**
   * @return true if this page is English language.
   * if it is English page, analyzer do nothing.
   */
  isEn() {
    const lang = document.documentElement.lang;
    if(!lang || lang === "en" || lang === "en-US") {
      return true;
    } else {
      return false;
    }
  }

  async getHTTPLastModified(url) {
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

   /**
    * init an analyzer for current page.
    */
   static initAnalyzer() {
     // for MDN
     if(location.hostname === "developer.mozilla.org") {
       return new MDN();
     } else {
       return new GoogleSites();
     }
   }
}

/**
 * for MDN Web Docs
 */
class MDN extends Analyzer {
  async findCurrentPageLastModified() {
    return this.findMDNPageLastModified(document);
  }

  async findEnPageLastModified() {
    const enURL = this.getEnPageUrl();
    if(enURL) {
      const response = await fetch(enURL);
      const html = await response.text();
      const enHTML = new DOMParser().parseFromString(html, 'text/html');
      return this.findMDNPageLastModified(enHTML);
    }
    return null;
  }

  getEnPageUrl() {
    // replace developer.mozilla.org/zh-CN/ to /en-US/
    const enAlternate = document.head.querySelector("link[rel=alternate][hreflang=en-US]")
                    || document.head.querySelector("link[rel=alternate][hreflang=en]");
    return enAlternate ? enAlternate.href : null;
  }

  // curent page and english page are the same method
  findMDNPageLastModified(dom) {
    // a time element
    const lastUpdateTime = dom.querySelector(".last-modified-date time");
    if(lastUpdateTime) {
      return new Date(lastUpdateTime.dateTime);
    }
    return null;
  }
}

/**
 * for other Google Dev Sites
 */
class GoogleSites extends Analyzer {
  async findCurrentPageLastModified() {
    // for android dev site
    // <meta itemprop="dateModified" content="2017-07-27T14:36:46.324130">
    const meta = document.head.querySelector("meta[itemprop='dateModified'");
    if(meta) {
      return this.getDateAsUTC(meta.content);
    }

    // default use http header
    return await this.getHTTPLastModified(document.location.href);
  }

  async findEnPageLastModified() {
    // this is ok for supported google sites, don't analyze page content.
    return await this.getHTTPLastModified(this.getEnPageUrl());
  }

  getEnPageUrl() {
    const params = new URLSearchParams(location.search);
    // set ?hl=en param
    params.set('hl', 'en');
    return `${location.pathname}?${params}`;
  }

  getDateAsUTC(datestr) {
    return new Date(datestr + 'Z')
  }
}
