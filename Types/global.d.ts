export {}

declare global {
    export type str = string
    export type int = number
    export type float = number
    export type bool = boolean
    export type obj = {[key:str]: any}
    export type arr<T> = Array<T>
    export type px = str|int
}