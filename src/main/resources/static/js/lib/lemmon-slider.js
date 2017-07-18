/*
 * Lemmon Slider - jQuery Plugin
 * Simple and lightweight slider/carousel supporting variable elements/images widths.
 *
 * Examples and documentation at: http://jquery.lemmonjuice.com/plugins/slider-variable-widths.php
 *
 * Copyright (c) 2011 Jakub Pelák <jpelak@gmail.com>
 *
 * Version: 0.2 (9/6/2011)
 * Requires: jQuery v1.4+
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function( $ ){

	var methods = {
		//
		// Initialzie plugin
		//
		init : function(options){

			var options = $.extend({}, $.fn.lemmonSlider.defaults, options);

			return this.each(function(){

				var $slider = $( this ),
				    data = $slider.data( 'slider' );

				if ( ! data ){

					var $sliderContainer = $slider.find(options.slider),
					    $sliderControls = $slider.next().filter('.controls'),
					    $items = $sliderContainer.find( options.items ),
					    originalWidth = 1;

					$items.each(function(){ originalWidth += $(this).outerWidth(true) });
					$sliderContainer.width( originalWidth );

					if($slider.outerWidth(true) < originalWidth){
						$sliderControls.removeClass('hidden');
						$sliderControls.find('.prev-page').hide();
					}

					// slide to last item
					if ( options.slideToLast ) $sliderContainer.css( 'padding-right', $slider.width() );

					$slider.items = $items;
					$slider.options = options;

					// first item
					//$items.filter( ':first' ).addClass( 'active' );

					// attach events				
					$slider.bind( 'nextPage', function( e, t ){

						var scroll = $slider.scrollLeft();
						var w = $slider.width();
						var x = 0;
						var slide = 0;
						var len = $items.length;
						var lastP;

						$items.each(function( i ){
							if ( $( this ).position().left < w  && $( this ).position().left > 1){
								x = $( this ).position().left;
								slide = i;
							}
							if(i == len-1){
								lastP = $( this ).position().left;
							}
						});

						if ( x > 0 && scroll + w + 1 < originalWidth ){
							slideTo( e, $slider, scroll+x, slide, 'slow' );
						} else if ( options.loop ){
							// return to first
							slideTo( e, $slider, 0, 0, 'slow' );
						}

					});
					$slider.bind( 'prevPage', function( e, t ){

						var scroll = $slider.scrollLeft();
						var w = $slider.width();
						var x = 0;

						$items.each(function( i ){
							if ( $( this ).position().left < 1 - w ){
								x = $( this ).next().position().left;
								slide = i;
							}
						});

						if ( scroll ){
							if ( x == 0 ){
								slideTo( e, $slider, 0, 0, 'slow' );
							} else {
								slideTo( e, $slider, scroll+x, slide, 'slow' );
							}
						} else if ( options.loop ) {
							// return to last
							var a = $sliderContainer.outerWidth() - $slider.width();
							var b = $items.filter( ':last' ).position().left;
							if ( a > b ){
								$slider.animate({ 'scrollLeft' : b }, 'slow' );
							} else {
								$slider.animate({ 'scrollLeft' : a }, 'slow' );
							}
						}

					});
					$slider.bind( 'slideTo', function( e, i, t ){

						slideTo(
							e, $slider,
							$slider.scrollLeft() + $items.filter( ':eq(' + i +')' ).position().left,
							i, t );

					});

			
					$sliderControls.find( '.next-page' ).click(function(){
						$slider.trigger( 'nextPage' );
						return false;
					});
					$sliderControls.find( '.prev-page' ).click(function(){
						$slider.trigger( 'prevPage' );
						return false;
					});

					//if ( typeof $slider.options.create == 'function' ) $slider.options.create();

					$slider.data( 'slider', {
						'target'  : $slider,
						'options' : options
					})

				}

			});

		},
		//
		// Destroy plugin
		//
		destroy : function(){

			return this.each(function(){

				var $slider = $( this ),
				    $sliderControls = $slider.next().filter( '.controls' ),
				    $items = $slider.find('> *:first > *'),
				    data = $slider.data( 'slider' );

				$slider.unbind( 'nextPage' );
				$slider.unbind( 'prevPage' );
				$slider.unbind( 'slideTo' );

				$sliderControls.find( '.next-page' ).unbind( 'click' );
				$sliderControls.find( '.next-page' ).unbind( 'click' );

				$slider.removeData( 'slider' );

			});

		}
		//
		//
		//
	}
	//
	// Private functions
	//
	function slideTo( e, $slider, x, i, t ){
		var $sliderControls = $slider.next().filter('.controls');
		$slider.items.filter( 'li:eq(' + i + ')' ).addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );

		if(x > 0){
			$sliderControls.find('.prev-page').show();
		}
		else {
			$sliderControls.find('.prev-page').hide();
		}

		if ( typeof t == 'undefined' ){
			t = 'fast';
		}
		if ( t ){
			$slider.animate({ 'scrollLeft' : x }, t, function(){
				var lastEle = $slider.items.filter('li').last()
				var lastPaddingRight = parseInt(lastEle.find('a').css("padding-right").replace('px',''));
				var lastScroll = Math.floor(lastEle.position().left + lastEle.outerWidth(true));
				var sliderWidth = $slider.outerWidth(true);
				debug((lastScroll-sliderWidth)+"--"+ lastPaddingRight);

				//if((x-lastPostion) == $slider.scrollLeft()){
				if((lastScroll-sliderWidth) < lastPaddingRight){
					$sliderControls.find('.next-page').hide();
				}else{
					$sliderControls.find('.next-page').show();
				}

			});
		} else {
			var time = 0;
			$slider.scrollLeft( x );
		}



		//if ( typeof $slider.options.slide == 'function' ) $slider.options.slide( e, i, time );

	}

	//
	// Debug
	//
	function debug( text ){
		console.log(text);
	}
	//
	//
	//
	$.fn.lemmonSlider = function( method , options ){
		if (options == null) { options = {}; };
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || !method ){
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.lemmonSlider' );
		}
	};
	//
	//
	//
	$.fn.lemmonSlider.defaults = {
		'items'       : '> *',
		'loop'        : false,
		'slideToLast' : false,
		'slider'      : '> *:first'
	}

})( jQuery );
