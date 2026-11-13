type InfinityMarkProps = {
  className?: string;
};

export default function InfinityMark({ className }: InfinityMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 100 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 25C35 7 19 5 10 16 1 27 10 42 23 42c10 0 18-9 27-17Zm0 0c15-18 31-20 40-9 9 11 0 26-13 26-10 0-18-9-27-17Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
}
