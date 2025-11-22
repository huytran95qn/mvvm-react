export interface IExpenseTracker {
    groupId: string;
    groupName: string;
    id: string;
    name: string;
    emoji: string;
    assigned: number;
    activity: number;
}

export class ExpenseTracker implements IExpenseTracker {
    public groupId: string = "";
    public groupName: string = "";
    public id: string = "";
    public name: string = "";
    public emoji: string = "";
    public assigned: number = 0;
    public activity: number = 0;

    constructor(data?: IExpenseTracker) {
        if (data) {
            this.groupId = data.groupId;
            this.groupName = data.groupName;
            this.id = data.id;
            this.name = data.name;
            this.emoji = data.emoji;
            this.assigned = data.assigned;
            this.activity = data.activity;
        }
    }
}