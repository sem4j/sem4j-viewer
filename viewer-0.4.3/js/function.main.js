
function listNodeIndexes(){
	printLog('listNodeIndexes');
	$.ajax({
		type: 'GET',
		url: server_url + '/db/data/index/node/',
		dataType: 'json',
		success: function(result){
   			printLog('listNodeIndexes AJAX succeeded');
   			printLog(JSON.stringify(result));
   			printLog(result.length);
   			for(var index_name in result){
   				printLog(index_name);
   				$('#selectNamespace').append('<option value="' + index_name + '">' + index_name +'</option>');
   			}
   			printLog('searchConcept AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}

function listAllLabels(callback){
	printLog('listAllLabels');
	$.ajax({
		type: 'GET',
		url: server_url + '/db/data/labels/',
		dataType: 'json',
		success: function(result){
   			printLog('listAllLabels AJAX succeeded');
   			//printLog(JSON.stringify(result));
   			//printLog(result.length);
   			result.sort();
   			for(var i in result){
   				printLog(result[i]);
   				labels.push(result[i]);
   				$('#selectLabel').append('<option value="' + result[i] + '">' + result[i] +'</option>');
   			}
   			printLog('listAllLabels AJAX finished');
   			callback();
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}

// DELETE IN THE NEXT VERSION
function listIndexesOld(label){
	printLog('listIndexes for label ' + label);
	$.ajax({
		type: 'GET',
		url: server_url + '/db/data/schema/index/' + label + '/',
		dataType: 'json',
		success: function(result){
   			printLog('listIndexes AJAX succeeded');
   			printLog(JSON.stringify(result));
   			//printLog(result.length);
   			for(var i in result){
   				var property = result[i]['property_keys'][0];
   				printLog(property);
   				$('#selectProperty').append('<option value="' + property + '">' + property +'</option>');
   			}
   			printLog('listIndexes AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}

function listIndexes(label){
	printLog('listIndexes for label ' + label);
	v_data = { "label" : label };
	$.ajax({
		type: 'POST',
		url: server_url + '/db/data/schema/index',
		data: v_data,
		dataType: 'json',
		success: function(result){
   			printLog('listIndexes AJAX succeeded');
   			//printLog(JSON.stringify(result));
   			//printLog(result.length);
   			for(var i in result){
   				var property = result[i]['property_keys'][0];
   				//printLog(property);
   				$('#selectProperty').append('<option value="' + property + '">' + property +'</option>');
   			}
   			printLog('listIndexes AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}

// SEARCH
function searchConcept(namespace){
	printLog('searchConcept');
	var label = $('#selectLabel').val();
	var property = $('#selectProperty').val();
	var vKeyword = $('#searchByConcept').val();
	// CYPHER QUERY
	v_data = {
		"query" : 
			"MATCH (n:`" + label + "` {" + property + ":'" + vKeyword + "'}) " +
			"RETURN n.name, id(n) " +
			//"ORDER BY n.type " +
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
   				//var type = result.data[i][1];
   				var id  = result.data[i][1];
   				// GROUPING REF AND TYPE
   				//if (pre_type != type) {
   				//	printRes('<B>[' + type + ']</B><br/>');
   				//}
   				//pre_type = type;
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
function runCypher(){
	printLog('runCypher');
	$('textarea#resultCypher').html('');
	var textCypher = $('#textareaCypher').val();
	// CYPHER QUERY
	v_data = {
		"query" : textCypher,
	    "params" : {}
	};
	printLog('AJAX query posted');
	// POST
	$.ajax({
		type: 'POST',
		url: server_url + '/db/data/cypher',
		data: v_data,
		dataType: 'json',
		success: function(result){
			printLog('AJAX result retuened');
			$('textarea#resultCypher').append(JSON.stringify(result, null, "  "));
			addNetwork(result);
			$('#floatWindowCypher').fadeOut('fast');
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
			"RETURN x " +
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
			addNetwork(result);
			/*
			var name = result.data[0][0];
			var type = result.data[0][1];
			var vnode = { "id" : id, "name" : name, "type" : type };
			var vgraph = {nodes:[], edges:[]};
			vgraph.nodes.push(vnode);
			visAddGraph(vgraph);
			*/
			$('#floatWindowSearch').fadeOut('fast');
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
            "RETURN r, n " +
			//"RETURN id(x), id(n), n.name, n.type, type(r), id(r) " +
			"LIMIT 1000",
	    "params" : {}
	};
	
	printLog(v_data["query"]);
	
	// POST
	$.ajax({
		type: 'POST', url: server_url + '/db/data/cypher', data: v_data, dataType: 'json',
		success: function(result){
			printLog('addNeighbours AJAX succeeded');
			addNetwork(result);
			
			/*
			var rows = result.data;
			if(rows.length > 1000){
				alert('More than 1000 neighbours found. The operation has been canceled.');
				return;
			}
			else {
				var vgraph = {nodes:[], edges:[]};
				for(var i=0; i<rows.length; i++){
					var x_id = rows[i][0].toString();
					var n_id = rows[i][1].toString();
					var n_name = rows[i][2];
					var n_type = rows[i][3];
					var rel_type = rows[i][4];
					var r_id = rows[i][5].toString();
					
					var vnode = { "id":n_id, "name":n_name, "type":n_type };
					var vedge = { "id":r_id, "source":x_id, "target":n_id, "type":rel_type };
					
					vgraph.nodes.push(vnode);
					vgraph.edges.push(vedge);
					
					num_edge_added = num_edge_added + 1;
				}
				visAddGraph(vgraph);
			}
			if(num_edge_added == 0){
				alert('No new neighbour is found.');
				return;
			}
			*/
			$('#floatWindowProperty').fadeOut('fast');
			printLog('addNeighbours AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}
function addAllNeighbours(id, target_type){
	printLog('addAllNeighbours');
	
	// CYPHER QUERY
	v_data = {
		"query" : 
			"START x=node(" + id + ") " +
			"MATCH x-[r]-n " +
            "RETURN r, n " +
			"LIMIT 1000",
	    "params" : {}
	};
	printLog(v_data["query"]);
	
	// POST
	$.ajax({
		type: 'POST', url: server_url + '/db/data/cypher', data: v_data, dataType: 'json',
		success: function(result){
			printLog('addNeighbours AJAX succeeded');
			addNetwork(result);
			/*
			var rows = result.data;
			if(rows.length > 1000){
				alert('More than 1000 neighbours found. The operation has been canceled.');
				return;
			}
			else {
				var num_edge_added = 0;
				var vgraph = {nodes:[], edges:[]};
				for(var i=0; i<rows.length; i++){
					var x_id = rows[i][0].toString();
					var n_id = rows[i][1].toString();
					var n_name = rows[i][2];
					var n_type = rows[i][3];
					var rel_type = rows[i][4];
					var r_id = rows[i][5].toString();
					
					var vnode = { "id":n_id, "name":n_name, "type":n_type };
					var vedge = { "id":r_id, "source":x_id, "target":n_id, "type":rel_type };
					
					vgraph.nodes.push(vnode);
					vgraph.edges.push(vedge);
					
					num_edge_added = num_edge_added + 1;
				}
				visAddGraph(vgraph);
			}
			if(num_edge_added == 0){
				alert('No new neighbour is found.');
				return;
			}
			*/
			$('#floatWindowProperty').fadeOut('fast');
			printLog('addAllNeighbours AJAX finished');
   		},
   		error: function(XMLHttpRequest, textStatus, errorThrown) {
   		  printLog(errorThrown + " : " + XMLHttpRequest.responseText);
   		}
	});
}
function addNetwork(result){
	var rows = result.data;
	var num_edge_added = 0;
	if (rows.length > 1000) {
		alert('More than 1000 nodes found. The operation has been canceled.');
		return;
	}
	else {
		var vgraph = {nodes:[], edges:[]};
		for(var i=0; i<rows.length; i++){
			var cols = rows[i];
			for (var j=0; j<rows[i].length; j++) {
				if (!cols[j].type) { // IF THIS IS NODE (REL HAS TYPE)
					var n = cols[j];
					var id = uri2id(n.self);
					var name = n.data.name;
					var type = n.data.type;
					var vnode = { "id":id, "name":name, "type":type };
					vgraph.nodes.push(vnode);
				}
			}
			for (var j=0; j<rows[i].length; j++) {
				if (cols[j].type) {
					var r = cols[j];
					var vedge = { "id":uri2id(r.self), "source":uri2id(r.start), "target":uri2id(r.end), "type":r.type };
					vgraph.edges.push(vedge);
				}
			}
		}
		visAddGraph(vgraph);
	}
}
function uri2id (uri) {
	array = uri.split('/');
	return array[array.length-1];
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
	$('div#floatWindowLog dl dd').prepend('<p>' 
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
	$('div#floatWindowLog dl dd').html('');
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
