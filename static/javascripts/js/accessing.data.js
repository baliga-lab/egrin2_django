

var url_ = "http://theflash2.systemsbiology.net:";
//var url_ = "http://localhost:";

var groupMotifByPosition = d3.nest().key(function(d) { return d.POSITION; });
var groupMotifByName = d3.nest().key(function(d) { return d.MOTIF_NAME; });

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

var mot_max = new Array();
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
	    
			var ret = $(xml).find('return').first().text();
			//console.log(xml);
			//console.log(var ret);
		
		var r = JSON.parse(ret);
		mot_max.push(d3.max($.map(r["motif"], function(e) {return (e.BITS);})));
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
    
var mot_names = new Array();
function getMotifNames(start, end){
$.ajax( {
    	    type:'Get',

    	    url: url_ +'8888/WS2/services/Ws/getAllMotifsNameByPosition?' + 		
    	    "start="  + start +
    	    //"&strand=" + encodeURIComponent('-') +
    	    "&end=" + end,
    	    success:function(xml) {
	    
    			var ret = $(xml).find('return').first().text();
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

    	    url: url_ + '8888/WS2/services/Ws/getAllMotifsMaxByPosition?' + 		
    	    "start="  + start +
    	    //"&strand=" + encodeURIComponent('-') +
    	    "&end=" + end + 
	    "&name=" + "'"  + motifName + "'" ,
    	    success:function(xml) {
	    
		var ret = $(xml).find('return').first().text();
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
    