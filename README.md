# electron-hot-reloader
Simple And Extensible Electron Hot Reloader

## Installation
```sh
npm install mypluralize --save
yarn add mypluralize
bower install pluralize --save
```

## Usage
### Javascript
```javascript
let reloader = require('electron-hot-reloader');
let config = {...};
reloader.initHotReloader(config);
```

### TypeScript
```typescript
import reloader from 'electron-hot-reloader';
let config = {...};
reloader(config);
```

Your electron app from now will be reloaded 
on your specified files change


