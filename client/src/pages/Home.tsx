import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAnalyzeSite } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Loader2, ArrowRight, LayoutGrid, AlertTriangle, Code, Globe, Sparkles } from "lucide-react";
import { SiFacebook, SiX } from "react-icons/si";
import { GooglePreview, SocialPreview, TwitterPreview } from "@/components/analysis/SeoPreviews";
import { IssueList } from "@/components/analysis/IssueList";
import { SeoScore } from "@/components/analysis/SeoScore";
import { motion, AnimatePresence } from "framer-motion";
import { type AnalyzeResponse } from "@shared/schema";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate, isPending, data, reset } = useAnalyzeSite();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    // Add protocol if missing for better UX
    let finalUrl = url;
    if (!url.startsWith("http")) {
      finalUrl = `https://${url}`;
    }
    mutate({ url: finalUrl });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Check your Meta Tags
            </h1>
            <p className="text-lg text-slate-500 mb-8">
              Analyze your website's SEO metadata and see exactly how it looks on Google, Facebook, and Twitter.
            </p>
          </motion.div>

          <form onSubmit={handleAnalyze} className="flex gap-2 relative shadow-lg rounded-xl bg-white p-2 border border-slate-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Enter website URL (e.g. apple.com)"
                className="pl-10 h-12 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-300"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button 
              size="lg" 
              className="h-12 px-8 rounded-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Score Card */}
                 <div className="md:col-span-2">
                    <SeoScore issues={data.issues} />
                 </div>
                 
                 {/* Quick Stats */}
                 <Card className="p-6 flex flex-col justify-center space-y-4 bg-slate-900 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Globe className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Title Length</p>
                        <p className="text-xl font-bold font-display">{data.meta.title?.length || 0} chars</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Sparkles className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Description</p>
                        <p className="text-xl font-bold font-display">{data.meta.description?.length || 0} chars</p>
                      </div>
                    </div>
                 </Card>
              </div>

              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="w-full justify-start h-14 p-1 bg-white border rounded-xl mb-6 shadow-sm gap-2">
                  <TabsTrigger value="preview" className="h-full px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-2">
                    <LayoutGrid className="w-4 h-4" /> Previews
                  </TabsTrigger>
                  <TabsTrigger value="issues" className="h-full px-6 rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-700 gap-2">
                    <AlertTriangle className="w-4 h-4" /> Issues 
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold ml-1">
                      {data.issues.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="h-full px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-2">
                    <Code className="w-4 h-4" /> Raw Data
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-8 animate-enter">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg flex items-center gap-2">
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                        Google Search
                      </h3>
                      <GooglePreview meta={data.meta} url={data.url} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg flex items-center gap-2 text-[#1877F2]">
                        <SiFacebook className="w-5 h-5" />
                        Facebook / LinkedIn
                      </h3>
                      <SocialPreview meta={data.meta} url={data.url} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg flex items-center gap-2 text-black dark:text-white">
                        <SiX className="w-4 h-4" />
                        Twitter / X
                      </h3>
                      <TwitterPreview meta={data.meta} url={data.url} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="issues" className="animate-enter">
                  <div className="bg-white rounded-xl border p-6 shadow-sm">
                    <h3 className="font-display font-bold text-xl mb-6">SEO Audit Report</h3>
                    <IssueList issues={data.issues} />
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="animate-enter">
                   <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                     <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                       <span className="text-slate-400 font-mono text-sm">Extracted Metadata</span>
                       <div className="flex gap-1.5">
                         <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                         <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                         <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                       </div>
                     </div>
                     <div className="p-6 overflow-x-auto">
                       <table className="w-full text-left text-sm font-mono">
                         <thead>
                           <tr className="text-slate-500 border-b border-slate-800">
                             <th className="pb-2 pl-2">Meta Tag</th>
                             <th className="pb-2">Value</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                           {Object.entries(data.meta.raw || {}).map(([key, value]) => (
                             <tr key={key} className="group hover:bg-slate-800/30 transition-colors">
                               <td className="py-3 pl-2 text-purple-400 font-semibold pr-8 align-top">{key}</td>
                               <td className="py-3 text-slate-300 break-all">{value}</td>
                             </tr>
                           ))}
                           {Object.keys(data.meta.raw || {}).length === 0 && (
                             <tr>
                               <td colSpan={2} className="py-8 text-center text-slate-600 italic">No raw meta tags captured</td>
                             </tr>
                           )}
                         </tbody>
                       </table>
                     </div>
                   </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!data && !isPending && (
          <div className="text-center py-20 opacity-50">
            <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-400">Ready to analyze</h3>
            <p className="text-slate-300">Enter a URL above to get started</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
