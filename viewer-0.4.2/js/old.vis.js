// VARS
var width = $("div#main").width();
var height = $(window).height();
var color = d3.scale.category10();

//FORCE LAYOUT
var nodes = [], links = [];
var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-400)
	.linkDistance(120)
	.size([width, height])
	.on("tick", tick);

function showNetwork() {
	
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
		svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
	}
	
	// SVG-G-RECT (FOR TEXT)
	svg.append('svg:rect')
		.attr('width', width)
		.attr('height', height)
		.attr('fill', '#f0f0f0');
	
	// SET NODES AND LINKS
	node = svg.selectAll(".node");
	link = svg.selectAll(".link");
}

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
		//showPanel('ul.tab li a#a_tab3');
		$('#floatWindowProperty').fadeIn('fast');
		getProperty(d, "node");
		getPropertyNei(d, "node");
		//force.resume();
		return false;
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

function showTable(data, columns) {
	
	d3.select("div#d3svg").remove();
	d3.select("div#main table").remove();
	
    var table = d3.select("div#main").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
    
    return table;
}

var mode = 'network';
function reload() {
	if (mode == 'table') {
		showTable(nodes, ["name", "type"]);
	} else if (mode == 'network') {
		start();
	}
}
function load() {
	if (mode == 'table') {
		showTable(nodes, ["name", "type"]);
	} else if (mode == 'network') {
		showNetwork();
	}
}

// LOAD
load();

// STARTING DEMO
setTimeout(function() {
	var a = {id: "a", name: "Neo", type: "gene"};
	var b = {id: "b", name: "Smith", type: "protein"};
	var c = {id: "c", name: "Smith", type: "protein"};
	nodes.push(a, b, c);
	links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
	reload();
}, 0);
setTimeout(function() {
	nodes.splice(1, 1); // remove b
	links.shift(); // remove a-b
	links.pop(); // remove b-c
	reload();
}, 3000);
setTimeout(function() {
	var a = nodes[0], b = {id: "b", name: "Smith", type: "protein"}, c = nodes[1];
	nodes.push(b);
	links.push({source: a, target: b}, {source: b, target: c});
	reload();
}, 3500);



