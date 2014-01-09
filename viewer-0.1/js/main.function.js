
// DB
var server_url = 'http://localhost:7474';

// SEARCH
function searchConcept(namespace){
	printLog('searchConcept');
	var vKeyword = $('#searchByConcept').val();
	// CYPHER QUERY
	v_data = {
		"query" : 
			"START x=node:`users`('name:" + vKeyword + "') " +
			"RETURN x.name, x.type, x.rowid " +
			"ORDER BY x.type " +
			"LIMIT 100",
	    "params" : {}
	};
	printLog(v_data["query"]);
	// POST
	$.ajax({
		type: 'POST',
		url: server_url + '/db/data/cypher',
		data: v_data,
		dataType: 'json',
		success: function(result){
   			printLog('searchConcept AJAX succeeded');
   			
   			var pre_namespace = '', pre_type = '';
   			for(var i=0; i<result.data.length; i++) {
   				
   				var name = result.data[i][0];
   				var type = result.data[i][1];
   				var id  = result.data[i][2];
   				// GROUPING REF AND TYPE
   				if (pre_type != type) {
   					printRes('<B>[' + type + ']</B><br/>');
   				}
   				pre_type = type;
   				// NAME AND NAMESPACE
   				printRes('<a name="' + name + '" id="' + id + '">Add</a> ' + name + '<br/>');
   			}
   			// Add event for the results
   			$('div#result_c a').click(function(){
   				addConcept($(this).attr('id'));
   			});
   			printLog('searchConcept AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}
function addConcept(id){
	printLog('addConcept: ' + id);
	
	// CYPHER QUERY
	v_data = {
		"query" : 
			"START x=node(" + id + ") " +
			"RETURN x.name, x.type, x.rowid " +
			"LIMIT 1",
	    "params" : {}
	};
	printLog(v_data["query"]);
	// POST
	$.ajax({
		type: 'POST',
		url: server_url + '/db/data/cypher',
		data: v_data,
		dataType: 'json',
		success: function(result){
			printLog('addConcept AJAX succeeded');
			
			var name = result.data[0][0];
			var type = result.data[0][1];
			
			var vnode = { "id" : id, "name" : name, "type" : type };
			nodes.push(vnode);
			start();
   			printLog('addConcept AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}
function getPropertyNei(target, target_type){
	printLog('getPropertyNei');
	clearProNei();
	if (target_type == 'node') {
		// CYPHER QUERY
		v_data = {
			"query" : 
				"START x=node(" + target.id + ") " +
				"MATCH x-[r]-n " +
				"RETURN n.type, count(*), type(r) " +
				"LIMIT 100",
		    "params" : {}
		};
		printLog(v_data["query"]);
		// POST
		$.ajax({
			type: 'POST',
			url: server_url + '/db/data/cypher',
			data: v_data,
			dataType: 'json',
			success: function(result){
				printLog('addConcept AJAX succeeded');
				
				printProNei('<H2>Neighbours</H2><BR>');
				for(var i=0; i<result.data.length; i++) {
					
					var type = result.data[i][0];
					var count = result.data[i][1];
					var rel_type = result.data[i][2];
					
					printProNei('<a id="' + target.id + '" type="' + type + '" rel_type="' + rel_type + '">Add</a> ' + type + ' : ' + rel_type + ' (' + count + ')' );
				}
				// Add event for the results
	   			$('div#propertyNei a').click(function(){
	   				addNeighbours($(this).attr('id'), $(this).attr('rel_type'), $(this).attr('type'));
	   			});
				printLog('getPropertyNei AJAX finished');
				
	   		},
	   		error: function(XMLHttpRequest, textStatus, errorThrown) {
	   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
	   		}
		});
	} else{
	}
}
function getProperty(target, target_type){
	printLog('getProperty');
	clearPro();
	if (target_type == 'node') {
		
		printPro('<H2>Node</H2><BR>');
		printPro('<B>ID:</B> ' + target.id);
		printPro('<B>Name:</B> ' + target.name);
		printPro('<B>Type:</B> ' + target.type);
	
		// CYPHER QUERY
		v_data = {
			"query" : 
				"START x=node(" + target.id + ") " +
				"RETURN x",
		    "params" : {}
		};
		printLog(v_data["query"]);
		// POST
		$.ajax({
			type: 'POST',
			url: server_url + '/db/data/cypher',
			data: v_data,
			dataType: 'json',
			success: function(result){
				printLog('getProperty AJAX success');
				
				for(var i=0; i<result.data.length; i++) {
					var properties = result.data[0][0].data;
					printPro('<B>Properties:</B>');
					for (property in properties) {
						if (property != 'name' && property != 'type' && property != 'rowid') {
							printPro('- ' + property + ' : ' + properties[property]);
						}
					}
					printPro('<BR>');
				}
				printLog('getProperty AJAX finished');
			}
		});
	 } else if (event.group == 'edges') {
		 printPro( '<H2>Edge (' + target.data['type'] + ')</H2><BR>');
		 printPro( '<B>Source:</B> ' + target.data['source'] );
		 printPro( '<B>Target:</B> ' + target.data['target'] );
		 printPro( '<B>Type:</B> ' + target.data['type'] );
		 printPro( '<B>Ref:</B> ' + target.data['ref'] );
	 } else {
		 //$('#floatWindow').fadeOut('fast');
		 printPro('<H2>Graph</H2><BR>');
		 printPro('<B>Node:</B> ' + network.data.nodes.length );
		 printPro('<B>Edge:</B> ' + network.data.edges.length );
		 addCommonNeighbours(vis.selected('nodes'));
	 }
}
function addNeighbours(id, rel_type, type){
	printLog('addNeighbours');
	
	// CYPHER QUERY
	v_data = {
		"query" : 
			"START x=node(" + id + ") " +
			"MATCH x-[r:`" + rel_type + "`]-n " +
            "WHERE n.type='" + type + "' " +
			"RETURN x.rowid, n.rowid, n.name, n.type, type(r) " +
			"LIMIT 1000",
	    "params" : {}
	};
	
	printLog(v_data["query"]);
	
	// POST
	$.ajax({
		type: 'POST', url: server_url + '/db/data/cypher', data: v_data, dataType: 'json',
		success: function(result){
			printLog('addNeighbours AJAX succeeded');
			
			var new_nodes = result.data;
			//var graph1 = {nodes:[], relations:[]};
			
			var num_edge_added = 0;
			if(new_nodes.length > 1000){
				alert('More than 1000 neighbours found. The operation has been canceled.');
				return;
			}
			else {
				for(var i=0; i<new_nodes.length; i++){
					var x_id = new_nodes[i][0];
					var n_id = new_nodes[i][1];
					var n_name = new_nodes[i][2];
					var n_type = new_nodes[i][3];
					var rel_type = new_nodes[i][4];
					
					var x_index = getNodeIndex(x_id);
					var n_index = getNodeIndex(n_id);
					
					// WHEN NEW NODE DOES NOT EXIST
					if (n_index == 0) {
						var n_obj = { "id":n_id, "name":n_name, "type":n_type };
						var vrelation = { "source":nodes[x_index], "target":n_obj, "type":rel_type };
						nodes.push(n_obj);
						links.push(vrelation);
						//start();
					} else {
						var vrelation = { "source":nodes[x_index], "target":nodes[n_index], "type":rel_type };
						links.push(vrelation);
					}
					num_edge_added = num_edge_added + 1;
				}
			}
			if(num_edge_added == 0){
				alert('No new neighbour is found.');
				return;
			}
			start();
			printLog('addNeighbours AJAX finished');
			
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}

//TAB PANEL
function showPanel(selector){
	$('ul.tab li a').removeClass('selected');
	$(selector).addClass('selected');
	$('ul.panel li').slideUp('fast');
	$($(selector).attr('name')).slideDown('fast');
	return false;
}
function printLog(msg) {
	myDate = new Date();
	$('#log').prepend('<p>' 
			      + fixDigit(myDate.getHours(), 2) 
			+ ':' + fixDigit(myDate.getMinutes(), 2) 
			+ '.' + fixDigit(myDate.getSeconds(), 2) 
			+ '.' + fixDigit(myDate.getMilliseconds(), 3)
			+ ' ' + msg + '</p>');
}
function clearLog() {
	$('#log').html('');
}

//PRINT
function printRes(msg) {
	$('div#result_c').append(msg);
	return false;
}
function clearRes() {
	$('div#result_c').html('');
	return false;
}
function printPro(msg) {
	$('#property').append('<p>' + msg + '</p>');
	return false;
}
function clearPro() {
	$('#property').html('');
	return false;
}
function printProNei(msg) {
	$('#propertyNei').append('<p>' + msg + '</p>');
	return false;
}
function clearProNei() {
	$('#propertyNei').html('');
	return false;
}
function printLog(msg) {
	myDate = new Date();
	$('#log').prepend('<p>' 
			      + fixDigit(myDate.getHours(), 2) 
			+ ':' + fixDigit(myDate.getMinutes(), 2) 
			+ '.' + fixDigit(myDate.getSeconds(), 2) 
			+ '.' + fixDigit(myDate.getMilliseconds(), 3)
			+ ' ' + msg + '</p>');
}
function fixDigit(num, digit) {
	var str = String(num);
	while (str.length < digit) {
		str = '0'+str;
	}
	return str;
}
function clearLog() {
	$('#log').html('');
}


function getNodeIndex(id) {
	var index = 0; // Dammy
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].id == id) {
			index = i;
		}
	}
	return index;
}
function getNamespace(uri) {
	return uri.match(/^(.*[\/|#])[^\/|#]+$/)[1];
}
function getName(uri) {
	return uri.match(/[\/|#]([^\/|#]+)$/)[1];
}
