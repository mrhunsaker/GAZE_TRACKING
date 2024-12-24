# CONTENTS

-   [Gaze Tracking in an Educational Setting](# Gaze Tracking for use in an Educational Setting)
-   [Entry TUI](# Student Page Launch Interface)
-   [Contributing](# Contributing)

# Gaze Tracking for use in an Educational Setting

This repository contains the source code for an experiment designed to use **WebGazer.js**, an eye-tracking library, to collect gaze data during a visual object recognition task. Participants complete trials where they observe objects, search for a target among multiple options, and have their eye movements recorded.

## Overview

The experiment consists of:

1. A **calibration phase**, where the participant follows a moving dot to calibrate the eye-tracking system.
2. A **testing phase**, where participants perform object recognition trials. Each trial involves:
    - Viewing a single object for 3 seconds.
    - A 2-second black screen pause.
    - A test phase where the participant searches for the object among three images.

The experiment collects and saves gaze data and trial information for further analysis.

---

## Features

-   **Eye Tracking**: Uses **WebGazer.js** for real-time gaze tracking.
-   **Calibration**: Ensures accurate gaze data by requiring participants to click on calibration points.
-   **Custom Trials**: Supports two trial types:
    -   **Trial 1**: One target object and two identical distractor objects.
    -   **Trial 2**: One target object and two unique distractor objects.
-   **Data Export**: Automatically saves data as a JSON file after the experiment.
-   **Responsive Design**: Adapts to different screen sizes.

---

## How It Works

### Experiment Flow

1. **Instructions**: Participants are shown basic instructions and prompted to start by pressing any key.
2. **Calibration Phase**:
    - A green dot appears in random locations.
    - The participant clicks the dot, which records calibration points.
    - The process repeats for the specified number of calibration points (default: 10).
3. **Testing Phase**:
    - A single object (target) is displayed at the center for 3 seconds.
    - A black screen is shown for 2 seconds.
    - Three objects (target + distractors) appear in randomized positions (left, center, right) for 10 seconds.
    - Gaze data is recorded throughout the trial.
4. **Data Storage**:
    - Trial and gaze data are saved to the browser's local storage using `localforage`.
    - Data can be downloaded as a JSON file for further analysis.

---

### File Structure

-   **index.html**: Main HTML file containing the experiment structure.
-   **webgazer.js**: Eye-tracking library for gaze data collection.
-   **localforage.min.js**: Library for browser-based storage.
-   **/models/**: Folder containing object images used in the trials.
-   **README.md**: This file.

---

### Key Functions and Components

#### `TrialManager`

Central class controlling the experiment flow.

-   **Calibration Phase**: Handles the green-dot calibration process.
-   **Trial Execution**: Displays objects, records gaze data, and saves results.
-   **Data Management**: Formats and downloads experimental data as a JSON file.

#### `setupImages()`

Preloads object images for smooth rendering during trials.

#### `runTrial(trialType)`

Runs individual trials based on the type:

-   **Type 1**: Target + two identical distractors.
-   **Type 2**: Target + two unique distractors.

#### `startCalibrationPhase()`

Runs the calibration sequence, presenting dots at random positions and collecting screen positions as participants click.

#### `initWebGazer()`

Initializes the **WebGazer** library for eye tracking and sets configuration options like regression type and tracker.

---

## Setup and Usage

1. **Pre-requisites**:

    - A modern browser (preferably Chrome or Edge) that supports camera access.
    - A webcam for eye tracking.

2. **Running the Experiment**:

    - Clone the repository.
    - Place the files on a local server (e.g., npm `http-server` set to use SSL).

        - Create a signed certificate using OpenSSL

        ```bash
        openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
        ```

        - Run the http-server

        ```bash
        http-server -S -C cert.prm -K key.pem -p 8080 # or another port
        ```

    - Open `index.html` in the browser.
    - Follow on-screen instructions to calibrate and start the experiment.

3. **Data Output**:
    - At the end of the experiment, the data is saved to the browser's storage.
    - A JSON file can be downloaded for further analysis.

---

## Troubleshooting

1. **WebGazer Not Loading**:

    - Ensure `webgazer.js` is included in the same directory as `index.html`.
    - Check the browser console for errors.

2. **Camera Access Issues**:

    - Ensure the browser has permission to access the webcam.
    - Verify that no other application is using the camera.

3. **Calibration Issues**:
    - Ensure participants click directly on the calibration dots.
    - Use a well-lit environment to enhance camera tracking performance.

---

## Customization

### Modify Trial Types

To add or adjust trial types:

-   Edit the `runTrial()` function in the script.

### Change Calibration Points

Modify the `CALIBRATION_POINTS` variable in the `TrialManager` class to adjust the number of points.

### Add More Images

Add images to the `/models/` directory and ensure their names follow the format `object%3d.png` (_e.g._, object001, object402).

---

## License

This experiment code is open source and available for modification. Attribution to the original author is appreciated.

---

## Acknowledgments

-   **WebGazer.js** for providing the foundational eye-tracking library.
-   Experiment design inspired by object recognition and gaze-tracking research.
-   **localforage** for browser-based data storage.
-   **OpenSSL** for generating SSL certificates.
-   The open-source community for sharing knowledge and tools.

# Student Page Launch Interface

A Text User Interface (TUI) script for launching student web pages using a secure local server and Chromium browser. This tool is designed to simplify the process of viewing student web projects in a controlled environment.

## Prerequisites

Before using this script, ensure you have the following installed:

1. **Node.js and npm**

    - Required for running http-server (One can use python's http.server as well, but since I was already using javascript, I decided to use http-server from npm just to keep to one laguage)
    - Installation varies by operating system
    - Visit [Node.js website](https://nodejs.org/) for installation instructions

2. **http-server**
   It is best to avoid using the global `-g` flag when installing npm packages. Instead, install http-server locally in the script directory:
    ```bash
    npm install  http-server
    ```
3. **open-ssl**
    - Required for generating SSL certificates
    - Installation varies by operating system
    - For Debian/Ubuntu:
    ```bash
    sudo apt install openssl
    ```
    - For Fedora:
    ```bash
    sudo dnf install openssl
    ```
    - For Arch Linux:
    ```bash
    sudo pacman -S openssl
    ```
4. **Chromium Browser**
    - For Debian/Ubuntu:
        ```bash
        sudo apt install chromium-browser
        ```
    - For Fedora:
        ```bash
        sudo dnf install chromium
        ```
    - For Arch Linux:
        ```bash
        sudo pacman -S chromium
        ```

## Installation

1. Clone or download the script to your local machine

2. Make the script executable:
    ```bash
    chmod +x runexperiment.sh
    ```

## Directory Structure

The script expects the following directory structure:

```bash
GAZE_ANALYSIS/					# Parent Directory
├── jsonOutput.json
├── LICENSE
├── Plotting_Analysis/  		# Analysis and plotting scripts
│   ├── AnalysisPlotting.py
│   └── data
│       ├── Student1Data_YYYY-MM-DD-hh-mm-ss_data.json
│       ├── Student2Data_YYYY-MM-DD-hh-mm-ss_data.json
│       ├── ...
│       └── ...
├── README.md	# This README.md file
├── runexperiment.sh			# Script for launching student pages
├── StudentFolders/				# Base Directory
│   ├── Student1/
│   │   ├── index.html
│   │   ├── models
│   │   │   ├── object001.png
│   │   │   ├── object002.png
│   │   │   ├──  ...
│   │   │   └── object_n.png
│   ├── Student2/
│   │   ├── index.html
│   │   ├── models
│   │   │   ├── object001.png
│   │   │   ├── object002.png
│   │   │   ├──  ...
│   │   │   └── object_n.png
│   ├── Student_n/
│   │   ├── index.html
│   │   ├── models
│   │   │   ├── object001.png
│   │   │   ├── object002.png
│   │   │   ├──  ...
│   │   │   └── object_n.png
│   ├── webgazer.js
│   ├── localforage.min.js
│   ├── localforage.js
│   └── webgazer.js.map
```

To create the required directory structure:

```bash
# Create student directories
for i in {01..05}; do
  mkdir -p "Student$i"
  touch "Student$i/index.html"
done
```

## SSL Certificate Setup

Generate self-signed certificates for HTTPS:

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

## Usage

1. Navigate to the directory containing the script:

    ```bash
    cd /path/to/script/directory
    ```

2. Run the script:

    ```bash
    bash ./runexperiment.sh
    ```

3. Follow the prompts:

    - Enter the base directory path (or press Enter for current directory)
    - Select a student number from the menu
    - The script will:
        - Start a secure http-server
        - Launch Chromium in incognito mode
        - Navigate to the student's page

4. To stop the server and close the script:
    - Press `Ctrl+C` in the terminal

## Features

-   Colorblind-friendly TUI
-   Secure HTTPS server
-   Automatic browser launch
-   Input validation
-   Easy student selection
-   Clean process management

## Troubleshooting

1. **"Error: http-server is not installed"**

    - Run `npm install http-server`
    - Ensure npm is installed and in your PATH

2. **"Error: Chromium is not installed"**

    - Install Chromium using your system's package manager
    - Ensure the browser is in your PATH

3. **"Error: Certificate files not found"**

    - Generate SSL certificates using the command in the SSL Certificate Setup section
    - Ensure cert.pem and key.pem are in the base directory

4. **"Error: No directory found for student"**

    - Check that the student directories are created with correct names
    - Ensure you have proper permissions to access the directories

5. **"Error: No index.html found"**
    - Create an index.html file in the student's directory
    - Check file permissions

## Security Notes

-   The script uses self-signed certificates for HTTPS
-   Chromium is launched with `--ignore-certificate-errors` for local development
-   Use in a controlled, local environment only

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the Apache 2.0 - see the LICENSE file for details.

---

# Contributing

1. Commit your changes:

```bash
git commit -m "Your descriptive commit message"
```

2. Push to your fork:

```bash
git push origin feature-or-bugfix-branch
```

3. Submit a pull request:
    - Go to the Pull Requests tab on GitHub.
    - Click the "New Pull Request" button.
    - Select the branch with your changes.
4. Describe your changes in detail, providing context and reasons for the changes.

#### Code Style

I try my best to follow the styles enforced by the [Black](https://black.readthedocs.io/en/stable/) code formatter [![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black). Please do your best to follow our coding style guidelines to maintain consistency across the project.

### Reporting Issues

If you encounter any issues or have suggestions, please [open an issue on GitHub](https://github.com/mrhunsaker/StudentDataGUI/issues). Provide as much detail as possible, including your operating system and relevant configuration.

### Development Workflow

-   Before starting to work on an issue, make sure it's not already assigned or being worked on.
-   If you plan major changes, it's a good idea to open an issue for discussion first.

### Code of Conduct

Everyone participating in the Black project, and in particular in the issue tracker, pull requests, and social media activity, is expected to treat other people with respect and more generally to follow the guidelines articulated in the [Python Community Code of Conduct](https://www.python.org/psf/codeofconduct/).
