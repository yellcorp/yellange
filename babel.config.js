module.exports = (api) => {
  api.cache(false);

  // The chrome version of 51 is the oldest browser that these libraries were
  //  ever transpiled for. This is roughly mid-2016.
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: 'commonjs',
          targets: {
            chrome: '51',
          },
        },
      ],
    ],
  };
};
