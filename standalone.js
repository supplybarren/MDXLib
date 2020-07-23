//#region Global variables
var r = 80;
var g = 110;
var b = 200;
var agx = 200;
var agy = 200;
var biggestwidth = 0;
var globaltime = Globals.Realtime();
var savedcolor = undefined;
//#endregion

//#region Javascript function definitions
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = obj[ownProps[i]];

        return resArray;
    };
}
//#endregion

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }
        return output;
    },
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

function MDXmenu(col_title, white_title, gx, gy, gwidth, gheight, passed_r, passed_g, passed_b, bg_col_top, bg_col_bottom) {
    if (typeof (bg_col_top) === 'undefined' || typeof (bg_col_bottom) === 'undefined') {
        Render.FilledRect(gx, gy, gwidth, gheight, [9, 9, 9, 255]);
    } else {
        Render.GradientRect(gx, gy, gwidth, gheight, 0, [bg_col_top[0], bg_col_top[1], bg_col_top[2], 255], [bg_col_bottom[0], bg_col_bottom[1], bg_col_bottom[2], 255]);
    }
    r = passed_r;
    g = passed_g;
    b = passed_b;
    Render.Rect(gx, gy, gwidth, gheight, [0, 0, 0, 255]);
    Render.Rect(gx + 1, gy + 1, gwidth - 2, gheight - 2, [27, 27, 27, 255]);
    Render.Rect(gx + 1, gy + 1, gwidth - 2, 20, [27, 27, 27, 255]);
    Render.Rect(gx + 1, gy + 20, 132, gheight - 21, [27, 27, 27, 255]);
    var font = Render.AddFont("Tahoma", 7, 700);
    Render.StringCustom(gx + 7, gy + 5, 0, col_title, [r, g, b, 255], font);
    var titlesize = Render.TextSizeCustom(col_title, font);
    var titlesizex = titlesize[0];
    Render.StringCustom(gx + 7 + titlesizex + 1, gy + 5, 0, white_title, [255, 255, 255, 155], font);
}

//#region MDXTab
function MDXTab(tabName, visible, x, y) {
    if (typeof (MDXTab.instances[tabName]) === 'undefined') {
        this.tabName = tabName;
        this.visible = visible;
        this.x = x;
        this.y = y;

        MDXTab.instances[tabName] = this;
    } else {
        this.tabName = tabName;
        this.visible = MDXTab.instances[tabName].visible;
        this.x = x;
        this.y = y;

        MDXTab.instances[tabName] = this;
    }
}

MDXTab.instances = {};

MDXTab.prototype.getTabName = function () {
    return this.tabName;
}

MDXTab.prototype.setTabName = function (tabName) {
    this.tabName = tabName;
    return this;
}

MDXTab.prototype.getTabVisibility = function () {
    return this.visible;
}

MDXTab.prototype.setTabVisibility = function (visible) {
    this.visible = visible;
    return this;
}

MDXTab.prototype.getTabX = function () {
    return this.x;
}

MDXTab.prototype.setTabX = function (x) {
    this.x = x;
    return this;
}

MDXTab.prototype.getTabY = function () {
    return this.y;
}

MDXTab.prototype.setTabY = function (y) {
    this.y = y;
    return this;
}

function MDXtab(mdxTab) {
    if (typeof (mdxTab.tabName) === 'undefined') return false;
    if (typeof (mdxTab.visible) === 'undefined') return false;
    if (typeof (mdxTab.x) === 'undefined') return false;
    if (typeof (mdxTab.y) === 'undefined') return false;

    var a = 100;
    var hoveredWidth = 1;
    var stringX = mdxTab.x + 5;
    var mouse = Input.GetCursorPosition();
    var mouseX = mouse[0];
    var mouseY = mouse[1];
    var font = Render.AddFont("Tahoma", 7, 700);

    if (mouseX > mdxTab.x && mouseX < (mdxTab.x + 120) && mouseY > mdxTab.y && mouseY < (mdxTab.y + 15)) {
        a = 150;
        hoveredWidth = 2;
        stringX += 1;

        if (Input.IsKeyPressed(0x01)) {
            a = 200;
            hoveredWidth = 3;
            stringX += 1;

            Object.entries(MDXTab.instances).forEach(function (instance, key) {
                if (instance.getTabName() != mdxTab.getTabName()) {
                    instance.setTabVisibility(false);
                } else {
                    instance.setTabVisibility(true);
                }
            });
        }
    }

    Render.GradientRect(mdxTab.x, mdxTab.y, 150, 15, 1, [255, 255, 255, 30], [27, 27, 27, 0]);
    Render.FilledRect(mdxTab.x, mdxTab.y, hoveredWidth, 15, [r, g, b, 255]);
    Render.StringCustom(stringX, mdxTab.y + 3, 0, mdxTab.tabName, [0, 0, 0, 255], font);
    Render.StringCustom(stringX, mdxTab.y + 4, 0, mdxTab.tabName, [0, 0, 0, 255], font);
    Render.StringCustom(stringX, mdxTab.y + 2, 0, mdxTab.tabName, [255, 255, 255, a], font);
    return mdxTab.getTabVisibility();
}

//#endregion

function MDXdrag(gx, gy) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    if (Input.IsKeyPressed(0x01) && curx > gx && curx < (gx + 500) && cury > gy && cury < (gy + 20)) {
        var newCurPos = Input.GetCursorPosition();
        var newx = newCurPos[0];
        var newy = newCurPos[1];
        return {
            x: newx,
            y: newy
        }
    } else {
        return {
            x: 200,
            y: 200
        }
    }
}

function MDXcheckbox(text, gx, gy, enabled) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var font = Render.AddFont("Tahoma", 7, 700);
    Render.StringCustom(gx + 10 + 5, gy - 1, 0, text, [255, 255, 255, 150], font);
    var textsize = Render.TextSizeCustom(text, font);
    Render.GradientRect(gx, gy, 10, 10, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    if (enabled) {
        Render.GradientRect(gx + 2, gy + 2, 6, 6, 0, [r, g, b, 255], [r - 20, g - 30, b - 50, 255]);
        Render.Rect(gx + 1, gy + 1, 8, 8, [r, g, b, 255]);
    }
    if (curx > gx && curx < (gx + 10 + 5 + textsize[0]) && cury > gy && cury < (gy + 10)) {
        Render.Rect(gx - 3, gy - 3, 16, 16, [r, g, b, 255]);
        if (Input.IsKeyPressed(0x01) && Globals.Realtime() > (globaltime + 0.2)) {
            globaltime = Globals.Realtime();
            return true;
        }
    }
    Render.Rect(gx, gy, 10, 10, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy - 1, 12, 12, [27, 27, 27, 255]);
}

function MDXslider(text, gx, gy, val, min, max) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var texty = gy;
    var relval = Math.round(val * ((max - min) / 90) + min);
    var font = Render.AddFont("Tahoma", 7, 700);
    if (curx > (gx - 1) && curx < (gx + 91) && cury > (gy + 12) && cury < (gy + 12 + 10)) {
        texty = gy - 2;
        Render.Rect(gx - 3, gy + 9, 96, 16, [r, g, b, 255]);
        if (Input.IsKeyPressed(0x01)) {
            val = curx - gx;
            relval = Math.round(val * ((max - min) / 90) + min);
        }
    }
    Render.GradientRect(gx, gy + 12, 90, 10, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    if (val != 0) {
        Render.GradientRect(gx + 2, gy + 14, val - 4, 6, 0, [r, g, b, 255], [r - 20, g - 30, b - 50, 255]);
        Render.Rect(gx + 1, gy + 13, val - 2, 8, [r, g, b, 255]);
    }
    Render.Rect(gx, gy + 12, 90, 10, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 92, 12, [27, 27, 27, 255]);
    Render.StringCustom(gx, texty, 0, text + " / " + relval, [255, 255, 255, 150], font);

    var valueArray = new Array(2);
    valueArray[0] = relval;
    valueArray[1] = val;
    return valueArray;
}

function MDXverticalslider(text, gx, gy, val, min, max, centered) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var textx = gx;
    var texty = gy - 1;
    var relval = Math.round(val * ((max - min) / 90) + min);
    var font = Render.AddFont("Tahoma", 7, 700);
    var textsize = Render.TextSizeCustom(text, font);
    if (centered) {
        gx = gx + (textsize[0] / 2) - 5;
    }
    Render.GradientRect(gx, gy + 12, 10, 90, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    if (curx > gx && curx < gx + 10 && cury > gy + 11 && cury < (gy + 13 + 90)) {
        texty = gy - 2;
        Render.Rect(gx - 3, gy + 9, 16, 96, [r, g, b, 255]);
        if (Input.IsKeyPressed(0x01)) {
            val = 90 - (cury - gy - 12);
            relval = Math.round(val * ((max - min) / 90) + min);
        }
    }
    if (val != 0) {
        Render.GradientRect(gx + 2, gy + 15 + 90 - val - 4, 6, val, 0, [r, g, b, 255], [r - 20, g - 30, b - 50, 255]);
        Render.Rect(gx + 1, gy + 13 + 90 - val - 2, 8, val, [r, g, b, 255]);
    }
    Render.Rect(gx, gy + 12, 10, 90, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 12, 92, [27, 27, 27, 255]);
    Render.StringCustom(textx, texty, 0, text, [255, 255, 255, 150], font);
    Render.StringCustom(gx + 15, gy + 90 - val + 5, 0, "" + relval, [255, 255, 255, 150], font);

    var valueArray = new Array(2);
    valueArray[0] = relval;
    valueArray[1] = val;
    return valueArray;
}

function MDXsliderfloat(text, gx, gy, val, min, max) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var texty = gy;
    var relval = (val * ((max - min) / 90) + min).toFixed(2);
    var font = Render.AddFont("Tahoma", 7, 700);
    if (curx > (gx - 1) && curx < (gx + 91) && cury > (gy + 12) && cury < (gy + 12 + 10)) {
        texty = gy - 2;
        Render.Rect(gx - 3, gy + 9, 96, 16, [r, g, b, 255]);
        if (Input.IsKeyPressed(0x01)) {
            val = curx - gx;
            relval = (val * ((max - min) / 90) + min).toFixed(2);
        }
    }
    Render.GradientRect(gx, gy + 12, 90, 10, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    if (val != 0) {
        Render.GradientRect(gx + 2, gy + 14, val - 4, 6, 0, [r, g, b, 255], [r - 20, g - 30, b - 50, 255]);
        Render.Rect(gx + 1, gy + 13, val - 2, 8, [r, g, b, 255]);
    }
    Render.Rect(gx, gy + 12, 90, 10, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 92, 12, [27, 27, 27, 255]);
    Render.StringCustom(gx, texty, 0, text + " / " + relval, [255, 255, 255, 150], font);

    var valueArray = new Array(2);
    valueArray[0] = relval;
    valueArray[1] = val;
    return valueArray;
}

function MDXcolorslider(text, gx, gy, val, color) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var texty = gy;
    var relval = val;
    var font = Render.AddFont("Tahoma", 7, 700);
    if (curx > (gx - 1) && curx < (gx + 256) && cury > (gy + 12) && cury < (gy + 12 + 10)) {
        texty = gy - 2;
        if (color == "red")
            Render.Rect(gx - 3, gy + 9, 261, 16, [200, 0, 0, 255]);
        if (color == "green")
            Render.Rect(gx - 3, gy + 9, 261, 16, [0, 200, 0, 255]);
        if (color == "blue")
            Render.Rect(gx - 3, gy + 9, 261, 16, [80, 110, 200, 255]);
        if (color == "alpha")
            Render.Rect(gx - 3, gy + 9, 261, 16, [200, 200, 200, 255]);
        if (Input.IsKeyPressed(0x01)) {
            val = curx - gx;
            relval = val;
        }
    }
    if (val > 255)
        val = 255;
    if (color == "red") {
        Render.GradientRect(gx + 2, gy + 14, val - 4, 6, 0, [200, 0, 0, 255], [150, 0, 0, 255]);
        Render.Rect(gx + 1, gy + 13, val - 2, 8, [200, 0, 0, 255]);
        Render.Line(gx - 2, gy + 12, gx - 2, gy + 21, [9, 9, 9, 255]);
    }
    if (color == "green") {
        Render.GradientRect(gx + 2, gy + 14, val - 4, 6, 0, [0, 200, 0, 255], [0, 150, 0, 255]);
        Render.Rect(gx + 1, gy + 13, val - 2, 8, [0, 200, 0, 255]);
        Render.Line(gx - 2, gy + 12, gx - 2, gy + 21, [9, 9, 9, 255]);
    }
    if (color == "blue") {
        Render.GradientRect(gx + 2, gy + 14, val - 4, 6, 0, [80, 110, 200, 255], [59, 81, 148, 255]);
        Render.Rect(gx + 1, gy + 13, val - 2, 8, [80, 110, 200, 255]);
        Render.Line(gx - 2, gy + 12, gx - 2, gy + 21, [9, 9, 9, 255]);
    }
    if (color == "alpha") {
        Render.GradientRect(gx + 2, gy + 14, val - 4, 6, 0, [200, 200, 200, 255], [150, 150, 150, 255]);
        Render.Rect(gx + 1, gy + 13, val - 2, 8, [200, 200, 200, 255]);
        Render.Line(gx - 2, gy + 12, gx - 2, gy + 21, [9, 9, 9, 255]);
    }
    Render.Rect(gx - 1, gy + 11, 257, 12, [45, 45, 45, 255]);
    Render.StringCustom(gx, texty, 0, text + " - " + relval, [255, 255, 255, 150], font);
    return val;
}

function MDXbutton(text, gx, gy) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var buttonpressed = false;
    var font = Render.AddFont("Tahoma", 7, 700);
    var textsize = Render.TextSizeCustom(text, font);
    if (curx > gx && curx < (gx + (textsize[0] * 2)) && cury > gy && cury < (gy + 19)) {
        Render.Rect(gx - 3, gy - 3, (textsize[0] * 2) + 6, 23, [r, g, b, 255]);
        if (Input.IsKeyPressed(0x01) && Globals.Realtime() > (globaltime + 0.2)) {
            globaltime = Globals.Realtime();
            Render.FilledRect(gx, gy, textsize[0] * 2, 17, [27, 27, 27, 255]);
            buttonpressed = true;
        }
    }
    Render.GradientRect(gx, gy, textsize[0] * 2, 17, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    Render.Rect(gx, gy, textsize[0] * 2, 17, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy - 1, textsize[0] * 2 + 2, 19, [27, 27, 27, 255]);
    Render.StringCustom(gx + textsize[0], gy + 3, 1, text, [255, 255, 255, 150], font);
    if (buttonpressed)
        return true;
}

function MDXdropdown(text, gx, gy, array, open, selectedoption) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var oop = selectedoption;
    var returnvalue = 100;
    var font = Render.AddFont("Tahoma", 7, 700);
    var totalarrayheight = 0;
    var ffsize = Render.TextSizeCustom("" + oop, font);
    Render.GradientRect(gx, gy + 12, ffsize[0] + 10, 17, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    Render.Rect(gx, gy + 12, ffsize[0] + 10, 17, [27, 27, 27, 255]);
    Render.StringCustom(gx + 5, gy + 16, 0, "" + oop, [255, 255, 255, 150], font);
    Render.StringCustom(gx, gy, 0, text, [255, 255, 255, 150], font);

    if (curx > gx && curx < (gx + ffsize[0] + 10) && cury > gy + 12 && cury < (gy + 17 + ffsize[1])) {
        Render.Rect(gx - 2, gy + 10, ffsize[0] + 14, 21, [r, g, b, 255]);
        if (Input.IsKeyPressed(0x01) && Globals.Realtime() > globaltime + 0.2) {
            globaltime = Globals.Realtime();
            return "closed";
        }
    }
    if (open) {
        for (i = 0; i < array.length; i++) {
            var tsize = Render.TextSizeCustom(array[i], font);
            if (tsize[0] > biggestwidth) {
                biggestwidth = tsize[0];
            }
            totalarrayheight += tsize[1];
            Render.FilledRect(gx, 30 + gy + i * 13, biggestwidth + 10, tsize[1] + 2, [9, 9, 9, 255]);
            Render.FilledRect(gx, 30 + gy + i * 13, 2, tsize[1] + 2, [r, g, b, 255]);
            if (!(curx > gx && curx < gx + biggestwidth + 10 && cury > (32 + gy + i * 13) && cury < ((32 + gy + i * 13) + tsize[1]))) {
                Render.StringCustom(gx + 5, 32 + gy + i * 13, 0, array[i], [255, 255, 255, 150], font);
            } else {
                Render.FilledRect(gx, 32 + gy + i * 13, 3, tsize[1] + 2, [r, g, b, 255]);
                Render.StringCustom(gx + 6, 32 + gy + i * 13, 0, array[i], [255, 255, 255, 150], font);
                if (Input.IsKeyPressed(0x01)) {
                    returnvalue = i;
                    return returnvalue;
                }
            }
        }
        Render.Rect(gx, gy + 30, biggestwidth + 10, totalarrayheight + (array.length * 3), [27, 27, 27, 255]);
    }
}

function MDXtextbox(text, gx, gy, string) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var keyCodes = [0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x20];
    var keyChar = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " "];
    var font = Render.AddFont("Tahoma", 7, 700);
    var texty = gy;
    Render.GradientRect(gx, gy + 12, 90, 17, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    if (curx > gx && curx < (gx + 90) && cury > gy + 12 && cury < gy + 12 + 17) {
        Render.Rect(gx - 3, gy + 9, 96, 23, [r, g, b, 255]);
        texty = gy - 2;

        if (string.length < 16) {
            for (i = 0; i < keyCodes.length; i++) {
                if (Input.IsKeyPressed(keyCodes[i]) && Globals.Realtime() > globaltime + 0.2) {
                    globaltime = Globals.Realtime();
                    if (Input.IsKeyPressed(0x10))
                        string += keyChar[i].toUpperCase();
                    else
                        string += keyChar[i];
                }

                if (Input.IsKeyPressed(0x08) && Globals.Realtime() > globaltime + 0.2) {
                    globaltime = Globals.Realtime();
                    string = string.substring(0, string.length - 1);
                }
            }
        } else {
            if (Input.IsKeyPressed(0x08) && Globals.Realtime() > globaltime + 0.2) {
                globaltime = Globals.Realtime();
                string = string.substring(0, string.length - 1);
            }
        }
    }
    Render.StringCustom(gx + 5, gy + 15, 0, string, [255, 255, 255, 150], font);
    Render.StringCustom(gx, texty, 0, text, [255, 255, 255, 150], font);
    Render.Rect(gx, gy + 12, 90, 17, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 92, 19, [27, 27, 27, 255]);

    return string;
}

function MDXcolorpicker(text, gx, gy, ar, ag, ab, aa, open) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var font = Render.AddFont("Tahoma", 7, 700);
    var returnr = ar;
    var returng = ag;
    var returnb = ab;
    var returna = aa;
    var texty = gy;
    if (curx > gx && curx < gx + 25 && cury > gy + 12 && cury < gy + 27) {
        Render.Rect(gx - 3, gy + 9, 31, 21, [r, g, b, 255]);
        texty = gy - 2;
        if (Input.IsKeyPressed(0x01) && Globals.Realtime() > globaltime + 0.2) {
            globaltime = Globals.Realtime();
            return "closed";
        }
    }
    if (open) {
        Render.Rect(gx - 3, gy + 9, 31, 21, [r, g, b, 255]);
        texty = gy - 2;
        Render.FilledRect(gx - 2, gy + 35, 270, 110, [9, 9, 9, 255]);
        Render.Rect(gx - 2, gy + 35, 270, 110, [27, 27, 27, 255]);
        Render.FilledRect(gx - 2, gy + 35, 270, 135, [9, 9, 9, 255]);
        Render.Rect(gx - 2, gy + 35, 270, 135, [27, 27, 27, 255]);
        returnr = MDXcolorslider("red", gx + 5, gy + 40, returnr, "red");
        returng = MDXcolorslider("green", gx + 5, gy + 65, returng, "green");
        returnb = MDXcolorslider("blue", gx + 5, gy + 90, returnb, "blue");
        returna = MDXcolorslider("alpha", gx + 5, gy + 115, returna, "alpha");
        if (MDXbutton("Copy", gx + 5, gy + 145)) {
            savedcolor = Base64.encode('{"r":' + returnr + ', "g":' + returng + ', "b":' + returnb + ', "a":' + returna + '}');
        }
        if (MDXbutton("Paste", gx + 60, gy + 145)) {
            if (savedcolor !== undefined) {
                var sav_col = JSON.parse(Base64.decode(savedcolor));
                returnr = sav_col.r;
                returng = sav_col.g;
                returnb = sav_col.b;
                returna = sav_col.a;
            }
        }
    }
    Render.StringCustom(gx, texty, 0, text, [255, 255, 255, 150], font);
    Render.Rect(gx, gy + 12, 25, 15, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 27, 17, [27, 27, 27, 255]);
    Render.FilledRect(gx + 2, gy + 14, 10, 5, [214, 214, 214, 255]);
    Render.FilledRect(gx + 12, gy + 14, 11, 5, [255, 255, 255, 255]);
    Render.FilledRect(gx + 2, gy + 19, 10, 6, [255, 255, 255, 255]);
    Render.FilledRect(gx + 12, gy + 19, 11, 6, [214, 214, 214, 255]);
    Render.FilledRect(gx + 2, gy + 14, 21, 11, [ar, ag, ab, aa]);
    return {
        r: returnr,
        g: returng,
        b: returnb,
        a: returna
    };
}

function MDXsaveconfig(json) {
    var config = Base64.encode(json);
    Cheat.ExecuteCommand("xbox_throttlespoof " + config);
}

function MDXloadconfig() {
    var config = Base64.decode(Convar.GetString("xbox_throttlespoof"));
    return config;
}

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

var br = 100;
var bg = 1;
var bb = 99;
var ba = 255;

function main() {
    var tabBaseY = agy + 30;
    var sx = agx + 143;
    var sy = tabBaseY;

    MDXmenu("MDX", "GUI", agx, agy, 500, 300, ar, ag, ab);
    if (MDXdrag(agx, agy).x != 200 || MDXdrag(agx, agy).y != 200) {
        agx = MDXdrag(agx, agy).x - 150;
        agy = MDXdrag(agx, agy).y - 10;
    }

    var myTab1 = new MDXTab("tab1", true, agx + 10, tabBaseY);
    var myTab2 = new MDXTab("tab2", false, agx + 10, tabBaseY + 20);

    MDXtab(myTab1);
    MDXtab(myTab2);

    if (myTab1.getTabVisibility()) {
        if (MDXcheckbox("checkbox", sx, sy, checkboxvalue))
            checkboxvalue = !checkboxvalue;

        textboxstring = MDXtextbox("textbox", sx, sy + 15, textboxstring);

        if (MDXbutton("Save config", sx, sy + 50)) {
            var config = '{ "slidervalue":' + slidervalue + ', "verticalslidervalue":' + verticalslidervalue + ', "checkboxvalue":' + checkboxvalue +
                ', "arrayopened":' + arrayopened + ', "chosenoption":' + chosenoption + ', "textboxstring":"' + textboxstring + '", "colors":[{"r":' + ar +
                ', "g":' + ag + ', "b":' + ab + ', "a":' + aa + '}]}';
            MDXsaveconfig(config);
        }

        if (MDXbutton("Load config", sx, sy + 80)) {
            var cfg = JSON.parse(MDXloadconfig());
            slidervalue = cfg.slidervalue;
            verticalslidervalue = cfg.verticalslidervalue;
            checkboxvalue = cfg.checkboxvalue;
            textboxstring = cfg.textboxstring;
            chosenoption = cfg.chosenoption;
            ar = cfg.colors[0].r;
            ag = cfg.colors[0].g;
            ab = cfg.colors[0].b;
            aa = cfg.colors[0].a;
        }

        verticalslidervalue = MDXverticalslider("centered", sx, sy + 110, verticalslidervalue[1], -100, 100, true);
        Cheat.Print(verticalslidervalue[0] + "\n");
    }

    if (myTab2.getTabVisibility()) {
        slidervalue = MDXslider("slider", sx, sy + 33, slidervalue[1], -90, 5);
        Cheat.Print(slidervalue[0] + "\n");
        sliderfloat = MDXsliderfloat("float", sx, sy + 63, sliderfloat[1], 0, 1);
        Cheat.Print(sliderfloat[0] + "\n");

        var colorpicker = MDXcolorpicker("color picker", sx, sy + 93, ar, ag, ab, aa, colorpickeropened);
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
        var dropdown = MDXdropdown("dropdown", sx, sy, dropdownoptions, arrayopened, dropdownoptions[chosenoption]);
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