import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', text = 'Once data is available, it will appear here.' }) => (
  <div className="glass rounded-lg p-10 text-center">
    <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-400" />
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);

export default EmptyState;
