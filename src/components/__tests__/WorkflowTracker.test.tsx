// WorkflowTracker.tsx
type Step = {
  step: number;
  text: string;
  status: 'pending' | 'current' | 'completed';
};

interface Props {
  steps: Step[];
}

const WorkflowTracker: React.FC<Props> = ({ steps }) => {
  return (
    <div className="flex items-center">
      {steps.map((s, idx) => (
        <div key={s.step} className="flex items-center">
          {/* Step circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
              ${s.status === 'completed' ? 'bg-green-500 text-white'
                : s.status === 'current' ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-black'}`}
          >
            {s.step}
          </div>

          {/* Step text */}
          <span className="ml-2">{s.text}</span>

          {/* Connecting line (except after last step) */}
          {idx < steps.length - 1 && (
            <div
              data-testid="step-line"
              className="w-12 h-0.5 bg-gray-400 mx-2"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkflowTracker;

