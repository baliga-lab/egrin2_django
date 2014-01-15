// necessary variables
var n_ = new Array();
var mot_names = new Array();
var max_local = new Array();


// ajax call
        function getSequenceAnnotationData(url, start, stop, refseq){
        $.ajax( {
              type:'Get',

              url: url + (start) + "/" + (stop + 2000) + "/" + this.refseq + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
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

        function createPosArray(inputArray, s, e, nameInCaseInputArrayIsEmpty){
          
          //var s = 27151;
          //var e = 33299;
          //var t = new Array()
          //inputArray.forEach(function(d){
          //  t.push(d.START)
          //});
          //window["array_zero"] = new Array();
          //debugger;
          var arr = new Array();
          if(inputArray == ""){
            //console.log("creating empty array for GREs that has no data")
            for (var i = s; i < e; i++) {
                  arr.push(new Populate(nameInCaseInputArrayIsEmpty, i, 0, "") );  
                };
          }
          else{
                for (var i = s; i < e; i++) {
                  arr.push(new Populate(inputArray[0].MOTIF_NAME, i, 0, "") );  
                };
                inputArray.forEach(function(d){
                  if (d.START >= s) arr[d.START - s] = d;
                });
          }
          return arr; //window["array_zero"] =
        }


        function getCoremName(url, specie){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',
               // 
              url: url + specie + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              //var cor_available = []
              window["all_corem_names"] = JSON.parse(json);
              //debugger
              var options = $("#dropdown_corem");
                all_corem_names.forEach(function(d){
                    options.append($("<option />").text(d.corem_name));
                })
                

              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:false,
                    dataType:"text",
              });


            } 
        
        



//http://theflash2:8000/regulators_json/511145?sEcho=10&iDisplayStart=0&iDisplayLength=1000000000
        function getRegulator(url, specie){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',
               // 
              url: url + specie + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              window["regulator"] = JSON.parse(json);
              //debugger

              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:false,
                    dataType:"text",
              });


            } 
        function getCre(url, start, stop, top, specie, gene_name, refseq){ // top --> number of ranked GRE's (CRE) one wants to get
        //function getCre(url, gene_name){ // top --> number of ranked GRE's (CRE) one wants to get
        $('#freeze').block({   
              message: '<img id="loading" src="/static/images/ajax-loader.gif" /> <h1>Loading</h1>', 
              css: { 
            border: 'none', 
            padding: '25px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' }
        });//css: { border: '3px solid rgba(250, 250, 250, 0); ' }

       var call_ =  $.ajax( {
              type:'Get',

              url: url + gene_name + "/"
             ,
             success:function(json) {

              // getting basepairs information
              getBasepair_range("/basepair_json_range/"+specie, start, stop, this.refseq);
              
              if(json != "") {
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
                      window["pp_original_"+d] = new Array();
                      window["max_temp_"+d] = new Array();
                        cre[0][mot_names[i]].forEach(function(q){
                          eval("temp_"+d).push(new Populate(d, q[0], q[1], basepair[0].basepairs.substring(  (q[0] - start)-1, (q[0] - start)  ) ));  
                          eval("max_temp_"+d).push(q[1]);
                          //window["ppp_"+d] = eval("pp_"+d).push(new values(eval("pp_"+d)))
                        })
                        eval("max_").push(d3.max(eval("max_temp_"+d)));
                        eval("temp_pp_"+d).values = eval("temp_"+d);
                        eval("pp_"+d).push(eval("temp_pp_"+d));
                        window["array_zero"] = 0;
                        var array_zero = createPosArray(eval("pp_"+d)[0].values, start, stop, "")
                        array_zero.sort(function(a,b) {return d3.ascending(a.START, b.START)})
                        eval("pp_"+d)[0].values = array_zero
                        eval("pp_original_"+d).push(array_zero);
                      

              });

                // binding data to draw seqLogo
                  mot_names.forEach(function(d){
                  window["_"+d] = focus.selectAll(".sequence-column" + d)
                  .data(eval("pp_"+d))
                  .enter()
                  .append("g")
                  .attr("class", "sequence-column");
                })
                  //debugger;
                // now I have all data as needed, let's draw the charts
                drawBoxes(mot_names, "boxes");
                drawLineChart();
                removeAll();
                legend_chart();
                //view.left = parseInt(gene_start)-300
                //view.right = parseInt(gene_start)+50
                //drawLine()
                brushed()
                //jQuery('#displayStatus').html('Loaded').delay(2000).fadeOut();
                //$('#freeze').unblock()
              //drawLineChart();

              if(left < right){
                //console.log("less")
                getCre_per_corem("/cres_in_range_json_gene_corem/",  left, right, 4, specie,gene_name, this.refseq);
                //getCre_per_corem("/cres_in_range_json_gene_corem/" + specie + "/",  gene_name);
              }
              else{
                //console.log("highier")
                getCre_per_corem("/cres_in_range_json_gene_corem/",  right, left,  4, specie,gene_name, this.refseq); 
                //getCre_per_corem("/cres_in_range_json_gene_corem/" + specie + "/", gene_name);
              }
              

              } // end if checking json != ""
                else{
                  //alert("no data for this gene.")
                  $('#freeze').unblock()
                  $('#freeze').block({   
                    cursorReset: 'default',
                    //cursor:'default',
                    message: '<h1>Unavailable dynamic data set for '+gene_name+' at this moment.</h1>', 
                    css: { 
                    border: 'none', 
                    padding: '35px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: 0.8, 
                    color: '#fff',
                    cursor:'default'  }
                  });
                  call_.abort();
                  //break
              }


              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:true,
                    dataType:"text",
              });


            }            


        function getCre_per_corem(url, start, stop, top, specie, gene_name, refseq){ // top --> number of ranked GRE's (CRE) one wants to get
        //function getCre_per_corem(url, gene_name){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',
               // 
              url: url + gene_name + "/"
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
              getBasepair_range("/basepair_json_range/"+specie, start, stop, this.refseq);
              
     
              window["cre_corem"] = JSON.parse(json);

              
              //cre_corem["cre_data"][0][0].All = cre_corem["cre_data"][1][1];
              //debugger;
              window["corem_name"] = cre_corem["corem_name"];
              //window["corem_name_copy"] = cre_corem["corem_name"];
              window["max_corem"] = new Array();
              window["total_corem_"] = corem_name.length
              window["original_corem"] =  cre_corem["corem_name"];
              


              corem_name.forEach(function(d,i){
                //debugger;
                cre_corem["cre_data"][i][0].All = cre_corem["cre_data"][i][1];
                //debugger;
                window["temp_corem_"+d] = new Array();
                window["temp_pp_corem_"+d] = {};
                window["pp_corem_"+d] = new Array();
                //window["pp_corem_original"+d] = new Array();
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
                //debugger;

                //window["corem_" + d] = new Array();
              })
                corem_name.push("Default")

                if(corem_name.length > 1){ // if I don't have corem, I don't animate
                      cycling()
                      drawButton(corem_name, "corem_box");
                      d3.selectAll("input[value=Default]").attr("class", "pressed")
                      //d3.selectAll("input[id=ec512157]").attr("class", "pressed")
                      yFont.domain([0,getMaxLocal(getNameWithoutUnchecked())]);
                      ani()
                      $('#freeze').unblock()
                }
                else{
                      $('#freeze').unblock()
                    }


                  //eval("corem_name_original").push("Default");

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


        function getCre_added_corem(url, start, stop, top, specie, coremName, refseq){ // top --> number of ranked GRE's (CRE) one wants to get
               $('#freeze').block({   
              message: '<img id="loading" src="/static/images/ajax-loader.gif" /> <h1>Loading</h1>', 
              css: { 
            border: 'none', 
            padding: '25px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' }
        });
        $.ajax( {
              type:'Get',
               // 
              url: url + (start) + "/" + (stop) + "/" + top +  "/" + coremName + "/" + this.refseq + "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              // getting basepairs information
              getBasepair_range("/basepair_json_range/"+specie, start, stop, this.refseq);
              

              window["cre_corem_add"] = JSON.parse(json);
              if(cre_corem_add["corem_name"] == ""){
                alert("The entered name is invalid" )
                $('#freeze').unblock()
              }
              else {
              //cre_corem["cre_data"][0][0].All = cre_corem["cre_data"][1][1];
              //debugger;
              window["corem_name_add"] = cre_corem_add["corem_name"];
              window["max_corem"] = new Array();
              


              corem_name_add.forEach(function(d,i){
                //debugger;
                cre_corem_add["cre_data"][i].All = cre_corem_add["cre_data"][1];
                //debugger;
                window["temp_corem_"+d] = new Array();
                window["temp_pp_corem_"+d] = {};
                window["pp_corem_"+d] = new Array();
                //window["pp_corem_original"+d] = new Array();
                window["max_temp_corem_"+d] = new Array();
                window["corem_to_animate"] = new Array();
                mot_names.forEach(function(w) {
                  
                  if(!(cre_corem_add["cre_data"][i][w] == undefined)){
                      cre_corem_add["cre_data"][i][w].forEach(function(q){
                        eval("temp_corem_"+d).push(new Populate(w, q[0], q[1], basepair[0].basepairs.substring(  (q[0] - start)-1, (q[0] - start)  ) ));  
                        eval("max_temp_corem_"+d).push(q[1]);
                      })
                      eval(corem_to_animate).push(w);
                  }
                });
                eval("max_corem").push(d3.max(eval("max_temp_corem_"+d)));
                eval("temp_pp_corem_"+d).values = eval("temp_corem_"+d);
                eval("pp_corem_"+d).push(eval("temp_pp_corem_"+d));
                //debugger;

                //window["corem_" + d] = new Array();
              })
                if(corem_name.indexOf("Default") == -1){
                  corem_name.push("Default")  
                }
                else{
                  corem_name.push(cre_corem_add["corem_name"][0])
                }

                if(eval("pp_corem_"+ cre_corem_add["corem_name"][0])[0].values == ""){
                  corem_name_add = []
                  corem_name.splice(-1,1)
                  alert("There is no data for Corem " +cre_corem_add["corem_name"][0] + " on this range." )
                  $('#freeze').unblock()
                  if(cycling_global == true){ani()}
                }
                else{
                  drawButton(corem_name, "corem_box");
                  d3.selectAll("input[value=Default]").attr("class", "pressed")
                //d3.selectAll("input[id=ec512157]").attr("class", "pressed")
                  yFont.domain([0,getMaxLocal(getNameWithoutUnchecked())]);
                  if(cycling_global == true){ani()}
                  $('#freeze').unblock()
                }
                //ani()

                //drawLineChart();
                //legend_chart();
                //jQuery('#displayStatus').html('Loaded').delay(2000).fadeOut();
              }
              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:true,
                    dataType:"text",
              });


            }

function getBasepair_range(url, start, stop, refseq){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',

              url: url +"/"+ (start) + "/" + (stop) + "/"+ this.refseq +  "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
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
