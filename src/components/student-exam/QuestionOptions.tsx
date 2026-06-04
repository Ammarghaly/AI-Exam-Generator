import { QuestionOption } from './QuestionOption';

interface QuestionOptionsProps {
  options: { id: string; text: string }[];
  selectedId?: string;
  onChange: (id: string) => void;
}

export function QuestionOptions({ options, selectedId, onChange }: QuestionOptionsProps) {
  return (
    <div className="space-y-4">
      {options.map((opt) => (
        <QuestionOption
          key={opt.id}
          text={opt.text}
          isSelected={selectedId === opt.id}
          onSelect={() => onChange(opt.id)}
        />
      ))}
    </div>
  );
}
