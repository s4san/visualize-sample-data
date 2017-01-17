+function(window, d3) {

  let outerArc = null;

  const data = [
    {assetClass: 60, geography: 40},
    {assetClass: 30, geography: 30},
    {assetClass: 15, geography: 2},
    {assetClass: 15, geography: 1}
  ];

  const ticker = [
    'VCR',
    'VDC',
    'VIG',
    'VYM',
    'VDE',
    'VFH',
    'VUG',
    'VHT',
    'VIS',
    'VOO',
    'VV',
    'VAW',
    'VO',
    'VOE'
  ];

  const width = 960;
  const height = 750;
  const min = 500;
  const radius = Math.min(width, height, min) / 2;

  const color = d3.scaleOrdinal(d3.schemeCategory20);

  const pie = d3
    .pie()
    .value(d => d.assetClass)
    .sort(null);

  const arc = d3
    .arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate( ${width / 2}, ${height / 2} )`);
  
  let path = svg
    .datum(data)
    .selectAll('path')
    .data(pie)
    .enter()
    .append('path')
    .attr('fill', (d, i) => color(i))
    .attr('d', arc)
    .attr('id', (d, i) => 'dataArc_' + i)
    .on('mouseover', function(d) {
      const currentArc = d3.select(this);
      const startAngle = d.startAngle;
      const endAngle = d.endAngle;
      const arcWidth = (endAngle - startAngle) / ticker.length;

      d3.selectAll('svg > path').remove();

      ticker.forEach((tick, i) => {
        const arcStart = startAngle + (i * arcWidth);
        const arcEnd = arcStart + arcWidth;
        const newArc = d3
        .arc()
        .innerRadius(radius - 20)
        .outerRadius(radius + 80)
        .startAngle(arcStart)
        .endAngle(arcEnd);

        window.setTimeout(() => {
          d3.select('svg')
            .append('path')
            .attr('fill', currentArc.attr('fill'))
            .attr('d', newArc)
            .attr('transform', `translate( ${width / 2}, ${height / 2} )`)
        }, (i+1) * 100)
      });

      currentArc.style("opacity", 0.7);
      //d3.select('p').text(t => `Hovering arc with data: ${d.data.assetClass} ${d.data.geography}`);
    })
    .on('mouseout', function(d) {
      d3.select(this).style("opacity", 1);
    });

  svg
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', 35)
    .attr('dy', 15)
    .append('textPath')
    .attr('xlink:href', (d, i) => '#dataArc_' + i)
    .text(d => `${d.assetClass} %`)

  d3.selectAll('input')
    .on('change', change);
  
  function change() {
    const value = this.value;
    pie.value(d => d[value]);
    path = path.data(pie);
    path.transition().duration(750).attrTween('d', arcTween);
  }

  function arcTween(a) {
    const i = d3.interpolate(this.currentArc, a);
    this.currentArc = i(0);
    return (t) => arc(i(t));
  }

}(window, d3);