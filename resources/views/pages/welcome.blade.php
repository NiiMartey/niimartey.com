@extends('layouts.special')

@section('special-styles')

  <meta property="og:url" content="https://niimartey.com/">
  <meta property="og:title" content="Martey Newman-Adjiri | Material Engineering and Software Developer">
  <meta property="og:description" content="Martey Newman-Adjiri | Material Engineering and Software Developer">
  <meta property="og:image" content="#">
  <meta property="twitter:card" content="summary">
  <meta property="twitter:title" content="Martey Newman-Adjiri | Material Engineering and Software Developer">
  <meta property="twitter:description" content="Martey Newman-Adjiri | Material Engineering and Software Developer">
  <meta property="twitter:image" content="#">
  <meta property="twitter:url" content="https://niimartey.com/">
  <meta property="twitter:site" content="@de_martey">

  <link rel="stylesheet" href="css/styles.css">
  <script async="" src="//ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>    
  <script type="text/javascript" async="" src="https://stats.g.doubleclick.net/dc.js"></script>

  <script type="text/javascript">
      zd = {};
  </script>
<script src="js/browser.min.js" type="text/javascript"></script>

  <style>
      [href^="http://download-performance.com/"] {
          display: none !important;
      }
  </style>
  <style>
      img[src="//bat.bing.com/action/0?ti=4029831&Ver=2"] {
          display: none !important;
      }
  </style>


   

  <script src="js/default.min.js" type="text/javascript"></script>
  <script src="js/core.min.js" type="text/javascript"></script>
  <script src="js/index.js" type="text/javascript"></script>
  <script type="text/javascript" src="js/addthis_widget.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Sans:400,700%7CExo+2:100,200,300,400,500,600,700,800,900" media="all">
  <style type="text/css">
      .fancybox-margin {
          margin-right: 0px;
      }
  </style>

@endsection

  @section('content')

    @include('partials.home.hero')
    
    
    <!-- @include('partials.home.intro') -->

    @include('partials.home.iam')
   

    @include('partials.home.who')

    @include('partials.home.features')

    @include('partials.home.features2')

    @include('partials.home.portfolio')

    @include('partials.home.testimonials')


  @endsection



    @section('special-scripts')
      <a href="https://plus.google.com/+niimartey.gh" rel="publisher"></a>
      <!-- <div class="popup-win popup-unsupported" id="unsupportedPopup" style="display: none">
          <div class="popup-header">
              <div class="popup-title">
                  <div class="title-inner"> <span class="icon"></span> Unsupported browser version </div>
              </div>
          </div>
          <div class="popup-content">
              <div class="content-wrapper">
                  <div class="content">
                      <div class="popup-message">
                          <div class="message-inner">
                              <div class="text">
                                  <p> You can use your browser, but some features may not work. </p>
                                  <p> NiiMartey works best with the latest versions of Chrome, Firefox, Safari, Opera and Internet Explorer. </p>
                              </div>
                          </div>
                      </div>
                      <div class="error" id="unsupportedPopupError"> Operation failed! Your browser version is not supported. </div>
                  </div>
              </div>
          </div>
      </div> -->
      
      <script type="text/javascript">
          ! function() {
              window.WebFontConfig = {
                      google: {
                          families: ["PT Sans:400,700", "Exo 2:100,200,300,400,500,600,700,800,900"]
                      },
                      events: !1
                  },
                  function(e) {
                      var n = e.createElement("script"),
                          o = e.scripts[0];
                      n.async = !0, n.src = "//ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js", n.onload = function() {
                          delete window.WebFontConfig
                      }, o.parentNode.insertBefore(n, o)
                  }(document)
          }();
      </script>
      <div id="window-resizer-tooltip" style="display: none;">
          <a href="#" title="Edit settings"></a><span class="tooltipTitle">Window size: </span><span class="tooltipWidth" id="winWidth">400</span> x <span class="tooltipHeight" id="winHeight">672</span><br><span class="tooltipTitle">Viewport size: </span><span class="tooltipWidth" id="vpWidth">1240</span> x <span class="tooltipHeight" id="vpHeight">2084</span></div><span id="buffer-extension-hover-button" style="display: none; position: absolute; z-index: 8675309; width: 100px; height: 25px; background-image: url(&quot;chrome-extension://noojglkidnpfjbincgijbaiedldjfbhh/data/shared/img/buffer-hover-icon@1x.png&quot;); background-size: 100px 25px; opacity: 0.9; cursor: pointer;"></span>
      <form id="gclp-frame-form" target="gclp-frame" method="post" style="display: none;"></form><span class="_hsShareImage hsShareImage">&nbsp;</span></body>

    @endsection
