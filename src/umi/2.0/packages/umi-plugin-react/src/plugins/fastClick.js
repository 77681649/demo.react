import { relative } from 'path';

export default function(api, options = {}) {
  const { paths } = api;

  // 
  // import('fastclick') 
  // 
  api.addEntryImport(() => {
    return {
      source: relative(
        paths.absTmpDirPath,
        options.libraryPath || require.resolve('fastclick'),
      ),
      specifier: 'FastClick',
    };
  });

  //
  // add code
  //
  api.addEntryCodeAhead(
    `
// Initialize fastclick
document.addEventListener(
  'DOMContentLoaded',
  () => {
    FastClick.attach(document.body);
  },
  false,
);
  `.trim(),
  );
}
