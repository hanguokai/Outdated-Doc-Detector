[中文版介绍](README_zh_CN.md)

# Outdated-Doc-Detector
Outdated-Doc-Detector is a Chrome extension to help non-English developers to check whether the translation of the current page is behind the corresponding English version.

Chrome WebStore install link

[![Chrome WebStore install link](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png "Chrome WebStore install link")](https://chrome.google.com/webstore/detail/outdated-doc-detector/enmpooegjbnbhifdpapjknlbjefnlnja)

Google has some developer websites that support multiple languages. You can select one of these at the lower left/right corner of the page as your default display language. Many non-English developers prefer to use their language as the default display language. But these non-English documents are often behind it's corresponding English versions. 

**Outdated documents often lead to potential problems and are inconspicuous for developers.** This extension is used to indicate whether the ducument is out of date by comparing the updated time between non-English version and English version of the same page.

# Instructions for use
After installing the extension from Chrome webstore, it will show different extension icons when you visit the supported developer websites with non-English preference:
- Smile icon: the updated time of current page is late than it's English version, so you are safe.
- Warn icon: the updated time of current page is before the updated time of the English version, so you need to pay attention.
- Dangerous icon: the updated time of current page is **long** before the updated time of the English version, so you need to check the English verion.
- Inactive state icon: when you visit non-supported developer websites or the current page is English, the extension is in an inactive state.

Note: This extension is implemented by [event pages](https://developer.chrome.com/extensions/event_pages) which are loaded only in a few seconds at the beginning of visiting the supported developer websites or clicking the extension icon. So it doesn't occupy your system resources.

# Supported developer websites
- Android Developers：[developer.android.com](https://developer.android.com) , [developer.android.google.cn](https://developer.android.google.cn) , [source.android.com](https://source.android.com) , [source.android.google.cn](https://source.android.google.cn)
- Google Developers：[developers.google.com](https://developers.google.com)  , [developers.google.cn](https://developers.google.cn) 
- Firebase Developers：[firebase.google.com](https://firebase.google.com)  , [firebase.google.cn](https://firebase.google.cn) 
- Google Cloud Developers：[cloud.google.com](https://cloud.google.com) 
- TensorFlow Developers：[www.tensorflow.org](https://www.tensorflow.org)  , [tensorflow.google.cn](https://tensorflow.google.cn) 
