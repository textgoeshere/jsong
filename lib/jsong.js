'use strict';

var fs       = require("fs"),
    streamin = require("streamin"),
    nopt     = require("nopt"),
    clarinet = require("clarinet");

var filter = function(options) {
    var parser   = clarinet.createStream(),
        stack    = [],
        key_match   = false,
        value_match = false,
        any_match   = false,
        empty       = true;

    var incrementArrayIndex = function() {
        if(typeof stack[stack.length - 1] === 'number') { // it's an array index
            stack[stack.length - 1] += 1;
        };
    };

    var print = function(val) {
        var str = "";
        stack.forEach(function(key) {
                          if(typeof key === 'number') {
                              str += "[" + key + "]";
                          } else {
                              if (str == "") {
                                  str = key;
                              } else {
                                  str += "." + key;                              
                              };
                          };
                      });
        str = str + ": " + val;
        console.log(str);
    };

    var updateKeyMatch = function(key) {
        if(stack.length <= key_match) {
            key_match = false;
        };

        if(!key_match) {
            key_match = ((options.key && key.match(options.key)) || 
                         (options.any && key.match(options.any))) ? 
                stack.length : false;            
        };
    };

    parser.onopenobject = function(key) {
        incrementArrayIndex();
        stack.push(key);
        if(key) { // don't try to match if the object is empty
            updateKeyMatch(key);            
        };
        empty = true;
    };

    parser.oncloseobject = function() {        
        stack.pop();
        if(empty) {
            if (stack.length == 0) {
                console.log("<empty>");
            } else if(!options.filter || key_match) {
                print("{}");
            }
        }
    };

    parser.onopenarray = function() {
        empty = false;
        incrementArrayIndex();
        // the first element in the array will increment this to 0 (i.e. its index)
        stack.push(-1);
    };

    parser.onclosearray = function() {
        empty = false;
        var number_of_elements = stack.pop();
        if(number_of_elements < 0 && (!options.filter || key_match)) {
            print("[]");
        }
    };

    parser.onkey = function(key) {
        empty = false;
        incrementArrayIndex();

        stack.pop();
        stack.push(key);
        
        updateKeyMatch(key);
    };

    parser.onvalue = function(value) {
        empty = false;
        incrementArrayIndex();

        var str = String(value);

        value_match = ((options.value && str.match(options.value)) || 
                       (options.any && str.match(options.any))) ? 
                      true : false;

        if(!options.filter || (key_match || value_match)) {
            print(str);
        };
    };

    streamin(options.input).pipe(parser);
};

// exports

exports.cli = function(args) {
    var options = nopt({
                           "key":   String,
                           "value": String,
                           "any":   String,
                           "help":  String
                       }, {}, args);

    if(options.help) {
        console.log("Usage: jsong [filename] [[-k key regexp] [-v value regex] [-a any regex]]");
        console.log("If [filename] is not supplied, STDIN is used.");
        process.exit(1);
    }

    if (options.argv.remain.length == 1) { // filename given
        options.input = options.argv.remain.shift();
    } else { // use STDIN
        options.input = process.stdin;
    }    
    if(options.key || options.value || options.any) {
        options.filter = true;        
    }
    filter(options);
};
