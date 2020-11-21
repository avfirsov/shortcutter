import { Shortcutter } from './shortcutter';

const shortcutter = new Shortcutter({
  preventDefault: true,
  preventSeries: false,
});

const cancelCtrlAltD = shortcutter.on(['Control', 'Alt', 'd'], () => {
  console.log('pressed', 'Control', 'Alt', 'd');
});

const cancelCtrlShftL = shortcutter.on(['Control', 'Shift', 'l'], () => {
  console.log('pressed', 'Control', 'Shift', 'l');
});

setTimeout(cancelCtrlAltD, 4000);
setTimeout(cancelCtrlShftL, 8000);
