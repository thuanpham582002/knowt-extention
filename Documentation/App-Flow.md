# App Flow

1. **Extension Initialization Flow**:
   - User installs Chrome extension
   - Extension loads on Knowt.com website
   - Popup interface becomes accessible through Chrome toolbar

2. **Text Practice Feature Flow**:
   - User visits Knowt.com
   - Extension detects written text on the page
   - Creates an inline text holder for retyping practice
   - User practices by retyping the detected text
   - Progress is stored locally in Chrome storage

3. **Daily Reminder System Flow**:
   - Chrome's alarm API manages reminder scheduling
   - Triggers in two scenarios:
     - On new tab open
     - Every 30 minutes during active browsing
   - Shows popup reminder using Chrome notifications
   - User can:
     - Start practice
     - Dismiss reminder
     - Adjust reminder settings

4. **Vocabulary Management Flow**:
   - All vocabulary stored in Chrome's local storage
   - User can:
     - Add new words from Knowt.com content
     - Play audio pronunciation (using browser's built-in speech synthesis)
     - View vocabulary suggestions
     - Track learning progress locally

5. **Error Handling Flow**:
   - Graceful degradation for offline functionality
   - User-friendly error messages for:
     - Storage limits
     - Audio playback issues
     - Browser compatibility problems
   - Local error logging for debugging

6. **Data Persistence Flow**:
   - Uses Chrome's storage.local API
   - Stores:
     - User's vocabulary list
     - Practice history
     - Reminder preferences
     - Learning progress

This flow maintains core functionality while operating independently without backend services. All data is managed locally through Chrome's storage APIs, and features are implemented using browser-native capabilities.

Would you like me to elaborate on any specific part of this flow?
