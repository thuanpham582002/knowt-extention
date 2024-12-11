# Text Tracker Extension

A Chrome extension for tracking and comparing text input with ProseMirror content on Knowt.com.

## Features

- Automatically detects skipped questions and correct answers
- Real-time text comparison
- Auto-resizing text input
- Multi-line support
- Visual feedback for matching text

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run build:release` to build the extension
4. Load the extension in Chrome

- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` folder from the project directory

## Development

Start the development build with watch mode:

```bash
npm run watch
```

## Scripts

- `npm run build` - Build the extension
- `npm run watch` - Build with watch mode
- `npm run release` - Create a new release
- `npm run build:release` - Build and package for distribution

## Project Structure
```plaintext
text-tracker-extension/
├── dist/ # Built extension files
├── public/ # Static files
├── scripts/ # Build and release scripts
├── src/ # Source code
│ ├── components/ # React components
│ └── content.tsx # Content script entry
├── package.json # Dependencies and scripts
└── webpack.config.js # Build configuration
```

## Version History

Current version: 2.0.0

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
