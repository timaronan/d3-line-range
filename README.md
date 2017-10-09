# d3-line-range v4

d3 v4 port of http://timaronan.com/lines/

## Installing

If you use NPM, `npm install d3-line-range`.

## API Reference

<a name="lineRange" href="#lineRange">#</a> d3.<b>lineRange</b>()

Constructs a new default [lineRange generator](#_lineRange).

<a name="_lineRange" href="#_lineRange">#</a> <i>lineRange</i>(<i>data</i>)

For example:

```js
var data = [[1,2,3],[1,7,9],[2,7,12]]; 
var lineRange = d3.lineRange().data(data);
var parent = d3.select('body').call(lineRange);
```

<a name="lineRange_layout" href="#lineRange_layout">#</a> <i>lineRange</i>.<b>layout</b>([<i>{width:width,height:height,margin{top:top,bottom:bottom,left:left,right:right}}</i>])

If *layout* is specified, sets the *layout* and returns this lineRange generator. If *layout* is not specified, returns the current *layout*, which defaults to:  ```{margin:{top: 100, right: 80, bottom: 100, left: 10},width:1500, height:2000}```

<a name="lineRange_duration" href="#lineRange_duration">#</a> <i>lineRange</i>.<b>duration</b>([<i>duration</i>])

If *duration* is specified, sets the animation *duration* and returns this lineRange generator. If *duration* is not specified, returns the current *duration*, which defaults to:  ```1000```

<a name="lineRange_hide" href="#lineRange_hide">#</a> <i>lineRange</i>.<b>hide</b>([<i>hide</i>])

If *hide* is specified, sets the *hide* and returns this lineRange generator. This will hide lines of a specified ID with an animation. If *hide* is not specified, returns the current *hide*, which is the hidden lines by ID, which defaults to:  ```[]```

<a name="lineRange_keys" href="#lineRange_keys">#</a> <i>lineRange</i>.<b>keys</b>([<i>{top,middle,bottom}</i>])

If *keys* is specified, sets the *keys* and returns this lineRange generator. If *keys* is not specified, returns the current *keys*, which are the keys for the range values, which default to:  ```{bottom:0,middle:1,top:2}```
