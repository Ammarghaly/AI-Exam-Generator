import { useState } from 'react';
import type { ExamQuestion } from '../../types/exam';
import { ReviewQuestionCardView } from './ReviewQuestionCardView';
import { ReviewQuestionCardEdit } from './ReviewQuestionCardEdit';

interface ReviewQuestionCardProps {
  question: ExamQuestion;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedQuestion: ExamQuestion) => void;
}

export function ReviewQuestionCard({ question, index, onDelete, onUpdate }: ReviewQuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ReviewQuestionCardEdit
        question={question}
        index={index}
        onCancel={() => setIsEditing(false)}
        onUpdate={(updated) => {
          onUpdate(updated);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <ReviewQuestionCardView
      question={question}
      index={index}
      onDelete={onDelete}
      onEdit={() => setIsEditing(true)}
    />
  );
}
