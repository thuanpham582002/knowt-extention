# Project File Structure

```
knowt-extension/
├── frontend/                        # Frontend Chrome extension code
│   ├── src/                        # Source code
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Dictionary/        # Dictionary related components
│   │   │   ├── Practice/         # Text practice components
│   │   │   └── Reminder/         # Reminder system components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # Core services
│   │   │   ├── storage/         # Chrome storage service
│   │   │   ├── speech/          # Web Speech API service
│   │   │   └── notifications/   # Chrome notifications
│   │   ├── utils/               # Utility functions
│   │   ├── popup/               # Extension popup UI
│   │   ├── content/             # Content scripts
│   │   └── background/          # Service worker & background scripts
│   ├── scripts/                  # Build and release scripts
│   ├── public/                   # Static assets
│   │   └── manifest.json        # Chrome extension manifest
│   ├── webpack.config.js         # Webpack configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── package.json              # Frontend dependencies
│
├── Documentation/                 # Project documentation
│   ├── App-Flow.md               # Application flow documentation
│   ├── Tech-Stack.md             # Technology stack details
│   ├── File-Structure.md         # This file
│   └── Product Requirements Document.md  # PRD
│
└── .gitignore                    # Git ignore rules
```

## Directory Details

### Frontend
Contains all the Chrome extension frontend code:
- **src/components/**: Reusable UI components using Shadcn/ui and Radix
- **src/hooks/**: Custom React hooks for state management and browser APIs
- **src/services/**: Core functionality implementations
- **src/popup/**: Extension popup interface
- **src/content/**: Content scripts for Knowt.com integration
- **src/background/**: Service worker for alarms and background tasks
- **public/**: Static assets and manifest file
- **scripts/**: Build, development, and release automation

### Documentation
Contains all project documentation:
- Technical specifications and stack details
- Product requirements and features
- Application flow and architecture
- Development guidelines and best practices

### Build Configuration
- Webpack 5.x setup for Chrome Extension
- TailwindCSS configuration
- TypeScript compiler settings
- Development tools (ESLint, Prettier, Husky)
