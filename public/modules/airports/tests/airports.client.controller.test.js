'use strict';

(function() {
	// Airports Controller Spec
	describe('Airports Controller Tests', function() {
		// Initialize global variables
		var AirportsController,
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

			// Initialize the Airports controller.
			AirportsController = $controller('AirportsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Airport object fetched from XHR', inject(function(Airports) {
			// Create sample Airport using the Airports service
			var sampleAirport = new Airports({
				name: 'New Airport'
			});

			// Create a sample Airports array that includes the new Airport
			var sampleAirports = [sampleAirport];

			// Set GET response
			$httpBackend.expectGET('airports').respond(sampleAirports);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.airports).toEqualData(sampleAirports);
		}));

		it('$scope.findOne() should create an array with one Airport object fetched from XHR using a airportId URL parameter', inject(function(Airports) {
			// Define a sample Airport object
			var sampleAirport = new Airports({
				name: 'New Airport'
			});

			// Set the URL parameter
			$stateParams.airportId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/airports\/([0-9a-fA-F]{24})$/).respond(sampleAirport);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.airport).toEqualData(sampleAirport);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Airports) {
			// Create a sample Airport object
			var sampleAirportPostData = new Airports({
				name: 'New Airport'
			});

			// Create a sample Airport response
			var sampleAirportResponse = new Airports({
				_id: '525cf20451979dea2c000001',
				name: 'New Airport'
			});

			// Fixture mock form input values
			scope.name = 'New Airport';

			// Set POST response
			$httpBackend.expectPOST('airports', sampleAirportPostData).respond(sampleAirportResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Airport was created
			expect($location.path()).toBe('/airports/' + sampleAirportResponse._id);
		}));

		it('$scope.update() should update a valid Airport', inject(function(Airports) {
			// Define a sample Airport put data
			var sampleAirportPutData = new Airports({
				_id: '525cf20451979dea2c000001',
				name: 'New Airport'
			});

			// Mock Airport in scope
			scope.airport = sampleAirportPutData;

			// Set PUT response
			$httpBackend.expectPUT(/airports\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/airports/' + sampleAirportPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid airportId and remove the Airport from the scope', inject(function(Airports) {
			// Create new Airport object
			var sampleAirport = new Airports({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Airports array and include the Airport
			scope.airports = [sampleAirport];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/airports\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAirport);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.airports.length).toBe(0);
		}));
	});
}());