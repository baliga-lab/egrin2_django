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
        function Populate(MOTIF_NAME, START, MAX) {
            this.MOTIF_NAME = MOTIF_NAME;
            this.START = START;
            this.MAX = MAX;
        };



        function getCre(url, start, stop, top){ // top --> number of ranked GRE's (CRE) one wants to get
        
        $.ajax( {
              type:'Get',

              url: url + (start) + "/" + (stop) + "/" + top +   "?sEcho=0&iDisplayStart=0&iDisplayLength=1000000000"
             ,
             success:function(json) {
              
              window["cre"] = JSON.parse(json);
              window["mot_names"] = d3.keys(cre[0]);

              window["max_"] = new Array();
              
              mot_names.forEach(function(d, i){
                window["temp_"+d] = new Array();
                window["temp_pp_"+d] = {};
                window["pp_"+d] = new Array();
                window["max_temp_"+d] = new Array();
                
                //console.log("do something for "+ d);
                //drawLineChart()
                //window["pp_"+d] = cre[0][mot_names[i]];
                //debugger;
                cre[0][mot_names[i]].forEach(function(q){
                  eval("temp_"+d).push(new Populate(d, q[0], q[1]));  
                  eval("max_temp_"+d).push(q[1]);
                  //window["ppp_"+d] = eval("pp_"+d).push(new values(eval("pp_"+d)))
                })
                //debugger;
                eval("max_").push(d3.max(eval("max_temp_"+d)));
                eval("temp_pp_"+d).values = eval("temp_"+d);
                eval("pp_"+d).push(eval("temp_pp_"+d));
              });
              //max_local = d3.max(max_);

                // now I have all data as needed, let's draw the charts
                drawBoxes();
                drawLineChart();
              //drawLineChart();
              },
              error: function(e, xhr){
                  console.log(url);
                  console.log("error: " + e); debugger
                },
               async:true,
                    dataType:"text",
              });


            }            