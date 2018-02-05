# 过时文档检测器
过时文档检测器(Outdated Doc Detector)是一个 Chrome 浏览器扩展，帮助使用非英语的开发者检查当前页面的翻译内容是否落后于对应的英语版本。

Chrome WebStore 安装地址

[![Chrome WebStore 安装地址](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png "Chrome WebStore 安装地址")](https://chrome.google.com/webstore/detail/outdated-doc-detector/enmpooegjbnbhifdpapjknlbjefnlnja)

开发者网站提供了开发者经常需要查阅的关键文档，非常重要。
其中很多支持多语言版本，通过网站的左下角(或右下角)可以选择网站支持的一种语言作为默认显示的语言。

一般而言，这些网站的内容首先使用英语来撰写新内容或更新现有内容，然后发布。而其它语言的版本则由英语版内容翻译而来。
因此非英语版内容的更新时间一般要落后最新英语版内容一段时间，落后时间可能很短也可能长。
另外，由于技术更新快，很多英语版的文档会经常更新。而对应的其它语言版本则经常处于过时的状态。
**过时的文档常常会误导开发者甚至导致软件问题，并且不易察觉。**

考虑到很多非英语母语的开发者还是更习惯看翻译版的文档，所以这个扩展主要就是面向这些开发者，
根据对比非英语版内容与英语版内容的文档更新时间来提醒开发者当前语言的文档是否已经过时。

# 使用说明
从 Chrome WebStore 安装之后，当开发者访问扩展支持的网站时，扩展的图标会呈现如下不同状态：
- 笑脸图标：当前语言的更新时间比英语版的更新时间新，这种状态认为是安全的。
- 警告图标：当前语言的更新时间落后英语版一段时间，这种状态会呈现警告图标。
- 危险图标：当前语言的更新时间落后英语版较长时间，这种状态会呈现危险图标。
- 灰色不可用状态：如果当前页面不是扩展支持的网站或者当前页面语言为英语，则扩展图标处于灰色不可用状态。

在前三种图标状态下，点击扩展图标会显示当前页面的更新时间和最新英语版的更新时间。

特别说明：本扩展采用 [Event Pages](https://developer.chrome.com/extensions/event_pages) 技术实现，扩展不会常驻内存，不使用的时候不会消耗系统资源。
访问扩展不支持的网站时扩展完全不会激活。访问扩展支持的网站时仅在页面加载初期的几秒钟被激活，或者点击扩展图标时被激活。
其它时间扩展处于非激活状态、不消耗资源。可以从 Chrome 内置的任务管理器(Task Manager)中看到扩展是否处于激活状态。

# 支持的开发者网站
- MDN Web 文档: [developer.mozilla.org](https://developer.mozilla.org/)
- Android 开发者：[developer.android.com](https://developer.android.com) , [developer.android.google.cn](https://developer.android.google.cn) , [source.android.com](https://source.android.com) , [source.android.google.cn](https://source.android.google.cn)
- Google 开发者：[developers.google.com](https://developers.google.com)  , [developers.google.cn](https://developers.google.cn)
- Firebase 开发者：[firebase.google.com](https://firebase.google.com)  , [firebase.google.cn](https://firebase.google.cn)
- Google Cloud 开发者：[cloud.google.com](https://cloud.google.com)
- TensorFlow 开发者：[www.tensorflow.org](https://www.tensorflow.org)  , [tensorflow.google.cn](https://tensorflow.google.cn)

# 版本说明
### [1.2.0] - 2018-02-05
- 支持 MDN Web 文档.

### [1.1.0] - 2017-09-08
- 添加页面内警告提示，可通过选项设置是否显示。

### [1.0.2] - 2017-09-02
- 添加点击扩展的快捷键，默认是 "Alt+Shift+E"。
