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
}

function getSelectedFont() {
  font = document.getElementById("option-font").value;
  return font != "not selected" ? font : "Jameel Noori Nastaleeq";
}

function getFontSize() {
  size = parseInt(document.getElementById("option-font-size").value);
  return isNaN(size) ? "18" : size;
}
// added fxn
function process_word(word) {
  //todo : add processing logic
}

function process_sentence(sentence) {

  words = sentence.split(" ")

  for (var i = 0; i < words.length; i++) {
    labelled_word = process_word( words[i]);
  }
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

  //ctx.font = "18px 'Tahoma'";
  ctx.font = getSelectedFont();
  font_size = getFontSize();
  ctx.fillText(text, 0, 100);
  var dataurl = canvas.toDataURL();
  var currImg = document.getElementById("previewImg").src = dataurl;
  // labels = process_sentence(text)
  // todo: show labels in a <p> tag
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
      //doTestJSZip(d);

      document.getElementById("testtube").innerHTML = selection[0];
    });
}

document.addEventListener('DOMContentLoaded', () => {

  getCurrentTabUrl((url) => {
    //var dropdown = document.getElementById('dropdown');
    var testtube = document.getElementById("testtube");

    var dobtn = document.getElementById("do");

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
