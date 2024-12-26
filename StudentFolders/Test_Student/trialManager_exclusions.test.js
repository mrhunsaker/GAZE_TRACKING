import { TrialManager } from './trialManager_exclusions.js';

describe('TrialManager', () => {
    let trialManager;

    beforeEach(() => {
        // Mock the DOM elements
        document.body.innerHTML = `
            <div id="test-container"></div>
            <div id="instruction"></div>
        `;

        trialManager = new TrialManager();
    });

    test('should initialize with default values', () => {
        expect(trialManager.testContainer).toBeDefined();
        expect(trialManager.instructionElement).toBeDefined();
        expect(trialManager.trialTypes).toEqual(["1", "2"]);
        expect(trialManager.trialCount).toBeNull();
        expect(trialManager.currentTrial).toBe(0);
        expect(trialManager.currentTrialData).toEqual({});
        expect(trialManager.trialData).toEqual([]);
        expect(trialManager.gazeData).toEqual([]);
        expect(trialManager.isExperimentStarted).toBe(false);
        expect(trialManager.calibrationComplete).toBe(false);
        expect(trialManager.calibrationInProgress).toBe(false);
        expect(trialManager.CALIBRATION_POINTS).toBe(10);
        expect(trialManager.currentGazeData).toEqual([]);
        expect(trialManager.allGazeData).toEqual([]);
        expect(trialManager.objectExclusions).toBeDefined();
        expect(trialManager.userInitials).toBe('');
    });

    test('should resolve showInitialsDialog promise', async () => {
        const promise = trialManager.showInitialsDialog();
        expect(promise).toBeInstanceOf(Promise);
        const result = await promise;
        expect(result).toBeUndefined(); // Adjust based on your implementation
    });

    // Add more tests as needed
});