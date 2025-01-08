const presets = [
    ['@babel/preset-env', { // Какой пресет использовать
      targets: {    // Какие версии браузеров поддерживать
        edge: '17',
        ie: '11',
        firefox: '50',
        chrome: '64',
        safari: '11.1'
      },
  
      // Использовать полифиллы для браузеров из свойства target
      // По умолчанию babel использует поллифиллы библиотеки core-js
      useBuiltIns: "entry"
    }]
  ];
  
  module.exports = { presets };