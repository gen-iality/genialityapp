import { useState } from 'react'

export const useSteps = (stepsLenght: number) => {
    const [current, setCurrent] = useState(0);

    const onLastStep = () => {
        setCurrent(current > 0 ? current - 1 : current);
    };

    const onNextStep = () => {
        setCurrent(current < stepsLenght - 1 ? current + 1 : current);
    };
    return {
        current,
        onLastStep,
        onNextStep
    }
}
