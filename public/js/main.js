'use strict';

(function() {
//$(document).ready(function() {

$('.post-list > li').on('click', function() {
  $(this).children('pre').slideToggle();
});

//});
})(jQuery);
