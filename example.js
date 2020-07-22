// this is YOUR script file, use this to get an idea of how to initialize and use MDXlib
var MDX = require("mdxlib.js");

var textboxstring = "false";

var tab1 = false;
var tab2 = false;

var checkboxvalue = false;

var arrayopened = false;
var chosenoption = 0;

var colorpickeropened = false;

var slidervalue = 25;
var verticalslidervalue = 20;

var ar = 220;
var ag = 10;
var ab = 40;

var tabgy = MDX.agy + 30;
var myTab1 = new MDX.MDXTab("tab1", true, MDX.agx + 10, tabgy);
var myTab2 = new MDX.MDXTab("tab2", false, MDX.agx + 10, tabgy + 20);

function main() {
    var sx = MDX.agx + 143;
    var sy = tabgy;

    MDX.menu("MDX", "GUI", MDX.agx, MDX.agy, 500, 300);
    if (MDX.drag(MDX.agx, MDX.agy).x != 200 || MDX.drag(MDX.agx, MDX.agy).y != 200) {
        MDX.agx = MDX.drag(MDX.agx, MDX.agy).x - 150;
        MDX.agy = MDX.drag(MDX.agx, MDX.agy).y - 10;
    }

    MDX.tab(myTab1);
    MDX.tab(myTab2);

    if (myTab1.getTabVisibility()) {
        if (MDX.checkbox("checkbox", sx, sy, checkboxvalue))
            checkboxvalue = !checkboxvalue;

        textboxstring = MDX.textbox("textbox", sx, sy + 15, textboxstring);

        if (MDX.button("button", sx, sy + 50)) {
            Local.SetClanTag(textboxstring);
        }

        var max = 1;
        verticalslidervalue = MDX.verticalslider("centered", sx, sy + 80, verticalslidervalue, max, true);
        var finalValue = verticalslidervalue * max;
    }

    if (myTab2.getTabVisibility()) {
        slidervalue = MDX.slider("slider", sx, sy + 33, slidervalue, 1);

        var colorpicker = MDX.colorpicker("color picker", sx, sy + 63, ar, ag, ab, colorpickeropened);
        if (colorpicker != undefined) {
            if (colorpicker == "closed") {
                colorpickeropened = !colorpickeropened;
            } else {
                ar = colorpicker.r;
                ag = colorpicker.g;
                ab = colorpicker.b;
            }
        }

        var dropdownoptions = ["bruh", "ok", "lmao", "nice", "lmao", "test", "because i can"];
        var dropdown = MDX.dropdown("dropdown", sx, sy, dropdownoptions, arrayopened, dropdownoptions[chosenoption]);
        if (dropdown != undefined) {
            if (dropdown == "closed") {
                arrayopened = !arrayopened;
            } else {
                chosenoption = dropdown;
            }
        }
    }
}

Cheat.RegisterCallback("Draw", "main");