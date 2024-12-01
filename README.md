# CONTENTS

- [Gaze Tracking in an Educational Setting](# Gaze Tracking for use in an Educational Setting)
- [Entry TUI](# Student Page Launch Interface)
- [Contributing](# Contributing)

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

- **Eye Tracking**: Uses **WebGazer.js** for real-time gaze tracking.
- **Calibration**: Ensures accurate gaze data by requiring participants to click on calibration points.
- **Custom Trials**: Supports two trial types:
  - **Trial 1**: One target object and two identical distractor objects.
  - **Trial 2**: One target object and two unique distractor objects.
- **Data Export**: Automatically saves data as a JSON file after the experiment.
- **Responsive Design**: Adapts to different screen sizes.

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

- **index.html**: Main HTML file containing the experiment structure.
- **webgazer.js**: Eye-tracking library for gaze data collection.
- **localforage.min.js**: Library for browser-based storage.
- **/models/**: Folder containing object images used in the trials.
- **README.md**: This file.

---

### Key Functions and Components

#### `TrialManager`

Central class controlling the experiment flow.

- **Calibration Phase**: Handles the green-dot calibration process.
- **Trial Execution**: Displays objects, records gaze data, and saves results.
- **Data Management**: Formats and downloads experimental data as a JSON file.

#### `setupImages()`

Preloads object images for smooth rendering during trials.

#### `runTrial(trialType)`

Runs individual trials based on the type:

- **Type 1**: Target + two identical distractors.
- **Type 2**: Target + two unique distractors.

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

- Edit the `runTrial()` function in the script.

### Change Calibration Points

Modify the `CALIBRATION_POINTS` variable in the `TrialManager` class to adjust the number of points.

### Add More Images

Add images to the `/models/` directory and ensure their names follow the format `objectXXX.png`.

---

## License

This experiment code is open source and available for modification. Attribution to the original author is appreciated.

---

## Acknowledgments

- **WebGazer.js** for providing the foundational eye-tracking library.
- Experiment design inspired by object recognition and gaze-tracking research.

# Student Page Launch Interface

This script provides a user-friendly TUI (Text User Interface) to initialize and launch a local web server for student-specific project pages using **http-server** and **Chromium**. It is designed for a collaborative environment where each student has a dedicated directory containing their project files.

---

## Features

- **Colorblind-Friendly Design**: Uses a combination of bright cyan and orange for high-contrast visuals.
- **Student Directory Selection**: Displays a menu of predefined student names for easy navigation.
- **Secure Server**: Starts an HTTPS server using `http-server` with custom certificate files.
- **Automatic Browser Launch**: Opens the student's project page in Chromium after the server starts.
- **Error Handling**: Validates directories, required files, and program dependencies.

---

## How It Works

### Workflow

1. **Launch the Script**:
    - Run the script to initialize the TUI interface.
2. **Select a Student**:
    - Pick a student from the list of available options.
3. **Validate Environment**:
    - The script checks for:
        - Required directories and files (`cert.pem`, `key.pem`, and `index.html`).
        - Installed programs (`http-server` and `Chromium`).
4. **Start Server**:
    - A secure server is started using `http-server` with HTTPS on port `8080`.
5. **Open Browser**:
    - Chromium is launched to display the student's project page.
6. **Exit and Cleanup**:
    - Use `Ctrl+C` to stop the server.

---

## Requirements

### Programs

- **http-server**: Node.js-based static web server.
  - Install via `npm install -g http-server`.
- **Chromium**: Modern browser required for launching project pages.
  - Install via your system's package manager (e.g., `apt install chromium` for Ubuntu).

### Files

- **cert.pem** and **key.pem**: SSL certificate and private key for HTTPS.
- **Student Folders**: A directory structure containing each student’s project files, including `index.html`.

---

## Installation

1. **Clone or Copy the Script**:

    - Save the script as `launch_student_page.sh` or a similar name.

2. **Ensure Prerequisites**:

    - Install `http-server` and `Chromium`.
    - Place `cert.pem` and `key.pem` in the script directory.

3. **Organize Directories**:
    - Set up a base directory (`./StudentFolders` by default) with subdirectories for each student (e.g., `./StudentFolders/TJGu`).

---

## Usage

1. **Run the Script**:

    ```bash
    ./launch_student_page.sh
    ```

2. **Follow Prompts**:

    - Specify the base directory or press `Enter` to use the default `./StudentFolders`.
    - Select a student from the displayed menu.

3. **View Project**:
    - The script starts a secure server and opens the project in Chromium.
    - Press `Ctrl+C` to stop the server.

---

## Customization

### Modify Student List

Update the `STUDENTS` array in the script to include or remove names:

```bash
declare -a STUDENTS=(
    "StudentA"
    "StudentB"
    ...
    "StudentN"
)
```

### Change Base Directory

Modify the `default_base_dir` variable to set a different default base directory:

```bash
default_base_dir="./NewBaseDirectory"
```

### Update Port

Change the `port` variable in the `start_server_and_browser` function:

```bash
local port=9090
```

---

## Troubleshooting

### Common Errors

- **Directory Not Found**:

  - Ensure the base directory and student folders exist.
  - Verify file permissions.

- **Missing Files**:

  - Ensure `cert.pem` and `key.pem` are in the base directory.
  - Ensure `index.html` exists in the student’s folder.

- **Programs Not Found**:
  - Install `http-server` and `Chromium` using the provided instructions.

---

## License

This script is open-source and may be freely modified and distributed. Attribution to the original author is appreciated.

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

I try my best to follow the styles enforced by the [Black](https://black.readthedocs.io/en/stable/) code formatter [![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black).  Please do your best to follow our coding style guidelines to maintain consistency across the project.

### Reporting Issues

If you encounter any issues or have suggestions, please [open an issue on GitHub](https://github.com/mrhunsaker/StudentDataGUI/issues). Provide as much detail as possible, including your operating system and relevant configuration.

### Development Workflow

- Before starting to work on an issue, make sure it's not already assigned or being worked on.
- If you plan major changes, it's a good idea to open an issue for discussion first.

### Code of Conduct

Everyone participating in the Black project, and in particular in the issue tracker, pull requests, and social media activity, is expected to treat other people with respect and more generally to follow the guidelines articulated in the [Python Community Code of Conduct](https://www.python.org/psf/codeofconduct/).
