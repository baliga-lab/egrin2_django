	var gridSize = 30,
	    h = gridSize - 10,
	    w = gridSize,
	    rectPadding = 60;

	var colorLow = 'red', colorMed = 'black', colorHigh = 'green';

	var colorScale = d3.scale.linear()
	     .domain([-1, 0, 1])
	     .range([colorLow, colorMed, colorHigh]);

     	var colorScaleHeatmapMotif = d3.scale.linear()
     	     .domain([0, 40]);
	     
	var colorScaleMotifSegment = d3.scale.linear();

     	     

function drawHeatmap(){

	var heatMap = svg.selectAll(".heatmap")
	    //.data(data)//, function(d) { return d.col + ':' + d.row; }
	    .data(a["Heatmap"])
	   //.data(exp_expression1)
	   
	  .enter().append("svg:rect")
	    
	    .attr("id", "heatmap")
	    .attr("clip-path", "url(#clip)")	
	    .attr("x", function(d) {debugger; return x(d.start); })
	    .attr("y", function(d) { 
		    if(d.strand == '+') return d.yPosition * h+180; else return d.yPosition * h + 300;
		     })
	    .attr("width", function(d) { return x(d.end - d.start) + view.left; })
	    .attr("height", function(d) { return h; })
	    .attr("transform", "translate(40, 0)")
	    .style("fill", function(d) { return colorScale(d.values); })
	    .style("stroke", "white")
	    .style("stroke-width", 0.8)
	    .style("stroke-opacity", 0.3)
		.append("svg:title")
	.text(function(d){ return ("strand: " +  d.strand + ", " + d.start+":"+d.end + ", [value: "  + d.values + "]")});
	    
}


function drawHeatmapMotif(name, mot_data, yPos){
	//console.log(mot_data +  '  :   ' + yPos);

	colorScaleHeatmapMotif.range([color(name), 'red']);
	//colorScaleHeatmapMotif.range(['green', 'red']);
	
	var heatMap = svg.selectAll("#heatmap_")
	    //.data(data)//, function(d) { return d.col + ':' + d.row; }
	    .data(mot_data)//max_MOT_16[0].values
	  .enter().append("svg:rect")
	    .attr("class",  "heatmap_mot")
	    .attr("id", "heatmap_" + yPos)
	    .attr("x", function(d) { return x(d.START); })
	    .attr("y", 450+yPos)
	    .attr("width", function(d) { return x(d.END - d.START) + view.left; })
	    .attr("height", function(d) { return h; })
	    .style("fill", function(d) { return colorScaleHeatmapMotif(d.MAX); });
	    //.style("stroke", "white")
	    //.style("stroke-width", 0.8)
	    //.style("stroke-opacity", 0.3)
		//.append("svg:title")
//	.text(function(d){ return ("strand: " +  d.strand + ", " + d.start+":"+d.end + ", [value: "  + d.values + "]")});
	    
}

function drawOverlapMotif(name, overlapData_data, yPos, size){
	
	//console.log("inside overlapMotif");
	//debugger;
	//colorScaleHeatmapMotif.range([color(name), 'red']);

	 colorScaleMotifSegment.domain([0, d3.max(overlapData_data.map(function(d) { return d.max; } ) ) ]).range([0, 1]);//.range(['#F0FFFF',color(name)]);	     
	//colorScaleHeatmapMotif.range(['green', 'red']);
	var heatMap = context_segment.selectAll("#overlap").append("g")
	    //.data(data)//, function(d) { return d.col + ':' + d.row; }

	    .data(overlapData_data.filter(function(d) {  return (d.size >= size  && d.start <= view.right && d.end >= view.left); } ))//max_MOT_16[0].values
	
	.enter().append("svg:rect")
      	.attr('fill', function(d) { 
		return color(name);
      		//return colorScaleMotifSegment(d.max);
		//if(d.strand =='+') return '#eef000'; else return '#ddbb00';
      	}).style("fill-opacity", function(d) {return colorScaleMotifSegment(d.max)} )
	    .attr("id", "overlap_" )//+ yPos
	    .attr("clip-path", "url(#clip2)")
	    .attr("x", function(d) {   return x2(d.start); })
        	.attr('y', function(d){ 
        		//return 480 + (yPos)
			//console.log("y --> " + (y2( (100/mot_names.length)/100) + yPos + 430));
			return y2( (100/mot_names.length)/100) + yPos ;
			//if(d.strand=='+') return 450+yPos; else return 450-yPos;
        	})
	    
	    .attr("width", function(d) { return x2(   (d.end - d.start) + left); })
	    .attr("height",  100/mot_names.length )//y2( (100/mot_names.length)/100));
	    
	    
	    .append("svg:title")	
	    	.text(function(d){ return ("Segment size: " + d.size)});
		
		svg.select(".x.brush").call(brush);
	    	
	    //.style("fill", function(d) { return colorScaleHeatmapMotif(d.MAX); });
	    //.style("stroke", "black")
	    //.style("stroke-width", 0.8)
	    //.style("stroke-opacity", 0.3)
	    
		//.append("svg:title")
//	.text(function(d){ return ("strand: " +  d.strand + ", " + d.start+":"+d.end + ", [value: "  + d.values + "]")});
	    
}


function drawOverlapGenes(name, overlapData_data, yPos){
	// colorScaleMotifSegment.domain([0, d3.max(overlapData_data.map(function(d) { return d.max; } ) ) ]).range([0, 1]);//.range(['#F0FFFF',color(name)]);	     
	//colorScaleHeatmapMotif.range(['green', 'red']);
	
	var heatMap = context.selectAll("#overlapGene")
	    //.data(data)//, function(d) { return d.col + ':' + d.row; }
	    .data(overlapData_data)//max_MOT_16[0].values
	  .enter().append("svg:rect")
      	.attr('fill', function(d) { 
		return color(name);
      		//return colorScaleMotifSegment(d.max);
		//if(d.strand =='+') return '#eef000'; else return '#ddbb00';
      	}).style("fill-opacity", 0.6 )
	    .attr("id", "overlapGene_")// + yPos
	    .attr("clip-path", "url(#clip2)")
	    .attr("x", function(d) {   return x2(d.start); })
        	.attr('y', function(d){ 
        		//return 480 + (yPos)
			return y2( (100/mot_names.length)/100) + yPos ; //+ 430
			//if(d.strand=='+') return 450+yPos; else return 450-yPos;
        	})
	    
	    .attr("width", function(d) { return x2(   (d.end - d.start) + left); })
	    .attr("height",  100/mot_names.length )//y2( (100/mot_names.length)/100));
	    //.style("fill", function(d) { return colorScaleHeatmapMotif(d.MAX); });
	    //.style("stroke", "black")
	    //.style("stroke-width", 0.8)
	    //.style("stroke-opacity", 0.3)
	    
		//.append("svg:title")
//	.text(function(d){ return ("strand: " +  d.strand + ", " + d.start+":"+d.end + ", [value: "  + d.values + "]")});
	    
}



function redrawHeatmapMotif(name, mot_data, yPos){
	//console.log(mot_data +  '  :   ' + yPos);
	
	colorScaleHeatmapMotif.range([color(name), 'red']);
	//colorScaleHeatmapMotif.range(['green', 'red']);

	
	svg.selectAll('.heatmap_mot').remove();
	
	var heatMapMotif_ = svg.selectAll("#heatmap_" + yPos).data(mot_data);
	    //.data(data)//, function(d) { return d.col + ':' + d.row; }
	   //max_MOT_16[0].values
	   heatMapMotif_.enter().append("svg:rect");
	   //heatMapMotif_exit().remove();
	   
	   heatMapMotif_
	    .attr("id", "heatmap_" + yPos)
	    .attr("class",  "heatmap_mot")
	    .attr("x", function(d) { return x(d.START); })
	    .attr("y", 450+yPos)
	    .attr("width", function(d) { return x(d.END - d.START) + view.left; })
	    .attr("height", function(d) { return h; })
	    .style("fill", function(d) { return colorScaleHeatmapMotif(d.MAX); });
	    //.style("stroke", "white")
	    //.style("stroke-width", 0.8)
	    //.style("stroke-opacity", 0.3)
		//.append("svg:title")
//	.text(function(d){ return ("strand: " +  d.strand + ", " + d.start+":"+d.end + ", [value: "  + d.values + "]")});
	    
}



function redrawHeatmap(){
	
	if(hide_heatmap){}
else{	
	var heatMap_ = svg.selectAll("#heatmap").data(a["Heatmap"].filter(function(d) {return (d.start <= view.right && d.end >= view.left);}));
	    heatMap_.enter().append("svg:rect");
	    heatMap_.exit().remove();
	    
	    heatMap_
	    .attr("id", "heatmap")
	    .attr("clip-path", "url(#clip)")
	    .attr("x", function(d) { return x(d.start); })
	    .attr("y", function(d) { 
		    if(d.strand == '+') return d.yPosition * h+180; else return d.yPosition * h + 300;
		     })
	    .attr("width", function(d) { return x(  (d.end - d.start) + view.left); })
	    .attr("height", function(d) { return h; })
	    .attr("transform", "translate(40, 0)")
	    .style("fill", function(d) { return colorScale(d.values); })
	    .style("stroke", "white")
	    .style("stroke-width", 0.8)
	    .style("stroke-opacity", 0.3);
	heatMap_.selectAll('title').remove();
	heatMap_
	.append("svg:title")
	.text(function(d){ return ("strand: " +  d.strand + ", " + d.start+":"+d.end + ", [value: "  + d.values + "]")});
}
}