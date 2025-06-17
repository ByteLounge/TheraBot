"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { generateReport, type GenerateReportInput } from "@/ai/flows/generate-report";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, FileText, BrainCircuit, Hourglass } from "lucide-react";
import type { Message } from "@/components/chat/ChatMessage";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Spinner } from "../shared/Spinner";

export function GenerateReportButton() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  const fetchChatHistory = async (): Promise<string> => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return "";
    }
    setIsFetchingHistory(true);
    let allMessagesText = "";
    try {
      const sessionsRef = collection(db, `users/${currentUser.uid}/chatSessions`);
      const q = query(sessionsRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const messages: Message[] = data.messages || [];
        messages.forEach(msg => {
          const timestamp = (msg.timestamp as Timestamp)?.toDate() || new Date();
          allMessagesText += `${msg.role === 'user' ? 'User' : 'TheraBot'} (${timestamp.toLocaleString()}): ${msg.content}\n`;
        });
        allMessagesText += "\n---\n\n"; // Separator between sessions
      });
      setIsFetchingHistory(false);
      return allMessagesText;
    } catch (error) {
      console.error("Error fetching chat history for report:", error);
      toast({ title: "Error", description: "Could not fetch chat history.", variant: "destructive" });
      setIsFetchingHistory(false);
      return "";
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReportContent(null);
    const chatHistory = await fetchChatHistory();

    if (!chatHistory) {
      toast({ title: "No History", description: "No chat history found to generate a report.", variant: "default" });
      setIsLoading(false);
      return;
    }

    try {
      const reportInput: GenerateReportInput = { chatHistory };
      const result = await generateReport(reportInput);
      setReportContent(result.report);
      toast({ title: "Report Generated", description: "Your wellness report is ready below." });
    } catch (error: any) {
      console.error("Report generation error", error);
      toast({
        title: "Report Generation Failed",
        description: error.message || "Could not generate report.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportContent) return;
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `TheraBot_Wellness_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Report Downloaded", description: "Check your downloads folder." });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileText className="h-8 w-8" />
        </div>
        <CardTitle className="font-headline text-3xl">Your Wellness Report</CardTitle>
        <CardDescription>
          Generate a summary of insights, possible discussion points, and motivational advice based on your chat history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleGenerateReport} disabled={isLoading || isFetchingHistory} className="w-full">
          {(isLoading || isFetchingHistory) ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {isFetchingHistory ? "Fetching History..." : "Generating Report..."}
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-5 w-5" /> Generate My Report
            </>
          )}
        </Button>

        {reportContent && (
          <Card className="mt-6 border-primary/50">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Generated Report</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted/30">
                <pre className="whitespace-pre-wrap text-sm font-body">{reportContent}</pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={downloadReport} className="w-full">
                <DownloadCloud className="mr-2 h-5 w-5" /> Download Report (.txt)
              </Button>
            </CardFooter>
          </Card>
        )}
        {!reportContent && !isLoading && (
            <Alert className="mt-6">
                <Hourglass className="h-4 w-4" />
                <AlertTitle>No Report Generated Yet</AlertTitle>
                <AlertDescription>
                Click the button above to generate your personalized wellness report.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
       <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
            Reports are generated by AI and should not be considered as professional medical advice.
        </p>
      </CardFooter>
    </Card>
  );
}
