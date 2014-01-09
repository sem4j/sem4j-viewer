// VARS
var width = $("div#main").width();
var height = $(window).height();
var color = d3.scale.category10();

// SVG
var svg = d3.select("div#d3svg").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all");

// SVG-G (FOR ZOOM)
svg = svg.append("svg:g")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .on("dblclick.zoom", null); // DISABLE DOUBLE CLICK
function redraw() {
	console.log("here", d3.event.translate, d3.event.scale);
	svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
}

// SVG-G-RECT (FOR TEXT)
svg.append('svg:rect')
	.attr('width', width)
	.attr('height', height)
	.attr('fill', '#f0f0f0');

// FORCE LAYOUT
var nodes = [], links = [];
var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-400)
	.linkDistance(120)
	.size([width, height])
	.on("tick", tick);

// SET NODES AND LINKS
var node = svg.selectAll(".node");
var link = svg.selectAll(".link");

// START (RE-)LOADING LAYOUT
function start() {
	
	// LINK
	link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
	link.enter().insert("svg:line", ".node").attr("class", "link");
	//link.enter().append("line").attr("class", "link");
	link.exit().remove();
	
	// NODE
	node = node.data(force.nodes(), function(d) { return d.id; });
	nodeG = node.enter().append("svg:g")
		.attr("class", function(d) { return "node-" + d.id; })
		.call(force.drag);
	nodeG.append("svg:circle")
		.attr("r", 8)
		.style("fill", function(d) { return color(d.type); });
	nodeG.append("svg:text")
    	.attr("dx", 12)
    	.attr("dy", ".35em")
    	.attr("font-family", "sans-serif")
    	.attr("font-size", "10px")
    	.style("stroke-width", 0)
    	.text(function(d) { return d.name });
	node.exit().remove();
	
	// FORCE LAYOUT START
	force.start();
	
	// CLICK AND DOUBLE CLICK
	node
	.on("click", function(d) {
		showPanel('ul.tab li a#a_tab3');
		getProperty(d, "node");
		getPropertyNei(d, "node");
		//force.resume();
	})
	.on("dblclick", function(d){
		addAllNeighbours(d.id, "node");
	});
}

function tick() {
	// LINK
	link
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });
	// NODE
	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

// STARTING DEMO
setTimeout(function() {
	var a = {id: "a", name: "Neo", type: "gene"};
	var b = {id: "b", name: "Smith", type: "protein"};
	var c = {id: "c", name: "Smith", type: "protein"};
	nodes.push(a, b, c);
	links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
	start();
}, 0);
setTimeout(function() {
	nodes.splice(1, 1); // remove b
	links.shift(); // remove a-b
	links.pop(); // remove b-c
	start();
}, 3000);
setTimeout(function() {
	var a = nodes[0], b = {id: "b", name: "Smith", type: "protein"}, c = nodes[1];
	nodes.push(b);
	links.push({source: a, target: b}, {source: b, target: c});
	start();
}, 3500);
