/**
 * Route-level loading state.
 *
 * A skeleton rather than a spinner: it holds the same shape as the page that
 * is about to arrive, so the layout does not jump when content lands. Spinners
 * tell you nothing and feel slower.
 *
 * aria-busy + a polite status message means screen-reader users are told the
 * page is loading rather than hearing silence.
 */
const Loading = () => (
  <div className="bg-body" aria-busy="true">
    <p role="status" className="sr-only">
      Loading page, please wait.
    </p>

    {/* Header band */}
    <div className="bg-primary-950 py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 lg:px-8">
        <div className="h-3 w-40 rounded bg-white/20" />
        <div className="mt-5 h-10 w-3/4 rounded bg-white/25 md:h-12" />
        <div className="mt-4 h-4 w-1/2 rounded bg-white/15" />
      </div>
    </div>

    {/* Body */}
    <div className="mx-auto w-full max-w-[1200px] px-5 py-16 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mx-auto h-3 w-28 rounded skeleton" />
        <div className="mx-auto mt-4 h-8 w-2/3 rounded skeleton" />
        <div className="mx-auto mt-4 h-4 w-1/2 rounded skeleton" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-card border border-border p-6">
            <div className="h-11 w-11 rounded-full skeleton" />
            <div className="mt-5 h-5 w-2/3 rounded skeleton" />
            <div className="mt-3 h-4 w-full rounded skeleton" />
            <div className="mt-2 h-4 w-5/6 rounded skeleton" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Loading;
