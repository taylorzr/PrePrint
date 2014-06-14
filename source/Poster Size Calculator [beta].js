/* TODO
    multipage documents
    interface for specifying desired size/footage
*/

//< Menu
app.addMenuItem({
    cName: "Poster Size Calculator [beta]",
    cParent: submenu_name,
    cExec: "posterSizeCalculator()"
});

//< Code
posterSizeCalculator = app.trustedFunction( function()
{
    app.beginPriv();
    
    if (app.activeDocs.length==0){
        app.alert({ cTitle: "Error: No Document", cMsg: "Please open a document first!", nIcon: 0 });
    }
    else {
        dimensions = this.getPageBox("Crop", this.pageNum);
        original_width = (dimensions[2] - dimensions[0])/72;
        original_height = (dimensions[1] - dimensions[3])/72;

        // this value will eventually come from the gui
        target_area = 6;

        original_area = original_width * original_height / 144;
        multiplier = Math.sqrt(target_area / original_area);

        target_width = original_width * multiplier;
        target_height = original_height * multiplier;

        //Round down each dimension to 2 decimal places
        rounded_width = Math.floor(target_width * 100) / 100;
        rounded_height = Math.floor(target_height * 100) / 100;

        //Verify square footage
        calculated_area = Math.round(rounded_width * rounded_height / 144);

        app.alert( "Size: " + rounded_width + " wide, " + rounded_height + " high, " + calculated_area + " sq. ft." , 1);
    }
    
    app.endPriv();
});