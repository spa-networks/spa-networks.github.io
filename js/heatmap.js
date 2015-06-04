function createheatmap(id, property, slice, scale_type, domain){
  //UI configuration
  var  cellSize = 7, 
    itemSize = cellSize*20,
    width = cellSize*20,
    height = cellSize*20,
    margin = {top:0,right:0,bottom:0,left:0};

  //axis and scales

  var formatAsPercentage = d3.format(".2");


  var axisWidth = 0 ,
    axisHeight = cellSize*20,
    xAxisScale = d3.scale.linear()
      .range([0,itemSize])
      .domain([-0.025,0.975]),
    xAxis = d3.svg.axis()
      .orient('top')
      .ticks(5)
      .tickValues([0.2,0.4,0.6,0.8])
      .scale(xAxisScale), 
    yAxisScale = d3.scale.linear()
      .range([0,itemSize])
      .domain([-0.025,0.975]),
    yAxis = d3.svg.axis()
      .orient('left')
      .ticks(4)
      .tickValues([0.2,0.4,0.6,0.8])
      .scale(yAxisScale);

  var svg = d3.select('[role="'+id+'"]');
  var heatmap = svg
    .attr('width',width)
    .attr('height',height)
  .append('g')
    .attr('width',width-margin.left-margin.right)
    .attr('height',height-margin.top-margin.bottom)
    .attr('transform','translate('+margin.left+','+margin.top+')');
  var rect = null;

  if (scale_type == "log") {
    var color = d3.scale.log()
      .range(["#FFF7BC", "#E34A33"])
      .domain(domain);
  } else {
    var color = d3.scale.linear()
      .range(["#FFF7BC", "#E34A33"])
      .domain(domain);
  }



  d3.json('./json/N5000/'+property+'.json', function(err,data){
    if (slice == 1) {
      data = data.r_1;

  //render axises
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", 'translate(6,'+"0"+')')
      .call(yAxis)
    .append('text')
      .text('q')
      .attr('transform','translate(-45,70)');

  //render axises
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", 'translate(0,'+"6"+')')
      .call(xAxis)
    .append('text')
      .text('p')
      .attr('transform','translate(70,-30)');
    } else if (slice == 10) {
      data = data.r_10;
    } else {
      data = data.r_50
    }




    rect = heatmap.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('width',cellSize)
      .attr('height',cellSize)
      .attr("fill",function(d){
        return color(d.value);
      })
      .attr('x',function(d){
        return itemSize*d.q;
      })
      .attr('y',function(d){            
        return d.p*itemSize;
      })
  });
};
