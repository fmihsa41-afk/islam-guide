// client/src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminBooks from "@/pages/AdminBooks";
import LessonManager from "@/pages/LessonManager";

function Router() {
  return (
    <Switch>
      {/* landing + chat demo */}
      <Route path="/" component={Home} />

      {/* books dashboard */}
      <Route path="/books" component={AdminBooks} />

      {/* Lesson Manager for each course */}
      <Route path="/courses/:slug" component={LessonManager} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
