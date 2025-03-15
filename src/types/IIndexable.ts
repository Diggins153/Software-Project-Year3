/**
 * Allows access to object values using bracket syntax
 * @template T Type of the accessed property. <br> T is `any` by default.
 */
export default interface IIndexable<T = any> {
    [key: string]: T;
}
