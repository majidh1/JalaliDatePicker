class Input {
    constructor(element) {
        this.context = element;
    }

    get value() {
        return this.context.value;
    }

    set value(val) {
        this.context.value = val;
    }

    trigger(event) {
        this.context.dispatchEvent(event);
    }
}

export default Input;