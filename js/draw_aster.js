function createaster(id, algo) {
  var width = 250,
    height = 250,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.35 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-15, 0])
  .html(function(d) {
    return '<span class="tip-parameters"> ' + d.data.label + ' </span><br/><span class="tip-keyword">NMI</span>: <span class="tip-score">' + d.data.score.toFixed(3) + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score) + innerRadius; 
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select('[role="'+id+'"]')
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.call(tip);

d3.csv('./csv/N5000/'+algo+'.csv', function(error, data) {

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.score;
    d.width  = +d.weight;
    d.label  =  d.label;
  });
  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }

  var path = svg.selectAll(".solidArc")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc")
      .attr("stroke", "gray")
      .attr("d", arc); 

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", "rgba(0,0,0,0)")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);  
  

  // calculate the weighted mean score
  var score = 
    data.reduce(function(a, b) {
      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
      return a + (b.score * b.weight); 
    }, 0) / 
    data.reduce(function(a, b) { 
      return a + b.weight; 
    }, 0);

  svg.append("svg:text")
    .attr("class", "aster-nmi-tooltip")
    .attr("dy", "-0.1em")
    .attr("text-anchor", "middle") // text-align: right
    .text("NMI");

  svg.append("svg:text")
    .attr("class", "aster-nmi")
    .attr("dy", "1em")
    .attr("text-anchor", "middle") // text-align: right
    .text(score.toFixed(2));

  });
};
