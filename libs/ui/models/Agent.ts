export class Agent {
  readonly id: string
  readonly name: string
  readonly avatar?: string

  constructor(obj: any) {
    this.id = obj.id || ""
    this.name = obj.name || ""
    this.avatar = obj.avatar || ""
  }
}
