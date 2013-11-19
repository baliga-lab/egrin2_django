function drawBasepair(bp_local, int){
	
	
	
	var basepair = svg.selectAll(".basepair" + int)
	    //.data(data)//, function(d) { return d.col + ':' + d.row; }
	    .data(bp_local)//["Basepair"]
	  .enter().append("svg:text")
	    .attr("id", "basepair" +int )
	    .attr("clip-path", "url(#clip)")
	    .attr("x", function(d) { return x(d.start); })
	    .attr("y", function(d) {if(int===0) return 160; else return 360 })
	    .attr("class", function(e) { return "letter-" + e.sequence; } )
	    .attr("transform", "translate(40, 0)")
	    
	    //.attr("textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
	    .attr("lengthAdjust", "spacingAndGlyphs" )
	    .attr( "font-size", function(e) { return 10 * capHeightAdjust; } )
	    .style( "font-size", function(e) { return 10 * capHeightAdjust; } )    
		.text(function(d){ return d.sequence;});
		
	
	    
}

function redrawBasepair(bp_local, int){
//	if (	(view.right - view.left) <= 310  ) {
	
	svg.selectAll("#basepair"+int).remove();
		console.log("inside < 310");
	var basepair_ = svg.selectAll("#basepair"+int).data(bp_local.filter(function(d) {return (d.start <= view.right && d.start >= view.left);}));

	    basepair_.enter().append("svg:text");
	    //basepair_.exit().remove();
	    
	    
	    basepair_
	  .enter().append("svg:text")
	    .attr("id", "basepair" + int)
	    .attr("clip-path", "url(#clip)")
	    .attr("x", function(d) { return x(d.start); })
	    .attr("y", function(d) {if(int===0) return 160; else return 360 })
	    .attr("class", function(e) { return "letter-" + e.sequence; } )
	    .attr("transform", "translate(40, 0)")
	    
	    //.attr("textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
	    .attr("lengthAdjust", "spacingAndGlyphs" )
	    .attr( "font-size", function(e) { return 10 * capHeightAdjust; } )
	    .style( "font-size", function(e) { return 10 * capHeightAdjust; } )    
		.text(function(d){ return d.sequence;});
		
		
		


}