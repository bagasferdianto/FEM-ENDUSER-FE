interface LoadingCardProps {
  loadingMessage?: string;
}

export default function LoadingCard({
  loadingMessage = "Loading...",
}: LoadingCardProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
        <p className="mt-2 text-gray-600">{loadingMessage}</p>
      </div>
    </div>
  );
}
