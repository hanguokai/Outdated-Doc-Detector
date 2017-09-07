// Saves options to chrome.storage.sync.
function save_options() {
  var showBanner = document.getElementById('showBanner').checked;
  chrome.storage.sync.set({
    showBanner: showBanner
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    showBanner: true
  }, function(items) {
    document.getElementById('showBanner').checked = items.showBanner;
  });

  document.getElementById('showBannerLabel').innerText = 
    chrome.i18n.getMessage("optionShowBannerLabel");
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);