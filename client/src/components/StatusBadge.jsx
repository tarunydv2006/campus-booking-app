import { statusClass } from '../utils/constants';

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass[status] || statusClass.pending}`}>
    {status}
  </span>
);

export default StatusBadge;
