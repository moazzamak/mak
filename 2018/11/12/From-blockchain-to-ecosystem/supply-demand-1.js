var price = 10000;
var itemcount = 0;

var data = [];
var scale = Math.min(window.devicePixelRatio, 2.5);

var container = d3.select('div#colorbox1');
var svg = container
	.classed("svg-container", true) //container class to make it responsive
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 " + 600/scale + " " + 400/scale)
	.classed("svg-content-responsive", true);


var	margin = {right: 50, left: 50},
	width = (svg.node().getBoundingClientRect().width)/2 - margin.left/2,
	height = svg.node().getBoundingClientRect().height;

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + width/2 + "," + (height - 70) + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); })
        .on("end", function() { reset(x.invert(d3.event.x)) }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(1))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return (d == 0)?"More Sellers" : "More Buyers"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var reset = function (xval){
	slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("hue", function() {
      var i = d3.interpolate(xval, 50);
      return function(t) { hue(i(t)); };
    });
}

reset(50);

function calcPrice(p, odelta){
	price = price * Math.exp(odelta/500);
	return price;
}

function hue(h) {
	handle.attr("cx", x(h));
	svg.style("background-color", d3.hsl(h, 0.8, 0.9));

	odelta = h-50;
	data.push({"idx": itemcount, "val": calcPrice(price, odelta)});
	itemcount = itemcount + 1;
	plotData();
}

// set the ranges
var xaxis = d3.scaleLinear().range([50, width*2 -50 ]);
var yaxis = d3.scaleLinear().range([height-100, 50]);

// define the line
var valueline = d3.line()
    .x(function(d) { return xaxis(d.idx); })
    .y(function(d) { return yaxis(d.val); });

// Get the data
function plotData() {
	// Scale the range of the data
	xaxis.domain(d3.extent(data, function(d) { return d.idx; }));
	yaxis.domain([0, d3.max(data, function(d) { return d.val; })]);
	
	//var tr = d3.select("body").transition();
	// Make the changes
	svg.select(".line")   // change the line
		.attr("d", valueline(data));
	svg.select(".x.axis") // change the x axis
	    .call(xaxis);
	svg.select(".y.axis") // change the y axis
	    .call(yaxis);
}

// Add the valueline path.
svg.append("path")
	.data([data])
	.attr("class", "line")
	.attr("transform", "translate(0," + 0 + ")")
	.attr("d", valueline);

// Add the X Axis
svg.append("g")
	.attr("transform", "translate(0," + (height-100) + ")")
	.call(d3.axisBottom(xaxis));

// Add the Y Axis
svg.append("g")
	.attr("transform", "translate(50," + 0 + ")")
	.call(d3.axisLeft(yaxis));