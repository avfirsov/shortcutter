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

const keydown$ = fromEvent(document, 'keydown').pipe(share());
const keyup$ = fromEvent(document, 'keyup').pipe(share());

// const keydown$ForKey = (key: string) =>
//   //convert all to lower case because when shift is holded letter becomes uppercase in e.key
//   keydown$.pipe(filter((e: KeyboardEvent) => e.key.toLowerCase() === key.toLowerCase()));
// const keyup$ForKey = (key: string) =>
//   keyup$.pipe(filter((e: KeyboardEvent) => e.key.toLowerCase() === key.toLowerCase()));

const specifyKeyEvent = (observable: Observable<KeyboardEvent>) => (key: string) =>
  observable.pipe(filter((e: KeyboardEvent) => e.key.toLowerCase() === key.toLowerCase()));

const [keydown$ForKey, keyup$ForKey] = [keydown$, keyup$].map(specifyKeyEvent);

const keyState$ForKey = (key: string) =>
  merge(keydown$ForKey(key).pipe(mapTo(true)), keyup$ForKey(key).pipe(mapTo(false)));

const keysState$FromKeys = (keys: string[]) => combineLatest(keys.map(keyState$ForKey));

// keysState$FromKeys(['Shift', 'r', 'x']).subscribe(console.log);

const hotkeys = (shortcuts: Shortcut[], preventSeries = false) =>
  shortcuts.forEach(({ keys, cb }) =>
    keysState$FromKeys(keys)
      .pipe(
        //here we JSON.stringify to compare arrays equality by content
        distinctUntilChanged((prev, cur) => preventSeries && JSON.stringify(prev) === JSON.stringify(cur)),
        filter((keysState) => keysState.every(Boolean))
      )
      .subscribe(cb)
  );

// hotkeys(shortcuts, false)
