import { ExpenseTracker } from "@Entities/expenseTracker.entity";

export const MOCK_DATA_EXPENSE_TRACKER: ExpenseTracker[] = [
    {
        groupId: 'monthly-expenses',
        groupName: 'Monthly Expenses',
        id: 'rent',
        name: 'Rent/Mortgage',
        emoji: '🏠',
        assigned: 1200,
        activity: 1200
    },
    {
        groupId: 'monthly-expenses',
        groupName: 'Monthly Expenses',
        id: 'groceries-exp',
        name: 'Groceries',
        emoji: '🛒',
        assigned: 400,
        activity: 325.50
    },
    {
        groupId: 'monthly-expenses',
        groupName: 'Monthly Expenses',
        id: 'utilities-exp',
        name: 'Utilities',
        emoji: '⚡',
        assigned: 150,
        activity: 125
    },
    {
        groupId: 'monthly-expenses',
        groupName: 'Monthly Expenses',
        id: 'transportation-exp',
        name: 'Transportation',
        emoji: '🚗',
        assigned: 300,
        activity: 200
    },
    {
        groupId: 'monthly-expenses',
        groupName: 'Monthly Expenses',
        id: 'phone-exp',
        name: 'Phone Bill',
        emoji: '📱',
        assigned: 80,
        activity: 0
    },
    {
        groupId: 'monthly-expenses',
        groupName: 'Monthly Expenses',
        id: 'internet-exp',
        name: 'Internet',
        emoji: '🌐',
        assigned: 60,
        activity: 0
    },
    // Entertainment & Lifestyle
    {
        groupId: 'entertainment',
        groupName: 'Entertainment & Lifestyle',
        id: 'dining-out',
        name: 'Dining Out',
        emoji: '🍽️',
        assigned: 200,
        activity: 125.50
    },
    {
        groupId: 'entertainment',
        groupName: 'Entertainment & Lifestyle',
        id: 'movies',
        name: 'Movies & Shows',
        emoji: '🎬',
        assigned: 50,
        activity: 35.25
    },
    {
        groupId: 'entertainment',
        groupName: 'Entertainment & Lifestyle',
        id: 'hobbies',
        name: 'Hobbies',
        emoji: '🎨',
        assigned: 150,
        activity: 85
    },
    {
        groupId: 'entertainment',
        groupName: 'Entertainment & Lifestyle',
        id: 'fitness',
        name: 'Gym & Fitness',
        emoji: '💪',
        assigned: 100,
        activity: 0
    },
    // Savings & Goals
    {
        groupId: 'savings-goals',
        groupName: 'Savings & Goals',
        id: 'emergency-fund-exp',
        name: 'Emergency Fund',
        emoji: '🆘',
        assigned: 500,
        activity: 500
    },
    {
        groupId: 'savings-goals',
        groupName: 'Savings & Goals',
        id: 'vacation',
        name: 'Vacation Fund',
        emoji: '✈️',
        assigned: 300,
        activity: 200
    },
    {
        groupId: 'savings-goals',
        groupName: 'Savings & Goals',
        id: 'retirement-exp',
        name: 'Retirement',
        emoji: '👴',
        assigned: 200,
        activity: 100
    }
]