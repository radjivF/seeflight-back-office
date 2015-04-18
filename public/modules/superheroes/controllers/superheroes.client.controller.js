'use strict';

// Superheroes controller
angular.module('superheroes').controller('SuperheroesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Superheroes',
	function($scope, $stateParams, $location, Authentication, Superheroes) {
		$scope.authentication = Authentication;

		// Create new Superhero
		$scope.create = function() {
			// Create new Superhero object
			var superhero = new Superheroes ({
				name: this.name,
				superpower: this.superpower

			});

			// Redirect after save
			superhero.$save(function(response) {
				$location.path('superheroes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Superhero
		$scope.remove = function(superhero) {
			if ( superhero ) {
				superhero.$remove();

				for (var i in $scope.superheroes) {
					if ($scope.superheroes [i] === superhero) {
						$scope.superheroes.splice(i, 1);
					}
				}
			} else {
				$scope.superhero.$remove(function() {
					$location.path('superheroes');
				});
			}
		};

		// Update existing Superhero
		$scope.update = function() {
			var superhero = $scope.superhero;

			superhero.$update(function() {
				$location.path('superheroes/' + superhero._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Superheroes
		$scope.find = function() {
			$scope.superheroes = Superheroes.query();
		};

		// Find existing Superhero
		$scope.findOne = function() {
			$scope.superhero = Superheroes.get({
				superheroId: $stateParams.superheroId
			});
		};
	}
]);
