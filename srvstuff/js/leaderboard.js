(function (angular) {

/**************** GolfStat Service *****************/

var gsapp = angular.module('golfstat', []);

gsapp.factory('GS', ['$http' ,function ($http) {


	var fixTheD = function (badD) {
		var goodD = [];

		angular.forEach(badD.DATA, function (value, key) {
			var thing = {};
			angular.forEach(value, function (val, k) {
				// if the current id is START DATE create a date object
				if (badD.COLUMNS[k] === 'START_DATE') {
					var d = new Date(val);
					this[badD.COLUMNS[k]] = d.getTime();
				// if the current id is END DATE create a date object
				} else if (badD.COLUMNS[k] == 'END_DATE') {
          var d = new Date(val);
          this[badD.COLUMNS[k]] = d.getTime();
        // otherwise add it to the object
	      } else {
	      	this[badD.COLUMNS[k]] = val;
	      }
			}, thing);

			

			// i think we only care about live scored events here
			// i can't honestly remember what the tournament format cd means
			if (thing.LIVE_SCORING && thing.TOURNAMENT_FORMAT_CD != 'P') {
				this[this.length] = thing;
			}
		}, goodD);

		return goodD;
	}

	var gsurl = 'http://www.golfstatresults.com/webservices/sec/event.cfc';
	var options = {
		'UID': 'golfweek',
		'PWD':'gsgw13', 
		'returnFormat': 'JSON'
	};

	return {
		// date1 is the older of the 2 dates format M/D/Y
		getTourn : function (cb) {
			// options['date1'] = date1;  // optional
			// options['date2'] = date2;  // optional
			options['method'] = 'getTournaments';
			$http.get(gsurl, {params: options})
				.success(function (data, status) {
					//console.log(fixTheD(data));
					cb(fixTheD(data));
				});
		},
		getPlayerLB: function (tourn, cb) {
			options['method'] = 'playerLB';
			options['tournament_id'] = tourn;
			$http.get(gsurl, {params:options})
				.success(function (data, status) {
					var lbdata = [];
					if (data.DATA.length > 0) {
						angular.forEach(data.DATA, function (val, key) {
							var thing = {};

							angular.forEach(val, function (val, key2) {
								this[data.COLUMNS[key2]] = val;
							}, thing);
							this.push(thing);
						}, lbdata);
					}

					cb(lbdata);
				});
		},
		getTeamLB: function (tourn, cb) {
			options['method'] = 'teamLB';
			options['tournament_id'] = tourn;
			$http.get(gsurl, {params:options})
				.success(function (data, status) {
					var lbdata = [];
					if (data.DATA.length > 0) {
						angular.forEach(data.DATA, function (val, key) {
							var thing = {};

							angular.forEach(val, function (val, key2) {
								this[data.COLUMNS[key2]] = val;
							}, thing);
							this.push(thing);
						}, lbdata);
					}

					cb(lbdata);
				});
		}
	}
}]);



/**************** Tours Service    *****************/

var scores = angular.module('livescores', []);


scores.factory('LS', ['$http',function ($http) {

	var frames = {
		"PGA": "http://rankings.golfweek.com/fetchurl/assets/pga.xml",
		"WEB": "http://rankings.golfweek.com/fetchurl/assets/nwid.xml",
		"CHA": "http://rankings.golfweek.com/fetchurl/assets/chmp.xml"
	};

	var fixTheD = function (badD) {

		var goodD = { 'players': [], 'tournament': {}};
		var badD = $.parseXML(badD);
		var el = $(badD).find('Info');

		if (el.text().indexOf('server was not found') > -1) {
			goodD['msg'] = 'No tournament found.';
		} else {
			var tournament = $(badD).find('Tourn');
			goodD.tournament['name'] = $(tournament).attr('Name');
			goodD.tournament['course'] = $(tournament).attr('Loc');
			goodD.tournament['city'] = $(tournament).attr('localCity');
			goodD.tournament['st'] = $(tournament).attr('LocState');
			goodD.tournament['fetchTime'] = $(tournament).attr('CurTime');


			var players = $(badD).find('Player');
			angular.forEach(players, function (val, k) {
				var player = {};
				player.longName = $(players[k]).attr('Fname') + " " + $(players[k]).attr('Lname');
				player.shortName = $(players[k]).attr('FInit') + ". " + $(players[k]).attr('Lname');
				player.pos = $(players[k]).attr('CurPos');
				player.posSort = player.pos.replace('T', '');
				player.today = $(players[k]).attr('CurParRel');
				player.score = $(players[k]).attr('TournParRel');
				player.thru = $(players[k]).attr('Thru');
				player.rnd_one = $(players[k]).find('Rnd[Num="1"]').attr('ParRel');
				player.rnd_one = (player.rnd_one == '')? '-' : player.rnd_one;
				player.rnd_two = $(players[k]).find('Rnd[Num="2"]').attr('ParRel');				
				player.rnd_two = (player.rnd_two == '')? '-' : player.rnd_two;
				player.rnd_three = $(players[k]).find('Rnd[Num="3"]').attr('ParRel');
				player.rnd_three = (player.rnd_three == '')? '-' : player.rnd_three;
				if ($(tournament).attr('NumRnds') === "4") {
					player.rnd_four = $(players[k]).find('Rnd[Num="4"]').attr('ParRel');
				}

				// console.log(player);

				this.push(player);
			}, goodD.players);
		}
		return goodD;
	}


	var pga_check, web_check, chmp_check;

	return {
		load: function (frame, cb) {
			var players = [];
			$http.get(frames[frame])
				.success(function (data, status) {
					cb(fixTheD(data));
				});
		},
		check: function (frame, cb) {
			// checking pga tour tourn
			if (frame === 'PGA') {
				if (typeof pga_check === 'undefined') {
					$http.get(frames[frame])
						.success(function (data, status) {
							data = $.parseXML(data);
							pga_check = $(data).find('Info').text().indexOf('server was not found') > -1;
							cb(pga_check);
						});
				} else {
					cb(pga_check);
				}
			// checking web tour tourn				
			} else if (frame === 'WEB') {
				if (typeof web_check === 'undefined') {
					$http.get(frames[frame])
						.success(function (data, status) {
							data = $.parseXML(data);
							web_check = $(data).find('Info').text().indexOf('server was not found') > -1;
							cb(web_check);
						});
				} else {
					cb(web_check);
				}
			// checking champions tour tourn				
			} else if (frame === 'CHA') {
				if (typeof chmp_check === 'undefined') {
					$http.get(frames[frame])
						.success(function (data, status) {
							data = $.parseXML(data);
							chmp_check = $(data).find('Info').text().indexOf('server was not found') > -1;
							cb(chmp_check);
						});
				} else {
					cb(chmp_check);
				}
			}
		}
	}
}]);


/**************** Leaderboard App *****************/

var lbapp = angular.module('leaderboard', 
	['ngRoute', 'ngSanitize',
	 'golfstat', 'livescores']);

lbapp.config(function ($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


var tabTemplate = '<div class="tabgroup">' +
										'<a ng-repeat="link in links" class="tab tablink" ng-href="#{{link.url}}" ng-class="{\'active\': link.tab, \'disabled\': link.live}">' +
											'<span class="tabname text-justify">{{link.name}}</span>' +
								  	'</a>' +
								  '</div>' +
									'<div class="clearfix"></div>';


var tournDataTemplate = '<div ng-if="!err" class="tournInfo">' +
													'<div class="tournName">{{tournament.name}}</div>' +
													'<div class="tournLoc">' +
														'<span class="tournCity">{{tournament.city}},&nbsp;{{tournament.st}}</span>' +
														'<span class="tournCourse">{{tournament.course}}</span>' +
													'</div>' +
													'<div class="tournTime">{{tournament.fetchTime}}</div>' +
												'</div>'+
												'<div class="clearfix"></div>';


var liveScoreHeader = '<div class="lblive_scores table-responsive">' +
												'<table ng-if="!err" class="table table-striped">' +
													'<thead class="lbthead">' +
													'<th class="position">pos</th>' +
													'<th class="player visible-lg">name</th>' +
													'<th class="player hidden-lg">name</th>' +
													'<th class="score">score</th>' +
													'<th class="thru">thru</th>' +
													'<th class="today">today</th>' +
													'<th class="rnd1 visible-lg">rnd1</th>' +
													'<th class="rnd2 visible-lg">rnd2</th>' +
													'<th class="rnd3 visible-lg">rnd3</th>' +
													'<th ng-if="player.rnd_four" class="rnd4 visible-lg">rnd4</th>' +
													'<thead>';


var ad = function () {
		var adurl = '/310322/a.site152.tmus';
		var adsize = [668, 40];

		var adcall = 1;
		var getRand = Math.floor((Math.random()*600)+1);
    var url = 'http://pubads.g.doubleclick.net/gampad/jump?iu=' + adurl + '&sz=' + adsize.join('x') + '&c=' + getRand;

    return '<a id="adclick' + (adcall++) + '" href="' + url + '" target="_blank">' +
						'<img src="http://pubads.g.doubleclick.net/gampad/ad?iu=/310322/a.site152.tmus&sz=' + adsize.join('x') + '&c=' + 
    		    getRand + '"></a>';
}


var proTemplate = tournDataTemplate +
									'<div ng-if="err" class="errmsg">{{err}}</div>' +
									liveScoreHeader +
									'<tbody>' +
										'<tr class="lblive_score_row lbrow" ng-if="players" ng-repeat="player in players">' + 
											'<td class="position">{{player.pos}}</td>' +
											'<td class="player visible-lg"><nobr>{{player.longName}}</nobr></td>' +
											'<td class="player hidden-lg"><nobr>{{player.shortName}}</nobr></td>' +
											'<td class="score">{{player.score}}</td>' +
											'<td class="thru">{{player.thru}}</td>' +
											'<td class="today">{{player.today}}</td>' +
											'<td class="rnd1 visible-lg">{{player.rnd_one}}</td>' +
											'<td class="rnd2 visible-lg">{{player.rnd_two}}</td>' +
											'<td class="rnd3 visible-lg">{{player.rnd_three}}</td>' +
											'<td player.rnd_four" class="rnd4 visible-lg">{{player.rnd_four}}</td>' +
											// '<td colspan=8 ng-if="$index % 9 == 0 && $index > 0 && $index < 20">' +
											// 	'<div id="ad-{{$index}}" class="">' + ad() + '</div>' +
											// '</td>' +
	    					  	'</tr>' +
	    					  '</tbody>' +
	    					 '</table>';									


var gsTournTemplate = '<div ng-if="tournaments" ng-repeat="tournament in tournaments" class="text-center">' +
												'<a ng-href="http://golfstat.golfweek.com/players/K/{{tournament.TOURNAMENT_ID}}/{{tournament.TOURNAMENT_DESCR}}">' +
													'<div class="btn btn-default">' +
														'<span>{{tournament.TOURNAMENT_DESCR}}</span><br/>' +
														'<small>{{tournament.START_DATE | date:"mediumDate"}}</small>' +
													'</div>' +
												'</a>' +
											'</div><br/>' +
											'<div ng-if="!tournaments">nope</div>';

var gsTeamLBTemplate = '';

var gsPlayerLBTemplate = '';


lbapp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			// this corresponds to /news/leaderboards/
			// .when('/', {
			// 	controller: 'homeCtrl',
			// 	template: tabTemplate
			// })
			// this corresponds to /news/leaderboards/pga
			.when('/pga', {
				controller: 'pgaCtrl',
				template: proTemplate
			})
			// this corresponds to /news/leaderboards/web
			.when('/web', {
				controller: 'webCtrl',
				template: proTemplate
			})
			// this corresponds to /news/leaderboards/chmp
			.when('/chmp', {
				controller: 'chmpCtrl',
				template: proTemplate
			})
			// this corresponds to /news/leaderboards/sym
			// .when('/sym', {
			// 	controller: 'symCtrl',
			// 	template: '<div>{{stuff | json}}</div>'
			// })
			// this corresponds to /news/leaderboards/col
			.when('/col', {
				controller: 'colCtrl',
				template: gsTournTemplate
			})
			.when('/col/:tourn', {
				controller: 'colLbCtrl',
				template: gsTeamLBTemplate
			})
			// this corresponds to /news/leaderboards/hs
			.when('/hs', {
				controller: 'hsCtrl',
				template: gsTournTemplate
			})
			.when('/hs/:tourn', {
				controller: 'hsLbCtrl',
				template: gsTeamLBTemplate
			})
	}
])


lbapp.factory('adfac', ['$interval', function () {

		var adurl = '/310322/a.site152.tmus';
		var adsize = [668, 40];

		var getRand = Math.floor((Math.random()*600)+1);
    var url = 'http://pubads.g.doubleclick.net/gampad/jump?iu=' + adurl + '&sz=' + adsize.join('x') + '&c=' + getRand;

		return {
			putAd: function (divName) {

				var elem = document.getElementById(divName);

				// elem.innerHTML = '<a id="adclick" href="' + url + '" target="_blank">' +
				// 								 '<img src="http://pubads.g.doubleclick.net/gampad/ad?iu=/310322/a.site152.tmus&sz=' + adsize.join('x') + '&c=' + 
    		//           				getRand + '"></a>'

				// window.googletag.cmd.push(function () {
				// 	var slot = window.googletag.defineSlot(adurl, adsize, divName);
				// 	slot.addService(googletag.pubads());
				// 	googletag.enableServices();
				// 	googletag.display(divName);
				// });

				// window.googletag.cmd.push(function () {
				// 	googletag.display(divName);
				// });

			}	
		}
	}
]);

// lbapp.directive('theAd', ['$window', function ($window) {

// 		var adurl = '/310322/a.site152.tmus';
// 		var adsize = [668, 40];


// 		return function (scope, elem, attrs) {

// 			var divName = elem[0].id;			

// 			$window.googletag.cmd.push(function () {
// 				var slot = $window.googletag.defineSlot(adurl, adsize, divName);
// 				slot.addService($window.googletag.pubads());
// 				$window.googletag.enableServices();
// 				$window.googletag.display(divName);
// 			});

// 			$window.googletag.cmd.push(function () {
// 				$window.googletag.display(divName);
// 			});

// 		}
// 	}
// ]);

// Home Controller

lbapp.controller('homeCtrl', ['$scope', 'LS',
	function ($scope, ls) {
		
		$scope.links = [
			{'name': 'pga tour','url': '/pga', 'tab': false, 'live': true},
			{'name': 'web.com','url': '/web', 'tab': false, 'live': true},
			{'name': 'champions','url': '/chmp', 'tab': false, 'live': true},
			// {'name': 'symetra','url': '/sym', 'tab': false, 'live': true},
			{'name': 'college','url': '/col', 'tab': false, 'live': true},
			{'name': 'high school','url': '/hs', 'tab': false, 'live': true}
		];



		$scope.activeCheck = function (ind) {
			for (var i = 0; i < $scope.links.length; i++) {
				$scope.links[i]['tab'] = (i == ind)? true : false;
			}
		}

		$scope.activeCheck();

		$scope.$on('tabchange', function (e, ind) {

			$scope.activeCheck(ind);

		});


		ls.check('PGA', function (pga_off) {
			if (pga_off) {
				$scope.links[0]['live'] = false;
			}
		});
		ls.check('WEB', function (web_off) { 
			if (web_off) {
				$scope.links[0]['live'] = false;
			}
		});
		ls.check('CHA', function (cha_off) { 
			if (cha_off) {
				$scope.links[0]['live'] = false;
			}
		});
	}
]);


// PGA Controller

lbapp.controller('pgaCtrl', ['$scope', 'LS', 'adfac', '$interval',
	function ($scope, ls, adfac, $interval) {
		
		ls.load('PGA', function (d) {
			if (typeof d.msg === 'undefined') {
				$scope.tournament = d.tournament;
				$scope.players = d.players;

			} else {
				$scope.err = d['msg'];
			}
		});

		$scope.$emit('tabchange', 0);

		// adfac.putAd('ad-9');
		// adfac.putAd('ad-18');

	}
]);


// Web Controller

lbapp.controller('webCtrl', ['$scope', 'LS',
	function ($scope, ls) {
		
		ls.load('WEB', function (d) {
			if (typeof d.msg === 'undefined') {
				$scope.tournament = d.tournament;
				$scope.players = d.players;

			} else {
				$scope.err = d['msg'];
			}
		});


		$scope.$emit('tabchange', 1);

	}
]);


// Chmp Controller

lbapp.controller('chmpCtrl', ['$scope', 'LS',
	function ($scope, ls) {
		
		ls.load('CHA', function (d) {
			if (typeof d.msg === 'undefined') {
				$scope.tournament = d.tournament;
				$scope.players = d.players;

			} else {
				$scope.err = d['msg'];
			}
		});

		$scope.$emit('tabchange', 2);

	}
]);


// Sym Controller

// lbapp.controller('symCtrl', ['$scope', 
// 	function ($scope) {
		
		
// 	}
// ]);


// College Controller

lbapp.controller('colCtrl', ['$scope', 'GS', 
	function ($scope, gs) {
		
		gs.getTourn(function (d) {
			$scope.tournaments = [];
			angular.forEach(d, function (val, key) {
				// console.log(val.);
				switch (val.TOURNAMENT_TYPE_CD) {
					case 'A':
						this.push(val);
						break;
					case 'B':
						this.push(val);
						break;
					case 'F':
						this.push(val);
						break;
					case 'G':
						this.push(val);
						break;
					case 'I':
						this.push(val);
						break;
					case 'P':
						this.push(val);
						break;
					case 'Q':
						this.push(val);
						break;
					case 'X':
						this.push(val);
						break;
					case 'W':
						this.push(val);
						break;
					default:
						break;
				}
			}, $scope.tournaments);
		});
		
		$scope.$emit('tabchange', 3);

	}
]);



// College Leaderboard Controller

lbapp.controller('colLbCtrl', ['$scope', '$routeParams', 'GS', 
	function ($scope, $routeParams, gs) {
		
		gs.getTeamLB($routeParams.tourn, function (d) {
			console.log(d);
		});
		

	}
]);



// HS Controller

lbapp.controller('hsCtrl', ['$scope', 'GS', 
	function ($scope, gs) {
		
		gs.getTourn(function (d) {
			$scope.tournaments = [];
			angular.forEach(d, function (val, key) {
				// console.log(val);
				switch (val.TOURNAMENT_TYPE_CD) {
					case 'M':
						this.push(val);
						break;
					case 'N':
						this.push(val);
						break;
					case 'MGA':
						this.push(val);
						break;
					case 'NGA':
						this.push(val);
						break;
					case 'MWI':
						this.push(val);
						break;
					case 'NWI':
						this.push(val);
						break;
					case 'MCT':
						this.push(val);
						break;					
					default:
						break;
				}
			}, $scope.tournaments);
		});
		
		$scope.$emit('tabchange', 4);

	}
]);


// HS Leaderboard Controller

lbapp.controller('hsLbCtrl', ['$scope', '$routeParams', 'GS', 
	function ($scope, $routeParams, gs) {
		
		gs.getPlayerLB($routeParams.tourn, function (d) {
			console.log(d);
		});
		

	}
]);




$(window).on('load', function (e) {
	var elem = document.getElementById('PooFlingingMonkey');
	elem.innerHTML += '<div><div class="topstories-header push-bottom">Live Leaderboards</div><div ng-controller="homeCtrl">' + 
											tabTemplate + '<div class="clearfix"></div><div ng-view></div></div></div>';


	// start the angular thing
	angular.bootstrap(elem, ['leaderboard']);
})



})(angular);