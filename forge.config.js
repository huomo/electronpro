module.exports = {
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            name: '@electron-forge/maker-zip',
          },
          prerelease: false,
          draft: true,
        },
      },
    ],
  }