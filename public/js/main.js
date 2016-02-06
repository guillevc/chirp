(function() {
'use strict';

$('.post-list > li')
  .on('click', function() {
    $(this).children('pre').slideToggle();
  })
  .children('a').on('click', function(e) {
    e.stopPropagation();
  });

})(jQuery);
