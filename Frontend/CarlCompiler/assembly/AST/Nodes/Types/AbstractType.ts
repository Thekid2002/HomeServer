import { AbstractNode } from "../AbstractNode";

export abstract class AbstractType extends AbstractNode {
  abstract toJsonString(): string;
  abstract toString(): string;
}
