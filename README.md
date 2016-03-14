# Sketch Copy Editor
Sketch Copy Editor lets writers and designers work together to bring copy updates seamlessly and automatically into the latest version of your designs.

## Installation
1. Download the repository from this [link](https://github.com/zakkain/sketch-copyeditor/archive/master.zip).
2. Grab the `sketch-copyeditor` folder from the ZIP.
3. In Sketch 3, select `Plugins > Reveal Plugins Folder...` from the menu bar, and put the `sketch-copyeditor` folder in this folder.

## Usage
### Creating a copy deck
1. Select a page in your Sketch file. Make sure ALL TEXT LAYERS have a unique name.
2. Run `1. Generate copy deck` from the plugins menu.
3. The copy is saved to a file in CSV format.

### Excluding layers from export
If you would like to exclude a layer from the export, just prefix it using "__".

### For Writers
1. Open the copy deck CSV file in Excel.
2. You will see every piece of copy from the design. The left hand side is the name of the layer in Sketch (DESIGNERS: Name your layers properly so your writer knows what they're looking at!). The right hand side is the copy.
3. Make changes on the right hand side as you see fit.

### Updating your design with the latest copy
1. Select the page in your Sketch file you wish to update.
2. Run `2. Update copy`.
3. Select the CSV translation file for that page.
4. The current page has been copied and translated.
5. IMMEDIATELY save your file, and then close & reopen it. This avoids some weird sketch behaviour/bugs.

## Help me improve Sketch Copy Editor
To propose changes, fork the repository and submit a pull request!

## Questions?
[@markgoetz](http://twitter.com/markdoesnttweet/)
[@zakkain](http://twitter.com/zakkain)
[@ericpuigmarti](http://twitter.com/ericpuigmarti)
[@jofreund](http://twitter.com/jofreund/)

## Attribution
This plugin is forked from @houbenkristof's [Sketch i18n](https://github.com/kristof/sketch-i18n) plugin. I just tweaked some stuff to suit my needs.
