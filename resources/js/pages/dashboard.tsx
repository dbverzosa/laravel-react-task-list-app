
import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardList,
    ListChecks,
    Percent,
} from 'lucide-react';
import { dashboard } from '@/routes';

interface List {
    id: number;
    title: string;
    description: string | null;
    tasks_count?: number;
    created_at: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    list_id: number;
    list?: {
        id: number;
        title: string;
    };
    created_at: string;
}

interface Stats {
    totalLists: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
}

interface Props {
    lists: List[];
    tasks: Task[];
    stats: Stats;
}

export default function Dashboard({
    lists,
    tasks,
    stats,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-muted-foreground mt-1">
                        Overview of your lists and tasks.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Total Lists */}
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Lists
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.totalLists}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted p-3">
                                <ListChecks className="size-5" />
                            </div>
                        </div>
                    </div>

                    {/* Total Tasks */}
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Tasks
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.totalTasks}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted p-3">
                                <ClipboardList className="size-5" />
                            </div>
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.completedTasks}
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted p-3">
                                <CheckCircle2 className="size-5" />
                            </div>
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completion Rate
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.completionRate}%
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted p-3">
                                <Percent className="size-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Lists and Tasks */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Recent Lists */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-5">
                            <h2 className="font-semibold">
                                Recent Lists
                            </h2>

                            <p className="text-muted-foreground mt-1 text-sm">
                                Your 10 most recently created lists.
                            </p>
                        </div>

                        <div className="p-5">
                            {lists.length === 0 ? (
                                <div className="py-8 text-center">
                                    <ListChecks className="text-muted-foreground mx-auto size-8" />

                                    <p className="mt-3 font-medium">
                                        No lists yet
                                    </p>

                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Create your first list to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lists.map((list) => (
                                        <div
                                            key={list.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {list.title}
                                                </p>

                                                {list.description && (
                                                    <p className="text-muted-foreground mt-1 truncate text-sm">
                                                        {list.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="ml-4 shrink-0 text-right">
                                                <p className="text-sm font-medium">
                                                    {list.tasks_count ?? 0}
                                                </p>

                                                <p className="text-muted-foreground text-xs">
                                                    tasks
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Tasks */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-5">
                            <h2 className="font-semibold">
                                Recent Tasks
                            </h2>

                            <p className="text-muted-foreground mt-1 text-sm">
                                Your 10 most recently created tasks.
                            </p>
                        </div>

                        <div className="p-5">
                            {tasks.length === 0 ? (
                                <div className="py-8 text-center">
                                    <ClipboardList className="text-muted-foreground mx-auto size-8" />

                                    <p className="mt-3 font-medium">
                                        No tasks yet
                                    </p>

                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Create a task to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <CheckCircle2
                                                className={
                                                    task.is_completed
                                                        ? 'size-5 shrink-0 text-green-600 dark:text-green-400'
                                                        : 'text-muted-foreground size-5 shrink-0'
                                                }
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`truncate font-medium ${
                                                        task.is_completed
                                                            ? 'text-muted-foreground line-through'
                                                            : ''
                                                    }`}
                                                >
                                                    {task.title}
                                                </p>

                                                <p className="text-muted-foreground mt-1 truncate text-xs">
                                                    {task.list?.title ??
                                                        'No list'}
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 text-xs font-medium ${
                                                    task.is_completed
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {task.is_completed
                                                    ? 'Completed'
                                                    : 'Pending'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};