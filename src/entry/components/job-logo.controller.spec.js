'use strict';

describe('Controller: Job Logo', function () {
  var $controller, jobLogger, JobLogoStates, jobLogoController;

  beforeEach(module('udb.entry'));

  beforeEach(inject(function(_$controller_, _JobLogoStates_){
    $controller = _$controller_;
    JobLogoStates = _JobLogoStates_;
  }));

  beforeEach(function () {
    jobLogger = jasmine.createSpyObj('jobLogger', [
      'getFailedJobs',
      'getFinishedExportJobs',
      'hasActiveJobs'
    ]);

    jobLogoController = $controller('JobLogoController', {
      JobLogoStates: JobLogoStates,
      jobLogger: jobLogger
    });
  });

  it('sets the logo state to IDLE when there are no jobs to show', function () {
    jobLogoController.updateCurrentState();
    expect(jobLogoController.getState()).toBe(JobLogoStates.IDLE);
  });

  it('sets the logo state to WARNING when there are failed jobs', function () {
    jobLogger.getFailedJobs = jasmine.createSpy('getFailedJobs').andCallFake(function() {
      return ['some', 'failed', 'jobs'];
    });
    jobLogoController.updateCurrentState();
    expect(jobLogoController.getState()).toBe(JobLogoStates.WARNING);
  });

  it('sets the logo state to COMPLETE when there are finished export jobs', function () {
    jobLogger.getFinishedExportJobs = jasmine.createSpy('getFinishedExportJobs')
      .andCallFake(function() {
        return ['some', 'finished', 'exports'];
      });
    jobLogoController.updateCurrentState();
    expect(jobLogoController.getState()).toBe(JobLogoStates.COMPLETE);
  });

  it('sets the logo state to BUSY when there are active jobs', function () {
    jobLogger.hasActiveJobs = jasmine.createSpy('hasActiveJobs')
      .andCallFake(function() {
         return true
       });
    jobLogoController.updateCurrentState();
    expect(jobLogoController.getState()).toBe(JobLogoStates.BUSY);
  });
});
