// Aux functions

// ----------------- Bookmarks

var formatBookmark = function(d) {
	
    	//var commonName = gene[5];
    	//var name = gene[4];
    	//var result = (commonName=="") ? name : commonName;
    	return ( d.name + " , " + d.chr + " , " + d.start + " , " + d.end + "  , " + d.strand + ", " + d.sequence);
}    
    
function bookmark_renderer(){    
    //var bookmarks = ["bk1", "bk2"];
    d3.selectAll("#bookmark_id").remove();
   var bk_renderer =  d3.select("#bk_space").append("select")
        .attr("multiple", "")
        .attr('id', 'bookmark_id')
	.attr('class', 'bookmark_select')
	.attr("size", 30 )	
        .on("change", changeBookmark)
    .selectAll("option")//.data(bookmarks)
    .data(bookmark_data)
    .enter()
    .append("option")
        .attr("id", function(d, i){return i;})
        .attr("value", function(d,i){ return d.start + ',' + d.end + ',' + d.name + ',' + i; }) /* Optional */
        .text(formatBookmark);
	
}

function redraw_bookmark(){
		var bk_renderer =  d3.select("#bk_space").selectAll('select').data(bookmark_data);
		bk_renderer.enter().append("select");
		bk_renderer.exit.remove();
		
		bk_renderer
	        .attr("multiple", "")
	        .attr("size", 30 )	
	        .on("change", changeBookmark)
		    //.selectAll("option")
		    //.append("option")
		        .attr("id", function(d, i){return i;})
		        .attr("value", function(d){ return d.start + ',' + d.end; }) /* Optional */
		        .text(formatBookmark);
}


var bkSelected = 0;
function changeBookmark(){ // selecting bookmark region
    	    //console.log(this.value);
	    if(brushFocus.empty()){
	    	activateBrushFocus_(true)
	    }
    
	    window['selected_bookmark'] =  this.value;
	    if (	(brush.extent()[0] == x.domain()[0])  && (brush.extent()[1] == x.domain()[1]) 	){
		    resetView();
    }
		    //console.log("inside brush. Let's query it and change position")
		    
		    changePositionBySelection(this.value.split(',')[2]);
		    //debugger;
		    bkSelected = this.value;		    
		    
		    //debugger;
		    //console.log("id bk: "+ bkSelected);
		    brushFocus.extent([+this.value.split(",")[0],+this.value.split(",")[1]]);
		    svg.select(".x.brushFocus").call(brushFocus);
		    document.getElementById('bookmark_id').getElementsByTagName('option')[+this.value.split(',')[3]].selected = 'selected';
	    }

// ---------------- End-of Bookmarks