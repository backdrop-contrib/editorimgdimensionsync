# Editor Image Dimension Sync

This small module enhances the CKEditor image selection dialog.

It synchronizes the image dimensions while editing, to preserve the image ratio.

Additionally provides a button to reset to the original image dimensions when
 they have been changed.

## Installation

- Install this module using the official 
  [Backdrop CMS instructions](https://docs.backdropcms.org/documentation/extend-with-modules)

## Issues

Bugs and Feature requests should be reported in the 
 [Issue Queue](https://github.com/backdrop-contrib/editorimgdimensionsync/issues)

## Known Issues

Switching between "Upload an image" and "Select from library" may cause the
reset button to lose track of dimensions. In that case close the dialog and
open it again. (Switching isn't recommended, anyway, as it causes other
unexpected behavior in the dialog.)

## Current Maintainers

- [Indigoxela](https://github.com/indigoxela)

## License

This project is GPL v2 software. See the LICENSE.txt file in this directory for complete text.
