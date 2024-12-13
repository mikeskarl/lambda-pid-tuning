# Lambda PID Tuning Tool

A web application for tuning PID controllers in wastewater treatment systems using the step-response (lambda) method.

## Features

- Upload process data in CSV format
- Analyze step response characteristics
- Calculate optimal PID parameters
- Support for multiple control system types
- Interactive visualization of results

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/mikeskarl/lambda-pid-tuning.git
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Select your control system configuration
2. Upload your process data CSV file
3. Review the calculated parameters
4. Adjust lambda value if needed
5. Apply the suggested PID settings

## CSV Format

Your input CSV should have the following columns:
- time: Time in seconds
- MV: Manipulated Variable
- CV: Controlled Variable

## Created By

Mike Karl, Global Digital Water Lead at AECOM

## License

MIT License - See LICENSE file for details