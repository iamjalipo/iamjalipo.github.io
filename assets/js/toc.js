/*
 * jQuery to build the POC quickly
 *
 * SCRIPT IS UNDER CONSTRUCTION
 */
var positions = [],
    build_toc = function() {
      var output = '<p>Table of content</p><ul>',
          svg    = '<svg viewBox="0 0 36 36" height="36px" width="36px" y="0px" x="0px"><circle transform="rotate(-90 18 18)" stroke-dashoffset="100" stroke-dasharray="100 100" r="16" cy="18" cx="18" stroke-width="2" fill="none"/></svg>';
  
      $('.post-content').find('h2').each(function(i){
        $(this).attr('id', 'title_' + i)
    
        output += '<li><a href="#title_' + i + '" class="toc-title_' + i + '">' + svg + $(this).text() + '</a></li>';
      });
  
      return output;
    },
    get_bottom_off_content = function() {
      var $content = $('.post-content'),
          offset   = $content.offset();
      
      return $content.outerHeight() + offset.top;
    },
    get_positions = function() {
      $('.post-content').find('h2').each(function( i ){
        offset = $(this).offset();
        positions[ 'title_' + i + 10  ] = offset.top ;
      });
      return positions;
    },
    set_toc_reading = function() {
      var st    = $(document).scrollTop(),
          count = 0;
      
      for (var k in positions) {
        var n        = parseInt( k.replace('title_', '') );
            has_next = typeof positions['title_' + ( n + 1 ) ] !== 'undefined',
            not_next = has_next && st < positions['title_' + ( n + 1 ) ] ? true : false,
            diff     = 0,
            $link    = $( '.toc-' + k );
        
        if ( has_next ) {
          diff = ( st - positions[ k ] ) / ( positions[ 'title_' + ( n + 1 ) ] - positions[ k ] ) * 100;
        } else {
          diff = ( st - positions[ k ] ) / ( get_bottom_off_content() - positions[ k ] ) * 100;
        }
        
        $link.find('circle').attr('stroke-dashoffset', Math.round( 100 - diff ) );
        
        if ( st >= positions[ k ] && not_next && has_next ) {
          $( '.toc-' + k ).addClass('toc-reading');
        } else if ( st >= positions[ k ] && ! not_next && has_next ) {
          $( '.toc-' + k ).removeClass('toc-reading');
        } else if ( st >= positions[ k ] && ! not_next && ! has_next ) {
          $( '.toc-' + k ).addClass('toc-reading');
        }
        
        if ( st >= positions[ k ] ) {
          $( '.toc-' + k ).addClass('toc-already-read');
        } else {
          $( '.toc-' + k ).removeClass('toc-already-read');
        }
        
        if ( st < positions[ k ] ) {
          $( '.toc-' + k ).removeClass('toc-already-read toc-reading');
        }
        
        count++;
      }
    };

// build our table of content
$('.table-of-contents').html( build_toc() );

// first definition of positions
get_positions();

// on resize, re-calc positions
$(window).on('resize', function(){
  get_positions();
});

$(document).on('scroll', function(){
  set_toc_reading();
});