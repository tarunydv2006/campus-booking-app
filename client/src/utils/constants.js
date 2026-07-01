export const categories = ['Labs', 'Seminar Halls', 'Projectors', 'Equipment', 'Classrooms'];

export const statusClass = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200'
};

export const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
