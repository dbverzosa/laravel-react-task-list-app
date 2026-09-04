import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    Circle,
    ClipboardList,
    Pencil,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface List {
    id: number;
    title: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    list_id: number;
    list?: List;
}

interface Props {
    tasks: Task[];
    lists: List[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksIndex({
    tasks,
    lists,
    flash,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>(
        'success',
    );

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        title: '',
        description: '',
        is_completed: false,
        due_date: '',
        list_id: '',
    });

    // Flash messages
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    // Hide toast
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Submit
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingTask) {
            put(`/tasks/${editingTask.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            post('/tasks', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    // Edit
    const handleEdit = (task: Task) => {
        setEditingTask(task);

        setData({
            title: task.title,
            description: task.description || '',
            is_completed: task.is_completed,
            due_date: task.due_date
                ? task.due_date.substring(0, 10)
                : '',
            list_id: String(task.list_id),
        });

        setIsOpen(true);
    };

    // Delete
    const handleDelete = (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            destroy(`/tasks/${taskId}`);
        }
    };

    // Create
    const handleCreate = () => {
        setEditingTask(null);

        reset();

        setData({
            title: '',
            description: '',
            is_completed: false,
            due_date: lists.length > 0
                ? ''
                : '',
            list_id: lists.length > 0
                ? String(lists[0].id)
                : '',
        });

        setIsOpen(true);
    };

    // Dialog
    const handleDialogChange = (open: boolean) => {
        setIsOpen(open);

        if (!open) {
            setEditingTask(null);
            reset();
        }
    };

    const completedTasks = tasks.filter(
        (task) => task.is_completed,
    ).length;

    const pendingTasks = tasks.length - completedTasks;

    return (
        <div >
            <Head title="Tasks" />

            <div className="min-h-full bg-background">
                {/* Toast */}
                {showToast && (
                    <div
                        className={`fixed right-5 top-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur ${
                            toastType === 'success'
                                ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200'
                                : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'
                        }`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                        ) : (
                            <XCircle className="h-5 w-5 shrink-0" />
                        )}

                        <span className="text-sm font-medium">
                            {toastMessage}
                        </span>
                    </div>
                )}

                <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">

                    {/* Page Header */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                    <ClipboardList className="h-5 w-5" />
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight">
                                    Tasks
                                </h1>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Manage your tasks and keep track of your
                                progress.
                            </p>
                        </div>

                        {/* New Task */}
                        <Dialog
                            open={isOpen}
                            onOpenChange={handleDialogChange}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    onClick={handleCreate}
                                    disabled={lists.length === 0}
                                    size="lg"
                                    className="rounded-xl shadow-sm"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Task
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">
                                        {editingTask
                                            ? 'Edit Task'
                                            : 'Create New Task'}
                                    </DialogTitle>
                                </DialogHeader>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 pt-2"
                                >
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Task title
                                        </Label>

                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData(
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Finish project documentation"
                                            className="h-11"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>

                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Add some details about this task..."
                                            className="min-h-24 resize-none"
                                        />
                                    </div>

                                    {/* List + Due Date */}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="list_id">
                                                List
                                            </Label>

                                            <select
                                                id="list_id"
                                                value={data.list_id}
                                                onChange={(e) =>
                                                    setData(
                                                        'list_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                                                required
                                            >
                                                <option value="">
                                                    Select a list
                                                </option>

                                                {lists.map((list) => (
                                                    <option
                                                        key={list.id}
                                                        value={list.id}
                                                    >
                                                        {list.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="due_date">
                                                Due date
                                            </Label>

                                            <Input
                                                id="due_date"
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'due_date',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    {/* Completed */}
                                    <label
                                        htmlFor="is_completed"
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition hover:bg-muted/50"
                                    >
                                        <input
                                            id="is_completed"
                                            type="checkbox"
                                            checked={data.is_completed}
                                            onChange={(e) =>
                                                setData(
                                                    'is_completed',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300"
                                        />

                                        <div>
                                            <p className="text-sm font-medium">
                                                Mark as completed
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                This task is already finished
                                            </p>
                                        </div>
                                    </label>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            lists.length === 0
                                        }
                                        className="h-11 w-full rounded-xl"
                                    >
                                        {processing
                                            ? 'Saving...'
                                            : editingTask
                                              ? 'Update Task'
                                              : 'Create Task'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Tasks
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {tasks.length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Completed
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {completedTasks}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-950">
                                    <Circle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Pending
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {pendingTasks}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* No Lists */}
                    {lists.length === 0 && (
                        <Card className="rounded-2xl border-dashed shadow-none">
                            <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                                    <ClipboardList className="h-7 w-7 text-muted-foreground" />
                                </div>

                                <h3 className="text-lg font-semibold">
                                    Create a list first
                                </h3>

                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    You need at least one list before you can
                                    create a task.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Task Section */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Your Tasks
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {tasks.length === 0
                                        ? 'No tasks yet'
                                        : `${tasks.length} ${
                                              tasks.length === 1
                                                  ? 'task'
                                                  : 'tasks'
                                          }`}
                                </p>
                            </div>
                        </div>

                        {/* Tasks */}
                        {tasks.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {tasks.map((task) => (
                                    <Card
                                        key={task.id}
                                        className={`group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                            task.is_completed
                                                ? 'border-green-200 dark:border-green-900'
                                                : ''
                                        }`}
                                    >
                                        {/* Status indicator */}
                                        <div
                                            className={`absolute left-0 top-0 h-full w-1 ${
                                                task.is_completed
                                                    ? 'bg-green-500'
                                                    : 'bg-yellow-500'
                                            }`}
                                        />

                                        <CardHeader className="pb-3 pl-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <CardTitle
                                                        className={`line-clamp-2 text-lg ${
                                                            task.is_completed
                                                                ? 'text-muted-foreground line-through'
                                                                : ''
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </CardTitle>

                                                    {task.list && (
                                                        <div className="mt-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                            {task.list.title}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex shrink-0 gap-1 opacity-70 transition group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        onClick={() =>
                                                            handleEdit(task)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Edit task
                                                        </span>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                task.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Delete task
                                                        </span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4 pl-6">
                                            {/* Description */}
                                            <p className="line-clamp-3 min-h-[60px] text-sm leading-6 text-muted-foreground">
                                                {task.description ||
                                                    'No description provided for this task.'}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Due Date */}
                                                {task.due_date && (
                                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                                                        <CalendarDays className="h-3.5 w-3.5" />

                                                        {new Date(
                                                            task.due_date,
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </div>
                                                )}

                                                {/* Status */}
                                                <div
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                                                        task.is_completed
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                                                    }`}
                                                >
                                                    {task.is_completed ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Circle className="h-3.5 w-3.5" />
                                                    )}

                                                    {task.is_completed
                                                        ? 'Completed'
                                                        : 'Pending'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="rounded-2xl border-dashed shadow-none">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                        <ClipboardList className="h-8 w-8 text-muted-foreground" />
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        No tasks found
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Create your first task to start
                                        organizing your work.
                                    </p>

                                    {lists.length > 0 && (
                                        <Button
                                            onClick={handleCreate}
                                            className="mt-5 rounded-xl"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create your first task
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}