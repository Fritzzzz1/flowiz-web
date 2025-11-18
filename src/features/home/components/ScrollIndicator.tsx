/**
 * Scroll indicator component
 * Displays a subtle animated mouse scroll indicator
 */
export function ScrollIndicator() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
      <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full p-1">
        <div className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto animate-pulse" />
      </div>
    </div>
  );
}
