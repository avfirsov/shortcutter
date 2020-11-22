import { combineLatest, fromEvent, Observable, merge } from 'rxjs';
import { distinctUntilChanged, filter, mapTo, share } from 'rxjs/operators';

type Shortcut = {
  keys: string[];
  cb: { (): void };
};

const shortcuts: Shortcut[] = [
  {
    keys: ['Shift', 'r', 'x'], //something, that will be displayed in e.key
    cb: () => {
      //callback to call when keys are pressed
      console.log('RxJS is cool!');
    },
  },
  {
    keys: ['Shift', 't', 's'],
    cb: () => {
      console.log('TS is awesome!');
    },
  },
];

// const hotkeys = (
//   shortcuts: Shortcut[],
//   preventSeries = false,
//   [keydown$, keyup$] = ['keydown', 'keyup'].map((event: string) => fromEvent(document, event).pipe(share())),
//   [keydown$ForKey, keyup$ForKey] = [keydown$, keyup$].map((observable: Observable<KeyboardEvent>) => (key: string) =>
//     observable.pipe(filter((e: KeyboardEvent) => e.key.toLowerCase() === key.toLowerCase()))
//   ),
//   keyState$ForKey = (key: string) => merge(keydown$ForKey(key).pipe(mapTo(true)), keyup$ForKey(key).pipe(mapTo(false)))
// ) =>
//   shortcuts.forEach(({ keys, cb }) =>
//     combineLatest(keys.map(keyState$ForKey))
//       .pipe(
//         distinctUntilChanged((prev, cur) => preventSeries && JSON.stringify(prev) === JSON.stringify(cur)),
//         filter((keysState) => keysState.every(Boolean))
//       )
//       .subscribe(cb)
//   );

//prettier-ignore
const hotkeys = (shortcuts: Shortcut[], preventSeries = false, [keydown$, keyup$] = ['keydown', 'keyup'].map((event: string) => fromEvent(document, event).pipe(share())), [keydown$ForKey, keyup$ForKey] = [keydown$, keyup$].map((observable: Observable<KeyboardEvent>) => (key: string) => observable.pipe(filter((e: KeyboardEvent) => e.key.toLowerCase() === key.toLowerCase()))), keyState$ForKey = (key: string) => merge(keydown$ForKey(key).pipe(mapTo(true)), keyup$ForKey(key).pipe(mapTo(false)))) => shortcuts.forEach(({ keys, cb }) => combineLatest(keys.map(keyState$ForKey)).pipe( distinctUntilChanged((prev, cur) => preventSeries && JSON.stringify(prev) === JSON.stringify(cur)), filter((keysState) => keysState.every(Boolean))).subscribe(cb));

hotkeys(shortcuts, true);
