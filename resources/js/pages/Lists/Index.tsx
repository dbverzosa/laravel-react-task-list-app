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
    CheckCircle2,
    ClipboardList,
    ListChecks,
    Pencil,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface List {
    id: number;
    title: string;
    description: string | null;
    tasks_count?: number;
}

interface Props {
    lists: List[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    },
];

export default function ListsIndex({ lists, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);

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
    });

    // Flash message
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

    // Create or update list
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingList) {
            put(`/lists/${editingList.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        } else {
            post('/lists', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    // Edit
    const handleEdit = (list: List) => {
        setEditingList(list);

        setData({
            title: list.title,
            description: list.description || '',
        });

        setIsOpen(true);
    };

    // Delete
    const handleDelete = (listId: number) => {
        if (confirm('Are you sure you want to delete this list?')) {
            destroy(`/lists/${listId}`);
        }
    };

    // Create
    const handleCreate = () => {
        setEditingList(null);
        reset();
        setIsOpen(true);
    };

    // Dialog
    const handleDialogChange = (open: boolean) => {
        setIsOpen(open);

        if (!open) {
            setEditingList(null);
            reset();
        }
    };

    const totalTasks = lists.reduce(
        (total, list) => total + (list.tasks_count ?? 0),
        0,
    );

    return (
        <div>
            <Head title="Lists" />

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

                    {/* Header */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                    <ListChecks className="h-5 w-5" />
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight">
                                    Lists
                                </h1>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Organize your tasks into manageable lists.
                            </p>
                        </div>

                        {/* Create List Dialog */}
                        <Dialog
                            open={isOpen}
                            onOpenChange={handleDialogChange}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    onClick={handleCreate}
                                    size="lg"
                                    className="rounded-xl shadow-sm"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    New List
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">
                                        {editingList
                                            ? 'Edit List'
                                            : 'Create New List'}
                                    </DialogTitle>
                                </DialogHeader>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 pt-2"
                                >
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            List name
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
                                            placeholder="e.g. Work, Personal, School"
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
                                            placeholder="What is this list for?"
                                            className="min-h-28 resize-none"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 w-full rounded-xl"
                                    >
                                        {processing
                                            ? 'Saving...'
                                            : editingList
                                              ? 'Update List'
                                              : 'Create List'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Statistics */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                    <ListChecks className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Lists
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {lists.length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                                    <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Tasks
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {totalTasks}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lists Section */}
                    <div>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">
                                Your Lists
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {lists.length === 0
                                    ? 'You have not created any lists yet.'
                                    : `${lists.length} ${
                                          lists.length === 1
                                              ? 'list'
                                              : 'lists'
                                      }`}
                            </p>
                        </div>

                        {lists.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {lists.map((list) => (
                                    <Card
                                        key={list.id}
                                        className="group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        {/* Left Accent */}
                                        <div className="absolute left-0 top-0 h-full w-1 bg-primary" />

                                        <CardHeader className="pb-3 pl-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                                        <ListChecks className="h-5 w-5 text-primary" />
                                                    </div>

                                                    <CardTitle className="line-clamp-2 text-lg">
                                                        {list.title}
                                                    </CardTitle>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex shrink-0 gap-1 opacity-70 transition group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        onClick={() =>
                                                            handleEdit(list)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />

                                                        <span className="sr-only">
                                                            Edit list
                                                        </span>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                list.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />

                                                        <span className="sr-only">
                                                            Delete list
                                                        </span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-5 pl-6">
                                            {/* Description */}
                                            <p className="line-clamp-3 min-h-[60px] text-sm leading-6 text-muted-foreground">
                                                {list.description ||
                                                    'No description provided for this list.'}
                                            </p>

                                            {/* Task Count */}
                                            <div className="flex items-center justify-between border-t pt-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <ClipboardList className="h-4 w-4" />

                                                    <span>
                                                        {list.tasks_count ?? 0}{' '}
                                                        {(list.tasks_count ??
                                                            0) === 1
                                                            ? 'task'
                                                            : 'tasks'}
                                                    </span>
                                                </div>

                                                <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                                    List
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <Card className="rounded-2xl border-dashed shadow-none">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                        <ListChecks className="h-8 w-8 text-muted-foreground" />
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        No lists found
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Create your first list to start
                                        organizing your tasks.
                                    </p>

                                    <Button
                                        onClick={handleCreate}
                                        className="mt-5 rounded-xl"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create your first list
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        
        </div>

    );
}