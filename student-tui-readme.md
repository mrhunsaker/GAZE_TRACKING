# Student Page Launch TUI

A Text User Interface (TUI) script for launching student web pages using a secure local server and Chromium browser. This tool is designed to simplify the process of viewing student web projects in a controlled environment.

## Prerequisites

Before using this script, ensure you have the following installed:

1. **Node.js and npm**
   - Required for running http-server
   - Installation varies by operating system
   - Visit [Node.js website](https://nodejs.org/) for installation instructions

2. **http-server**
   ```bash
   npm install -g http-server
   ```

3. **Chromium Browser**
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
   chmod +x launch_student_page.sh
   ```

## Directory Structure

The script expects the following directory structure:
```
your_base_directory/
├── cert.pem              # SSL certificate
├── key.pem              # SSL private key
├── Student01/
│   └── index.html
├── Student02/
│   └── index.html
├── Student03/
│   └── index.html
├── Student04/
│   └── index.html
└── Student05/
    └── index.html
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
   ./launch_student_page.sh
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

- Colorblind-friendly TUI
- Secure HTTPS server
- Automatic browser launch
- Input validation
- Easy student selection
- Clean process management

## Troubleshooting

1. **"Error: http-server is not installed"**
   - Run `npm install -g http-server`
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

- The script uses self-signed certificates for HTTPS
- Chromium is launched with `--ignore-certificate-errors` for local development
- Use in a controlled, local environment only

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
