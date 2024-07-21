export abstract class Expression {
    abstract accept<T>(visitor: Visitor<T>): T;

}
