var price = 10000;
var itemcount = 0;

var data2 = [];
var scale = Math.min(window.devicePixelRatio, 2.5);

var container2 = d3.select('div#colorbox2');
var svg2 = container2
	.classed("svg-container", true) //container class to make it responsive
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 " + 600/scale + " " + 400/scale)
	.classed("svg-content-responsive", true);


var	margin = {right: 50, left: 50},
	width = (svg2.node().getBoundingClientRect().width)/2 - margin.left/2,
	height = svg2.node().getBoundingClientRect().height;

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider2 = svg2.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + width/2 + "," + (height - 70) + ")");

slider2.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider2.interrupt(); })
        .on("start drag", function() { hue2(x.invert(d3.event.x)); })
        .on("end", function() { reset2(x.invert(d3.event.x)) }));

slider2.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(1))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return (d == 0)?"More Sellers" : "More Buyers"; });

var handle2 = slider2.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var reset2 = function (xval){
	slider2.transition() // Gratuitous intro!
    .duration(750)
    .tween("hue2", function() {
      var i = d3.interpolate(xval, 50);
      return function(t) { hue2(i(t)); };
    });
}

reset2(50);
var numTokens = 100000;
var numSoldTokens = 1000;
function calcPriceLog(p, odelta){
	price = price + 1000000000 * Math.log(numTokens / (numTokens - odelta))/numSoldTokens;
	numSoldTokens = numSoldTokens + odelta;
	return price;
}

function hue2(h) {
	handle2.attr("cx", x(h));
	svg2.style("background-color", d3.hsl(h, 0.8, 0.9));

	odelta = h-50;
	data2.push({"idx": itemcount, "val": calcPriceLog(price, odelta)});
	itemcount = itemcount + 1;
	plotData2();
}

// set the ranges
var xaxis2 = d3.scaleLinear().range([50, width*2 -50 ]);
var yaxis2 = d3.scaleLinear().range([height-100, 50]);

// define the line
var valueline2 = d3.line()
    .x(function(d) { return xaxis2(d.idx); })
    .y(function(d) { return yaxis2(d.val); });

// Get the data
function plotData2() {
	// Scale the range of the data
	xaxis2.domain(d3.extent(data2, function(d) { return d.idx; }));
	yaxis2.domain([0, d3.max(data2, function(d) { return d.val; })]);
	
	//var tr = d3.select("body").transition();
	// Make the changes
	svg2.select(".line")   // change the line
		.attr("d", valueline2(data2));
	svg2.select(".x.axis") // change the x axis
	    .call(xaxis2);
	svg2.select(".y.axis") // change the y axis
	    .call(yaxis2);
}

// Add the valueline path.
svg2.append("path")
	.data([data])
	.attr("class", "line")
	.attr("transform", "translate(0," + 0 + ")")
	.attr("d", valueline2);

// Add the X Axis
svg2.append("g")
	.attr("transform", "translate(0," + (height-100) + ")")
	.call(d3.axisBottom(xaxis2));

// Add the Y Axis
svg2.append("g")
	.attr("transform", "translate(50," + 0 + ")")
	.call(d3.axisLeft(yaxis2));