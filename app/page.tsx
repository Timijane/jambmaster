export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-blue-700">
              JAMBMASTER
            </h1>
            <p className="text-xs text-gray-500">
              Prepare. Practice. Compete. Improve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:block"
            >
              Log in
            </a>

            <a
              href="/signup"
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-28">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            The smarter way to prepare for JAMB
          </div>

          <h2 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Prepare for JAMB with
            <span className="text-blue-700"> confidence.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Study your four JAMB subjects, practise with realistic CBTs,
            compete with other students, track your progress and improve your
            score.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-xl bg-blue-700 px-7 py-4 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
            >
              Start Preparing
            </a>

            <a
              href="#features"
              className="rounded-xl border border-gray-200 bg-white px-7 py-4 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Explore JAMBMASTER
            </a>
          </div>
        </div>
      </section>

      {/* Core System */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-blue-700">ONE PLATFORM</p>

            <h3 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to prepare
            </h3>

            <p className="mt-4 text-gray-600">
              JAMBMASTER brings learning, practice, competition and
              performance tracking into one platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              number="01"
              title="Learn"
              description="Access structured materials and study resources for your selected JAMB subjects."
            />

            <Feature
              number="02"
              title="Practise"
              description="Test yourself with timed CBT practice designed around your JAMB preparation."
            />

            <Feature
              number="03"
              title="Compete"
              description="Challenge other students and compete in timed JAMB battles."
            />

            <Feature
              number="04"
              title="Improve"
              description="Understand your performance, identify weak areas and focus your preparation."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-semibold text-blue-700">HOW IT WORKS</p>

              <h3 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Your preparation has a clear path.
              </h3>

              <p className="mt-5 leading-7 text-gray-600">
                From the moment you create your account, JAMBMASTER is built
                around the subjects and goals you choose.
              </p>
            </div>

            <div className="space-y-4">
              <Step
                number="1"
                title="Create your account"
                description="Set up your student profile and tell us what you are preparing for."
              />

              <Step
                number="2"
                title="Choose your four subjects"
                description="Your learning experience is organized around your actual JAMB subject combination."
              />

              <Step
                number="3"
                title="Study and practise"
                description="Learn topics, practise questions and take realistic timed CBTs."
              />

              <Step
                number="4"
                title="Track and improve"
                description="Use your results and performance data to identify where you need more work."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-blue-700 px-6 py-14 text-center text-white shadow-xl sm:px-12">
          <h3 className="text-3xl font-extrabold sm:text-4xl">
            Your JAMB preparation starts here.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Build your confidence, practise consistently and work toward the
            score you want.
          </p>

          <a
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Create Your Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-gray-500 sm:flex-row">
          <p>© 2026 JAMBMASTER. All rights reserved.</p>

          <p>Prepare. Practice. Compete. Improve.</p>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
        {number}
      </div>

      <h4 className="text-xl font-bold text-gray-900">{title}</h4>

      <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
        {number}
      </div>

      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>

        <p className="mt-1 text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
