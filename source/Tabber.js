/* TODO
	Change Autofill from list to a generator function
*/

//< Menu
app.addMenuItem({
    cName: 'Tabber',
    cParent: submenu_name,
    cExec: "run_tabber()"
});

//< Run 
run_tabber = app.trustedFunction( function( mode ){
    if ( mode == null ){ mode = 'new'; }
    app.beginPriv();
        if ( mode == 'modify' ){
            document = app.newDoc();
            document.addScript( 'Tabber Source', 'tabber_source = ' + this.tabber_source.toSource() );
            app.execDialog( monitor = tabber_dialog, parentDoc = document );
        }
        else {
            app.execDialog( monitor = tabber_dialog, parentDoc = app.newDoc() );
        }
    app.endPriv();
});

//< Common Lists
numeric_list = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100 ];
            
roman_list = [ "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
"XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
"XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX" ];
            
alphabetic_list = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
"M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];


//< Interface
tabber_dialog = {

    initialize: function( dialog ) {
        if ( parentDoc.tabber_source ){
            dialog.defaults = parentDoc.tabber_source;
        } else {
            dialog.defaults = {
                text: 'Tab 1\nTab 2\nTab 3\n...',
                anum: '10',
                lsts: {
                    'Numeric': +1,
                    'Roman': -2,
                    'Alphabetic': -3
                },
                dlim: {
                    'Line Break': +1,
                    'Comma': -2
                },
                font: {
                    'Helvetica': +1,
                    'Helvetica Oblique': -2,
                    'Helvetica Bold': -3,
                    'Helvetica Bold Oblique': -4,
                    'Times New Roman': -5,
                    'Times New Roman Italic': -6,
                    'Times New Roman Bold': -7,
                    'Times New Roman Bold Italic': -8,
                },
                txsz: { 
                    '9': -9,
                    '10': -10,
                    '11': +11,
                    '12': -12,
                    '13': -13,
                    '14': -14,
                    '15': -15,
                    '16': -16,
                    '17': -17,
                    '18': -18,
                    '19': -19,
                    '20': -20,
                    '21': -21,
                    '22': -22,
                    '23': -23,
                    '24': -24
                },
                algn: {
                    'Left': -1,
                    'Center': +2,
                    'Right': -3
                },
                dirc: {
                    'Text In': +1,
                    'Text Out': -2,
                    'Vertical': -3
                },
                colr: {
                    'Black': +1,
                    'Red': -2,
                    'Green': -3,
                    'Blue': -4,
                    'Grey': -5
                },
                pgsz: {
                    '8.5" x 11"': -2,
                    '9" x 11"': +1
                },
                orin: {
                    'Portrait': +1,
                    'Landscape': -2
                },
                xmrg: '0.2',
                ymrg: '0.2',
                bank: '5',
                padl: true
            }
        }       
        dialog.load( dialog.defaults );
    },
    
    destroy: function( dialog ){
        if ( parentDoc.getField('modify') == null ){
            parentDoc.closeDoc( true );
        }
    },
        
    cancel: function( dialog ){
        if ( parentDoc.getField('modify') == null ){
            parentDoc.closeDoc( true );
        }
    },
    
    auto: function( dialog ){
        // Find selected item
        results = dialog.store();
        // If the item is a popup, the selected value will be a positive number
        for ( item in results ){
            if ( typeof( results[item] ) == 'object' ){
                for ( i in results[item] ){
                    if ( results[item][i] > 0 ){
                        results[item] = i;
                    }
                }
            }
        }
        
        // Associate selected list
        switch( results['lsts'] ){
            case 'Numeric': list = numeric_list; break;
            case 'Roman': list = roman_list; break;
            case 'Alphabetic': list = alphabetic_list; break;
            default: list = []
        }
        
        // Slice, covert to string and load
        list = list.slice( 0, results['anum'] );
        list = list.join('\r\n'); // Need to update to get selected delimiter
        dialog.load( {text: list} );
    },        
    
    commit: function( dialog ){
        results = dialog.store();
        // If buttons are left in the object, they will be blank when the tabs are modified
        buttons = [ 'ok', 'cancel', 'auto' ]
        for ( i in buttons ){
            delete results[buttons[i]];
        }
        source = results.toSource();
        
        
        // If the item is a popup, the selected value will be a positive number
        for ( item in results ){
            if ( typeof( results[item] ) == 'object' ){
                for ( i in results[item] ){
                    if ( results[item][i] > 0 ){
                        results[item] = i;
                    }
                }
            }
        }
        
        switch( results['pgsz'] ){
            case '9" x 11"': results['pgsz'] = [9*inch,11*inch]; break;
            case '8.5" x 11"': results['pgsz'] = [8.5*inch,11*inch]; break;
            default: results['pgsz'] = [9*inch,11*inch];
        }
        
        switch( results['font'] ){
            case 'Helvetica': results['font'] = 'Helv'; break;
            case 'Helvetica Oblique': results['font'] = 'HelvI'; break;
            case 'Helvetica Bold': results['font'] = 'HelvB'; break;
            case 'Helvetica Bold Oblique': results['font'] = 'HelvBI'; break;
            case 'Times New Roman': results['font'] = 'Times'; break;
            case 'Times New Roman Italic': results['font'] = 'TimesI'; break;
            case 'Times New Roman Bold': results['font'] = 'TimesB'; break;
            case 'Times New Roman Bold Italic': results['font'] = 'TimesBI'; break;
            default: results['font'] = 'Helv';
        }
        
        switch( results['dirc'] ){
            case 'Text In': results['dirc'] = 270; break;
            case 'Text Out': results['dirc'] = 90; break;
            case 'Vertical':  results['dirc'] = 0; break;
            default: results['dirc'] = 270;
        }
        
        if ( parentDoc.getField('modify') ){
            modify = true;
        } else {
            modify = false;
        }
        
        tabber ( results['text'].split('\r\n'), results['font'], parseInt(results['txsz']),
                    results['algn'].toLowerCase(), results['dirc'], results['colr'].toLowerCase(),
                    results['pgsz'], results['orin'].toLowerCase(), .5*inch, .75*inch,
                    parseFloat(results['xmrg'])*inch, parseFloat(results['ymrg'])*inch, 
                    parseInt(results['bank']), results['pad'], parentDoc, source, modify );
    },
    
    description: {
        name: 'Tabber',
        first_tab: 'text',
        elements: [
                    {
                        type: 'view',
                        align_children: 'align_fill',
                        elements: [
                            {
                                type: 'cluster',
                                name: 'Tab Text',
                                align_children: 'align_left',
                                elements: [
                                    {
                                        type: 'view',
                                        width: 500,
                                        align_children: 'align_row',
                                        elements: [
                                            {
                                                type: 'edit_text',
                                                item_id: 'anum',
                                                width: 50,
                                            },
                                            {
                                                type: 'popup',
                                                item_id: 'lsts',
                                                width: 75,
                                            },
                                            {
                                                type: 'button',
                                                item_id: 'auto',
                                                name: 'Autofill',
                                            },
                                            // {
                                                // type: 'static_text',
                                                // name: 'Delimiter:',
                                            // },
                                            // {
                                                // type: 'popup',
                                                // item_id: 'dlim',
                                                // width: 100,
                                            // }
                                        ]
                                    },
                                    {
                                        type: 'edit_text',
                                        item_id: 'text',
                                        width: 500,
                                        height: 200,
                                        multiline: true,
                                    }
                                ]
                            },
                           
                            {
                                type: 'view',
                                align_children: 'align_distribute',
                                elements: [                                   
                                    {
                                        type: 'cluster',
                                        name: 'Text Options',
                                        align_children: 'align_left',
                                        elements: [
                                            { // TEXT OPTIONS ROW 1
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Font:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'font',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            { // TEXT OPTIONS ROW 2
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Size:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'txsz',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            { // TEXT OPTIONS ROW 3
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Align:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'algn',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            { // TEXT OPTIONS ROW 4
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Direction:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'dirc',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            { // TEXT OPTIONS ROW 5
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Color:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'colr',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                        ]
                                    },
                                    
                                    {
                                        type: 'cluster',
                                        name: 'Tab Options',
                                        align_children: 'align_left',
                                        elements: [
                                            
                                            { // TAB OPTIONS ROW 1
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Page Size:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'pgsz',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            { // TAB OPTIONS ROW 2
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Orientation:'
                                                    },
                                                    {
                                                        type: 'popup',
                                                        item_id: 'orin',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            { // TAB OPTIONS ROW 3
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Margins:'
                                                    },
                                                    {
                                                        type: 'static_text',
                                                        name: 'X'
                                                    },
                                                    {
                                                        type: 'edit_text',
                                                        item_id: 'xmrg',
                                                        width: 35
                                                    },
                                                    {
                                                        type: 'static_text',
                                                        name: 'Y'
                                                    },
                                                    {
                                                        type: 'edit_text',
                                                        item_id: 'ymrg',
                                                        width: 35
                                                    }
                                                ]
                                            },
                                            { // TAB OPTIONS ROW 4
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'static_text',
                                                        name: 'Tabs per Bank:'
                                                    },
                                                    {
                                                        type: 'edit_text',
                                                        item_id: 'bank',
                                                        width: 35
                                                    } 
                                                ]
                                            },
                                            { // TAB OPTIONS ROW 5
                                                type: 'view',
                                                align_children: 'align_row',
                                                elements: [
                                                    {
                                                        type: 'check_box',
                                                        item_id: 'padl',
                                                        name: ' Pad Last Bank'
                                                    } 
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            
                            {
                                type: 'view',
                                align_children: 'align_row',
                                elements: [
                                    {
                                        type: 'ok_cancel',
                                        ok_name: 'Go',
                                    }
                                ]
                            }   
                        ]
                    }
        ]
    }
}


//< Code
tabber = app.trustedFunction( function( tab_text, text_font, text_size, text_alignment, 
                                        text_rotation, text_color, page_size,
                                        page_orientation, tab_indent, tab_width, 
                                        x_margin, y_margin, tabs_per_bank, pad, 
                                        document, source, modify ){
    
    // Parameter Defaults
    if ( text_font == null ){ text_font = 'Helv'; }
    if ( text_size == null ){ text_size = 11; }
    if ( text_alignment == null ){ text_alignment = 'center'; }
    if ( text_rotation == null ){ text_rotation = 270; } // Text-In
    if ( text_color == null ){ text_color = 'black'; }
    if ( page_size == null ){ page_size = [ 9*inch, 11*inch ]; }
    if ( page_orientation == null ){ page_orientation = 'portrait'; }
    if ( tab_indent == null ){ tab_indent = .5*inch; }
    if ( tab_width == null ){ tab_width = .75*inch; }
    if ( x_margin == null ){ x_margin = .2*inch; }
    if ( y_margin == null ){ y_margin = .1*inch; }
    if ( tabs_per_bank == null ){ tabs_per_bank = 5; }
    if ( pad == null ){ pad = true; }
    if ( modify == null ){ modify = false; }
    
    // Size Calculations
    page_width = page_size[0]
    page_height = page_size[1]
    tab_height = (page_height-(tab_indent*2))/tabs_per_bank;
    field_width = tab_width - x_margin;
    field_height = tab_height - y_margin*2;
    
    app.beginPriv();
            	
        // Tab Positions
        // If the tabs are landscape the position is reversed ( i.e. 1,2,3 > 3,2,1 )
        tab_positions = [];
        for ( i=0; i<tabs_per_bank; i++ ) {
            if ( page_orientation == 'landscape' ) {
                tab_positions[i] = tabs_per_bank - (i+1);
            } else {
                tab_positions[i] = i;
            }
        }		
        
        /***>	CREATE TABS		<***/
        // Calculate Number of Pages
        if ( pad ) {
            num_pages = Math.ceil( tab_text.length / tabs_per_bank) * tabs_per_bank;
        } else {
            num_pages = tab_text.length
        }
        
        // Setup Document
        document.info.Title = "Tabs";
        document.info.Author = "Tabber v1";
        for ( i=0; i<num_pages; i++ ) {
            document.newPage({ nWidth: page_width, nHeight: page_height });
        }
        document.deletePages( 0 ); // Remove first page created by app.newDoc();
        
        //Text Field Dimensions
        coordinates = new Array( tabs_per_bank ); // Array of Tab Position Arrays
        for ( i=0; i<tabs_per_bank; i++ ){
            y_offset = tab_indent + (tab_height*tab_positions[i]) + y_margin;       // Distance from Top of the Document to the top of the Field
                coordinates[i] = document.getPageBox();
                coordinates[i][1] -= y_offset                                       // top margin
                coordinates[i][3] = coordinates[i][1] - field_height;	            // height
                if ( text_rotation == 270 ) {                                       // Text-In
                    coordinates[i][2] -= x_margin * .5;				                // right margin
                    coordinates[i][0] = coordinates[i][2] - field_width;	        // width
                } else {                                                            // Text-Out / Vertical
                    coordinates[i][2] -= x_margin * .75;							// right margin
                    coordinates[i][0] = coordinates[i][2] - field_width + .15*inch;	// width
                }
        }

        //Create Text Fields
        for( i=0; i<num_pages; i++ ){
            if ( modify ){
                document.removeField( 'Tab.' + (i+1) );
            }            
            current_bank = Math.ceil( (i+1)/tabs_per_bank );
            tab_position = i - ((current_bank-1) * tabs_per_bank);
            f = document.addField( "Tab." + (i+1), "text", i, coordinates[tab_position] );
            f.delay = true;
                //Font & Size
                f.textFont = eval( 'font.' + text_font );
                f.textSize = text_size;
                f.textColor = eval( 'color.' + text_color );
                
                //Alignment & Orientation
                f.alignment = text_alignment;
                f.rotation = text_rotation;
                f.multiline = true;
                f.doNotScroll = false; // ? whats this do
                
                //Tab Text
                if ( !tab_text[i] ){
                    f.value = "*** Blank Tab ***";
                } else {
                    f.value = tab_text[i];
                }
            f.delay = false;
        }
        
        // Save the gui code to a document level script for use in modification
        if ( source ){
            document.addScript( 'Tabber Source', 'tabber_source = ' + source );
            f = document.addField( 'modify', 'button', 0, [274, 416, 374, 376] );
            f.buttonSetCaption( 'Modify Tabs' );
            f.display = display.noPrint;
            f.setAction( 'MouseUp', 'run_tabber("modify");' );
        }
        
	app.endPriv();
});
    
//< Common
inch = 72;