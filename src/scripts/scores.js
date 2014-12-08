(function (angular, $) {
	
	// this is the live scoring app for the widget on the top right
	// live scoring will match as closely as possible the output from the
	// element with the id "framing"
	// different behaviour will likely need to be put in place for the 
	// home page version
	// ***NOTE nwid (nationwide) is now known as web.com tour ***
	// pga / nwid / chmp scoring will come from xml documents on rankings.golfweek.com
	// college / amateur / junior scoring will come from golfstat


	// PGA model

	// pga data should be the xml data 
	function PGA (pgadata) {
		if (pgadata) {
			this.setData(pgadata);
		}
		// other standard initializations
	}

	PGA.prototype = {
		setData: function (pgadata) {
			angular.extend(this, pgadata);
		},
		// Load will fetch the data from the pga xml
		load: function () {
			var scope = this;
			scope.players = [];
			$.ajax({
				type: "GET",
				url:'http://rankings.golfweek.com/fetchurl/assets/pga.xml',
				dataType: 'xml'
				}).success(function (pgadata) {
				scope.setData(pgadata);
				var players = $(pgadata).find('Player');
				for (var i = players.length - 1; i >= 0; i--) {
					player = {};
					player.name = $(players[i]).attr('FInit') + ". " + $(players[i]).attr('Lname');
					player.current_rank = $(players[i]).attr('CurPos');
					player.today = $(players[i]).attr('CurParRel');
					player.overall = $(players[i]).attr('TournParRel');
					player.thru = $(players[i]).attr('Thru');			
					scope.players.push(player);
				};
			});
		}
	}

	
	var thed = new PGA();
	thed.load();
	console.log(thed);

})(angular, jQuery);