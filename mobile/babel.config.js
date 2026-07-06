module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // zod v4's ESM build uses `export * as core from '...'`, which Metro's default
  // RN babel preset doesn't transform on its own.
  plugins: ['@babel/plugin-transform-export-namespace-from'],
};
