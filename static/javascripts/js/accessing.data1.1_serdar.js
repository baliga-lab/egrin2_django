

//var url_ = "http://theflash2.systemsbiology.net:";
var url_ = "http://localhost:";

var groupMotifByPosition = d3.nest().key(function(d) { return d.POSITION; });
var groupMotifByName = d3.nest().key(function(d) { return d.MOTIF_NAME; });
var groupExpressionByName = d3.nest().key(function(d) { return d.name; });
var groupSegmentByName = d3.nest().key(function(d) { return d.motif_name; });
var groupCoremGenesByCorem = d3.nest().key(function(d) { return d.corem; });


//http://theflash2.systemsbiology.net:8888/WS2/services/GetCoremGenes/getCoremGenes?gene='B0029'

var coremPop = Array();
var coremPop2 = Array();
function CoremGenePopulate(gene, start, end) {
        this.gene = gene;
        this.start = start;
    	this.end = end;
};


function getCoremGenes(name){
$.ajax( {
	    type:'Get',

	    url: url_ + '8888/WS2/services/GetCoremGenes/getCoremGenes?' + 		
	    "gene='"  + name + "'"
	    ,
	    success:function(xml) {
		    var ret = xml.firstChild.textContent;
		    var r = JSON.parse(ret);
		    var temp = r["CoremGenes"];
		    
		    window["group_temp"] = groupCoremGenesByCorem.entries(r["CoremGenes"]);
		    
		    d3.selectAll("#table").remove();
		    //debugger;
		    group_temp.forEach(function(d,i) {
			    tabulate(group_temp[i].values, ["corem", "gene"]);
		    	    
		    });
		    
		    //debugger;
		    //console.log(temp.length);
		    coremPop = [];
		    
		    
		    temp.forEach(function(d) { 
		    // now I need to get all genes returned and map it
		    //sessionStorage.getItem("b0002")
		    //debugger;

		    coremPop.push(new CoremGenePopulate(d.gene,+sessionStorage.getItem(d.gene).split(",")[0], +sessionStorage.getItem(d.gene).split(",")[1] ) );
		    bookmark_data.push(new BookmarkDTOObj(d.gene, 'chr', d3.round(+sessionStorage.getItem(d.gene).split(",")[0]), d3.round(+sessionStorage.getItem(d.gene).split(",")[1]), 'strand', 'sequence', 'annotation')); 		
		    
		    bookmark_renderer();
		    
		    });
		    svg2.selectAll('#CoremGenes').remove();
		    

		    
		    group_temp.forEach(function(d,i) {
			    
			    coremPop2 = [];
			    d.values.forEach(function(q) {
				    coremPop2.push(new CoremGenePopulate(q.gene,+sessionStorage.getItem(q.gene).split(",")[0], +sessionStorage.getItem(q.gene).split(",")[1] ) );
			    });
			    drawCoremGenesAsPath(coremPop2, i+20);
			    
			    		    

		    	   // drawCoremGenesAsPath(d.values, i);
		    });
		    
		   /* group_temp.forEach(function(d,i) {
			    debugger;
		    	drawCoremGenesAsPath(d.values, i);
		    }); */
		    
		    //drawCoremGenesAsPath();
		    
	    },always:function(){
	    //delete(window[motifName]);
	    },
	    error: function(e, xhr){
	        console.log("error: " + e); debugger
	      },
	     async:false,
	    	    dataType:"xml",
	    });


    };

function getExpressionData(start, end){
$.ajax( {
	    type:'Get',

	    url: url_ + '8888/WS2/services/GetExpressionData/getExpressionData?' + 		
	    "start="  + start +
	    //"&strand=" + encodeURIComponent('-') +
	    "&end=" + end,
	    //debugger
//	    console.log(url)
	    success:function(xml) {
		    var ret = xml.firstChild.textContent;
		    var r = JSON.parse(ret);
		    window["expression"] = groupExpressionByName.entries(r["Expression"]);
		    
		    expression.forEach(function(d)  {;
			    window["exp_"+d.key] = d.values; 
		    });
			
			/*motif_all.forEach(function(d) {
			window["p_"+d.key] = new Array();
			window["m_"+ d.key] = groupMotifByPosition.entries(d.values);
			
			eval("m_"+ d.key).forEach(function(q)  {
				
				
				//console.log(q.key);
				//console.log(d3.max(q.values.map(function(w) {return (w.BITS);})));
				eval("p_"+d.key).push(new Populate(d.key, +q.key, d3.max(q.values.map(function(w) {return (w.BITS);}))));
			;})
			window["pp_"+d.key] = groupMotifMaxByName.entries(eval("p_"+ d.key));
			delete(window["p_"+d.key]);
			
		;}) */
	    },always:function(){
	    //delete(window[motifName]);
	    },
	    error: function(e, xhr){
	        console.log("error: " + e); debugger
	      },
	     async:false,
	    	    dataType:"xml",
	    });


    };




function getSequenceData(id ){
$.ajax( {
	    type:'Get',

	    url: url_ + '8888/WS2/services/GetSequenceData/getSequenceData?' + 		
	    "id="  + id,
	    //debugger
//	    console.log(url)
	    success:function(xml) {
		    

		    
			var ret = $(xml).find('return').first().text();
			//console.log(xml);
			//console.log(ret);
			
			var temp = JSON.parse(ret);
			window["genomeInfo"] = temp["Sequence"][0];
			window["genomeInfo"].left = left;
			window["genomeInfo"].right = right;			
			//window["g"] = ret;
			
			
	    },
	    error: function(e, xhr){
	        console.log("error: " + e); debugger
	      },
	     async:false,
	    	    dataType:"xml",
	    });


    }


   /* function getSequenceData(id ){
    $.ajax( {
    	    type:'Get',

    	    url: url_ + '8888/WS2/services/GetSequenceData/getSequenceData?' + 		
    	    "id="  + id,
    	    //debugger
    //	    console.log(url)
    	    success:function(xml) {
		    
    			//var ret = $(xml).find('return').first().text();
    			var ret = xml.firstChild.textContent;
			//console.log(xml);
    			//console.log(ret);
    			var temp = JSON.parse(ret);
    			window["genomeInfo"] = temp["Sequence"][0];
    			window["genomeInfo"].left = left;
    			window["genomeInfo"].right = right;			
    			//window["g"] = ret;
			
			
    	    },
    	    error: function(e, xhr){
    	        console.log("error: " + e); debugger
    	      },
    	     async:false,
    	    	    dataType:"xml",
    	    });


        }*/

           function getSequenceAnnotationDataLocal(id, start, end, type){
           $.ajax( {
           	    type:'Get',

           	    url: url_ + '8888/WS2/services/GetSequenceAnnotationData/getSequenceAnnotationData?' + 		
           	    "sequence_id="  + id +
   		    "&start=" + start +
   		    "&end=" + end +
   		    "&type=" + "'" + type + "'",
           	    //debugger
           //	    console.log(url)
           	    success:function(xml) {
			    
   			    /*
   			    sessionStorage["ab"] = ['nameXXX', '20220', '28000']
   			    */
		    
           			//var ret = $(xml).find('return').first().text();
           			var ret = xml.firstChild.textContent;
   				//console.log(xml);
           			//console.log(ret);
			
           			var temp = JSON.parse(ret);
				//debugger;
				window["g"] = temp["SequenceAnnotation"].filter(function(d) { if(d.start <= right && d.end >= left) {return d}; });
           			//window["genomeInfo"] = temp["Sequence"][0];
           			//window["genomeInfo"].left = left;
           			//window["genomeInfo"].right = right;			
           			//window["g"] = temp;
				//debugger;
				sessionStorage.clear();
				
				
				
				temp["SequenceAnnotation"].forEach(function(d){
				//debugger;	
					sessionStorage[(d.attributes.split(";")[1].split("=")[1]).toLowerCase()] = [d.start, d.end];
					sessionStorage[d.attributes.split("locus_tag=")[1].toLowerCase()] = [d.start, d.end];
					//sessionStorage["ab"] = ['nameXXX', '20220', '28000']
				});

				delete(temp);
				delete(ret);
			
           	    },
           	    error: function(e, xhr){
           	        console.log("error: " + e); debugger
           	      },
           	     async:false,
           	    	    dataType:"xml",
           	    });


               }
        function getSequenceAnnotationData(id, start, end, type){
        $.ajax( {
        	    type:'Get',

        	    url: url_ + '8888/WS2/services/GetSequenceAnnotationData/getSequenceAnnotationData?' + 		
        	    "sequence_id="  + id +
		    "&start=" + start +
		    "&end=" + end +
		    "&type=" + "'" + type + "'",
        	    //debugger
        //	    console.log(url)
        	    success:function(xml) {
			    
			    /*
			    sessionStorage["ab"] = ['nameXXX', '20220', '28000']
			    */
		    
        			//var ret = $(xml).find('return').first().text();
        			var ret = xml.firstChild.textContent;
				//console.log(xml);
        			//console.log(ret);
				debugger;
        			var temp = JSON.parse(ret);
        			//window["genomeInfo"] = temp["Sequence"][0];
        			//window["genomeInfo"].left = left;
        			//window["genomeInfo"].right = right;			
        			window["g"] = temp["SequenceAnnotation"];
			
			
        	    },
        	    error: function(e, xhr){
        	        console.log("error: " + e); debugger
        	      },
        	     async:false,
        	    	    dataType:"xml",
        	    });


            }
	    
            function getOverlapMotifsGenes(motif_name, type, sequence_id, size){
            $.ajax( {
            	    type:'Get',

            	    url: url_ + '8888/WS2/services/GetOverlapMotifsAndGenes/getOverlapMotifsGenes?' + 		
            	    "motif_name="  +  "'" + motif_name + "'" +
    		    "&type=" + "'" + type + "'" +
    		    "&sequence_id=" + sequence_id +
		    "&size=" + size,
            	    //debugger
            //	    console.log(url)
            	    success:function(xml) {
		    
            			//var ret = $(xml).find('return').first().text();
            			var ret = xml.firstChild.textContent;
    				//console.log(xml);
            			//console.log(ret);
			
            			var temp = JSON.parse(ret);
            			//window["genomeInfo"] = temp["Sequence"][0];
            			//window["genomeInfo"].left = left;
            			//window["genomeInfo"].right = right;			
            			window["overlap_" + motif_name] = temp;
			
			
            	    },
            	    error: function(e, xhr){
            	        console.log("error: " + e); debugger
            	      },
            	     async:false,
            	    	    dataType:"xml",
            	    });


                }	
		
		
                function getListSegments(motif_name){
                $.ajax( {
                	    type:'Get',

                	    url: url_ + '8888/WS2/services/GetOverlapMotifsAndGenes/getSegmentList?' + 		
                	    "motif_name="  +  "'" + motif_name + "'",
                	    //debugger
                //	    console.log(url)
                	    success:function(xml) {
		    
                			//var ret = $(xml).find('return').first().text();
                			var ret = xml.firstChild.textContent;
        				//console.log(xml);
                			//console.log(ret);
			
                			var temp = JSON.parse(ret);
                			//window["genomeInfo"] = temp["Sequence"][0];
                			//window["genomeInfo"].left = left;
                			//window["genomeInfo"].right = right;			
                			window["segment_" + motif_name] = temp;
			
			
                	    },
                	    error: function(e, xhr){
                	        console.log("error: " + e); debugger
                	      },
                	     async:false,
                	    	    dataType:"xml",
                	    });


                    }
		    
		    //(2.5*w)-(w)
                    function getListSegmentsAll(start, end, rank){
                    $.ajax( {
                    	    type:'Get',

                    	    url: url_ + '8888/WS2/services/GetOverlapMotifsAndGenes/getSegmentListAll?' + 
			    "&start=" + start +
			    "&end=" + end +
			    "&rank=" + rank
			    ,
                    	    //debugger
                    //	    console.log(url)
                    	    success:function(xml) {
		    
				    //debugger;
                    			//var ret = $(xml).find('return').first().text();
                    			var ret = xml.firstChild.textContent;
            				//console.log(xml);
                    			//console.log(ret);
			
                    			var temp = JSON.parse(ret);
                    			//window["genomeInfo"] = temp["Sequence"][0];
                    			//window["genomeInfo"].left = left;
                    			//window["genomeInfo"].right = right;	
							
                    			window["segment_"] = groupSegmentByName.entries(temp["MotifSegment"]);//temp;
					//debugger;
					segment_.forEach(function(d) {
						//console.log(d.key);
						window["segment_"+d.key] = d.values;
					})
					//debugger;
			
			
                    	    },
                    	    error: function(e, xhr){
                    	        console.log("error: " + e); debugger
                    	      },
                    	     async:false,
                    	    	    dataType:"xml",
                    	    });


                        }  		        


    function createDatabase(url){ //type = {gene, CDS}
    $.ajax( {
    	    type:'Get',

    	    url: url_ + '8888/WS2/services/CreateDatabase/createDatabaseByURL?' + 		
    	    "url="  + url,
    	    //debugger
    //	    console.log(url)
    	    success:function(xml) {
		    
    		//	var ret = $(xml).find('return').first().text(); //don't work on firefox
			var ret = xml.firstChild.textContent;
			//parseInt(xml.firstChild.textContent.split(':')[1].trim())
    			//console.log(xml);
			//debugger;
    			alert(ret + "\n Now I'll redirect you for your data visualization");
			//debugger;
			window["id"] = parseInt(ret.split(":")[1].trim());
			
			function SetCookie(cookieName,cookieValue,nDays) {

			 var today = new Date();

			 var expire = new Date();

			 if (nDays==null || nDays==0) nDays=1;

			 expire.setTime(today.getTime() + 3600000*24*nDays);

			 document.cookie = cookieName+"="+escape(cookieValue)

			                 + ";expires="+expire.toGMTString();

			}
			
			SetCookie('id', id ,1);

			top.parm_value=id;

			top.name=id;

			self.location='index.html?'+escape(id);
			 
			
			//window.open("focusAndContext5_1.1.serdar.html");
    			//window["g"] = JSON.parse(ret);
    			//window["g"] = ret;
    	    },
    	    error: function(e, xhr){
    	        console.log("error: " + e); debugger
    	      },
    	     async:false,
    	    	    dataType:"xml",
    	    });


        }




function getData(chr, start, end){
$.ajax( {
	    type:'Get',

	    url: url_ + '8888/WS2/services/Ws/getAllStrandsByPosition?' + 		
	    "chr="  + chr +
	    //"&strand=" + encodeURIComponent('-') +
	    "&start=" + start +
	    "&end=" + end,
	    //debugger
//	    console.log(url)
	    success:function(xml) {
		    
			var ret = $(xml).find('return').first().text();
			//console.log(xml);
			//console.log(ret);
			
			window["g"] = JSON.parse(ret);
			//window["g"] = ret;
	    },
	    error: function(e, xhr){
	        console.log("error: " + e); debugger
	      },
	     async:false,
	    	    dataType:"xml",
	    });


    }

//var mot_max = new Array();


//
// // motif_all.forEach(function(d) {  console.log(d3.max(d.values.map(function(e) {  return (e.BITS)           ;})  ) )      ;}) 
//


function getMotifData(start, end, motifName){
$.ajax( {
	    type:'Get',

	    url: url_ + '8888/WS2/services/Ws/getAllMotifsByPosition?' + 		
	    "start="  + start +
	    //"&strand=" + encodeURIComponent('-') +
	    "&end=" + end +
	    "&motifName=" + "'" + motifName + "'",
	    //debugger
//	    console.log(url)
	    success:function(xml) {
	    
			//var ret = $(xml).find('return').first().text();
			var ret = xml.firstChild.textContent;
			//console.log(xml);
			//console.log(var ret);
		
		var r = JSON.parse(ret);
		//mot_max.push(d3.max($.map(r["motif"], function(e) {return (e.BITS);})));
		//mot_names.push(groupMotifByPosition.entries(r["motif"])[0].values[0].MOTIF_NAME);
		window[motifName] = groupMotifByPosition.entries(r["motif"]);
			//window["g"] = ret;
	    },always:function(){
	    delete(window[motifName]);
	    },
	    error: function(e, xhr){
	        console.log("error: " + e); debugger
	      },
	     async:false,
	    	    dataType:"xml",
	    });


    };
    
    
    //var mot_max_ = new Array();
    var n_ = new Array();
    var mot_names = new Array();
    var max_local = new Array();
        
  /*  var max_t = {
       NAME: null,
       POSITION: null,
       MAX: null
    } */
    
    function Populate(MOTIF_NAME, START, MAX) {
            this.MOTIF_NAME = MOTIF_NAME;
            this.START = START;
	    this.MAX = MAX;
    };
    
	var max_temp = new Array();
	
    function getMotifData_all(start, end){
    $.ajax( {
    	    type:'Get',

    	    url: url_ + '8888/WS2/services/Ws/getAllMotifsByPosition_all?' + 		
    	    "start="  + start +
    	    //"&strand=" + encodeURIComponent('-') +
    	    "&end=" + end,
    	    //debugger
    //	    console.log(url)

	    success:function(xml) {
		    	
    			//var ret = $(xml).find('return').first().text();
    			var ret = xml.firstChild.textContent;
    			//console.log(xml);
    			//console.log(var ret);
		
    		var r = JSON.parse(ret);
		//var t__ = crossfilter(r["motif_all"]);
		//var t_ = t__.dimension(function(d) { return d.POSITION; });
		//debugger;
    		//mot_max.push(d3.max($.map(r["motif"], function(e) {return (e.BITS);})));
    		
		//mot_names.push(groupMotifByPosition.entries(r["motif"])[0].values[0].MOTIF_NAME);
//    		window["mot_names"] = '';
//		window["motif_all"] = null;
		window["motif_all"] = groupMotifByName.entries(r["motif_all"]);
		
		//console.log("names : " + mot_names);	
		mot_names = [];
		n_ = [];
		//console.log("names : " + mot_names);
		motif_all.forEach(function(e) {
			n_.push(e.key);
		});
		mot_names = n_;
		
		
		
		// Let's filter all max per position (and per motif name), then I'll be able to draw line/area chart
			//groupMotifByPosition.entries(tt.values)
			
			
			motif_all.forEach(function(d) {
				window["p_"+d.key] = new Array();
				window["m_"+ d.key] = groupMotifByPosition.entries(d.values);
				
				eval("m_"+ d.key).forEach(function(q)  {
					
					
					max_temp.push(d3.max(q.values.map(function(w) {return (w.BITS);})));
					
					
					//console.log(q.key);
					//console.log(d3.max(q.values.map(function(w) {return (w.BITS);})));
					eval("p_"+d.key).push(new Populate(d.key, +q.key, d3.max(q.values.map(function(w) {return (w.BITS);}))));
				;})
				window["pp_"+d.key] = groupMotifMaxByName.entries(eval("p_"+ d.key));
				delete(window["p_"+d.key]);
				
				
			;}) 
			max_local.push(d3.max(max_temp));
			//max_temp = [];
			delete(motif_all); //memory 
    			//window["g"] = ret;
    	    },always:function(){
    	    delete(window[motifName]);
    	    },
    	    error: function(e, xhr){
    	        console.log("error: " + e); debugger
    	      },
    	     async:false,
    	    	    dataType:"xml",
    	    });
        };
        function getMotifData_all_rank(id_rank){
        $.ajax( {
        	    type:'Get',

        	    url: url_ + '8888/WS2/services/Ws/getAllMotifsByPosition_all_rank?' + 		
        	    "id_rank="  + id_rank,
        	    //debugger
        //	    console.log(url)

    	    success:function(xml) {
		    
		    max_local = [];
		    	
        			//var ret = $(xml).find('return').first().text();
        			var ret = xml.firstChild.textContent;
        			//console.log(xml);
        			//console.log(var ret);
		
        		var r = JSON.parse(ret);
    		//var t__ = crossfilter(r["motif_all"]);
    		//var t_ = t__.dimension(function(d) { return d.POSITION; });
    		//debugger;
        		//mot_max.push(d3.max($.map(r["motif"], function(e) {return (e.BITS);})));
    		
    		//mot_names.push(groupMotifByPosition.entries(r["motif"])[0].values[0].MOTIF_NAME);
    //    		window["mot_names"] = '';
    //		window["motif_all"] = null;
    		window["motif_all"] = groupMotifByName.entries(r["motif_all"]);
		
    		//console.log("names : " + mot_names);	
    		mot_names = [];
    		n_ = [];
    		//console.log("names : " + mot_names);
		//debugger;
    		motif_all.forEach(function(e) {
    			n_.push(e.key);
    		});
    		mot_names = n_;
		max_temp = [];
    		//var max_temp = new Array();
		
		
    		// Let's filter all max per position (and per motif name), then I'll be able to draw line/area chart
    			//groupMotifByPosition.entries(tt.values)
			
			
    			motif_all.forEach(function(d) {
    				window["p_"+d.key] = new Array();
    				window["m_"+ d.key] = groupMotifByPosition.entries(d.values);
				
    				eval("m_"+ d.key).forEach(function(q)  {
					
					
    					max_temp.push(d3.max(q.values.map(function(w) {return (w.BITS);})));
					
					
    					//console.log(q.key);
    					//console.log(d3.max(q.values.map(function(w) {return (w.BITS);})));
    					eval("p_"+d.key).push(new Populate(d.key, +q.key, d3.max(q.values.map(function(w) {return (w.BITS);}))));
    				;})
    				window["pp_"+d.key] = groupMotifMaxByName.entries(eval("p_"+ d.key));
    				delete(window["p_"+d.key]);
				
				
    			;}) 
    			max_local.push(d3.max(max_temp));
    			//max_temp = [];
    			delete(motif_all); //memory 
        			//window["g"] = ret;
        	    },always:function(){
        	    delete(window[motifName]);
        	    },
        	    error: function(e, xhr){
        	        console.log("error: " + e); debugger
        	      },
        	     async:false,
        	    	    dataType:"xml",
        	    });
            };	
    
//var mot_names = new Array();
function getMotifNames(start, end){
$.ajax( {
    	    type:'Get',

    	    url: url_ +'8888/WS2/services/Ws/getAllMotifsNameByPosition?' + 		
    	    "start="  + start +
    	    //"&strand=" + encodeURIComponent('-') +
    	    "&end=" + end,
    	    success:function(xml) {
	    
    			//var ret = $(xml).find('return').first().text();
    			var ret = xml.firstChild.textContent;
			//console.log(xml);
    			//console.log(var ret);
		
    		var r = JSON.parse(ret);
    		mot_names = [];
    		r["names"].forEach(function(d){mot_names.push(d.MOTIF_NAME);})
		
		
    		//debugger;
    		//window[motifName] = groupMotifByPosition.entries(r["motif"]);
    			//window["g"] = ret;
    	    },
    	    error: function(e, xhr){
    	        console.log("error: " + e); debugger
    	      },
    	     async:false,
    	    	    dataType:"xml",
    	    });


};


var groupMotifMaxByName = d3.nest().key(function(d) { return d.MOTIF_NAME; });
function getMotifMax(start, end, motifName){
$.ajax( {
    	    type:'Get',

    	    url: url_ + '8888/WS2/services/Ws/getAllMotifsMaxByPositionOptimizingZeros?' + //getAllMotifsMaxByPosition		
    	    "start="  + start +
    	    //"&strand=" + encodeURIComponent('-') +
    	    "&end=" + end + 
	    "&name=" + "'"  + motifName + "'" ,
    	    success:function(xml) {
	    
		//var ret = $(xml).find('return').first().text();
    		var ret = xml.firstChild.textContent;
		var r = JSON.parse(ret);
//		debugger;
    		window["max_" + motifName] = groupMotifMaxByName.entries(r["motif_max"]);
    	    },
    	    error: function(e, xhr){
    	        console.log("error: " + e); debugger
    	      },
    	     async:false,
    	    	    dataType:"xml",
    	    });
};


//MOT_10.forEach(function(m) { m.values.forEach(function(i) { d3.max(i.BITS)  }   )
//;})
    