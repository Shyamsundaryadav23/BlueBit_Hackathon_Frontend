// import { Toaster as Sonner } from "sonner";
// import { TooltipProvider } from "@radix-ui/react-tooltip"; 
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./components/context/AuthContext";

// import NotFound from "./pages/NotFound";
// import { Landing } from "./pages/Landing";
// import Signup from "./pages/Signup";
// import Signin from "./pages/Signin";
// import Dashboard from "./pages/Dashboard";
// import Groups from "./pages/Groups";
// import Expenses from "./pages/Expenses";
// import Insights from "./pages/Insights";
// import AuthCallback from "./components/auth/AuthCallback";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Sonner position="top-right" />
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Landing />} />
//             <Route path="/signin" element={<Signin />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/groups" element={<Groups />} />
//             <Route path="/groups/:groupId" element={<Expenses />} />
//             <Route path="/insights" element={<Insights />} />
//             <Route path="/auth/callback" element={<AuthCallback />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";

import NotFound from "./pages/NotFound";
import { Landing } from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Expenses from "./pages/Expenses";
import Insights from "./pages/Insights";
import AuthCallback from "./components/auth/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId" element={<Expenses />} />
            <Route path="/groups/:groupId/expenses" element={<Expenses />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
