# MDXLib
 The MDX drawing library allows script writers to easily create a clean and uncluttered GUI in minutes.

## Usage
 Getting started with MDX is extremely easy, just follow the steps below
 
 Start by including the module
 ```javascript
 var MDX = require("mdxlib.js");
 ```
 
 Now in your main drawing function we can begin creating our GUI
 ```javascript
 var checkboxvalue = false;
 // ^^ this is the value the checkbox will be checking/changing
 
 // Declare the tab. Syntax: var variableName = new MDX.MDXTab("tabName", boolVisibility, coordX, coordY);
 // Important: you should declare your tab OUTSIDE of any loop!
 var myTab1 = new MDX.MDXTab("tab1", true, MDX.agx + 10, MDX.agy + 30);
 function main(){
  //initialize our menu
  MDX.menu("MDX", "GUI", MGX.agx, MDX.agy, 500, 300);
  //MDX.agx & MDX.agy are default static values in the lib file, 500 & 300 are width & height. It is recommended you use the default MDX values for the drag control to work
  
  //setup the drag function using the following code
  if (MDX.drag(MDX.agx, MDX.agy).x != 200 || MDX.drag(MDX.agx, MDX.agy).y != 200){
    MDX.agx = MDX.drag(MDX.agx, MDX.agy).x - 150;
    MDX.agy = MDX.drag(MDX.agx, MDX.agy).y - 10;
  }
  
  //now we can start building our controls
  //if we want a checkbox on our menu we can easily add it
  MDX.checkbox("checkbox", MDX.agx + 50, MDX.agy + 50, checkboxvalue);
  //the string in quotes is our checkbox text, MDX.agx is our X value, MDX.agy is our Y value, and checkboxvalue is the changing value.
  
  // Just call MDX.tab with our MDXTab object
  MDX.tab(myTab1);
  
  // Only draw things inside our tab while its visible
  if (myTab1.getTabVisibility()) {
        // Draw controls on myTab1 here
    }
 }
 ```
 
 If you are still a little confused, take a look at our example script for more help.
