(function($) {
'use strict';

$('.post-list > li')
  .on('click', function() {
    $(this).children('pre').slideToggle();
  })
  .on('click', 'a', function(e) {
    e.stopPropagation();
  });

})(jQuery);
