import { toast } from 'sonner';

export const Status = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

type StatusType = (typeof Status)[keyof typeof Status];

export function toastHandler(status: StatusType, message: string) {
  switch (status) {
    case Status.SUCCESS:
      toast.success(message);
      break;
    case Status.INFO:
      toast.info(message);
      break;
    case Status.WARNING:
      toast.warning(message);
      break;
    case Status.LOADING:
      toast.loading(message);
      break;
    default:
      toast.error(message);
      break;
  }
}

export function ageFinder(updateDate: string) {
  const ts = Date.parse(updateDate);
  if (isNaN(ts)) return "Invalid date";

  let diff = Date.now() - ts;
  if (diff < 0) return "Just now";

  const units = [
    { label: "Year", ms: 1000 * 60 * 60 * 24 * 365 },
    { label: "Week", ms: 1000 * 60 * 60 * 24 * 7 },
    { label: "Day", ms: 1000 * 60 * 60 * 24 },
    { label: "Hour", ms: 1000 * 60 * 60 },
    { label: "Min", ms: 1000 * 60 },
    { label: "Sec", ms: 1000 },
  ];

  for (const u of units) {
    const val = Math.floor(diff / u.ms);
    if (val >= 1) {
      return `${val} ${u.label}${val > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}


export type BlogType = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
};

export type CommentType = {
  user: {
    id: string;
    name: string | null;
  };
  content: string;
  createdAt: string;
};
