

//style="background-color:white;width:950px"  
    //#F9F9FF --> table-content-backgroung color      
          
//jQuery('#displayStatus').prepend('<img id="loading" src="/static/images/ajax-loader.gif" />');
//jQuery('#displayStatus').html('Loading');





//
var line = d3.svg.area()
      //.defined(function(d) { return d.MAX > 0; })
      //.defined(function(d) { return d.START != null; })
      //.interpolate("basis")
      .x(function(d) { return x(d.START); })
      .y(function(d) {return yLine(d.MAX) ; })
  //.y0(390)
  //.y1(function(d) {return yLine(d.MAX) ; })
  //.attr("transform", "translate(0," + 250 + ")")
  ;

var genomeInfo = JSON.parse('{"id":189,"start":1,"name":"","type":"genes","end":202301,"left":0,"right":5000}');

 
  var margin = {top: 10, right: 30, bottom: 10, left: 40},
      margin2 = {top: 340, right: 30, bottom: 20, left: 40},
      margin3 = {top: 470, right: 30, bottom: 20, left: 40},
      width = 720 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom,
      height2 = 600 - margin2.top - margin2.bottom;

    
      height3 = 50;    
    
      var svg = d3.select("#ggbrowser-principal").append("svg")//#principal
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        ;

    
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
       
      .append("rect")
      //.attr("id", "rectClip")
        .attr("width", width-15)
        .attr("height", height)
        ;
        

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



  d3.select(".hand_cursor").style('border-style','dashed').style('border-color','grey');

  // Ajax Stuff - retrieving data from my ws
  //var id = 1;
  var view = {};
  var w = right - left
  //view.left = parseInt(d3.selectAll("#gene_start")[0][0].innerHTML) - 1500;
  //view.right = parseInt(d3.selectAll("#gene_end")[0][0].innerHTML) + 1500;

var start__ = (parseInt(d3.selectAll("#gene_start")[0][0].innerHTML)) 
var end__ =  (parseInt(d3.selectAll("#gene_end")[0][0].innerHTML) ) 


              // read already populated info and use it to instanciate start/end fields
              if((start__ - 1500) < 0) {
                view.left = 1;
                view.right = end__;
                var left = 1;
                var right = end__;
              }
              else{
                    if( start__ < end__){
                        view.left = start__ - 1500;
                        view.right = end__ + 1500;
                        var left = start__ - 1500;
                        var right = end__ + 1500;
                      }
                      else { // means it's - strand
                            view.left = end__ - 1500;
                            view.right = start__ + 1500;
                            var left = end__ - 1500;
                            var right = start__ + 1500;
                      }
              } 


  var color = d3.scale.category20().domain(mot_names); //category10() //.range(["black","red","#00cd00","blue","cyan","magenta","yellow","gray" ])

  //var mot_names = ["MOT_1", "MOT_3", "MOT_4", "MOT_5", "MOT_10", "MOT_12", "MOT_16", "MOT_18", "MOT_30"];
  //drawCheckBoxAndGetMotData();
  //color for motif line and checkBox

var url_ = url_gene + ncbi_taxonomy + "/";//{% url 'genes' %}{{ s.ncbi_taxonomy_id }}/"; // capturing url patern to make gene clickable 

 




  function drawButton(data, div){
  
  //just in case I need to redraw buttons, let's remove if it exists
  d3.selectAll("input[name=bt]").remove()


  //debugger;
  var box = d3.select("#" + div).selectAll("input")
  .data(data.sort());
  box.enter()
  //.append("div").attr("id", "try_close").attr("class", "fake-lightbox")
  //.append("span").attr("class","close-btn-18").attr("title", "Close").attr("width", "100px")
  //.text("Close")
  .append("input").attr("class", "btGGB")
  //.each(function(a){   
  .attr("id", function(d){return d})
  .attr("type","button")
  .attr("name", "bt")
  .attr("value", function (d){return d;} )
  .style("display","inline-block")
  .style("position", "relative")
  //.style("width","100px")
  .on("click", function(d){
    if(d == "Default"){
      cyclingLegend(d)
      //if(cycling_global){cycling_global=false}else{cycling_global=true}
      window["cycling_global"]=false
      stopAnimation()
      d3.selectAll("input[class=btGGB]").attr("class", "btGGB");return resetLineChartData()
    } else{
      cyclingLegend(d)
      //if(cycling_global){cycling_global=false}else{cycling_global=true}
      window["cycling_global"]=false
      stopAnimation()  
     d3.selectAll("input[class=btGGB]").attr("class", "btGGB"); return animateCorem(d)
    }
    })
    box.append("input").attr("type","button").attr("class", "button1").attr("value", "Button 1")
  //.style("width","100px")
  //})
  

  //var buttonClicked = d3.selectAll("input[name=bt]").on("click", animateCorem("a"));

  }




  function drawBoxes(data, div, uncheckName){
    

    //debugger;
  var box = d3.select("#" + div).selectAll("label").data(data);

  box.enter().append('label')
   //.style("display", "inline-block")
      //.style("float", "left")
      //.style("padding-right", "10px")
      //.style("white-space", "nowrap")
      //.style("vertical-align", "middle")
      //.style("margin-right","100px")
      //.attr("class", "checkboxes")
      .attr('for',function(d,i){ return d ; })
      //.attr('color', "#ffff00")
      .text(function(d) { return d; })
      .style("color", function(d) { return color(d); } );
  //box.exit().remove();
  box
    //display: block;
    //float: left;
    //padding-right: 10px;
    //white-space: nowrap;
     
      //.style( "text-anchor", "left" )
      //.style( "font", "corrier")
      //.style( "font-size", "12px")
      
      //.style("width", "5em")
      /*
   label {
     display: inline-block;
     width: 5em;
   }
      */
  .append("input")
      .attr("class", "checkboxes")
      .attr("id", "box_selected")
      .attr("name", "boxes")
      //.attr("class", "squaredThree")
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
      //.stye("height", "100%")
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


  var genetrack = {plus:300, minus:300, height:18};
  /*{plus:20, minus:60};//*/
  
  
  
  Array.prototype.contains = function(obj) {
      var i = this.length;
      while (i--) {
          if (this[i] === obj) {
              return true;
          }
      }
      return false;
  }



  function changePosition(text){
    
  getNameWithoutUnchecked().forEach(function(d) {
    svg.selectAll("#" + d).remove();
  
  } );  
  
    if(text == "plus" && genomeInfo.end >= view.right){
    
      view.left = left + 1500;
      view.right = right + 1500;
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
      //getMotifData_all_rank(view.right/w);
      
      
      //getListSegmentsAll(view.left,  view.right,view.right/w);
      //getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
      /*mot_names.forEach(function(d){
        //getOverlapMotifsGenes(d, "gene", id);
        getListSegments(d);
      });*/
      //getExpressionData(view.left, view.right);
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
      //brush3.extent([view.left,view.right]);
      //svg2.select(".brush").call(brush3);
      left = view.left; right = view.right;
    
      focus.select(".x.axis").call(xAxis);
      context.select(".x.axis").call(xAxis2);




    }
    if(text == "minus" && genomeInfo.start < view.left){
      view.left = left - 1500;
      view.right = right - 1500;
      
      /*mot_names.forEach(function(d) {
      
        svg.select(".motifs_"+d).remove();
      
      }); */
        
        old_names = new Array();
        old_names = [];
        del = new Array();
        del = [];
      
      
        old_names = mot_names;  
        
        //getMotifData_all(view.left, view.right);
        //getMotifData_all_rank(view.right/w);
        
        //getListSegmentsAll(view.left,  view.right,view.right/w);
        //getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
        /*mot_names.forEach(function(d){
          //getOverlapMotifsGenes(d, "gene", id);
          getListSegments(d);
        }); */
        //getExpressionData(view.left, view.right);     
        old_names.forEach(function(d) { 
          if(!mot_names.contains(d)){
            del.push(d);
            svg.select(".motifs_"+d).remove();
          }
          ;}) 
        
        
      

      x.domain([view.left, view.right]);
      x2.domain([view.left, view.right]);
    
      // updating the brush3 - genome
      //brush3.extent([view.left,view.right]);
      //svg2.select(".brush").call(brush3);
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
      .attr("class", "sequence-column")   ;
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
    //debugger;*/
    
    redraw();
    //redrawExpressionAsPath();
    //redrawExpressionData();
    //drawCheckBoxAndGetMotData();
    drawLine();
    //brush3End();
    
    

/*    var e = document.getElementById("motif_class");
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

//var yLogo = d3.scale.linear()
  //  .range([( (height+margin.left))/2, 100]);

  var yLogo = d3.scale.linear().range([430, 100]).domain([0,max_local]);

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
      var max_local = 100;
      yLine = d3.scale.linear().range([height, 150]).domain([0,max_local]); // 100 because I need to have room for other tracks
      yExpression = d3.scale.linear().range([height, 0]).domain([-5,5]);
      var yFont = d3.scale.linear().range([0, 310]).domain([0,getScaleBasedOnSelection()]); // fix font for seqLogo
      
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom"),
      xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");
      yAxisSeqLogo = d3.svg.axis().scale(ySeqLogo).orient("left").ticks(15);
      yAxisMaxLocal = d3.svg.axis().scale(yLine).orient("right").ticks(15);

    
  var xAxis3 = d3.svg.axis().scale(x3).orient("bottom");

    if ( (right - left) / 1500 > 1500){
      xAxis3
      .tickValues(d3.range(0, genomeInfo.end, 1800000))
      .tickFormat(function(d) {return (d/1800000) + 'M';});
    }
    else {
      xAxis3
      .tickValues(d3.range(15000, genomeInfo.end, 18000))
      .tickFormat(function(d) {return (d/1800) + 'k';});
    }
    
      //gene.attributes.split(";").forEach(function(d) {   var t = d.split("="); if(t[0]== "ID") console.log(t[1]);      })

  var brush = d3.svg.brush()
      .x(x2)
      .on("brushstart", brushStartEgrin)
      .on("brushend", brushEndEgrin)
      .on("brush", brushed)
;
      //***********************.on("brushend", brushEnd);
              
  var brushFocus = d3.svg.brush()
      .x(x)
      .on("brush", brushedFocus)
      .on("brushstart", brushedFocusStart);
  //    .style('pointer-events', 'all');     


  /*var brush3 = d3.svg.brush()
      .x(x3)
      .on("brushend", brush3End)
      .on("brush", brushed3);   
*/




  
    var area = d3.svg.area()
        .x(function(d) { return x(d.START); })
        .y0(height)
        .y1(function(d) { return yLine(d.MAX); });  
  

  var svg2 = d3.select("#allGenome").append("svg")//#principal
    .attr("id", "svg2")
          .attr("width", width + 50)
          .attr("height", height3)
  ;

      // some tests with checkbox and on
    
        var check = d3.selectAll("input[name=mot]").on("change", changed);
        //var checkBox = d3.select("input[value=\"grouped\"]").property("checked", changed)
        function changed(){
          if(this.checked){
          //console.log("changed : " + this.value);
          svg.selectAll("#seqLogo")
          .style("display", null);
        
        }
        else {
          //console.log(this)
          svg.selectAll("#seqLogo")
          .style("display", "none")
        }
        }
    


    
      //***********************
      // Reserved space for sequence logo vars etc. 
  
  
    var capHeightAdjust = 1.1;
    var xSeqLogo = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);//.domain([29451, 29465])

    


  // remove it 'cause I added the same code inside redrawSeqLogo; (then I update at once everytime I need to redraw)
 
  // jan - removed
 /* mot_names.forEach(function(d){
    //debugger;
    //debugger;
    window["_"+d] = focus.selectAll(".sequence-column" + d)
          .data(eval("m_"+d))
    //.data(eval(d))//["motif"]
          //.data(motif_all, function(e) { if (e.key === d) {return(e.values)}})
    .enter()
          .append("g")
    .attr("class", "sequence-column")   ;
    //debugger;
    ;
  //  delete(window[d]);
  //  console.log("called delete");
    })*/
  
    
  var yPos_ = 0;    
  mot_names.forEach(function(d){
    //console.log('drawing Motif Heatmap');
  //  var yPos = 0;
    //console.log('yPos : ' + yPos_);
    ////drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
    //drawOverlapMotif(d, eval("segment_"+ d)["MotifSegment"], yPos_, 0);
    //drawOverlapMotif(d, eval("segment_"+ d), yPos_, 0);
    yPos_ = yPos_ + (100/mot_names.length);
    //console.log('yPos : ' + yPos_);
  });    
    


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

  //  .attr("x", 10)
  //  .attr("y", 50)
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
  //  console.log(dataSource);
    return dd;
      }




        y.domain([0, 900]);
        x2.domain(x.domain());
        //y2.domain([1, 69]); //*** fix it, it may take max automaticaly
        
    focus.append("path")
          .attr("clip-path", "url(#clip)");
    
    focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(-15," + (height-110) + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "y axis")
        //.attr("transform", "translate(-1, 0)")
        .attr("transform", "translate(0, 195)") //--apaguei
            //.call(yAxisSeqLogo);
        
        
        focus.append("g")
        .attr("class", "y axis")
        .attr("id", "max_local")
            .attr("transform", "translate(" + (width-15) + ",-110)")
        .call(yAxisMaxLocal);

        // yLabel
        focus.append("text")
            .attr("class", "y label")
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("x", 0 - (height / 2) + 50)
            .attr("y", 0 - margin.right + 695)
            //.attr("dy", ".175em")
            .attr("dy", "1em")
            //.attr("transform", "translate(" + 0 + ",0)")
            .text("GRE counts")

        
    context.append("g")
            .attr("class", "x axis")
            .attr("id", "brush1")
            .attr("transform", "translate(0," + (height2) + ")")
        //.attr("clip-path", "url(#clip2)")
            .call(xAxis2);


        context.append("g")
            .attr("class", "x brush")
        .attr("id", "t")
            .call(brush)
          .selectAll("rect")
            .attr("y", -2)
          //.attr("width", width - 40)
            .attr("height", height2+5)
        //.attr("clip-path", "url(#clip2)")
        ; 

            genome.append("g")
                .attr("class", "x axis")
          //.attr("id", "brush3")
                .attr("transform", "translate(0," + (height3 - padding) + ")")
                .call(xAxis3);

          /*genome.append("g")
              .attr("class", "x brush")
              .call(brush3)
            .selectAll("rect")
              .attr("y", -6)
              .attr("height", height3 + 7);
*/
  
getSequenceAnnotationData("/genes_json_annotation/" + species_ + "/",left, right, refseq);


//if(gene_strand == "+"){
  //getCre("/cres_in_range/"+ species_ + "/", left, right, 4, species_, gene_, refseq);
//url, start, stop, top, specie, gene_name, refseq
  getCre("/cres_in_range_json_gene_all/", left, right, 6, species_, gene_, refseq);
  
//}
//else{
//  getCre("/cres_in_range/"+ species_ + "/",  view.right,view.left, 4, species_, gene_); 
//}


// for the special case of E. Coli
function resetView_corem(){
  getCre("/cres_in_range_json_gene_all/", left, right, 6, species_, gene_, refseq);
}

init();

