`watermark` is a Node.js based utility for (optionally) resizing multiple images and adding a translucent watermark text.

External dependencies that `npm` will not install include [GraphicsMagick](http://www.graphicsmagick.org/) and [Ghostscript](http://www.ghostscript.com/). Install these using your system package manager or packages from their web sites.

    Usage:
      watermark [OPTIONS] [ARGS]

    Options:
      -h, --help : Help
      -v, --version : Version
      -w WIDTH, --width=WIDTH : Maximum width
      -h HEIGHT, --height=HEIGHT : Maximum height
      -o OUT, --out=OUT : Output directory
      --inplace : Change files in place
      -t TEXT, --text=TEXT : Text for watermark
      --font=FONT : Font (default: Helvetica)
      --size=SIZE : Font size
      --color=COLOR : Text color name or RGB hex code
      -a OPACITY, --opacity=OPACITY : Opacity (0-100, default 35)
      -x XPOS, --xpos=XPOS : left, right, or center text (default center)
      -y YPOS, --ypos=YPOS : top, bottom, or center text (default center)

    Arguments:
      PATHS : File(s) to process
