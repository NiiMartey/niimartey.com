@extends('layouts.default')

{{-- @section('header')

  @include('partials.header')

@endsection --}}


@section('content')

  <div  class="nd-region">
     <div class = "container-fluid">
        <div  id="Content" class="row">
           <div  id="content-region" class="col-md-12 ">
              <div class="region region-content">
                 <div id="block-system-main" class="block block-system" >
                    <div class = "block-content clearfix ">
                       <div id="node-1" class="node node-page clearfix">
                          <div class="content">
                             <div class="field field-name-body field-type-text-with-summary field-label-hidden">
                                <div class="field-items">
                                   <div class="field-item even">

                                      @include('partials.about')

                                      @include('partials.facts')

                                      @include('partials.services')

                                      @include('partials.portfolio')

                                      @include('partials.team')

                                      <hr  style = 'margin-bottom: 120px;'>

                                      @include('partials.process')

                                      @include('partials.testimonial')

                                      @include('partials.client')

                                      @include('partials.choose')

                                      <hr  style = 'margin-top: 120px; margin-bottom: 120px;'>

                                      @include('partials.blog')

                                      @include('partials.contact')

                                      @include('partials.map')
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <!-- /.block -->
              </div>
              <div id="end-content"></div>
           </div>
        </div>
     </div>
  </div>

@endsection
