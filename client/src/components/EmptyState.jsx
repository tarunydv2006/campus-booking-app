import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', text = 'Once data is available, it will appear here.' }) => (
  <div className="surface-card p-10 text-center">
    <div className="icon-tile mx-auto mb-4">
      <Inbox className="h-5 w-5" />
    </div>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);

export default EmptyState;
