import { registerRootComponent } from 'expo';
import { registerBackgroundHandler } from './src/services/notificationEventHandler';

import App from './App';

// Register Notifee background event handler at the top level
// so notification actions work even when the app is killed / in background.
registerBackgroundHandler();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
