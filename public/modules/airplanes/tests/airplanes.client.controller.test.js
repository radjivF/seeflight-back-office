'use strict';

(function() {
	// Airplanes Controller Spec
	describe('Airplanes Controller Tests', function() {
		// Initialize global variables
		var AirplanesController,
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

			// Initialize the Airplanes controller.
			AirplanesController = $controller('AirplanesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Airplane object fetched from XHR', inject(function(Airplanes) {
			// Create sample Airplane using the Airplanes service
			var sampleAirplane = new Airplanes({
				name: 'New Airplane'
			});

			// Create a sample Airplanes array that includes the new Airplane
			var sampleAirplanes = [sampleAirplane];

			// Set GET response
			$httpBackend.expectGET('airplanes').respond(sampleAirplanes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.airplanes).toEqualData(sampleAirplanes);
		}));

		it('$scope.findOne() should create an array with one Airplane object fetched from XHR using a airplaneId URL parameter', inject(function(Airplanes) {
			// Define a sample Airplane object
			var sampleAirplane = new Airplanes({
				name: 'New Airplane'
			});

			// Set the URL parameter
			$stateParams.airplaneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/airplanes\/([0-9a-fA-F]{24})$/).respond(sampleAirplane);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.airplane).toEqualData(sampleAirplane);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Airplanes) {
			// Create a sample Airplane object
			var sampleAirplanePostData = new Airplanes({
				name: 'New Airplane'
			});

			// Create a sample Airplane response
			var sampleAirplaneResponse = new Airplanes({
				_id: '525cf20451979dea2c000001',
				name: 'New Airplane'
			});

			// Fixture mock form input values
			scope.name = 'New Airplane';

			// Set POST response
			$httpBackend.expectPOST('airplanes', sampleAirplanePostData).respond(sampleAirplaneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Airplane was created
			expect($location.path()).toBe('/airplanes/' + sampleAirplaneResponse._id);
		}));

		it('$scope.update() should update a valid Airplane', inject(function(Airplanes) {
			// Define a sample Airplane put data
			var sampleAirplanePutData = new Airplanes({
				_id: '525cf20451979dea2c000001',
				name: 'New Airplane'
			});

			// Mock Airplane in scope
			scope.airplane = sampleAirplanePutData;

			// Set PUT response
			$httpBackend.expectPUT(/airplanes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/airplanes/' + sampleAirplanePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid airplaneId and remove the Airplane from the scope', inject(function(Airplanes) {
			// Create new Airplane object
			var sampleAirplane = new Airplanes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Airplanes array and include the Airplane
			scope.airplanes = [sampleAirplane];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/airplanes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAirplane);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.airplanes.length).toBe(0);
		}));
	});
}());