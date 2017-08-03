
    <style type="text/css">
      /*css to go here*/
      body {
        background-color: #eee;
      }

      svg {
        background-color: white;
        border:1px solid #f0f;
      }

    </style>
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>
var svg = d3.select("d3-chart")
      .append("svg")
      .attr("width", 600)
      .attr("height",400);

    svg.append("line")
      .attr("x1",0)
      .attr("y1",0)
      .attr("x2",600)
      .attr("y2",400)
      .attr("stroke", "red")
      .attr("stroke-width",2)


  </script>
