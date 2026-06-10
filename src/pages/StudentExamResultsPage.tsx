import { useState, useMemo } from "react";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { ExamResultsHeader } from "../components/student-exam-results/ExamResultsHeader";
import { QuestionAnalysisHeader, type FilterOption } from "../components/student-exam-results/QuestionAnalysisHeader";
import { QuestionAnalysisList } from "../components/student-exam-results/QuestionAnalysisList";
import { type QuestionData } from "../components/student-exam-results/QuestionAnalysisCard";

const MOCK_QUESTIONS: QuestionData[] = [
  {
    id: "q1",
    number: 1,
    text: "What is the average time complexity for searching a binary search tree (BST)?",
    tags: ["Trees"],
    type: "MCQ",
    isCorrect: true,
    correctAnswer: "O(log n)",
    explanation: "In a balanced BST, each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree.",
  },
  {
    id: "q2",
    number: 2,
    text: "Which algorithm is best suited for finding the shortest path in a graph with negative edge weights (but no negative cycles)?",
    tags: ["Graphs"],
    difficulty: "Hard",
    type: "MCQ",
    isCorrect: false,
    correctAnswer: "Bellman-Ford Algorithm",
    studentAnswer: "Dijkstra's Algorithm",
    explanation: "Dijkstra's algorithm uses a greedy approach of always selecting the closest vertex. This greedy choice can fail because a longer path (with more edges) might actually have a lower total weight if it includes negative weight edges. Bellman-Ford correctly handles negative edge weights.",
  },
  {
    id: "q3",
    number: 3,
    text: "A hash table provides O(1) worst-case time complexity for search operations.",
    tags: ["Hash Tables"],
    type: "TF",
    isCorrect: true,
    correctAnswer: "False",
    explanation: "The worst-case time complexity for a hash table is O(n), which occurs when there are many collisions and all elements hash to the same bucket (depending on the collision resolution strategy). O(1) is the average-case time complexity.",
  },
  {
    id: "q4",
    number: 4,
    text: "Quicksort is considered a stable sorting algorithm in its standard implementation.",
    tags: ["Sorting"],
    type: "TF",
    isCorrect: false,
    correctAnswer: "False",
    studentAnswer: "True",
    explanation: "Standard implementations of Quicksort are not stable. The partitioning step involves swapping elements across long distances, which can easily change the relative order of equal elements. Merge sort, on the other hand, is stable.",
  }
];

export default function StudentExamResultsPage() {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filteredQuestions = useMemo(() => {
    if (filter === "correct") return MOCK_QUESTIONS.filter(q => q.isCorrect);
    if (filter === "incorrect") return MOCK_QUESTIONS.filter(q => !q.isCorrect);
    return MOCK_QUESTIONS;
  }, [filter]);

  const counts = useMemo(() => {
    const correct = MOCK_QUESTIONS.filter(q => q.isCorrect).length;
    const incorrect = MOCK_QUESTIONS.length - correct;
    return {
      all: MOCK_QUESTIONS.length,
      correct,
      incorrect
    };
  }, []);

  return (
    <StudentLayout title="Results & Review">
      <div className="max-w-5xl mx-auto py-8">
        
        <ExamResultsHeader />

        <QuestionAnalysisHeader 
          currentFilter={filter} 
          onFilterChange={setFilter} 
          counts={counts} 
        />

        <QuestionAnalysisList questions={filteredQuestions} />

      </div>
    </StudentLayout>
  );
}
