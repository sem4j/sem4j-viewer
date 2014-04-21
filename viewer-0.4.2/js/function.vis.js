var visMode = "cy";

$(function(){
	if(visMode=="cy"){
		$('#cy').cytoscape({
			style: cytoscape.stylesheet()
				.selector('node')
				.css({
					'content': 'data(name)',
					'text-valign': 'top',
					'color': 'black',
					//'text-outline-width': 2,
					//'text-outline-color': '#888',
					'min-zoomed-font-size': 7,
					'border-color': 'white',
					'border-width': 3,
				})
				.selector('edge')
				.css({
					'target-arrow-shape': 'triangle'
				})
				.selector(':selected')
				.css({
					'background-color': 'black',
					'line-color': 'black',
					'target-arrow-color': 'black',
					'source-arrow-color': 'black'
				})
				.selector('.faded')
				.css({
					'opacity': 0.25,
					'text-opacity': 0
				}),
		  
			elements: {
				nodes: [],
				edges: []
			},
		    
		  	ready: function(){
			    window.cy = this;
			    
			    cy.elements().unselectify();
			    
			    // TAP NODES
			    cy.on('tap', 'node', function(e){
					var node = e.cyTarget; 
					var neighborhood = node.neighborhood().add(node);
					  
					cy.elements().addClass('faded');
					neighborhood.removeClass('faded');
					
					$('#floatWindowProperty').fadeIn('fast');
					getProperty(node._private.data, "node");
					getPropertyNei(node._private.data, "node");
					//addAllNeighbours(node._private.data.id);
			    });
			    
			    // TAP BACKGROUND
			    cy.on('tap', function(e){
			      if( e.cyTarget === cy ){
			        cy.elements().removeClass('faded');
			      }
			    });
			    
			    // QUICK DEMO
			    setTimeout(function() {
			    	runCypher();
			    }, 500);
		  	}
		});
	}
});

/*
function visAddNode(vnode){
	if(visMode=="cy"){
		
		cy.add({
			group: "nodes",
			data: vnode,
			position: { x: ($(window).width() / 2), y: ($(window).height() / 2) }
		});
		visRedraw();
	}
	else if(visMode=="d3"){
		nodes.push(vnode);
		start();
	}
}
*/
function visAddGraph(vgraph){
	if(visMode=="cy"){
		for(var i=0; i<vgraph.nodes.length; i++){
			if(cy.getElementById(vgraph.nodes[i].id).length == 0) {
				cy.add({
					group: "nodes",
					data: vgraph.nodes[i],
					//position: { x: ($(window).width() / 2), y: ($(window).height() / 2) }
				})
			};
		}
		for(var i=0; i<vgraph.edges.length; i++){
			if(cy.getElementById(vgraph.edges[i].id).length == 0) {
				cy.add({
					group: "edges",
					data: vgraph.edges[i]
				});
			};
		}
		visRedraw();
	}
	else if (visMode == "d3") {
		
		//////
		
		var x_index = getNodeIndex(x_id);
		var n_index = getNodeIndex(n_id);
		
		// WHEN NEW NODE DOES NOT EXIST
		if (n_index == 0) {
			var n_obj = { "id":n_id, "name":n_name, "type":n_type };
			var vrelation = { "source":nodes[x_index], "target":n_obj, "type":rel_type };
			nodes.push(n_obj);
			links.push(vrelation);
		} else {
			var vrelation = { "source":nodes[x_index], "target":nodes[n_index], "type":rel_type };
			links.push(vrelation);
		}
		
	}
}

function visRedraw() {
	
	// LAYOUT
	var layouts = {};
	layouts['grid'] = {
	    name: 'grid',

	    fit: true, // whether to fit the viewport to the graph
	    padding: 30, // padding used on fit
	    rows: undefined, // force num of rows in the grid
	    columns: undefined, // force num of cols in the grid
	    position: function( node ){}, // returns { row, col } for element
	    ready: undefined, // callback on layoutready
	    stop: undefined // callback on layoutstop
	};
	layouts['circle'] = {
	    name: 'circle',

	    fit: true, // whether to fit the viewport to the graph
	    ready: undefined, // callback on layoutready
	    stop: undefined, // callback on layoutstop
	    rStepSize: 10, // the step size for increasing the radius if the nodes don't fit on screen
	    padding: 30, // the padding on fit
	    startAngle: 3/2 * Math.PI, // the position of the first node
	    counterclockwise: false // whether the layout should go counterclockwise (true) or clockwise (false)
	};
	layouts['breadthfirst'] = {
	    name: 'breadthfirst',

	    fit: true, // whether to fit the viewport to the graph
	    ready: undefined, // callback on layoutready
	    stop: undefined, // callback on layoutstop
	    directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
	    padding: 30, // padding on fit
	    circle: false, // put depths in concentric circles if true, put depths top down if false
	    roots: undefined, // the roots of the trees
	    maximalAdjustments: 0 // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
	};
	layouts['arbor'] = {
	    name: 'arbor',

	    liveUpdate: true, // whether to show the layout as it's running
	    ready: undefined, // callback on layoutready 
	    stop: undefined, // callback on layoutstop
	    maxSimulationTime: 4000, // max length in ms to run the layout
	    fit: true, // reset viewport to fit default simulationBounds
	    padding: [ 50, 50, 50, 50 ], // top, right, bottom, left
	    simulationBounds: undefined, // [x1, y1, x2, y2]; [0, 0, width, height] by default
	    ungrabifyWhileSimulating: true, // so you can't drag nodes during layout

	    // forces used by arbor (use arbor default on undefined)
	    repulsion: 300,
	    stiffness: undefined,
	    friction: undefined,
	    gravity: true,
	    fps: undefined,
	    precision: undefined,

	    // static numbers or functions that dynamically return what these
	    // values should be for each element
	    nodeMass: undefined, 
	    edgeLength: undefined,

	    stepSize: 1, // size of timestep in simulation

	    // function that returns true if the system is stable to indicate
	    // that the layout can be stopped
	    stableEnergy: function( energy ){
	      var e = energy; 
	      return (e.max <= 0.5) || (e.mean <= 0.3);
	    }
	};
	layouts['cose'] = {
		    name: 'cose',
		    // Called on `layoutready`
		    ready               : function() {},
		    // Called on `layoutstop`
		    stop                : function() {},
		    // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
		    refresh             : 0,
		    // Whether to fit the network view after when done
		    fit                 : true, 
		    // Padding on fit
		    padding             : 30, 
		    // Whether to randomize node positions on the beginning
		    randomize           : true,
		    // Whether to use the JS console to print debug messages
		    debug               : false,
		    // Node repulsion (non overlapping) multiplier
		    nodeRepulsion       : 10000,
		    // Node repulsion (overlapping) multiplier
		    nodeOverlap         : 10,
		    // Ideal edge (non nested) length
		    idealEdgeLength     : 10,
		    // Divisor to compute edge forces
		    edgeElasticity      : 100,
		    // Nesting factor (multiplier) to compute ideal edge length for nested edges
		    nestingFactor       : 5, 
		    // Gravity force (constant)
		    gravity             : 250, 
		    // Maximum number of iterations to perform
		    numIter             : 100,
		    // Initial temperature (maximum node displacement)
		    initialTemp         : 200,
		    // Cooling factor (how the temperature is reduced between consecutive iterations
		    coolingFactor       : 0.95, 
		    // Lower temperature threshold (below this point the layout will end)
		    minTemp             : 1
		};
	
	// LAYOUT
	cy.layout( layouts[$('select#titlebar_layout option:selected').val()] );
	
    // COLOUR
	var color = d3.scale.category10();
	for (var i in labels) {
		cy.filter("node[type='" + labels[i] + "']").css({
			'background-color': color(labels[i])
		});
	}
}














