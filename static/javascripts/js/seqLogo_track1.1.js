

function redrawSeqLogo(names){
//	debugger;
		if (	(view.right - view.left) <= 310 && (window[names + "checked"] == true) ) { 
			//lll.selectAll(".line").remove();
			
		        svg.select(".motifs_"+names).selectAll(".line")
		        .style("display", "none");	
			
		//	mot_names.forEach(function(d){
		//	svg.select(".motifs_"+d).selectAll(".line").remove();
		//}
			
			
			xSeqLogo.domain(d3.range(view.left,view.right,1))
			//if(mot_max.length !== 0){
				console.log("set yDomain")
				ySeqLogo.domain([0, d3.max(mot_max)]);//eval(window["_" + names + "_max"])
				//}
			var sequence = svg.selectAll("#" + names).remove();
		eval("_"+names)
		.selectAll("#" + names)
		//.data(MOT_1["motif"].filter(function(d) {  return d.POSITION >= view.left && d.POSITION <= view.right  ;}))
		.data(function(d){  return d.values.filter(function(f) {  return f.POSITION >= view.left && f.POSITION <= view.right  ;});})
		//.data(function(d) {return (d.POSITION <= view.right && d.POSITION >= view.left) ;debugger})
		//.data(function(d){ return (d.POSITION >= view.left && d.POSITION <= view.right)		;})
		//.data(function(d){return d.bits;})
		//.data(mot["motif"])
		//.data(mot["motif"].filter(function(d) {return   (d.POSITION <= view.right && d.POSITION >=view.left)    ;}))
			.enter().append("text")
				.attr("id", names)
				.attr("y", function(e,i) {return ySeqLogo(e.INIT)+10; })
				.attr("x", function(d) { return x(d.POSITION); })
				//.attr("fill", "white")
				.text( function(e) { return e.LETTER; } )
				.attr("class", function(e) { return "letter-" + e.LETTER; } )
				.style( "text-anchor", "start" )
				.style( "font", "corrier" )
//				.style("text-size-adjust", "inherit")
				.attr( "textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
//					.attr( "textLength", 10)
				.attr( "lengthAdjust", "spacingAndGlyphs" )
				.attr( "font-size", function(e) { return ( ySeqLogo(e.INIT) - ySeqLogo(e.FINAL) ) * capHeightAdjust; } )
				.style( "font-size", function(e) { return ( ySeqLogo(e.INIT) - ySeqLogo(e.FINAL) ) * capHeightAdjust; } );

				
//				if(!d3.selectAll("#" + names)[0][0].checked == true){
					//console.log("inside if" + names);
					//sequence
					//.style("display", null);
					//svg.selectAll("#"+ names)
					//.style("display", "none");
					//}
				

    
  } else{
	  eval("_"+names)
	  .selectAll("#" + names).remove();
	  
        svg.select(".motifs_"+names).selectAll(".line")
        .style("display", null);
	  
	  
   
	 
	  
	  //var lll = svg.selectAll(".line")
	  //.data(max_[0]);
	  //debugger;
	  /*
	  //lll
	  .enter().append("svg:path")
	  //
	  //lll
          .attr("class", "line")
          .attr("d", function(d) {debugger ; return line(d.values);});
	  
	  lll.exit().remove();
	  */
	  
//	  svg.selectAll("#data1")remove();
	  //svg.append("svg:path").attr("d", line(max_[0].values.filter(function(f) {return(f.POSITION >= view.left && f.POSITION <= view.right);}))).attr("class", "data1");
	  	//.attr("x", function(d){return x(d.POSITION);})
	  	//.attr("y", function(d){return ySeqLogo(d.MAX);})
//	        .style("stroke", "10");
//console.log("inside lines-else");
	  
	  
  }
 // mot_max = [];	
}

function drawLine(){
	

	//getMotifMax(view.left, view.right, "MOT_10");
	mot_names.forEach(function(d){

	svg.select(".motifs_"+d).selectAll(".line")
	   .data(eval("max_"+d)) // set the new data
	   .attr("d", line(eval("max_"+d)[0].values.filter(function(f) {return (f.POSITION >= (view.left-10000) && f.POSITION <= (view.right+10000)   );}))); // apply the new data values
   		/*if((window[d + "checked_max"] == true)){
		        svg.select(".motifs_"+d).selectAll(".line")
		        .style("display", null);
   		}
		else{
		        svg.select(".motifs_"+d).selectAll(".line")
		        .style("display", "none");
		}*/
   
   
   })
}



