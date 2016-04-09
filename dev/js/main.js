var flashSale = {
	socket: io('http://192.168.1.32:3000'),
	init: function(){
		this.appEvents();
	},
	appEvents: function(){
		var _flashSale = this;
		this.socket.on('gis', function (data) {
	        console.log(data);
	        _flashSale.appLocationMsg(data);
	    });
	    $('#findLocation').click(function () {
	        var location = {
	            city: $("#inputMiasto").val(),
	            street: $("#inputUlica").val(),
	            streetNumber: $("#inputNumer").val()
	        };
	        _flashSale.socket.emit('sendGis', location);
	    });
	},
	appLocationMsg: function(locationData){
		var errorMsg = "<strong>!!! OMG !!! ERROR !!!</strong>",
			msgSpot = $('#locationMsg'),
			formSpot = $('#locationForm');

		msgSpot.html('');

		if(locationData.error === false){
			formSpot.html('');
			formSpot.html(this.appLocationTemplate(locationData.gis.lat.toFixed(3), locationData.gis.lng.toFixed(3), locationData.gis.location));
			$('#msgClose').show();
			$('#findLocation').hide();
			$('#myModalLabel').text("Odnaleziono!");
		} else {
			msgSpot.append(errorMsg);
		}
	},
	appLocationTemplate: function(lat,lang,location){
		return template = "Twoje położenie to: <br><strong>" + lat + "</strong> szerokości <strong><br>" + lang + "</strong> długości geograficznej<br>" + " adres: <strong>" + location + "</strong>";
	}
};
$(function(){
	flashSale.init();
    $('#msgClose').hide();
});
$(window).load(function(){
    $('#conectUser').modal('show');
});