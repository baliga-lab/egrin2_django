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
              drawGenes();
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