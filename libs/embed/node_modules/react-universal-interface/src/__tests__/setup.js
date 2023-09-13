const {configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

configure({
  adapter: new Adapter()
});

global.requestAnimationFrame = window.requestAnimationFrame = (callback) => setTimeout(callback, 17);
