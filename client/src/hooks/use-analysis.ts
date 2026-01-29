import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AnalyzeRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useAnalysisHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.list.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyzeSite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const validated = api.analyze.input.parse(data);
      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.analyze.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
           const error = api.analyze.responses[500].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Analysis failed. Please try again.");
      }

      return api.analyze.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.history.clear.path, {
        method: api.history.clear.method,
      });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
      toast({
        title: "History Cleared",
        description: "Your analysis history has been wiped.",
      });
    },
  });
}
