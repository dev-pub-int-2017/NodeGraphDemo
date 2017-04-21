var graph;
var svg = d3.select("svg");

var link = svg.selectAll(".link");
var node = svg.selectAll(".node");
var link_label = svg.selectAll(".link_label");
var node_label = svg.selectAll(".node_label");

function loadGraph() {
	// use Ajax to pull in our graph data

	$.ajax({
		url : "/assets/data/yesterday.json", 
		dataType : "text",
		success : function(data) {
			graph = $.parseJSON(data);
			
			generateNodeColors();
			drawGraph();
			populateSelections();
			showRawGraph();
		}
	});
}

function generateNodeColors() {
	// assigns a random color to each node in our graph
	var hex = "0123456789ABCDEF";

	_.each(graph.nodes, function(node) {
		// don't overwrite color if there already is one!
		if(node.color) {
			return;
		}

		node.color = "#";

		_.times(6, function() {
			this.color += hex.split("")[_.random(0, (hex.length - 1))];
		}, node);
	});
}

function ticked() {
	link.attr("x1", function(d) { return d.source.x; })
    	.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });

	node_label.attr("dx", function(d) { return d.x })
		.attr("dy", function(d) { return d.y });

	link_label.attr("dx", function(d) { return d.source.x })
		.attr("dy", function(d) { return d.source.y });
}

function findMidpoint(x,y) {

}

function drawGraph() {
	var width = 694.02;
	var height = 324;
	var radius = 10;

	var simulation = d3.forceSimulation()
    	.force("charge", d3.forceManyBody().strength(-200))
    	.force("link", d3.forceLink().id(function(d) { console.info(d); return d.id; }).distance(60))
    	.force("x", d3.forceX(width / 2))
    	.force("y", d3.forceY(height / 2))
    	.on("tick", ticked);

    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);

	link = link
		.data(graph.links)
		.enter()
		.append("line")
		.attr("class", "link");

	node = node
		.data(graph.nodes)
		.enter()
		.append("circle")
		.attr("class", "node")
		.attr("r", radius)
		.style("fill", function(n) {
			return n.color;
		});

	node_label = node_label
		.data(graph.nodes)
		.enter()
		.append("text")
		.attr("class", "node_label")
		.text(function(n) {
			return n.name;
		});

	link_label = link_label
		.data(graph.links)
		.enter()
		.append("text")
		.attr("class", "link_label")
		.text(function(l) {
			return _.findWhere(graph.verbs, { id : l.verb }).action + " ->";
		});
}

function populateSelections() {
	_.each(graph.nodes, function(node) {		
		
		_.each($("select.node_selector"), function(select) {
			var option = $("<option></option>")
				.text(this.name)
				.prop({ value : this.id });

			$(option).prependTo($(select));
		}, node);
	
	});

	_.each(graph.verbs, function(verb) {
		var option = $("<option></option>")
			.text(verb.action)
			.prop({ value : verb.id });
			
			$(option).prependTo($("#edge"));
	});
}

function showRawGraph() {
	var sanitized_graph = _.clone(graph);
	$("#social_graph_raw").html(JSON.stringify(sanitized_graph));
}

function mapInteraction() {
	graph.links.push({

	});
}

$(document).ready(function() {
	loadGraph();
});