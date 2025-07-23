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
