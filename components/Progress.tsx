import * as Progress from "@radix-ui/react-progress";

const ProgressBar = ({ percent }) => {
  return (
    <Progress.Root
      value={percent}
      style={{ height: 10 }}
      className="relative overflow-hidden rounded bg-gray-200"
    >
      <Progress.Indicator
        className="absolute bg-blue-400 h-full"
        style={{ width: `${percent}%` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
