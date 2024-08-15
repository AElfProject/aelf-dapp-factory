import { type ClassValue, clsx } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeNotification = (id: number | string,time?:number) => {
  setTimeout(() => toast.done(id), time || 3000);
};

export const CustomToast = ({ title, message }: any) => (
  <div>
    <h4>{title}</h4>
    <p>{message}</p>
  </div>
);
export const calculateTimeRemaining = (createdAt:string) => {
  const startDateTime = moment(createdAt);
  const now = moment();

  const duration = moment.duration(now.diff(startDateTime));

  const days = Number(duration.days());
  const hours = Number(duration.hours());
  const minutes = Number(duration.minutes());
  const seconds = Number(duration.seconds());

  return days > 0
    ? `${days} days ago`
    : hours > 0
    ? `${hours} hours ago`
    : minutes > 0
    ? `${minutes} minute ago`
    : `${seconds} second ago`;
};