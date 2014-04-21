var visMode = "cy";

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

function visAddGraph(vgraph){
	if(visMode=="cy"){
		for(var i=0; i<vgraph.nodes.length; i++){
			if(cy.getElementById(vgraph.nodes[i].id).length == 0) {
				cy.add({
					group: "nodes",
					data: vgraph.nodes[i],
					position: { x: ($(window).width() / 2), y: ($(window).height() / 2) }
				})
			};
		}
		for(var i=0; i<vgraph.edges.length; i++){
			var xx = cy.getElementById(vgraph.edges[i].id);
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
	var options = {
		    name: 'arbor',

		    liveUpdate: true, // whether to show the layout as it's running
		    ready: undefined, // callback on layoutready 
		    stop: undefined, // callback on layoutstop
		    maxSimulationTime: 1000, // max length in ms to run the layout
		    fit: true, // reset viewport to fit default simulationBounds
		    padding: [ 50, 50, 50, 50 ], // top, right, bottom, left
		    simulationBounds: undefined, // [x1, y1, x2, y2]; [0, 0, width, height] by default
		    ungrabifyWhileSimulating: true, // so you can't drag nodes during layout

		    // forces used by arbor (use arbor default on undefined)
		    repulsion: undefined,
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
		      return (e.max <= 0.3) || (e.mean <= 0.2);
		    }
		};
	cy.layout( options );
	
    // COLOUR
	cy.filter("node[type = 'http://www.biopax.org/release/biopax-level3.owl#Protein']").css({
		'background-color': 'blue'
	});
	cy.filter("node[type = 'http://www.biopax.org/release/biopax-level3.owl#SmallMolecule']").css({
		'background-color': 'green'
	});
}














