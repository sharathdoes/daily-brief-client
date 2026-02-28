 
export default function AboutPage() {
  return (
    <div className="min-h-screen  flex flex-col justify-center">

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8 ">
        <section>
          <h1 className="text-2xl font-semibold mb-2">How Daily Brief Works</h1>
          <p className="text-sm leading-relaxed">
            Daily Brief builds each quiz on demand from real news articles. When
            you request a quiz, the backend fetches fresh stories, processes the
            content, and asks an LLM to generate grounded multiple-choice
            questions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Pipeline</h2>
          <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed">
            <li>
              <strong>Feed sources</strong> &mdash; RSS URLs are grouped into
              categories. When you pick a category, its feeds are used as the
              input.
            </li>
            <li>
              <strong>Feed parsing</strong> &mdash; RSS feeds for that category
              are fetched and parsed (using gofeed), pulling item titles, links,
              and summary content.
            </li>
            <li>
              <strong>Article scraping</strong> &mdash; for each feed item, the
              full article page is fetched and the main content is extracted,
              stripping navigation, ads, and boilerplate to get clean article
              text.
            </li>
            <li>
              <strong>Storage</strong> &mdash; articles are bulk-upserted into
              Postgres and deduplicated by URL so repeated requests don&apos;t
              re-scrape already-seen content.
            </li>
            <li>
              <strong>Quiz generation</strong> &mdash; a batch of recent
              articles is assembled and sent to Groq with a structured prompt.
              The LLM returns multiple-choice questions grounded in what was
              actually in the articles.
            </li>
            <li>
              <strong>Response</strong> &mdash; the quiz is returned immediately
              to the client; there&apos;s no pre-generation or long-term caching
              of quizzes.
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
