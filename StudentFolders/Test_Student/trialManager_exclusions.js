// Export the TrialManager class
import { objectExclusions_Shapes } from './objectExclusions.js';
import { objectExclusions_Abstract } from './objectExclusions.js';
import { objectExclusions_Colors } from './objectExclusions.js';
import { objectExclusions_Pictures } from './objectExclusions.js'; // not available yet, still only has colors i the folder

// Export the initialization code as a function
export function initializeExperiment() {
    const trialManager = new TrialManager();
    let experimentInitiated = false;

    document.addEventListener("keydown", async (e) => {
        if (experimentInitiated) return;

        experimentInitiated = true;
        try {
            // 1. First show the dialog and get user input
            await trialManager.showInitialsDialog();

            // 2. Then setup images and initialize WebGazer
            await Promise.all([
                trialManager.setupImages(),
                trialManager.initWebGazer()
            ]);

            // 3. Start calibration phase without showing dialog again
            await trialManager.startCalibrationPhase();
        } catch (err) {
            console.error(`Initialization error:`, err);
            experimentInitiated = false;
        }
    });
}

export class TrialManager {
    constructor() {
        this.testContainer = document.getElementById("test-container");
        this.instructionElement = document.getElementById("instruction");
        this.trialTypes = ["1", "2"];
        this.trialCount = null;
        this.currentTrial = 0;
        this.currentTrialData = {};
        this.trialData = [];
        this.gazeData = [];
        this.isExperimentStarted = false;
        this.calibrationComplete = false;
        this.calibrationInProgress = false;
        this.CALIBRATION_POINTS = 10; // Number of calibration points
        this.currentGazeData = []; // Store gaze data for current trial
        this.allGazeData = []; // Store all gaze data across trials
        //this.objectExclusions = {};
        //this.objectExclusions = objectExclusions;
        this.userInitials = '';
        this.objectExclusions_Shapes = {};
        this.objectExclusions_Colors = {};
        this.objectExclusions_Abstract = {};

    }

    async initializeExclusions() {
        try {
            // Import exclusions based on selected test type
            switch (this.testType.toLowerCase()) {
                case 'Shapes':
                    const { objectExclusions_Shapes } = await import('./objectExclusions.js');
                    this.objectExclusions_Shapes = objectExclusions_Shapes;
                    break;
                case 'Colors':
                    const { objectExclusions_Colors } = await import('./objectExclusions.js');
                    this.objectExclusions_Colors = objectExclusions_Colors;
                    break;
                case 'Abstract':
                    const { objectExclusions_Abstract } = await import('./objectExclusions.js');
                    this.objectExclusions_Abstract = objectExclusions_Abstract;
                    break;
                case 'Pictures':
                    const { objectExclusions_Pictures } = await import('./objectExclusions.js');
                    this.objectExclusions_Abstract = objectExclusions_Abstract;
                    break;
                default:
                    console.warn('Unknown test type:', this.testType);
            }
        } catch (error) {
            console.error('Error loading exclusions:', error);
            // Initialize with empty object if loading fails
            this[`objectExclusions_${this.testType}`] = {};
        }
    }


    showInitialsDialog() {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 600px; height: 800px; background: white; padding: 20px; border-radius: 5px; z-index: 2000; color: black; font-family: Arial, sans-serif;">
                    <h3 style="margin: 0 0 10px;">Enter Participant Initials</h3>
                    <input type="text" id="initials-input" maxlength="6"
                        style="margin: 10px 0; width: 100%; padding: 5px; color: black; border: 1px solid #ccc;">
                    
                    <h3 style="margin: 10px 0;">Select Test Type</h3>
                    <select id="test-type"
                        style="margin: 10px 0; width: 100%; padding: 5px; color: black; border: 1px solid #ccc;">
                        <option value="Shapes">Shapes</option>
                        <option value="Colors">Colors</option>
                        <option value="Abstract">Abstract</option>     
                        <option value="Pictures">Pictures</option>     
                    </select>
    
                    <h3 style="margin: 10px 0;">Select Number of Trials</h3>
                    <select id="trial-count"
                        style="margin: 10px 0; width: 100%; padding: 5px; color: black; border: 1px solid #ccc;">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>

                    <button id="initials-submit"
                        style="margin-top: 10px; width: 100%; padding: 10px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Start
                    </button>
                </div>
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); z-index: 1999;"></div>
            `;

            document.body.appendChild(dialog);
            const input = dialog.querySelector('#initials-input');
            const trialSelect = dialog.querySelector('#trial-count');
            const testTypeSelect = dialog.querySelector('#test-type');
            const button = dialog.querySelector('#initials-submit');

            button.onclick = async () => {
                const initials = input.value.trim().toUpperCase();
                const trialCount = parseInt(trialSelect.value, 10);
                this.testType = testTypeSelect.value;

                if (!initials) {
                    alert('Please enter valid initials.');
                    return;
                }

                this.userInitials = initials || 'TEST';
                this.trialCount = trialCount;

                // Initialize exclusions after setting test type
                await this.initializeExclusions();
                // Then setup images
                await this.setupImages();

                dialog.remove();
                resolve();
            };
        });
    }


    getRandomObjectNumber(exclude) {
        const validObjects = Array.from(
            { length: this.totalImages },
            (_, i) => i + 1
        ).filter(num => !exclude.includes(num));

        if (validObjects.length === 0) {
            console.error('No valid objects available');
            return Math.floor(Math.random() * this.totalImages) + 1;
        }

        const randomIndex = Math.floor(Math.random() * validObjects.length);
        return validObjects[randomIndex];
    }

    getExcludedObjects(objectNum) {
        const exclusionsKey = `objectExclusions_${this.testType}`;
        const exclusions = this[exclusionsKey];

        console.log('Getting exclusions for', objectNum, 'from', exclusionsKey);
        console.log('Exclusions object:', exclusions);

        if (!exclusions || !exclusions[objectNum]) {
            console.log('No exclusions found');
            return [];
        }

        const filteredExclusions = exclusions[objectNum].filter(num => num <= this.totalImages);
        console.log('Filtered exclusions:', filteredExclusions);
        return filteredExclusions;
    }


    async initializeExclusions() {
        try {
            const module = await import('./objectExclusions.js');

            switch (this.testType) {
                case 'Shapes':
                    this.objectExclusions_Shapes = module.objectExclusions_Shapes;
                    break;
                case 'Colors':
                    this.objectExclusions_Colors = module.objectExclusions_Colors;
                    break;
                case 'Abstract':
                    this.objectExclusions_Abstract = module.objectExclusions_Abstract;
                    break;
                default:
                    console.warn('Unknown test type:', this.testType);
            }
        } catch (error) {
            console.error('Error loading exclusions:', error);
            this[`objectExclusions_${this.testType}`] = {};
        }
    }

    getExcludedObjects(objectNum) {
        const exclusionsKey = `objectExclusions_${this.testType}`;
        const exclusions = this[exclusionsKey];

        if (!exclusions || !exclusions[objectNum]) {
            return [];
        }

        return exclusions[objectNum].filter(num => num <= this.totalImages);
    }



    processGazeData(gazePoint, trialStartTime) {
        const gazeData = {
            x: gazePoint.x,
            y: gazePoint.y,
            time: Date.now(), // Absolute timestamp
            relativeTime: Date.now() - trialStartTime, // Time since trial start
            phase: this.calibrationComplete ? 'experiment' : 'calibration'
        };
        this.currentGazeData.push(gazeData);
        this.allGazeData.push(gazeData);
        console.log('Gaze Data Collected:', gazeData);
    }

    // Add the following methods to the TrialManager class
    async startCalibrationPhase() {
        if (this.calibrationInProgress || this.calibrationComplete) {
            console.log("Calibration already in progress or completed");
            return;
        }
        this.calibrationInProgress = true;

        try {
            const calibrationContainer = document.createElement("div");
            calibrationContainer.id = "calibration-container";
            Object.assign(calibrationContainer.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,1.0)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "1000",
                color: "white",
                textAlign: "center",
            });

            calibrationContainer.innerHTML = `
                <h2>Remaining Calibration Points: <span id="calibration-points">${this.CALIBRATION_POINTS}</span></h2>
            `;
            document.body.appendChild(calibrationContainer);

            let remainingPoints = this.CALIBRATION_POINTS;

            const createCalibrationPoint = () => {
                const existingPoint = calibrationContainer.querySelector('.calibration-point');
                if (existingPoint) existingPoint.remove();

                if (remainingPoints <= 0) {
                    calibrationContainer.remove();
                    this.calibrationComplete = true;
                    this.calibrationInProgress = false;
                    this.startExperiment();
                    return;
                }

                const point = document.createElement("div");
                point.className = 'calibration-point';
                Object.assign(point.style, {
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "yellow",
                    cursor: "pointer",
                    zIndex: "1001"
                });

                const x = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
                const y = Math.random() * (window.innerHeight * 0.8) + window.innerHeight * 0.1;
                point.style.left = `${x}px`;
                point.style.top = `${y}px`;

                const clickHandler = () => {
                    if (!this.calibrationInProgress) return;

                    webgazer.recordScreenPosition(x, y, 'click');
                    point.remove();
                    remainingPoints--;
                    document.getElementById("calibration-points").textContent = remainingPoints;
                    createCalibrationPoint();
                };

                point.addEventListener("click", clickHandler, { once: true });
                calibrationContainer.appendChild(point);
            };

            createCalibrationPoint();

        } catch (err) {
            console.error("Calibration error:", err);
            this.calibrationInProgress = false;
        }
    }

    hide(element) {
        if (element) {
            element.style.display = "none";
        }
    }

    showCentered(element) {
        const containerWidth = this.testContainer.offsetWidth;
        const containerHeight = this.testContainer.offsetHeight;

        Object.assign(element.style, {
            position: "absolute",
            left: `${(containerWidth - element.offsetWidth) / 2}px`,
            top: `${(containerHeight - element.offsetHeight) / 2}px`,
            display: "block",
        });

        this.testContainer.appendChild(element);
    }

    showBlackScreen(duration = 1000) {
        const blackScreen = document.createElement("div");

        Object.assign(blackScreen.style, {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            top: "0",
            left: "0",
            zIndex: "1000",
        });

        this.testContainer.appendChild(blackScreen);

        setTimeout(() => {
            if (blackScreen.parentNode) {
                blackScreen.parentNode.removeChild(blackScreen);
            }
        }, duration);
    }

    // Generate custom filename with initials and timestamp
    generateFileName() {
        const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
        return `${this.userInitials}_${timestamp}_data.json`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async setupImages() {
        console.log(`Setting up images for test type: ${this.testType}`);

        const loadingMsg = document.createElement('div');
        // ... (keep existing loading message setup)

        try {
            // Determine correct total images based on test type
            const imageCounts = {
                'Abstract': 403,
                'Shapes': 193,
                'Colors': 10,
                'Pictures': 10
            };

            this.totalImages = imageCounts[this.testType];
            if (!this.totalImages) {
                throw new Error(`Unknown test type: ${this.testType}`);
            }

            // Clear existing images
            this.objectImages = {};
            const imagePromises = [];

            // Only load up to totalImages
            for (let i = 1; i <= this.totalImages; i++) {
                const img = new Image();
                const promise = new Promise((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Failed to load image ${i}`));
                });

                img.src = `${this.testType}/object${i.toString().padStart(3, "0")}.png`;
                this.objectImages[i] = img;
                imagePromises.push(promise);
            }

            await Promise.all(imagePromises);
        } catch (error) {
            console.error('Error loading images:', error);
            throw error;
        } finally {
            loadingMsg.remove();
        }
    }


    createImage(objectNum) {
        const img = document.createElement("img");
        img.src = `${this.testType}/object${objectNum.toString().padStart(3, "0")}.png`;
        img.className = "object";
        return img;
    }

    async initWebGazer() {
        try {
            // Check if WebGazer is loaded
            if (typeof webgazer === "undefined") {
                console.error("WebGazer is not loaded. Check script inclusion.");
                return;
            }

            console.log("Starting WebGazer initialization...");

            // Modify resume to handle potential null references
            await webgazer.resume().catch(err => {
                console.warn("WebGazer resume warning:", err);
            });

            console.log("WebGazer explicitly resumed.");

            // Enable video preview and face overlay visualization
            webgazer.showVideoPreview(true); //only activate to debug
            webgazer.showFaceOverlay(false); //only activate to debug
            // Set gaze listener to collect gaze data
            webgazer.setGazeListener((data, elapsedTime) => {
                if (data && this.currentTrialData.startTime) {
                    this.processGazeData(data, this.currentTrialData.startTime);
                }
            });

            // Configure WebGazer with comprehensive settings
            webgazer
                .setRegression("weightedRidge")
                .setTracker("TFFacemesh")
                .showPredictionPoints(false);

            // Start WebGazer with error handling
            await webgazer.begin().catch(err => {
                console.error("WebGazer begin error:", err);
            });

            console.log("WebGazer initialized successfully with face mesh.");
        } catch (err) {
            console.error("Comprehensive WebGazer initialization error:", err);

            // Display user-friendly error
            if (this.instructionElement) {
                this.instructionElement.innerText = "Error initializing eye tracking. Please check console and ensure camera permissions.";
            }

            // Additional browser compatibility check
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error("Browser does not support camera access");
                if (this.instructionElement) {
                    this.instructionElement.innerText += "\nYour browser does not support camera access.";
                }
            }
        }
    }

    getRandomObjectNumber(exclude) {
        // Log the exclusion list for debugging
        console.log('Exclude list:', exclude);

        const maxAttempts = 100;
        let attempts = 0;
        let objectNum;

        do {
            objectNum = Math.floor(Math.random() * this.totalImages) + 1;
            attempts++;

            if (attempts > maxAttempts) {
                console.warn('Max attempts reached while finding random object');
                break;
            }

            // Log each attempt
            console.log(`Attempt ${attempts}: trying object ${objectNum}`);
        } while (exclude.includes(objectNum));

        console.log('Selected object:', objectNum);
        return objectNum;
    }

    getExcludedObjects(objectNum) {
        const exclusionsKey = `objectExclusions_${this.testType}`;
        const exclusions = this[exclusionsKey];

        if (!exclusions || !exclusions[objectNum]) {
            return [];
        }

        // Ensure returned exclusions are within valid range
        return exclusions[objectNum].filter(num => num <= this.totalImages);
    }

    async runTrial(trialType) {
        try {
            this.currentGazeData = [];
            this.gazeData = [];
            const startTime = Date.now();

            // Choose first object
            const object1Num = Math.floor(Math.random() * this.totalImages) + 1;
            const exclusionList = this.getExcludedObjects(object1Num);
            const excludeList = [...exclusionList, object1Num];

            this.currentTrialData = {
                trialNumber: this.currentTrial + 1,
                type: trialType,
                startTime: startTime,
                object1: object1Num,
                testObjects: [],
                positions: [],
                gazeData: [],
            };

            // Show first object
            const sampleObject = this.createImage(object1Num);
            this.showCentered(sampleObject);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            sampleObject.remove();

            await this.showBlackScreen(2000);

            // Create test phase objects
            let testObjects = [];
            if (trialType === 1) {
                // Get a non-excluded object
                const object2Num = this.getRandomObjectNumber(excludeList);
                testObjects = [
                    { num: object1Num, isTarget: true },
                    { num: object2Num, isTarget: false },
                    { num: object2Num, isTarget: false }
                ];
            } else {
                // Get two different non-excluded objects
                const object2Num = this.getRandomObjectNumber(excludeList);
                const newExcludeList = [...excludeList, object2Num];
                const object3Num = this.getRandomObjectNumber(newExcludeList);

                testObjects = [
                    { num: object1Num, isTarget: true },
                    { num: object2Num, isTarget: false },
                    { num: object3Num, isTarget: false }
                ];
            }

            // Randomize positions and continue with trial
            this.shuffleArray(testObjects);

            this.currentTrialData.testObjects = testObjects.map(obj => obj.num);
            this.currentTrialData.positions = testObjects.map((obj, index) => ({
                position: ['left', 'center', 'right'][index],
                objectNum: obj.num,
                isTarget: obj.isTarget,
            }));

            const imageElements = testObjects.map((obj) => this.createImage(obj.num));
            this.positionTestObjects(imageElements);

            await new Promise((resolve) => setTimeout(resolve, 10000));

            imageElements.forEach((img) => img.remove());
            this.currentTrialData.endTime = Date.now();
            this.currentTrialData.gazeData = this.currentGazeData;
            this.trialData.push(this.currentTrialData);

            this.currentTrial++;
        } catch (error) {
            console.error('Error in runTrial:', error);
            throw error;
        }
    }

    async runTrainingTrial(sampleObjectNum) {
        const sampleObject = this.createImage(sampleObjectNum);
        this.showCentered(sampleObject);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        sampleObject.remove();
    }

    positionTestObjects(objects) {
        const containerWidth = this.testContainer.offsetWidth;
        const containerHeight = this.testContainer.offsetHeight;
        const offset = containerWidth * 0.3; // 30% of container width
        const positions = ["left", "center", "right"];

        objects.forEach((obj, index) => {
            obj.style.position = "absolute"; // Ensure object is absolutely positioned
            let xPos = 0; // Default x position

            // Explicitly handle positions based on the index
            if (index === 0) {
                xPos = -offset; // "left" position
            } else if (index === 1) {
                xPos = 0; // "center" position
            } else if (index === 2) {
                xPos = offset; // "right" position
            }

            // Apply calculated x position to each object
            obj.style.left = `${xPos}px`;

            // Optional: Set y position based on your layout or container height
            // You can add further logic here if needed to adjust vertical positions.
            // For example, we could center objects vertically in the container:
            const yPos = (containerHeight - obj.offsetHeight) / 2;
            obj.style.top = `${yPos}px`;
        });
    }

    async runTestTrial(sampleObjectNum) {
        // Show sample object first
        const sampleObject = this.createImage(sampleObjectNum);
        this.showCentered(sampleObject);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        sampleObject.remove();

        // Black screen pause
        await this.showBlackScreen(2000);

        // Create test objects
        let testObjects = [];
        if (Math.random() < 0.5) {
            // Type 1 trial
            let otherObjectNum;
            do {
                otherObjectNum =
                    Math.floor(Math.random() * 403) + 1;
            } while (otherObjectNum === sampleObjectNum);

            testObjects = [
                this.createImage(sampleObjectNum),
                this.createImage(otherObjectNum),
                this.createImage(otherObjectNum),
            ];
        } else {
            // Type 2 trial
            const usedObjects = new Set([sampleObjectNum]);
            while (usedObjects.size < 3) {
                const newObjectNum =
                    Math.floor(Math.random() * 403) + 1;
                if (!usedObjects.has(newObjectNum)) {
                    usedObjects.add(newObjectNum);
                    testObjects.push(
                        this.createImage(newObjectNum),
                    );
                }
            }
        }

        this.positionTestObjects(testObjects);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        testObjects.forEach((obj) => obj.remove());
        await this.showBlackScreen(2000);
    }

    positionTestObjects(objects) {
        const containerWidth = this.testContainer.offsetWidth;
        const containerHeight = this.testContainer.offsetHeight;
        const offset = containerWidth * 0.3; // 30% of container width
        const positions = ["left", "center", "right"];

        objects.forEach((obj, index) => {
            obj.style.position = "absolute";
            if (index === 0) {
                obj.style.left = `${containerWidth / 2 - 200}px`;
                obj.style.top = `${containerHeight / 2 - 200}px`;
            } else if (index === 1) {
                obj.style.left = `${containerWidth / 2 - 200 - offset}px`;
                obj.style.top = `${containerHeight / 2 - 200}px`;
            } else if (index === 2) {
                obj.style.left = `${containerWidth / 2 - 200 + offset}px`;
                obj.style.top = `${containerHeight / 2 - 200}px`;
            } else {
                obj.style.left = `${containerWidth / 2 - 200 + offset}px`;
                obj.style.top = `${containerHeight / 2 - 200}px`;
            }
            obj.style.display = "block";
            this.testContainer.appendChild(obj);
        });
    }

    showCentered(element) {
        element.style.position = "absolute";
        element.style.top = "50%";
        element.style.left = "50%";
        element.style.transform = "translate(-50%, -50%)";
        element.style.display = "block";
        this.testContainer.appendChild(element);
    }

    async showBlackScreen(duration) {
        document.body.style.backgroundColor = "black";
        await new Promise((resolve) =>
            setTimeout(resolve, duration),
        );
        document.body.style.backgroundColor = "black";
    }

    hide(element) {
        element.style.display = "none";
    }

    // Modify startExperiment to include WebGazer resume
    async startExperiment() {
        if (!this.calibrationComplete) {
            console.warn("Attempt to start experiment before calibration");
            return;
        }

        console.log("Starting experiment...");
        this.hide(this.instructionElement);

        for (let i = 0; i < this.trialCount; i++) {
            await this.runTrial(
                this.trialTypes[i % this.trialTypes.length]
            );
        }

        // Save data and complete experiment
        try {
            const experimentData = {
                trialData: this.trialData,
                gazeData: this.allGazeData, // Complete gaze data record
                timestamp: Date.now(),
                totalTrials: this.trialCount
            };

            // Save using localforage
            await localforage.setItem("experimentData", experimentData);
            console.log("Data saved to localforage successfully");

            // Create and trigger download of JSON file
            const dataStr = "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(experimentData, null, 2));

            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", this.generateFileName());

            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            alert("Experiment completed! Data saved and downloaded to your ~/Documents folder.");
        } catch (err) {
            console.error("Error saving data:", err);
            alert("Error saving experiment data. Please check the console.");
        }
    }
}


