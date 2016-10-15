

function clearHighlight() {
  highlight.clearLayers();
}

var map = L.map('map').setView([58, -95], 4);


var CSJmarkers = L.markerClusterGroup({
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: true,
  zoomToBoundsOnClick: true,
  iconCreateFunction: function (e) {
    var t = e.getChildCount(),
    n = 40,
    r = ' marker-cluster-';
    return t < 100 ? r += 'small' : t < 500 ? (r += 'medium', n = 50)  : (r += 'large', n = 60),
    new L.DivIcon({
      html: '<div><span>' + t + '</span></div>',
      className: 'marker-cluster' + r,
      iconSize: new L.Point(n, n)
    })
  }
});

var enCA = d3.locale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  dateTime: "%a %b %e %X %Y",
  date: "%Y-%m-%d",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

var  format = enCA.numberFormat("n");

var insertLinebreaks = function (d) {
var el = d3.select(this);
var words = d.split(' ');
    el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', 0).attr('dy', '15');
	}
};

 var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'right'
			});
			map.addControl(sidebar);

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | ' + 'Data: <a href:="http://www.statcan.gc.ca/">Statistics Canada</a> | ' + 'Bjenk Ellefsen',
	maxZoom: 10,
	minZoom: 4
}).addTo(map);

//Geocoder: search for addresses
new L.Control.GeoSearch({
	provider: new L.GeoSearch.Provider.OpenStreetMap(),
	position: 'bottomleft',
	retainZoomLevel: true
}).addTo(map);

//get color OL Education
function getColorEdOL(d) {
	return d >= 59.3 && d <= 100.0	? '#810f7c':
		   d >= 36.9 && d <= 59.2	? '#8856a7':
		   d >= 20.9 && d <= 36.8	? '#8c96c6':
		   d >= 6.9 && d <= 20.8	? '#b3cde3':
		   d >= 0 && d <= 6.8		? '#edf8fb':
											 '';
}


//get color Education total
function getColorEdTot(d) {
	return d >= 28.7 && d <= 43.5	? '#980043':
		   d >= 20.5 && d <= 28.6	? '#dd1c77':
		   d >= 14.1 && d <= 20.4	? '#df65b0':
		   d >= 6.4 && d <= 14.0	? '#d7b5d8':
									  '#f1eef6';
}

// get color OL
function getColorOL(d) {
	return d > 10000 ? '#67001f' :
		   d > 5000  ? '#980043' :
		   d > 1000  ? '#ce1256' :
		   d > 500   ? '#e7298a' :
		   d > 200   ? '#df65b0' :
		   d > 100   ? '#c994c7' :
		   d > 50    ? '#d4b9da' :
		   d > 10    ? '#e7e1ef' :
					   '#f7f4f9' ;
}

// get color SE
function getColorSE(d) {
	return d === 'High Skills'    ? '#66c2a5' :
		   d === 'Low Skills'     ? '#fc8d62' :
		   d === 'Skills Gaps'    ? '#8da0cb' :
		   d === 'Skills Surplus' ? '#e78ac3' :
										 ''	  ;
}

//get color for OW
function getColorOW(d) {
	return d > 27  ? '#08519c' :
		   d > 16  ? '#3182bd' :
		   d > 10  ? '#6baed6' :
		   d > 5   ? '#bdd7e7' :
					 '#eff3ff' ;
}

//get color for youth
function getColorYouth(d) {
	return d > 56   ? '#08519c' :
		   d > 29   ? '#3182bd' :
		   d > 18   ? '#6baed6' :
		   d > 11   ? '#bdd7e7' :
					  '#eff3ff' ;
}

//Get color for Index
function getColorInd(d) {
	return  d >= 0.51               ? '#7a0177' :
			d >= 0.44 && d <= 0.50  ? '#c51b8a' :
			d >= 0.33 && d <= 0.43  ? '#f768a1' :
			d >= 0.16 && d <= 0.32  ? '#fbb4b9' :
									  '#feebe2' ;
}

//get color OL LF size
function getColorLFOLM(d) {
	return d >= 1556 && d <= 735765	? '#980043':
		   d >= 391 && d <= 1555	? '#dd1c77':
		   d >= 91 && d <= 390		? '#df65b0':
		   d >= 1 && d <= 90		? '#d7b5d8':
			                          '#f1eef6';
}

//get color OL %
function getColorOLMPer(d) {
	return d >= 57.8 && d <= 97.4	? '#91003f':
		   d >= 30.6 && d <= 57.7	? '#ce1256':
		   d >= 14.4 && d <= 30.5	? '#e7298a':
		   d >= 6.5 && d <= 14.3	? '#df65b0':
		   d >= 1.7 && d <= 6.4		? '#c994c7':
		   d >= 0.1 && d <= 1.6		? '#d4b9da':
		   d >= 0.0	&& d <= 0.0		? '#f1eef6':
											 '';
}

//Style for OLM %
function styleOLMPer(feature) {
	return  {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorOLMPer(feature.properties.OLMPerc),
	};
}

//Style for OL Education
function styleEdOL(feature) {
	return  {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorEdOL(feature.properties.UnOL)
	};
}


//Style for Education total
function styleEdTot(feature) {
	return  {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorEdTot(feature.properties.UnprTot)
	};
}


//Style for OL
function styleOL(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorOL(feature.properties.PopOLM)
	};
}

//Style for SE
function styleSE(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorSE(feature.properties.SEQuad)
	};
}

//Style for OW
function styleOW(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorOW(feature.properties.UR55_64Tot)
	};
}

//Style for OWMLO
function styleOWMLO(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorOW(feature.properties.UR55_64Fr)
	};
}

//Style for Youth
function styleYouth(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorYouth(feature.properties.UR15_30Tot)
	};
}

//Style for YouthMLO
function styleYouthMLO(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorYouth(feature.properties.UR15_30Fr)
	};
}

//Style for Index
function styleInd(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorInd(feature.properties.EcPerfInd)
	};
}

//Style for OL LF size
function styleLFOLM(feature) {
	return  {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorLFOLM(feature.properties.LFOLM)
	};
}

//Style for OLM %
function styleOLMPer(feature) {
	return  {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorOLMPer(feature.properties.OLMPerc),
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#FFF',
		dashArray: '',
		fillOpacity: 0.7
	});
}


//Reset for OL education
function resetHighlightEdOL(e) {
	EdOL.resetStyle(e.target);
}

//Reset for Education total
function resetHighlightEdTot(e) {
	EdTot.resetStyle(e.target);
}

//Reset for OL
function resetHighlightOL(e) {
	OL.resetStyle(e.target);
}

//Reset for OLM %
function resetHighlightOLMPer(e) {
	OLMPer.resetStyle(e.target);
}

//Reset for SE
function resetHighlightSE(e) {
	SE.resetStyle(e.target);
}

//Reset for OW
function resetHighlightOW(e) {
	OW.resetStyle(e.target);
}

//Reset for OWMLO
function resetHighlightOWMLO(e) {
	OWMLO.resetStyle(e.target);
}


//Reset for Youth
function resetHighlightYouth(e) {
	Youth.resetStyle(e.target);
}

//Reset for YouthMLO
function resetHighlightYouthMLO(e) {
	YouthMLO.resetStyle(e.target);
}

//Reset for Index
function resetHighlightInd(e) {
	Ind.resetStyle(e.target);
}

//Reset for LF OLM
function resetHighlightLFOLM(e) {
	LFOLM.resetStyle(e.target);
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}


function onEachFeatureEdOL(feature, layer) {
	layer.on({
		mouseout: function (e) {
			$('#name').empty();
			resetHighlightEdOL(e);
		},
		mouseover: function (e) {
			highlightFeature(e);
			$('#name').empty();
			$('#name').append(feature.properties.SLAName);
		},

		click: function (e) {
      $('#cat1').show();
			$('#cat2').show();
			document.getElementById('cat1').innerHTML = 'OL Minority',
			document.getElementById('cat2').innerHTML = 'OL Majority',
      zoomToFeature(e);
			$('#AreaName').empty();
      $('#AreaName').append(AreaName);
      $('#chart').empty();
      $('#chart').append(div);
			$('#ExtraChart').empty();
			$('#chart2').empty();
			$('#chart2').append(div3);
			$('#chart3').empty();
			$('#chart3').append(div4);
			$('#chart4').empty();
			$('#chart5').empty();
			$('#chart6').empty();
			$('#chart7').empty();
			$('#chart8').empty();
			}
			});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div3 = format(feature.properties.EdTotOL) +
			"<br/>" + "OLM EDUCATION"

	var div4 = format(feature.properties.EdTotNOL) +
			"<br/>" + "NON-OLM EDUCATION"

	var div = $('<div class="popupGraph" style="width: 400px; height:270px;"><svg/></div>')[0];

  var values = feature.properties;
	var data = [
		{name:"No diploma",value:values["NoDipOL"]},
		{name:"High school",value:values["HSOL"]},
		{name:"College",value:values["ColOL"]},
		{name:"University",value:values["UnOL"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.3);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar2")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar2")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);

	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#A454A0")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "textVal")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 42)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -10 ; })
		.attr("y", y.rangeBand()-42)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });

	$("#cat1").click(function() {
		var values = feature.properties;
		var dataset = [
			{name:"No diploma",value:values["NoDipOL"]},
			{name:"High school",value:values["HSOL"]},
			{name:"College",value:values["ColOL"]},
			{name:"University",value:values["UnOL"]}
		];

				//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 42)
				.text(function(d) { return d.value + " %"; });
	});
	$("#cat2").click(function(){
		var values = feature.properties;
		var dataset = [
		{name:"No diploma",value:values["NoDipNOL"]},
		{name:"High school",value:values["HSNOL"]},
		{name:"College",value:values["ColNOL"]},
		{name:"University",value:values["UnNOL"]}
		];

			//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 42)
				.text(function(d) { return d.value + " %"; })
				.attr("text-anchor", "end");
	});


}

function onEachFeatureEdTot(feature, layer) {
				layer.on({
					mouseout: function (e) {
					$('#name').empty();
					resetHighlightEdTot(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
				click: function (e) {
        $('#cat1').hide();
  			$('#cat2').hide();
				document.getElementById('cat1').innerHTML = '',
				document.getElementById('cat2').innerHTML = '',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div2);
				$('#chart3').empty();
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
				}
			});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div2 = format(feature.properties.EdTot) +
			"<br/>" + "POPULATION BY EDUCATION"

	var div = $('<div class="popupGraph" style="width: 400px; height:300px;"><svg/></div>')[0];

    var values = feature.properties;
	var data = [
		{name:"No diploma",value:values["NoDipprTot"]},
		{name:"High school",value:values["HSprTot"]},
		{name:"College",value:values["ColprTot"]},
		{name:"University",value:values["UnprTot"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.3);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);


	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "text")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 42)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-42)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
}

function onEachFeatureOL(feature, layer) {
	layer.on({
			mouseout: function (e) {
			$('#name').empty();
			resetHighlightOL(e);
			},
			mouseover: function (e) {
			highlightFeature(e);
			$('#name').empty();
			$('#name').append(feature.properties.SLAName);
			},
			click: function (e) {
      $('#cat1').show();
  		$('#cat2').show();
      document.getElementById('cat1').innerHTML = 'OLM',
			document.getElementById('cat2').innerHTML = 'NON-OLM',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div2);
				$('#chart3').empty();
				$('#chart3').append(div3);
				$('#chart4').empty();
				$('#chart4').append(div4);
				$('#chart5').empty();
				$('#chart5').append(div5);
				$('#chart6').empty();
				$('#chart6').append(div6);
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div2 = "$" + format(feature.properties.AvEmIncOL) +
			"<br/>" + "OLM INCOME"

	var div3 = "$" + format(feature.properties.AvEmIncTot) +
			"<br/>" + "TOTAL INCOME"

	var div4 = format(feature.properties.PopOLM) +
			"<br/>" + "OLM POPULATION"

	var div5 = format(feature.properties.OLMPerc) + " %" +
			"<br/>" + "OLM PERCENTAGE"

	var div6 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION"

var div = $('<div class="popupGraph" style="width: 395px; height:275px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Employment rate",value:values["EROLM"]},
		{name:"Participation rate",value:values["PROL"]},
		{name:"Unemployment rate",value:values["UROL"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.2);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar2")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar2")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });


	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);


	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#91415A")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "textVal")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 50)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "textLab")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-50)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
	$("#cat1").click(function() {

					//New values for dataset
			var values = feature.properties;
			var dataset = [
				{name:"Employment rate",value:values["EROLM"]},
				{name:"Participation rate",value:values["PROL"]},
				{name:"Unemployment rate",value:values["UROL"]}
				];
					//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; })
				.attr("text-anchor", "end");
        });
	$("#cat2").click(function() {

					//New values for dataset
			var values = feature.properties;
			var dataset = [
				{name:"Employment rate",value:values["ERTot"]},
				{name:"Participation rate",value:values["PRTotal"]},
				{name:"Unemployment rate",value:values["URTot"]}
				];
					//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; })
				.attr("fill", "black")
				.attr("text-anchor", "end");
        });
}

function onEachFeatureOLMPer(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightOLMPer(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
			click: function (e) {
        $('#cat1').show();
        $('#cat2').show();
				document.getElementById('cat1').innerHTML = 'OLM',
				document.getElementById('cat2').innerHTML = 'NON-OLM',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div2);
				$('#chart3').empty();
				$('#chart3').append(div3);
				$('#chart4').empty();
				$('#chart4').append(div4);
				$('#chart5').empty();
				$('#chart5').append(div5);
				$('#chart6').empty();
				$('#chart6').append(div6);
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div2 = "$" + format(feature.properties.AvEmIncOL) +
			"<br/>" + "OLM INCOME"

	var div3 = "$" + format(feature.properties.AvEmIncTot) +
			"<br/>" + "TOTAL INCOME"

	var div4 = format(feature.properties.PopOLM) +
			"<br/>" + "OLM POPULATION"

	var div5 = format(feature.properties.OLMPerc) + " %" +
			"<br/>" + "OLM PERCENTAGE"

	var div6 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION"

var div = $('<div class="popupGraph" style="width: 395px; height:275px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Employment rate",value:values["EROLM"]},
		{name:"Participation rate",value:values["PROL"]},
		{name:"Unemployment rate",value:values["UROL"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.2);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar2")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar2")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });


	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);


	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#91415A")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "textVal")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 50)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "textLab")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-50)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
	$("#cat1").click(function() {

					//New values for dataset
			var values = feature.properties;
			var dataset = [
				{name:"Employment rate",value:values["EROLM"]},
				{name:"Participation rate",value:values["PROL"]},
				{name:"Unemployment rate",value:values["UROL"]}
				];
					//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; })
				.attr("text-anchor", "end");
        });
	$("#cat2").click(function() {

					//New values for dataset
			var values = feature.properties;
			var dataset = [
				{name:"Employment rate",value:values["ERTot"]},
				{name:"Participation rate",value:values["PRTotal"]},
				{name:"Unemployment rate",value:values["URTot"]}
				];
					//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; })
				.attr("fill", "black")
				.attr("text-anchor", "end");
        });
}

function onEachFeatureSE(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightSE(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
			click: function (e) {
        $('#cat1').hide();
				$('#cat2').hide();
				document.getElementById('cat1').innerHTML = '',
				document.getElementById('cat2').innerHTML = '',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div2);
				$('#chart3').empty();
				$('#chart3').append(div3)
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>' + '<br/>'

	var div2 = feature.properties.SEQuad +
			"<br/>" + "SKILLS EQUILIBRIUM"

	var div3 = "$" + format(feature.properties.AvEmIncTot) +
			"<br/>" + "AVERAGE EMPLOYMENT INCOME"
}

function onEachFeatureOW(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightOW(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
			click: function (e) {
      $('#cat1').show();
  		$('#cat2').show();
			document.getElementById('cat1').innerHTML = '55-64',
			document.getElementById('cat2').innerHTML = '65 and over',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div3);
				$('#chart3').empty();
				$('#chart3').append(div4);
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div3 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION"
	var div4 = format(feature.properties.URTot) + " %" +
			"<br/>" + "UNEMPLOYMENT RATE 15 PLUS"

var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Employment rate",value:values["ER55_64Tot"]},
		{name:"Participation rate",value:values["PR55_64Tot"]},
		{name:"Unemployment rate",value:values["UR55_64Tot"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.2);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar2")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar2")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);

	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#4C82B8")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "text")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 50)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-50)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
	$("#cat1").click(function() {
		var values = feature.properties;
		var dataset = [
		{name:"Employment rate (55-64)",value:values["ER55_64Tot"]},
		{name:"Participation rate (55-64)",value:values["PR55_64Tot"]},
		{name:"Unemployment rate (55-64)",value:values["UR55_64Tot"]}
		];

				//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; });
	});
	$("#cat2").click(function(){
		var values = feature.properties;
		var dataset = [
		{name:"Employment rate (65 plus)",value:values["ER65PTot"]},
		{name:"Participation rate (65 plus)",value:values["PR65PTot"]},
		{name:"Unemployment rate (65 plus)",value:values["UR65PTot"]}
		];
			//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; })
				.attr("text-anchor", "end");
	});
}

function onEachFeatureOWMLO(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightOWMLO(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
			click: function (e) {
        $('#cat1').show();
				$('#cat2').show();
				document.getElementById('cat1').innerHTML = '55-64',
				document.getElementById('cat2').innerHTML = '65 and over',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div3);
				$('#chart3').empty();
				$('#chart3').append(div4);
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div3 = format(feature.properties.PopOLM) +
			"<br/>" + "OLM POPULATION"
	var div4 = format(feature.properties.URTot) + " %" +
			"<br/>" + "UNEMPLOYMENT RATE 15 PLUS"

var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Employment rate (55-64)",value:values["ER55_64Fr"]},
		{name:"Participation rate (55-64)",value:values["PR55_64Fr"]},
		{name:"Unemployment rate (55-64)",value:values["UR55_64Fr"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.2);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar2")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar2")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);

	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#4E82B7")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "text")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 50)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-50)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
	$("#cat1").click(function() {
		var values = feature.properties;
		var dataset = [
		{name:"Employment rate (55-64)",value:values["ER55_64Fr"]},
		{name:"Participation rate (55-64)",value:values["PR55_64Fr"]},
		{name:"Unemployment rate (55-64)",value:values["UR55_64Fr"]}
		];

				//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; });
	});
	$("#cat2").click(function(){
		var values = feature.properties;
		var dataset = [
		{name:"Employment rate (65 plus)",value:values["ER65PFr"]},
		{name:"Participation rate (65 plus)",value:values["PR65Pfr"]},
		{name:"Unemployment rate (65 plus)",value:values["UR65PFr"]}
		];
			//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", 298)
				.attr("y", y.rangeBand() - 50)
				.text(function(d) { return d.value + " %"; })
				.attr("text-anchor", "end");
	});
}

function onEachFeatureYouth(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightYouth(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
			click: function (e) {
        $('#cat1').hide();
				$('#cat2').hide();
				document.getElementById('cat1').innerHTML = '',
				document.getElementById('cat2').innerHTML = '',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div3);
				$('#chart3').empty();
				$('#chart3').append(div4);
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div3 = format(feature.properties.PopYTot) +
			"<br/>" + "Youth (15-30) POPULATION"
	var div4 = format(feature.properties.URTot) + " %" +
			"<br/>" + "UNEMPLOYMENT RATE 15 PLUS"

var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Employment rate (15-30)",value:values["ER15_30Tot"]},
		{name:"Participation rate (15-30)",value:values["PR15_30Tot"]},
		{name:"Unemployment rate (15-30)",value:values["UR15_30Tot"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.2);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);

	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#4C82B8")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "text")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 50)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-50)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
}

function onEachFeatureYouthMLO(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightYouthMLO(e);
					},
					mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
		click: function (e) {
        $('#cat1').hide();
        $('#cat2').hide();
				document.getElementById('cat1').innerHTML = '',
				document.getElementById('cat2').innerHTML = '',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div3);
				$('#chart3').empty();
				$('#chart3').append(div4);
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'

	var div3 = format(feature.properties.PopYFr) +
			"<br/>" + "YOUTH (15-30) OLM POPULATION"
	var div4 = format(feature.properties.URTot) + " %" +
			"<br/>" + "UNEMPLOYMENT RATE 15 PLUS"

var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Employment rate (15-30)",value:values["ER15_30Fr"]},
		{name:"Participation rate (15-30)",value:values["PR15_30Fr"]},
		{name:"Unemployment rate (15-30)",value:values["UR15_30Fr"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Employment rate", "Participation rate", "Unemployment rate"])
		.rangeRoundBands([0, height], 0.2);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300);

	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#4C82B8")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "text")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 50)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-50)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
}

function onEachFeatureInd(feature, layer) {
	layer.on({
			mouseout: function (e) {
					$('#name').empty();
					resetHighlightInd(e);
					},
			mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
			click: function (e) {
        $('#cat1').hide();
				$('#cat2').hide();
				document.getElementById('cat1').innerHTML = '',
				document.getElementById('cat2').innerHTML = '',
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div2);
				$('#chart3').empty();
				$('#chart3').append(div3);
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
				$('#chart8').append(div4);
			}
	});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'
	var div2 = format(feature.properties.EcPerfInd) +
			"<br/>" + "ECONOMIC HEALTH";

	var div3 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION";

	var div4 = "Each dimension takes the range of 0-1, with 0 " +
				"indicating the least favorable outcome" +
				" and 1 indicating the most favorable outcome.";


	var div = $('<div class="popupGraph" style="width: 395px; height:400px;"><svg/></div>')[0];

	var values = feature.properties;
	var data = [
		{name:"Education",value:values["Educ"]},
		{name:"Earnings",value:values["Earnings"]},
		{name:"Industry sector",value:values["Ind"]},
		{name:"Housing",value:values["Housing"]},
		{name:"Access to services",value:values["AccToSer"]},
		{name:"Jobs",value:values["LabMarPres"]}
	];

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 1]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(["Education", "Earnings", "Industry sector", "Housing", "Access to services", "Jobs"])
		.rangeRoundBands([0, height], 0.3);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);

	var bar2 = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });


	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300)


	bar.append("rect")
		.attr("height", y.rangeBand()- 15)
		.attr("fill", "#A14C9F")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "text")
		.attr("x", 298)
		.attr("y", y.rangeBand() - 40)
		.text(function(d) { return d.value; })
		.attr("text-anchor", "end");

  	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand()-40)
		.text(function(d) { return d.name; });
}


function onEachFeatureLFOLM(feature, layer) {
				layer.on({
				mouseout: function (e) {
					$('#name').empty();
					resetHighlightLFOLM(e);
					},
				mouseover: function (e) {
					highlightFeature(e);
					$('#name').empty();
					$('#name').append(feature.properties.SLAName);
					},
					click: function (e) {
          $('#cat1').show();
    			$('#cat2').show();
					document.getElementById('cat1').innerHTML = 'OLM',
					document.getElementById('cat2').innerHTML = 'NON-OLM',
					zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#chart2').empty();
				$('#chart2').append(div2);
				$('#chart3').empty();
				$('#chart3').append(div3);
				$('#chart4').empty();
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
				}
			});

	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b><br/>'
	var div2 = format(feature.properties.NTotFr) +
			"<br/>" + "OLM BY INDUSTRY"
	var div3 = format(feature.properties.NTotEn) +
			"<br/>" + "NON-OLM by INDUSTRY"

	var div = $('<div class="popupGraph" style="width: 405px; height:600px;"><svg/></div>')[0];


    var values = feature.properties;
	var data = [
		{key: "Agriculture, forestry, fishing, hunting", name:"N11prFr",value:values["N11prFr"]},
		{key: "Mining,quar., oil, gas", name:"N21prFr",value:values["N21prFr"]},
		{key: "Utilities", name:"N22prFr",value:values["N22prFr"]},
		{key: "Construction", name:"N23prFr",value:values["N23prFr"]},
		{key: "Manufacturing", name:"N3133prFr",value:values["N3133prFr"]},
		{key: "Wholesale trade", name:"N41prFr",value:values["N41prFr"]},
		{key: "Retail trade", name:"N4445prFr",value:values["N4445prFr"]},
		{key: "Transportation, warehousing", name:"N4849prFr",value:values["N4849prFr"]},
		{key: "Information, cultural industries", name:"N51prFr",value:values["N51prFr"]},
		{key: "Finance, insurance", name:"N52prFr",value:values["N52prFr"]},
		{key: "Real estate, rental, leasing", name:"N53prFr",value:values["N53prFr"]},
		{key: "Profesional scientific, technical services", name:"N54prFr",value:values["N54prFr"]},
		{key: "Management companies, enterprises", name:"N55prFr",value:values["N55prFr"]},
		{key: "Admin. support, waste manag., remed. services", name:"N56prFr",value:values["N56prFr"]},
		{key: "Educational services", name:"N61prFr",value:values["N61prFr"]},
		{key: "Health care, social assistance", name:"N62prFr",value:values["N62prFr"]},
		{key: "Arts, entertainment, recreation", name:"N71prFr",value:values["N71prFr"]},
		{key: "Accommodation, food services", name:"N72prFr",value:values["N72prFr"]},
		{key: "Other services (except pub. admin.)", name:"N81prFr",value:values["N81prFr"]},
		{key: "Public administration", name:"N91prFr",value:values["N91prFr"]}
	];

             data.sort(function(a,b) {
				  return a.value < b.value ? 1 : -1;
			});

	data = data.slice(0,10);

	var margin = {top: 70, right: 50, bottom: 20, left: 50},
		width = 405 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		//.domain([0, d3.max(data, function(d){return d.value;})]) //set input to data
		.domain([0, 100]) //set input to a scale of 0 - 1. The index has a score scale of 0 to 1. makes the bars more accurate for comparison.
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.name; }))
		.rangeRoundBands([0, height], 0.3);

	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartJVNaics", true);

	var bar2 = svg.selectAll("g.bar2")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar2")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#dddddd")
		.attr("width", 300)

	bar.append("rect")
		.attr("height", y.rangeBand()- 15)
		.attr("fill", "#B44978")
		.attr("width", function(d){return x(d.value);});

	bar.append("text")
		.attr("class", "textVal")
		.attr("x", width + margin.right)
		.attr("y", y.rangeBand() - 20)
		.text(function(d) { return d.value + " %"; })
		.attr("text-anchor", "end");

 	bar.append("text")
		.attr("class", "textLab")
		.attr("x", function(d) { return x(d.name) -5 ; })
		.attr("y", y.rangeBand() -40)
		.style("font-size", "15px")
		.text(function(d) { return d.key; });

	svg.append("text")
        .attr("x", width/2)
        .attr("y", 0 - (margin.top / 1.5))
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Employment by industries - Top 10")
	$("#cat1").click(function() {
		var values = feature.properties;
		var dataset = [
		{key: "Agriculture, forestry, fishing, hunting", name:"N11prFr",value:values["N11prFr"]},
		{key: "Mining,quar., oil, gas", name:"N21prFr",value:values["N21prFr"]},
		{key: "Utilities", name:"N22prFr",value:values["N22prFr"]},
		{key: "Construction", name:"N23prFr",value:values["N23prFr"]},
		{key: "Manufacturing", name:"N3133prFr",value:values["N3133prFr"]},
		{key: "Wholesale trade", name:"N41prFr",value:values["N41prFr"]},
		{key: "Retail trade", name:"N4445prFr",value:values["N4445prFr"]},
		{key: "Transportation, warehousing", name:"N4849prFr",value:values["N4849prFr"]},
		{key: "Information, cultural industries", name:"N51prFr",value:values["N51prFr"]},
		{key: "Finance, insurance", name:"N52prFr",value:values["N52prFr"]},
		{key: "Real estate, rental, leasing", name:"N53prFr",value:values["N53prFr"]},
		{key: "Professional scientific, technical services", name:"N54prFr",value:values["N54prFr"]},
		{key: "Management companies, enterprises", name:"N55prFr",value:values["N55prFr"]},
		{key: "Admin. support, waste manag., remed. services", name:"N56prFr",value:values["N56prFr"]},
		{key: "Educational services", name:"N61prFr",value:values["N61prFr"]},
		{key: "Health care, social assistance", name:"N62prFr",value:values["N62prFr"]},
		{key: "Arts, entertainment, recreation", name:"N71prFr",value:values["N71prFr"]},
		{key: "Accommodation, food services", name:"N72prFr",value:values["N72prFr"]},
		{key: "Other services (except pub. admin.)", name:"N81prFr",value:values["N81prFr"]},
		{key: "Public administration", name:"N91prFr",value:values["N91prFr"]}
		];

		dataset.sort(function(a,b) {
				  return a.value < b.value ? 1 : -1;
		});
		dataset = dataset.slice(0,10);

				//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", width + margin.right)
				.attr("y", y.rangeBand() - 20)
				.text(function(d) { return d.value + " %"; })
				.style("text-anchor", "end");

			svg.selectAll(".textLab")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", function(d) { return x(d.name) -5 ; })
				.attr("y", y.rangeBand() -40)
				.text(function(d) { return d.key; });
	});
	$("#cat2").click(function(){
		var values = feature.properties;
		var dataset = [
		{key: "Agriculture, forestry, fishing, hunting", name:"N11prEn",value:values["N11prEn"]},
		{key: "Mining, quar., oil, gas", name:"N21prEn",value:values["N21prEn"]},
		{key: "Utilities", name:"N22prEn",value:values["N22prEn"]},
		{key: "Construction", name:"N23prEn",value:values["N23prEn"]},
		{key: "Manufacturing", name:"N3133prEn",value:values["N3133prEn"]},
		{key: "Wholesale trade", name:"N41prEn",value:values["N41prEn"]},
		{key: "Retail trade", name:"N4445prEn",value:values["N4445prEn"]},
		{key: "Transportation, warehousing", name:"N4849prEn",value:values["N4849prEn"]},
		{key: "Information, cultural industries", name:"N51prEn",value:values["N51prEn"]},
		{key: "Finance, insurance", name:"N52prEn",value:values["N52prEn"]},
		{key: "Real estate, rental, leasing", name:"N53prEn",value:values["N53prEn"]},
		{key: "Profesional scientific, technical services", name:"N54prEn",value:values["N54prEn"]},
		{key: "Management companies,enterprises", name:"N55prEn",value:values["N55prEn"]},
		{key: "Admin. support, waste manag., remed. services", name:"N56prEn",value:values["N56prEn"]},
		{key: "Educational services", name:"N61prEn",value:values["N61prEn"]},
		{key: "Health care, social assistance", name:"N62prEn",value:values["N62prEn"]},
		{key: "Arts, entertainment, recreation", name:"N71prEn",value:values["N71prEn"]},
		{key: "Accommodation, food services", name:"N72prEn",value:values["N72prEn"]},
		{key: "Other services (except pub. admin.)", name:"N81prEn",value:values["N81prEn"]},
		{key: "Public administration", name:"N91prEn",value:values["N91prEn"]}
		];

		dataset.sort(function(a,b) {
				  return a.value < b.value ? 1 : -1;
		});
		dataset = dataset.slice(0,10);

			//Update all rects
			svg.selectAll(".bar rect")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("width", function(d){return x(d.value);});

			svg.selectAll(".textVal")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", width + margin.right)
				.attr("y", y.rangeBand() - 20)
				.text(function(d) { return d.value + " %"; })
				.style("text-anchor", "end");

			svg.selectAll(".textLab")
				.data(dataset)
				.transition()
				.delay(function (d,i){ return i * 80;})
				.duration(350)
				.attr("x", function(d) { return x(d.name) -5 ; })
				.attr("y", y.rangeBand() -40)
				.text(function(d) { return d.key; });
	});
}


var legendEdOL = L.control({position: 'bottomright'});
	legendEdOL.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>OLM proportion with university</strong>'],
			lower = [0, 6.9, 20.9, 36.9, 59.3],
			upper = [6.8, 20.8, 36.8, 59.2, 100];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorEdOL(lower[i] + 1) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendEdTot = L.control({position: 'bottomright'});
	legendEdTot.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Proportion with university degree</strong>'],
			lower = [0, 6.4, 14.1, 20.5, 28.7],
			upper = [6.3, 14.0, 20.4, 28.6, 43.5];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorEdTot(lower[i] + 1) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendOL = L.control({position: 'bottomright'});
	legendOL.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Official language minorities</strong>'],
			lower = [0, 10, 51, 101, 201, 501, 1001, 5001,10001],
			upper = [0, 50, 100, 200, 500, 1000, 5000, 10000,"plus"];


		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorOL(lower[i] + 1) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
return div;
};

var legendSE = L.control({position: 'bottomright'});
	legendSE.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend');
	labels = ['<strong>Skills equilibrium</strong>'],
	categories = ['High Skills','Low Skills','Skills Gaps','Skills Surplus'];

	for (var i = 0; i < categories.length; i++) {
		div.innerHTML +=
		labels.push(
			'<i style="background:' + getColorSE(categories[i]) + '"></i> ' +
			(categories[i] ? categories[i] : '+'));
	}
	div.innerHTML = labels.join('<br>');
return div;
};

var legendOW = L.control({position: 'bottomright'});
	legendOW.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>55-64 unemployment rate</strong>'],
			lower = [0, 6, 11, 17, 28],
			upper = [5, 10, 16, 27, 70];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorOW(lower[i] + 1) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendYouth = L.control({position: 'bottomright'});
	legendYouth.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>15-30 unemployment rate</strong>'],
			lower = [2, 12, 19, 30, 57],
			upper = [11, 18, 29, 56, 91];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorYouth(lower[i] + 1) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendInd = L.control({position: 'bottomright'});
	legendInd.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Economic health index</strong>'],
			lower = [0, 0.16, 0.33, 0.44, 0.51],
			upper = [0.15, 0.32, 0.43, 0.50, 0.68];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorInd(lower[i]) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendLFOLM = L.control({position: 'bottomright'});
	legendLFOLM.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>OLM labour force</strong>'],
			lower = [0, 1, 91, 391, 1556],
			upper = [0, 90, 390, 1555, 735765];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorLFOLM(lower[i]) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendOLMPer = L.control({position: 'bottomright'});
	legendOLMPer.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>OLM %</strong>'],
			lower = [0.0, 0.1, 1.7, 6.5, 14.4, 30.6, 57.8],
			upper = [0.0, 1.6, 6.4, 14.3, 30.5, 57.7, 97.4];


		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorOLMPer(lower[i]) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
return div;
};


var OL  = L.geoJson(slaData, {
	style: styleOL,
	onEachFeature: onEachFeatureOL
}).on('click', function () {
sidebar.show()});

var EdOL  = L.geoJson(slaData, {
	style: styleEdOL,
	onEachFeature: onEachFeatureEdOL
}).on('click', function () {
sidebar.show()});

var OLMPer  = L.geoJson(slaData, {
	style: styleOLMPer,
	onEachFeature: onEachFeatureOLMPer
}).on('click', function () {
sidebar.show()});

var YouthMLO  = L.geoJson(slaData, {
	style: styleYouthMLO,
	onEachFeature: onEachFeatureYouthMLO
}).on('click', function () {
sidebar.show()});

var OWMLO  = L.geoJson(slaData, {
	style: styleOWMLO,
	onEachFeature: onEachFeatureOWMLO
}).on('click', function () {
sidebar.show()});

var LFOLM  = L.geoJson(slaData, {
	style: styleLFOLM,
	onEachFeature: onEachFeatureLFOLM
}).on('click', function () {
sidebar.show()});

var EdTot  = L.geoJson(slaData, {
	style: styleEdTot,
	onEachFeature: onEachFeatureEdTot
}).on('click', function () {
sidebar.show()});

var OW  = L.geoJson(slaData, {
	style: styleOW,
	onEachFeature: onEachFeatureOW
}).on('click', function () {
sidebar.show()});

var Youth  = L.geoJson(slaData, {
	style: styleYouth,
	onEachFeature: onEachFeatureYouth
}).on('click', function () {
sidebar.show()});

var Ind = L.geoJson(slaData, {
	style: styleInd,
	onEachFeature: onEachFeatureInd
}).addTo(map).on('click', function () {
sidebar.show()});

var SE  = L.geoJson(slaData, {
	style: styleSE,
	onEachFeature: onEachFeatureSE
}).on('click', function () {
sidebar.show()});


var highlight = L.geoJson(null).addTo(map);
var highlightStyle = {
  stroke: false,
  fillColor: "#06bee1",
  fillOpacity: 0.7,
  radius: 10
};


var CSJProjects = L.geoJson(CSJ2014, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties.OrgName,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
	 layer.on({
		click: function (e) {
		highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
		}
	 });
	var CSJPopup =
		'<strong>Organization: ' + feature.properties.OrgName + '</strong>' +
		'<br /><br />Type: ' + feature.properties.Organiza_1 +
		'<br />Expenditures: $' + format(feature.properties.Expend) +
		'<br />Number of participants: ' + feature.properties.Partic;

	var popup = L.popup({
		keepInView: true
		}).setContent(CSJPopup);
	layer.bindPopup(popup);
  }
}).addTo(CSJmarkers).on('click', function () {
sidebar.show()});

var baseMaps = {
	"Official language minorities": OL,
	"OLM percentage": OLMPer,
	"OLM educational attainment": EdOL,
	"OLM Older workers": OWMLO,
	"OLM Youth (15-30)": YouthMLO,
	"OLM labour force and employment by industry": LFOLM,
	"Educational attainment": EdTot,
	"Older workers": OW,
	"Youth (15-30)": Youth,
	"Skills equilibrium": SE,
	"Economic performance index": Ind
};

var overlays = {
	"CSJ2014": CSJmarkers
};

L.control.layers(baseMaps, overlays).addTo(map);
legendInd.addTo(map);
currentLegend = legendInd;

map.on('baselayerchange', function (eventLayer) {
	if (eventLayer.name === 'Economic performance index') {
		map.removeControl(currentLegend);
		currentLegend = legendInd;
		legendInd.addTo(map);
	}
	else if (eventLayer.name === 'OLM educational attainment') {
		map.removeControl(currentLegend);
		currentLegend = legendEdOL;
		legendEdOL.addTo(map);
	}
	else if (eventLayer.name === 'Educational attainment') {
		map.removeControl(currentLegend);
		currentLegend = legendEdTot;
		legendEdTot.addTo(map);
	}
	else if (eventLayer.name === 'Skills equilibrium') {
		map.removeControl(currentLegend );
		currentLegend = legendSE;
		legendSE.addTo(map);
	}
	else if  (eventLayer.name === 'Older workers') {
	   map.removeControl(currentLegend );
		currentLegend = legendOW;
	   legendOW.addTo(map);
	}
	else if  (eventLayer.name === 'OLM Older workers') {
	   map.removeControl(currentLegend );
		currentLegend = legendOW;
	   legendOW.addTo(map);
	}
	else if  (eventLayer.name === 'Youth (15-30)') {
	   map.removeControl(currentLegend );
		currentLegend = legendYouth;
	   legendYouth.addTo(map);
	}
	else if  (eventLayer.name === 'OLM Youth (15-30)') {
	   map.removeControl(currentLegend );
		currentLegend = legendYouth;
	   legendYouth.addTo(map);
	}
	else if  (eventLayer.name === 'Official language minorities') {
		map.removeControl(currentLegend );
		currentLegend = legendOL;
		legendOL.addTo(map);
	}
	else if  (eventLayer.name === 'OLM percentage') {
		map.removeControl(currentLegend );
		currentLegend = legendOLMPer;
		legendOLMPer.addTo(map);
	}
	else if  (eventLayer.name === 'OLM labour force and employment by industry') {
		map.removeControl(currentLegend );
		currentLegend = legendLFOLM;
		legendLFOLM.addTo(map);
	}
  });



// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
