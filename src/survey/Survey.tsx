import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Progress } from "@/components/ui/progress"
import { sendEnquiry } from "@/Jod/utils/resend";
import { useUser } from "@supabase/auth-helpers-react";
type Question = {
    question: string;
    answers: string[];
};
type AnswerRecord = {
    question: string;
    answer: string;
};

export default function Survey({ data }: { data: Question[] }) {
    const user = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<AnswerRecord[]>([]);
    const no_questions = countQuestions(data);
    const currentQuestion = data[currentQuestionIndex];
    const currentAnswer = answers.find(record => record.question === currentQuestion.question)?.answer || "";

    function countQuestions(questions: Question[]): number {
        return questions.length;
    }
    const handleNextQuestion = () => {
        if (currentQuestionIndex < no_questions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };


    const handleAnswerSelection = (question: string, answer: string) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            const existingAnswerIndex = updatedAnswers.findIndex(record => record.question === question);
            if (existingAnswerIndex >= 0) {
                updatedAnswers[existingAnswerIndex] = { question, answer };
            } else {
                updatedAnswers.push({ question, answer });
            }
            return updatedAnswers;
        });
    };

    function sendEmail() {
        sendEnquiry(user?.email, JSON.stringify(answers), "New Survey Response")
    }
    return (

        <div className="flex flex-col mx-auto space-y-4 px-4 pt-4 md:pt-0">
            <Progress value={(currentQuestionIndex + 1) / no_questions * 100} />
            <Card className="">
                <CardHeader>
                    <CardTitle>Thanks for taking part in the doli survey</CardTitle>
                    <CardDescription>There are {no_questions} multiple choice questions.</CardDescription>
                </CardHeader>
                <>
                    <CardContent className="grid gap-4">
                        <div>
                            <h2 className="font-bold">{currentQuestion.question}</h2>
                            {currentQuestion.answers.map((value, index) => (
                                <div key={index} className="flex flex-col">
                                    <ClickableOption
                                        value={value}
                                        state={answers.find(record => record.question === currentQuestion.question)?.answer || ""}
                                        handleClick={() => handleAnswerSelection(currentQuestion.question, value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button className="w-full bg-gray-400 hover:bg-gray-600" onClick={handlePreviousQuestion}>
                            Back
                        </Button>
                        {(currentQuestionIndex + 1) === no_questions ?
                            <Button className="w-full bg-[#0098b3] hover:bg-[#0098b3cc]"
                                onClick={() => { setIsOpen(true), sendEmail() }}
                                disabled={!currentAnswer}
                            >
                                Submit
                            </Button>
                            :
                            <Button className="w-full bg-[#0098b3] hover:bg-[#0098b3cc]"
                                onClick={handleNextQuestion}
                                disabled={!currentAnswer}
                            >
                                Next Question ({currentQuestionIndex + 1}/{no_questions})
                            </Button>

                        }
                    </CardFooter>
                </>

            </Card>
            {isOpen && <SubmitDialog setIsOpen={setIsOpen} />}
        </div>
    )
}

function ClickableOption({ value, handleClick, state }: { value: string, handleClick: (value: string) => void, state: string }) {
    return (
        <button onClick={() => handleClick(value)}
            className={` flex items-center space-x-4 my-2 rounded-md border p-4 ${state === value ? "bg-[#0098b34a] border-[#0098b3] border-2" : ""}`}>
            <p>{value}</p>
        </button>)
}

function SubmitDialog({ setIsOpen }: { setIsOpen: (value: boolean) => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-lg shadow-lg md:w-1/3">
                <div className="p-4">
                    <h2 className="text-xl font-bold">Success!</h2>
                    <p className="mt-2">
                        Your response has been submitted successfully. Thank you for taking part in the survey.
                    </p>
                </div>
                <div className="p-4 flex justify-end space-x-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    )
}

