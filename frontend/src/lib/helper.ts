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

export function blogAgeFinder(updateDate: string) {
  const ageInMs = Date.now() - Date.parse(updateDate);

  const ageInSecs = Math.floor(ageInMs / 1000);
  const ageInMinutes = Math.floor(ageInMs / (1000 * 60));
  const ageInHours = Math.floor(ageInMs / (1000 * 60 * 60));
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 7));
  const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 364));

  if (ageInSecs < 60) {
    return ageInSecs + ' Secs ago';
  } else if (ageInMinutes < 60) {
    if (ageInMinutes === 1) return ageInMinutes + ' Min ago';
    return ageInMinutes + ' Mins ago';
  } else if (ageInHours < 24) {
    if (ageInHours == 1) return ageInHours + ' Hour ago';
    return ageInHours + ' Hours ago';
  } else if (ageInDays < 7) {
    if (ageInDays == 1) return ageInDays + ' Day ago';
    return ageInDays + ' Days ago';
  } else if (ageInWeeks < 5) {
    if (ageInWeeks === 1) return ageInWeeks + ' Week ago';
    return ageInWeeks + ' Week ago';
  } else {
    if (ageInYears == 1) return ageInYears + ' Year ago';
    return ageInYears + ' Years ago';
  }
}

export type BlogType = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  author: {
    name: string;
  };
};
