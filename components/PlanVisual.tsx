export default function PlanVisual({ label = 'ПЛАНИРОВКА / PLACEHOLDER' }: { label?: string }) {
  return (
    <div className="planVisual" aria-label="Место для визуализации плана проекта">
      <div className="planGrid" />
      <div className="planShape planShapeA" />
      <div className="planShape planShapeB" />
      <div className="planShape planShapeC" />
      <div className="planLabel">{label}</div>
    </div>
  );
}
