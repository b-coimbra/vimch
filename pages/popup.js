// TODO: Create a toggle instead of a button
var pause = document.getElementById('pause'),
    blacklist = document.getElementById('blacklist'),
    settings = document.getElementById('settings'),
    isEnabled = true,
    isBlacklisted = false;

var port = chrome.extension.connect({name: 'popup'});
port.onMessage.addListener(function(data) {
  if (data === true) {
    blacklist.textContent = 'Enable vimch on this domain';
    isBlacklisted = true;
  }
});
port.postMessage({action: 'getBlacklisted'});

chrome.runtime.sendMessage({action: 'getActiveState'}, function(response) {
  isEnabled = response;
  if (isEnabled) {
    pause.textContent = 'Disable vimch';
  } else {
    pause.textContent = 'Enable vimch';
  }
});

settings.addEventListener('click', function() {
  chrome.runtime.sendMessage({
    action: 'openLinkTab',
    active: true,
    url: chrome.extension.getURL('/pages/options.html')
  });
}, false);

pause.addEventListener('click', function() {
  isEnabled = !isEnabled;
  if (isEnabled) {
    pause.textContent = 'Disable vimch';
  } else {
    pause.textContent = 'Enable vimch';
  }
  port.postMessage({action: 'toggleEnabled', blacklisted: isBlacklisted});
}, false);

blacklist.addEventListener('click', function() {
  isBlacklisted = !isBlacklisted;
  if (blacklist.textContent === 'Disable vimch on this domain') {
    blacklist.textContent = 'Enable vimch on this domain';
  } else {
    blacklist.textContent = 'Disable vimch on this domain';
  }
  port.postMessage({action: 'toggleBlacklisted'});
  if (isEnabled) {
    port.postMessage({
      action: 'toggleEnabled',
      singleTab: true,
      blacklisted: isBlacklisted
    });
  }
}, false);
