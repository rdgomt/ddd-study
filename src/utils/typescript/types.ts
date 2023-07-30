export type Nullable<T> = T | null

export type AsyncNullable<T> = Promise<Nullable<T>>

export type Maybe<T> = T | null | undefined

export type AsyncMaybe<T> = Promise<Maybe<T>>

/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 **/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
