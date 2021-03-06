import { combineLatest, fromEvent, Observable, Subscription, merge } from 'rxjs';
import { distinctUntilChanged, filter, mapTo, share, tap } from 'rxjs/operators';

type Shortcut = {
  keys: string[];
  cb: { (): void };
};

type Options = {
  preventDefault: boolean;
  preventSeries: boolean;
};

const defaultOptions = {
  preventDefault: true,
  preventSeries: false,
};

const keydown$ = fromEvent(document, 'keydown').pipe(share());
const keyup$ = fromEvent(document, 'keyup').pipe(share());

const specifyKeyEvent = (observable: Observable<KeyboardEvent>) => (key: string) =>
  observable.pipe(
    filter((e: KeyboardEvent) => e.key.toLowerCase() === key.toLowerCase()),
    tap((e) => defaultOptions.preventDefault && e.preventDefault())
  );

const [keydown$ForKey, keyup$ForKey] = [keydown$, keyup$].map(specifyKeyEvent);

export class Shortcutter {
  private _shortcuts: (Shortcut & { subscrition: Subscription })[] = [];
  private options: Options = { ...defaultOptions };

  public on(keys: string[], cb: { (): void }) {
    const subscrition = combineLatest(
      keys.map((key) => merge(keydown$ForKey(key).pipe(mapTo(true)), keyup$ForKey(key).pipe(mapTo(false))))
    )
      .pipe(
        //предотвращаем залипание
        distinctUntilChanged((prev, cur) => this.options.preventSeries && JSON.stringify(prev) === JSON.stringify(cur)),
        filter((keysState) => keysState.every(Boolean))
      )
      .subscribe(cb);

    this._shortcuts.push({
      keys,
      cb,
      subscrition,
    });

    return () => {
      const ind = this._shortcuts.findIndex(({ subscrition: cSub }) => cSub === subscrition);
      this._shortcuts = [...this._shortcuts.slice(0, ind), ...this._shortcuts.slice(ind + 1, this._shortcuts.length)];
      subscrition.unsubscribe();
    };
  }

  constructor(options?: Options) {
    this.options = { ...this.options, ...options };
  }
}
