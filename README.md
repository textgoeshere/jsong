# jsong

Filter JSON with regexen and display the complete path of keys to the results. Streaming-friendly.

When you know roughly what you need, but you can't remember the path to get there.

Given some nested JSON, `my.json`:

     {
       "foo": {
         "bar": {
           "zip": "val1",
           "zap": "val2",
           "arr": [1, 2, 3, 4, 5, 6]
         }
       },
       "quux": {
         "zip": "val"
       }
     }

Filter by regex matching key with `-k`:

     $ cat my.json | jsong -k 'z\wp'

     foo.bar.zip: val1
     foo.bar.zap: val2
     quux.zip: val

It will return everything nested below a matching key:

    $ cat my.json | jsong -k fo
    
    foo.bar.zip: val1
    foo.bar.zap: val2

Filter by regex matching value with `-v`:

     cat my.json | jsong -v 'val\d'

     foo.bar.zip: val1
     foo.bar.zap: val2

Filter by regex matching key or value with `-a`:

     cat my.json | jsong -a '[\w]{4}'

     foo.bar.zip: val1
     foo.bar.zap: val2
     quux.zip: val

It will show paths including array indices:

    cat my.json | jsong -v 5

    foo.bar.arr[4]: 5

## Requirements
   
* `nodejs`
* `npm`

## Installation
   
It usually makes sense to install `jsong` globally so all users can use it:   

    $ npm install -g jsong

## Usage

    `jsong [filename] [options]`

If no filename is given, `jsong` reads from `STDIN`.

Filtering is disjunctive - the result will be displayed if at least one of the filters match.

Depending on the vagaries of your shell, you may have to single-quote your regexen.

### Options

* `-k`, `--key`: optional regex, default null

Display result line if any of the keys match the regex.

* `-v`, `--value`: optional regex, default null

Display result line if the value matches the regex.

* `-a`, `--any`: optional regex, default null

Display path of keys/array indices to values if any of the keys or the value match the regex.

* `-h`, `--help`: display help
