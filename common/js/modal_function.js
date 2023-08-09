
/* ----------------------------------------------------------
 function
---------------------------------------------------------- */
$(function () {
  //モーダルjs
  if($(window).innerWidth()>768){
    jsModalFunc();
  } else {
    pluginModal()
  }
});

/* ----------------------------------------------------------
 Plugin modal
 ---------------------------------------------------------- */
var pluginModal = function (){
  var $trg = $('.js-modal-01');
  if($trg.size() > 0){
    $trg.magnificPopup({
      type: 'iframe',
      preloader: false,
      fixedContentPos: false,
      alignTop: true,
      overflowY: 'scroll',
      showCloseBtn: false,
      callbacks: {
        open: function () {
          $(document).find('.mfp-iframe').load(function(){
            var contentsH = $(this).contents().find('body').height();
            if($(document).find('.mfp-content').height() > contentsH){
              $(this).height(contentsH);
            }
          });
        },
        close: function () {
        }
      }
    });
  }
  /* close */
  $(function () {
    $('.js-modal-close').click(function(e) {
      e.preventDefault();
      if (window.parent == window.top) {
        window.parent.$.magnificPopup.close();
      }
    });
  });
};

/* ----------------------------------------------------------
 origin modal
---------------------------------------------------------- */
var jsModalFunc = function () {
  if(window == window.top){
  /* top window */
    //展開処理
    $('.js-modal-01').click(function() {
      $('body').prepend('<div class="js-modal-wrapper"> <div class="js-modal-wrapper-in"> <div class="js-modal-overlay"></div><div class="js-modal-contents"> <div class="js-modal-contents-main"> <div class="js-modal-contents-main-scaler"> <iframe class="js-modal-iframe" src="' + this.href + '"></iframe> </div></div></div></div></div>');
      $(document).find('.js-modal-iframe').load(function(){
        var contentsH = $(this).contents().find('body').height();
        if($(window).innerWidth() > 768){
          if($(document).find('.js-modal-contents-main').height() > contentsH){
            $(this).height(contentsH);
          }
        }else{
          var scrollH = $(document).scrollTop();
          var overlayH = $(document).innerHeight()+$(document).scrollTop();
          $(this).closest('.js-modal-contents').css('top',scrollH);
          $(document).find('.js-modal-overlay').css({
            'min-height': overlayH,
            'padding-bottom': scrollH
          });
          $(document).find('.js-modal-contents').height(contentsH);
        }
      });
      $(document).find('html').addClass('is-modal-open');
      return false;
    });
  }else{
  /* iframe window */
    //削除処理
    //overlayのクローズ処理
    $(parent.document).find('.js-modal-overlay,.js-modal-contents').click(function(){
      $(Window.top).find('html').removeClass('is-modal-open');
      $(parent.document).find('.js-modal-wrapper').remove();
    });
    //iframe内のクローズ処理
    $(document).find('.js-modal-close').click(function(e) {
      e.preventDefault();
      if (window.parent == window.top) {
        $(parent.document).find('html').removeClass('is-modal-open');
        $(parent.document).find('.js-modal-wrapper').remove();
      }
    });
  }
};






