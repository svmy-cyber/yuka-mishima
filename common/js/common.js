/**
 * common.js
 *
 */

/* ----------------------------------------------------------
  グローバル変数
---------------------------------------------------------- */

var winH, // ウィンドウの高さ
  scrollTop = 0, // スクロール量
  pagePath = location.pathname; // 現在のページパス

// ウィンドウの高さ取得
winH = $(window).height();
$(window).on('resize', function () {
  winH = $(window).height();
});

// スクロール量取得
$(window).on('scroll load resize', function () {
  scrollTop = $(window).scrollTop();
});


/* ----------------------------------------------------------
  init
---------------------------------------------------------- */
$(function () {
  // タブレット対応 viewport
  TBViewport();
  // ヘッダー追従
  headerFixScroll();
  // スムーススクロール
  pageScroll();
  // スクロールによる出し分け
  jsScrollHide();
  // 画像ロールオーバー
  rollover();
  // ページidによるカレント処理
  if (pagePath !== '/' && pagePath !== '/index.html' && pagePath !== '/index_renewal.html' && pagePath !== '/index_visits.html' && pagePath !== '/english/' && pagePath !== '/english/index.html' && pagePath !== '/english/index_renewal.html' && pagePath !== '/english/index_visits.html') {
    idSearch();
  }
  // mod-card-01用js
  jsModCard01();
  // fig-cmn用js
  var resizeTimer = null;
  $(window).on('load', function () {
    jsFigCmn();
    jsImgMaxFit();
  });
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      jsFigCmn();
      jsImgMaxFit();
    }, 200);
  });
  // 高さ揃え
  var resizeTimer2 = null;
  if ($('script[src="/common/js/jquery.matchHeight-min.js"]').size() > 0) { //プラグインの有無の判定
    $(window).on('load', function () {
      matchHeightFunction();
    });
    $(window).on('resize', function () {
      clearTimeout(resizeTimer2);
      resizeTimer2 = setTimeout(function () {
        matchHeightFunction();
      }, 200);
    });
  }
  // ヘッダー追従用リンク処理 ページ遷移時の処理
  $(window).on('load', function () {
    linkAnc();
  });
  if (pagePath !== '/' && pagePath !== '/index.html' && pagePath !== '/index_renewal.html' && pagePath !== '/index_visits.html' && pagePath !== '/english/' && pagePath !== '/english/index.html' && pagePath !== '/english/index_renewal.html' && pagePath !== '/english/index_visits.html') {
    jsSlick();
  } else {
    topSlider();
  }
  // tab処理
  modPager();
  // ビデオ再生
  modVideo();
  // レスポンシブクリッカブルマップ
  imageMap();
  // 旧ページレスポンシブ対応
  jsOMFig();
  jsOMspacer();
  // ブラウザ対応
  addBrowserCss();
});

/* ----------------------------------------------------------
  old js
---------------------------------------------------------- */
//オープンウインドウ
function MM_openBrWindow(theURL, winName, features) { //v2.0
  window.open(theURL, winName, features);
}

/* ----------------------------------------------------------
  TBViewport
---------------------------------------------------------- */
var TBViewport = function () {
  var User = navigator.userAgent;
  var TBForIPad = '<meta name="viewport" content="width=1260px,user-scalable=yes">';
  var TBForAndroid = '<meta name="viewport" content="width=1260px,user-scalable=yes">';
  if (User.indexOf('iPhone') > 0 || User.indexOf('iPod') > 0 || User.indexOf('Android') > 0 && User.indexOf('Mobile') > 0) {
    //sp
  } else if (User.indexOf('iPad') > 0) {
    //tab iPad
    $('meta[name="viewport"]').after(TBForIPad).remove();
  } else if (User.indexOf('Android') > 0) {
    //tab Android
    $('meta[name="viewport"]').after(TBForAndroid).remove();
  } else {
    //other
  }
};

/* ----------------------------------------------------------
  pageScroll
---------------------------------------------------------- */
var pageScroll = function () {
  $('.js-scroll').click(function () {
    var headerH = $('.header').height();
    var speed = 400; // スクロールスピード
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - headerH;
    if (href == '#') {
      // リンク#のときはページの先頭へ
      $('body,html').animate({
        scrollTop: 0
      }, speed, 'swing');
    } else {
      // それ以外は指定idへ
      $('body,html').animate({
        scrollTop: position
      }, speed, 'swing');
    }
    return false;
  });
};

/* ----------------------------------------------------------
  link
 ---------------------------------------------------------- */
var linkAnc = function () {
  var ptn = /.*(#.*)/;
  var currentID = window.location.href.match(ptn);

  if (currentID != null && !currentID[1].match(/^#sort/)) {
    var position = $('body').find(currentID[1]).offset().top - $('.header .header-inner').innerHeight();
    $('html,body').animate({
      scrollTop: position
    }, 0);
    return false;
  }
};

/* ----------------------------------------------------------
  scroll hide
 ---------------------------------------------------------- */
var jsScrollHide = function () {
  var $trg = $('.js-scrollHide');
  if ($trg.size() > 0) {
    var settingH = 300;
    $trg.hide();
    $(window).scroll(function () {
      var footerH = $('.footer').height();
      var footerPosition = $('.footer').offset().top - winH - 40;
      if (settingH >= scrollTop) {
        $trg.fadeOut();
      } else {
        $trg.fadeIn();
      }
      if (scrollTop >= footerPosition) {
        $trg.addClass('-fixed');
        $trg.css('bottom', footerH);
      } else {
        $trg.removeClass('-fixed');
        $trg.css('bottom', '0');
      }
    });
  }
};

/* ----------------------------------------------------------
  rollover
---------------------------------------------------------- */
var rollover = function () {
  var suffix = {
    normal: '_no.',
    over: '_on.'
  };
  $('.js-over').each(function () {
    var a = null;
    var img = null;
    var elem = $(this).get(0);
    if (elem.nodeName.toLowerCase() == 'a') {
      a = $(this);
      img = $('img', this);
    } else if (elem.nodeName.toLowerCase() == 'img' || elem.nodeName.toLowerCase() == 'input') {
      img = $(this);
    }
    var src_no = img.attr('src'); // イメージ取得
    var src_on = src_no.replace(suffix.normal, suffix.over); // オーバーイメージに変換
    /* イメージ置換 */
    if (elem.nodeName.toLowerCase() == 'a') {
      a.on("mouseover focus", function () {
          img.attr('src', src_on);
        })
        .on("mouseout blur", function () {
          img.attr('src', src_no);
        });
    } else if (elem.nodeName.toLowerCase() == 'img') {
      img.on("mouseover", function () {
          img.attr('src', src_on);
        })
        .on("mouseout", function () {
          img.attr('src', src_no);
        });
    } else if (elem.nodeName.toLowerCase() == 'input') {
      img.on("mouseover focus", function () {
          img.attr('src', src_on);
        })
        .on("mouseout blur", function () {
          img.attr('src', src_no);
        });
    }
    /* イメージ先読み */
    var cacheimg = document.createElement('img');
    cacheimg.src = src_on;
  });
};

/* ----------------------------------------------------------
  idSearch
---------------------------------------------------------- */
var idSearch = function () {
  var current = document.body.className, //classの全てを取得
    ptn = /(JA|EN)-([0-9]*)-([0-9]*)-([0-9]*)-([0-9]*)/, //classの全てを取得
    found = current.match(ptn);

  /*id配置
  ----------------------------------*/
  if (found) {
    var idLang = found[1],
      idTop = found[2],
      idLv01 = found[3],
      idLv02 = found[4], //未使用
      idLv03 = found[5]; //未使用
  }

  /*グローバルナビ
  ----------------------------------*/
  var $trg = $('.nav-global .lv01'),
    gCurrent = 'is-current';
  if ($('.nav-global').size() > 0) {

    /* 日本語ページカレント */
    if (idLang == 'JA') {
      if (idTop == '00') { //top
      } else if (idTop == '01') { //広報委員会について配下
        $trg.find('.nav01 > a').addClass(gCurrent);
        if (idLv01 == '00') { //広報委員会についてトップ ならlist0番目（スマホのみ）にcurrent
          $trg.find('.nav01 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //IDの2区切り目が01のコンテンツはない
          $trg.find('.nav01 .lv02 > li').eq(1).addClass(gCurrent); //eq1は並び上おかしいが実害がない
        } else if (idLv01 == '02') { //メッセージ
          $trg.find('.nav01 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '03') { //事業精神
          $trg.find('.nav01 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '04') { //広報活動
          $trg.find('.nav01 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '05') { //イベントの後援
          $trg.find('.nav01 .lv02 > li').eq(4).addClass(gCurrent);
        } else if (idLv01 == '06') { //文化貢献活動
          $trg.find('.nav01 .lv02 > li').eq(5).addClass(gCurrent);
        }
      } else if (idTop == '02') { //グループ各社・関連団体
        $trg.find('.nav02 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav02 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //top
          $trg.find('.nav02 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '02') { //グループ各社のご案内
          $trg.find('.nav02 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '03') { //グループ各社からのお知らせ
          $trg.find('.nav02 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '04') { //住友財団
          $trg.find('.nav02 .lv02 > li').eq(4).addClass(gCurrent);
        }
      } else if (idTop == '03') { //現在の取り組み
        $trg.find('.nav03 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav03 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //各社の環境・社会貢献活動
          $trg.find('.nav03 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '02') { //メッセージ「住友最前線」
          $trg.find('.nav03 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '03') { //マンガルポ「住友グループ探訪」
          $trg.find('.nav03 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '04') { //SDGsと住友 ～未来のつくり方～
          $trg.find('.nav03 .lv02 > li').eq(4).addClass(gCurrent);
        } else if (idLv01 == '05') { //すみともキッズ
          $trg.find('.nav03 .lv02 > li').eq(5).addClass(gCurrent);
        } else if (idLv01 == '06') { //住友が取り組む社会課題～未来への羅針盤～
          $trg.find('.nav03 .lv02 > li').eq(6).addClass(gCurrent);
        }
      } else if (idTop == '04') { //住友の歴史
        $trg.find('.nav04 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav04 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //歴史表
          $trg.find('.nav04 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '04') { //関連施設id04を見たら2番目の住友人物列伝が点灯
          $trg.find('.nav04 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '08') { //関連施設id08を見たら3番目の別子銅山が点灯
          $trg.find('.nav04 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '05') { //関連施設id05を見たら4番目の関連施設が点灯
          $trg.find('.nav04 .lv02 > li').eq(4).addClass(gCurrent);
        } else if (idLv01 == '02') { //歴史探訪id02を見たら5番目の歴史探訪が点灯
          $trg.find('.nav04 .lv02 > li').eq(5).addClass(gCurrent);
        } else if (idLv01 == '03') { //源泉id03を見たら6番目の源泉が点灯
          $trg.find('.nav04 .lv02 > li').eq(6).addClass(gCurrent);
        } else if (idLv01 == '06') { //歴史探訪id02を見たら5番目の歴史探訪が点灯
          $trg.find('.nav04 .lv02 > li').eq(7).addClass(gCurrent);
        } else if (idLv01 == '09') { //今に生きる住友語録
          $trg.find('.nav04 .lv02 > li').eq(8).addClass(gCurrent);
        }
      } else if (idTop == '99') { //大阪・関西万博「住友館」
        $trg.find('.nav05 > a').addClass(gCurrent);
        if (idLv01 == '00') { //大阪万博top
          $trg.find('.nav05 .lv02 > li').eq(0).addClass(gCurrent);
        }
      }
    }

    /* 英語ページカレント */
    if (idLang == 'EN') {
      if (idTop == '00') { //top
      } else if (idTop == '01') { //About Public Affairs Committee
        $trg.find('.nav01 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav01 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //Group Message
          $trg.find('.nav01 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '02') { //Business Philosophy
          $trg.find('.nav01 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '03') { //Group Communication
          $trg.find('.nav01 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '04') { //Sponsorships
          $trg.find('.nav01 .lv02 > li').eq(4).addClass(gCurrent);
        }
      } else if (idTop == '02') { //List of Member Companies
        $trg.find('.nav02 > a').addClass(gCurrent);
      } else if (idTop == '03') { //History
        $trg.find('.nav04 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav04 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //Sumitomo in History
          $trg.find('.nav04 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '02') { //Sumitomo's starting point
          $trg.find('.nav04 .lv02 > li').eq(9).addClass(gCurrent);
        } else if (idLv01 == '03') { //Sumitomo's starting point
          $trg.find('.nav04 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '04') { //Related Facilities
          $trg.find('.nav04 .lv02 > li').eq(5).addClass(gCurrent);
        } else if (idLv01 == '06') { //Sumitomo Quotes with Enduring Value
          $trg.find('.nav04 .lv02 > li').eq(7).addClass(gCurrent);
        } else if (idLv01 == '07') { //Chronological Table & Development of the Sumitomo Group
          /* bodyのidを見てEN-03-07-xxの時、メニュー並びで3（配列番号で2）番目にgCurrentを付与する */
          $trg.find('.nav04 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '08') { //Besshi Copper Mines
          /* bodyのidを見てEN-03-08-xxの時、メニュー並びで3（配列番号で2）番目にgCurrentを付与する */
          $trg.find('.nav04 .lv02 > li').eq(4).addClass(gCurrent);
        } else if (idLv01 == '09') { //Besshi Copper Mines
          /* bodyのidを見てEN-03-09-xxの時、メニュー並びで3（配列番号で2）番目にgCurrentを付与する */
          $trg.find('.nav04 .lv02 > li').eq(6).addClass(gCurrent);
        } else if (idLv01 == '10') { //Besshi Copper Mines
          /* 「idLv01」がbodyにつくid。「eq(8)」がグロナビの8番目（0は数えない純粋カウント）を指す */
          $trg.find('.nav04 .lv02 > li').eq(8).addClass(gCurrent);
        }
      } else if (idTop == '04') { //Current Major Activities
        $trg.find('.nav03 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav03 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '08') { //From the Sumitomo/Society Interface
          $trg.find('.nav03 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '09') { //Manga Reportage "Visits to Sumitomo Group"
          $trg.find('.nav03 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '11') { //Chronological Table & Development of the Sumitomo Group
          /* bodyのidを見てEN-04-10-xxの時、メニュー並びで11（配列番号で10）番目にgCurrentを付与する */
          $trg.find('.nav03 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '12') { //Chronological Table & Development of the Sumitomo Group
          /* bodyのidを見てEN-04-12-xxの時、メニュー並びで11（配列番号で10）番目にgCurrentを付与する */
          $trg.find('.nav03 .lv02 > li').eq(4).addClass(gCurrent);
        }
      } else if (idTop == '05') { //住友のいま未来
        $trg.find('.nav05 > a').addClass(gCurrent);
        if (idLv01 == '00') { //top
          $trg.find('.nav05 .lv02 > li').eq(0).addClass(gCurrent);
        } else if (idLv01 == '01') { //Our Aspirations
          $trg.find('.nav05 .lv02 > li').eq(1).addClass(gCurrent);
        } else if (idLv01 == '02') { //Make the future
          $trg.find('.nav05 .lv02 > li').eq(2).addClass(gCurrent);
        } else if (idLv01 == '03') { //
          $trg.find('.nav05 .lv02 > li').eq(3).addClass(gCurrent);
        } else if (idLv01 == '04') { //Illustrator Masako Fujii Visits Sumitomo Group
          $trg.find('.nav05 .lv02 > li').eq(4).addClass(gCurrent);
        }
      } else if (idTop == '99') { //大阪・関西万博「住友館」
        $trg.find('.nav06 > a').addClass(gCurrent);
        if (idLv01 == '00') { //大阪万博top
          $trg.find('.nav06 .lv02 > li').eq(0).addClass(gCurrent);
        }
      }
    }
  }
};

/* ----------------------------------------------------------
  header items
---------------------------------------------------------- */
(function ($) {
  $(function () {

    var User = navigator.userAgent; //タブレット判定用
    if ($(window).innerWidth() > 768) {
      if (User.indexOf('iPad') > 0 || User.indexOf('Android') > 0) {
        //tab
        if ($('.header').size() > 0) {
          var $trg = $('.nav-global');
          $trg.find('a').addClass('no-hover');
          $trg.find('.lv02').hide()
            .find('> li').removeClass('only-sp');
          $trg.find('.lv01 > li > a:not(.no-lv)').on('click', function () {
            if ($(this).hasClass('is-active')) {
              $(this).removeClass('is-active');
              $(this).next('.lv02').hide();
            } else {
              $trg.find('.lv02').hide();
              $trg.find('.lv01 > li > a:not(.no-lv)').removeClass('is-active');
              $(this).addClass('is-active');
              $(this).next('.lv02').show();
            }
            return false;
          });
        }
      } else {
        //pc
      }
    } else {
      //sp
      if ($('.header').size() > 0) {
        //ハンバーガーメニュー開閉
        var $drawerBtn = $('.header-hamburger'),
          headerItemH = $(window).innerHeight() - $('.header-cover').innerHeight(),
          $drawerContents = $('.header-utility'),
          current = 'is-active';
        $drawerContents.css('max-height', headerItemH);
        $drawerBtn.on('click', function () {
          $('html').toggleClass('is-drawer-open');
          $(this).toggleClass(current);
          $drawerContents.slideToggle();
          return false;
        });

        //lv02の開閉
        var $slideBtn = $('.nav-global .lv01 > li > a');
        $('.nav-global .lv02').hide(); //初期処理
        $slideBtn.on('click', function () {
          if (!$(this).hasClass('no-lv')) {
            $(this).toggleClass(current)
              .next('.lv02').slideToggle();
            return false;
          }
        });

        //closeボタン
        var $closeBtn = $('.header .btn-close a');
        $closeBtn.on('click', function () {
          $('html').removeClass('is-drawer-open');
          $drawerBtn.removeClass(current);
          $drawerContents.slideUp();
          return false;
        });

        //wrapper クリック時
        var $closeWrapper = $('.is-drawer-open .wrapper');
        $closeWrapper.on('click', function () {
          $('html').removeClass('is-drawer-open');
          $drawerBtn.removeClass(current);
          $drawerContents.slideUp();
          return false;
        });

        //リサイズ対応
      }
    }
  });
})(jQuery);

/* ----------------------------------------------------------
  header fixScroll
---------------------------------------------------------- */
var headerFixScroll = function () {

  var $header = $('.header');
  var headerH;
  if ($header.size() > 0) {

    var headerPad = function () {
      headerH = $header.height();
      $('body').css('padding-top', headerH + 'px');
    };
    //PC
    if ($(window).innerWidth() > 768) {
      if ($('.hero-slider-wrap').find('.header').size() > 0) {
        $(window).on('scroll', function () {
          if ($(this).scrollTop() > 10) {
            $header.addClass('is-fixed');
          } else {
            $header.removeClass('is-fixed');
          }
        });
      } else {
        $header.addClass('is-fixed');
        headerPad();
        $(window).resize(function () {
          headerPad();
        });
      }
    } else { //SP
      $header.addClass('is-fixed');
      headerPad();
      $(window).resize(function () {
        headerPad();
      });
    }
  }
};

/* ----------------------------------------------------------
  footer
---------------------------------------------------------- */
(function ($) {
  $(function () {
    if ($(window).innerWidth() < 768) {
      if ($('.footer .footer-main-links').size() > 0) {
        //lv02の開閉
        var $slideBtn = $('.footer-main-links .lv01 > li > a:not(.no-icon)'),
          current = 'is-active';
        $slideBtn.on('click', function () {
          if (!$(this).hasClass('no-lv')) {
            $(this).toggleClass(current)
              .next('.lv02').slideToggle();
            return false;
          }
        });
        //リサイズ対応
      }
    }
  });
})(jQuery);

/* ----------------------------------------------------------
  language
---------------------------------------------------------- */
(function ($) {
  $(function () {
    var $languageBtn = $('.btn-language .cover > a'),
      current = 'is-active';
    if ($languageBtn.size() > 0) {
      $languageBtn.on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass(current);
        $(this).parent().next('.switch').fadeToggle('fast');
        return false;
      });
    }
  });
})(jQuery);

/* ----------------------------------------------------------
  view more
---------------------------------------------------------- */
(function ($) {
  $(function () {
    var $trg = $('.js-viewMore');
    var $trgRE = $('.js-viewMoreRe');
    var $obj = $('.js-viewMoreItems');
    var $scrollTrg = $('.area-pickup');
    //設定
    var setting = {
      groupItems: 6
    };

    if ($trg.size() > 0 && $obj.size() > 0) {

      //初期セット
      var itemLength = $obj.children().length;
      var showItemLength = setting.groupItems;

      if (itemLength > showItemLength) {
        $obj.children().eq(setting.groupItems - 1).nextAll().hide();
        $trgRE.hide();
      } else {
        $trg.hide();
        $trgRE.hide();
      }

      //ボタンアクション
      $trg.on('click', function () {
        showItemLength += setting.groupItems;
        if (showItemLength >= itemLength) {
          showItemLength = itemLength;
          $(this).hide(); //上限に到達した場合moreボタン削除
          $trgRE.show(); //上限に到達した場合Reボタン表示
        }

        $obj.children().eq(showItemLength - 1).fadeIn()
          .prevAll().fadeIn();
        return false;
      });

      //Resetボタンアクション
      $trgRE.on('click', function () {
        $(this).hide(); //上限に到達した場合Reボタン表示
        $trg.show(); //上限に到達した場合Reボタン表示
        //項目先頭へスクロール
        var position = $scrollTrg.offset().top - $('.header-cover').height();
        $('body,html').animate({
          scrollTop: position
        }, 800, 'swing');
        //リセット処理
        $obj.children().eq(setting.groupItems - 1).nextAll().fadeOut(700);
        showItemLength = setting.groupItems;
        return false;
      });

    } else {}
  });
})(jQuery);

/* ----------------------------------------------------------
  top slider
---------------------------------------------------------- */
var topSlider = function () {
  $('.js-slick').not('.slick-initialized').slick({
    speed: 700,
    dots: true,
    autoplay: true,
    autoplaySpeed: 8000,
    adaptiveHeight: true,
    pauseOnHover: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: '<img src="/common/img/ico_slider_prev.png" class="top-slider-prev-btn">',
    nextArrow: '<img src="/common/img/ico_slider_next.png" class="top-slider-next-btn">',
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 1
      }
    }]
  });
  $('.slick-dots').append('<li class="top-slider-stop js-stop"></li>');
  $('.js-stop').on('click', function () {
    if ($(this).hasClass('-active')) {
      $('.js-slick').slick('slickPlay');
      $(this).removeClass('-active');
    } else {
      $('.js-slick').slick('slickPause');
      $(this).addClass('-active');
    }
  });
};

/* ----------------------------------------------------------
  slick
---------------------------------------------------------- */
var jsSlick = function () {
  var $trg = $('.js-slick');
  if ($trg.size() > 0) {
    $trg.slick({
      dots: true,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: false
    });
  }
  var $trg02 = $('.js-slick-02');
  if ($trg02.size() > 0) {
    $trg02.slick({
      dots: true,
      autoplay: true,
      autoplaySpeed: 10000,
      pauseOnHover: false
    });
  }
  var $trg03 = $('.js-slick-03');
  if ($trg03.size() > 0) {
    $trg03.slick({
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 10000,
      slidesToShow: 1,
      centerMode: true,
      pauseOnHover: false,
      variableWidth: true
    });
  }
};

/* ----------------------------------------------------------
  imgFit
---------------------------------------------------------- */
(function ($) {
  $(function () {
    var $trg = $('.js-imgFit');
    if ($trg.size() > 0) {
      $trg.each(function () {
        $trg.bind("load", function () {
          var img = new Image();
          img.src = $(this).attr('src');
          var width = img.width;
          if (width != 0) {
            $(this).css('max-width', width);
          }
        });
      });
    }
  });
})(jQuery);

/* ----------------------------------------------------------
  jsModCard01
---------------------------------------------------------- */
var jsModCard01 = function () {
  var $trg = $('.mod-card-01 .image img');
  if ($trg.size() > 0) {
    if ($(window).innerWidth() > 768) {
      $trg.each(function () {
        $trg.bind("load", function () {
          var img = new Image();
          img.src = $(this).attr('src');
          var width = img.width;
          if (width != 0) {
            $(this).closest('.mod-card-01').css('max-width', width);
          }
        });
      });
    } else {
      $trg.each(function () {
        $trg.bind("load", function () {
          var img = new Image();
          img.src = $(this).attr('src');
          var width = img.width;
          if (width != 0) {
            $(this).css('max-width', width);
          }
        });
      });
    }
  }
};

/* ----------------------------------------------------------
  fig-cmn //元画像以上に拡大させない
---------------------------------------------------------- */
var jsFigCmn = function () {

  var $trg = $('.fig-cmn:not(.type-full)');

  if ($trg.size() > 0) {

    if ($(window).innerWidth() > 768) {

      $trg.each(function () {

        var $thisTrg = $(this);
        var $obj = $(this).find('.image:not(.only-sp)');
        var totalWidth = 0;

        if ($thisTrg.hasClass('type-mod-01')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth);
            }
          });
        } else if ($thisTrg.hasClass('type-mod-02')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth);
            }
          });
        } else if ($thisTrg.hasClass('type-mod-03')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth);
            }
          });
        } else if ($thisTrg.hasClass('type-mod-04')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $(this).css('max-width', totalWidth);
            }
          });
        } else if ($thisTrg.hasClass('type-mod-modal')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth);
            }
          });
        } else if ($thisTrg.hasClass('type-half')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width / 2);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth / 2);
            }
          });
        } else if ($thisTrg.hasClass('type-cap-full-pc')) {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {}
          });
        } else {
          $(this).find('.image:not(.only-sp)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth);
            }
          });
        }

      });
    } else {
      $trg.each(function () {

        var $thisTrg = $(this);
        var $obj = $(this).find('.image:not(.only-pc)');
        var totalWidth = 0;
        var defaultFigWidth = 290;

        if ($thisTrg.hasClass('type-mod-01')) {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
              $(this).css('min-width', width / 2);
              $(this).css('width', width / defaultFigWidth * 50 + "%");
            }
            if (index == $obj.length - 1) {}
          });
        } else if ($thisTrg.hasClass('type-mod-02')) {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
              $(this).css('min-width', width / 2);
              $(this).css('width', width / defaultFigWidth * 50 + "%");
            }
            if (index == $obj.length - 1) {}
          });
        } else if ($thisTrg.hasClass('type-mod-03')) {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {}
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', width);
              $thisTrg.css('min-width', width / 2);
              $thisTrg.css('width', width / defaultFigWidth * 50 + "%");
            }
          });
        } else if ($thisTrg.hasClass('type-mod-04')) {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {}
            if (index == $obj.length - 1) {
              $thisTrg.css('width', '100%');
              $(this).css('max-width', width);
              $(this).css('min-width', width / 2);
              $(this).css('width', width / defaultFigWidth * 50 + "%");
            }
          });
        } else if ($thisTrg.hasClass('type-mod-modal')) {
          defaultFigWidth = 260;
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {}
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', width);
              $thisTrg.css('min-width', width / 2);
              $thisTrg.css('width', width / defaultFigWidth * 50 + "%");
            }
          });
        } else if ($thisTrg.hasClass('type-half')) {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width / 2);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth / 2);
            }
          });
        } else if ($thisTrg.hasClass('type-cap-full-sp')) {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('width', '100%');
              $thisTrg.find('.caption.img-width').css('max-width', totalWidth);
            }
          });
        } else {
          $(this).find('.image:not(.only-pc)').each(function (index) {
            var img = new Image();
            img.src = $(this).attr('src');
            var width = img.width;
            totalWidth += img.width;
            if (width != 0) {
              $(this).css('max-width', width);
            }
            if (index == $obj.length - 1) {
              $thisTrg.css('max-width', totalWidth);
            }
          });
        }

      });
    }

  }
};

/* ----------------------------------------------------------
  img-maxFit //&-trgで指定した幅に固定する
---------------------------------------------------------- */
var jsImgMaxFit = function () {
  var $trg = $('.js-img-maxFit');
  if ($trg.size() > 0) {
    if ($(window).innerWidth() > 768) {
      $trg.each(function () {
        var $thisTrg = $(this);
        var maxWidth = 0;
        $(this).find('.js-img-maxFit-trg').each(function () {
          var img = new Image();
          img.src = $(this).attr('src');
          var width = img.width;
          if (width > maxWidth) {
            $thisTrg.css('max-width', width);
            maxWidth = width;
          }
        });
      });
    }
  }
};

/* ----------------------------------------------------------
  js-accordion //&-trgで指定した幅に固定する
---------------------------------------------------------- */
(function ($) {
  $(function () {
    if ($(window).innerWidth() > 768) {} else {
      var $pack = $('.js-accordion');
      if ($pack.size() > 0) {
        $pack.find('.js-acc-obj.only-pc').removeClass('only-pc').hide();
        $pack.find('.js-acc-trg').on('click', function () {

          $(this).closest('.js-accordion').find('.js-acc-obj').slideToggle();

          if ($(this).hasClass('type-scroll')) {
            $(this).removeClass('type-scroll');
            $(this).addClass('type-scroll-re');
          } else if ($(this).hasClass('type-scroll-re')) {
            $(this).removeClass('type-scroll-re');
            $(this).addClass('type-scroll');
          }
          return false;
        });
      }
    }
  });
})(jQuery);

(function ($) {
  $(function () {
    var $pack = $('.js-accordion-02');
    if ($pack.size() > 0) {

      $pack.find('.js-acc-trg .ico-scroll').removeClass('ico-re');
      $pack.find('.js-acc-obj').hide();

      $pack.find('.js-acc-trg').on('click', function () {
        $(this).closest('.btn-cmn').toggleClass('type-scroll');
        $(this).closest('.btn-cmn').toggleClass('type-scroll-re');
        $(this).closest('.js-accordion-02').find('.js-acc-obj').slideToggle();
        $(this).find('.ico-scroll').toggleClass('ico-re');
        return false;
      });
    }
  });
})(jQuery);

/* ----------------------------------------------------------
  mod-pager-script
---------------------------------------------------------- */
var modPager = function () {
  var $trg = $('.mod-pager-01');
  if ($trg.size() > 0) {
    if ($(window).innerWidth() > 768) {
      $trg.each(function () {
        /* ネスト判定 */
        $(this).find('.lv01 > li').each(function () {
          if ($(this).find('.lv02').length > 0) {
            $(this).addClass('lv-arrow');
          }
        });
        /* ボーダーの付与 末尾判定 */
        var ptn = /pc-cols-([0-9]*)/,
          cols = $(this).attr('class').match(ptn),
          time = 0; //カウントリセット
        $(this).find('.lv01 > li').each(function () {
          var ptn2 = /col([0-9]*)/;
          var liCol = $(this).attr('class').match(ptn2);
          time = time + Number(liCol[1]);
          if (time < cols[1]) {} else if (time > cols[1]) {
            $(this).prev().addClass('last-col');
            time = Number(liCol[1]);
          } else {
            $(this).addClass('last-col');
            time = 0
          }
        });
      });
    } else {
      $trg.each(function () {
        /* ネスト判定 */
        $(this).find('.lv01 > li').each(function () {
          if ($(this).find('.lv02').length > 0) {
            $(this).addClass('lv-arrow');
          }
        });
      });
      /* クリック処理 */
      var $trgBtn = $(document).find('.mod-pager-01 .lv-arrow .inner .inner-deep > a');
      $trgBtn.on('click', function () {
        $(this).toggleClass('is-active');
        $(this).next('.lv02').slideToggle();
        return false;
      });
    }

    /* UA */
    var User = navigator.userAgent;
    if (User.indexOf('iPhone') > 0 || User.indexOf('iPod') > 0 || User.indexOf('Android') > 0 && User.indexOf('Mobile') > 0) {
      //sp
    } else if (User.indexOf('iPad') > 0) {
      //tab iPad
      $trg.find('.lv01 > li:first-child').addClass('s-iPad');
    } else if (User.indexOf('Android') > 0) {
      //tab Android
    } else {
      //other
    }
  }
};

/* ----------------------------------------------------------
  match height
---------------------------------------------------------- */
var matchHeightFunction = function () {
  var $pack = $('.js-MH');
  if ($pack.size() > 0) {
    $pack.matchHeight();
  }
  var $pack01 = $('.js-MH-01');
  if ($pack01.size() > 0) {
    $pack01.find('.grid-cmn .col').matchHeight();
    $pack01.find('.ttl-cmn-02').matchHeight();
    $pack01.find('.txt-cmn').matchHeight();
    $pack01.find('.mod-horizon').matchHeight();
  }
  var $pack02 = $('.table-cmn.type-04');
  if ($pack02.size() > 0) {
    $pack02.find('.line').matchHeight();
  }
  var $pack03 = $('.mod-card-03');
  if ($pack03.size() > 0) {
    $pack03.matchHeight();
    $pack03.find('.detail').matchHeight();
  }
  var $pack04 = $('.mod-card-competition');
  if ($pack04.size() > 0) {
    $pack04.matchHeight();
    $pack04.find('.title').matchHeight();
    $pack04.find('.text').matchHeight();
  }
  var $pack05 = $('.mod-categories-01');
  if ($pack05.size() > 0) {
    $pack05.matchHeight();
    $pack05.find('> a').matchHeight();
  }
};

/* ----------------------------------------------------------
  mod-video
---------------------------------------------------------- */
var modVideo = function () {
  var $pack = $('.mod-video');
  if ($pack.size() > 0) {

    // 初期処理
    var $videoes = $pack.find('video.v-item');
    $videoes.each(function () {
      var posterSrc = $(this).attr('poster');
      if (posterSrc != null) {
        var posterHTML = '<div class="poster"><img src="' + posterSrc + '"></div>>';
        $(this).before(posterHTML);
        $(this).closest('.video').addClass('add-poster');
        $(this).removeAttr('poster');
      }
    });

    // poster
    var $poster = $(document).find('.mod-video .poster');
    $poster.on('click', function () {

      var videoId = $(this).next().attr('id');
      var video = document.getElementById(videoId);
      console.log(videoId);

      $(this).hide();
      video.play();
      flag = 'play';
      $(this).closest('.video').addClass('is-play');
    });

    // on click
    var $trg = $pack.find('.video video.v-item');
    var flag = 'pause';
    $trg.on('click', function () {
      var videoId = $(this).attr('id');
      var video = document.getElementById(videoId);
      if (flag == 'play') {
        video.pause();
        flag = 'pause';
      } else {
        video.play();
        flag = 'play';
        $(this).closest('.video').addClass('is-play');
      }
    });

    // //Firefox
    // $('.mod-video').each(function(){
    //   var src = $(this).find('video').attr('poster');
    //   if( src != false ){
    //     $(this).prepend('<div class="poster"><img src="' + src + '" alt=""></div>'); //ポスター生成
    //     $(this).find('video').removeAttr('poster');
    //   }
    // });
  }
};

/* ----------------------------------------------------------
  imageMap
---------------------------------------------------------- */
var imageMap = function () {
  var $pack01 = $('img[usemap]');
  if ($pack01.size() > 0) {
    $pack01.rwdImageMaps();
  }
};

/* ----------------------------------------------------------
  js-OM-fig old-module
---------------------------------------------------------- */
var jsOMFig = function () {
  if ($(window).innerWidth() > 768) {} else {
    var $pack01 = $('.old-modules img.js-OM-fig , .old-modules-en img.js-OM-fig');
    if ($pack01.size() > 0) {
      $pack01.each(function () {
        $(this).bind("load", function () {
          var img = new Image();
          img.src = $(this).attr('src');
          var width = img.width;
          $(this).css('max-width', width);
          $(this).addClass('OM-fig-style');
        });
      });
    }
  }
};

/* ----------------------------------------------------------
  js-OMspacer old-module
---------------------------------------------------------- */
var jsOMspacer = function () {
  var $pack01 = $('.old-modules-en img');
  var ptn1 = /spacer.gif/;
  if ($(window).innerWidth() > 768) {
    if ($pack01.size() > 0) {
      $pack01.each(function () {
        var imgSrc = $(this).attr('src');
        if (imgSrc.match(ptn1)) {
          var objW = $(this).attr('width');
          if (objW > 0) {
            $(this).css('width', objW);
          }
          var objH = $(this).attr('height');
          if (objH > 0) {
            $(this).css('height', objH);
          }
        }
      });
    }
  } else {
    if ($pack01.size() > 0) {
      $pack01.each(function () {
        var imgSrc = $(this).attr('src');
        if (imgSrc.match(ptn1)) {
          $(this).addClass('spacer');
        }
      });
    }
  }
};

/* ----------------------------------------------------------
  UA
---------------------------------------------------------- */
var addBrowserCss = function () {
  var ua = window.navigator.userAgent.toLowerCase();
  var ver = window.navigator.appVersion.toLowerCase();

  if (ua.indexOf("msie") != -1) {
    if (ver.indexOf("msie 6.") != -1) {} else if (ver.indexOf("msie 7.") != -1) {} else if (ver.indexOf("msie 8.") != -1) {} else if (ver.indexOf("msie 9.") != -1) {} else if (ver.indexOf("msie 10.") != -1) {} else {}
  } else if (ua.indexOf('trident/7') != -1) {} else if (ua.indexOf('chrome') != -1) {} else if (ua.indexOf('safari') != -1) {
    $packs01 = $('.mod-pager-01');
    if ($packs01.size() > 0) {
      $packs01.find('.lv01 > li:first-of-type').addClass('s-safari');
    }
  } else if (ua.indexOf('opera') != -1) {} else if (ua.indexOf('firefox') != -1) {
    // //カラム落ち
    // var $case01 = $('.grid-cmn.pc-cols-03 .btn-cmn-wrap.space-01');
    // if($case01.size()>0){$case01.addClass('for-fx');}
  }
};

/* ----------------------------------------------------------
アンカーリンク対応
---------------------------------------------------------- */
$(function () {
  var headerHight = 66; //ヘッダの高さ
  $('a').click(function () {
    if ($(this).attr('href').indexOf('#') !== -1) {
      var arr = $(this).attr("href").split('#');
      var href = '#' + arr[1];
      var target = $(href == "#" || href == "" ? 'html' : href);
      var position = target.offset().top - headerHight; //ヘッダの高さ分位置をずらす
      $("html, body").animate({
        scrollTop: position
      }, 550, "swing");
      return false;
    }
  });
});

/* ----------------------------------------------------------
一覧ソート
---------------------------------------------------------- */
$(function () {
  var hash = location.hash.replace('#', '');

  if ($('.js-sort-tab').length) {
    var data = {};
    var $sortList = $('.js-sort-item');
    var $sortDescription = $('.js-sort-description');

    setListInit('init', $('.js-sort-item'));

    $(".js-sort-tab-item").each(function () {
      var sortValue = $(this).attr('data-sort');
      setListInit(sortValue, $('.js-sort-item.' + sortValue));
    });

    //ID付きのURLの場合
    if (hash) {
      changeDisplay(hash);
      $('.js-sort-tab-item[data-sort="' + hash + '"]').addClass('is-active');
    } else {
      changeDisplay('init');
    }

    $(".js-sort-tab-item").on('click', function () {
      var sortValue = $(this).attr('data-sort');
      var clickClass = $(this).attr('class');
      if (clickClass.match(/is-active/)) {
        $('.js-sort-tab-item').removeClass('is-active');
        changeDisplay('init');
      } else {
        $('.js-sort-tab-item').removeClass('is-active');
        $(this).addClass('is-active');
        changeDisplay(sortValue);
      }
    });

    function setListInit(sortValue, list) {
      data[sortValue] = {};
      data[sortValue].list = list;
    }

    function changeDisplay(sortValue) {
      $sortDescription.hide();
      $sortList.hide();
      $('.js-sort-description.' + sortValue).fadeIn('normal');
      data[sortValue].list.fadeIn('normal');
    }
  }
});