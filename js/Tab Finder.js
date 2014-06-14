/* TODO
	
*/

//< Menu
app.addMenuItem({
    cName: 'Tab Finder',
    cParent: submenu_name,
    cExec: "tabFinder()"
});

//< Code
tabFinder = app.trustedFunction( function()
{
    app.beginPriv();
    if (app.activeDocs.length==0){
        app.alert({ cTitle: 'Error: No Document', cMsg: "Please open a document first!", nIcon: 0 });
    }
    else {
        // 9in x 11in Tab Size
        tab_size = [0,792,648,0];

        // Empty array to hold page numbers containing tabs
        tab_pages = [];
        count = 0;

        for ( page=0; page<this.numPages; page++ ){
            // Array to hold the page size for the current iteration
            page_size = this.getPageBox({ nPage: page });
            
            // Find by Size
            if ( page_size.toString() == tab_size.toString() ){
                tab_pages.push( page+1 );
                count++;
            } 
        }

        
        // Show tab pages if there are any
            if ( tab_pages.length > 0 ) {
                // app.response allows user to copy text
                app.response({ cTitle: 'Tab Pages', cQuestion: 'Copy \& paste tab pages below:', cDefault: tab_pages.toString() })
            } else {
                app.alert({ cTitle: 'Tab Pages', cMsg: "No tabs were detected.", nIcon: 3 });
            }
    }
    app.endPriv();
});
    