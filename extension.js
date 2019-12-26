// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const open = require("open");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.commands.registerCommand("searchdocszhCN.searchSO", function() {
    getQueryAndSearch("http://stackoverflow.com/search?q=%s", "Stack Overflow");
  });
  vscode.commands.registerCommand("searchdocszhCN.searchMDN", function() {
    getQueryAndSearch("https://developer.mozilla.org/zh-CN/search?q=%s", "MDN");
  });
  vscode.commands.registerCommand("searchdocszhCN.searchGoogle", function() {
    getQueryAndSearch("https://www.google.com/search?q=%s", "Google");
  });
  vscode.commands.registerCommand("searchdocszhCN.searchBaidu", function() {
    getQueryAndSearch("https://www.baidu.com/s?wd=%s", "Baidu");
  });
  vscode.commands.registerCommand("searchdocszhCN.searchCIU", function() {
    getQueryAndSearch("https://www.caniuse.com/#search=%s", "caniuse");
  });
  function getQueryAndSearch(searchUrl, providerName) {
    getQuery(searchUrl, providerName).then(function(searchText) {
      if (searchText) {
        open(searchUrl.replace("%s", encodeURIComponent(searchText)));
      }
    });
  }
  function getQuery(searchUrl, providerName) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
      return vscode.window.showInputBox({ prompt: providerName + ": 请输入" }).then(function(searchText) {
        return searchText && searchText.trim();
      });
    }
    var searchWordUnderCursor = vscode.workspace.getConfiguration("searchdocs")["searchWordUnderCursor"];
    var selection = editor.selection;
    if (searchWordUnderCursor || !selection.isEmpty) {
      var searchText = getSelectedTextOrCursorWord(editor).trim();
      if (searchText) return Promise.resolve(searchText.trim());
    }
    return vscode.window.showInputBox({ prompt: providerName + ": 请输入" }).then(function(searchText) {
      return searchText && searchText.trim();
    });
  }
  function getSelectedTextOrCursorWord(editor) {
    var selection = editor.selection;
    var doc = editor.document;
    if (selection.isEmpty) {
      var cursorWordRange = doc.getWordRangeAtPosition(selection.active);
      return cursorWordRange ? doc.getText(cursorWordRange) : "";
    } else {
      return doc.getText(selection);
    }
  }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
