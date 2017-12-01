// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}


// added fxn
function doTestJSZip(d) {

  //console.log(JSZip.toString());
  //console.log(JSZip);

  var zip = new JSZip();
  zip.file("Hello.txt", d[0] );

  var img = zip.folder("images");
  d[1] = d[1].replace("data:image/png;base64,", "");

  img.file("smile.png", d[1], { base64: true });

  zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
    saveAs(content, "example.zip");
  });
}
// added fxn

function doCreateCanvasImage(text) {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "18px 'Courier'";
  ctx.strokeText(text, 0, 100);

  var dataurl = canvas.toDataURL();

  var currImg = document.getElementById("previewImg").src = dataurl;

  return [text, dataurl];

}
// added function
// ref: https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
function getSelectionText() {
    /*var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;*/
    chrome.tabs.executeScript({
      code: "window.getSelection().toString();"
    }, function(selection) {

      var text = selection[0];

      var d = doCreateCanvasImage(text);
      doTestJSZip(d);

      document.getElementById("testtube").innerHTML = selection[0];
    });
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    //var dropdown = document.getElementById('dropdown');

    var testtube = document.getElementById("testtube");

    var dobtn = document.getElementById("do");

    // Load the saved background color for this page and modify the dropdown
    // value, if needed.
    /*getSavedBackgroundColor(url, (savedColor) => {
      if (savedColor) {
        changeBackgroundColor(savedColor);
        dropdown.value = savedColor;
      }
    });

    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
      changeBackgroundColor(dropdown.value);
      saveBackgroundColor(url, dropdown.value);
    });*/

    dobtn.addEventListener('click', () => {
      getSelectionText();
      //testtube.innerHTML = "<p>Text is:" + text + "</p>";
    });

  });
});

// link for reference
//https://developer.chrome.com/apps/app_codelab_filesystem
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
//https://developer.chrome.com/extensions/samples
//https://developer.chrome.com/extensions/api_index
//https://developer.chrome.com/apps/api_index
//https://developer.chrome.com/extensions/devguide
//https://stackoverflow.com/questions/12328714/convert-text-to-image-using-javascript?noredirect=1&lq=1
//msg passing
//content scripts
//https://stackoverflow.com/questions/19164474/chrome-extension-get-selected-text
//https://developer.chrome.com/apps/app_storage#filesystem  (writing / reading / file chooser examples)
//https://stackoverflow.com/questions/17332071/trying-to-save-canvas-png-data-url-to-disk-with-html5-filesystem-but-when-i-ret.
//https://stackoverflow.com/questions/12328714/convert-text-to-image-using-javascript
//https://developer.chrome.com/webstore/apps_vs_extensions
//https://stackoverflow.com/questions/8178825/create-text-file-in-javascript
//http://jsfiddle.net/UselessCode/qm5AG/
//https://developer.chrome.com/apps/app_codelab_filesystem  (FS support in chrome apps)
//https://developer.chrome.com/extensions/downloads ( in case we need to go with chrome ext , then we can use download option instead of writing to filesystem)
//"Chrome will be removing support for Chrome Apps on Windows, Mac, and Linux"
//https://stuk.github.io/jszip/ (to create tar files)
//https://stackoverflow.com/questions/2339440/download-multiple-files-with-a-single-action (Hack-y way to initiate download)
