# Sketch Copy Editor
Sketch Copy Editor lets writers and designers work together to bring copy updates seamlessly and automatically into the latest version of your designs.

## Installation
1. Download the repository from this [link](https://github.com/zakkain/sketch-copyeditor/archive/master.zip).
2. Grab the `sketch-copyeditor` folder from the ZIP.
3. In Sketch 3, select `Plugins > Reveal Plugins Folder...` from the menu bar, and put the `sketch-copyeditor` folder in this folder.

## Usage
### Creating a copy deck
1. Select a page in your Sketch file.
2. Run `1. Generate copy deck` from the plugins menu.
3. All the copy from your design is now in your clipboard.
4. Create a blank file in your text editor and paste in the contents of your clipboard.
6. Save the file as a JSON file for example: `copydeck_V1.json`.

### For Writers
1. Open the copy deck JSON file
2. You will see every piece of copy from the design. The left hand side is the name of the layer in Sketch (DESIGNERS: Name your layers properly so your writer knows what they're looking at!). The right hand side is the copy.
3. Make changes on the right hand side as you see fit.

### Updating your design with the latest copy
1. Select the page in your Sketch file you wish to update.
2. Run `2. Update copy`.
3. Select the JSON translation file for that page.
4. The current page has been copied and translated.
5. IMMEDIATELY save your file, and then close & reopen it. This avoids some weird sketch behaviour/bugs.

## Help me improve Sketch Copy Editor
To propose changes, fork the repository and submit a pull request!

## Questions?
[@zakkain](http://twitter.com/zakkain)

## Attribution
This plugin is a fork of [(Florian Schulz's)](https://github.com/getflourish) [Sketch i18n](https://github.com/kristof/sketch-i18n) plugin. I could not have done this without him doing all the hard work first.
