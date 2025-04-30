import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type FlashCardProps = {
  question: string;
  answer: string;
};

export const FlashCard = ({ question, answer }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggle = () => setIsFlipped((prev) => !prev);

  const minCardHeight = "150px";

  const variants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  const transition = { duration: 0.6 };

  return (
    <div
      onClick={handleToggle}
      style={{
        perspective: "1000px",
        cursor: "pointer",
        minHeight: minCardHeight,
        position: "relative",
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          minHeight: minCardHeight,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        initial={false}
        animate={isFlipped ? "back" : "front"}
        variants={variants}
        transition={transition}
      >
        <motion.div
          id="front"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Card className="flex h-full flex-col justify-center">
            {" "}
            {/* Center content */}
            <CardHeader>
              <CardTitle>Question</CardTitle>
              <CardDescription>{question}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          id="back"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Card className="flex h-full flex-col justify-center bg-primary text-primary-foreground">
            {" "}
            <CardHeader>
              <CardTitle>Answer</CardTitle>
              <CardDescription>{answer}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
