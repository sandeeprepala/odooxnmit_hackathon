export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="spinner">
      <div className="spinner-circle" />
      <span>{text}</span>
    </div>
  );
}


