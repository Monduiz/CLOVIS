var featureList, CSJSearch = [];

$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 50; // Calculate the top offset
    $('#map').css('height', (h - offsetTop));
}).resize();

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

function clearHighlight() {
  highlight.clearLayers();
}

var map = L.map('map').setView([55, -95], 4);
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

var frCA = d3.locale({
  decimal: ",",
  thousands: "\xa0",
  grouping: [3],
  currency: ["", "$"],
  dateTime: "%a %e %b %Y %X",
  date: "%Y-%m-%d",
  time: "%H:%M:%S",
  periods: ["", ""],
  days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  shortDays: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
  months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  shortMonths: ["jan", "fév", "mar", "avr", "mai", "jui", "jul", "aoû", "sep", "oct", "nov", "déc"]
});

var format = frCA.numberFormat("n");

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
	maxZoom: 18
}).addTo(map);

//Geocoder: search for addresses
new L.Control.GeoSearch({
	provider: new L.GeoSearch.Provider.Google(),
	position: 'bottomleft',
	retainZoomLevel: true
}).addTo(map);

// control that shows LMA info on hover
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML =(props ?
		'<b>' + props.SLAName + '</b><br />'
		: 'Survolez une aire');
};
info.addTo(map);

//get color OL Education
function getColorEdOL(d) {
	return d >= 59.3 && d <= 100.0	? '#810f7c':
		   d >= 36.9 && d <= 59.2	? '#8856a7':
		   d >= 20.9 && d <= 36.8	? '#8c96c6':
		   d >= 6.9 && d <= 20.8	? '#b3cde3':
		   d >= 0.0 && d <= 6.8		? '#edf8fb':
											 '';
}

function getColorEdOLleg(d) {
	if(d == '6,9') d = 6.9; //Wassim's awesome solution
	if(d == '59,3') d = 59.3; //Wassim's awesome solution
	var color = d >= 59.3 && d <= 100.0	? '#810f7c':
		   d >= format(36.9) && d <= format(59.2)	? '#8856a7':
		   d >= format(20.9) && d <= format(36.8)	? '#8c96c6':
		   d >= 6.9 && d <= 20.8	? '#b3cde3':
		   d >= format(0.0) && d <= format(6.8)		? '#edf8fb':
											 '';
		return color;
}

//get color Education total
function getColorEdTot(d) {
	return d >= 28.7 && d <= 43.5	? '#980043':
		   d >= 20.5 && d <= 28.6	? '#dd1c77':
		   d >= 14.1 && d <= 20.4	? '#df65b0':
		   d >= 6.4 && d <= 14.0	? '#d7b5d8':
									  '#f1eef6';
}

//get color Education total legend
function getColorEdTotLeg(d) {
	//console.log(d);
	if(d == '6,4') d = 6.4; //Wassim's awesome solution
	var color = d >= format(28.7) && d <= format(43.5)	? '#980043':
		   d >= format(20.5) && d <= format(28.6)	? '#dd1c77':
		   d >= format(14.1) && d <= format(20.4)	? '#df65b0':
		   d >= 6.4 && d <= 14.0	? '#d7b5d8':
											 '#f1eef6';
											 
	//console.log('For ',d,' we have color: ', color,'Is d >= format(6.4)) True? ',d >= format(6.4), 'And is d <= format(14.0) ?',d <= format(14.0),'format(14.0) is: ',format(14.0));
	
	
	return color;										 
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
	return d === 'Équilibre haut'    ? '#66c2a5' :
		   d === 'Équilibre bas'     ? '#fc8d62' :
		   d === 'Pénuries'    	 	 ? '#8da0cb' :
		   d === 'Surplus' 			 ? '#e78ac3' :
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

//Get color for Index map
function getColorIndMap(d) {
	return  d >= 0.51               ? '#7a0177' :
			d >= 0.44 && d <= 0.50  ? '#c51b8a' :
			d >= 0.33 && d <= 0.43  ? '#f768a1' :
			d >= 0.16 && d <= 0.32  ? '#fbb4b9' :
									  '#feebe2' ;  
}

//Get color for Index legend
function getColorIndLeg(d) {
	return  d >= format(0.51)               ? '#7a0177' :
			d >= format(0.44) && d <= format(0.50)  ? '#c51b8a' :
			d >= format(0.33) && d <= format(0.43)  ? '#f768a1' :
			d >= format(0.16) && d <= format(0.32)  ? '#fbb4b9' :
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
		fillColor: getColorSE(feature.properties.EC)
	};
}

//Style for OW MLO
function styleOWMLO(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorOW(feature.properties.UR55_64Fr)
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

//Style for Youth MLO
function styleYouthMLO(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorYouth(feature.properties.UR15_30Fr)
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
							   
//Style for Index
function styleInd(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7,
		fillColor: getColorIndMap(feature.properties.EcPerfInd)
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

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#FFF',
		dashArray: '',
		fillOpacity: 0.7
	});
	info.update(layer.feature.properties);
}


//Reset for OL education
function resetHighlightEdOL(e) {
	EdOL.resetStyle(e.target);
	info.update();
}

//Reset for Education total
function resetHighlightEdTot(e) {
	EdTot.resetStyle(e.target);
	info.update();
}

//Reset for OL
function resetHighlightOL(e) {
	OL.resetStyle(e.target);
	info.update();
}

//Reset for SE
function resetHighlightSE(e) {
	SE.resetStyle(e.target);
	info.update();
}

//Reset for OW
function resetHighlightOW(e) {
	OW.resetStyle(e.target);
	info.update();
}

//Reset for OWMLO
function resetHighlightOW(e) {
	OWMLO.resetStyle(e.target);
	info.update();
}

//Reset for Youth
function resetHighlightYouth(e) {
	Youth.resetStyle(e.target);
	info.update();
}

//Reset for YouthMLO
function resetHighlightYouthMLO(e) {
	YouthMLO.resetStyle(e.target);
	info.update();
}

//Reset for Index
function resetHighlightInd(e) {
	Ind.resetStyle(e.target);
	info.update();
}

//Reset for LF OLM
function resetHighlightLFOLM(e) {
	LFOLM.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeatureEdOL(feature, layer) {
				layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlightEdOL,
			  click: function (e) {
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
				$('#ExtraChart').append(div2);
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
			
	
    var values = feature.properties;              
	var data = [
		{name:"Aucun diplôme",value:values["NoDipOL"]},
		{name:"Aucun diplôme",value:values["NoDipNOL"]},
		{name:"Secondaire",value:values["HSOL"]},
		{name:"Secondaire",value:values["HSNOL"]},
		{name:"Collégial",value:values["ColOL"]},
		{name:"Collégial",value:values["ColNOL"]},
		{name:"Universitaire",value:values["UnOL"]},
		{name:"Universitaire",value:values["UnNOL"]}
	];
	
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
	
	var div3 = format(feature.properties.EdTotOL) +
			"<br/>" + "MLO PAR ÉDUCATION"
			
	var div4 = format(feature.properties.EdTotNOL) +
			"<br/>" + "NON-MLO PAR ÉDUCATION"
			
	var div = $('<div class="popupGraph" style="width: 400px; height:270px;"><svg/></div>')[0];
            
    var values = feature.properties;              
	var data = [
		{name:"Aucun diplôme",value:values["NoDipOL"]},
		{name:"Secondaire",value:values["HSOL"]},
		{name:"Collégial",value:values["ColOL"]},
		{name:"Universitaire",value:values["UnOL"]}
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
		.attr("fill", "#EDEDED")
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
		.attr("x", function(d) { return x(d.name) -10 ; })
		.attr("y", y.rangeBand()-42)
		//.attr("dy", ".35em")
		.text(function(d) { return d.name; });
	
	svg.append("text")
	  .attr("class", "title")
	  .attr("x", 50)
	  .attr("y", 0 - (margin.top / 2))
	  .attr("text-anchor", "middle")
	  .text("Minorité de LO");
	
	var div2 = $('<div class="popupGraph" style="width: 400px; height:270px;"><svg/></div>')[0];

	var data2 = [
		{name:"Aucun diplôme",value:values["NoDipNOL"]},
		{name:"Secondaire",value:values["HSNOL"]},
		{name:"Collégial",value:values["ColNOL"]},
		{name:"Universitaire",value:values["UnNOL"]}
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

	var svg = d3.select(div2).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chartInd", true);
		
	var bar2 = svg.selectAll("g.bar")
		.data(data2)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
	
	var bar = svg.selectAll("g.bar")
		.data(data2)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
	
	bar2.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#EDEDED")
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
	
	 svg.append("text")
	  .attr("class", "title")
	  .attr("x", 50)
	  .attr("y", 0 - (margin.top / 2))
	  .attr("text-anchor", "middle")
	  .text("Majorité de LO");
	
}

function onEachFeatureEdTot(feature, layer) {
				layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlightEdTot,
					  click: function (e) {
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
			
	var div = $('<div class="popupGraph" style="width: 350px; height:300px;"><svg/></div>')[0];
			
    var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
	
	var div2 = format(feature.properties.EdTot) +
			"<br/>" + "POPULATION PAR ÉDUCATION"
	
	var div = $('<div class="popupGraph" style="width: 400px; height:300px;"><svg/></div>')[0];
    
    var values = feature.properties;              
	var data = [
		{name:"Aucun diplôme",value:values["NoDipprTot"]},
		{name:"Secondaire",value:values["HSprTot"]},
		{name:"Collégial",value:values["ColprTot"]},
		{name:"Universitaire",value:values["UnprTot"]}
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
		.attr("fill", "#EDEDED")
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
		mouseover: highlightFeature,
		mouseout: resetHighlightOL,
		click: function (e) {
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
	
var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'

	var div2 = format(feature.properties.AvEmIncOL) + " $" +
			"<br/>" + "MLO REVENU"
			
	var div3 = format(feature.properties.AvEmIncTot) + " $" +
			"<br/>" + "REVENU TOTAL"
			
	var div4 = format(feature.properties.PopOLM) +
			"<br/>" + "POPULATION MLO"
			
	var div5 = format(feature.properties.OLMPerc) + " %" +
			"<br/>" + "POURCENTAGE MLO"
	
	var div6 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION"
	
var div = $('<div class="popupGraph" style="width: 395px; height:275px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Taux d'emploi",value:values["EROLM"]},
		{name:"Taux de participation",value:values["PROL"]},
		{name:"Taux de chômage",value:values["UROL"]}
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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

function onEachFeatureSE(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightSE,
				click: function (e) {
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
	
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>' + '<br/>'
		
	var div2 = feature.properties.EC + 
			"<br/>" + "ÉQUILIBRE DE COMPÉTENCES"
			
	var div3 = format(feature.properties.AvEmIncTot) + " $" +
			"<br/>" + "REVENU MOYEN D'EMPLOI"
}

function onEachFeatureOWMLO(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightOW,
		       click: function (e) {
				   zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
                $('#ExtraChart').append(div2);
				$('#chart2').empty();
				$('#chart2').append(div3);
				$('#chart3').empty();
				$('#chart3').append(div4);
				$('#chart4').empty();
				$('#chart4').append(div5);
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});
	
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
		
	var div3 = format(feature.properties.PopOWFr) +
			"<br/>" + "POPULATION (55-64) MLO"
	var div4 = format(feature.properties.PopOWEn) +
			"<br/>" + "POPULATION (55-64) NON-MLO"
	var div5 = format(feature.properties.URTot) + " %" +
			"<br/>" + "TAUX DE CHÔMAGE 15 ET PLUS"
	
	var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

	var values = feature.properties;
	var data = [
		{name:"Taux d'emploi (55-64)",value:values["ER55_64Fr"]},
		{name:"Taux de participation (55-64)",value:values["PR55_64Fr"]},
		{name:"Taux de chômage (55-64)",value:values["UR55_64Fr"]}
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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
	
	var div2 = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

	var values = feature.properties;
	var data = [
		{name:"Taux d'emploi (65 plus)",value:values["ER65PFr"]},
		{name:"Taux de participation (65 plus)",value:values["PR65Pfr"]},
		{name:"Taux de chômage (65 plus)",value:values["UR65PFr"]}
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

	var svg = d3.select(div2).select("svg")
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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


function onEachFeatureOW(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightOW,
		click: function (e) {
                zoomToFeature(e);
				$('#AreaName').empty();
                $('#AreaName').append(AreaName);
                $('#chart').empty();
                $('#chart').append(div);
				$('#ExtraChart').empty();
                $('#ExtraChart').append(div2);
				$('#chart2').empty();
				$('#chart2').append(div3);
				$('#chart3').empty();
				$('#chart3').append(div4);
				$('#chart4').empty();
				$('#chart4').append(div5);
				$('#chart5').empty();
				$('#chart6').empty();
				$('#chart7').empty();
				$('#chart8').empty();
			}
	});
	
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
		
	var div3 = format(feature.properties.PopOWTot) +
			"<br/>" + "POPULATION (55-64)"
	var div4 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION"
	var div5 = format(feature.properties.URTot) + " %" +
			"<br/>" + "TAUX DE CHÔMAGE 15 ET PLUS"
	
	var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

	var values = feature.properties;
	var data = [
		{name:"Taux d'emploi (55-64)",value:values["ER55_64Tot"]},
		{name:"Taux de participation (55-64)",value:values["PR55_64Tot"]},
		{name:"Taux de chômage (55-64)",value:values["UR55_64Tot"]}
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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
	
	var div2 = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

	var values = feature.properties;
	var data = [
		{name:"Taux d'emploi (65 plus)",value:values["ER65PTot"]},
		{name:"Taux de participation (65 plus)",value:values["PR65PTot"]},
		{name:"Taux de chômage (65 plus)",value:values["UR65PTot"]}
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

	var svg = d3.select(div2).select("svg")
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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
		mouseover: highlightFeature,
		mouseout: resetHighlightYouthMLO,
			click: function (e) {
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
var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
		
	var div3 = format(feature.properties.PopYFr) +
			"<br/>" + "POPULATION JEUNES MLO (15-30)"
	var div4 = format(feature.properties.URTot) + " %" +
			"<br/>" + "TAUX DE CHÔMAGE 15 ET PLUS"
	
var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Taux d'emploi (15-30)",value:values["ER15_30Fr"]},
		{name:"Taux de participation (15-30)",value:values["PR15_30Fr"]},
		{name:"Taux de chômage (15-30)",value:values["UR15_30Fr"]}
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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

function onEachFeatureYouth(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightYouth,
				click: function (e) {
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
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
		
	var div3 = format(feature.properties.PopYTot) +
			"<br/>" + "POPULATION JEUNES (15-30)"
	var div4 = format(feature.properties.URTot) + " %" +
			"<br/>" + "TAUX DE CHÔMAGE 15 ET PLUS"
	
var div = $('<div class="popupGraph" style="width: 395px; height:270px;"><svg/></div>')[0];

var values = feature.properties;
	var data = [
		{name:"Taux d'emploi (15-30)",value:values["ER15_30Tot"]},
		{name:"Taux de participation (15-30)",value:values["PR15_30Tot"]},
		{name:"Taux de chômage (15-30)",value:values["UR15_30Tot"]}
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
		.attr("fill", "#EDEDED")
		.attr("width", 300);
	
	bar.append("rect")
		.attr("height", y.rangeBand()-15)
		.attr("fill", "#B44978")
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
		mouseover: highlightFeature,
		mouseout: resetHighlightInd,
			click: function (e) {
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
	
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
	var div2 = format(feature.properties.EcPerfInd) +
			"<br/>" + "SANTÉ ÉCONOMIQUE";
	
	var div3 = format(feature.properties.PopTot) +
			"<br/>" + "POPULATION";
			
	var div4 = "Chaque dimension prend une valeur de 0 à 1. 0 " + 
				"indique le résultat le moins favorable" + 
				" et 1 indique le résultat le plus favorable.";
	
	
	var div = $('<div class="popupGraph" style="width: 395px; height:400px;"><svg/></div>')[0];
	
	
	var values = feature.properties;
	var data = [
		{name:"Éducation",value:values["Educ"]},
		{name:"Revenus",value:values["Earnings"]},
		{name:"Industries",value:values["Ind"]},
		{name:"Logement",value:values["Housing"]},
		{name:"Isolement",value:values["AccToSer"]},
		{name:"Emplois",value:values["LabMarPres"]}
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
		.attr("fill", "#EDEDED")
		.attr("width", 300)
	
	
	bar.append("rect")
		.attr("height", y.rangeBand()- 15)
		.attr("fill", "#B44978")
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
				mouseover: highlightFeature,
				mouseout: resetHighlightLFOLM,
					click: function (e) {
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
			
	var AreaName = '<b><h2>' + feature.properties.SLAName + '</h2></b>'
	var div2 = format(feature.properties.NTotFr) +
			"<br/>" + "MLO PAR INDUSTRIE"
	var div3 = format(feature.properties.NTotEn) +
			"<br/>" + "NON-MLO PAR INDUSTRIE"
	
	var div = $('<div class="popupGraph" style="width: 475px; height:350px;"><svg/></div>')[0];
		     
    var values = feature.properties;              
	var data = [
        {key: "Agric.,foresterie., pêche.,chasse", name:"N11prFr",value:values["N11prFr"]},
		{key: "Agric.,foresterie., pêche.,chasse", name:"N11prEn",value:values["N11prEn"]},
		{key: "Extraction minière,carrière, pétrole,gaz", name:"N21prFr",value:values["N21prFr"]},
		{key: "Extraction minière,carrière, pétrole,gaz", name:"N21prEn",value:values["N21prEn"]},
		{key: "Services publics", name:"N22prFr",value:values["N22prFr"]},
		{key: "Services publics", name:"N22prEn",value:values["N22prEn"]},
		{key: "Construction", name:"N23prFr",value:values["N23prFr"]},
		{key: "Construction", name:"N23prEn",value:values["N23prEn"]},
		{key: "Fabrication", name:"N3133prFr",value:values["N3133prFr"]},
		{key: "Fabrication", name:"N3133prEn",value:values["N3133prEn"]},
		{key: "Commerce gros", name:"N41prFr",value:values["N41prFr"]},
		{key: "Commerce gros", name:"N41prEn",value:values["N41prEn"]},
		{key: "Commerce détail", name:"N4445prFr",value:values["N4445prFr"]},
		{key: "Commerce détail", name:"N4445prEn",value:values["N4445prEn"]},
		{key: "Transport, entreposage", name:"N4849prFr",value:values["N4849prFr"]},
		{key: "Transport, entreposage", name:"N4849prEn",value:values["N4849prEn"]},
		{key: "Information, industrie culturelle", name:"N51prFr",value:values["N51prFr"]},
		{key: "Information, industrie culturelle", name:"N51prEn",value:values["N51prEn"]},
		{key: "Finance, assurances", name:"N52prFr",value:values["N52prFr"]},
		{key: "Finance, assurances", name:"N52prEn",value:values["N52prEn"]},
		{key: "Services immobiliers", name:"N53prFr",value:values["N53prFr"]},
		{key: "Services immobiliers", name:"N53prEn",value:values["N53prEn"]},
		{key: "Services.prof., scientifiques, techniques.", name:"N54prFr",value:values["N54prFr"]},
		{key: "Services.prof., scientifiques, techniques.", name:"N54prEn",value:values["N54prEn"]},
		{key: "Gestion sociétés, entreprises", name:"N55prFr",value:values["N55prFr"]},
		{key: "Gestion sociétés, entreprises", name:"N55prEn",value:values["N55prEn"]},
		{key: "Services.admin., soutien,déchets, assainissement", name:"N56prFr",value:values["N56prFr"]},
		{key: "Services.admin., soutien,déchets, assainissement", name:"N56prEn",value:values["N56prEn"]},
		{key: "Services d'enseignement", name:"N61prFr",value:values["N61prFr"]},
		{key: "Services d'enseignement", name:"N61prEn",value:values["N61prEn"]},
		{key: "Santé, assistance sociale", name:"N62prFr",value:values["N62prFr"]},
		{key: "Santé, assistance sociale", name:"N62prEn",value:values["N62prEn"]},
		{key: "Arts, spectacles, loisirs", name:"N71prFr",value:values["N71prFr"]},
		{key: "Arts, spectacles, loisirs", name:"N71prEn",value:values["N71prEn"]},
		{key: "Hébergement, restauration", name:"N72prFr",value:values["N72prFr"]},
		{key: "Hébergement, restauration", name:"N72prEn",value:values["N72prEn"]},
		{key: "Autres.services (sauf.admin. publ.)", name:"N81prFr",value:values["N81prFr"]},
		{key: "Autres.services (sauf.admin. publ.)", name:"N81prEn",value:values["N81prEn"]},
		{key: "Administrations publiques", name:"N91prFr",value:values["N91prFr"]},
		{key: "Administrations publiques", name:"N91prEn",value:values["N91prEn"]}
	];

	 var tmp = d3.nest().key(function(d){
                return d.key;
            }).entries(data);
            console.log(tmp);
            
            tmp.sort(function(a,b){
               return (d3.max([a.values[0].value,
                       a.values[1].value]) > 
                 d3.max([b.values[0].value,
                        b.values[1].value])) ? -1 : 1;
            });
            
            data = [];
            domain = [];
            tmp.forEach(function(d){
                domain.push(d.key);
                data.push(d.values[0]);
                data.push(d.values[1]);
            });
            
     data = data.slice(0,10);
    
	var Colors =  ["#E65F9F", "#B64B7A"];
     var ColorNames = ["Francophones", "Anglophones"];
	
	var margin = {top: 45, right: 30, bottom: 30, left: 135},
		width = 450 - margin.left - margin.right,
		height = 345 - margin.top - margin.bottom,
		barHeight = height / data.length;

	// Scale for X axis
	var x = d3.scale.linear()
		.domain([0, d3.max(data, function(d){return d.value;})])
		.range([0, width]);
	
	var y = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.key; }))
		.rangeRoundBands([0, height], .1);
            
	var y1 = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.name; }))
		.rangeRoundBands([0, height], .1);
	
	//y axis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
        .outerTickSize(0);
		
	var svg = d3.select(div).select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.classed("chart", true);
	
	
	svg.append("g")
		.attr("class", "y axisEmpInd")
		.call(yAxis);
		
	var bar = svg.selectAll("g.bar")
		.data(data)
		.enter()
		.append("g")
	
	bar.append("rect")
          .attr("y", function(d, i) { 
            return i % 2 === 0 ? y(d.key) : y(d.key) + y.rangeBand()/2;})
		  .attr("width", function(d){return x(d.value);})
		  .attr("fill", function(d, i) {
            if(d.name.indexOf("En") > -1) {
                return  Colors[1];
            } 
            else {
                return Colors[0];
            } 
        }) //Alternate colors
		.attr("height", y.rangeBand() / 2);
	
	bar.append("text")
		.attr("class", "text")
		.attr("x", function(d) { return x(d.value) - 3; })
		.attr("y", function(d, i) { 
            return  i % 2 === 0 ? y(d.key) : y(d.key) + y.rangeBand()/2;})
		.attr("dy", "1.2em")
		.text(function(d) { return d.value; })
		.attr("fill", "white")
		.attr("font-family", "sans-serif")
		.attr("font-size", "14px")
		.attr("text-anchor", "end");
  
     // add legend   
    var legend = svg.append("g")
        .attr("class", "legendEdOL")
        .attr("x", width - 45)
        .attr("height", 50)
        .attr("width", 100)
        .attr('transform', 'translate(40,275)');
		
	var legend2 = svg.append("g")
        .attr("class", "legendEdOL")
        .attr("x", width - 45)
        .attr("height", 50)
        .attr("width", 100)
        .attr('transform', 'translate(40,275)');
  
    legend.selectAll('rect')
        .data(Colors)
        .enter()
        .append("rect")
        .attr("x", - 55)
        .attr("width", 10)
        .attr("height", 10)
        .attr("y", 5)
        .style("fill", function(d) { return Colors[0]; });
	
	legend2.selectAll('rect')
        .data(Colors)
        .enter()
        .append("rect")
        .attr("x", 80)
		.attr("width", 10)
        .attr("height", 10)
        .attr("y", 5)
        .style("fill", function(d) { return Colors[1]; });
    
   legend.selectAll('text')
        .data(ColorNames)
        .enter()
        .append("text")
        .attr("x", -40)
        .attr("y", 15)
        .text(function(d) { return ColorNames[0]; });
			
	legend2.selectAll('text')
        .data(ColorNames)
        .enter()
        .append("text")
        .attr("x", 95)
        .attr("y", 15)
        .text(function(d) { return ColorNames[1]; });
	
	svg.append("text")
	  .attr("class", "title")
	  .attr("x", -9)
	  .attr("y", 0 - (margin.top / 2.25))
	  .attr("text-anchor", "middle")
	  .text("Employment by industry");
		
	var wrap = function (d) {
		var el = d3.select(this);
		var words = d.split(' ');
		el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', -10).attr('dy', '15');
    }
	};
     svg.selectAll('g.y.axisEmpInd g text').each(wrap);
}

//Legends for maps
var legendEdOL = L.control({position: 'bottomright'});
	legendEdOL.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>MLO ayant un diplôme universitaire</strong>'],
			lower = [format(0.0), format(6.9), format(20.9), format(36.9), format(59.3)],
			upper = [format(6.8), format(20.8), format(36.8), format(59.2), format(100.0)];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorEdOLleg(lower[i]) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendEdTot = L.control({position: 'bottomright'});
	legendEdTot.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Proportion avec diplôme universitaire</strong>'],
			lower = [0, format(6.4), format(14.1), format(20.5), format(28.7)],
			upper = [format(6.3), format(14.0), format(20.4), format(28.6), format(43.5)];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorEdTotLeg(lower[i]) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendOL = L.control({position: 'bottomright'});
	legendOL.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Minorités de langues officielles</strong>'],
			lower = [0, 10, 51, 101, 201, 501, 1001, 5001, 10001],
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
	labels = ['<strong>Équilibre de compétences</strong>'],
	categories = ['Équilibre haut','Équilibre bas','Pénuries','Surplus'];
	
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
			labels = ['<strong>Taux de chômage (55-64)</strong>'],
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
			labels = ['<strong>Taux de chômage (15-30)</strong>'],
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
			labels = ['<strong>Index de performance économique</strong>'],
			lower = [0, format(0.16), format(0.33), format(0.44), format(0.51)],
			upper = [format(0.15), format(0.32), format(0.43), format(0.50), format(0.68)];

		for (var i = 0; i < lower.length; i++) {
			div.innerHTML +=
			labels.push(
			 '<i style="background:' + getColorIndLeg(lower[i]) + '"></i> ' +
		 lower[i] + '&ndash;' + upper[i]);
		}
		div.innerHTML = labels.join('<br>');
	return div;
};

var legendLFOLM = L.control({position: 'bottomright'});
	legendLFOLM.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Population active MLO</strong>'],
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

var EdOL  = L.geoJson(slaData, {
	style: styleEdOL,
	onEachFeature: onEachFeatureEdOL
}).on('click', function () {
sidebar.show()});
	
var EdTot  = L.geoJson(slaData, {
	style: styleEdTot,
	onEachFeature: onEachFeatureEdTot
}).on('click', function () {
sidebar.show()});

var OL  = L.geoJson(slaData, {
	style: styleOL,
	onEachFeature: onEachFeatureOL
}).on('click', function () {
sidebar.show()});

var SE  = L.geoJson(slaData, {
	style: styleSE,
	onEachFeature: onEachFeatureSE
}).on('click', function () {
sidebar.show()});

var OW  = L.geoJson(slaData, {
	style: styleOW,
	onEachFeature: onEachFeatureOW
}).on('click', function () {
sidebar.show()});

var OWMLO  = L.geoJson(slaData, {
	style: styleOWMLO,
	onEachFeature: onEachFeatureOWMLO
}).on('click', function () {
sidebar.show()});

var Youth  = L.geoJson(slaData, {
	style: styleYouth,
	onEachFeature: onEachFeatureYouth
}).on('click', function () {
sidebar.show()});

var YouthMLO  = L.geoJson(slaData, {
	style: styleYouthMLO,
	onEachFeature: onEachFeatureYouthMLO
}).on('click', function () {
sidebar.show()});

var Ind = L.geoJson(slaData, {
	style: styleInd,
	onEachFeature: onEachFeatureInd
}).addTo(map).on('click', function () {
sidebar.show()});

var LFOLM  = L.geoJson(slaData, {
	style: styleLFOLM,
	onEachFeature: onEachFeatureLFOLM
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
		'<strong>Organisation: ' + feature.properties.OrgName + '</strong>' +
		'<br /><br />Type: ' + feature.properties.Organiza_1 + 
		'<br />Dépenses: ' + format(feature.properties.Expend) + ' $' +
		'<br />Nombre de participants: ' + feature.properties.Partic;
		CSJSearch.push({
        name: layer.feature.properties.OrgName,
        source: "CSJ2014",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
		var popup = L.popup({
		keepInView: true
		}).setContent(CSJPopup);
	layer.bindPopup(popup);;
  }
}).addTo(CSJmarkers).on('click', function () {
sidebar.show()});

var baseMaps = {
		"Minorités de langues officielles": OL,
		"MLO scolarité": EdOL,
		"Niveau de scolarité": EdTot,
		"Travailleurs âgées de la MLO (55-64)": OWMLO,
		"Travailleurs âgées (55-64)": OW,
		"Jeunes (15-30)": Youth,
		"Jeunes de la MLO (15-30)": YouthMLO,
		"Équilibre de compétences": SE,
		"Index de performance économique": Ind,
		"Population active et emploi par industries": LFOLM
};

var overlays = {
	"EÉC 2014": CSJmarkers
};

L.control.layers(baseMaps, overlays).addTo(map);
legendInd.addTo(map);
currentLegend = legendInd;


map.on('baselayerchange', function (eventLayer) {
	if (eventLayer.name === 'Index de santé économique') {
		map.removeControl(currentLegend);
		currentLegend = legendInd;
		legendInd.addTo(map);
	}
	else if (eventLayer.name === 'MLO scolarité') {
		map.removeControl(currentLegend);
		currentLegend = legendEdOL;
		legendEdOL.addTo(map);
	}
	else if (eventLayer.name === 'Niveau de scolarité') {
		map.removeControl(currentLegend);
		currentLegend = legendEdTot;
		legendEdTot.addTo(map);
	}
	else if (eventLayer.name === 'Équilibre de compétences') {
		map.removeControl(currentLegend );
		currentLegend = legendSE;
		legendSE.addTo(map);
	}
	else if  (eventLayer.name === 'Travailleurs âgées de la MLO (55-64)') {
	   map.removeControl(currentLegend );
		currentLegend = legendOW;
	   legendOW.addTo(map);
	}
	else if  (eventLayer.name === 'Travailleurs âgées (55-64)') {
	   map.removeControl(currentLegend );
		currentLegend = legendOW;
	   legendOW.addTo(map);
	}
	else if  (eventLayer.name === 'Jeunes de la MLO(15-30)') {
	   map.removeControl(currentLegend );
		currentLegend = legendYouth;
	   legendYouth.addTo(map);
	}
	else if  (eventLayer.name === 'Jeunes (15-30)') {
	   map.removeControl(currentLegend );
		currentLegend = legendYouth;
	   legendYouth.addTo(map);
	}
	else if  (eventLayer.name === 'Minorités de langues officielles') {
		map.removeControl(currentLegend );
		currentLegend = legendOL;
		legendOL.addTo(map);
	}
	else if  (eventLayer.name === 'Population active et emploi par industries') {
		map.removeControl(currentLegend );
		currentLegend = legendLFOLM;
		legendLFOLM.addTo(map);
	}
  });
  
 /* Typeahead search functionality */
$(document).ready( function () {
  var CSJProjectsBH = new Bloodhound({
    name: "CSJProjects",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: CSJSearch,
    limit: 10
  });

  CSJProjectsBH.initialize();
  
  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "CSJProjects",
    displayKey: "name",
    source: CSJProjectsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Projets EÉC 2014</h4>",
      suggestion: Handlebars.compile(["{{name}}"].join(""))
    }
  }).on("typeahead:selected", function (obj, datum) {
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    });
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
