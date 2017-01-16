+function(window, d3) {

  const data = [
    {assetClass: 60, geography: 40},
    {assetClass: 30, geography: 40},
    {assetClass: 10, geography: 20}
  ];

  const width = 960;
  const height = 500;
  const radius = Math.min(width, height) / 2;

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
    .attr('fill', (d, i) => color(i + 4))
    .attr('d', arc)
    .on('mouseover', (d) => {
      d3.select('p').text(d => `Hovering arc:\t${Math.floor(Math.random() * 10)}`);
    });
  d3.selectAll('input')
    .on('change', change);
  
  function change() {
    const value = this.value;
    pie.value(d => d[value]);
    path = path.data(pie);
    path.attr('d', arc);
  }

}(window, d3);