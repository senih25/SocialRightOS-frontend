import {
  getOfficialSourceProfile,
  type OfficialSourceProfileKey,
} from "@/lib/official-source-profiles";

type Props = {
  profileKey: OfficialSourceProfileKey;
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

export function OfficialSourcesPanel({ profileKey }: Props) {
  const profile = getOfficialSourceProfile(profileKey);
  const headingId = `official-sources-${profileKey}`;

  return (
    <section className="card-panel" aria-labelledby={headingId}>
      <p className="eyebrow">Kaynak ve güncellik</p>
      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <h2 id={headingId} className="text-2xl font-semibold text-slate-950">
            Resmî kaynaklar
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            Bu sayfadaki rehberlik, aşağıdaki resmî kurum kaynaklarıyla karşılaştırılmıştır. Nihai
            karar ve güncel uygulama ilgili kuruma aittir.
          </p>
        </div>
        <dl className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900">Son içerik güncellemesi</dt>
            <dd className="mt-1 text-slate-700">
              <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Son kaynak doğrulaması</dt>
            <dd className="mt-1 text-slate-700">
              <time dateTime={profile.verifiedAt}>{formatDate(profile.verifiedAt)}</time>
            </dd>
          </div>
        </dl>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {profile.sources.map((source) => (
          <li key={source.url} className="rounded-2xl bg-slate-50 p-5">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            >
              {source.title}
            </a>
            <p className="mt-2 text-sm text-slate-600">{source.publisher}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{source.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
