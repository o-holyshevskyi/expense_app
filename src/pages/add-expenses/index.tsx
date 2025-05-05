import RowSteps from "@/components/common/RowSteps";
import { getTranslation, Locale } from "@/lib/i18n";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AddExpensePage() {
    const router = useRouter();
    const { locale } = router;
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepChange = (stepIndex: number) => {
        setCurrentStep(stepIndex);
    };
    
    return(
        <div className="container">
            <RowSteps
                defaultStep={0}
                currentStep={currentStep}
                onStepChange={handleStepChange}
                locale={locale as Locale}
                steps={[
                    {
                        title: getTranslation(locale as Locale, "addExpenses.steps[0]"),
                    },
                    {
                        title: getTranslation(locale as Locale, "addExpenses.steps[1]"),
                    },
                    {
                        title: getTranslation(locale as Locale, "addExpenses.steps[2]"),
                    },
                ]}
            />
        </div>
    );
}