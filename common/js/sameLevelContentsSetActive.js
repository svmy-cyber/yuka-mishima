$(function () {

  // 絶対パス指定などで入って来た場合の対策
  var rawUrl = location.href;
  var url = rawUrl.split("/").reverse().slice(1).reverse().join("/") + "/";

  // console.log("★url = " + url);

  // ルートパスで書かれてる場合（大半こちら）
  var rawPath = location.pathname;
  var parentPath = rawPath.split("/").reverse().slice(1).reverse().join("/") + "/";

  // console.log("★parentPath = " + parentPath);

  // 1個ずつis-current（赤くする）に該当するものがないかを調べていく
  document.querySelectorAll('.mod-pager-01 a').forEach(function (ele) {
    var pageLink = ele.getAttribute('href');
    // console.log(pageLink);

    if (url.startsWith(pageLink) || parentPath.startsWith(pageLink)) {
      ele.setAttribute('class', 'is-current');
      return false;
    }
  });

});