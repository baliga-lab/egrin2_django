function legend_chart(){
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", x(view.right- 300) )
    .attr("y", 245)
    .attr("height", 100)
    .attr("width", 100)
    .attr("transform", "translate(30, 60)")

  legend.selectAll('g').data(mot_names)
      .enter()
      .append('g')
      .each(function(d, i) {
        var g = d3.select(this);
        g.append("rect")
          .attr("x",x(view.right- 400) )
          //.attr("x2",x(view.right- 300) )
          .attr("y", i*10)
          //.attr("y2", i*10)
          .attr("width", 8)
          .attr("height", 8)
          //.attr("align", "bottom")
          //.attr("dy", ".35em")
          .style("fill", function(d) {return color(d);})
          //.style("fill", function(d, i) { return color(i); });
          //.attr("stroke", function(d) { return color(d); } ) 
        g.append("text")
          .attr("x", x(view.right- 200) )
          .attr("y", i * 10 + 8)
          .attr("height",30)
          .attr("width",100)
          //.attr("fill", function(d) {color(d);})
          .text(function(d){return d;})
          .style("fill", function(d) { return color(d); } ); 

      });

}



  
function redrawSeqLogo(names){
  
    if (  (view.right - view.left) <= 410 && (window[names + "checked"] == true) && (checked_global == true) ) { 
      

      
      var sequence = focus.selectAll("#" + names).remove();
      //debugger;    
      //debugger;
      //normalize.domain([0,eval("pp_" + names).map(function(d) { return  d3.max((d.values.map(function(e) { return (e.MAX);} )));})]);
      //yLogo.domain([0,getMaxLocal(getNameWithoutUnchecked())]);
      //yLogo.domain = yLine.domain
      yLogo.domain(yLine.domain())
      yLogo.range([100,430])
      //yLogo.domain([0,eval("pp_" + names).map(function(d) { return  d3.max((d.values.map(function(e) { return (e.MAX);} )));})]);
      //console.log(yLogo.domain());
      xSeqLogo.domain(d3.range(view.left,view.right,1))
      
    eval("_"+names)
    .selectAll("#" + names)
     .data(function(d){  return d.values.filter(function(f) {  return f.START >= view.left && f.START <= view.right ;});})
     //.data(function(d){ debugger; return d.values.filter(function(f) {  return f.POSITION >= view.left && f.POSITION <= view.right  ;});})
      .enter().append("text")
        .attr("id", names)
        .attr("clip-path", "url(#clip)")
        //.attr("y",function(e,i) { return yLogo(0); })
        .attr("y", 430)
        .attr("x", function(d) { return x(d.START); })
        //.attr("fill", "white")
        .text( function(e) { return e.LETTER; } )//e.LETTER
        .attr("class", function(e) { return "letter-" + e.LETTER; } )
        .style( "text-anchor", "start" )
        .style( "font", "corrier" )
//        .style("text-size-adjust", "inherit")
        .attr( "textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
        //.attr("transform", "translate(0, 195)")
//          .attr( "textLength", 10)
        .attr( "lengthAdjust", "spacingAndGlyphs" )
        //.attr( "font-size", function(e) { return   (ySeqLogo(normalize(-e.MAX)) )* capHeightAdjust;; } )
        //.style( "font-size", function(e) { return   (ySeqLogo(normalize(-e.MAX)))* capHeightAdjust;; } )

        .attr( "font-size", function(e) { return   yFont(e.MAX) } )
        .style("opacity", 0.8)
        //.style( "font-size", function(e) { return  yLogo(e.MAX)* capHeightAdjust ; } )

        //.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } )
        //.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust; } )

        
        ;

  } else{
    eval("_"+names)
    .selectAll("#" + names).remove();  
  }
}

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
  };//drawExpressionAsPath();
  
  function redrawExpressionAsPath(){
//    svg.selectAll('#test').remove();
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
  //    selected.value = (view.right - view.left)+1
      brush.clear();
    svg.select(".x.brush").call(brush);
      focus.select(".x.axis").call(xAxis);
        redraw();
    //redrawExpressionData();
    //redrawExpressionAsPath();
    drawLine();
    console.log("resetView()")
      }




   function rightClick() { 
           if (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button 
  == 2) { //3==firefox, 2==ie 
                   return true; 
           } else { 
                   return false; 
           } 
   }
  // when I brushFocus my focus component
 




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
    //re//drawHeatmap();
    //redrawBasepair();
    //redrawExpressionAsPath();
    drawLine();
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
    
    redraw();
   // redrawExpressionAsPath();
    //redrawExpressionData();
   // drawCheckBoxAndGetMotData();
    drawLine();
    brush3End();
    redrawSeqLogo();
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
        
        //(1500 * d3.round(15000/5000) + 5000)
        
        
        //cleaning motif_names
        
        view.left = +res.split(",")[0] ; //-1500
        view.right = +res.split(",")[1] ;//+1500
        
        final_right = +res.split(",")[1];
        final_left = +res.split(",")[0];

        //debugger;
        //view.right  = ((( ((1500 * d3.round(view.right/w) + 5000))/w) ) * w);
        //view.left = ((( ((1500 * d3.round(view.right/w) + 5000))/w))* w) - w;
        view.left = (d3.round(view.right/w) * 5000);
        view.right = ((d3.round(view.right/w) * 5000 ) + 5000);
        //debugger;
        
        
        if( !(  final_left >= view.left && final_right <= view.right  ) ){
          console.log("gene not inside region");
          
          if(final_left >= view.left) {
            //debugger;
            console.log("right is out, let's sum")
            view.left = view.left + 1500;
            view.right = view.right + 1500;
            //getMotifData_all_rank(d3.round(view.right/w) + 0.5);
          }
          else{
            var temp_r = view.right;
            view.left = view.left - 1500;
            view.right = view.right - 1500;
            
            //debugger;
            if( !(  final_left >= view.left )   ){
              //debugger;
              console.log("left is out, let's dim")
              view.left = view.left - 1500;
              view.right = view.right - 1500;
              //getMotifData_all_rank(d3.round(temp_r/w) - 1.0);            
            }
            else{
              //debugger;
              console.log("left is out, let's substract")
              //getMotifData_all_rank(d3.round(view.right/w) - 0.5);            
            }
          }
        }
        else{
          console.log("gene is in between");
          //getMotifData_all_rank(d3.round(view.right/w));
        }
        

        x.domain([view.left, view.right]);
        x2.domain([view.left, view.right]);
        old_names = new Array();
        old_names = [];
        del = new Array();
        del = [];
        old_names = mot_names;  
        //getMotifData_all_rank( ( ((1500 * d3.round(+res.split(",")[1]/w) + 5000))/w)  );
        
        //getListSegmentsAll(view.left,  view.right,view.right/w);
        //getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
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


  // change position whenever user change bookmark selection:
  function changePositionBySelection(textToQuery){
  
    if(textToQuery != ""){
      //console.log("inside query - let's look for the gene name");
      var res = sessionStorage.getItem(textToQuery.toLowerCase());
      //console.log("Query result: " + res);
      if( res !== null) {
        
        // let's get some extra data and plot some extra info on whole genome space 
        view.left = +res.split(",")[0] ; //-1500
        view.right = +res.split(",")[1] ;//+1500
        
        final_right = +res.split(",")[1];
        final_left = +res.split(",")[0];

        //debugger;
        //view.right  = ((( ((1500 * d3.round(view.right/w) + 5000))/w) ) * w);
        //view.left = ((( ((1500 * d3.round(view.right/w) + 5000))/w))* w) - w;
        view.left = (d3.round(view.right/w) * 5000);
        view.right = ((d3.round(view.right/w) * 5000 ) + 5000);
        //debugger;
        
        
        if( !(  final_left >= view.left && final_right <= view.right  ) ){
          //console.log("gene not inside region");
          
          if(final_left >= view.left) {
            //debugger;
            //console.log("right is out, let's sum")
            view.left = view.left + 1500;
            view.right = view.right + 1500;
            //getMotifData_all_rank(d3.round(view.right/w) + 0.5);
          }
          else{
            var temp_r = view.right;
            view.left = view.left - 1500;
            view.right = view.right - 1500;
            
            //debugger;
            if( !(  final_left >= view.left )   ){
              //debugger;
              //console.log("left is out, let's dim")
              view.left = view.left - 1500;
              view.right = view.right - 1500;
              //getMotifData_all_rank(d3.round(temp_r/w) - 1.0);            
            }
            else{
              //debugger;
              //console.log("left is out, let's substract")
              //getMotifData_all_rank(d3.round(view.right/w) - 0.5);            
            }
          }
        }
        else{
          //console.log("gene is in between");
          //getMotifData_all_rank(d3.round(view.right/w));
        }
        
        x.domain([view.left, view.right]);
        x2.domain([view.left, view.right]);
        old_names = new Array();
        old_names = [];
        del = new Array();
        del = [];
        old_names = mot_names;  
        //getMotifData_all_rank( ( ((1500 * d3.round(+res.split(",")[1]/w) + 5000))/w)  );
        
        //getListSegmentsAll(view.left,  view.right,view.right/w);
        //getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
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
  //  .attr("text-anchor", "middle")
    .attr('y', function(d){ 
      if(d.strand =='+') return genetrack.plus + 15; else return genetrack.minus + 15;
    })
.attr("x", function(d,i) { console.log(d.name);
      if(d.start < d.end){
        //console.log("start > end");
        return x(d.start + 3);    
      }
      else{
        //console.log("start < end");
        return x(d.end); 
      }
      
        })
        .attr("width", function(d,i) {
          if(d.start < d.end){
            return x( (d.end - d.start) + (view.left) );    
          }
          else {
            return x( (d.start - d.end) + (view.left) );  
          }
          
        })
    //.on('click', function(c){
    //  window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
    //  ;})
    //.text(formatLabel)
    .text(function(d){ 
      if(d.start < d.end){
              if( (d.sys_name.length)*7 > x(d.end - d.start + view.left) ) {
       return ""; 
      }
       else{
        return d.sys_name;}
      }
      else{
              if( (d.sys_name.length)*7 > x(d.start - d.end + view.left) ) {
       return ""; 
      }
       else{
        return d.sys_name;}
      }
    })
    .style('cursor', 'hand')
    .append("svg:title")
    .text(function(d, i) { return "" + d.attributes; })
  ;
  
  }

    
  function redrawGeneLabels(){
    var geneLabels = focus.selectAll("#glabel").data(g);
    //var geneLabels = focus.selectAll("#glabel").data(g.filter(function(d, i) { 
      //        return (d.start <= view.right && d.end >= view.left)}))
    //.data(genes.filter(function(d, i) { 
    //  return( (d[2] <= view.right) && (d[3] >= view.left)  );
    //}));  
  
    geneLabels.enter().append("text")
    geneLabels.exit().remove();
  
  geneLabels
    .attr("id", "glabel")
    .attr("clip-path", "url(#clip)")
    //.attr("clip-path", "url(#clip)")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
  //  .attr("text-anchor", "middle")
    .attr('y', function(d){ 
      if(d.strand =='+') return genetrack.plus + 15; else return genetrack.minus + 15;
    })
    .attr("x", function(d,i) { 
      if(d.start < d.end){
        //console.log("start > end");
        return x(d.start + 3);    
      }
      else{
        //console.log("start < end");
        return x(d.end); 
      }
        })
        .attr("width", function(d,i) {
          if(d.start < d.end){
            return x( (d.end - d.start) + (view.left) );    
          }
          else {
            return x( (d.start - d.end) + (view.left) );  
          }
          
        })
    .on('click', function(c){
      window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
      ;})
    //.text(formatLabel)
    .text(function(d){ 
      if(d.start < d.end){
              if( (d.sys_name.length)*7 > x(d.end - d.start + view.left) ) {
       return ""; 
      }
       else{
        return d.sys_name;}
      }
      else{
              if( (d.sys_name.length)*7 > x(d.start - d.end + view.left) ) {
       return ""; 
      }
       else{
        return d.sys_name;}
      }
    })
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
  //getSequenceAnnotationDataLocal(id, genomeInfo.start, genomeInfo.end, "gene");  //left, right  
  function drawGenes(){     
      //Drawing genes rect - whenever pages load
    
      //getData();
      
    console.log("inside drawGenes");
      var genes1 = focus.selectAll("#dois").data(g);
      
      /*.data(genes.filter(function(d, i) { 
    return( (d[2] <= view.right) && (d[3] >= view.left)  );
    })); */
  
    //genes1.append("g");
        
      //debugger;
    genes1

    .enter()
    
    .append("rect")
    //.attr("class", "node")
  //  .attr("transform", "translate(" + margin.left + "," + 0 + ")")
  //  .attr("class", "tooltip")
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
      if(d.start < d.end){
        //console.log("start > end");
        return x(d.start);    
      }
      else{
        //console.log("start < end");
        return x(d.end); 
      }
      
        })
        .attr("width", function(d,i) {
          if(d.start < d.end){
            return x( (d.end - d.start) + (view.left) );    
          }
          else {
            return x( (d.start - d.end) + (view.left) );  
          }
          
        })
        .attr("height",genetrack.height)
        .attr('stroke', 'rgba(0,0,0,0.5)')
    //.attr("title", function(d){ return (d.attributes)})
  
    .attr("class", "hint--bottom")
    .on('click', function(c){
      //window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')

      window.open("{% url 'genes' %}{{ s.ncbi_taxonomy_id }}/" + c.sys_name, '_blank')
    d3.select('#geneAnnotation').selectAll("p").remove();
    //d3.selectAll('#geneAnnotation').append("p").text(c.attributes + ' :  http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank');
      ;})
    .style('cursor', 'hand')
    .append("svg:title")  
    .text(function(d){ return (d.attributes)})

    //.call(d3.behavior.drag().on("drag", move));
  
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
  //  .attr("class", "tooltip")
    //.attr("class", "tooltip")
    .attr("id", "genes_fix")
    .attr("clip-path", "url(#clip2)")
        .attr('fill', function(d) { 
          if(d.strand =='+') return '#eef000'; else return '#ddbb00';
        })
        .attr('y', function(d){ 
          //if(d.strand=='+') return 450; else return 430;
      return 40;
        })
        .attr("x", function(d,i) { 
      if(d.start < d.end){
        //console.log("start > end");
        return x(d.start);    
      }
      else{
        //console.log("start < end");
        return x(d.end); 
      }
      
        })
        .attr("width", function(d,i) {
          if(d.start < d.end){
            return x( (d.end - d.start) + (view.left) );    
          }
          else {
            return x( (d.start - d.end) + (view.left) );  
          }
          
        })
        .attr("height",12)
        .attr('stroke', 'rgba(0,0,0,0.5)')
  /*  .on('click', function(c){
      //window.open('http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank')
    d3.select('#geneAnnotation').selectAll("p").remove();
    d3.selectAll('#geneAnnotation').append("p").text(c.attributes + ' :  http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank');
      ;})*/
  //  .style('cursor', 'hand')
    .append("svg:title")  
    .text(function(d){ return (d.attributes)})
    //.attr("data-tooltip", function(d){ return (d.attributes + " ---")})
  ;
  };


/*function drawLine(){
  

  //getMotifMax(view.left, view.right, "MOT_10");
  mot_names.forEach(function(d){

  svg.select(".motifs_"+d).selectAll(".line")
     //.data(eval("max_"+d)) // set the new data --> old
     .data(eval("pp_"+d))
     .attr("d", line(eval("pp_"+d)[0].values.filter(function(f) {return (f.START >= (view.left-15000) && f.START <= (view.right+15000)   );}))); // apply the new data values
     //.attr("d", line(eval("pp_"+d)[0].values) )
      /*if((window[d + "checked_max"] == true)){
            svg.select(".motifs_"+d).selectAll(".line")
            .style("display", null);
      }
    else{
            svg.select(".motifs_"+d).selectAll(".line")
            .style("display", "none");
    }*/
  /* 
   
   })
};*/

function drawLine(){
  console.log("drawLine")
  //console.log("inside drawLine()");
  //getMotifMax(view.left, view.right, "MOT_10");

  //svg.selectAll(".line").remove();
  
  //var temp__ = getMaxLocal(getNameWithoutUnchecked());
  
  //yLine.domain([0,getMaxLocal(getNameWithoutUnchecked())]); deleted
  
  //var t = svg.transition().duration(750);
  //t.selectAll
  //svg.selectAll("#max_local").call(yAxisMaxLocal); deleted
  
  mot_names.forEach(function(d){
    //debugger;
    if((window[d + "checked"] == true)) {
      //debugger;
   // taking the domain localy
  
  //normalize.domain([0,eval("pp_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));}) ]);   
  //console.log("domain : " + normalize.domain());
  //eval("max_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));})
  focus.select(".motifs_"+d).selectAll(".line-")
     .data(eval("pp_"+d))
//     .transition() // set the new data
     .attr("clip-path", "url(#clip)")
     //.attr("transform", "translate(0, 0)")
     .attr("d", line(eval("pp_"+d)[0].values.filter(function(d){  if(d.START >= view.left && d.START <= view.right) {return d}     })    ))//.filter(function(f) {return (f.START >= (view.left-15000) && f.START <= (view.right+15000)   );}))); // apply the new data values
//     .transition()
//           .duration(500)


  .style("stroke", color(eval("pp_"+d)[0].values[0].MOTIF_NAME)  ) //old   values[0].MOTIF_NAME
  .style("stroke-width", 1.6)
  //.style("fill", color(d.key))
  //.style("fill", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) ) //for area
  //.style("opacity", 0.5) // for area
  

  //.append("svg:title")
  //.text(function(d) { return d.key; });
  
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

  function resetLineChartData(){
    mot_names.forEach(function(d){

      eval("pp_" + d)[0].values = eval("pp_original_"+d)[0]
      animatedLineChart(eval("pp_" + d)[0].values, d, true)
      transitionExample(eval("pp_" + d)[0].values, d)


    })

  }

  function animatedLineChart(data, name, reset){

  //var eco = pp_corem_ec512157[0].values.filter(function(d) {  return (d.MOTIF_NAME == "eco_12")  } ) 
  //createPosArray(pp_corem_ec512157[0].values.filter(function(d) {  return (d.MOTIF_NAME == name)  } ) )
  
  var array_zero = createPosArray(data.filter(function(d) {  return (d.MOTIF_NAME == name)  } ), left, right )
  //debugger;
  /*if(name != "All"){
    
  }
  else {
    var array_zero = data
  }*/
  //var eco = array_zero.sort(function(a,b) {return d3.ascending(a.START, b.START)})
  
  if(!reset){
    console.log("inside reset")
  //debugger;
  eval("pp_" + name)[0].values = array_zero
  }
  
  //var eco = array_zero
  //debugger;
  //var t_ = $.extend(true, array_zero, eco);
 // debugger;
  //t_.sort(function(a,b) {return d3.ascending(a.START, b.START)})
  





  //var f_data = pp_corem_ec512157[0].values.filter(function(q){ return (q.MOTIF_NAME =="All")   } )
//debugger;
    //svg.selectAll('.line').remove();
    
  //getMotifMax(view.left, view.right, d);


  //normalize.domain([0,d3.max(eval("p_"+d).map(function(d) {return(d.max);}))]);   //eval("max_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));}) ]);    
  
  //console.log("domain : " + normalize.domain());
  //debugger;
  var lll = focus.select(".motifs_"+ name).selectAll(".line-"); //changed*

//debugger;

  //old  .data(eval("max_"+d));
  //.data(eval("pp_corem"+track_name));
//    .data(pp_corem_ec516031);  
  
 // lll.exit().remove();
 // lll.enter().append("g");
  
 /* lll
  
        .attr("class", "motifs_" + "eco_5");
  lll.append("path")*/
      //.data(pp_corem_ec516031)  //changed*

      /*
      .data(pp_corem_ec516031.filter(function(d){
        return if(d.MOTIF_NAME = "All") {return d}
      }))  //changed*
*/
  //.attr("class", "line")
  //.attr("clip-path", "url(#clip)")
  //old  .attr("d", line(eval("max_"+d)[0].values))
  


  /*
# here we create the transition
17
  t = svg.selectAll(".request")
18
    .transition()
19
    .duration(duration)
20
  
21
  # D3 will take care of the details of transitioning
22
  t.select("path.area")
23
    .style("fill-opacity", 1.0)
24
    .attr("d", (d) -> area(d.values))

  */

//var totalLength = lll.node().getTotalLength();

lll
  //.attr("stroke-dasharray", totalLength + " " + totalLength)
  //.attr("stroke-dashoffset", totalLength)
  .style("fill-opacity", 0)
  .transition()
  //.ease("linear")
  .delay(500)
  //.duration(1500)

    //    .style("fill", "white")
  //.duration(8000)
  //.attr("stroke-dashoffset", 0)

  //lll.select(".line")
    //.attr("stroke-dashoffset", 5000)
    //.style("fill-opacity", 0)
    //.attr("d", line(pp_eco_0[0].values)) //voltar
    .attr("d", line(eval("pp_" + name)[0].values.filter(function(d){  if(d.START >= view.left && d.START <= view.right) {return d}     }) )) // pp_eco_12[0].values.filter(function(d){  if(d.START >= view.left && d.START <= view.right) {return d}     })
        //.ease("linear")
        //.attr("d", line(eval(pp_corem_ec516031)[0].values) )
        //.attr("stroke-dashoffset", 0)
//  .attr("transform", "translate(0, 0)")
//.style("stroke", color("eco_12") ) //old   values[0].MOTIF_NAME
  //.style("stroke-width", 1.6)
  
  //.style("fill", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) )
  //.style("opacity", 1)
  //.on("mouseover", function(){d3.select(this).style("stroke", "#999999").attr("stroke-opacity", "1.0");});  
    
  };

/*var distinct = []
for (var i = 0; i < pp_corem_ec512157[0].values.length; i++) {
   if (pp_corem_ec512157[0].values[i].MOTIF_NAME not in distinct) {
      distinct.push(pp_corem_ec512157[0].values[i].MOTIF_NAME)
    }
  }
*/

function animateCorem(coremName){
  

  // getting corem GRE names to animate.
  var a = []
  eval("pp_corem_"+coremName)[0].values.forEach(function(d){
    if(a.indexOf(d.MOTIF_NAME) < 0) {a.push(d.MOTIF_NAME)} 
  })

  a.forEach(function(d){
    console.log("animating --> Corem: " + coremName + " GRE : "+ d)
    animatedLineChart(eval("pp_corem_" + coremName)[0].values, d, false)
    console.log("transitioning seqLogo : GRE : "+ d)
    transitionExample(eval("pp_" + d)[0].values, d)
  })
}



  function drawLineChart(){

    //max_local = d3.max(max_temp_All);

    //##### Don't display All track at first 
    d3.selectAll("input[id=All]").property("checked", false);
    



    console.log("drawLineChart")
  
    svg.selectAll('.line-').remove();
    mot_names.forEach(function(d){ //.filter(function(a){if(a!="All"){return a}})
  //getMotifMax(view.left, view.right, d);

  yLine.domain([0,getMaxLocal(getNameWithoutUnchecked())]);

  
  //var t = svg.transition().duration(750);
  //t.selectAll
  svg.selectAll("#max_local").call(yAxisMaxLocal);


  //normalize.domain([0,d3.max(eval("p_"+d).map(function(d) {return(d.max);}))]);   //eval("max_" + d).map(function(d) { return d3.max(d.values.map(function(f) { return(f.MAX);}));}) ]);    
  
  //console.log("domain : " + normalize.domain());


  var lll = focus.selectAll(".motifs_"+d)
  //old  .data(eval("max_"+d));
  .data(eval("pp_"+d));
      
  lll.enter().append("g");
  
  lll
  
        .attr("class", "motifs_" + d);
  lll.append("path")
  .attr("class", "line-")
  .attr("clip-path", "url(#clip)")
  //old  .attr("d", line(eval("max_"+d)[0].values))
  .attr("d", line(eval("pp_"+d)[0].values.filter(function(d){  if(d.START >= view.left && d.START <= view.right) {return d}     })    ) )
  .attr("transform", "translate(0, -110)")

  .style("stroke", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) ) //old   values[0].MOTIF_NAME
  .style("stroke-width", 1.6)
  ;
  //.style("fill", color(eval("pp_"+d)[0].values[0].MOTIF_NAME) ) //area
  //.style("opacity", 0.5) 
  //.on("mouseover", function(){d3.select(this).style("stroke", "#999999").attr("stroke-opacity", "1.0");});  
    
  })};// voltar drawLineChart();
  
  function removeAll(){
    svg.select(".motifs_All").style("display", "none")
  }
  
  
  
  function bookmarkClick(){ // zoomingBookmark

    //console.log("bookmarkClick");
  
      var bk_start = +bkSelected.split(",")[2];
      var bk_end = +bkSelected.split(",")[3]; 
            if(bk_start <= view.right  && bk_end >= view.left) {
       // console.log("bookmark inside data range");
        view.left =  bk_start - 1500;
              view.right = bk_end + 1500;
              //getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
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
    //redrawExpressionAsPath();
    drawLine();
    }
    else{ //correctiong when brush.empty() restables x.domain to general value
      resetView();
    }
    }//end-f first else
  }
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
  }//brush3start(); //load it once


  function brush3End(){
    //mot_names.forEach(function(n){
    //getMotifData(d3.round(view.left), d3.round(view.right), n); 
    //});
   // drawCheckBoxAndGetMotData();


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
      
        //  console.log('drawing Motif Heatmap');
        //  var yPos = 0;
        //  console.log('yPos : ' + yPos);
          ////drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
          drawOverlapGenes(d, eval("overlap_"+ d)["GenesPerMotif"], yPos);
          yPos = yPos + 100/mot_names.length;
        //  console.log('yPos : ' + yPos);
        });  
      }
      else {

        var yPos = 0;    
        mot_names.forEach(function(d){
          svg.selectAll("#overlapGene_").remove();
          //console.log('drawing Motif Heatmap');
        //  var yPos = 0;
          //console.log('yPos : ' + yPos);
          ////drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
          //drawOverlapMotif(d, eval("segment_"+ d)["MotifSegment"], yPos, size.value);
          drawOverlapMotif(d, eval("segment_"+ d), yPos, size.value);
          yPos = yPos + (100/mot_names.length);
          //console.log('yPos : ' + yPos);
        });  
      }
    
    } //end-of else (mot_names not === 0 )
    //drawGenesFixContext();
    // voltar drawLineChart();
        resetView();
    
  
  }

  function brushed3(){
    

    
    var s = d3.event.target.extent();
    if (  (s[1]-s[0] < 11500)   ) {
          //if(!brush3.empty()){
      //console.log( (s[1]-s[0] < 11500) )
            //svg2.select(".brush").style('pointer-events', 'none');
      //var s = d3.event.target.extent();
      //debugger;
      brush.clear();
      svg.select("x.brush").call(brush);
      //console.log("inside brushed3");
      view.left = brush3.extent()[0];
      view.right = brush3.extent()[1];
      //getSequenceAnnotationData(id, d3.round(view.left), d3.round(view.right), "gene");
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
      d3.event.target.extent([s[0],s[0]+11500]); 
      d3.event.target(d3.select(this));
    } 
      //}
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
    
      
      
      
  max_local = getMaxLocal(getNameWithoutUnchecked());
  //console.log("changed2 called : max_local:"+max_local);
  redrawSeqLogo(this.id)// necessary for when I set checkbox to checked, then it shows again seqlogo
  drawLine();
  }
  else {

    
      //console.log(this)
      window[this.id + "checked"] = false;
     // debugger;
      svg.selectAll("#" + this.id )
      .style("display", "none");
    
      svg.select(".motifs_"+this.id)//.selectAll(".line")
      .style("display", "none");
      drawLine();
  }
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

function getMaxLocal(motif_checked){
var max_temp = new Array();

motif_checked.forEach(function(d) {
  eval("pp_"+ d).forEach(function(q)  {
    max_temp.push(d3.max(q.values.map(function(w) {return (w.MAX);})));
  ;})
});
return(d3.max(max_temp));
}



function uncheckAll(){
//  debugger;
//  console.log(this.checked);
  if(d3.selectAll("#checkAll")[0][1].checked) {
    d3.selectAll("input[name=boxes]").property("checked", true);
      mot_names.forEach(function(d){
        window[d + "checked"] = true;
        ;
        redrawSeqLogo(d);
      });
      
      drawLine();
  }
  else{
    d3.selectAll("input[name=boxes]").property("checked", false);
      mot_names.forEach(function(d){
        window[d + "checked"] = false;
        ;
        redrawSeqLogo(d);
      });
      
      drawLine();
  }
  drawLine();
}


  function redraw(){
  
    //redrawHeatmap();
    //redrawBasepair(bp["Basepair"], 0); 
    //redrawBasepair(bp_inv["Basepair_inversion"], 1);
    //svg.select("#dois").selectAll('title').remove();
    //getData("1", d3.round(view.left), d3.round(view.right));
    //getSequenceAnnotationData(id, d3.round(left), d3.round(right), "gene");
  
         // var bar = focus.selectAll("#dois").data(g.filter(function(d, i) { 
          //    return (d.start <= view.right && d.end >= view.left)})); **dsalvanha
    var bar = focus.selectAll("#dois").data(g);
  
    //var bar = svg.selectAll("#dois").data(g);
  
    //.data(genes.filter(function(d, i) { return (d[2] <= view.right && d[3] >= view.left)}));
    bar.enter().append("rect")
    bar.exit().remove(); //working with keys, what means that I'll redraw existents ones, remove unused and draw new ones
    bar   
  //    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
      .attr("id", "dois")
      .attr("clip-path", "url(#clip)")
            .attr('fill', function(d) {
              if(d.strand =='+') return '#eef000'; else return '#ddbb00';
            })
            .attr('y', function(d){ 
              if(d.strand =='+') return genetrack.plus; else return genetrack.minus;
            })
            .attr("x", function(d,i) { 
      if(d.start < d.end){
        //console.log("start > end");
        return x(d.start);    
      }
      else{
        //console.log("start < end");
        return x(d.end); 
      }
      
        })
        .attr("width", function(d,i) {
          if(d.start < d.end){
            return x( (d.end - d.start) + (view.left) );    
          }
          else {
            return x( (d.start - d.end) + (view.left) );  
          }
          
        })
            .attr("height",genetrack.height)
            .attr('stroke', 'rgba(0,0,0,0.5)')
      .on('click', function(c){
        window.open("{% url 'genes' %}{{ s.ncbi_taxonomy_id }}/" + c.sys_name, '_blank')
    d3.select('#geneAnnotation').selectAll("p").remove();
    //d3.selectAll('#geneAnnotation').append("p").text(c.attributes + ' :  http://www.ncbi.nlm.nih.gov/gene/?term=' + c.attributes.split(";")[1].split("=")[1], '_blank');
      ;})
    .style('cursor', 'hand')
      ;
      bar.selectAll('title').remove();
    
      bar
      .append("svg:title")
      .text(function(d){ return (d.attributes)});

      
      mot_names.forEach(function(d){ 
        redrawSeqLogo(d);
      });
      mot_names.forEach(function(d) {
       /* if(eval("_"+"All")[0].length !== 0 ) {
          //console.log(d)
        }*/
      ;})
    
      redrawGeneLabels();
    
  
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
        function ReadCookie(cookieName) {

   var theCookie=""+document.cookie;

   var ind=theCookie.indexOf(cookieName);

   if (ind==-1 || cookieName=="") return "";

   var ind1=theCookie.indexOf(';',ind);

   if (ind1==-1) ind1=theCookie.length; 

   return unescape(theCookie.substring(ind+cookieName.length+1,ind1));

  }
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
      
      //  console.log('drawing Motif Heatmap');
      //  var yPos = 0;
      //  console.log('yPos : ' + yPos);
        ////drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
        drawOverlapGenes(d, eval("overlap_"+ d)["GenesPerMotif"], yPos);
        yPos = yPos + 100/mot_names.length;
      //  console.log('yPos : ' + yPos);
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
      //  var yPos = 0;
        //console.log('yPos : ' + yPos);
        ////drawHeatmapMotif(d, eval("max_"+ d)[0].values, yPos);
        //drawOverlapMotif(d, eval("segment_"+ d)["MotifSegment"], yPos, size.value);
        //drawOverlapMotif(d, eval("segment_"+ d), yPos, size.value);
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

  function alterSize() {
    //console.log("alter size");
    brush3End();
  }
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
        redrawSeqLogo(d);
      });
    } else {
      window["checked_global"] = true;
      mot_names.forEach(function(d){ 
        redrawSeqLogo(d);
      });
    }
    //console.log(checked_global);
  }
    function transitionExample(data, name){
    var m = svg.selectAll("#" + name).data(data.filter(function(f) {  return f.START >= view.left && f.START <= view.right;}));
    m.exit().remove();
    m.transition()
//    .attr( "textLength", xSeqLogo.rangeBand()+10 )
    //.attr( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust+10; } )
    /*.attr("y", function(e,i) {
      
      if(e.INIT != 0){
          return ySeqLogo(normalize(e.INIT+1));
      }
      else{
          return ySeqLogo(normalize(e.INIT));
      }
    })*/


      .attr("y", 430)
      .attr("x", function(d) { return x(d.START); })
      .text( function(e) { return e.LETTER; } )
      .attr("class", function(e) { return "letter-" + e.LETTER; } )
      .style( "text-anchor", "start" )
      .style( "font", "corrier" )
      .attr( "textLength", xSeqLogo.rangeBand() )//(xSeqLogo.rangeBand()) / 2
      //.attr("transform", "translate(0, 195)")
      .attr( "lengthAdjust", "spacingAndGlyphs" )
      .attr( "font-size", function(e) { return   yFont(e.MAX) } )
      .style("opacity", 0.8)      
    //.style( "font-size", function(e) { return ( ySeqLogo(normalize(e.INIT)) - ySeqLogo(normalize(e.FINAL)) ) * capHeightAdjust+10; } );
    //setInterval(function(){transitionExample2()},3000);
      
      
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
//     setInterval(function(){showcaseMotifShrink()},2000);
  }
    function drawCheckBoxAndGetMotData(){

  drawBoxes();

  }
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

