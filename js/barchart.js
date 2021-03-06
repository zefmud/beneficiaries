
    //Appends chart headline
    d3.select(".g-hed").text("Лише бізнес - чи й політика?");

    //Appends chart intro text
    d3.select(".g-intro").html("Бізнесмени, з чиїми компаніями повʼязано найбільше місцевих депутатів");

    //Appends chart source
    d3.select(".g-source-bold")
        .text("ДЖЕРЕЛО: ")
        .attr("class", "g-source-bold");

    d3.select(".g-source-reg")
        .text("дані про бенефіціарів з реєстру юридичних та фізичних осіб, електронні декларації")
        .attr("class", "g-source-reg");



    var d3Container = d3.select("#d3-bar-horizontal"),
        margin_bar = {top: 20, right: 40, bottom: 5, left: 60},
        width_bar = d3Container.node().getBoundingClientRect().width - margin_bar.left - margin_bar.right,
        height_bar = 300 - margin_bar.top - margin_bar.bottom - 5,
        n = 12;

    // Format data
    var format = d3.format(",.0f");



    // Construct scales
    // ------------------------------

    // Horizontal
    var x = d3.scale.linear()
        .range([0, width_bar]);

    // Verticals
    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height_bar], .1);

    // Colors
    var colors = d3.scale.category20();



    // Create axes
    // ------------------------------

    // Horizontal
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickSize(-height_bar);

    // Vertical
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(5);



    // Create chart
    // ------------------------------

    // Add SVG element
    var container = d3Container.append("svg");

    // Add SVG group
    var svg = container
        .attr("width", width_bar + margin_bar.left + margin_bar.right)
        .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");



    // Load data
    // ------------------------------

    d3.csv("data/top10_businessman.csv", function(data) {

        // Parse numbers, and sort by value.
        data.forEach(function(d) { d.value = +d.value; });
        data.sort(function(a, b) { return b.value - a.value; });


        // Set input domains
        // ------------------------------

        // Horizontal
        x.domain([0, d3.max(data, function(d) { return d.value; })]);

        // Verticals
        y.domain(data.map(function(d) { return d.name; }));

        // Horizontal
        svg.append("g")
            .attr("class", "x axis")
            // .call(xAxis)
        ;

        // Vertical
        svg.append("g")
            .attr("class", "bar-axis")
            .attr("fill", "#7e7e7e")
            .call(yAxis);

        // Remove lines
        svg.selectAll(".d3-axis line, .d3-axis path").attr("stroke-width", 0);


        // Append bars
        // ------------------------------

        // Group bars
        var bar = svg.selectAll(".d3-bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "d3-bar-group")
            .attr("fill", "#4393c3")
            .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

        var div = d3.select("div.ol-info").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // var div = d3.select("svg")
        //     .append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        // Add bar
        bar.append("rect")
            .attr("class", "d3-bar")
            .attr("width", function(d) { return x(d.value); })
            .attr("height", y.rangeBand())
            .on("mouseover", function(d) {
                div.transition()
                    .duration(50)
                    .style("opacity", .9);
                div.html(d.info)
                    // .style("left", (d3.event.pageX) + "px")
                    .style("top", "30px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(50)
                    .style("opacity", 0);
            })
        ;

        // Add text label
        bar.append("text")
            .attr("x", function(d) { return x(d.value); })
            .attr("y", y.rangeBand() / 2)
            .attr("dx", "-0.2em")
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("fill", "#fff")
            .style("font-size", 12)
            .text(function(d) { return format(d.value); });
    });


    $(window).on('resize', resize);


    $('.sidebar-control').on('click', resize);


    function resize() {

        // Layout variables
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


        // Layout
        // -------------------------

        // Main svg width
        container.attr("width", width + margin.left + margin.right);

        // Width of appended group
        svg.attr("width", width + margin.left + margin.right);


        // Axes
        // -------------------------

        // Horizontal range
        x.range([0, width]);

        // Horizontal axis
        svg.selectAll('.d3-axis-horizontal')
            // .call(xAxis)
        ;


        // Chart elements
        // -------------------------

        // Line path
        svg.selectAll('.d3-bar').attr("width", function(d) { return x(d.value); });

        // Text label
        svg.selectAll('.d3-label-value').attr("x", function(d) { return x(d.value); });
    }
