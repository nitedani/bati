import { Counter } from "./Counter";

export default function Page() {
  return (
    <>
      <h1
        //# import.meta.BATI_MODULES?.includes("uikit:tailwindcss")
        class="font-bold text-3xl pb-4"
      >
        My Vike app
      </h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
