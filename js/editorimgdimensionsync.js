/**
 * @file
 * Overrides Backdrop.behaviors.editorImageLibrary from Filter module.
 */
(function ($) {
  Backdrop.behaviors.editorImageLibrary = {
    attach: function (context, settings) {
      // The context may be the image library div itself, so include the context
      // element in the selector.
      $('[data-editor-library-view]')
        .once('editor-library-view')
        .on('click', '.image-library-choose-file', function() {
          var $libraryFile = $(this);
          var $selectedImg = $libraryFile.find('img');
          var absoluteImgSrc = $selectedImg.data('file-url');
          var relativeImgSrc = Backdrop.relativeUrl(absoluteImgSrc);

          var $form = $('.filter-format-editor-image-form');
          $form.find('[name="attributes[src]"]').val(relativeImgSrc).trigger('change');
          $form.find('[name="fid[fid]"]').val($selectedImg.data('fid'));

          // Remove style from previous selection.
          $('.image-library-image-selected').removeClass('image-library-image-selected');
          // Add style to this selection.
          $libraryFile.addClass('image-library-image-selected');
        })
        .on('dblclick', '.image-library-choose-file', function() {
          var $libraryFile = $(this);
          $libraryFile.trigger('click');
          var $form = $libraryFile.closest('.ui-dialog-content').find('form');
          var $submit = $form.find('.form-actions input[type=submit]:first');
          $submit.trigger('mousedown').trigger('click').trigger('mouseup');
        });

      // Lock image aspect ratio and keep in sync. Custom adaptions start here.
      var naturalDimensions = {
        width: null,
        height: null
      };
      $('.filter-format-editor-image-form .editor-image-size').once('append-button', function() {
        var label = Backdrop.t('Reset to original');
        $(this).append('<button type="button" class="reset-orig" disabled title="' + label + '" data-dimensions="">' + label + '</button>');
      });
      $('.filter-format-editor-image-form .editor-image-size button.reset-orig').on('click', function() {
        Backdrop.behaviors.editorImageLibrary.imageDimensionsSet($(this).data('data-dimensions'));
        Backdrop.behaviors.editorImageLibrary.setButtonState($(this).data('data-dimensions'));
      });
      // When editing a previously added image or upload a new one.
      var existingFile = $('.filter-format-editor-image-form .form-managed-file a').attr('href');
      if (typeof existingFile !== 'undefined') {
        let img = new Image();
        img.onload = function() {
          naturalDimensions.width = this.width;
          naturalDimensions.height = this.height;
          Backdrop.behaviors.editorImageLibrary.resetDataAttr(naturalDimensions);
          if (!$('.filter-format-editor-image-form [name="attributes[width]"]').val().length) {
            Backdrop.behaviors.editorImageLibrary.imageDimensionsSet(naturalDimensions);
          }
          Backdrop.behaviors.editorImageLibrary.syncAspectRatio(naturalDimensions);
          Backdrop.behaviors.editorImageLibrary.setButtonState(naturalDimensions);

        }
        img.onerror = function() {
          naturalDimensions.width = null;
          naturalDimensions.height = null;
        }
        img.src = existingFile;
      }
      else if ($('.filter-format-editor-image-form [name="attributes[width]"]').length) {
        // After an image has been removed via button, and the managed form item
        // reloads, reset width and height.
        if ($('.filter-format-editor-image-form [name="attributes[width]"]').val().length) {
          naturalDimensions.width = null;
          naturalDimensions.height = null;
          Backdrop.behaviors.editorImageLibrary.resetDataAttr(naturalDimensions);
          Backdrop.behaviors.editorImageLibrary.imageDimensionsEmpty();
        }
      }

      // Selecting an image from library updates width and height values.
      $('.filter-format-editor-image-form [name="attributes[src]"]').once('filter-editor-img-src').on('change', function() {
        let img = new Image();
        img.onload = function() {
          naturalDimensions.width = this.width;
          naturalDimensions.height = this.height;
          Backdrop.behaviors.editorImageLibrary.resetDataAttr(naturalDimensions);
          Backdrop.behaviors.editorImageLibrary.imageDimensionsSet(naturalDimensions);
          Backdrop.behaviors.editorImageLibrary.syncAspectRatio(naturalDimensions);
          Backdrop.behaviors.editorImageLibrary.setButtonState(naturalDimensions);
        }
        img.onerror = function() {
          naturalDimensions.width = null;
          naturalDimensions.height = null;
          Backdrop.behaviors.editorImageLibrary.imageDimensionsEmpty();
        }
        img.src = this.value;
      });
    },
    /**
     * Helper function to empty the width and height form items.
     */
    imageDimensionsEmpty: function() {
      $('.filter-format-editor-image-form [name="attributes[width]"]').val('');
      $('.filter-format-editor-image-form [name="attributes[height]"]').val('');
      $('.filter-format-editor-image-form .editor-image-size button.reset-orig').attr('disabled', '');
    },
    /**
     * Helper funtion to set width and height values.
     */
    imageDimensionsSet: function(values) {
      $('.filter-format-editor-image-form [name="attributes[width]"]').val(values.width);
      $('.filter-format-editor-image-form [name="attributes[height]"]').val(values.height);
    },
    /**
     * Remove previous event listeners, add new ones with current dimensions.
     *
     * Keep width and height input values in sync based on the natural image
     * dimensions.
     */
    syncAspectRatio: function(naturalDimensions) {
      $('.filter-format-editor-image-form [name="attributes[width]"]').off('change').on('change', function() {
        var newHeight = Math.round(this.value / naturalDimensions.width * naturalDimensions.height);
        $('.filter-format-editor-image-form [name="attributes[height]"]').val(newHeight);
      });
      $('.filter-format-editor-image-form [name="attributes[height]"]').off('change').on('change', function() {
        var newWidth = Math.round(this.value / naturalDimensions.height * naturalDimensions.width);
        $('.filter-format-editor-image-form [name="attributes[width]"]').val(newWidth);
        Backdrop.behaviors.editorImageLibrary.setButtonState(naturalDimensions);
      });
    },
    /**
     * Update the data-dimensions attribute value.
     */
    resetDataAttr: function(naturalDimensions) {
      $('.filter-format-editor-image-form .editor-image-size button.reset-orig').data('data-dimensions', naturalDimensions);
    },
    /**
     * Update the disabled state of the button.
     */
    setButtonState: function(naturalDimensions) {
      var $button = $('.filter-format-editor-image-form .editor-image-size button.reset-orig');
      var curWidth = $('.filter-format-editor-image-form [name="attributes[width]"]').val();
      if (curWidth.length && $button.data('data-dimensions').width != curWidth) {
        $button.removeAttr('disabled');
      }
      else {
        $button.attr('disabled', '');
      }
    }
  };
})(jQuery);
