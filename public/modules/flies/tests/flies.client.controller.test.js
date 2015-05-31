'use strict';

(function() {
	// Flies Controller Spec
	describe('Flies Controller Tests', function() {
		// Initialize global variables
		var FliesController,
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

			// Initialize the Flies controller.
			FliesController = $controller('FliesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fly object fetched from XHR', inject(function(Flies) {
			// Create sample Fly using the Flies service
			var sampleFly = new Flies({
				name: 'New Fly'
			});

			// Create a sample Flies array that includes the new Fly
			var sampleFlies = [sampleFly];

			// Set GET response
			$httpBackend.expectGET('flies').respond(sampleFlies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.flies).toEqualData(sampleFlies);
		}));

		it('$scope.findOne() should create an array with one Fly object fetched from XHR using a flyId URL parameter', inject(function(Flies) {
			// Define a sample Fly object
			var sampleFly = new Flies({
				name: 'New Fly'
			});

			// Set the URL parameter
			$stateParams.flyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/flies\/([0-9a-fA-F]{24})$/).respond(sampleFly);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fly).toEqualData(sampleFly);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Flies) {
			// Create a sample Fly object
			var sampleFlyPostData = new Flies({
				name: 'New Fly'
			});

			// Create a sample Fly response
			var sampleFlyResponse = new Flies({
				_id: '525cf20451979dea2c000001',
				name: 'New Fly'
			});

			// Fixture mock form input values
			scope.name = 'New Fly';

			// Set POST response
			$httpBackend.expectPOST('flies', sampleFlyPostData).respond(sampleFlyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fly was created
			expect($location.path()).toBe('/flies/' + sampleFlyResponse._id);
		}));

		it('$scope.update() should update a valid Fly', inject(function(Flies) {
			// Define a sample Fly put data
			var sampleFlyPutData = new Flies({
				_id: '525cf20451979dea2c000001',
				name: 'New Fly'
			});

			// Mock Fly in scope
			scope.fly = sampleFlyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/flies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/flies/' + sampleFlyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid flyId and remove the Fly from the scope', inject(function(Flies) {
			// Create new Fly object
			var sampleFly = new Flies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Flies array and include the Fly
			scope.flies = [sampleFly];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/flies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFly);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.flies.length).toBe(0);
		}));
	});
}());