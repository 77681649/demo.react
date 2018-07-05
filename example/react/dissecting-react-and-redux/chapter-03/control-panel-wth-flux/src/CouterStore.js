const removeItem = (array, item) => {
  let index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
};

const CHANGE_EVENT = "change";

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    let listeners = this.events[event] || (this.events[event] = []);
    listeners.push(listener);
  }

  off(event, listener) {
    let listeners = this.events[event];

    if (listeners) {
      if (listener) {
        removeItem(listeners, listener);
      } else {
        this.events = [];
      }
    }
  }

  emit(event, ...args) {
    let listeners = this.events[event];

    if (listeners) {
      listeners.forEach(listener => listener.call(null, ...args));
    }
  }
}

class CounterStore extends EventEmitter {
  constructor() {
    super();

    this.countValues = [0, 0, 0];
  }

  getValues() {
    return this.countValues;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(listener) {
    this.on(CHANGE_EVENT, listener);
  }

  removeChangeListener(callback) {
    this.off(CHANGE_EVENT, listener);
  }
}

export default new CounterStore();
