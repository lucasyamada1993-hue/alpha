import RatingQuestion from "./RatingQuestion";

export default function StepRatings({ questions, data, onChange, errors }) {
  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <RatingQuestion
          key={q.field}
          question={q.question}
          fieldName={q.field}
          value={data[q.field]}
          onChange={onChange}
          error={errors[q.field]}
        />
      ))}
    </div>
  );
}