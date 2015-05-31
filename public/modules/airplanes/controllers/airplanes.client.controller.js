'use strict';

// Airplanes controller
angular.module('airplanes').controller('AirplanesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Airplanes',
	function($scope, $stateParams, $location, Authentication, Airplanes) {
		$scope.authentication = Authentication;

		// Create new Airplane
		$scope.create = function() {
			// Create new Airplane object
			var airplane = new Airplanes ({
				name: this.name
			});

			// Redirect after save
			airplane.$save(function(response) {
				$location.path('airplanes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Airplane
		$scope.remove = function(airplane) {
			if ( airplane ) { 
				airplane.$remove();

				for (var i in $scope.airplanes) {
					if ($scope.airplanes [i] === airplane) {
						$scope.airplanes.splice(i, 1);
					}
				}
			} else {
				$scope.airplane.$remove(function() {
					$location.path('airplanes');
				});
			}
		};

		// Update existing Airplane
		$scope.update = function() {
			var airplane = $scope.airplane;

			airplane.$update(function() {
				$location.path('airplanes/' + airplane._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Airplanes
		$scope.find = function() {
			$scope.airplanes = Airplanes.query();
		};

		// Find existing Airplane
		$scope.findOne = function() {
			$scope.airplane = Airplanes.get({ 
				airplaneId: $stateParams.airplaneId
			});
		};
	}
]);