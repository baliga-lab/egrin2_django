

function redrawSeqLogo(names){
//	debugger;
		if (	(view.right - view.left) <= 310 && (window[names + "checked"] == true) && (checked_global == true) ) { 
			//lll.selectAll(".line").remove();
			
			
			var sequence = focus.selectAll("#" + names).remove();
			
			//debugger;
			normalize.domain([0,eval("pp_" + names).map(function(d) { return  d3.max((d.values.map(function(e) { return (e.MAX);} )));})]);
			//console.log("normalize domain: " + normalize.domain());
			
			//debugger;
			
		//	mot_names.forEach(function(d){
		//	svg.select(".motifs_"+d).selectAll(".line").remove();
		//}
			
		//console.log(eval("_"+names).size());	
		/*window["_"+names] = svg.selectAll(".sequence-column" + names)
	        .data(eval(names));
		window["_"+names].remove().exit(); // ?
		window["_"+names]
	      	.enter()
	      	.append("g")
		.attr("class", "sequence-column") 	; */
		//console.log(eval("_"+names).size());			
			
			xSeqLogo.domain(d3.range(view.left,view.right,1))
			//if(mot_max.length !== 0){
				
			//ySeqLogo.domain([0, d3.max(mot_max)]);//eval(window["_" + names + "_max"])
			
				//}
			
		//eval("_"+names)
		
		
		
		
		eval("_"+names)
		//eval(names)
		.selectAll("#" + names)
		//.data(MOT_1["motif"].filter(function(d) {  return d.POSITION >= view.left && d.POSITION <= view.right  ;}))	
		 .data(function(d){ return d.values.filter(function(f) {  return f.POSITION >= view.left && f.POSITION <= view.right  ;});})
		//.data(function(d) { d.values.filter(function(e) {console.log(e.POSITION <= view.right && e.POSITION >= view.left);});})
		
		//.data(function(d) {return (d.POSITION <= view.right && d.POSITION >= view.left) ;debugger})
		//.data(function(d){ return (d.POSITION >= view.left && d.POSITION <= view.right)		;})
		//.data(function(d){return d.bits;})
		//.data(mot["motif"])
		//.data(names)
		//.data(mot["motif"].filter(function(d) {return   (d.POSITION <= view.right && d.POSITION >=view.left)    ;}))
			.enter().append("text")
				.attr("id", names)
				.attr("clip-path", "url(#clip)")
				.attr("y", function(e,i) {return ySeqLogo(normalize(e.INIT)); })
				.attr("x", function(d) { return x(d.POSITION); })
				//.attr("fill", "white")
				.text( function(e) { return e.LETTER; } )
				.attr("class", function(e) { return "letter-" + e.LETTER; } )
				.style( "text-anchor", "start" )
				.style( "font", "corrier" )
//				.style("text-size-adjust", "inherit")
				.attr( "textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
				.attr("transform", "translate(0, 195)")
//					.attr( "textLength", 10)
				.attr( "lengthAdjust", "spacingAndGlyphs" )
				.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } )
				.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } )

				
				;

				
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


//d3.max(p_pssm0.map(function(d) {return(d.max);}))

/*var line = d3.svg.line()
	
    	//.defined(function(d) { return d.y != null; })
    	.x(function(d) { return x(d.position); })
    	.y(function(d) {return yLine(d.max) + 250; }); */

var line = d3.svg.area()
	
    	//.defined(function(d) { return d.START != null; })
    	//.interpolate("basis")
	.x(function(d) { return x(d.START); })
    	.y(function(d) {return yLine(d.MAX) ; })
	//.y0(390)
	//.y1(function(d) {return yLine(d.MAX) ; })
	//.attr("transform", "translate(0," + 250 + ")")
	;


function drawLine(){
	
	//console.log("inside drawLine()");
	//getMotifMax(view.left, view.right, "MOT_10");

	//svg.selectAll(".line").remove();
	
	//var temp__ = getMaxLocal(getNameWithoutUnchecked());
	
	yLine.domain([0,getMaxLocal(getNameWithoutUnchecked())]);
	
	//var t = svg.transition().duration(750);
	//t.selectAll
	svg.selectAll("#max_local").call(yAxisMaxLocal);
	
	mot_names.forEach(function(d){
		//debugger;
		if((window[d + "checked"] == true)) {
			//debugger;
	 // taking the domain localy
	
	//normalize.domain([0,eval("pp_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));}) ]);		
	//console.log("domain : " + normalize.domain());
	//eval("max_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));})
	focus.select(".motifs_"+d).selectAll(".line")
	   .data(eval("pp_"+d))
//	   .transition() // set the new data
	   .attr("clip-path", "url(#clip)")
	   //.attr("transform", "translate(0, 0)")
	   .attr("d", line(eval("pp_"+d)[0].values))//.filter(function(f) {return (f.START >= (view.left-10000) && f.START <= (view.right+10000)   );}))); // apply the new data values
//	   .transition()
//	         .duration(500)


	.style("fill", color(d.key))
	//.style("stroke", color(d.key))
	//.style("opacity", 1)
	.append("svg:title")
	.text(function(d) { return d.key; });
	
	focus.selectAll(".motifs_" + d ).style("display", null);
	
	}// end of if
	else{
		//svg.select(".motifs_"+d).selectAll(".line").remove();
    	    	focus.selectAll(".motifs_" + d ).style("display", "none");
		//console.log(d + " --> isn't selected");
	}

	
	;
   }); //end of forEach
}



// transform expression data to path-like data *then I'll have only 1 path per experiment

//exp_expression1
//Object {start: 20177, name: "expression1", strand: "+", value: 0.78, end: 20226}

function transformExpression(items) {
	var paths = {}, d, result = [];
	for (var i = 0; i < items.length; i++) {
		d = items[i];
		if (!paths[d.name]) paths[d.name] = '';	
		paths[d.name] += ['M',x(d.start),(yExpression(d.value)-110),'H',x(d.end)].join(' ');
	}

	for (var name in paths) {
		result.push({class: name, path: paths[name]});
	}

	return result;
}

function transformCoremGenes(items, y) {
	console.log("y : " + y);
	var paths = {}, d, result = [];
	for (var i = 0; i < items.length; i++) {
		d = items[i];

		if (!paths[d.gene]) paths[d.gene] = '';	
		paths[d.gene] += ['M',x3(d.start),y,'H',x3(d.start+10000)].join(' ');
	}

	for (var name in paths) {
		result.push({class: name, path: paths[name]});
	}

	return result;
}

function getMax_local(){
	max_temp.push(d3.max(q.values.map(function(w) {return (w.BITS);})));
}

// some tests

function getMaxLocal(motif_checked){
var max_temp = new Array();

motif_checked.forEach(function(d) {
	//debugger;

	eval("m_"+ d).forEach(function(q)  {
		max_temp.push(d3.max(q.values.map(function(w) {return (w.BITS);})));
	;})
});
return(d3.max(max_temp));
}

function getNameWithoutUnchecked(){
	var tt = this.id;
	name_temp = [];
	mot_names.forEach(function(e) {
		//debugger;
		if(eval(e+"checked") != false){
			name_temp.push(e);
		};
	});
	return name_temp;
}

function uncheckAll(){
//	debugger;
//	console.log(this.checked);
	if(d3.selectAll("#checkAll")[0][1].checked) {
		d3.selectAll("input[name=boxes]").property("checked", true);
			mot_names.forEach(function(d){
				window[d + "checked"] = true;
				;
				redrawSeqLogo(d);
			});
			
//			drawLine();
	}
	else{
		d3.selectAll("input[name=boxes]").property("checked", false);
			mot_names.forEach(function(d){
				window[d + "checked"] = false;
				;
				redrawSeqLogo(d);
			});
			
//			drawLine();
	}
	drawLine();
}

