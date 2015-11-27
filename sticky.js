angular.module("sticky", []).directive("sticky", function($window) {
  return {
    link: function(scope, element, attrs) {

      var $win = angular.element($window);

      if (scope._stickyElements === undefined) {
        scope._stickyElements = [];

        $win.bind("scroll.sticky", function(e) {
          var pos = $win.scrollTop();
          for (var i=0; i<scope._stickyElements.length; i++) {

            var item = scope._stickyElements[i];

            if (!item.isStuck && pos > item.start) {
              item.element.addClass("stuck");
              item.isStuck = true;

              if (item.placeholder) {
                item.placeholder = angular.element("<div></div>")
                  .css({height: item.element.outerHeight() + "px"})
                  .insertBefore(item.element);
              }
            }
            else if (item.isStuck && pos < item.start) {
              item.element.removeClass("stuck");
              item.isStuck = false;

              if (item.placeholder) {
                item.placeholder.remove();
                item.placeholder = true;
              }
            }
            checkItemWidth(item);
          }
        });

        var recheckPositions = function() {
          for (var i=0; i<scope._stickyElements.length; i++) {
            var item = scope._stickyElements[i];
            if (!item.isStuck) {
              item.start = item.element.offset().top;
            } else if (item.placeholder) {
              item.start = item.placeholder.offset().top;
            }
            checkItemWidth(item);
          }
        };
        function checkItemWidth(item) {
          if (!item.parentWidth) {
            return;
          }
          item.element.css({
            width: item.isStuck ? (item.parent.innerWidth() + 'px') : '',
            left: item.isStuck ? ((item.parent.offset().left - window.scrollX) + 'px') : ''
          });
        };
        $win.bind("load", recheckPositions);
        $win.bind("resize", recheckPositions);
      }

      var item = {
        element: element,
        parent: element.parent(),
        isStuck: false,
        placeholder: attrs.usePlaceholder !== undefined,
        parentWidth: attrs.parentWidth !== undefined,
        start: element.offset().top
      };

      scope._stickyElements.push(item);

    }
  };
});