<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=1240, user-scalable=yes">
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <title>Martey Newman-Adjiri | Material Engineering and Software Developer</title>
    <meta name="description" content="Martey Newman-Adjiri | Material Engineering and Software Developer">
    <link rel="icon" href="#" type="image/x-icon">
    <link rel="shortcut icon" href="#" type="image/x-icon">
    @yield('special-styles')

</head>

<body data-gr-c-s-loaded="true" style="" data-gclp-initialized="true" data-gistbox-initialized="true" cz-shortcut-listen="true" draggable="false">
    <div id="mainContainer" class="index-page" draggable="false">
        <div class="index-tab index-page" draggable="false">
            <header class="index-header-wrapper" draggable="false">
                <div class="index-tab-content" data-id="headerWrapper" draggable="false">
                    <div class="index-header" draggable="false"><a href="/" class="logo"><span class="site-logo"><span class="icon"></span><span class="name"><b>Nii</b>Martey</span></span></a>
                        <div class="options" draggable="false">
                            <ul draggable="false">
                                <li><a class="link" href="/about">About</a></li>
                                <li><a class="link" href="/blog/news/">News:<span class="name">TechMaterials</span></a></li>
                                <li draggable="false"><a class="link" href="/blog" target="" draggable="false">Blog</a></li>
                                <div class="clear"></div>
                            </ul>
                        </div>
                        <div class="tools"><a href="#" class="login"><i></i>Contact</a></div>
                    </div>
                </div>
            </header>
            <section class="index-content-wrapper" data-background="#" draggable="false" style="background-image: url('img/bg-index.jpg');">
                <div data-id="slidesWrapper" draggable="false">

                    @yield('content')

                </div>
                <aside class="index-footer-bg"></aside>
            </section>
            <footer class="index-footer-wrapper">
                @include('partials.home.footer')

            </footer>
        </div>
    </div>
    @yield('special-scripts')
  </body>

</html>
