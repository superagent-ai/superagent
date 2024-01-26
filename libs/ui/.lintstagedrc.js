module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx)": (filenames) => [
    `npx eslint ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // Prettify only Markdown and JSON files
  "**/*.(md|json)": (filenames) =>
    `npx prettier --write ${filenames.join(" ")}`,
}
