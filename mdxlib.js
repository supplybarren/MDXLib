//#region Global variables
var r = 80;
var g = 110;
var b = 200;
var agx = 200;
var agy = 200;
var biggestwidth = 0;
var globaltime = Globals.Realtime();
var savedcolor = undefined;
var keyCodes = [0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x20];
var keyChar = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " "];
var extraKeyCodes = [0x01, 0x02, 0x04, 0x05, 0x06, 0x09, 0x0D, 0x10, 0xA1, 0x11, 0x12, 0x14, 0x1B, 0x20, 0x24, 0x25, 0x26, 0x27, 0x28, 0x2D, 0x2E];
var extraKeyChar = ["m1", "m2", "m3", "x1", "x2", "tab", "ent", "shf", "ctl", "alt", "cap", "esc", "spc", "hom", "lft", "up", "rgt", "dwn", "ins", "del"];
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

//#region extended color picker by Brotgeschmack
function HUEtoRGB(h) {
    var r = 0, g = 0, b = 0;

    var z = Math.floor(h / 60);
    var hi = z % 6;
    var f = h / 60 - z;

    switch (hi) {
        case 0:
            {
                r = 1;
                g = f;
                b = 0;
                break;
            }
        case 1:
            {
                r = (1 - f);
                g = 1;
                b = 0;
                break;
            }
        case 2:
            {
                r = 0;
                g = 1;
                b = f;
                break;
            }
        case 3:
            {
                r = 0;
                g = (1 - f);
                b = 1;
                break;
            }
        case 4:
            {
                r = f;
                g = 0;
                b = 1;
                break
            }
        case 5:
            {
                r = 1;
                g = 0;
                b = (1 - f);
                break;
            }
    }

    return [r * 255, g * 255, b * 255, 255]
}

function HSVtoRGB(h, s, v) {
    var r = 0, g = 0, b = 0;

    var tempS = s / 100;
    var tempV = v / 100;

    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = (tempV * (1 - tempS));
    var q = (tempV * (1 - f * tempS));
    var t = (tempV * (1 - (1 - f) * tempS));

    switch (hi) {
        case 0:
            {
                r = tempV;
                g = t;
                b = p;
                break;
            }
        case 1:
            {
                r = q;
                g = tempV;
                b = p;
                break;
            }
        case 2:
            {
                r = p;
                g = tempV;
                b = t;
                break;
            }
        case 3:
            {
                r = p;
                g = q;
                b = tempV;
                break;
            }
        case 4:
            {
                r = t;
                g = p;
                b = tempV;
                break
            }
        case 5:
            {
                r = tempV;
                g = p;
                b = q;
                break;
            }
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}

function RGBToHSV(red, green, blue) {
    var hue = 0, saturation = 0, value = 0;

    var min_value = Math.min(red, green, blue);
    var max_value = Math.max(red, green, blue);

    value = max_value;

    var value_delta = max_value - min_value;

    Cheat.Print(value_delta + " " + max_value + "\n")
    if (max_value != 0) {
        saturation = value_delta / max_value;
    } else {
        saturation = 0;
        hue = -1;
        return { h: hue, s: saturation * 100, v: value / 2.55 };
    }

    if (red == max_value) {
        hue = (green - blue) / value_delta;
    } else if (green == max_value) {
        hue = 2 + (blue - red) / value_delta;
    } else {
        hue = 4 + (red - green) / value_delta;
    }

    hue = hue * 60;
    if (hue < 0) {
        hue = hue + 360;
    }

    return { h: hue, s: saturation * 100, v: value / 2.55 };
}

function create_color(h, s, v, a) {
    return { h: h, s: s, v: v, a: a };
}

function get_cursor_positon() {
    var input = Input.GetCursorPosition();
    return { x: input[0], y: input[1] };
}

function in_boundary(cursor, x1, y1, x2, y2) {
    var boundary = { x: cursor.x, y: cursor.y };
    if (cursor.x < x1)
        boundary.x = x1
    if (cursor.y < y1)
        boundary.y = y1
    if (cursor.x > x1 + x2)
        boundary.x = x1 + x2
    if (cursor.y > y1 + y2)
        boundary.y = y1 + y2

    if (cursor.x >= x1 && cursor.y >= y1 && cursor.x <= x1 + x2 && cursor.y <= y1 + y2)
        return { in_boundary: true, boundary: boundary };

    return { in_boundary: false, boundary: boundary };
}

var keys_down = { picker: false, hue: false, alpha: false, outside: false };

function color_picker(x, y, w, h, color) {
    var cursor = get_cursor_positon();

    var window = {
        x: x,
        y: y,
        w: w,
        h: h
    }

    var picker = {
        x: window.x + 5,
        y: window.y + 5,
        w: window.w - 35,
        h: window.h - 35
    }

    var hue = {
        x: picker.x + picker.w + 5,
        y: picker.y,
        w: 20,
        h: picker.h
    }

    var alpha_slider = {
        x: picker.x,
        y: picker.y + picker.h + 5,
        w: picker.w,
        h: 20
    }

    var preview = {
        x: picker.x + picker.w + 5,
        y: picker.y + picker.h + 5,
        w: 20,
        h: 20
    }

    var rgb = HSVtoRGB(color.h, color.s, color.v);
    var picker_boundary = in_boundary(cursor, picker.x, picker.y, picker.w, picker.h);
    var hue_boundary = in_boundary(cursor, hue.x, picker.y, hue.w, picker.h);
    var alpha_boundary = in_boundary(cursor, alpha_slider.x, alpha_slider.y, alpha_slider.w, alpha_slider.h);

    //Draw Window
    Render.Rect(window.x, window.y, window.w, window.h, [0, 0, 0, 255])
    Render.FilledRect(window.x + 1, window.y + 1, window.w - 2, window.h - 2, [40, 40, 40, 255])

    //Draw Preview
    Render.Rect(preview.x, preview.y, preview.w, preview.h, [0, 0, 0, 255])
    Render.FilledRect(preview.x + 1, preview.y + 1, preview.w - 2, preview.h - 2, [rgb.r, rgb.g, rgb.b, 255])

    //Draws the picking area
    Render.Rect(picker.x, picker.y, picker.w, picker.h, [0, 0, 0, 255])
    //Render.FilledRect(picker.x + 1, picker.y + 1, picker.w - 2, picker.h - 2, HUEtoRGB(color.h));
    Render.GradientRect(picker.x + 1, picker.y + 1, picker.w - 2, picker.h - 2, 1, [255, 255, 255, 255], HUEtoRGB(color.h));
    Render.GradientRect(picker.x + 1, picker.y + 1, picker.w - 2, picker.h - 2, 0, [0, 0, 0, 0], [0, 0, 0, 255]);

    //Draws the hue slider
    Render.Rect(hue.x, hue.y, hue.w, hue.h, [0, 0, 0, 255])
    for (var i = 0; i < picker.h - 2; i++) {
        Render.FilledRect(hue.x + 1, hue.y + i + 1, hue.w - 2, 1, HUEtoRGB(i * (360 / (picker.h - 1))))
    }

    //Draw position of the current selected color on the picking area
    Render.Rect(
        picker.x + (color.s * ((picker.w - 2) / 100)) - 1,
        picker.y - (color.v * ((picker.h - 2) / 100)) + picker.h - 3,
        5,
        5,
        [255 - (color.v * 2.55), 255 - (color.v * 2.55), 255 - (color.v * 2.55), 255]
    );

    //Draw position of the current selected hue on the hue slider
    Render.Rect(
        hue.x - 1,
        picker.y + (((picker.h - 2) / 360) * color.h) - 1,
        hue.w + 2,
        4,
        [55, 0, 0, 255]
    );

    //Draw preview of the selected color and transparency slider
    Render.Rect(alpha_slider.x, alpha_slider.y, alpha_slider.w, alpha_slider.h, [0, 0, 0, 255]);
    var alpha = 255 / (picker.w);

    for (var i = 0; i < picker.w - 2; i++) {
        Render.FilledRect(alpha_slider.x + i + 1, alpha_slider.y + 1, 1, alpha_slider.h - 2, [rgb.r, rgb.g, rgb.b, Math.round(alpha * i)]);
    }

    Render.Rect(
        alpha_slider.x - 1 + color.a / (255 / (picker.w - 2)),
        alpha_slider.y - 1,
        4,
        alpha_slider.h + 2,
        [55, 0, 0, 255]
    );

    //Some error handling (I suck at explaining)
    if (Input.IsKeyPressed(1) && !picker_boundary.in_boundary && !alpha_boundary.in_boundary && !keys_down.picker && !hue_boundary.in_boundary && !keys_down.hue && !keys_down.alpha)
        keys_down.outside = true;

    //Get color from the mouse position on the picking area
    if (Input.IsKeyPressed(1) && (picker_boundary.in_boundary || keys_down.picker) && !keys_down.hue && !keys_down.alpha && !keys_down.outside) {
        cursor = picker_boundary.boundary;
        color.s = (cursor.x - picker.x) / picker.w * 100;
        color.v = ((picker.y - cursor.y) / picker.h * 100) + 100;

        rgb = HSVtoRGB(color.h, color.s, color.v);
        keys_down.picker = true;
    }

    //Get hue from the mouse position on the hue slider
    if (Input.IsKeyPressed(1) && (hue_boundary.in_boundary || keys_down.hue) && !keys_down.picker && !keys_down.alpha && !keys_down.outside) {
        cursor = hue_boundary.boundary;
        color.h = Math.floor(((cursor.y - picker.y) / picker.h) * 360);

        rgb = HSVtoRGB(color.h, color.s, color.v);
        keys_down.hue = true;
    }

    //Get hue from the mouse position on the hue slider
    if (Input.IsKeyPressed(1) && (alpha_boundary.in_boundary || keys_down.alpha) && !keys_down.picker && !keys_down.hue && !keys_down.outside) {
        cursor = alpha_boundary.boundary;
        color.a = Math.round(alpha * (cursor.x - picker.x));
        keys_down.alpha = true;
    }

    //Reset key states
    if (!Input.IsKeyPressed(1)) {
        keys_down = { picker: false, hue: false, alpha: false, outside: false };
    }

    return { h: color.h, s: color.s, v: color.v, r: rgb.r, g: rgb.b, b: rgb.b, a: color.a };
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
        Render.FilledRect(gx + 2, gy + 2, 6, 6, [r, g, b, 255]);
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
        Render.FilledRect(gx + 2, gy + 14, val - 4, 6, [r, g, b, 255]);
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
        Render.FilledRect(gx + 2, gy + 15 + 90 - val - 4, 6, val, [r, g, b, 255]);
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
        Render.FilledRect(gx + 2, gy + 14, val - 4, 6, [r, g, b, 255]);
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

function MDXcolorpicker(text, gx, gy, color, open) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var font = Render.AddFont("Tahoma", 7, 700);
    var texty = gy;
    var endcolor = color;
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
        endcolor = color_picker(gx + 5, gy + 35, 200, 200, color);
    }
    Render.StringCustom(gx, texty, 0, text, [255, 255, 255, 150], font);
    Render.Rect(gx, gy + 12, 25, 15, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 27, 17, [27, 27, 27, 255]);
    Render.FilledRect(gx + 2, gy + 14, 10, 5, [214, 214, 214, 255]);
    Render.FilledRect(gx + 12, gy + 14, 11, 5, [255, 255, 255, 255]);
    Render.FilledRect(gx + 2, gy + 19, 10, 6, [255, 255, 255, 255]);
    Render.FilledRect(gx + 12, gy + 19, 11, 6, [214, 214, 214, 255]);
    var finalstagecolor = color;
    if (endcolor.h !== undefined) {
        var finalstagecolor = HSVtoRGB(endcolor.h, endcolor.s, endcolor.v);
    }
    Render.FilledRect(gx + 2, gy + 14, 21, 11, [finalstagecolor.r, finalstagecolor.g, finalstagecolor.b, endcolor.a]);
    return {
        r: finalstagecolor.r,
        g: finalstagecolor.g,
        b: finalstagecolor.b,
        a: finalstagecolor.a
    };
}

function MDXhotkey(text, gx, gy, keyNum) {
    var curPos = Input.GetCursorPosition();
    var curx = curPos[0];
    var cury = curPos[1];
    var font = Render.AddFont("Tahoma", 7, 700);
    var key = "---";
    for (i = 0; i < keyCodes.length; i++) {
        if (keyNum == keyCodes[i]) {
            key = keyChar[i].toUpperCase();
        }
    }

    for (i = 0; i < extraKeyCodes.length; i++) {
        if (keyNum == extraKeyCodes[i]) {
            key = extraKeyChar[i].toUpperCase();
        }
    }
    var texty = gy;
    if (curx > gx && curx < gx + 26 && cury > gy + 12 && cury < gy + 29) {
        texty = gy - 2;
        Render.Rect(gx - 3, gy + 9, 31, 23, [r, g, b, 255]);
        for (i = 0; i < keyCodes.length; i++) {
            if (Input.IsKeyPressed(keyCodes[i]) && Globals.Realtime() > globaltime + 0.2) {
                globaltime = Globals.Realtime();
                key = keyChar[i].toUpperCase();
                keyNum = keyCodes[i];
            }
        }

        for (i = 0; i < extraKeyCodes.length; i++) {
            if (Input.IsKeyPressed(extraKeyCodes[i]) && Globals.Realtime() > globaltime + 0.2) {
                globaltime = Global.Realtime();
                key = extraKeyChar[i].toUpperCase();
                keyNum = extraKeyCodes[i];
            }
        }
    }
    var keySize = Render.TextSizeCustom(key, font);
    var keySizex = keySize[0] / 2;
    Render.StringCustom(gx, texty, 0, text, [255, 255, 255, 150], font);
    Render.GradientRect(gx, gy + 12, 25, 17, 0, [12, 12, 12, 255], [24, 24, 24, 255]);
    Render.StringCustom(gx + 13 - keySizex, gy + 15, 0, key, [255, 255, 255, 150], font);
    Render.Rect(gx, gy + 12, 25, 17, [0, 0, 0, 255]);
    Render.Rect(gx - 1, gy + 11, 27, 19, [27, 27, 27, 255]);
    return keyNum;
}

function MDXsaveconfig(json) {
    var config = Base64.encode(json);
    Cheat.ExecuteCommand("xbox_throttlespoof " + config);
}

function MDXloadconfig() {
    var config = Base64.decode(Convar.GetString("xbox_throttlespoof"));
    return config;
}

function MDXimportconfig(config) {
    Cheat.ExecuteCommand("exec " + config);
    var loadconfig = MDXloadconfig();
    return loadconfig;
}

function MDXexportconfig() {
    var cmd = Convar.GetString("xbox_throttlespoof");
    Cheat.Print(cmd + "\n");
}

//#region Exported variables
exports.agx = agx;
exports.agy = agy;
//#endregion

//#region Exported functions
exports.menu = MDXmenu;
exports.tab = MDXtab;
exports.MDXTab = MDXTab;
exports.drag = MDXdrag;
exports.checkbox = MDXcheckbox;
exports.slider = MDXslider;
exports.verticalslider = MDXverticalslider;
exports.sliderfloat = MDXsliderfloat;
exports.button = MDXbutton;
exports.dropdown = MDXdropdown;
exports.textbox = MDXtextbox;
exports.colorpicker = MDXcolorpicker;
exports.saveconfig = MDXsaveconfig;
exports.loadconfig = MDXloadconfig;
exports.importconfig = MDXimportconfig;
exports.exportconfig = MDXexportconfig;
exports.hotkey = MDXhotkey;
exports.create_color = create_color;
exports.base = Base64;
//#endregion