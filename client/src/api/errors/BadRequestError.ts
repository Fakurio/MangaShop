export class BadRequestError extends Error {
  public messages: Object;
  constructor(messages: Object) {
    super("Bad request error");
    this.messages = messages;
  }
}
