import { Layout } from "@/components/layout/Layout";
import { useAnalysisHistory, useClearHistory } from "@/hooks/use-analysis";
import { format } from "date-fns";
import { Trash2, Search, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function History() {
  const { data: history, isLoading } = useAnalysisHistory();
  const { mutate: clearHistory, isPending: isClearing } = useClearHistory();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Analysis History</h1>
            <p className="text-slate-500 mt-1">Review your past SEO checks.</p>
          </div>
          
          {history && history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your analysis history from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => clearHistory()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isClearing ? "Clearing..." : "Delete All"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              Loading history...
            </div>
          ) : history && history.length > 0 ? (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[40%]">URL</TableHead>
                  <TableHead className="w-[30%]">Page Title</TableHead>
                  <TableHead className="w-[20%]">Analyzed At</TableHead>
                  <TableHead className="w-[10%] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                        {item.url}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 truncate max-w-[300px]" title={item.title || ""}>
                      {item.title || <span className="italic opacity-50">No title</span>}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy • h:mm a") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                       <a href={item.url} target="_blank" rel="noreferrer">
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary">
                           <ExternalLink className="w-4 h-4" />
                         </Button>
                       </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-16 text-center text-slate-400 bg-slate-50/50">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No history yet</h3>
              <p className="text-slate-500">Run your first analysis to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
