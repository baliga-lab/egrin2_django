


	function transitionExample(){
		var m = svg.selectAll("#GRE4").data(CarA_4_1["motif"]);
		m.exit().remove();
		m.transition()
//		.attr( "textLength", xSeqLogo.rangeBand()+10 )
		//.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust+10; } )
		/*.attr("y", function(e,i) {
			
			if(e.INIT != 0){
					return ySeqLogo(normalize(e.INIT+1));
			}
			else{
					return ySeqLogo(normalize(e.INIT));
			}
		})*/
			.attr("y", function(e,i) {return ySeqLogo(normalize(e.INIT)); })
			//.attr("x", function(d) { return x(d.POSITION); })
			.text( function(e) { return e.LETTER; } )
			.attr("class", function(e) { return "letter-" + e.LETTER; } )
			.style( "text-anchor", "start" )
			.style( "font", "corrier" )
			.attr( "textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
			.attr("transform", "translate(0, 195)")
			.attr( "lengthAdjust", "spacingAndGlyphs" )
			.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } )
			
		//.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust+10; } );
		
		.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } );
		
		setInterval(function(){transitionExample2()},3000);
		  
		  
		  //console.log(ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)));
	}
	
	
	function transitionExample2(){
		var m = svg.selectAll("#GRE4").data(CarA_4_3["motif"]);
		m.exit().remove();
		m.transition()
			.attr("y", function(e,i) {return ySeqLogo(normalize(e.INIT)); })
			//.attr("x", function(d) { return x(d.POSITION); })
			.text( function(e) { return e.LETTER; } )
			.attr("class", function(e) { return "letter-" + e.LETTER; } )
			.style( "text-anchor", "start" )
			.style( "font", "corrier" )
			.attr( "textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
			.attr("transform", "translate(0, 195)")
			.attr( "lengthAdjust", "spacingAndGlyphs" )
			.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } )
					
		.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } );
		

	}
	
	
	
	
	function showcaseMotifNormal(){
		var m = svg.selectAll("#All");
		m.transition()
		//.attr( "textLength", xSeqLogo.rangeBand()/2 );
		//.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust+10; } )
		.attr("y", function(e,i) {return ySeqLogo(normalize(e.INIT)); })
		.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } );
		  
		  
		  //console.log(ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)));
//		 setInterval(function(){showcaseMotifShrink()},2000);
	}


	// simulates click whenever user query's (search input) and press enter-btn
	$('.footer').keypress(function(e) {
	        if(e.which == 13) {
	            jQuery(this).blur();
	            jQuery('#send').focus().click();
	        }
	    });



// autocomplete for input

$(function() {
	// should I change it ?
    var availableTags =  new Array();
    
    for(i=0; i<sessionStorage.length; i++) {
	    availableTags.push(sessionStorage.key(i));
    }
  
    $( "#Search" ).autocomplete({
      source: availableTags
      //source: sessionStorage
    });
  });	

    
    
    
	
	
	function init(){
		// let's set brush
		brush.extent([view.left, view.left + 500]);
		svg.select(".x.brush").call(brush);
		//brushed();
	}
	
	

window["checked_global"]  = false;

	function changeShowSequenceLogo(){
		
		if(checked_global == true){
			window["checked_global"] = false;
			mot_names.forEach(function(d){ 
				// voltar redrawSeqLogo(d);
			});
		} else {
			window["checked_global"] = true;
			mot_names.forEach(function(d){ 
				// voltar redrawSeqLogo(d);
			});
		}
		//console.log(checked_global);
	}
	
	
	//prevent enter keypress inside form
	$(document).keypress(
	    function(event){
	     if (event.which == '13') {
	        event.preventDefault();
	      }


	});
	
	
/*	
	//cache our input since we will be working with it each time an arrow key is pressed
	var $input = $('#size');

	//bind the the `keydown` event for the `document` object which will catch all `keydown` events that bubble up the DOM
	$(document).on('keydown', function (event) {
		console.log($input.val());

	    //up-arrow (regular and num-pad)
	    if ( (event.which == 38 || event.which == 104) &&  parseInt($input.val()) >= 0) {

	        //make sure to use `parseInt()` so you can numerically add to the value rather than concocting a longer string
	        $input.val((parseInt($input.val()) + 1));
		$("#apply").click();

	    //down-arrow (regular and num-pad)
	    } else if (  (event.which == 40 || event.which == 98) &&  parseInt($input.val()) > 0  ) {
	        $input.val((parseInt($input.val()) - 1));
		$("#apply").click();
	    }
	});
	
	
	*/
	/* $("#size").keyup(function(event){
	    if(event.keyCode == 39 || event.keyCode == 37 ){
	        $("#apply").click();
	    }
	}); */
	
	function changeLabelForMotifAtt(){
		//console.log("change");
		var e = document.getElementById("motif_class");
		var l = e.options[e.selectedIndex].value;
		if(l === 'motif_segment'){
			//label_size.text = 'Size';
			d3.select("#label_size").text("Size: ")
		}
		else {
			//label_size.text = 'Window Size';
			d3.select("#label_size").text("Window Size: ")
		}
		
	}
	
	
	function applyChanges(){
		//console.log("apply");
		//console.log(this);
		var e = document.getElementById("motif_class");
		var strUser = e.options[e.selectedIndex].value;
		//console.log(strUser);
		changeMotifRepresentation(strUser);
		
		if( (size.value === '0' || size.value === '' || size.value=== ' ') && strUser ==='motif_segment' ){
			d3.select('#text_filter').text("     ");
		}
		else{
			d3.select('#text_filter').text("*filter applied : [layout: " + strUser + "-size: " + size.value + "]" ).attr("align", "right").style("color", "grey").style("font-size", "12px");
		}
	}
	
	
        $( "#motif-form" ).dialog({
            autoOpen: false,
            height: 500,
            width: 450,
            
            buttons: {
              Close: function() {
                $( this ).dialog( "close" );
              }
            },
            close: function() {
		    //console.log("cancel");
	      //allFields.val( "" ).removeClass( "ui-state-error" );
            }
          });
	  
          $( "#query-found" ).dialog({
              autoOpen: false,
              height: 500,
              width: 450,
            
              buttons: {
                Close: function() {
                  $( this ).dialog( "close" );
                }
              },
              close: function() {
  		    //console.log("cancel");
  	      //allFields.val( "" ).removeClass( "ui-state-error" );
              }
            });
	
	
	
        $(function() {
          $( "#add" ).button({
            text: false,
            icons: {
              primary: "ui-icon-plus"
            }
          })
	  .click(function() {console.log("add"); addBookmark();});
          $( "#remove" ).button({
            text: false,
            icons: {
              primary: "ui-icon-minus"
            }
          }).click(function() {console.log("remove")});
          $( "#in" ).button({
            text: false,
            icons: {
              primary: "ui-icon-zoomin"
            }
          }).click(function() {console.log("zoom in");bookmarkClick();});
          $( "#out" ).button({
            text: false,
            icons: {
              primary: "ui-icon-zoomout"
            }
          }).click(function() {console.log("zoom out");resetView();});
          $( "#move_left" ).button({
            text: false,
            icons: {
              primary: "ui-icon-seek-prev"
            }
          }).click(function() {console.log("move left");changePosition('minus');});
          $( "#move_right" ).button({
            text: false,
            icons: {
              primary: "ui-icon-seek-next"
            }
          }).click(function() {console.log("movr right");changePosition('plus');});	
	  $( "#repeat" ).buttonset();  	  
	  $( "#alter_motif")
	        .button()
	        .click(function() {
	          $( "#motif-form" ).dialog( "open" );
	        });
	  $( "#select_cursor" ).buttonset();  	
	  $( "#hand_cursor" ).buttonset();  	
		
        });



	$(function() {
	    $( "#tabs" ).tabs();
	  });

	$(document).ready(function(){


	   $('.show_hide').showHide({			 
			speed: 1000,  // speed you want the toggle to happen	
			easing: '',  // the animation effect you want. Remove this line if you dont want an effect and if you haven't included jQuery UI
			changeText: 1, // if you dont want the button text to change, set this to 0
			showText: 'View',// the button text to show when a div is closed
			hideText: 'Close' // the button text to show when a div is open
					 
		}); 


	});



function initGGBrowser() {
	var margin = {top: 10, right: 30, bottom: 160, left: 40},
	    margin2 = {top: 470, right: 30, bottom: 20, left: 40},
	    margin3 = {top: 470, right: 30, bottom: 20, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 600 - margin.top - margin.bottom,
	    height2 = 600 - margin2.top - margin2.bottom;

    
	    height3 = 50;    
    
	    var svg = d3.select("#ggbrowser-principal").append("svg")//#principal
	        //.attr("width", width)
		//.attr("width", width )
	        //.attr("height", height+100 + margin.top + margin.bottom)
		//.attr("height", height )
		
		.attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom);
		
	        //.append("g")
	        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//.attr("transform", "translate(" 0," + margin.top + ")");
		
		svg.append("defs").append("clipPath")
		    .attr("id", "clip")
		   
		  .append("rect")
		  //.attr("id", "rectClip")
		    .attr("width", width)
		    .attr("height", height);
		    
		    
		    
		/*var rect = svg.append("svg:rect")
		        .attr("class", "pane")
		        .attr("width", width)
		        .attr("height", height);
		        //.call(d3.behavior.zoom().on("zoom", zoom));
		
		
		
		
			function zoom(){
				//debugger;
				//d3.event.transform(x);
				console.log("called zoom()");
			}
		*/
		    var focus = svg.append("g")
		        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        		    var context_segment = svg.append("g")
        		        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    	    	    // I'll create a new path to fit context plot
    	    		context_segment.append("defs").append("clipPath")
    	    	        	.attr("id", "clip2")
    	    	     	 	.append("rect")
    	    	        	.attr("width", width)
    	    	        	.attr("height", height2);

		    var context = svg.append("g")
		    .attr("id", "test")
		    .attr("fill", "green")
		    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
		
		    context.append("rect")
		    .attr("fill", "grey")
		    .attr("opacity", 0.1)
	       	 	.attr("width", width)
			.attr("height", height);


  

      }



	function alterSize() {
		//console.log("alter size");
		brush3End();
	}
	//**************** 
	// dsalvanha - 
	// TO-DO: 	fix borders of rectangles ("genes rectangles go out of xAxis when you zoomIn/Out")
	//		fix Search minding the server-side query
	//		add sequence-logo code with checkbox abilities
	//		*fix round values in selection input 
	//		*fix set button and selected input
	//		...



	window['motif_representation'] = 'motif';
	function changeMotifRepresentation(t){
		//debugger;
		//console.log(' value: ' + t);
	
	
		
		if(t === 'overlaped_genes') {
			//console.log("inside overlaped_genes");
			window['motif_representation'] = 'overlaped_genes';
		
			var yPos = 0; 
			svg.selectAll("#overlapGene_").remove();
			mot_names.forEach(function(d){
			svg.selectAll("#overlap_").remove();

				getOverlapMotifsGenes(d, "gene", id, size.value);
			
			//	console.log('drawing Motif Heatmap');
			//	var yPos = 0;
			//	console.log('yPos : ' + yPos);
				//drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
				drawOverlapGenes(d, eval("overlap_"+ d)["GenesPerMotif"], yPos);
				yPos = yPos + 100/mot_names.length;
			//	console.log('yPos : ' + yPos);
			});  
		}
		else {
					window['motif_representation'] = 'motif';
					//console.log("inside motif_representation and size: " + size.value);

			var yPos = 0; 
			svg.selectAll("#overlap_").remove();   
			mot_names.forEach(function(d){
				svg.selectAll("#overlapGene_").remove();
				//svg.selectAll("#overlap_").remove();
				//console.log('drawing Motif Heatmap');
			//	var yPos = 0;
				//console.log('yPos : ' + yPos);
				//drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
				//drawOverlapMotif(d, eval("segment_"+ d)["MotifSegment"], yPos, size.value);
				drawOverlapMotif(d, eval("segment_"+ d), yPos, size.value);
				yPos = yPos + (100/mot_names.length);
				//console.log('yPos : ' + yPos);
			});  
		}
	
	
	
	
	
	}




	window["hide_heatmap"] = false;
	function hideHeatmap(boolean){
		if(boolean){
		window["hide_heatmap"] = boolean;
		var heatMap_ = svg.selectAll("#heatmap").style("display", "none");
	}
	else{
		window["hide_heatmap"] = boolean;
		var heatMap_ = svg.selectAll("#heatmap").style("display",  null);
	}
	}
	d3.select(".hand_cursor").style('border-style','dashed').style('border-color','grey');


	// end-of initializing


	function ReadCookie(cookieName) {

	 var theCookie=""+document.cookie;

	 var ind=theCookie.indexOf(cookieName);

	 if (ind==-1 || cookieName=="") return "";

	 var ind1=theCookie.indexOf(';',ind);

	 if (ind1==-1) ind1=theCookie.length; 

	 return unescape(theCookie.substring(ind+cookieName.length+1,ind1));

	}

	//window["id"] = parseInt(ReadCookie('id'));
	window["id"] = parseInt(location.search.substring(1));


	// Ajax Stuff - retrieving data from my ws
	//var id = 1;
	var left = 0;//20220
	var right = 5000;//31165
	var view = {};
	var w = right - left
	view.left = 0;
	view.right = 5000;

	//getMotifData_all(view.left,  view.right);
	getMotifData_all_rank(view.right/w);
	
	getListSegmentsAll(view.left,  view.right, view.right/w);
	
	getExpressionData(view.left, view.right);
	
	
	

	
	
	
	
	var color = d3.scale.category20().domain(mot_names); //category10()

	//var g=null;
	/*window.onload=function getData(){

	$.get("http://localhost:8888/WS2/services/Ws/getJsonFromMyFormObject?", {
	  chr: "1",
	  strand:"-",
	  start:view.left,
	  end:view.right
	})
	.done(function (xml){
	  var ret = $(xml).find('return').first().text();
	  //alert(ret);
	  //console.log(xml);
	  window["gg"] = JSON.parse(ret);
	});

	} */

	//getAllStrandsByPosition

	//getData("1", view.left, view.right); //encodeURIComponent('-')
	getSequenceData(id);
	//getOverlapMotifsGenes("MOT_18", "GENE", id);
	//if(genomeInfo !== null){
	//	console.log("let's get some annotationData then");
	//	getSequenceAnnotationData(1, view.left, view.right, "gene");
	//}


	//debugger;




	

	// end-of Ajax


	//var mot_names = ["MOT_1", "MOT_3", "MOT_4", "MOT_5", "MOT_10", "MOT_12", "MOT_16", "MOT_18", "MOT_30"];
	drawCheckBoxAndGetMotData();
	function drawCheckBoxAndGetMotData(){

	//getMotifNames(d3.round(view.left), d3.round(view.right));
	//debugger;	
	/*mot_names.forEach(function(d){;
		console.log("Called: getMotifData for: " + d);
		//getMotifData(d3.round(view.left), d3.round(view.right), d); //encodeURIComponent('-')
		//getMotifMax(view.left, view.right, d);
		//window["_"+d] = svg.selectAll(".sequence-column" + d)
	        //.data(eval(d))//["motif"]
	      	//.enter()
	      	//.append("g")
		//.attr("class", "sequence-column");
	
	
		//Let's draw some heatmap for motifs

	});*/




	drawBoxes();

	}
	//color for motif line and checkBox








	function drawBoxes(){
		

		//debugger;
	var box = d3.select("#boxes").selectAll("label")
	.data(mot_names);
	box.enter().append('label');
	box.exit().remove();
	box
	    .attr('for',function(d,i){ return d ; })
	    //.attr('color', "#ffff00")
	    .text(function(d) { return d; })
	    .style("color", function(d) { return color(d); } ) //
	    .style( "text-anchor", "left" )
	    .style( "font", "corrier")
	    .style( "font-size", "16px")
	.append("input")
	    .attr("id", "box_selected")
	    .attr("name", "boxes")
	    //.attr("checked", function(d) { debugger; eval(d + "checked");})
	    /*.attr("checked", function(d) {
		        if (typeof window[d + "checked"] != 'undefined'){
		        	return true;
		        }
			else {
				return null;
			}	
			;})*/
	    .attr("checked", function(d) {
		    if(window[d + "checked"] === false){
			    return null;}
			    else{
				    return true;
			    }})
	    //.attr("checked", function(d) { if(d === 'pssm0') {return true;} else {return null ;};})
	    .attr("type", "checkbox")
	    .attr('color', "#ffff00")
	    .style("fill", "#ffff00" )
	    .attr("id", function(d,i) { return d; });
	// .append("br");
	//    .attr("onClick", changeMot);
	
	mot_names.forEach(function(d) {
		//delete(window[d + "checked"]);

		if (typeof window[d + "checked"] === 'undefined'){
			window[d + "checked"] = true;
		}
		/*else{
			if(window[d + "checked"] === false){
				console.log("exists : " +d)
				window[d + "checked"] = null;
			}
		}*/


	}
	);
	
	var check2 = d3.selectAll("input[name=boxes]").on("change", changed2);
	
	}

	//*******************
	//let's display some information

	
	//var n = motif_all.forEach(function(e) {return (e.key);});
	// initializing my checkbox checked vars to checked when it starts - need it 'cause I always check it when I draw seqLogo
	

	//var check2 = d3.selectAll("input[name=boxes]").on("change", changed2);
	//var checkBox = d3.select("input[value=\"grouped\"]").property("checked", changed)
	//var name_temp = new Array();
	function changed2(){
		//degugger;
	    if(this.checked){
	   // console.log("value : " + this.value);
	   // console.log("id : " + this.id);
	   // console.log("checked : " + this.checked);
	   // console.log(this);
    
	    window[this.id + "checked"] = true;
    
    
	    svg.selectAll("#" + this.id )
	    .style("display", null);
    
	    svg.select(".motifs_"+this.id)//.selectAll(".line")
	    .style("display", null);
    
	    
	    
	    
	//max_local = getMaxLocal(getNameWithoutUnchecked());
	// voltar redrawSeqLogo(this.id)// necessary for when I set checkbox to checked, then it shows again seqlogo
	// voltar drawLine();
	}
	else {

		
	    //console.log(this)
	    window[this.id + "checked"] = false;
	   // debugger;
	    svg.selectAll("#" + this.id )
	    .style("display", "none");
    
	    svg.select(".motifs_"+this.id)//.selectAll(".line")
	    .style("display", "none");
		/*var tt = this.id;
		name_temp = [];
		mot_names.forEach(function(e) {
		//debugger;
			if(eval(e+"checked") != false){
				name_temp.push(e);
			};
		});
		//console.log(name_temp);
		*/
    	    	//max_local = getMaxLocal(getNameWithoutUnchecked());
		//redrawSeqLogo(this.id);
		// voltar drawLine();
	}
	}




	function redraw(){
	
		redrawHeatmap();
		redrawBasepair(bp["Basepair"], 0); 
		redrawBasepair(bp_inv["Basepair_inversion"], 1);
		//svg.select("#dois").selectAll('title').remove();
		//getData("1", d3.round(view.left), d3.round(view.right));
		//getSequenceAnnotationData(id, d3.round(left), d3.round(right), "gene");
	
	        var bar = focus.selectAll("#dois").data(g.filter(function(d, i) { 
	        		return (d.start <= view.right && d.end >= view.left)}));
	
	
		//var bar = svg.selectAll("#dois").data(g);
	
		//.data(genes.filter(function(d, i) { return (d[2] <= view.right && d[3] >= view.left)}));
		bar.enter().append("rect")
		bar.exit().remove(); //working with keys, what means that I'll redraw existents ones, remove unused and draw new ones
		bar 	
	//		.attr("transform", "translate(" + margin.left + "," + 0 + ")")
			.attr("id", "dois")
			.attr("clip-path", "url(#clip)")
	        	.attr('fill', function(d) {
	        		if(d.strand =='+') return '#eef000'; else return '#ddbb00';
	        	})
	        	.attr('y', function(d){ 
	        		if(d.strand =='+') return genetrack.plus; else return genetrack.minus;
	        	})
	        	.attr("x", function(d,i) {
	        		return x(d.start);	
	        	})
	        	.attr("width", function(d) { /*console.log("Width : "+ (d[3] - d[2]));*/
	        		return x(	(	(d.end - d.start)	+ view.left)	)	;	
	        	})
	        	.attr("height",genetrack.height)
	        	.attr('stroke', 'rgba(0,0,0,0.5)')
			.on('click', function(c){
				window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
				;})
			.style('cursor', 'hand')
			;
			bar.selectAll('title').remove();
		
			bar
			.append("svg:title")
			.text(function(d){ return (d.attributes)});
			
			mot_names.forEach(function(d){ redrawSeqLogo(d);});
			mot_names.forEach(function(d) {
				if(eval("_"+"All")[0].length !== 0 ) {
					//console.log(d)
				}
			;})
		
			redrawGeneLabels();	
		
	
	}








	//var genomeInfo = {start:1, end:2011729, left:left, right:right}; // halo


	var genetrack = {plus:10, minus:30, height:18};
	/*{plus:20, minus:60};//*/
	function alterTrack(text){
	
	
	
	
		if(text == "plus"){
		genetrack.plus = genetrack.plus - 10;
	 	genetrack.minus = genetrack.minus - 10;

		} else{
		genetrack.plus = genetrack.plus + 10;
		genetrack.minus = genetrack.minus + 10;
		}
	
		redraw();
	}
	
	
	Array.prototype.contains = function(obj) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] === obj) {
	            return true;
	        }
	    }
	    return false;
	}


	function cleanMemory(del){
		//clean memory for unused data
	del.forEach(function(w) {
		window["_"+w] = null;
		delete(window["_"+w]);
		
		window["m_"+w] = null;
		delete(window["m_"+w]);
		
		window["pp_"+w] = null;
		delete(window["pp_"+w]);
		
		window["segment_"+w] = null;
		delete(window["segment_"+w]);
		
		window["overlap_"+w] = null;
		delete(window["overlap_"+w]);
		
		window["pp_"+w] = null;
		delete(window["pp_"+w]);
		
		;})
	}
	function changePosition(text){
		
	getNameWithoutUnchecked().forEach(function(d) {
		svg.selectAll("#" + d).remove();
	
	} );	
	
		if(text == "plus" && genomeInfo.end >= view.right){
		
			view.left = left + 2500;
			view.right = right + 2500;
			x.domain([view.left, view.right]);
			x2.domain([view.left, view.right]);
			
			
			/*mot_names.forEach(function(d) {
			
				svg.select(".motifs_"+d).remove();
			
			});*/
				
			old_names = new Array();
			old_names = [];
			del = new Array();
			del = [];
			
			
			old_names = mot_names;	
				
			//getMotifData_all(view.left, view.right);
			getMotifData_all_rank(view.right/w);
			
			
			getListSegmentsAll(view.left,  view.right,view.right/w);
			getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
			/*mot_names.forEach(function(d){
				//getOverlapMotifsGenes(d, "gene", id);
				getListSegments(d);
			});*/
			getExpressionData(view.left, view.right);
			old_names.forEach(function(d) { 
				if(!mot_names.contains(d)){
					del.push(d);
					var t = svg.select(".motifs_"+d).remove();
					delete(t);
				}
				;})
				
				cleanMemory(del);
				

		
			brush.clear();
			svg.select(".brush").call(brush);
		
			// updating the brush3 - genome
			brush3.extent([view.left,view.right]);
			svg2.select(".brush").call(brush3);
			left = view.left; right = view.right;
		
			focus.select(".x.axis").call(xAxis);
			context.select(".x.axis").call(xAxis2);




		}
		if(text == "minus" && genomeInfo.start < view.left){
			view.left = left - 2500;
			view.right = right - 2500;
			
			/*mot_names.forEach(function(d) {
			
				svg.select(".motifs_"+d).remove();
			
			}); */
				
				old_names = new Array();
				old_names = [];
				del = new Array();
				del = [];
			
			
				old_names = mot_names;	
				
				//getMotifData_all(view.left, view.right);
				getMotifData_all_rank(view.right/w);
				
				getListSegmentsAll(view.left,  view.right,view.right/w);
				getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
				/*mot_names.forEach(function(d){
					//getOverlapMotifsGenes(d, "gene", id);
					getListSegments(d);
				}); */
				getExpressionData(view.left, view.right);			
				old_names.forEach(function(d) { 
					if(!mot_names.contains(d)){
						del.push(d);
						svg.select(".motifs_"+d).remove();
					}
					;})	
				
				
			

			x.domain([view.left, view.right]);
			x2.domain([view.left, view.right]);
		
			// updating the brush3 - genome
			brush3.extent([view.left,view.right]);
			svg2.select(".brush").call(brush3);
			left = view.left; right = view.right;
		
		
			focus.select(".x.axis").call(xAxis);
			context.select(".x.axis").call(xAxis2);

		}

		
		//everytime I changeposition, I need to get new data, and bind it to chart as well (seqLogo)
		mot_names.forEach(function(d) {
			
			
			//getListSegments(d);
			//delete(window["_"+d]);
			window["_"+d] = focus.selectAll(".sequence-column" + d)
		        //.data(eval(d));
			.data(eval("m_"+d))
			window["_"+d].remove().exit(); // ?
			window["_"+d]
		      	.enter()
		      	.append("g")
			.attr("class", "sequence-column") 	;
		});
		
		/*var tt = this.id;
		name_temp = [];
		mot_names.forEach(function(e) {
			//debugger;
			if(eval(e+"checked") != false){
				name_temp.push(e);
			};
		});
		max_local = getMaxLocal(name_temp);
		debugger;*/
		
		redraw();
		redrawExpressionAsPath();
		//redrawExpressionData();
		drawCheckBoxAndGetMotData();
		// voltar drawLine();
		brush3End();
		
		

/*		var e = document.getElementById("motif_class");
		var strUser = e.options[e.selectedIndex].value;
		console.log(strUser);
		changeMotifRepresentation(strUser);
*/		
		
		var check2 = d3.selectAll("input[name=boxes]").on("change", changed2);
	}

	
	function info(){
	
		var tr = d3.selectAll("#info")
			.data(genes.filter(function(d) { 
				return( (d[2] <= view.right) && (d[3] >= view.left)  );
			})).remove();	     
			    tr.enter().append("p")
			    .attr("id", "info")
				.text(function(d) {return d[0]});
	
	
		}

	var padding = 20; // DO I NEED IT ?



	var x = d3.scale.linear().range([0, width]).domain([view.left, view.right]),
	    x2 = d3.scale.linear().range([0, width]).domain([view.left, view.right]),
	    x3 = d3.scale.linear().range([0, width]).domain([genomeInfo.start, genomeInfo.end]),
	    y = d3.scale.linear().range([height, 0]),
	    y2 = d3.scale.linear().range([height2, 0]).rangeRound([0, height2]);
	    y3 = d3.scale.linear().range([40, 0]).rangeRound([0, 40]);
	    //yMotif = d3.scale.linear().range([height/2, 0]);
	    
	var ySeqLogo = d3.scale.linear()
		.range([( (height+margin.left)/2), 0]).domain([0, 2]);
	var normalize = d3.scale.linear()
		.range([0,2]);
	    
	    //yLine = d3.scale.linear().range([height2, 0]).domain([0,90]);
	    yLine = d3.scale.linear().range([height, 100]).domain([0,max_local]); // 100 because I need to have room for other tracks
	    
	    yExpression = d3.scale.linear().range([height, 0]).domain([-5,5]);
	    
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom"),
	    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");
	    yAxisSeqLogo = d3.svg.axis().scale(ySeqLogo).orient("left").ticks(15);
	    yAxisMaxLocal = d3.svg.axis().scale(yLine).orient("right").ticks(15);

    
	var xAxis3 = d3.svg.axis().scale(x3).orient("bottom");

		if ( (genomeInfo.end - genomeInfo.start) / 1000 > 1000){
			xAxis3
			.tickValues(d3.range(0, genomeInfo.end, 1000000))
			.tickFormat(function(d) {return (d/1000000) + 'M';});
		}
		else {
			xAxis3
			.tickValues(d3.range(10000, genomeInfo.end, 10000))
			.tickFormat(function(d) {return (d/1000) + 'k';});
		}
    


	    var formatLabel = function(gene_) {
		    //debugger;
		gene_.attributes.split(";").forEach(function(d){
			var t = d.split("=");
			if(t[0]== "Name"){
				window["commonName"] = t[1];
			}
			if(t[0]== "ID"){
				window["name"] = t[1];
			}	
		})    
	    	//var commonName = gene[5];
	    	//var name = gene[4];
	    	var result = (commonName=="") ? name : commonName;
	    		if (result.length * 7 > x(gene_.end - gene_.start + view.left))
	    		return "";
	    	else
	    		return result;
	    }
    
	    var formatLabelForGff = function(gene) {
	    
	    	var commonName = gene[5];
	    	var name = gene[4];
	    	var result = (commonName=="") ? name : commonName;
	    		if (result.length * 7 > x(gene[3] - gene[2] + view.left))
	    		return "";
	    	else
	    		return result;
	    }
    
    
   
    
	    //gene.attributes.split(";").forEach(function(d) {   var t = d.split("="); if(t[0]== "ID") console.log(t[1]);      })

	var brush = d3.svg.brush()
	    .x(x2)
	    //.on("brushstart", brushStart)
	    .on("brush", brushed)
;
	    //***********************.on("brushend", brushEnd);
    
	    
	    
	        
	var brushFocus = d3.svg.brush()
	    .x(x)
	    .on("brush", brushedFocus)
	    .on("brushstart", brushedFocusStart);
	//    .style('pointer-events', 'all');     


	var brush3 = d3.svg.brush()
	    .x(x3)
	    .on("brushend", brush3End)
	    .on("brush", brushed3);   





	
		var area = d3.svg.area()
		    .x(function(d) { return x(d.START); })
		    .y0(height)
		    .y1(function(d) { return yLine(d.MAX)+300; });	
	

	var svg2 = d3.select("#allGenome").append("svg")//#principal
		.attr("id", "svg2")
	        .attr("width", width + 50)
	        .attr("height", height3)
	;
	        //.style("color", "green" )
		//.style( "align", "center" )
	        //.style( "font", "corrier" )
		//.style( "font-size", "25" );
	
	
	
	


    

     
     

	    //.attr("transform", "translate(" + 0 + "," + margin.top  + ")");
    

		
		
	    // some tests with checkbox and on
    
		    var check = d3.selectAll("input[name=mot]").on("change", changed);
		    //var checkBox = d3.select("input[value=\"grouped\"]").property("checked", changed)
		    function changed(){
			    if(this.checked){
			    console.log("changed : " + this.value);
			    svg.selectAll("#seqLogo")
			    .style("display", null);
		    
		    }
		    else {
			    console.log(this)
			    svg.selectAll("#seqLogo")
			    .style("display", "none")
		    }
		    }
    
	    // end tests
    
	    // select input
    
    



	    	    
		  	  //console.log(brush.empty());

	//	  	  view.left = d3.round(x.domain()[0]);
	//	  	  view.right = d3.round(x.domain()[1]);  
		  	  //console.log(view.left + ","+ view.right);
	//	  	  focus.select(".x.axis").call(xAxis)
	//	  	  start.value = d3.round(x.domain()[0])
	//	  	  end.value = d3.round(x.domain()[1])
	//	  	  selected.value = (view.right - view.left)+1
		  	  //if((view.right - view.left) != (right-1)) {selected.value = (view.right - view.left)}
		  	  // fix round values in selection input 
	//	    	redraw();
        
	
	
	function drawLineChart(){
	
		svg.selectAll('.line').remove();
	mot_names.forEach(function(d){
	//getMotifMax(view.left, view.right, d);


	//normalize.domain([0,d3.max(eval("p_"+d).map(function(d) {return(d.max);}))]);   //eval("max_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));}) ]);		
	
	//console.log("domain : " + normalize.domain());


	var lll = focus.selectAll(".motifs_"+d)
	//old  .data(eval("max_"+d));
	.data(eval("pp_"+d));
		  
	lll.enter().append("g");
	lll.exit().remove();
	lll
	
	      .attr("class", "motifs_" + d);
	lll.append("path")
	.attr("class", "line")
	.attr("clip-path", "url(#clip)")
	//old  .attr("d", line(eval("max_"+d)[0].values))
	.attr("d", line(eval("pp_"+d)[0].values) )
//	.attr("transform", "translate(0, 0)")

	.style("stroke", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) ) //old   values[0].MOTIF_NAME
	.style("fill", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) )
	.style("opacity", 0.5)
	//.on("mouseover", function(){d3.select(this).style("stroke", "#999999").attr("stroke-opacity", "1.0");});  
    
	})};// voltar drawLineChart();
	
	
	
	function bookmarkClick(){ // zoomingBookmark

		//console.log("bookmarkClick");
	
		  var bk_start = +bkSelected.split(",")[2];
		  var bk_end = +bkSelected.split(",")[3];	
	      	  if(bk_start <= view.right  && bk_end >= view.left) {
			 // console.log("bookmark inside data range");
			  view.left =  bk_start - 1000;
		      	  view.right = bk_end + 1000;
		          getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
		      	  x.domain([view.left, view.right]);
		      	  focus.select(".x.axis").call(xAxis)
		      	  //start.value = +bkSelected.split(",")[2];
		      	  //end.value = +bkSelected.split(",")[3];
		      	  //selected.value = (view.right - view.left)+1
			  brushFocus.clear();
			  //brushFocus.extent([0,0]);
		    	  svg.select(".x.brushFocus").call(brushFocus);
	  
			  brush.extent([view.left,view.right]);
		  	  svg.select(".x.brush").call(brush);
		  	  focus.select(".x.axis").call(xAxis);
			  redraw();
			 // voltar  drawLineChart();
	      	  }
		  else{
			  console.log("bookmark OUTSIDE data range");
			  
			  
		  }


	}

	//var bookmark_data = new Array();
	var bookmark_data = Array();
	function BookmarkDTOObj(name, chr, start, end, strand, sequence, annotation) {
	        this.name = name;
	        this.chr = chr;
	        this.start = start;
	    	this.end = end;
	        this.strand = strand;
	        this.sequence = sequence;
	        this.annotation = annotation;		
	};
	
	
	function addBookmark(){
		//console.log('Lets add some bookmark');
		var selection = brushFocus.extent();
		var i = bookmark_data.length;
		if(selection[1] - selection[0] !==0) {
			console.log(selection);
			//bookmark_data[i] = ['Name', 'Chr', d3.round(selection[0]), d3.round(selection[1]), 'Strand', 'Sequence', 'Annotation'];
			bookmark_data.push(new BookmarkDTOObj('name', 'chr', d3.round(selection[0]), d3.round(selection[1]), 'strand', 'sequence', 'annotation')); 
			
			
			bookmark_renderer();
			//redraw_bookmark();
		
		}
		else {alert('Please, select some region to bookmark.')}
	}
   
        
   
   
   
    
	    //***********************
	    // Reserved space for sequence logo vars etc. 
	
	
		var capHeightAdjust = 1.2;
		var xSeqLogo = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);//.domain([29451, 29465])

		
    
		// let's transform (parse) our data and make it usufull for our seq-log
		//filter(function(d,i){  if(d[0].position >= view.left && d[0].position <= view.right) /*console.log(d.bits);*/ return d  ;}).
		//.filter(function(d,i){  if(d[0].position >= view.left && d[0].position <= view.right) /*console.log(d.bits);*/ return d  ;})
	//	eval(mot_names[0]).forEach(function(d) {
	//		var y0 = 0;
	//		d.bits = d.map( function( entry ) { 
	//				
	//			return { position: +entry.position, bits: entry.bits, letter: entry.letter, y0: y0, y1 : y0 += +entry.bits };  		
	//		    }  
	//		)
	//		d.bitTotal = d.bits[d.bits.length - 1].y1; 
	//	});

	//for(var key in mot_names){
	//	console.log("Key : " +  mot_names[key]);
	//}


	//	for(var key in jsonOBJ){ alert('key name: ' + key + ' value: ' + data[key]); }


	//(mot_names).forEach(function(d) { eval(d).forEach( function(d) {
	//	var y0 = 0;
	//	d.bits = d.map( function( entry ) { 
			
	//		return { position: +entry.position, bits: entry.bits, letter: entry.letter, y0: y0, y1 : y0 += +entry.bits };  		
	//	    }  
	//	)
	//	d.bitTotal = d.bits[d.bits.length - 1].y1; 
	//});	     
	  //   ;})

	//	var maxBits = d3.max( eval(mot_names[0]), function( d ) { return d.bitTotal } );
      

  
	    // end reserved space for seq-log.
	    //*********************
    
	// Let's draw our seq-Logo
	//debugger

	// remove it 'cause I added the same code inside redrawSeqLogo; (then I update at once everytime I need to redraw)
	mot_names.forEach(function(d){
		//debugger;
		//debugger;
		window["_"+d] = focus.selectAll(".sequence-column" + d)
	        .data(eval("m_"+d))
		//.data(eval(d))//["motif"]
	      	//.data(motif_all, function(e) { if (e.key === d) {return(e.values)}})
		.enter()
	      	.append("g")
		.attr("class", "sequence-column") 	;
		//debugger;
		;
	//	delete(window[d]);
	//	console.log("called delete");
		})
	


	//var column = svg.selectAll(".sequence-column")

	//  .data(eval(mot_names))

	//	.enter()
	//	.append("g")
		//.attr("transform", function(d, i) { return "translate(" + (x(d[0].position) + (xSeqLogo.rangeBand() )) + ",0)"; })
	//	.attr("class", "sequence-column");
    
    
    
	// line graph

	/*mot_names.forEach(function(d){
		//getOverlapMotifsGenes(d, "gene", id);
		getListSegments(d);
	}); */




    
	var yPos_ = 0;    
	mot_names.forEach(function(d){
		console.log('drawing Motif Heatmap');
	//	var yPos = 0;
		console.log('yPos : ' + yPos_);
		//drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
		//drawOverlapMotif(d, eval("segment_"+ d)["MotifSegment"], yPos_, 0);
		drawOverlapMotif(d, eval("segment_"+ d), yPos_, 0);
		yPos_ = yPos_ + (100/mot_names.length);
		console.log('yPos : ' + yPos_);
	});    
    
    
	function drawGeneLabels(){
		console.log("***label");
	// Labels for genes



		focus.selectAll("#glabel").data(g)
		/*.data(genes.filter(function(d, i) { 
			return( (d[2] <= view.right) && (d[3] >= view.left)  );
		}))*/
	
		//geneLabels.enter().append("text")
		//geneLabels.exit().remove();
	
	//geneLabels
		.enter()
		.append("text")
		.attr("id", "glabel")
		.attr("clip-path", "url(#clip)")
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
	//	.attr("text-anchor", "middle")
		.attr('y', function(d){ 
			if(d.strand =='+') return genetrack.plus + 15; else return genetrack.minus + 15;
		})
		.attr("x", function(d,i) {
			return x(d.start) + 3;	
		})
		.attr("width", function(d,i) {
			return x(	(d.end - d.start)+ view.left	);	
		})
		.on('click', function(c){
			window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
			;})
		.text(formatLabel)
		.style('cursor', 'hand')
		.append("svg:title")
		.text(function(d, i) { return "" + d.attributes; })
	;
	
	}
    
	function redrawGeneLabels(){
		var geneLabels = focus.selectAll("#glabel").data(g.filter(function(d, i) { 
	        		return (d.start <= view.right && d.end >= view.left)}))
		//.data(genes.filter(function(d, i) { 
		//	return( (d[2] <= view.right) && (d[3] >= view.left)  );
		//}));	
	
		geneLabels.enter().append("text")
		geneLabels.exit().remove();
	
	geneLabels
		.attr("id", "glabel")
		.attr("clip-path", "url(#clip)")
		//.attr("clip-path", "url(#clip)")
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
	//	.attr("text-anchor", "middle")
		.attr('y', function(d){ 
			if(d.strand =='+') return genetrack.plus + 15; else return genetrack.minus + 15;
		})
		.attr("x", function(d,i) {
			return x(d.start ) + 3 ;	
		})
		.attr("width", function(d,i) {
			return x(	(d.end - d.start)+ view.left	);	
		})
		.on('click', function(c){
			window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
			;})
		.text(formatLabel)
		.style('cursor', 'hand')
		.append("svg:title")
		.text(function(d, i) { return "" + d.attributes; });
	
	}
   
	function activateBrushFocus(click, boolean){

		d3.select(".select_cursor").style('border-style','none' );
		d3.select(".hand_cursor").style('border-style','none');
		d3.select("."+click.className).style('border-style','dashed').style('border-color','grey');
		if(boolean){
	  	      focus.append("g")
	  		.attr("class", "x brushFocus")
			.attr("id", "brushFocus")
			.call(brushFocus)
			.selectAll("rect")
			.attr("y", -6)
			.attr("height", height + 7);
			//brushFocus.extent([left,left]);
			//svg.select('.brushFocus').call(brushFocus);
		}
		else {
			brushFocus.extent([left,left]);
			svg.select('.brushFocus').remove().call(brushFocus);
		}
	}   

	function activateBrushFocus_(boolean){
		d3.select(".select_cursor").style('border-style','dashed').style('border-color','grey');
		d3.select(".hand_cursor").style('border-style','none');
		if(boolean){
	  	      focus.append("g")
	  		.attr("class", "x brushFocus")
			.attr("id", "brushFocus")
			.call(brushFocus)
			.selectAll("rect")
			.attr("y", -6)
			.attr("height", height + 7);
			//brushFocus.extent([left,left]);
			//svg.select('.brushFocus').call(brushFocus);
		}
		else {
			brushFocus.extent([left,left]);
			svg.select('.brushFocus').remove().call(brushFocus);
		}
	}   
    
	//getting geneData
	//getSequenceAnnotationData(id, left, right, "gene");  //left, right  
	getSequenceAnnotationDataLocal(id, genomeInfo.start, genomeInfo.end, "gene");  //left, right  
	function drawGenes(){     
	    //Drawing genes rect - whenever pages load
    
	    //getData();
	    
    
	    var genes1 = focus.selectAll("#dois").data(g);
    
	    /*.data(genes.filter(function(d, i) { 
		return( (d[2] <= view.right) && (d[3] >= view.left)  );
		})); */
	
		//genes1.append("g");
				
    	
		genes1

		.enter()
		
		.append("rect")
		//.attr("class", "node")
	//	.attr("transform", "translate(" + margin.left + "," + 0 + ")")
	//	.attr("class", "tooltip")
		//.attr("class", "tooltip")
		.attr("id", "dois")
		.attr("clip-path", "url(#clip)") // magic
	    	.attr('fill', function(d) { 
	    		if(d.strand =='+') return '#eef000'; else return '#ddbb00';
	    	})
	    	.attr('y', function(d){ 
	    		if(d.strand=='+') return genetrack.plus; else return genetrack.minus;
	    	})
	    	.attr("x", function(d,i) { 
			return x(d.start);	
	    	})
	    	.attr("width", function(d,i) {
	    		return x(	(d.end - d.start) + (view.left)	);	
	    	})
	    	.attr("height",genetrack.height)
	    	.attr('stroke', 'rgba(0,0,0,0.5)')
		//.attr("title", function(d){ return (d.attributes)})
	
		.attr("class", "hint--bottom")
		.on('click', function(c){
			//window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
		d3.select('#geneAnnotation').selectAll("p").remove();
		d3.selectAll('#geneAnnotation').append("p").text(c.attributes + ' :  http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank');
			;})
		//.style('cursor', 'hand')
		//.append("svg:title")	
		//.text(function(d){ return (d.attributes)})

		.call(d3.behavior.drag().on("drag", move));
	
	;
	}
	
	function move() {
		if(d3.event.y > 0 && d3.event.y < 400){
		
	  d3.selectAll("#dois")
	      .attr("transform", "translate(" + 0 +  "," + (d3.event.y) + ")");
    	  d3.selectAll("#glabel")
    	      .attr("transform", "translate(" + 0 +  "," + (d3.event.y) + ")");
	      //console.log('x:'+d3.event.x +'y:'+ d3.event.y);
	      }
	}

	function drawGenesFixContext(){     
	    //Drawing genes rect - whenever pages load
    
	    //getData();
	    //getSequenceAnnotationData(id, left, right, "gene");
	    var genes1 = context.selectAll("genes_fix").data(g)
    
	    /*.data(genes.filter(function(d, i) { 
		return( (d[2] <= view.right) && (d[3] >= view.left)  );
		})); */
	
		genes1.append("g");
				
    	
		genes1
		.enter()
		.append("rect")

	
		//.attr("class", "node")
		//.attr("transform", "translate(" + margin.left + "," + 0 + ")")
	//	.attr("class", "tooltip")
		//.attr("class", "tooltip")
		.attr("id", "genes_fix")
		.attr("clip-path", "url(#clip2)")
	    	.attr('fill', function(d) { 
	    		if(d.strand =='+') return '#eef000'; else return '#ddbb00';
	    	})
	    	.attr('y', function(d){ 
	    		//if(d.strand=='+') return 450; else return 430;
			return 0;
	    	})
	    	.attr("x", function(d,i) {
	    		return x(d.start);	
	    	})
	    	.attr("width", function(d,i) {
	    		return x(	(d.end - d.start) + view.left	);	
	    	})
	    	.attr("height",12)
	    	.attr('stroke', 'rgba(0,0,0,0.5)')
	/*	.on('click', function(c){
			//window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
		d3.select('#geneAnnotation').selectAll("p").remove();
		d3.selectAll('#geneAnnotation').append("p").text(c.attributes + ' :  http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank');
			;})*/
	//	.style('cursor', 'hand')
		.append("svg:title")	
		.text(function(d){ return (d.attributes)})
		//.attr("data-tooltip", function(d){ return (d.attributes + " ---")})
	;
	}


    

	drawHeatmap();
	drawBasepair(bp["Basepair"],  0);
	//drawHeatmapMotif();


	drawBasepair(bp_inv["Basepair_inversion"], 1);



	  //setting domains for (re)drawing data
	  //y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);

      


	//var components = d3(genes1.attr("transform")); // some tests - getting transform attr



	//***************************
	// Generate some dots where I have MOTS count

	/*d3.csv("data/line1.csv", function(d) {
	  return {
	    position: +d.V1, // convert "Year" column to Date
	    value: +d.V2
	  };
	}, function(error, rows) {
	      area2 = svg.selectAll("#circle1")
	      .data(rows)
	      .enter().append("circle")
	      .attr("id", "circle1")
	      //.attr("interpolate", "monotone")
	      .attr("transform", "translate(0," + height2 + ")")
	      .attr("cx", function(d) { return x2(d.position); })
	      .attr("r", .5)
	      .attr("cy", function(d) { return y2(d.value) +375; })
	      .attr("fill", "blue");
	});


	d3.csv("data/line2.csv", function(d) {
	  return {
	    position: +d.V1, // convert "Year" column to Date
	    value: +d.V2
	  };
	}, function(error, rows) {
	      var line2 = svg.selectAll("#circle2")
	      .data(rows)
	      .enter().append("circle")
	      .attr("id", "circle2")
	      .attr("interpolate", "monotone")
	      .attr("transform", "translate(0," + height2 + ")")
	      .attr("cx", function(d) { return x2(d.position); })
	      .attr("r", .5)
	      .attr("cy", function(d) { return y2(d.value) +355; })
	      .attr("fill", "green");
	});
	*/

	//****************************






	//xSeqLogo(mot_names);


	var temp;
	//filtering my rect(genes) filtering only the view part of it


	//seqLogo

	/*var focus = svg.append("g")
	    //.attr("transform", "translate(" +  0 + "," + margin.top + ")"); // margin.left instead of 0
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var context = svg.append("g")
		//.attr("transform", "translate(" + 0 + "," + margin2.top + ")");
		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");*/
	var genome = svg2.append("g")
	        .attr("transform", "translate(" + 40 + "," + (0) + ")");


		genome.append("text")

	//	.attr("x", 10)
	//	.attr("y", 50)
		.attr("dx", 333) // padding-right
		.attr("dy", ".999em") // vertical-align: middle
	 	.attr("text-anchor", "center") // text-align: right;
		.attr("opacity", 0.5)
			.text(genomeInfo.name + " - " + genomeInfo.type + " - [" + genomeInfo.start + ":" + genomeInfo.end + "]");
	    var b = 0;
	    function filterData(dataSource, left, right){
    	
	    	dd = dataSource.filter(function(d,i){  if(d[0].position >= left && d[0].position <= right) /*console.log(d.bits);*/ return d  ;});
	
	
		dd.forEach(function(d) {
	    		var y0 = 0;
			var b;
	    		d.bits = d.map( function( entry ) { 
				
	    			return  { position: +entry.position, bits: entry.bits, letter: entry.letter, y0: y0, y1 : y0 += +entry.bits };  		
	    		    }  
	    		)
	    		d.bitTotal = d.bits[d.bits.length - 1].y1; 
			//dataSource = d;
			//return b;
		
		});
	//	console.log(dataSource);
		return dd;
	    }




    	  y.domain([0, 900]);
    	  x2.domain(x.domain());
    	  //y2.domain([1, 69]); //*** fix it, it may take max automaticaly
    	  
	  focus.append("path")
	        .attr("clip-path", "url(#clip)");
	  
	  focus.append("g")
    	      .attr("class", "x axis")
    	      .attr("transform", "translate(0," + height + ")")
    	      .call(xAxis);

    	  focus.append("g")
    	      .attr("class", "y axis")
	      //.attr("transform", "translate(-1, 0)")
	      .attr("transform", "translate(0, 195)") //--apaguei
    	      .call(yAxisSeqLogo);
	      
	      
	      focus.append("g")
	      .attr("class", "y axis")
	      .attr("id", "max_local")
    	      .attr("transform", "translate(" + width + ",0)")
	      .call(yAxisMaxLocal);
	    
		    
	  context.append("g")
    	      .attr("class", "x axis")
    	      .attr("id", "brush1")
    	      .attr("transform", "translate(0," + (height2) + ")")
	      //.attr("clip-path", "url(#clip2)")
    	      .call(xAxis2);
	      
	      
	      
	   /*   // Initialize the brush component with pretty resize handles.
	                var gBrush = context.append("g").attr("class", "brush").call(brush);
	                gBrush.selectAll("rect").attr("height", height2);
	                gBrush.selectAll(".resize").append("path");		      
	      
	     */ 

    	  context.append("g")
    	      .attr("class", "x brush")
	      .attr("id", "t")
    	      .call(brush)
    	    .selectAll("rect")
    	      .attr("y", -6)
	      //.attr("width", width - 40)
    	      .attr("height", height2+5)
	      //.attr("clip-path", "url(#clip2)")
	      ; 

    	      genome.append("g")
    	          .attr("class", "x axis")
    		  //.attr("id", "brush3")
    	          .attr("transform", "translate(0," + (height3 - padding) + ")")
    	          .call(xAxis3);

    		  genome.append("g")
    		      .attr("class", "x brush")
    		      .call(brush3)
    		    .selectAll("rect")
    		      .attr("y", -6)
    		      .attr("height", height3 + 7);




	    function zoomOut(){
		    resetView();
	    
	    }

	    function resetView(){
	  	  view.left = left;
	  	  view.right = right;
		  //don't need to recall once I have the data loaded
			//getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
	  	  x.domain([left, right]);
	  	  focus.select(".x.axis").call(xAxis)
	  	  //start.value = left;
	  	  //end.value = right;
	  	  //selected.value = "false"
		  d3.select('#text_principal').text(" No selection in context area. ").attr("align", "right");
	//  	selected.value = (view.right - view.left)+1
	  	brush.clear();
		svg.select(".x.brush").call(brush);
	  	focus.select(".x.axis").call(xAxis);
	    	redraw();
		//redrawExpressionData();
		redrawExpressionAsPath();
		// voltar drawLine();
		console.log("resetView()")
	    }

	function brushed() {

		//console.log("brushed");
		if(rightClick()){
			console.log("Right click : " + rightClick());
			svg.classed("selecting", false);
			contextmenu.show(); 
		}
		else {
			//console.log("Right click <false> : " + rightClick())
	
	  x.domain(brush.empty() ? x.domain() : brush.extent());
	  if(!brush.empty()){
		  //console.log(brush.empty());
	  
		  brushFocus.clear();
		  svg.select(".x.brushFocus").call(brushFocus);
	  
		  view.left = d3.round(x.domain()[0]);
		  view.right = d3.round(x.domain()[1]);

		  //console.log(view.left + ","+ view.right);
		  focus.select(".x.axis").call(xAxis)
		  //start.value = d3.round(x.domain()[0])
		  //end.value = d3.round(x.domain()[1])
		  d3.select('#text_principal').text(" Context selection : " + '['+ d3.round(x.domain()[0]) + ":" + d3.round(x.domain()[1]) + ']').attr("align", "right");
		  //selected.value = (view.right - view.left)+1
		  //if((view.right - view.left) != (right-1)) {selected.value = (view.right - view.left)}
		  // fix round values in selection input 
	  	redraw();
		//redrawExpressionData();
		redrawExpressionAsPath();
		// voltar drawLine();
	  }
	  else{ //correctiong when brush.empty() restables x.domain to general value
		  resetView();
	  }
	  }//end-f first else
	}



	// tests with keys press
	//http://jsfiddle.net/christopheviau/aPVxP/
	//http://tributary.io/inlet/5612571
	/*
	var circle = d3.select('#circle');
	var moveSpeed = 5;
	var move = {
	    W: ['cy', -moveSpeed],
	    A: ['cx', -moveSpeed],
	    S: ['cy', moveSpeed],
	    D: ['cx', moveSpeed],
	}
	d3.select('body').on("keydown", function(){
	    var key = String.fromCharCode(d3.event.keyCode);
	    if(move[key]){
	        circle.attr(move[key][0], function(){
	        return ~~d3.select(this).attr(move[key][0]) + move[key][1];
	    });
	  }
	});

	*/
	 function rightClick() { 
	         if (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button 
	== 2) { //3==firefox, 2==ie 
	                 return true; 
	         } else { 
	                 return false; 
	         } 
	 }
	// when I brushFocus my focus component
	function brushedFocus(){
	        if(!brushFocus.empty()){
	 
	  	}
	}
	function brushedFocusStart(){
		console.log("stype:none<brush>");
		//d3.select(".brushFocus").style('pointer-events', 'none').call(brushFocus);
		//qq;//.call(brushFocus);
		//svg.select(".brushFocus").call(brushFocus);
	}  


	function brush3start(){
		brush3.extent([view.left, view.right]);
		svg2.select(".brush").style('pointer-events', 'none').call(brush3);
	}brush3start(); //load it once


	function brush3End(){
		//mot_names.forEach(function(n){
		//getMotifData(d3.round(view.left), d3.round(view.right), n);	
		//});
		drawCheckBoxAndGetMotData();


		/*mot_names.forEach(function(d){
		getMotifMax(d3.round(view.left), d3.round(view.right), d);
	});*/
	svg.selectAll('#overlap_').remove();
	svg.selectAll('#overlapGene_').remove();
	svg.selectAll("#genes_fix").remove();
		if(mot_names.length === 0 ) {console.log('removing all representations');
		//svg.selectAll('#overlap_').remove();
		//svg.selectAll('#overlapGene_').remove();
		}
		else {
		yPos = 0;

			if(motif_representation === 'overlaped_genes') {
		
				var yPos = 40; 

				mot_names.forEach(function(d){
				//svg.selectAll("#overlap_").remove();

					getOverlapMotifsGenes(d, "gene", id, size.value);
			
				//	console.log('drawing Motif Heatmap');
				//	var yPos = 0;
				//	console.log('yPos : ' + yPos);
					//drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
					drawOverlapGenes(d, eval("overlap_"+ d)["GenesPerMotif"], yPos);
					yPos = yPos + 100/mot_names.length;
				//	console.log('yPos : ' + yPos);
				});  
			}
			else {

				var yPos = 0;    
				mot_names.forEach(function(d){
					svg.selectAll("#overlapGene_").remove();
					//console.log('drawing Motif Heatmap');
				//	var yPos = 0;
					//console.log('yPos : ' + yPos);
					//drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
					//drawOverlapMotif(d, eval("segment_"+ d)["MotifSegment"], yPos, size.value);
					drawOverlapMotif(d, eval("segment_"+ d), yPos, size.value);
					yPos = yPos + (100/mot_names.length);
					//console.log('yPos : ' + yPos);
				});  
			}
		
		} //end-of else (mot_names not === 0 )
		drawGenesFixContext();
		// voltar drawLineChart();
	    	resetView();
		
	
	}
	//brushStart();
	//brush();
	//function brushStart(){
	//	//drawLine();
	//	svg.classed("selecting", false);
	//}
	//function brushEnd(){
		//drawLine();
	//	svg.classed("selecting", !d3.event.target.empty());
	//}
	function brushed3(){
		

		
		var s = d3.event.target.extent();
		if (  (s[1]-s[0] < 11000)   ) {
	        //if(!brush3.empty()){
			//console.log( (s[1]-s[0] < 11000) )
		        //svg2.select(".brush").style('pointer-events', 'none');
			//var s = d3.event.target.extent();
			//debugger;
			brush.clear();
			svg.select("x.brush").call(brush);
			//console.log("inside brushed3");
			view.left = brush3.extent()[0];
			view.right = brush3.extent()[1];
			getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
			left=view.left; right=view.right;
			x.domain([view.left, view.right]);
			x2.domain([view.left, view.right]);
		
			// updating the brush3 - genome
			//brush3.extent([view.left,view.right]);
			//svg2.select(".brush").call(brush3);
			//left = view.left; right = view.right;
			svg.select(".brushFocus").call(brushFocus);
			svg.select(".brush").call(brush);
			focus.select(".x.axis").call(xAxis);
			context.select(".x.axis").call(xAxis2);
		
			// everytime I move my central brush, I reload my data
	
		
			redraw();
		}
		else {
			//console.log(s );
			d3.event.target.extent([s[0],s[0]+11000]); 
			d3.event.target(d3.select(this));
		} 
			//}
	} 

	function update(start, end){
		if(end <= start){
			alert("end <= start")

		}
		else{
			//* fix set button and selected input
		//console.log("new value : "+ start + ", " + end);
		//  view.left = d3.round(x.domain()[0]);
		//  view.right = d3.round(x.domain()[1]);  
		brush.extent([+start, +end]);
		x.domain([+start, +end]);
		//  start.value = d3.round(x.domain()[0])
		//  end.value = d3.round(x.domain()[1])
		selected.value = (view.right - view.left)+1
		svg.select(".x.brush").call(brush);
		focus.select(".x.axis").call(xAxis);
		redraw();
	
		}
	
	}
	var r = null;
	
	function redrawAll(){
		//redraw();
		redrawHeatmap();
		redrawBasepair();
		redrawExpressionAsPath();
		//drawLine();
		//everytime I changeposition, I need to get new data, and bind it to chart as well (seqLogo)
		mot_names.forEach(function(d) {
			
			
			//getListSegments(d);
			//delete(window["_"+d]);
			window["_"+d] = focus.selectAll(".sequence-column" + d)
		        //.data(eval(d));
			.data(eval("m_"+d))
			window["_"+d].remove().exit(); // ?
			window["_"+d]
		      	.enter()
		      	.append("g")
			.attr("class", "sequence-column") 	;
		});
		
		redraw();
		redrawExpressionAsPath();
		//redrawExpressionData();
		drawCheckBoxAndGetMotData();
		// voltar drawLine();
		brush3End();
		//redrawSeqLogo();
	}
	
	
	
	function geneQueried(name, start, end, genomeInfo, coremMembership) {
	        this.name = name;
	        this.start = start;
	    	this.end = end;
		this.genomeInfo = genomeInfo;
		this.coremMembership = coremMembership;
	};
	
	function getCoremAsText(){
		var t = "";
		group_temp.forEach(function(d) {
		t = t + d.key + ";";
		})
		return t;
		
	}
	
	var gene_ = Array();
	function query(textToQuery){
	
		if(textToQuery != ""){
			//console.log("inside query - let's look for the gene name");
			var res = sessionStorage.getItem(textToQuery.toLowerCase());
			//console.log("Query result: " + res);
			if( res !== null) {
				
				// let's get some extra data and plot some extra info on whole genome space 
				//debugger;
				getCoremGenes(textToQuery.toLowerCase());
				
				gene_ = [];
				//debugger;
				gene_.push(new geneQueried(textToQuery, +res.split(",")[0], +res.split(",")[1], genomeInfo.name, 	
				getCoremAsText()
			
				));
				tabulateGeneInfo(gene_, ['name', 'start', 'end', 'genomeInfo', 'coremMembership']);
				
				
				//alert("Query: " + textToQuery + " found. Position: " + res);
				//$("#query-found").dialog("open");//
				
				
				//getMotifData_all(view.left, view.right);
				
				//(2500 * d3.round(15000/5000) + 5000)
				
				
				//cleaning motif_names
				
				view.left = +res.split(",")[0] ; //-1000
				view.right = +res.split(",")[1] ;//+1000
				
				final_right = +res.split(",")[1];
				final_left = +res.split(",")[0];

				//debugger;
				//view.right  = ((( ((2500 * d3.round(view.right/w) + 5000))/w) ) * w);
				//view.left = ((( ((2500 * d3.round(view.right/w) + 5000))/w))* w) - w;
				view.left = (d3.round(view.right/w) * 5000);
				view.right = ((d3.round(view.right/w) * 5000 ) + 5000);
				//debugger;
				
				
				if(	!(	final_left >= view.left && final_right <= view.right	)	){
					console.log("gene not inside region");
					
					if(final_left >= view.left) {
						//debugger;
						console.log("right is out, let's sum")
						view.left = view.left + 2500;
						view.right = view.right + 2500;
						getMotifData_all_rank(d3.round(view.right/w) + 0.5);
					}
					else{
						var temp_r = view.right;
						view.left = view.left - 2500;
						view.right = view.right - 2500;
						
						//debugger;
						if(	!(	final_left >= view.left	)		){
							//debugger;
							console.log("left is out, let's dim")
							view.left = view.left - 2500;
							view.right = view.right - 2500;
							getMotifData_all_rank(d3.round(temp_r/w) - 1.0);						
						}
						else{
							//debugger;
							console.log("left is out, let's substract")
							getMotifData_all_rank(d3.round(view.right/w) - 0.5);						}
					}
				}
				else{
					console.log("gene is in between");
					getMotifData_all_rank(d3.round(view.right/w));
				}
				
				
				/*if((!(final_left >= view.left))) {// && final_left <= view.right
					debugger;
					alert("small gene final, do something");
					view.left = view.left - 2500;
					view.right = view.right - 2500;
					getMotifData_all_rank(d3.round(view.right/w) - 0.5);
					console.log("inside if");
				}
				else { 
					if((final_right <= view.left && final_left >= view.right)) {
						alert("small gene init, do something");
						view.left = view.left - 5000;
						view.right = view.right - 5000;
						getMotifData_all_rank(d3.round(view.right/w) - 1.0);
						console.log("inside if/else");
					}
				else{				
					console.log("inside else");
					getMotifData_all_rank(d3.round(view.right/w));
				}}	*/			
				//debugger;
				x.domain([view.left, view.right]);
				x2.domain([view.left, view.right]);
				old_names = new Array();
				old_names = [];
				del = new Array();
				del = [];
				old_names = mot_names;	
				//getMotifData_all_rank( ( ((2500 * d3.round(+res.split(",")[1]/w) + 5000))/w)  );
				
				getListSegmentsAll(view.left,  view.right,view.right/w);
				getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
				getExpressionData(view.left, view.right);				
				old_names.forEach(function(d) { 
				if(!mot_names.contains(d)){
					del.push(d);
					//console.log(del);
					var t = svg.select(".motifs_"+d).remove();
					delete(t);
				}
				;});
			cleanMemory(del);
			brush.clear();
			svg.select(".brush").call(brush);
			// updating the brush3 - genome
			brush3.extent([view.left,view.right]);
			svg2.select(".brush").call(brush3);
			left = view.left; right = view.right;
			focus.select(".x.axis").call(xAxis);
			context.select(".x.axis").call(xAxis2);
			redrawAll();
			}
			else {
				alert("There is no gene name like: " + textToQuery);
			}
		}	
	}


	// change position whenever user change bookmark selection:
	function changePositionBySelection(textToQuery){
	
		if(textToQuery != ""){
			//console.log("inside query - let's look for the gene name");
			var res = sessionStorage.getItem(textToQuery.toLowerCase());
			//console.log("Query result: " + res);
			if( res !== null) {
				
				// let's get some extra data and plot some extra info on whole genome space 
				view.left = +res.split(",")[0] ; //-1000
				view.right = +res.split(",")[1] ;//+1000
				
				final_right = +res.split(",")[1];
				final_left = +res.split(",")[0];

				//debugger;
				//view.right  = ((( ((2500 * d3.round(view.right/w) + 5000))/w) ) * w);
				//view.left = ((( ((2500 * d3.round(view.right/w) + 5000))/w))* w) - w;
				view.left = (d3.round(view.right/w) * 5000);
				view.right = ((d3.round(view.right/w) * 5000 ) + 5000);
				//debugger;
				
				
				if(	!(	final_left >= view.left && final_right <= view.right	)	){
					//console.log("gene not inside region");
					
					if(final_left >= view.left) {
						//debugger;
						//console.log("right is out, let's sum")
						view.left = view.left + 2500;
						view.right = view.right + 2500;
						getMotifData_all_rank(d3.round(view.right/w) + 0.5);
					}
					else{
						var temp_r = view.right;
						view.left = view.left - 2500;
						view.right = view.right - 2500;
						
						//debugger;
						if(	!(	final_left >= view.left	)		){
							//debugger;
							//console.log("left is out, let's dim")
							view.left = view.left - 2500;
							view.right = view.right - 2500;
							getMotifData_all_rank(d3.round(temp_r/w) - 1.0);						
						}
						else{
							//debugger;
							//console.log("left is out, let's substract")
							getMotifData_all_rank(d3.round(view.right/w) - 0.5);						}
					}
				}
				else{
					//console.log("gene is in between");
					getMotifData_all_rank(d3.round(view.right/w));
				}
				
				x.domain([view.left, view.right]);
				x2.domain([view.left, view.right]);
				old_names = new Array();
				old_names = [];
				del = new Array();
				del = [];
				old_names = mot_names;	
				//getMotifData_all_rank( ( ((2500 * d3.round(+res.split(",")[1]/w) + 5000))/w)  );
				
				getListSegmentsAll(view.left,  view.right,view.right/w);
				getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
				//getExpressionData(view.left, view.right);				
				old_names.forEach(function(d) { 
				if(!mot_names.contains(d)){
					del.push(d);
					//console.log(del);
					var t = svg.select(".motifs_"+d).remove();
					delete(t);
				}
				;});
			cleanMemory(del);
			brush.clear();
			svg.select(".brush").call(brush);
			// updating the brush3 - genome
			brush3.extent([view.left,view.right]);
			svg2.select(".brush").call(brush3);
			left = view.left; right = view.right;
			focus.select(".x.axis").call(xAxis);
			context.select(".x.axis").call(xAxis2);
			redrawAll();
			}
			else {
				alert("There is no gene name like: " + textToQuery);
			}
		}	
	}







	// if checkbox has changed
	function change() {
		console.log(this)
	//  if (this.value === "grouped") showSeqLogo();
	}

	function showSeqLogo(){
		console.log("showSeqLogo");
	}





	// draw whatever I need on the selection rect ("g") // this will be drawn on the botton space (where the brush is activated)
	/*  var genesMini = svg.selectAll("g")
	        	.data(genes.filter(function(d, i) { 
	        		return( d[2] <= view.right && d[3] >= view.left  );

	        		}))	
	    //		console.log(t)
	        	.enter()
	        	.append("rect")
	    	.attr("id", "mini")
	        	.attr('fill', function(d) {
	        		if(d[1]=='+') return '#eef000'; else return '#ddbb00';
	        	})
	        	.attr('y', function(d){ 
	        		if(d[1]=='+') return 430; else return 400	;
	        	})
	        	.attr("x", function(d,i) {
	        		return x2(d[2]);	
	        	})
	        	.attr("width", function(d,i) {
	        		return x2(d[3] - d[2]);	
	        	})
	        	.attr("height",22)
	        	.attr('stroke', 'rgba(0,0,0,0.5)'); */


	//var t =   d3.select("input[value=\"grouped\"]").property("checked", true).each(change);


	$(function() {
	  $( document ).tooltip({  track: true});

	});


 
	drawGenes();        
	drawGeneLabels();
	drawGenesFixContext();
	
	
	/*var exp_line = d3.svg.line()
	
	    	//.defined(function(d) { return d.y != null; })
	    	.x(function(d) { return x((d.start + d.end)/2); })
	    	.y(function(d) {return yExpression(d.value); });
		
    	function drawExpressionLine(){
		
		svg.selectAll(".exp_line")
		//old  .data(eval("max_"+d));
		.data(exp_expression1)
		//lll.exit().remove();	  
		.enter().append("g")
		      .attr("class", "exp_line")
		.append("path")
		.attr("class", "line")
		.attr("clip-path", "url(#clip)")
		//old  .attr("d", line(eval("max_"+d)[0].values))
		.attr("d", exp_line(exp_expression1) )

//		.style("stroke", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) ) //old   values[0].MOTIF_NAME
//		.style("fill", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) )
		.style("opacity", 0.5)
		
		
	
		
    	};drawExpressionLine();*/
	
	
	
	function drawCoremGenesAsPath(data, y){
		
		// need to draw it on my whole-genome location
		svg2.append('g').selectAll('CoremGenes')
			.data(transformCoremGenes(data, y))
			.enter().append('path')
			.attr("id", "CoremGenes")
			.attr("clip-path", "url(#clip)")
			.attr('class', function(d) { return 'test_ ' + d.class; })
			.attr('d', function(d) { return d.path; })
			.style("stroke", "blue" ) //old   values[0].MOTIF_NAME
			//.style("fill","red" )
			;
	};
	

	function drawExpressionAsPath(){
		focus.append('g').selectAll('miniItems')
			.data(transformExpression(exp_expression1))
			.enter().append('path')
			.attr("id", "test")
			.attr("clip-path", "url(#clip)")
			.attr('class', function(d) { return 'test_ ' + d.class; })
			.attr('d', function(d) { return d.path; })
			.style("stroke", "blue" ) //old   values[0].MOTIF_NAME
			//.style("fill","red" )
			;
	};drawExpressionAsPath();
	
	function redrawExpressionAsPath(){
//		svg.selectAll('#test').remove();
		var exp_path = focus.selectAll('#test')
			.data(transformExpression(exp_expression1));
			
			exp_path.enter().append('path');
			exp_path.exit().remove();
			exp_path
			.attr("id", "test")
			.attr("clip-path", "url(#clip)")
			.attr('class', function(d) { return 'test_ ' + d.class; })
			.attr('d', function(d) { return d.path; })
			.style("stroke", "blue" ) //old   values[0].MOTIF_NAME
			//.style("fill","red" )
			;
	};



	function tabulate(data, columns) {
	    var table = d3.select("#container").append("table").attr("id", "table"),
	        thead = table.append("thead"),
	        tbody = table.append("tbody");

	    // append the header row
	    thead.append("tr")
	        .selectAll("th")
	        .data(columns)
	        .enter()
	        .append("th")
	            .text(function(column) { return column; });

	    // create a row for each object in the data
	    var rows = tbody.selectAll("tr")
	        .data(data)
	        .enter()
	        .append("tr");

	    // create a cell in each row for each column
	    var cells = rows.selectAll("td")
	        .data(function(row) { 
	            return columns.map(function(column) { 
	                return {column: column, value: row[column]};
	            });
	        })
	        .enter()
	        .append("td")
	            .text(function(d) { return d.value; });
    
	    return table;
	}
	
	function tabulateGeneInfo(data, columns) {

	    var table = d3.select("#container-gene").append("table").attr("id", "table-gene-info"),
	        thead = table.append("thead"),
	        tbody = table.append("tbody");

	    // append the header row
	    thead.append("tr")
	        .selectAll("th")
	        .data(columns)
	        .enter()
	        .append("th")
	            .text(function(column) { return column; });

		   
	    // create a row for each object in the data
	    var rows = tbody.selectAll("tr")
	        .data(data)
	        .enter()
	        .append("tr");

	    // create a cell in each row for each column
	    var cells = rows.selectAll("td")
	        .data(function(row) {
	            return columns.map(function(column) { 
	                return {column: column, value: row[column]};
	            });
	})
	        .enter()
	        .append("td")
	            .text(function(d) {return d.value; });

	    return table;
	}

	/*function drawExpressionData(){
		
    		svg.selectAll("#exp")
    		.data(exp_expression1)
    		.enter()
    		.append("line")
    		//.attr("class", "node")
    	//	.attr("transform", "translate(" + margin.left + "," + 0 + ")")
    	//	.attr("class", "tooltip")
    		//.attr("class", "tooltip")
    		.attr("id", "exp")
    		.attr("clip-path", "url(#clip)") // magic
    		// x1 x2 y1 y2
    	    	.attr('x1', function(d) { return x(d.start)})
    	    	.attr('x2', function(d) { return x(d.end)})		
    		.attr('y1', function(d) { 
    	    		if(d.strand =='+') return yExpression(d.value)  ; else return yExpression(d.value) +60 ;
    	    	})
    		.attr('y2', function(d) { 
    	    		if(d.strand =='+') return yExpression(d.value) ; else return yExpression(d.value) + 60;
    	    	})
    		.style('stroke', function(d) { 
    	    		if(d.strand =='+') return "blue" ; else return "red";
    	    	})
		
		
		
		
    	}//end-of drawExpressionData()
    	//drawExpressionData(); */
	
		/*
    	function redrawExpressionData(){
		console.log("************** inside ExpressionData");
		
		//svg.selectAll("#exp").remove();
    		var e_ = svg.selectAll("#exp")
    		.data(exp_expression1.filter(function(q) { return (q.start <= view.right && q.end >= view.left);}));
		
		
    		e_.enter().append("line");
		e_.exit().remove();
		e_
    		//.attr("class", "node")
    	//	.attr("transform", "translate(" + margin.left + "," + 0 + ")")
    	//	.attr("class", "tooltip")
    		//.attr("class", "tooltip")
    		.attr("id", "exp")
    		.attr("clip-path", "url(#clip)") // magic
    		// x1 x2 y1 y2
    	    	.attr('x1', function(d) { return x(d.start)})
    	    	.attr('x2', function(d) { return x(d.end)})		
    		.attr('y1', function(d) { 
    	    		if(d.strand =='+') return yExpression(d.value)  ; else return yExpression(d.value) +60 ;
    	    	})
    		.attr('y2', function(d) { 
    	    		if(d.strand =='+') return yExpression(d.value) ; else return yExpression(d.value) + 60;
    	    	})
    		.style('stroke', function(d) { 
    	    		if(d.strand =='+') return "blue" ; else return "red";
    	    	})
    		

    	}//end-of drawExpressionData()
	
*/




init();