import { Link } from "react-router-dom";

const BlogPost = () => {
return (
  <div className="min-h-screen bg-background">
    <nav className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-4 flex items-center gap-8">

        {/* Logo / Home */}
        <Link
          to="/#blogs"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Threat-hunt
        </Link>

        {/* Back Button */}
        <Link
          to="/"
          state={{ scrollTo: "blogs" }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
        ← Back
      </Link>

      </div>
    </nav>

      <article className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-3xl font-700 leading-tight text-foreground mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          The Adya Hypothesis
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          A hypothesis-driven noise reduction technique for modern threat hunting.
        </p>

        <div className="prose-custom space-y-6 text-foreground leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
          <p className="text-lg font-semibold text-foreground">
            The Adya Hypothesis: A Threat hunter's overly simple accidental discovery
          </p>

          <p>
            If you've ever stared at a mountain of DNS logs and thought, 'Surely, there must be a better way,' congratulations—you're already halfway to discovering the Adya Hypothesis.
          </p>

          <p>
            Threat hunting is a lot about data science which involves understanding data sets (Web server logs, DNS logs, Process image paths, File hashes etc.), data cleaning & preprocessing, creating correlations, joining, data analysis etc.
          </p>

          <p>
            Adya simply reduces noise by eliminating repeated/historical entries, producing a clean dataset for today's hunt.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Where It All Started
          </h2>

          <p>
            Picture this: a threat hunter drowning in global-enterprise-scale DNS logs, trying to make sense of an avalanche of repeated domain lookups. Then comes the lightbulb moment: What if we only looked at what happened just today?
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Meet Adya
          </h2>

          <p>
            'Adya' comes from the Sanskrit word for 'Today,' so the idea is to focus on the present-day logs only & treat anything irrelevant that did not occur today.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-6" style={{ fontFamily: 'var(--font-sans)' }}>
            The Magic Rule
          </h2>

          <p>The hypothesis is beautifully simple:</p>

          <ol className="list-decimal pl-6 space-y-1">
            <li>Assume the suspicious activity/incident happened today.</li>
            <li>Ignore everything that also happened yesterday or the day before that.</li>
          </ol>

          <p>Why? Because your logs have trust issues, they repeat themselves. A lot.</p>

          <h2 className="text-xl font-semibold text-foreground pt-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Why It Works
          </h2>

          <p>Cutting out repetitive historical data means:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Smaller datasets</li>
            <li>Faster hunting</li>
            <li>Cleaner signals</li>
            <li>Fewer headaches</li>
          </ul>

          <p>
            And it's not just for DNS! Startup persistence artifacts, Batch files, weird processes — if it happened today and not recently, apply Adya.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Final Thoughts
          </h2>

          <p>
            The Adya Hypothesis is close to Jason Bourne of threat hunting: it wakes up with no memory of the past, hunts only what's new, unexpected, and potentially dangerous today.
          </p>

          <p>
            To get rid of more irrelevant data, increase the time-window to 3, 4 or 5 days instead of just past 2 days.
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
