/* TODO
    Loosen Precision i.e. slight variances in page size
*/

//< Menu
app.addMenuItem({
    cName: 'Exception Finder [beta]',
    cParent: submenu_name,
    cExec: "exceptionFinder()"
});

//< Code
exceptionFinder = app.trustedFunction( function(normal_size)   
{
    app.beginPriv();
    if (app.activeDocs.length==0){
        app.alert({ cTitle: 'Error: No Document', cMsg: "Please open a document first!", nIcon: 0 });
    }
    else {
        // Normal Size is Letter if undefined
        if ( normal_size == null ) normal_size = [0,792,612,0];
        
        // Page Sizes
        letter_size = [0,792,612,0];
        tab_size = [0,792,648,0];
        legal_size = [0,1008,612,0];
        tabloid_size = [0,1224,792,0];
        
        tab_pages = []; legal_pages = []; tabloid_pages = []; other_pages = [];   

        exceptions = false;	

        for ( page=0; page<this.numPages; page++ ){
            // Array to hold the page size for the current iteration
            page_size = this.getPageBox({ nPage: page });
            
            // Find by Size
            if ( page_size.toString() == tab_size.toString() ){
                tab_pages.push( page+1 );
                exceptions = true;
            } else if ( page_size.toString() == legal_size.toString() ){
                legal_pages.push( page+1 );
                exceptions = true;
            } else if ( page_size.toString() == tabloid_size.toString() ){
                tabloid_pages.push( page+1 );
                exceptions = true;
            } else if ( page_size.toString() != normal_size.toString() ){
                other_pages.push( page+1 );
                exceptions = true;
            }
        }
        
        // Remove previous field
        field = this.getField("exceptions");
        if (field!=null) this.removeField("exceptions");

        // Show tab pages if there are any
        if ( exceptions  ) {
            rect = this.getPageBox(); // used for field placement
            rect[0] += 36; rect[2] -= 36; // x & width
            rect[1] -= 36; rect[3] = rect[1]-144 // y & height
            f = this.addField( "exceptions", "text", 0, rect );
            f.multiline = true;
            f.textSize = 11;
            f.display = display.noPrint;
            f.value = 'Tab Pages: ' + tab_pages + '\r\n\r\n' + 
                    'Legal Pages: ' + legal_pages + '\r\n\r\n' + 
                    'Tabloid Pages: ' + tabloid_pages + '\r\n\r\n' + 
                    'Other Pages: ' + other_pages;
            app.alert({ cTitle: 'Exception Pages', cMsg: 'Exceptions found, see field on first page!', nIcon: 2 });
        } 
        else
        {
            app.alert({ cTitle: 'Exception Pages', cMsg: "No exceptions were detected.", nIcon: 3 });
        }
    }
    app.endPriv();
});

