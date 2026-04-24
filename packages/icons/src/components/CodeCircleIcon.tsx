import type { IconProps } from "../types";
const CodeCircleIcon = ({
  title,
  ...props
}: IconProps) => <svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 96 96" {...props}><circle cx={48} cy={48} r={34} fill="#000000" /><path d="M39 39 30 48 39 57" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /><path d="M57 39 66 48 57 57" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /><path d="M52 34 44 62" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" /></svg>;
export default CodeCircleIcon;
