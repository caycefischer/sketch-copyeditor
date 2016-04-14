var com = {};

com.updatecopy = {

    debugLog: function(msg) {
        if(this.debug) log(msg);
    },

    alert: function (msg, title) {
        title = title || 'Sketch Copy Update';
        var app = [NSApplication sharedApplication];
        [app displayDialog:msg withTitle:title];
    },

    getTextLayersForPage: function(page) {
        var layers = [page children],
                textLayers = [];

        for (var i = 0; i < layers.count(); i++) {
            var layer = [layers objectAtIndex:i];
            if (this.isTextLayer(layer)) {
                if (this.isExportTextLayer(layer)) {
                    textLayers.push(layer);
                }
            }
        }

        return textLayers;
    },

    isTextLayer: function(layer) {
        if (layer.class() === MSTextLayer) {
            return true;
        }
        return false;
    },

    isExportTextLayer: function(textLayer) {
        var nameStringValue = unescape(textLayer.name());
        var isVisible = textLayer.isVisible();

        if (nameStringValue.search('__') && isVisible) {
            return true;
        }

        return false;
    },

    localeStringFromTextLayers: function(textLayers) {
        var csv_string = "";

        for (var i = 0; i < textLayers.length; i++) {
            var textLayer = textLayers[i],
                    stringValue = unescape(textLayer.stringValue().replace(/[\r\n]+/g, ' ')),
                    name = unescape(textLayer.name());

            csv_string += "\"" + name + "\";\"" + stringValue + "\"\n";
        }

        return csv_string;
    },
  /* ---------- end markgoetz edits ---------- */


    generateLocaleForPage: function(page) {
        var textLayers = this.getTextLayersForPage(page);
        return this.localeStringFromTextLayers(textLayers);
    },

    generateLocaleForCurrentPage: function() {
        var currentPage = [doc currentPage];
        return this.generateLocaleForPage(currentPage);
    },

    copyStringToClipboard: function(string) {
        var clipboard = NSPasteboard.generalPasteboard();
        clipboard.declareTypes_owner([NSPasteboardTypeString], null);
        clipboard.setString_forType(string , NSPasteboardTypeString);
        this.alert('The copy deck for this Sketch file has been copied to your clipboard, paste it in a text editor and save it as a *.json file for example \'copydeck-V1.json\'.\n\nWhen you are ready to import your changes run \'2. Update Copy\' and pick your json file that contains the updated copy.', null);
        return true;
    },

    saveStringToFile: function(string) {
        try {
            var panel = NSSavePanel.savePanel();
            var extension = NSArray.alloc().initWithObjects("csv", nil);
            panel.setAllowedFileTypes(extension);
            if ([panel runModal] == NSOKButton) {
                var url = [panel URL];
                var cocoaString = [NSString stringWithFormat:"%@", string];
                [cocoaString writeToURL:url atomically:false encoding:NSUTF8StringEncoding error:nil];
            }
            return true;
        }
        catch(e) {
            log(e);
        }
    },

    updatePageWithData: function(page, language, data) {
        var pageName = [page name],
                page = [page copy]
                // page.setName(pageName + ': ' + language),
                page.setName(language),
                textLayers = this.getTextLayersForPage(page),
                errorCount = 0;

        [[doc documentData] addPage:page];

        for (var i = 0; i < textLayers.length; i++) {
            var textLayer = textLayers[i],
                    nameValue = unescape(textLayer.name());

            // THIS
            if(data[nameValue]){
                textLayer.setStringValue(data[nameValue]);
                [textLayer adjustFrameToFit];
            }else{
                errorCount++;
            }
        }

        [doc setCurrentPage:page];

        // add suffix to artboard names
        var artboards = page.artboards();

        var loop = [artboards objectEnumerator]
        while (artboard = loop.nextObject()) {
            // artboard.setName(artboard.name() + "_" + language);
        }

        return errorCount;
    },

     /****************************************
            CSV SECTION!
    /***************************************/

    localeCSVFromTextLayers: function(textLayers) {
        var localeCSVString = 'Label,Copy\r';

        for (var i = 0; i < textLayers.length; i++) {
            var textLayer = textLayers[i],
                    stringValue = unescape(textLayer.stringValue());

            var textLayer2 = textLayers[i],
                stringValue2 = unescape(textLayer2.name());

            var value = '"' + stringValue.replace('\r', ',') + '"';
            var cleanKey = '"' + stringValue2 + '"';
            
            localeCSVString = localeCSVString + cleanKey + ',' + value + '\r';
        }

        return localeCSVString;
    },

    generateCSVForPage: function(page) {
        var textLayers = this.getTextLayersForPage(page);
        return this.localeCSVFromTextLayers(textLayers);
    },

    generateCSVForCurrentPage: function() {
        var currentPage = [doc currentPage];
        return this.generateCSVForPage(currentPage);
    },

    copyStringToCSV: function(string) {
        var outputString = [NSString stringWithFormat:"%@", string];
        var filePath = "/Users/"+ NSUserName() +"/Desktop/copyDeck.csv";

        new AppSandbox().authorize(filePath, function() {});

        [outputString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:nil];
        return true;
    },

    /****************************************
            END CSV SECTION!
    /***************************************/

    updatePageWithFilePicker: function(page) {
      try {
        var openPanel = [NSOpenPanel openPanel];

        var defaultDirectory = [NSURL fileURLWithPath:"~/Documents/"];
        if([doc fileURL]) {
            defaultDirectory = [[doc fileURL] URLByDeletingLastPathComponent]
        }

        [openPanel setCanChooseDirectories:true];
        [openPanel setCanChooseFiles:true];
        [openPanel setAllowedFileTypes:['csv']];
        [openPanel setCanCreateDirectories:false];
        [openPanel setDirectoryURL:defaultDirectory];
        [openPanel setAllowsMultipleSelection: true]

        [openPanel setTitle:"Pick a copy file"];
        [openPanel setPrompt:"Update Copy"];

        if ([openPanel runModal] == NSOKButton) {
            var urls = [openPanel URLs];
            var errorCount = 0;

            var url, filename, getString;

          /* ---------- begin markgoetz edits - parse the file as CSV instead of JSON ---------- */
            // Regular expressions for CSV patterns
            // It's looking for lines in a key,value format
            // Key and value may each be surronded by quotes
            var expressions = [
              /^([^"]+?);([^"]+?)$/mg,
              /^([^"]+?);"([\S\s]+)"$/mg,
              /^"([\S\s]+)";([^"]+?)$/mg,
              /^"([\S\s]+)";"([\S\s]+)"$/mg,
            ];

          var data = {};
            for (var i = 0; i < urls.count(); i++) {
                url = urls[i];
                filename = [[url lastPathComponent] stringByDeletingPathExtension];
                getString = NSString.stringWithContentsOfFile_encoding_error(url, NSUTF8StringEncoding, null);

                if(getString){
                    var contents = getString.toString();

                  // cycle through the 4 regular expressions and gather all the matches
                  for (var r = 0; r < expressions.length; r++) {

                    var result = " ";
                    // put each match into the data object.
                    while (result !== null) {
                      var expression = expressions[r];
                      result = expression.exec(contents);

                      if (result !== null) {
                        debugLog(r + " " + result[0]);

                        var key = result[1];
                        var value = result[2];

                        // Handle quote marks, which are represented as double quotes
                        value = value.replace(/""/g, '"');

                        data[key] = value;
                      }
                    }

                  }

                   /* -------------- end markgoetz edits ------------------ */
                    errorCount += this.updatePageWithData(page, filename, data);
                }
            }
            if (errorCount > 0){
                this.alert('Copy Update completed with ' + errorCount + ' errors.', null);
            }else{
                this.alert('Copy Update completed successfully! \n*** IMPORTANT: Please immediately save your file, close it and then reopen it. This avoids any Sketch bugs or weirdness. ***', null);
            }
        }

        return true;
      }
      catch (e) {
        log(e);
      }
    },

    debug: true

};
