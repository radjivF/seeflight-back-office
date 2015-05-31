'use strict';

// Researchs controller
angular.module('researchs').controller('ResearchsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Researchs',
	function($scope, $stateParams, $location, Authentication, Researchs) {
		$scope.authentication = Authentication;

		// Create new Research
		$scope.create = function() {
			// Create new Research object
			var research = new Researchs ({
				name: this.name
			});

			// Redirect after save
			research.$save(function(response) {
				$location.path('researchs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Research
		$scope.remove = function(research) {
			if ( research ) { 
				research.$remove();

				for (var i in $scope.researchs) {
					if ($scope.researchs [i] === research) {
						$scope.researchs.splice(i, 1);
					}
				}
			} else {
				$scope.research.$remove(function() {
					$location.path('researchs');
				});
			}
		};

		// Update existing Research
		$scope.update = function() {
			var research = $scope.research;

			research.$update(function() {
				$location.path('researchs/' + research._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Researchs
		$scope.find = function() {
			$scope.researchs = Researchs.query();
		};

		// Find existing Research
		$scope.findOne = function() {
			$scope.research = Researchs.get({ 
				researchId: $stateParams.researchId
			});
		};
	}
]);