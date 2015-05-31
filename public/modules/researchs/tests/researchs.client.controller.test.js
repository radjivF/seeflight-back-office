'use strict';

(function() {
	// Researchs Controller Spec
	describe('Researchs Controller Tests', function() {
		// Initialize global variables
		var ResearchsController,
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

			// Initialize the Researchs controller.
			ResearchsController = $controller('ResearchsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Research object fetched from XHR', inject(function(Researchs) {
			// Create sample Research using the Researchs service
			var sampleResearch = new Researchs({
				name: 'New Research'
			});

			// Create a sample Researchs array that includes the new Research
			var sampleResearchs = [sampleResearch];

			// Set GET response
			$httpBackend.expectGET('researchs').respond(sampleResearchs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.researchs).toEqualData(sampleResearchs);
		}));

		it('$scope.findOne() should create an array with one Research object fetched from XHR using a researchId URL parameter', inject(function(Researchs) {
			// Define a sample Research object
			var sampleResearch = new Researchs({
				name: 'New Research'
			});

			// Set the URL parameter
			$stateParams.researchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/researchs\/([0-9a-fA-F]{24})$/).respond(sampleResearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.research).toEqualData(sampleResearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Researchs) {
			// Create a sample Research object
			var sampleResearchPostData = new Researchs({
				name: 'New Research'
			});

			// Create a sample Research response
			var sampleResearchResponse = new Researchs({
				_id: '525cf20451979dea2c000001',
				name: 'New Research'
			});

			// Fixture mock form input values
			scope.name = 'New Research';

			// Set POST response
			$httpBackend.expectPOST('researchs', sampleResearchPostData).respond(sampleResearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Research was created
			expect($location.path()).toBe('/researchs/' + sampleResearchResponse._id);
		}));

		it('$scope.update() should update a valid Research', inject(function(Researchs) {
			// Define a sample Research put data
			var sampleResearchPutData = new Researchs({
				_id: '525cf20451979dea2c000001',
				name: 'New Research'
			});

			// Mock Research in scope
			scope.research = sampleResearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/researchs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/researchs/' + sampleResearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid researchId and remove the Research from the scope', inject(function(Researchs) {
			// Create new Research object
			var sampleResearch = new Researchs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Researchs array and include the Research
			scope.researchs = [sampleResearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/researchs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleResearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.researchs.length).toBe(0);
		}));
	});
}());