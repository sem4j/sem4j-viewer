
var width = $("div#main").width();
var height = $(window).height();

var color = d3.scale.category10();

var svg = d3.select("div#d3svg").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .append('svg:g')
    .call(d3.behavior.zoom().on("zoom", redraw));

function redraw() {
	console.log("here", d3.event.translate, d3.event.scale);
	svg.attr("transform",
	  "translate(" + d3.event.translate + ")"
	  + " scale(" + d3.event.scale + ")");
}

svg.append('svg:rect')
	.attr('width', width)
	.attr('height', height)
	.attr('fill', '#f0f0f0');

var nodes = [], links = [];
var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-400)
	.linkDistance(120)
	.size([width, height])
	.on("tick", tick);

var node = svg.selectAll(".node"), link = svg.selectAll(".link");

function start() {
	
	link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
	link.enter().insert("line", ".node").attr("class", "link");
	link.exit().remove();

	node = node.data(force.nodes(), function(d) { return d.id;});
	node.enter()
		.append("circle")
		.attr("class", function(d) { return "node " + d.id; })
		.attr("r", 8)
		.style("fill", function(d) { return color(d.type); })
		.call(force.drag);
	node.exit().remove();
	
	node.append("svg:text")
    .attr("x", function(d) {return d.x;})
    .attr("y", function(d) {return d.y;})
    .text(function(d) { return d.name; });
	
	force.start();

	svg.selectAll(".node").on("click", function(d) {
	  showPanel('ul.tab li a#a_tab3');
	  getProperty(d, "node");
	  getPropertyNei(d, "node");
	  //force.resume();
	});
}

function tick() {
	node.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; });

	link.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });
}


//1. Add three nodes and three links.
setTimeout(function() {
	var a = {id: "a", type: "gene"};
	var b = {id: "b", type: "protein"};
	var c = {id: "c", type: "protein"};
	nodes.push(a, b, c);
	links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
	start();
}, 0);

//2. Remove node B and associated links.
setTimeout(function() {
	nodes.splice(1, 1); // remove b
	links.shift(); // remove a-b
	links.pop(); // remove b-c
	start();
}, 3000);

//Add node B back.
setTimeout(function() {
	var a = nodes[0], b = {id: "b", type: "protein"}, c = nodes[1];
	nodes.push(b);
	links.push({source: a, target: b}, {source: b, target: c});
	start();
}, 3500);
