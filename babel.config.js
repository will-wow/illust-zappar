module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    ["@babel/plugin-transform-runtime", { corejs: 3 }],
    "@babel/plugin-proposal-optional-chaining",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
