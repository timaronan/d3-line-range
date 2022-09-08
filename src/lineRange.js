import { max as d3Max } from 'd3-array';
import { axisLeft as d3AxisLeft } from 'd3-axis';
import { axisLeft as d3AxisBottom } from 'd3-axis';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import { area as d3Area } from 'd3-shape';
import 'd3-transition';

export default function() {
	//layout variables
  	var margin = {top: 30, right: 80, bottom: 70, left: 100};
	var height = 500;
	var width = 1050;
	var innerWidth = width - margin.left - margin.right;
	var innerHeight = height - margin.top - margin.bottom;

	//formatting of axis labels
	var xFormat = function(d, i){ return i + 1999; };
	var yFormat = function(d, i){ return d/1000 + 'k'; };

	//data stores
	var data = [];
  	var hidden = [];
	var lengths = data.map(function(a){return a.length;});
	var maxLength = d3Max(lengths);
	var all = data.reduce(function( acc, cur ){acc.concat(cur)},[]);
	//data keys for drawing
	var bottom = 0;
	var middle = 1;
	var top = 2;

	//range pattern variables
	var patternStyle = {
		x : 0,
		width : 3,
		y : 0,
		height : 3
	};
	var rectStyle = {
		x : 1,
		width : 2,
		y : 1,
		height : 2
	};

	//styling variables
	var duration = 1000;

	//methods
	var updateDuration = null;
	var updateHidden = null;
	var updateLayout = null;
	var updateData = null;
	var updateKeys = null;

	function lineRange(selection){
		selection.each(function () {
			//parent DOM variables
			var dom = d3Select(this);
			var svg = dom.append('svg');
			var shapes = svg.append('g');
			var pathGroup = shapes.selectAll('g.line-shape').data(data);
			var pathEnter = pathGroup.enter().append('g');
			var pathDefs = pathEnter.append('defs');

			//axis related variables
			var x = null;
			var y = null;
			var xAxis = null;
			var yAxis = null;
			var xAxisGroup = null;
			var yAxisGroup = null;

			//line related variables
			var line = null;
			var area = null;

			//svg setup
			svg.attr('width', '100%')
			  .attr('height', '100%')
			  .attr('viewBox', '0 0 '+width+' '+height)
			  .attr('preserveAspectRatio', 'xMidYMid');

			//axis and scale creation
			x = d3ScaleLinear()
			  .range([margin.left, innerWidth]);
			y = d3ScaleLinear()
			  .range([innerHeight, margin.top]);

			x.domain([0, maxLength - 1]);
			y.domain([0, d3Max(all, function(d) { return d[top]; })]);

			xAxis = d3AxisBottom()
			  .scale(x)
			  .ticks(maxLength - 1)
			  .tickFormat(xFormat);
			yAxis = d3AxisLeft()
			  .scale(y)
			  .tickFormat(yFormat);

			xAxisGroup = svg.append('g')
			  .attr('class', 'x axis')
			  .attr('transform', 'translate(0,' + innerHeight + ')')
			  .call(xAxis);
			yAxisGroup = svg.append('g')
			  .attr('class', 'y axis')
			  .attr('transform', 'translate('+ margin.left +',0)')
			  .call(yAxis);

			//svg shape creation
			shapes.attr('class', 'shapes');

			line = d3Line()
			  .x(function(d,i) { return x(i); })
			  .y(function(d,i) { return y(d[middle]); });

			area = d3Area()
			  .x(function(d,i) { return x(i); })
			  .y0(function(d) { return y(d[bottom]); })
			  .y1(function(d) { return y(d[top]);  });

			// Define Group Attributes
			pathEnter
				.attr('id', function(d,i){
					return 'shape'+i;
				})
				.attr('class', function(d,i){
					return 'line-shape style-'+i;
				})
				.attr('clip-path', function(d,i){
					return 'url(#clip'+i+')';
				});

			// Define Path Group Styling
			pathDefs.append('pattern')
				.attr('id', function(d,i){
					return 'pattern'+i;
				})
				.attr('x', patternStyle.x)
				.attr('width', patternStyle.width)
				.attr('y', patternStyle.y)
				.attr('height', patternStyle.height)
				.attr('patternUnits', 'userSpaceOnUse')
				.append('rect')
				.attr('x', rectStyle.x)
				.attr('width', rectStyle.width)
				.attr('y', rectStyle.y)
				.attr('height', rectStyle.height);
			pathDefs.append('clipPath')
				.attr('id', function(d,i){
					return 'clip'+i;
				})
				.append('rect')
				.attr('class', 'clip-rect')
				.attr('height', height)
				.attr('width', width);

			// Build Graph Paths
			pathEnter.append('path')
				.attr('class', 'line')
				.attr('d', line)
				.attr('fill', 'none');
			pathEnter.append('path')
				.attr('class', 'area')
				.attr('d', area)
				.attr('fill', function(d,i){
					return 'url(#pattern'+i+')';
				});

			updateDuration = function() {
				console.log('Duration = '+duration);
			};

			updateKeys = function() {
				var updateLine = svg.selectAll('.line');
				var updateArea = svg.selectAll('.area');
				y.domain([0, d3Max(all, function(d) { return d[top]; })]);

				updateLine
					.transition()
					.duration(1000)
					.attr('d', line);
				updateArea
					.transition()
					.duration(1000)
					.attr('d', area);
			};

			updateHidden = function() {
				svg.selectAll('.clip-rect')
					.transition()
					.duration(duration)
					.attr('width', width);

				hidden.forEach(function(d){
					d3Select('#clip'+d)
						.select('.clip-rect')
						.transition()
						.duration(duration)
						.attr('width', 0);
				});
			};

			updateLayout = function() {
				var updateLine = svg.selectAll('.line');
				var updateArea = svg.selectAll('.area');
				var updateClip = svg.selectAll('.clip-rect');

				svg.transition()
					.duration(duration).attr('viewBox', '0 0 '+width+' '+height);

				//axis and scale upate
				x.range([margin.left, innerWidth])
				 	.domain([0,maxLength - 1]);
				y.range([innerHeight, margin.top])
				 	.domain([0, d3Max(all, function(d) { return d[top]; })]);

				xAxis.scale(x);
				yAxis.scale(y);

				yAxisGroup
					.transition()
					.duration(duration)
			  		.attr('transform', 'translate('+ margin.left +',0)')
					.call(yAxis);
				xAxisGroup
					.transition()
					.duration(duration)
			  		.attr('transform', 'translate(0,' + innerHeight + ')')
					.call(xAxis);

				//update SVG elements
				updateClip
					.transition()
					.duration(duration)
					.attr('height', height)
					.attr('width', width);
				updateLine
					.transition()
					.duration(1000)
					.attr('d', line);
				updateArea
					.transition()
					.duration(1000)
					.attr('d', area);
			};

			updateData = function() {
				x.domain([0,maxLength - 1]);
				y.domain([0, d3Max(all, function(d) { return d[top]; })]);

				xAxis.scale(x);
				yAxis.scale(y);

				yAxisGroup
					.transition()
					.duration(duration)
					.call(yAxis);
				xAxisGroup
					.transition()
					.duration(duration)
					.call(xAxis);

				// D3 Update Pattern
				// ex.) https://bl.ocks.org/mbostock/3808234
				var update = shapes.selectAll('g.line-shape')
					.data(data);
				var updateLine = update.select('.line');
				var updateArea = update.select('.area');
								var updateExit = update.exit();

				// EXIT old elements not present in new data.
				updateExit.select('clipPath').select('.clip-rect')
					.transition()
					.duration(1000)
					.delay(function(d, i) { return (data.length - i) * 20; })
					.attr('width', 0);
				updateExit.transition()
					.duration(0)
					.delay(function(d, i) { return 1000 + ((data.length - i) * 20); })
					.remove();

				// UPDATE old elements present in new data.
				update.attr('id', function(d,i){
						return 'shape'+i;
					})
					.attr('class', function(d,i){
						return 'line-shape style-'+i;
					});
				updateLine
					.transition()
					.duration(1000)
					.attr('d', line);
				updateArea
					.transition()
					.duration(1000)
					.attr('d', area);

				// ENTER new elements present in new data.
				var enter = update.enter().append('g');
				var defs = enter.append('defs');

				// Define Group Attributes
				enter.attr('id', function(d,i){
						return 'shape'+i;
					})
					.attr('class', function(d,i){
						return 'line-shape style-'+i;
					})
					.attr('clip-path', function(d,i){
						return 'url(#clip'+i+')';
					});

				// Define Path Group Styling
				defs.append('pattern')
					.attr('id', function(d,i){
						return 'pattern'+i;
					})
					.attr('x', patternStyle.x)
					.attr('width', patternStyle.width)
					.attr('y', patternStyle.y)
					.attr('height', patternStyle.height)
					.attr('patternUnits', 'userSpaceOnUse')
					.append('rect')
					.attr('x', rectStyle.x)
					.attr('width', rectStyle.width)
					.attr('y', rectStyle.y)
					.attr('height', rectStyle.height);
				defs.append('clipPath')
					.attr('id', function(d,i){
						return 'clip'+i;
					})
					.append('rect')
					.attr('class', 'clip-rect')
					.attr('height', height)
					.attr('width', 0)
					.transition()
					.duration(1000)
					.attr('width', width);

				// Build Graph Paths
				enter.append('path')
					.attr('class', 'line')
					.attr('d', line)
					.attr('fill', 'none');
				enter.append('path')
					.attr('class', 'area')
					.attr('d', area)
					.attr('fill', function(d,i){
						return 'url(#pattern'+i+')';
					});
			}

		});
	}

  	lineRange.layout = function(value) {
		if (!arguments.length) return {height:height,width:width,margin:margin};
		height = value.height || height;
		width = value.width || width;
		margin = value.margin || margin;
		innerWidth = width - margin.left - margin.right;
		innerHeight = height - margin.top - margin.bottom;
		if (typeof updateLayout === 'function') updateLayout();
		return lineRange;
	};

  	lineRange.duration = function(value) {
		if (!arguments.length) return duration;
		duration = value;
		if (typeof updateDuration === 'function') updateDuration();
		return lineRange;
	};
	
  	lineRange.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		lengths = data.map(function(a){return a.length;});
		maxLength = d3Max(lengths);
		all = data.reduce(function( acc, cur ){return acc.concat(cur)},[]);
		if (typeof updateData === 'function') updateData();
		return lineRange;
	};
	
	lineRange.hide = function(value) {
		if (!arguments.length) return hidden;
		hidden = value;
		if (typeof updateHidden === 'function') updateHidden();
		return lineRange;
	};
	
	lineRange.keys = function(value) {
		if (!arguments.length) return {bottom:bottom,middle:middle,top:top};
		bottom = value.bottom || bottom;
		middle = value.middle || middle;
		top = value.top || top;
		if (typeof updateKeys === 'function') updateKeys();
		return lineRange;
	};

	return lineRange;
};