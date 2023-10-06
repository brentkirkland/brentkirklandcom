export function Workplace({
  url,
  name,
  title,
  from,
  to,
}: {
  url: string;
  name: string;
  title: string;
  from: string;
  to: string;
}) {
  return (
    <div class="flex justify-between sm:flex-row flex-col">
      <span>
        {title} @{" "}
        <a class="text-indigo-600 dark:text-indigo-300" href={url}>
          {name}
        </a>
      </span>

      <i class="text-gray-500">{`${from} - ${to}`}</i>
    </div>
  );
}
