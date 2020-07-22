var MDX = require("mdxlib.js");

var tab1 = false;
var tab2 = false;

var textboxstring = "false";

var checkboxvalue = false;

var arrayopened = false;
var chosenoption = 0;

var colorpickeropened = false;

var slidervalue = 25;
var verticalslidervalue = 20;

var ar = 220;
var ag = 10;
var ab = 40;
var aa = 255;

function cleartabs(){
    tab1 = false;
    tab2 = false;
}

function main(){
    var tabgy = MDX.agy + 30;
    var sx = MDX.agx + 143;
    var sy = tabgy;

    MDX.menu("MDX", "GUI", MDX.agx, MDX.agy, 500, 300);
    if (MDX.drag(MDX.agx, MDX.agy).x != 200 || MDX.drag(MDX.agx, MDX.agy).y != 200){
        MDX.agx = MDX.drag(MDX.agx, MDX.agy).x - 150;
        MDX.agy = MDX.drag(MDX.agx, MDX.agy).y - 10;
    }

    if (MDX.tab("tab 1", MDX.agx + 10, tabgy)){
        cleartabs();
        tab1 = true;
    }

    if (MDX.tab("tab 2", MDX.agx + 10, tabgy + 20)){
        cleartabs();
        tab2 = true;
    }

    if (tab1){
        if (MDX.checkbox("checkbox", sx, sy, checkboxvalue))
            checkboxvalue = !checkboxvalue;

        textboxstring = MDX.textbox("textbox", sx, sy + 15, textboxstring);

        if (MDX.button("Save config", sx, sy + 50)){
            var config = '{ "slidervalue":' + slidervalue + ', "verticalslidervalue":' + verticalslidervalue + ', "checkboxvalue":' + checkboxvalue + 
                         ', "arrayopened":' + arrayopened + ', "chosenoption":' + chosenoption + ', "textboxstring":"' + textboxstring + '", "r":' + ar + 
                         ', "g":' + ag + ', "b":' + ab + ', "a":' + aa + '}';
            MDX.saveconfig(config);
        }

        if (MDX.button("Load config", sx, sy + 80)){
            var cfg = JSON.parse(MDX.loadconfig());
            slidervalue = cfg.slidervalue;
            verticalslidervalue = cfg.verticalslidervalue;
            checkboxvalue = cfg.checkboxvalue;
            textboxstring = cfg.textboxstring;
            chosenoption = cfg.chosenoption;
            ar = cfg.r;
            ag = cfg.g;
            ab = cfg.b;
            aa = cfg.a;
        }

        var max = 1;
        verticalslidervalue = MDX.verticalslider("centered", sx, sy + 110, verticalslidervalue, max, true);
        var finalValue = verticalslidervalue * max;
    }

    if (tab2){
        slidervalue = MDX.slider("slider", sx, sy + 33, slidervalue, 1);

        var colorpicker = MDX.colorpicker("color picker", sx, sy + 63, ar, ag, ab, aa, colorpickeropened);
        if (colorpicker != undefined){
            if (colorpicker == "closed"){
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
        if (dropdown != undefined){
            if (dropdown == "closed"){
                arrayopened = !arrayopened;
            } else {
                chosenoption = dropdown;
            }
        }
    }
}

Cheat.RegisterCallback("Draw", "main");
