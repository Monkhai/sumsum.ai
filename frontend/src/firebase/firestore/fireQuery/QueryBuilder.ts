/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type CollectionReference,
  endAt,
  endBefore,
  limit,
  limitToLast,
  orderBy,
  type Query,
  query,
  type QueryConstraint,
  startAfter,
  startAt,
  where,
  type WhereFilterOp,
} from "firebase/firestore";

export class QueryBuilder<T> {
  private collectionRef: CollectionReference<T>;
  private constraints: QueryConstraint[] = [];

  constructor(collectionRef: CollectionReference<T>) {
    this.collectionRef = collectionRef;
  }

  where(fieldPath: string, opStr: WhereFilterOp, value: any): this {
    this.constraints.push(where(fieldPath, opStr, value));
    return this;
  }

  orderBy(fieldPath: string, directionStr: "asc" | "desc" = "asc"): this {
    this.constraints.push(orderBy(fieldPath, directionStr));
    return this;
  }

  limit(limitNumber: number): this {
    this.constraints.push(limit(limitNumber));
    return this;
  }

  limitToLast(limit: number): this {
    this.constraints.push(limitToLast(limit));
    return this;
  }

  startAt(...values: any[]): this {
    this.constraints.push(startAt(...values));
    return this;
  }

  endAt(...values: any[]): this {
    this.constraints.push(endAt(...values));
    return this;
  }

  startAfter(...values: any[]): this {
    this.constraints.push(startAfter(...values));
    return this;
  }

  endBefore(...values: any[]): this {
    this.constraints.push(endBefore(...values));
    return this;
  }

  build(): Query<T> {
    return query(this.collectionRef, ...this.constraints);
  }
}
