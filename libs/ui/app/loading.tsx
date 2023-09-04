import {Loader2} from 'lucide-react';

export const Icons = {
  spinner: Loader2,
};

export default function Spinner() {
  return (
    <div className="flex-1">
      <Icons.spinner className="h-4 w-4 animate-spin" />
    </div>
    
  )
}