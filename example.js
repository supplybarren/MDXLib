var MDX = require("mdxlib.js");

var tab1 = false;
var tab2 = false;

var textboxstring = "false";

var checkboxvalue = false;

var arrayopened = false;
var chosenoption = 0;

var colorpickeropened = false;
var colorpicker2opened = false;

var slidervalue = [25, 25];
var verticalslidervalue = [10, 10];
var sliderfloat = [0.5, 0.5];

var ar = 80;
var ag = 110;
var ab = 200;
var aa = 255;

var colorpickercolor = MDX.create_color(225, 60, 78, 255);

var br = 100;
var bg = 1;
var bb = 99;
var ba = 255;

var hotkey = 0x01;

function main() {
    var tabBaseY = MDX.agy + 30;
    var sx = MDX.agx + 143;
    var sy = tabBaseY;

    MDX.menu("MDX", "GUI", MDX.agx, MDX.agy, 500, 300, ar, ag, ab);
    if (MDX.drag(MDX.agx, MDX.agy).x != 200 || MDX.drag(MDX.agx, MDX.agy).y != 200) {
        MDX.agx = MDX.drag(MDX.agx, MDX.agy).x - 150;
        MDX.agy = MDX.drag(MDX.agx, MDX.agy).y - 10;
    }

    var myTab1 = new MDX.MDXTab("tab1", true, MDX.agx + 10, tabBaseY);
    var myTab2 = new MDX.MDXTab("tab2", false, MDX.agx + 10, tabBaseY + 20);

    MDX.tab(myTab1);
    MDX.tab(myTab2);

    if (myTab1.getTabVisibility()) {
        if (MDX.checkbox("checkbox", sx, sy, checkboxvalue))
            checkboxvalue = !checkboxvalue;

        textboxstring = MDX.textbox("textbox", sx, sy + 15, textboxstring, true);

        if (MDX.button("Save config", sx, sy + 50)) {
            var config = '{ "slidervalue":' + slidervalue[1] + ', "verticalslidervalue":' + verticalslidervalue[1] + ', "checkboxvalue":' + checkboxvalue +
                ', "arrayopened":' + arrayopened + ', "chosenoption":' + chosenoption + ', "textboxstring":"' + textboxstring + '", "colors":[{"r":' + ar +
                ', "g":' + ag + ', "b":' + ab + ', "a":' + aa + '}]}';
            MDX.saveconfig(config);
        }

        if (MDX.button("Load config", sx, sy + 80)) {
            var cfg = JSON.parse(MDX.loadconfig());
            slidervalue[1] = cfg.slidervalue;
            verticalslidervalue[1] = cfg.verticalslidervalue;
            checkboxvalue = cfg.checkboxvalue;
            textboxstring = cfg.textboxstring;
            chosenoption = cfg.chosenoption;
            ar = cfg.colors[0].r;
            ag = cfg.colors[0].g;
            ab = cfg.colors[0].b;
            aa = cfg.colors[0].a;
        }

        if (MDX.button("Import config", sx, sy + 110)) {
            var configname = "MDX_config";
            var cfg = JSON.parse(MDX.importconfig(configname));
            slidervalue[1] = cfg.slidervalue;
            verticalslidervalue[1] = cfg.verticalslidervalue;
            checkboxvalue = cfg.checkboxvalue;
            textboxstring = cfg.textboxstring;
            chosenoption = cfg.chosenoption;
            ar = cfg.colors[0].r;
            ag = cfg.colors[0].g;
            ab = cfg.colors[0].b;
            aa = cfg.colors[0].a;
        }

        if (MDX.button("Export config", sx, sy + 140)) {
            MDX.exportconfig();
        }

        verticalslidervalue = MDX.verticalslider("centered", sx + 150, sy + 30, verticalslidervalue[1], -100, 100, true);
        //Cheat.Print(verticalslidervalue[0] + "\n");

        hotkey = MDX.hotkey("hotkey", sx + 150, sy, hotkey);
        if (Input.IsKeyPressed(hotkey)) {

        }
        //Cheat.Print("hotkey activated!" + "\n");
    }

    if (myTab2.getTabVisibility()) {
        slidervalue = MDX.slider("slider", sx, sy + 33, slidervalue[1], -90, 5);
        //heat.Print(slidervalue[0] + "\n");
        sliderfloat = MDX.sliderfloat("float", sx, sy + 63, sliderfloat[1], 0, 1);
        //Cheat.Print(sliderfloat[0] + "\n");
        var colorpicker = MDX.colorpicker("color picker", sx, sy + 93, colorpickercolor, colorpickeropened);
        if (colorpicker != undefined) {
            if (colorpicker == "closed") {
                colorpickeropened = !colorpickeropened;
            } else {
                ar = colorpicker.r;
                ag = colorpicker.g;
                ab = colorpicker.b;
                aa = colorpicker.a;
            }
        }

        var dropdownoptions = ["bruh", "ok", "lmao", "nice", "lmao", "test", "because i can"];
        var dropdown = MDX.dropdown("dropdown", sx, sy, dropdownoptions, arrayopened, dropdownoptions[chosenoption]);
        if (dropdown != undefined) {
            if (dropdown == "closed") {
                arrayopened = !arrayopened;
            } else {
                chosenoption = dropdown;
                arrayopened = !arrayopened;
            }
        }
    }
}

Cheat.RegisterCallback("Draw", "main");