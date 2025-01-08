const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {  
  plugins: [    
    autoprefixer,    
    cssnano({ preset: 'default' })  // cssnano при подключении нужно передать объект опций    
  ]
}; 