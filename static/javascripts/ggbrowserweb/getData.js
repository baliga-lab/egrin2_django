// necessary variables
var n_ = new Array();
var mot_names = new Array();
var max_local = new Array();


// ajax call
        function getSequenceAnnotationData(url, start){
        $.ajax( {
              type:'Get',

              url: url + (start) + "/" + (start + 10000) + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              window["g"] = JSON.parse(json);
              window["g"] = g["SequenceAnnotation"];
              drawGenes(url);//{% url 'genes' %}{{ s.ncbi_taxonomy_id }}/
              drawGenesFixContext();
              drawGeneLabels();
              },
              error: function(e, xhr){
                  console.log("error: " + e); debugger
                },
               async:false,
                    dataType:"text",
              });


            }

        function values(populate) {
            this.populate = populate;
        };  
        function Populate(MOTIF_NAME, START, MAX, LETTER) {
            this.MOTIF_NAME = MOTIF_NAME;
            this.START = START;
            this.MAX = MAX;
            this.LETTER = LETTER;
        };



        function getCre(url, start, stop, top, specie, gene_name){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',

              url: url + (start) + "/" + (stop) + "/" + top +   "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {

              // getting basepairs information
              getBasepair_range("/basepair_json_range/"+specie, start, stop);
              
              window["cre"] = JSON.parse(json);
              cre[0].All = cre[1];
              
              //window["mot_names"] = "All"
              window["mot_names"] = d3.keys(cre[0])//.concat("All");
              mot_names.reverse();

              window["max_"] = new Array();
              
              mot_names.forEach(function(d, i){
                window["temp_"+d] = new Array();
                window["temp_pp_"+d] = {};
                window["pp_"+d] = new Array();
                window["max_temp_"+d] = new Array();
                
                //console.log("do something for "+ d);
                //drawLineChart()
                //window["pp_"+d] = cre[0][mot_names[i]];
                
                
                cre[0][mot_names[i]].forEach(function(q){
                  eval("temp_"+d).push(new Populate(d, q[0], q[1], basepair[0].basepairs.substring(  (q[0] - start)-1, (q[0] - start)  ) ));  
                  eval("max_temp_"+d).push(q[1]);
                  //window["ppp_"+d] = eval("pp_"+d).push(new values(eval("pp_"+d)))
                })
                //debugger;
                eval("max_").push(d3.max(eval("max_temp_"+d)));
                eval("temp_pp_"+d).values = eval("temp_"+d);
                eval("pp_"+d).push(eval("temp_pp_"+d));
              });
              //max_local = d3.max(max_);

                // binding data to draw seqLogo
                  mot_names.forEach(function(d){
                  window["_"+d] = focus.selectAll(".sequence-column" + d)
                  .data(eval("pp_"+d))
                  .enter()
                  .append("g")
                  .attr("class", "sequence-column");
                })

                // now I have all data as needed, let's draw the charts
                drawBoxes(mot_names, "boxes");
                drawLineChart();
                legend_chart();
                jQuery('#displayStatus').html('Loaded').delay(2000).fadeOut();
              //drawLineChart();

              getCre_per_corem("/cres_in_range_list/" + specie + "/",  view.left, view.right, 4, specie,gene_name);


              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:true,
                    dataType:"text",
              });


            }            


        function getCre_per_corem(url, start, stop, top, specie, gene_name){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',
               // 
              url: url + (start) + "/" + (stop) + "/" + top +  "/" + gene_name + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              
             /* // getting basepairs information
              getBasepair_range("/basepair_json_range/"+specie, start, stop);
              
              window["cre_corem"] = JSON.parse(json);
              window["corem_name"] = cre_corem["corem_name"];
              //debugger;
              window["max_corem"] = new Array();
              //debugger;
              mot_names.forEach(function(d, i){
                window["temp_corem_"+d] = new Array();
                window["temp_pp_corem_"+d] = {};
                window["pp_corem_"+d] = new Array();
                window["max_temp_corem_"+d] = new Array();
                
                //console.log("do something for "+ d);
                //drawLineChart()
                //window["pp_"+d] = cre[0][mot_names[i]];
                //debugger;
                //cre["cre_data"][i].forEach(function(q){
                
                cre_corem["cre_data"].forEach(function(q,j){  
                    debugger;
                    if(!isNaN(q[0][d])){
                      debugger;                      
                      eval("temp_corem_"+d).push(new Populate(d, q[0], q[1], basepair[0].basepairs.substring(  (q[0] - start)-1, (q[0] - start)  ) ));  
                      eval("max_temp_corem_"+d).push(q[1]);
                    }
                  //window["ppp_"+d] = eval("pp_"+d).push(new values(eval("pp_"+d)))
                })
                //debugger;
                //eval("max_").push(d3.max(eval("max_temp_"+d)));
                //eval("temp_pp_"+d).values = eval("temp_"+d);
                //eval("ppp_"+d + "_").push(eval("temp_pp_"+d));
               
              });
              //max_local = d3.max(max_);

                // binding data to draw seqLogo
                  mot_names.forEach(function(d){
                  window["_"+d] = focus.selectAll(".sequence-column" + d)
                  .data(eval("pp_"+d))
                  .enter()
                  .append("g")
                  .attr("class", "sequence-column");
                })

                // now I have all data as needed, let's draw the charts
                //drawBoxes();
                //drawLineChart();
                //legend_chart();
                //jQuery('#displayStatus').html('Loaded').delay(2000).fadeOut();
              //drawLineChart();*/

              // getting basepairs information
              getBasepair_range("/basepair_json_range/"+specie, start, stop);
              

              window["cre_corem"] = JSON.parse(json);
              window["corem_name"] = cre_corem["corem_name"];
              window["max_corem"] = new Array();
              


              corem_name.forEach(function(d,i){

                window["temp_corem_"+d] = new Array();
                window["temp_pp_corem_"+d] = {};
                window["pp_corem_"+d] = new Array();
                window["max_temp_corem_"+d] = new Array();
                window["corem_to_animate"] = new Array();
                mot_names.forEach(function(w) {
                  
                  if(!(cre_corem["cre_data"][i][0][w] == undefined)){
                      cre_corem["cre_data"][i][0][w].forEach(function(q){
                        eval("temp_corem_"+d).push(new Populate(w, q[0], q[1], basepair[0].basepairs.substring(  (q[0] - start)-1, (q[0] - start)  ) ));  
                        eval("max_temp_corem_"+d).push(q[1]);
                      })
                      eval(corem_to_animate).push(w);
                  }
                });
                eval("max_corem").push(d3.max(eval("max_temp_corem_"+d)));
                eval("temp_pp_corem_"+d).values = eval("temp_corem_"+d);
                eval("pp_corem_"+d).push(eval("temp_pp_corem_"+d));

                //window["corem_" + d] = new Array();
              })
                drawBoxes(corem_name, "a");
                //drawLineChart();
                //legend_chart();
                //jQuery('#displayStatus').html('Loaded').delay(2000).fadeOut();
              
              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:true,
                    dataType:"text",
              });


            } 

function getBasepair_range(url, start, stop){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',

              url: url +"/"+ (start) + "/" + (stop) + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              window["basepair"] = JSON.parse(json);
              window["basepair"] = basepair["Basepairs_range"];
              //basepair[0].basepairs.substring(0,10)
          
              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:false,
                    dataType:"text",
              });


            }          
