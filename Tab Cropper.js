/* TODO
    Landscape
*/

//< Menu
app.addMenuItem({
    cName: 'Tab Cropper',
    cParent: submenu_name,
    cExec: "tabCropper()"
});

//< Code
tabCropper = app.trustedFunction( function()
{
    app.beginPriv();
    if (app.activeDocs.length==0){
        app.alert({ cTitle: 'Error: No Document', cMsg: "Please open a document first!", nIcon: 0 });
    }
    else {
        count = 0; // Records the number of tabs
        for (i=0;i<this.numPages;i++)
        {
            page_size = this.getPageBox({nPage: i}); //Current Page Size
            tab_size = [0,792,648,0];
            // Javascript can't compare arrays directly...
            if (page_size.toString()==tab_size.toString())
            {
                //Crop 1/2" from left side
                this.setPageBoxes({cBox:"Crop", nStart:i, rBox:[36,792,648,0]});
                count++;
            }
        }
        if (count==0)
        {
            app.alert("No tabs were detected.");
        } 
        else 
        {
            app.alert(count + " Tabs were cropped!");
        }
    }
    app.endPriv();
});