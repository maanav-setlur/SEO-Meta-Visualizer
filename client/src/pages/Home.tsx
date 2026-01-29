import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAnalyzeSite } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Loader2, ArrowRight, LayoutGrid, Code, Lightbulb } from "lucide-react";
import { SiFacebook, SiX } from "react-icons/si";
import { GooglePreview, SocialPreview, TwitterPreview } from "@/components/analysis/SeoPreviews";
import { IssueList } from "@/components/analysis/IssueList";
import { SeoScore } from "@/components/analysis/SeoScore";
import { Suggestions } from "@/components/analysis/Suggestions";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const { mutate, isPending, data } = useAnalyzeSite();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }
    mutate({ url: finalUrl });
  };

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto py-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Check your Meta Tags
            </h1>
            <p className="text-sm sm:text-lg text-slate-500 mb-6 sm:mb-8 px-2">
              Analyze your website's SEO metadata and see exactly how it looks on Google, Facebook, and Twitter.
            </p>
          </motion.div>

          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2 relative shadow-lg rounded-xl bg-white p-2 border border-slate-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="apple.com"
                className="pl-10 h-11 sm:h-12 text-base sm:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-300"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                data-testid="input-url"
              />
            </div>
            <Button 
              size="lg" 
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg font-semibold"
              disabled={isPending}
              data-testid="button-analyze"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                  <span className="sm:hidden">Loading</span>
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
              key={data.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Combined Score Card */}
              <SeoScore issues={data.issues} meta={data.meta} />

              {/* Tabs */}
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="w-full justify-start h-auto p-1 bg-white border rounded-lg sm:rounded-xl mb-4 sm:mb-6 shadow-sm flex-wrap gap-1">
                  <TabsTrigger 
                    value="analysis" 
                    className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-6 rounded-md sm:rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-1.5 sm:gap-2 text-sm sm:text-base"
                    data-testid="tab-analysis"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="suggestions" 
                    className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-6 rounded-md sm:rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5 sm:gap-2 text-sm sm:text-base"
                    data-testid="tab-suggestions"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Suggestions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="raw" 
                    className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-6 rounded-md sm:rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-1.5 sm:gap-2 text-sm sm:text-base"
                    data-testid="tab-raw"
                  >
                    <Code className="w-4 h-4" />
                    <span>Raw</span>
                  </TabsTrigger>
                </TabsList>

                {/* Analysis Tab */}
                <TabsContent value="analysis" className="space-y-6 sm:space-y-8">
                  {/* Issues Section */}
                  <div className="bg-white rounded-xl border p-4 sm:p-6 shadow-sm">
                    <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-slate-900">SEO Audit Report</h3>
                    <IssueList issues={data.issues} />
                  </div>

                  {/* Previews Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                      <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-slate-800">
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4 sm:w-5 sm:h-5" alt="G" />
                        Google Search Preview
                      </h3>
                      <GooglePreview meta={data.meta} url={data.url} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-[#1877F2]">
                        <SiFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
                        Facebook / LinkedIn
                      </h3>
                      <SocialPreview meta={data.meta} url={data.url} />
                    </div>

                    <div className="space-y-3 xl:col-span-2">
                      <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-slate-800">
                        <SiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Twitter / X
                      </h3>
                      <TwitterPreview meta={data.meta} url={data.url} />
                    </div>
                  </div>
                </TabsContent>

                {/* Suggestions Tab */}
                <TabsContent value="suggestions">
                  <Suggestions issues={data.issues} meta={data.meta} />
                </TabsContent>

                {/* Raw Data Tab */}
                <TabsContent value="raw">
                  <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 font-mono text-xs sm:text-sm">Extracted Metadata</span>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm font-mono">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800">
                            <th className="pb-2 pl-2">Meta Tag</th>
                            <th className="pb-2">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {Object.entries(data.meta.raw || {}).map(([key, value]) => (
                            <tr key={key} className="group hover:bg-slate-800/30 transition-colors">
                              <td className="py-2 sm:py-3 pl-2 text-purple-400 font-semibold pr-4 sm:pr-8 align-top whitespace-nowrap">{key}</td>
                              <td className="py-2 sm:py-3 text-slate-300 break-all">{value}</td>
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
          <div className="text-center py-12 sm:py-20 opacity-50">
            <LayoutGrid className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-base sm:text-lg font-medium text-slate-400">Ready to analyze</h3>
            <p className="text-sm text-slate-300">Enter a URL above to get started</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
