import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";

export type Source = {
  title: string;
  url: string;
};

export type Status = "completed" | "in-progress" | "failed" | "pending";

export type QuestionType = "multiple_choice" | "short_answer";

export interface Research {
  id: number;
  topic: string;
  subTopics: string[];
  createdAt: string;
  content: string | null;
  status: Status;
  updatedAt: string | null;
  sources: Source[] | null;
  maxResearchLoops: number;
}

export interface Question {
  id: number;
  name: string | null;
  createdAt: string;
  quizId: number;
  label: string | null;
  type: QuestionType;
  answer: string | null;
  submission: string | null;
  updatedAt: string | null;
}

export interface Quiz {
  id: number;
  name: string | null;
  topicId: number;
  createdAt: string;
  score: number | null;
  review: string | null;
  breakdown: string | null;
  updatedAt: string | null;
  questions: Question[];
}

export interface Flashcard {
  id: number;
  question: string | null;
  answer: string | null;
  topicId: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Event {
  title: string;
  content: string;
  timestamp: Date;
}

export interface State {
  research: Research[];
  quizzes: Quiz[];
  flashcards: Flashcard[];
  nextIds: {
    research: number;
    quiz: number;
    question: number;
    flashcard: number;
  };
  deepSeekApiKey: string | null;
  tavilyApiKey: string | null;
  selectedResearchId: number | null;
  eventLog: Record<string, Event[]>;

  // Research methods
  getResearch: (id: number) => Research | undefined;
  getAllResearch: () => Research[];
  addResearch: (
    research: Omit<
      Research,
      "id" | "createdAt" | "updatedAt" | "content" | "sources"
    >,
  ) => Research;
  updateResearch: (id: number, data: Partial<Research>) => boolean;
  deleteResearch: (id: number) => boolean;
  setSelectedResearchId: (id: number | null) => void;

  // Quiz methods
  getQuiz: (id: number) => Quiz | undefined;
  getQuizzesByTopicId: (topicId: number) => Quiz[];
  addQuiz: (
    quiz: Omit<Quiz, "id" | "createdAt" | "updatedAt" | "questions">,
  ) => Quiz;
  updateQuiz: (id: number, data: Partial<Quiz>) => boolean;
  deleteQuiz: (id: number) => boolean;

  // Question methods
  getQuestion: (id: number) => Question | undefined;
  getQuestionsByQuizId: (quizId: number) => Question[];
  addQuestion: (
    question: Omit<Question, "id" | "createdAt" | "updatedAt">,
  ) => Question;
  updateQuestion: (id: number, data: Partial<Question>) => boolean;
  deleteQuestion: (id: number) => boolean;

  // Flashcard methods
  getFlashcard: (id: number) => Flashcard | undefined;
  getFlashcardsByTopicId: (topicId: number) => Flashcard[];
  addFlashcard: (
    flashcard: Omit<Flashcard, "id" | "createdAt" | "updatedAt">,
  ) => Flashcard;
  updateFlashcard: (id: number, data: Partial<Flashcard>) => boolean;
  deleteFlashcard: (id: number) => boolean;

  // API Key methods
  setDeepSeekApiKey: (key: string | null) => void;
  getDeepSeekApiKey: () => string | null;
  setTavilyApiKey: (key: string | null) => void;
  getTavilyApiKey: () => string | null;

  getEventLog: (projectId: number) => Event[];
  addEvent: (projectId: number, event: Event) => void;
  clearEventLog: (projectId: number) => void;

  // Utilities
  clearStore: () => void;
}

const store: StateCreator<State> = persist(
  (set, get) => ({
    research: [],
    quizzes: [],
    flashcards: [],
    nextIds: {
      research: 1,
      quiz: 1,
      question: 1,
      flashcard: 1,
    },
    deepSeekApiKey: null,
    tavilyApiKey: null,
    selectedResearchId: null,
    eventLog: {},

    // Research methods
    getResearch: (id) => get().research.find((r) => r.id === id),
    getAllResearch: () => get().research,
    addResearch: (research) => {
      const newResearch: Research = {
        ...research,
        id: get().nextIds.research,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        content: null,
        sources: null,
      };

      set((state) => ({
        research: [...state.research, newResearch],
        nextIds: {
          ...state.nextIds,
          research: state.nextIds.research + 1,
        },
      }));

      return newResearch;
    },

    setSelectedResearchId: (id) => set({ selectedResearchId: id }),

    updateResearch: (id, data) => {
      const researchIndex = get().research.findIndex((r) => r.id === id);

      if (researchIndex === -1) return false;

      const updatedResearch = {
        ...get().research[researchIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        research: state.research.map((r) =>
          r.id === id ? updatedResearch : r,
        ),
      }));

      return true;
    },
    deleteResearch: (id) => {
      const exists = get().research.some((r) => r.id === id);

      if (!exists) return false;

      set((state) => ({
        research: state.research.filter((r) => r.id !== id),
        // Also delete related quizzes and flashcards
        quizzes: state.quizzes.filter((q) => q.topicId !== id),
        flashcards: state.flashcards.filter((f) => f.topicId !== id),
      }));

      return true;
    },

    // Quiz methods
    getQuiz: (id) => get().quizzes.find((q) => q.id === id),
    getQuizzesByTopicId: (topicId) =>
      get().quizzes.filter((q) => q.topicId === topicId),
    addQuiz: (quiz) => {
      const newQuiz: Quiz = {
        ...quiz,
        id: get().nextIds.quiz,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        questions: [],
      };

      set((state) => ({
        quizzes: [...state.quizzes, newQuiz],
        nextIds: {
          ...state.nextIds,
          quiz: state.nextIds.quiz + 1,
        },
      }));

      return newQuiz;
    },
    updateQuiz: (id, data) => {
      const quizIndex = get().quizzes.findIndex((q) => q.id === id);

      if (quizIndex === -1) return false;

      const updatedQuiz = {
        ...get().quizzes[quizIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        quizzes: state.quizzes.map((q) => (q.id === id ? updatedQuiz : q)),
      }));

      return true;
    },
    deleteQuiz: (id) => {
      const exists = get().quizzes.some((q) => q.id === id);

      if (!exists) return false;

      set((state) => ({
        quizzes: state.quizzes.filter((q) => q.id !== id),
        // Also delete related questions
        questions: get().quizzes.flatMap((quiz) =>
          quiz.id === id ? [] : quiz.questions,
        ),
      }));

      return true;
    },

    // Question methods
    getQuestion: (id) => {
      for (const quiz of get().quizzes) {
        const question = quiz.questions.find((q) => q.id === id);
        if (question) return question;
      }
      return undefined;
    },
    getQuestionsByQuizId: (quizId) => {
      const quiz = get().quizzes.find((q) => q.id === quizId);
      return quiz ? quiz.questions : [];
    },
    addQuestion: (question) => {
      const newQuestion: Question = {
        ...question,
        id: get().nextIds.question,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };

      set((state) => {
        const updatedQuizzes = state.quizzes.map((quiz) => {
          if (quiz.id === question.quizId) {
            return {
              ...quiz,
              questions: [...quiz.questions, newQuestion],
            };
          }
          return quiz;
        });

        return {
          quizzes: updatedQuizzes,
          nextIds: {
            ...state.nextIds,
            question: state.nextIds.question + 1,
          },
        };
      });

      return newQuestion;
    },
    updateQuestion: (id, data) => {
      let success = false;

      set((state) => {
        const updatedQuizzes = state.quizzes.map((quiz) => {
          const questionIndex = quiz.questions.findIndex((q) => q.id === id);

          if (questionIndex !== -1) {
            success = true;
            const updatedQuestions = quiz.questions.map((q, index) => {
              if (index === questionIndex) {
                return {
                  ...q,
                  ...data,
                  updatedAt: new Date().toISOString(),
                };
              }
              return q;
            });

            return {
              ...quiz,
              questions: updatedQuestions,
            };
          }

          return quiz;
        });

        return { quizzes: updatedQuizzes };
      });

      return success;
    },
    deleteQuestion: (id) => {
      let success = false;

      set((state) => {
        const updatedQuizzes = state.quizzes.map((quiz) => {
          const questionExists = quiz.questions.some((q) => q.id === id);

          if (questionExists) {
            success = true;
            return {
              ...quiz,
              questions: quiz.questions.filter((q) => q.id !== id),
            };
          }

          return quiz;
        });

        return { quizzes: updatedQuizzes };
      });

      return success;
    },

    // Flashcard methods
    getFlashcard: (id) => get().flashcards.find((f) => f.id === id),
    getFlashcardsByTopicId: (topicId) =>
      get().flashcards.filter((f) => f.topicId === topicId),
    addFlashcard: (flashcard) => {
      const newFlashcard: Flashcard = {
        ...flashcard,
        id: get().nextIds.flashcard,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };

      set((state) => ({
        flashcards: [...state.flashcards, newFlashcard],
        nextIds: {
          ...state.nextIds,
          flashcard: state.nextIds.flashcard + 1,
        },
      }));

      return newFlashcard;
    },
    updateFlashcard: (id, data) => {
      const flashcardIndex = get().flashcards.findIndex((f) => f.id === id);

      if (flashcardIndex === -1) return false;

      const updatedFlashcard = {
        ...get().flashcards[flashcardIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        flashcards: state.flashcards.map((f) =>
          f.id === id ? updatedFlashcard : f,
        ),
      }));

      return true;
    },
    deleteFlashcard: (id) => {
      const exists = get().flashcards.some((f) => f.id === id);

      if (!exists) return false;

      set((state) => ({
        flashcards: state.flashcards.filter((f) => f.id !== id),
      }));

      return true;
    },

    // API Key methods
    setDeepSeekApiKey: (key) => set({ deepSeekApiKey: key }),
    getDeepSeekApiKey: () => get().deepSeekApiKey,
    setTavilyApiKey: (key) => set({ tavilyApiKey: key }),
    getTavilyApiKey: () => get().tavilyApiKey,

    // Event log methods
    getEventLog: (projectId) => get().eventLog[projectId] ?? [],
    addEvent: (projectId, event) => {
      set((state) => {
        const updatedEventLog = { ...state.eventLog };
        if (!updatedEventLog[projectId]) {
          updatedEventLog[projectId] ??= [];
        }
        updatedEventLog[projectId].push(event);
        return { eventLog: updatedEventLog };
      });
    },
    clearEventLog: (projectId) => {
      set((state) => {
        const updatedEventLog = { ...state.eventLog };
        delete updatedEventLog[projectId];
        return { eventLog: updatedEventLog };
      });
    },

    // Utilities
    clearStore: () =>
      set({
        research: [],
        quizzes: [],
        flashcards: [],
        nextIds: {
          research: 1,
          quiz: 1,
          question: 1,
          flashcard: 1,
        },
        deepSeekApiKey: null,
        tavilyApiKey: null,
        selectedResearchId: null,
        eventLog: {},
      }),
  }),
  {
    name: "deep-research-ui-store",
    storage: createJSONStorage(() => localStorage),
  },
) as StateCreator<State>;

const useStore = create<State>(store);

export default useStore;

// Enable Redux DevTools in development
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("deep-research-ui-store", useStore);
}
