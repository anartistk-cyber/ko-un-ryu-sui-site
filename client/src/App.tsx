import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import JobPosting from "./pages/JobPosting";
import { BlogIndex, BlogPost } from "./pages/Blog";
import { Landing } from "./pages/Landing";
import { Guide } from "./pages/Guide";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs/stylist">{() => <JobPosting type="stylist" />}</Route>
      <Route path="/jobs/assistant">{() => <JobPosting type="assistant" />}</Route>
      <Route path="/jobs/part">{() => <JobPosting type="part" />}</Route>
      <Route path="/jobs/student">{() => <JobPosting type="student" />}</Route>
      <Route path="/recruit/newgrad">{() => <Landing type="newgrad" />}</Route>
      <Route path="/recruit/career">{() => <Landing type="career" />}</Route>
      <Route path="/area">{() => <Guide type="area" />}</Route>
      <Route path="/school">{() => <Guide type="school" />}</Route>
      <Route path="/recruit/student">{() => <Guide type="student" />}</Route>
      <Route path="/blog">{() => <BlogIndex />}</Route>
      <Route path="/blog/">{() => <BlogIndex />}</Route>
      <Route path="/blog/:slug">{(params: { slug: string }) => <BlogPost slug={params.slug} />}</Route>
      <Route path="/faq" component={Faq} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}
