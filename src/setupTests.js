
// https://github.com/plotly/react-plotly.js/issues/115
window.URL.createObjectURL = function() {};
window.HTMLCanvasElement.prototype.getContext = () => {}

// https://github.com/Leaflet/Leaflet/issues/6297
jest.mock("react-leaflet")