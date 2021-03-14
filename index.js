function getBrailleMap() {
    //example: H is 125
    return {
        "a": 0x2801,
        "á": 0x2821,
        "ä": 0x2808,
        "b": 0x2803,
        "c": 0x2809,
        "č": 0x2829,
        "d": 0x2819, //2819
        "ď": 0x2839,
        "e": 0x2811, //2811
        "é": 0x281C,
        "f": 0x280B,
        "g": 0x281B,
        "h": 0x2813,
        "i": 0x280a,
        "í": 0x280C,
        "j": 0x281A,
        "k": 0x2805,
        "l": 0x2807,
        "ĺ": 0x2828,
        "ľ": 0x2838,
        "m": 0x280d,
        "n": 0x281d,
        "ň": 0x282b,
        "o": 0x2815,
        "ó": 0x282A,
        "ô": 0x283E,
        "p": 0x280f,
        "q": 0x281f,
        "r": 0x2817,
        "ŕ": 0x2837,
        "s": 0x280E,
        "š": 0x2831,
        "t": 0x281E,
        "ť": 0x2833,
        "u": 0x2825,
        "ú": 0x282C,
        "v": 0x2827,
        "w": 0x2837,
        "x": 0x282d,
        "y": 0x283d,
        "ý": 0x282F,
        "z": 0x2835,
        "ž": 0x282e,
        ",": 0x2802,
        ";": 0x2806,
        ":": 0x2812,
        ".": 0x2832,
        "?": 0x2822,
        "!": 0x2816,
        "\"": 0x2836,
        "(": 0x2826,
        ")": 0x2834,
        "'": 0x2804,
        "=": 0x283F,
        "/": 0x283B,
        "|": 0x2807,
        "*": 0x2814,
        "-": 0x2824,
        "−": 0x2824,
        "+": 0x2832,
        "@": 0x2808
    };
}

var bm = getBrailleMap();
var uppercase = String.fromCharCode(0x2820);
var capslock = String.fromCharCode(0x2830);
var lowercase = String.fromCharCode(0x2810);

function isUpper(ch) {
    return ch.toUpperCase() === ch;
}

function findLongestUpperCaseSequence(text) {

    for (var i = 0; i < text.length; i++) {
        if (text.substr(0, i) !== text.substr(0, i).toUpperCase())
            return text.substr(0, i - 1);
    }
    return text;
}

function findLongestNumericSequence(text) {
    return '';
}

function charToBraille(ch) {
    if (ch in bm) {
        return String.fromCharCode(bm[ch]);
    } else {
        return ch;
    }
}

function unicodeToBrailleNew(text) {
    //single capital letter uppercase: b6
    //scan for upper case sequence - interrupted by whitespace, separator, 
    var bm = getBrailleMap();

    var result = "";

    while (text.length > 0) {
        var upperCaseSequence = findLongestUpperCaseSequence(text);
        //single upper case - emit b6
        if (upperCaseSequence.length == 1) {
            result += uppercase;
            result += charToBraille(upperCaseSequence.toLowerCase());
            text = text.substr(1);
            continue;
        }

        if (upperCaseSequence.length > 0) {


            //consume the sequence
            text = text.substr(upperCaseSequence.length);
            continue;
        }
        var numericSequence = findLongestNumericSequence(text);
        if (numericSequence.length > 0) {
            //consume the sequence - map 1234567890 to abcdefghij
            text = text.substr(numericSequence.length);
            continue;
        }
        //single character conversion
        var ch = text.charAt(0);
        result += charToBraille(ch);
        text = text.substr(1);
    }

    return result;
}

function unicodeToBraille(text) {
    //slovak braille rules
    //first break down - numbers get turned into sequences, prefixed with 0x
    //TODO preprocess numbers
    //numbers start with b3456 and end with whitespace (so ,.: is allowed)

    //preprocess upper case
    //single letter is prefixed with b6
    //multiple letters are prefixed with b6 b6 and are terminated by: space, b56(lowercase), b3456(number)
    //so we need to apply a regex ([0-9]+ from the current position, keep state)

    var state = 0; // lowercase, uppercase, number

    //

    result = "";
    bm = getBrailleMap();
    for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch in bm) {
            result += String.fromCharCode(bm[ch]);
        } else {
            result += ch;
        }
    }
    return result;
}

function convert() {
    var text = document.getElementById("source").value;
    document.getElementById("destination").value = unicodeToBraille(text);
    document.getElementById("destination2").value = unicodeToBrailleNew(text);
}