// Per-segment Suspense boundary: the page reads params/searchParams, so instant navigations need
// the fallback inside this segment rather than the one from (store)/loading.tsx above it.
export { default } from "../loading";
