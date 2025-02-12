import RowSteps from "@/components/common/RowSteps";

export default function AddExpensePage() {
    return(
        <RowSteps
            defaultStep={0}
            steps={[
                {
                title: "Import",
                },
                {
                title: "Review",
                },
                {
                title: "Save",
                },
            ]}
        />
    );
}