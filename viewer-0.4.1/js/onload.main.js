

// CY
$(function(){ // on dom ready

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
		    
		    
		    
		    // DRAW
		    visRedraw();
		    
		    // QUICK DEMO
		    setTimeout(function() {
		    	runCypher();
			    visAddGraph(vgraph);
		    }, 500);
	  	}
	});
});


// COMMON
$(function() {
	
	// LIST ALL LABELS
	listAllLabels();
	
	$('select#selectLabel').change(function(){
		listIndexes($(this).val());
	});
	
	// Submit Concept
	$('input#submitConcept').click(function(){
		clearRes();
		searchConcept($('#selectNamespace option:selected').val());
	});
	$('input#submitCypher').click(function(){
		runCypher();
	});
	
	// Window Height
	$('#container').height(($(window).height() - 30));
	$(window).resize(function() {
		$('#container').height(($(window).height() - 30));
	});
	
	// Tab Panel
	$('ul.panel li:not(' + $('ul.tab li a.selected').attr('name') + ')').hide();
	$('ul.tab li a').click(function(){
		showPanel(this);
		// When Tab4 is selected
		if($('ul.tab li a.selected').attr('name') == '#tab4'){
			setTypeConcept();
			setTypeRelation();
		}
	});
	
	// Float Window Open
	$('#titlebar_search').click(function(){
		$('#floatWindowSearch').fadeIn('fast');
		return false;
	});
	$('#titlebar_cypher').click(function(){
		$('#floatWindowCypher').fadeIn('fast');
		return false;
	});
	$('#titlebar_log').click(function(){
		$('#floatWindowLog').fadeIn('fast');
		return false;
	});
	// FLOAT WINDOW CLOSE
	$('div.floatWindow a.close').click(function(e){
		$(this).parent('div').fadeOut('fast');
		return false;
	});
	// FLOAT WINDOW MOVE
	$('div.floatWindow dl dt').mousedown(function(e){
		var div_floatWindow = $(this).parents('div');
		div_floatWindow
			.data('clickPointX' , e.pageX - div_floatWindow.offset().left)
			.data('clickPointY' , e.pageY - div_floatWindow.offset().top);
		$(document).mousemove(function(e){
			div_floatWindow.css({
				top:e.pageY  - div_floatWindow.data('clickPointY')+'px',
				left:e.pageX - div_floatWindow.data('clickPointX')+'px'
			});
		});
		return false;
	})
	.mouseup(function(){
		$(document).unbind('mousemove');
		return false;
	});
});