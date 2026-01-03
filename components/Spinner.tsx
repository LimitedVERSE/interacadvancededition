export const Spinner = () => (
  <div className="flex justify-center items-center h-32" role="status" aria-live="polite">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FDB913]">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
)
