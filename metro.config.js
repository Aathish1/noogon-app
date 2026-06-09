const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure mjs is in sourceExts for packages like @rn-primitives/portal
if (!config.resolver.sourceExts.includes('mjs')) {
  config.resolver.sourceExts.push('mjs');
}

// Fix: Zustand v5 ESM files (.mjs) use `import.meta` which Metro doesn't
// support in its web bundle. Redirect zustand .mjs imports to .js (CJS).
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Intercept zustand subpath imports (e.g. 'zustand/middleware')
  if (moduleName.startsWith('zustand/') && platform === 'web') {
    const subpath = moduleName.slice('zustand/'.length);
    const cjsPath = path.resolve(
      __dirname,
      'node_modules',
      'zustand',
      `${subpath}.js`
    );
    return { type: 'sourceFile', filePath: cjsPath };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
