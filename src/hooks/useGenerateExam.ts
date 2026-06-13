import { useState, useMemo } from 'react';
import { useUserStore } from '../stores/use-user-store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';

export type GenerateExamFormValues = {
  examTitle: string;
  file: File;
  difficultyDistribution: {
    Easy_Memorization: number;
    Easy_Creativity: number;
    Easy_Thinking: number;
    Normal_Memorization: number;
    Normal_Creativity: number;
    Normal_Thinking: number;
    Hard_Memorization: number;
    Hard_Creativity: number;
    Hard_Thinking: number;
  };
  mcqCount: number;
  targetGroup?: string;
  availableFrom?: Date;
  deadline?: Date;
  durationMinutes?: number;
  allowImmediateAI: boolean;
  allowReview: boolean;
  randomizeQuestions: boolean;
  keepForever: boolean;
};

export function useGenerateExam() {
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as Partial<GenerateExamFormValues> | null;
  const { currentUser } = useUserStore();

  const isStudent = currentUser?.role?.toLowerCase() === 'student';

  const schema = useMemo(() => {
    return z.object({
      examTitle: z.string().min(1, 'Exam title is required'),
      file: z.instanceof(File, { message: 'Course material PDF is required to generate an exam' })
        .refine((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'), {
          message: 'Only PDF files are supported',
        }),
      difficultyDistribution: z.object({
        Easy_Memorization: z.number().min(0),
        Easy_Creativity: z.number().min(0),
        Easy_Thinking: z.number().min(0),
        Normal_Memorization: z.number().min(0),
        Normal_Creativity: z.number().min(0),
        Normal_Thinking: z.number().min(0),
        Hard_Memorization: z.number().min(0),
        Hard_Creativity: z.number().min(0),
        Hard_Thinking: z.number().min(0),
      }),
      mcqCount: z.number().min(0, 'MCQ Count cannot be negative'),
      targetGroup: isStudent ? z.string().optional() : z.string().min(1, 'Please select a target group'),
      availableFrom: isStudent ? z.date().optional() : z.date({ message: 'Available from date is required' }),
      deadline: isStudent ? z.date().optional() : z.date({ message: 'Deadline date is required' }),
      durationMinutes: isStudent ? z.number().optional() : z.coerce.number().min(1, 'Duration must be at least 1 minute'),
      allowImmediateAI: z.boolean(),
      allowReview: z.boolean(),
      randomizeQuestions: z.boolean(),
      keepForever: z.boolean().default(false),
    }).refine((data) => {
      const total = Object.values(data.difficultyDistribution).reduce((sum, val) => sum + val, 0);
      return total >= 5 && total <= 100;
    }, {
      message: 'Total questions must be between 5 and 100',
      path: ['difficultyDistribution'],
    }).refine((data) => {
      const total = Object.values(data.difficultyDistribution).reduce((sum, val) => sum + val, 0);
      return data.mcqCount <= total;
    }, {
      message: 'MCQ count cannot exceed the total questions count',
      path: ['mcqCount'],
    }).refine((data) => {
      if (data.availableFrom && data.deadline) {
        return data.deadline > data.availableFrom;
      }
      return true;
    }, {
      message: 'Deadline must be after the start (Available From) date',
      path: ['deadline'],
    });
  }, [isStudent]);
  
  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      examTitle: stateData?.examTitle || '',
      file: stateData?.file || undefined,
      difficultyDistribution: stateData?.difficultyDistribution || {
        Easy_Memorization: 3,
        Easy_Creativity: 2,
        Easy_Thinking: 2,
        Normal_Memorization: 3,
        Normal_Creativity: 3,
        Normal_Thinking: 3,
        Hard_Memorization: 3,
        Hard_Creativity: 3,
        Hard_Thinking: 3,
      },
      mcqCount: stateData?.mcqCount ?? 15,
      targetGroup: stateData?.targetGroup || '',
      availableFrom: stateData?.availableFrom ? new Date(stateData.availableFrom) : undefined,
      deadline: stateData?.deadline ? new Date(stateData.deadline) : undefined,
      durationMinutes: stateData?.durationMinutes ?? 60,
      allowImmediateAI: stateData?.allowImmediateAI ?? true,
      allowReview: stateData?.allowReview ?? true,
      randomizeQuestions: stateData?.randomizeQuestions ?? false,
      keepForever: stateData?.keepForever ?? false,
    }
  });

  const onSubmit = async (data: any) => {
    const redirectUrl = isStudent ? '/student/generate-exam/processing' : '/teacher/generate-exam/processing';
    navigate(redirectUrl, { state: data });
  };

  const handleNextStep = async () => {
    const isStep1Valid = await methods.trigger(['examTitle', 'file', 'difficultyDistribution', 'mcqCount']);
    
    const values = methods.getValues();
    const total = Object.values(values.difficultyDistribution || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) as number;
    
    let hasCustomError = false;

    const userCredits = currentUser?.available_credits ?? 0;

    if (total < 5 || total > 100) {
      methods.setError('difficultyDistribution', {
        type: 'manual',
        message: 'Total questions must be between 5 and 100',
      });
      hasCustomError = true;
    } else if (isStudent && total > 10) {
      methods.setError('difficultyDistribution', {
        type: 'manual',
        message: 'Students are limited to 10 questions per exam. Please subscribe to PRO to unlock larger exams!',
      });
      hasCustomError = true;
    } else if (userCredits < total) {
      methods.setError('difficultyDistribution', {
        type: 'manual',
        message: `Insufficient credits. Generating this exam costs ${total} credits, but you only have ${userCredits}.`,
      });
      hasCustomError = true;
    } else {
      methods.clearErrors('difficultyDistribution');
    }
    
    const mcqCount = Number(values.mcqCount) || 0;
    if (mcqCount > total) {
      methods.setError('mcqCount', {
        type: 'manual',
        message: 'MCQ count cannot exceed the total questions count',
      });
      hasCustomError = true;
    } else if (mcqCount < 0) {
      methods.setError('mcqCount', {
        type: 'manual',
        message: 'MCQ Count cannot be negative',
      });
      hasCustomError = true;
    } else {
      methods.clearErrors('mcqCount');
    }
    
    if (!isStep1Valid || hasCustomError) return;
    setStep(2);
  };

  return {
    step,
    setStep,
    methods,
    onSubmit,
    handleNextStep,
    isStudent,
  };
}
