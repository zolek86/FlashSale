var flashSale = {
	socket: io('http://localhost:3000'),
	init: function(){
		this.appEvents();
	},
	appEvents: function(){
		var _flashSale = this;
		this.socket.on('gis', function (data) {
	        console.log(data);
	        /*appLocationMsg(data);*/
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
		
		var errorMsg = "!!! OMG !!! ERROR !!!",
			msgSpot = $('#locationMsg');
		msgSpot.html('');

		if(locationData.error === false){
			msgSpot.append(this.appLocationTemplate(locationData.gis));
		} else {
			msgSpot.append(msgSpot);
		}
	},
	appLocationTemplate: function(lat,lang,location){
		return template = "Twoje położenie to: " + lat + " szerokości " + lang + " długości geograficznej \n" + " adres: " + location;
	};
};
$(function(){
	flashSale.init();
});