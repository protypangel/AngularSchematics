export interface Option {
    name: string;
    tabs?: string;
}

export type DecoratorExtension<T extends abstract new (...args: any) => any> = InstanceType<T> & DecoratedAdder<T>;
type Constructor<T = {}> = new (...args: any[]) => T;
export type DecoratedConstructor<T extends Constructor> = T & {
    new (...args: ConstructorParameters<T>): DecoratorExtension<T>;
};

export interface DecoratedAdder<T> {
    Template(): T;
    Option(): Option;
}
export function TemplateDecorator(option: Option) {
    return function <T extends Constructor>(
        template: T
    ): DecoratedConstructor<T> {
        class Decorated extends template implements DecoratedAdder<T> {
            constructor(...args: any[]) {
                super(...args);
            }
            Option(): Option {
                return option;
            }
            Template(): T {
                return this as unknown as T;
            }
        }
        return Decorated as unknown as DecoratedConstructor<T>;
    }
}
