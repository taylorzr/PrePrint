/* TODO
	
*/

//< Menu
app.addMenuItem({
    cName: "Slipsheet Finder",
    cParent: submenu_name,
    cExec: "slipsheetFinder()"
});

//< Code
slipsheetFinder = app.trustedFunction( function()
{
    app.beginPriv();
    if (app.activeDocs.length==0){
        app.alert({ cTitle: "Error: No Document", cMsg: "Please open a document first!", nIcon: 0 });
    }
    else {
        slipsheets = this.getField("Slipsheet")
        
        // Check if there are any slipsheet forms
        if (slipsheets){
            slipsheets = slipsheets.page;

            // Change the list of pages numbers from base-0 to base-1
            for (i=0; i<slipsheets.length; i++){
                slipsheets[i] = slipsheets[i] + 1;
            }

            // Ensure listed is sorted
            slipsheets.sort(function(a,b){return a - b});

            // Display list
            if ( slipsheets.length > 0 ) {
                app.response({ 
                    cTitle: "Slipsheet Pages", 
                    cQuestion: "Copy slipsheet pages below:", 
                    cDefault: slipsheets.toString() 
                })
            }
        } else {
            app.alert({ cTitle: 'Slipsheet Pages', cMsg: "No slipsheets were detected.", nIcon: 3 });
        }
    }
    app.endPriv();
});