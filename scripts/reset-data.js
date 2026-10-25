// Resets the playground's demo data before a test run, on whichever site the
// run targets (BASE_URL), so every run starts from the same state.
// DATA_SIZE picks how much demo data to load: small, medium (default) or large.
const base = (process.env.BASE_URL || 'https://testplay.venomva.com/').replace(/\/?$/, '/');
const size = process.env.DATA_SIZE || 'medium';

fetch(base + 'api/reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ size }),
})
  .then((res) => res.json())
  .then((body) => console.log(`Test data reset on ${base} (size: ${body.size})`))
  .catch((err) => {
    console.error(`Could not reset test data on ${base}: ${err.message}`);
    process.exit(1);
  });
