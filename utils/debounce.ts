export default function debounce<F extends (...args: any[]) => void>(
    func: F,
    delay: number
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
    let timerId: number;
    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        clearTimeout(timerId);
        timerId = window.setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
