'use strict';

(function() {
	// Superheroes Controller Spec
	describe('Superheroes Controller Tests', function() {
		// Initialize global variables
		var SuperheroesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Superheroes controller.
			SuperheroesController = $controller('SuperheroesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Superhero object fetched from XHR', inject(function(Superheroes) {
			// Create sample Superhero using the Superheroes service
			var sampleSuperhero = new Superheroes({
				name: 'New Superhero'
			});

			// Create a sample Superheroes array that includes the new Superhero
			var sampleSuperheroes = [sampleSuperhero];

			// Set GET response
			$httpBackend.expectGET('superheroes').respond(sampleSuperheroes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.superheroes).toEqualData(sampleSuperheroes);
		}));

		it('$scope.findOne() should create an array with one Superhero object fetched from XHR using a superheroId URL parameter', inject(function(Superheroes) {
			// Define a sample Superhero object
			var sampleSuperhero = new Superheroes({
				name: 'New Superhero'
			});

			// Set the URL parameter
			$stateParams.superheroId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/superheroes\/([0-9a-fA-F]{24})$/).respond(sampleSuperhero);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.superhero).toEqualData(sampleSuperhero);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Superheroes) {
			// Create a sample Superhero object
			var sampleSuperheroPostData = new Superheroes({
				name: 'New Superhero'
			});

			// Create a sample Superhero response
			var sampleSuperheroResponse = new Superheroes({
				_id: '525cf20451979dea2c000001',
				name: 'New Superhero'
			});

			// Fixture mock form input values
			scope.name = 'New Superhero';

			// Set POST response
			$httpBackend.expectPOST('superheroes', sampleSuperheroPostData).respond(sampleSuperheroResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Superhero was created
			expect($location.path()).toBe('/superheroes/' + sampleSuperheroResponse._id);
		}));

		it('$scope.update() should update a valid Superhero', inject(function(Superheroes) {
			// Define a sample Superhero put data
			var sampleSuperheroPutData = new Superheroes({
				_id: '525cf20451979dea2c000001',
				name: 'New Superhero'
			});

			// Mock Superhero in scope
			scope.superhero = sampleSuperheroPutData;

			// Set PUT response
			$httpBackend.expectPUT(/superheroes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/superheroes/' + sampleSuperheroPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid superheroId and remove the Superhero from the scope', inject(function(Superheroes) {
			// Create new Superhero object
			var sampleSuperhero = new Superheroes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Superheroes array and include the Superhero
			scope.superheroes = [sampleSuperhero];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/superheroes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSuperhero);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.superheroes.length).toBe(0);
		}));
	});
}());